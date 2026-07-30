/* UNIVERSO — uma cena, três escalas, e agora com vida.
 * Missão 26 · Fase 6C, terceira passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A COMPOSIÇÃO ESTÁ APROVADA E NÃO SE MEXE. O que muda nesta passagem ║
 * ║  é o que ela FAZ: em repouso vive, ao toque orienta, ao progresso    ║
 * ║  transforma-se.                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A ESTRUTURA (mantida da segunda passagem): um único contexto 3D, camadas a
 * profundidades diferentes, a câmara em `translateZ`. O Núcleo ao fundo, atrás
 * do plano dos domínios, para que chegar lá seja atravessar o céu.
 *
 *   −1400  poeira distante
 *   −1000  nebulosa
 *    −520  O NÚCLEO
 *    −120  anéis orbitais (R13)
 *       0  territórios
 *    +90   satélites
 *
 * O QUE ESTA PASSAGEM ACRESCENTA:
 *
 *  · MÁQUINA DE ESTADOS (`universe-states.ts`) em vez de flags soltas;
 *  · GRAVIDADE DO CURSOR: as camadas deslocam-se por profundidade em resposta
 *    ao ponteiro. Duas variáveis CSS escritas num rAF — nunca um `setState`
 *    por movimento de rato, que punha o React a re-renderizar 414 elementos
 *    60 vezes por segundo para mover o fundo seis píxeis;
 *  · ASSINATURA POR DOMÍNIO: cada um desperta à sua maneira, e a maneira diz
 *    o que o domínio é. Ofício alinha, Saber ramifica, Corpo pulsa, Mente
 *    converge, Vínculos liga, Disciplina sincroniza;
 *  · EVENTO DE PROGRESSO COM TRAJETO: nasce uma partícula fora do campo,
 *    atravessa-o, entra no domínio certo, a estrela acende, o domínio pulsa,
 *    a energia segue para o Núcleo, e fica um rasto que se apaga devagar;
 *  · PAUSA: fora da zona ativa, com a tab escondida, ou em reduced motion, o
 *    ambiente para. Um mundo que continua a gastar bateria numa tab que
 *    ninguém está a ver não é "vivo", é uma fuga.
 */

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { readScene, type SceneRead } from './universe-read';
import Nucleus, { type CoreState } from './Nucleus';
import DomainSignature from './DomainSignature';
import CoreInterior from './CoreInterior';
import { readCore, type CoreRead } from './core-read';
import { readEvidence, type EvidenceRead } from './evidence-read';
import {
  type UniverseState, type UniverseCtx, canGo, scaleOf, litDomain,
} from './universe-states';
import { useFreeCam, type FreeCamAPI } from './useFreeCam';
import { subscribeSystemEvents } from '../events/systemEvents';
import { AM } from '../../state/config.js';
import './universe-scene.css';

const R_X = 380;
const R_Y = 175;
const CY = -30;
const CX_WIDE = 150;
const R_SX = 600;
const R_SY = 276;

/* ── O REDUCER ─────────────────────────────────────────────────────────
 * Transições rejeitadas são ignoradas em silêncio, e isso é deliberado: uma
 * transição ilegal é um bug de quem chamou, não um estado a mostrar ao
 * Operador. Em desenvolvimento fica um aviso na consola.
 */
type Action =
  | { t: 'hover'; domain: string | null }
  | { t: 'focus'; domain: string }
  | { t: 'core' }
  | { t: 'arrive' }
  | { t: 'back' }
  | { t: 'settled' }
  | { t: 'event'; domain: string; color: string; kind: string }
  | { t: 'eventEnd' }
  | { t: 'evidence' }
  | { t: 'rank'; texto: string; cor: string }
  | { t: 'rankEnd' };

interface Model extends UniverseCtx {
  /** Para onde voltar quando um evento acaba, ou quando se recua. */
  prev: UniverseState;
  prevDomain: string | null;
  /** "E → D". Vem do evento; a cena não o calcula, para não haver duas fontes
   *  para o mesmo facto. */
  rank: { texto: string; cor: string } | null;
}

function go(m: Model, state: UniverseState, patch: Partial<Model> = {}): Model {
  if (!canGo(m.state, state)) {
    if (import.meta.env.DEV) console.warn('[universo] transicao recusada:', m.state, '->', state);
    return m;
  }
  return { ...m, prev: m.state, prevDomain: m.domain, state, ...patch };
}

function reducer(m: Model, a: Action): Model {
  switch (a.t) {
    case 'hover':
      // O hover não interrompe uma viagem nem uma chegada. Passar o rato por
      // cima de um domínio enquanto se está dentro do Núcleo não pode
      // teletransportar ninguém para fora.
      if (m.state !== 'OVERVIEW' && m.state !== 'DOMAIN_HOVER') return m;
      if (!a.domain) return m.state === 'DOMAIN_HOVER' ? go(m, 'OVERVIEW', { domain: null }) : m;
      return go(m, 'DOMAIN_HOVER', { domain: a.domain });
    case 'focus':
      return go(m, 'DOMAIN_FOCUS', { domain: a.domain });
    case 'evidence':
      return go(m, 'EVIDENCE_FOCUS');
    case 'core':
      return go(m, 'CORE_APPROACH');
    case 'arrive':
      return go(m, 'CORE_INSIDE');
    case 'back': {
      // Recuar é sempre um passo, nunca um salto para o princípio.
      // Da evidência recua-se para o domínio, e isso é imediato: não houve
      // viagem para desfazer, porque a evidência não mudou a escala.
      if (m.state === 'EVIDENCE_FOCUS') return { ...m, prev: m.state, state: 'DOMAIN_FOCUS' };
      const toDomain = (m.state === 'CORE_INSIDE' || m.state === 'CORE_APPROACH') && m.domain;
      return go(m, 'RETURNING', { domain: toDomain ? m.domain : null });
    }
    case 'settled': {
      if (m.state !== 'RETURNING') return m;
      return { ...m, prev: m.state, state: m.domain ? 'DOMAIN_FOCUS' : 'OVERVIEW' };
    }
    case 'event':
      return go(m, 'PROGRESS_EVENT', { event: { domain: a.domain, color: a.color, kind: a.kind } });
    case 'rank':
      // Um evento de rank cancela um de progresso a meio, e é correto: se os
      // dois chegam juntos — que é o caso normal, porque é a missão que faz
      // subir o rank — o que interessa é o maior.
      return go(m, 'RANK_EVENT', { rank: { texto: a.texto, cor: a.cor }, event: null, domain: null });
    case 'rankEnd':
      if (m.state !== 'RANK_EVENT') return m;
      return { ...m, prev: m.state, state: 'OVERVIEW', rank: null };
    case 'eventEnd': {
      if (m.state !== 'PROGRESS_EVENT') return m;
      // Volta exatamente ao sítio onde o Operador estava. A evidência
      // aconteceu-lhe; não o levou a lado nenhum.
      const back = m.prev === 'PROGRESS_EVENT' ? 'OVERVIEW' : m.prev;
      return { ...m, state: back, domain: m.prevDomain, event: null };
    }
    default:
      return m;
  }
}

const INIT: Model = { state: 'OVERVIEW', domain: null, event: null, prev: 'OVERVIEW', prevDomain: null, rank: null };

function useWide(): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1101px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on); on();
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

/** As quatro fases ditas por extenso. O visual comunica de relance; isto é o
 *  equivalente textual, e existe porque matéria não é uma legenda. */
const PROTO_LABEL: Record<string, string> = {
  dust: 'ainda sem formação em curso',
  proto: 'protoestrela difusa',
  coalescing: 'a condensar',
  unstable: 'quase formada',
};

export default function UniverseScene({ S }: { S: Record<string, any> }) {
  const scene: SceneRead | null = useMemo(() => readScene(S), [S]);
  const core: CoreRead | null = useMemo(() => readCore(S), [S]);
  const [m, dispatch] = useReducer(reducer, INIT);
  const evidence: EvidenceRead | null = useMemo(
    () => readEvidence(S, m.state === 'EVIDENCE_FOCUS' ? m.domain : null),
    [S, m.state, m.domain],
  );
  const wide = useWide();
  const rootRef = useRef<HTMLDivElement>(null);

  const CX = wide ? CX_WIDE : 0;
  const CY_ = wide ? CY : 0;
  const kx = wide ? 1 : 0.342;
  const ky = wide ? 1 : 0.674;

  /* ── VIVO OU EM PAUSA ────────────────────────────────────────────────
   * O mundo existe mesmo quando o Operador para — mas "parar" é ele desviar o
   * olhar, não fechar a tab. Duas razões verificáveis para pausar: a zona não
   * está ativa, ou a tab está escondida. (A terceira, reduced motion, é
   * tratada em CSS, onde pertence.) */
  const [live, setLive] = useState(true);
  /* Enquanto o céu está vivo, ele é o palco. O ARISE global lê esta marca e
     cala-se — ver `cineArise` em lib/fx.js. Uma cerimónia de cada vez. */
  useEffect(() => {
    const el = document.documentElement;
    if (live) el.dataset.skyLive = 'true'; else delete el.dataset.skyLive;
    return () => { delete el.dataset.skyLive; };
  }, [live]);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const zone = el.closest('.sys-zone') as HTMLElement | null;
    const check = () => {
      const active = !zone || zone.dataset.active !== 'false';
      setLive(active && !document.hidden);
    };
    check();
    document.addEventListener('visibilitychange', check);
    let obs: MutationObserver | null = null;
    if (zone) {
      obs = new MutationObserver(check);
      obs.observe(zone, { attributes: true, attributeFilter: ['data-active'] });
    }
    return () => { document.removeEventListener('visibilitychange', check); obs?.disconnect(); };
  }, []);

  /* ── GRAVIDADE LOCAL ─────────────────────────────────────────────────
   * O Universo sabe para onde estás a olhar. Duas custom properties escritas
   * num rAF; o React não participa.
   *
   * O deslocamento é por PROFUNDIDADE: o que está longe quase não se mexe, o
   * que está perto atravessa. É a mesma física do parallax da câmara, e é isso
   * que faz o gesto parecer espaço em vez de um efeito de rato. A aproximação
   * exponencial dá inércia — o campo não persegue o cursor, é atraído por ele. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !live) return;
    let raf = 0; let px = 0; let py = 0; let tx = 0; let ty = 0;
    const write = () => {
      raf = 0;
      px += (tx - px) * 0.09; py += (ty - py) * 0.09;
      el.style.setProperty('--px', px.toFixed(4));
      el.style.setProperty('--py', py.toFixed(4));
      if (Math.abs(tx - px) > 0.0008 || Math.abs(ty - py) > 0.0008) raf = requestAnimationFrame(write);
    };
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      tx = (e.clientX - b.left) / b.width - 0.5;
      ty = (e.clientY - b.top) / b.height - 0.5;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(write); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [live]);

  /* ── EVIDÊNCIA REAL ──────────────────────────────────────────────────
   * A fila só publica depois de a escrita passar, por desenho dela. Aqui só se
   * escolhe o que é um acontecimento do céu: uma missão, um pilar, um extra ou
   * uma rotina que tenham domínio. Um level-up sem domínio não acende
   * território nenhum, e inventar um seria mentir. */
  useEffect(() => {
    /* ── PORQUE SE VARRE A FILA INTEIRA E NÃO SÓ A CABEÇA ──
     * A primeira montagem lia `q[0]`. Parecia bastar e não bastava: a fila é
     * do ANÚNCIO e ordena causa antes de consequência, por isso a missão fica
     * à frente e o rank fica atrás dela. Como a missão segura o lugar 7
     * segundos, o rank só chegava à cabeça 7 segundos depois de ter
     * acontecido — e, medido, nem lá chegava dentro da janela do teste.
     *
     * O Universo não é o anúncio. Reagir ao mundo e anunciar ao Operador são
     * duas coisas diferentes, e a segunda não pode atrasar a primeira.
     *
     * O `seen` é limitado: sem limite, uma sessão longa acumulava uma chave
     * por facto para sempre. 60 chaves cobrem qualquer rajada plausível. */
    const seen = new Set<string>();
    const marcar = (k: string) => {
      seen.add(k);
      if (seen.size > 60) seen.delete(seen.values().next().value as string);
    };
    return subscribeSystemEvents((q) => {
      // O RANK primeiro, esteja onde estiver na fila. Quando chegam juntos — e
      // chegam, porque é a missão que faz subir o rank — quem manda é o
      // acontecimento maior.
      const rk = q.find((e) => e.kind === 'rank' && !seen.has(e.dedupe));
      if (rk) {
        marcar(rk.dedupe);
        dispatch({ t: 'rank', texto: rk.subject, cor: rk.color || '#fbbf24' });
        return;
      }
      const ev = q.find(
        (e) => !seen.has(e.dedupe)
          && (e.kind === 'mission' || e.kind === 'pillar' || e.kind === 'habit')
          && e.domain && AM[e.domain],
      );
      if (!ev) return;
      marcar(ev.dedupe);
      dispatch({ t: 'event', domain: ev.domain!, color: AM[ev.domain!].color, kind: ev.kind });
    });
  }, []);

  // O evento tem fim visível: é um arco, não um ciclo (gramática 3). 3,4s é a
  // soma dos tempos — nasce, atravessa, entra, acende, pulsa, converge, assenta.
  const evDomain = m.event?.domain;
  useEffect(() => {
    if (m.state !== 'PROGRESS_EVENT') return;
    const t = window.setTimeout(() => dispatch({ t: 'eventEnd' }), 3400);
    return () => window.clearTimeout(t);
  }, [m.state, evDomain]);

  /* A cerimónia de rank. 4,2s: 1,4s para a câmara recuar, 1,2s de contração e
     silêncio, 1,6s de expansão e assentamento. É o evento mais longo do
     produto, e é o único que merece sê-lo. */
  useEffect(() => {
    if (m.state !== 'RANK_EVENT') return;
    const t = window.setTimeout(() => dispatch({ t: 'rankEnd' }), 4200);
    return () => window.clearTimeout(t);
  }, [m.state]);

  // A viagem ao Núcleo tem duas fases. Separá-las faz com que a leitura só
  // apareça quando ele já lá está — e é o que dá o instante de silêncio antes
  // da chegada.
  useEffect(() => {
    if (m.state !== 'CORE_APPROACH') return;
    const t = window.setTimeout(() => dispatch({ t: 'arrive' }), 1450);
    return () => window.clearTimeout(t);
  }, [m.state]);

  useEffect(() => {
    if (m.state !== 'RETURNING') return;
    const t = window.setTimeout(() => dispatch({ t: 'settled' }), 1450);
    return () => window.clearTimeout(t);
  }, [m.state]);

  /* ── CÂMARA MANUAL ──
   * O gesto não decide destinos: pergunta "mais fundo" ou "recua", e quem
   * resolve isso para um estado concreto é o reducer, que é quem sabe onde
   * estamos. Uma roda que soubesse escolher domínios seria uma segunda
   * máquina de estados escondida num handler.
   *
   * Aprofundar sem domínio escolhido leva ao Núcleo: é o único destino que
   * não exige escolher nada, e escolher um domínio por ele seria o Sistema a
   * decidir onde ele quer ir. */
  const freeApi = useRef<FreeCamAPI | null>(null);
  const stateRef = useRef(m.state);
  stateRef.current = m.state;
  const domainRef = useRef(m.domain);
  domainRef.current = m.domain;
  useFreeCam(rootRef, freeApi, {
    enabled: live,
    wide,
    onDeeper: () => {
      const st = stateRef.current;
      if (st === 'DOMAIN_FOCUS' || st === 'OVERVIEW' || st === 'DOMAIN_HOVER') dispatch({ t: 'core' });
    },
    onBack: () => dispatch({ t: 'back' }),
  });
  // Cada mudança de estado zera o desvio: o estado novo tem o seu próprio
  // enquadramento, e herdar o desvio do anterior punha o Operador a chegar
  // torto a todo o lado.
  useEffect(() => { freeApi.current?.reset(); }, [m.state, m.domain]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Escape CENTRA primeiro e só recua depois. Sem isto, quem arrastasse
      // para um canto não tinha forma de voltar ao meio sem mudar de escala —
      // e mudar de escala para corrigir o enquadramento é perder o sítio.
      if (freeApi.current?.deslocado()) { freeApi.current.reset(); return; }
      dispatch({ t: 'back' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!scene) return null;

  const scale = scaleOf(m.state, m.prev);
  const lit = litDomain(m);
  const selT = m.domain ? scene.territories.find((t) => t.id === m.domain) : null;
  const litT = lit ? scene.territories.find((t) => t.id === lit) : null;
  const evT = m.event ? scene.territories.find((t) => t.id === m.event!.domain) : null;

  const posOf = (angle: number) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: Math.cos(a) * R_X * kx + CX, y: Math.sin(a) * R_Y * ky + CY_ };
  };

  /* A câmara. Uma posição por escala, e o hover NÃO a move: despertar não é
     viajar, e um campo que se desloca ao passar o rato é enjoativo. */
  const cam = (() => {
    if (scale === 'core') return { x: -CX, y: -CY_, z: 780 };
    if (scale === 'domain' && selT) {
      const p = posOf(selT.angle);
      return { x: -p.x, y: -p.y, z: 380 };
    }
    return { x: 0, y: 0, z: 0 };
  })();

  const coreState: CoreState =
    m.state === 'RANK_EVENT' ? 'RANK_UP'
      : m.state === 'PROGRESS_EVENT' ? 'ABSORBING'
        : lit ? 'ATTUNEMENT' : 'REST';

  const showSky = m.state === 'OVERVIEW' || m.state === 'RETURNING'
    || (m.state === 'PROGRESS_EVENT' && scale === 'system' && !m.prevDomain);
  const showDomain = (m.state === 'DOMAIN_FOCUS' || (m.state === 'PROGRESS_EVENT' && scale === 'domain')) && selT;
  const showCore = m.state === 'CORE_APPROACH' || m.state === 'CORE_INSIDE'
    || (m.state === 'PROGRESS_EVENT' && scale === 'core');

  return (
    <div
      className="us"
      ref={rootRef}
      data-state={m.state}
      data-scale={scale}
      data-live={live ? 'true' : 'false'}
    >
      <div
        className="us-scene"
        style={{
          ['--cam-x' as string]: cam.x + 'px',
          ['--cam-y' as string]: cam.y + 'px',
          ['--cam-z' as string]: cam.z + 'px',
        }}
      >
        {/* Três populações de poeira, cada uma no seu elemento.
            NÃO é um detalhe de arrumação: um `@keyframes` que anima
            `transform` SUBSTITUI o transform base do elemento — incluindo o
            `translateZ(-1400px)` que lhe dá profundidade e o deslocamento do
            cursor. Estava medido: a camada aparecia como `matrix(...)` 2D,
            sem Z nenhum, e a gravidade do cursor não a movia. A camada-mãe
            fica com a profundidade; os filhos derivam. */}
        <div className="us-layer us-dust" data-ambient aria-hidden="true">
          <span className="us-dust-a" /><span className="us-dust-b" /><span className="us-dust-c" />
        </div>
        <div className="us-layer us-neb" data-ambient="dominant" aria-hidden="true" />

        <div className="us-layer us-core-layer" style={{ ['--cy' as string]: CY_ + 'px', ['--cx' as string]: CX + 'px' }}>
          <Nucleus
            mass={scene.coreMass}
            color={scene.rank.color}
            focus={scale === 'core' ? 1 : scale === 'domain' ? 0.45 : 0.18}
            state={coreState}
            attune={litT?.color ?? null}
            fromAngle={litT ? litT.angle : 0}
            size={340}
          />
          {/* ── A ESCALA 4 ──
              Só existe quando se CHEGOU. Em CORE_APPROACH ainda não: a viagem
              tem de ter um instante em que ainda não se sabe o que lá está,
              senão a chegada não é uma chegada. */}
          {core && m.state === 'CORE_INSIDE' && <CoreInterior core={core} />}
        </div>

        {/* Anéis inclinados — ORIGEM R13. A profundidade daquela referência não
            vem de sombra: vem de anéis vistos de um ângulo. Rejeitado dela: o
            ciano, os rótulos de HUD de filme e a marca de água.
            Respiram em 52s — quase impercetível, e é para ser. */}
        <div className="us-layer us-rings" aria-hidden="true"
             style={{ ['--cy' as string]: CY_ + 'px', ['--cx' as string]: CX + 'px' }}>
          <span /><span /><span />
        </div>

        <div className="us-layer us-terr-layer">
          {scene.territories.map((t) => {
            const p = posOf(t.angle);
            const isLit = lit === t.id;
            const isSel = m.domain === t.id;
            const fed = m.event?.domain === t.id;
            const proto = t.stars[t.stars.length - 1];
            return (
              <div
                key={t.id}
                className="us-terr"
                data-lit={isLit ? 'true' : 'false'}
                data-sel={isSel ? 'true' : 'false'}
                data-fed={fed ? 'true' : 'false'}
                data-dim={lit && !isLit ? 'true' : 'false'}
                data-sig={t.id}
                style={{
                  ['--tx' as string]: p.x + 'px',
                  ['--ty' as string]: p.y + 'px',
                  ['--dom' as string]: t.color,
                  ['--rot' as string]: (Math.atan2(p.y - CY_, p.x - CX) * 180) / Math.PI + 180 + 'deg',
                }}
                onPointerEnter={() => dispatch({ t: 'hover', domain: t.id })}
                onPointerLeave={() => dispatch({ t: 'hover', domain: null })}
              >
                <span className="us-field" style={{ ['--field' as string]: 90 + Math.min(120, t.level * 6) + 'px' }} />

                {/* A ASSINATURA. Cada domínio desperta à sua maneira, e a
                    maneira é o que o domínio é. Só é desenhada quando acesa —
                    seis assinaturas a correr sempre seriam seis ruídos. */}
                {isLit && <DomainSignature id={t.id} color={t.color} level={t.level} />}

                <span className="us-stars">
                  {t.stars.map((st) => (
                    <span
                      key={st.id}
                      className="us-star"
                      data-forming={st.forming ? 'true' : 'false'}
                      data-stage={st.stage ?? ''}
                      data-tw={st.tw ? 'true' : 'false'}
                      style={{
                        left: `calc(50% + ${st.x * (60 + t.level * 3)}px)`,
                        top: `calc(50% + ${st.y * (60 + t.level * 3)}px)`,
                        ['--s' as string]: st.size.toFixed(2) + 'px',
                        ['--l' as string]: st.light.toFixed(2),
                        ['--d' as string]: (st.z * 5.4).toFixed(2) + 's',
                        ['--dur' as string]: (4 + st.z * 5).toFixed(1) + 's',
                      }}
                      title={st.forming
                        ? `${t.name} — nível ${st.level} a formar-se (${Math.round(st.light * 100)}%)`
                        : `${t.name} — nível ${st.level}`}
                    />
                  ))}
                </span>

                {fed && <span className="us-flow" aria-hidden="true" />}

                <button
                  type="button"
                  className="us-terr-hit"
                  onFocus={() => dispatch({ t: 'hover', domain: t.id })}
                  onBlur={() => dispatch({ t: 'hover', domain: null })}
                  onClick={() => (isSel && scale === 'domain' ? dispatch({ t: 'core' }) : dispatch({ t: 'focus', domain: t.id }))}
                  aria-label={`${t.name}, nível ${t.level}, ${t.proven} ${t.proven === 1 ? 'estrela provada' : 'estrelas provadas'}, ${t.xp} de ${t.xpNeed} XP para a próxima, ${PROTO_LABEL[proto?.stage ?? 'dust']}`}
                >
                  <span className="us-terr-n">{t.name}</span>
                  <span className="us-terr-l">Nv {t.level}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* ── A PARTÍCULA DE EVIDÊNCIA ──
            Nasce FORA do campo e atravessa-o até ao domínio. É esse trajeto
            que separa "um número mudou" de "aconteceu alguma coisa": sem ele a
            estrela aparecia do nada, e nada nasce do nada. O rasto fica atrás
            dela e apaga-se — memória curta do caminho, não uma teia. */}
        {evT && (() => {
          const p = posOf(evT.angle);
          const h = Math.hypot(p.x, p.y) || 1;
          return (
            <div
              className="us-layer us-evidence"
              aria-hidden="true"
              style={{
                ['--ex' as string]: p.x + 'px',
                ['--ey' as string]: p.y + 'px',
                /* 420 e não 780. Foi medido numa folha de contacto: com 780, a
                   partícula nascia 834px acima do centro num quadro de 558 de
                   altura — passava a maior parte do voo fora do enquadramento
                   e o trajeto, que é a razão de ela existir, não se via. */
                ['--sx' as string]: (p.x + (p.x / h) * 420) + 'px',
                ['--sy' as string]: (p.y + (p.y / h) * 420) + 'px',
                ['--rot' as string]: (Math.atan2(p.y, p.x) * 180) / Math.PI + 'deg',
                ['--dom' as string]: m.event!.color,
              }}
            >
              <span className="us-part" />
              <span className="us-trail" />
            </div>
          );
        })()}

        <div className="us-layer us-sats" aria-hidden="true">
          {scene.satellites.map((sat) => {
            const a = ((sat.angle - 90) * Math.PI) / 180;
            return (
              <span
                key={sat.id}
                className="us-sat"
                data-on={sat.on ? 'true' : 'false'}
                style={{
                  ['--tx' as string]: Math.cos(a) * R_SX * kx + CX + 'px',
                  ['--ty' as string]: Math.sin(a) * R_SY * ky + CY_ + 'px',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── A LEITURA ──
          Recolhe-se durante o hover: enquanto exploras, o texto sai da frente
          e fica só o essencial. */}
      <div className="us-hud" data-compact={m.state === 'DOMAIN_HOVER' ? 'true' : 'false'} aria-live="polite">
        {showSky && (
          <>
            <p className="us-hud-t">O teu céu</p>
            <p className="us-hud-s">
              Cada estrela é um nível provado num domínio. A que está a formar-se é o XP
              do nível em curso — a única coisa aqui que pode recuar. Passa o cursor por
              um domínio para o despertar; toca para te aproximares.
            </p>
            <dl className="rf-debrief">
              <div><dt>Estrelas</dt><dd>{scene.totalStars}</dd></div>
              <div><dt>Rank</dt><dd style={{ color: scene.rank.color }}>{scene.rank.letter}</dd></div>
              <div><dt>Nível global</dt><dd>{scene.level}</dd></div>
            </dl>
            {/* Um gesto que não se anuncia não existe: ninguém descobre por
                acaso que se pode arrastar um céu. */}
            <p className="us-hint">
              Arrasta para olhar{wide ? ' · Ctrl+roda aprofunda' : ' · pinça aprofunda'} · Escape centra
            </p>
          </>
        )}

        {/* HOVER: leitura curta. Não é a ficha do domínio — é o que chega para
            decidir se vale a pena entrar. */}
        {m.state === 'DOMAIN_HOVER' && litT && (
          <>
            <p className="us-hud-t" style={{ color: litT.color }}>{litT.name}</p>
            <p className="us-hud-s us-hud-brief">
              {litT.proven} {litT.proven === 1 ? 'estrela' : 'estrelas'}
              {' · '}{litT.xp}/{litT.xpNeed} XP
              {' · '}{PROTO_LABEL[litT.stars[litT.stars.length - 1]?.stage ?? 'dust']}
            </p>
          </>
        )}

        {showDomain && selT && (
          <>
            <p className="us-hud-t" style={{ color: selT.color }}>{selT.name}</p>
            <p className="us-hud-s">{selT.sub}</p>
            <dl className="rf-debrief">
              <div><dt>Estrelas</dt><dd>{selT.proven}</dd></div>
              <div><dt>A formar-se</dt><dd>{selT.xp} / {selT.xpNeed} XP</dd></div>
              <div><dt>Rank</dt><dd style={{ color: selT.rankColor }}>{selT.rankLetter}</dd></div>
            </dl>
            <div className="us-acts">
              {/* A escala 3. Fica ao lado do Núcleo e não por baixo: são dois
                  caminhos a partir do mesmo sítio, não um principal e um
                  secundário. */}
              <button className="mini" type="button" onClick={() => dispatch({ t: 'evidence' })}>
                O que alimenta isto
              </button>
              <button className="cc-act-go" type="button" onClick={() => dispatch({ t: 'core' })}>
                Continuar até ao Núcleo
              </button>
              <button className="mini" type="button" onClick={() => dispatch({ t: 'back' })}>Recuar</button>
            </div>
          </>
        )}

        {/* ── A ESCALA 3 ──
            Uma LEITURA sobre o domínio onde já estamos, não outro sítio. A
            câmara não se mexe de propósito: aproximar mais não revelaria nada,
            porque o que há para revelar é texto, e o texto vive no instrumento
            e não no céu. */}
        {m.state === 'EVIDENCE_FOCUS' && evidence && (
          <>
            <p className="us-hud-t" style={{ color: evidence.color }}>{evidence.name}</p>
            <p className="us-hud-brief">
              Nível {evidence.level} a formar-se · {evidence.xp}/{evidence.xpNeed} XP
            </p>

            {evidence.linhas.length > 0 ? (
              <ul className="us-ev">
                {evidence.linhas.map((l, i) => (
                  <li key={i}>
                    <span className="us-ev-d">{l.data}</span>
                    <span className="us-ev-t">{l.texto}</span>
                    <span className="us-ev-g">{l.ganho > 0 ? '+' + l.ganho : '—'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="us-hud-s">
                Nada no registo recente pertence a {evidence.name}. Não quer dizer que não
                tenhas feito nada — quer dizer que o que fizeste nas últimas catorze entradas
                foi de outros domínios.
              </p>
            )}

            {/* ── O QUE ESTA VISTA NÃO SABE, DITO POR EXTENSO ──
                Sem isto, a soma da janela e o XP do nível parecem a mesma coisa
                e não são; e as entradas anteriores ao campo de domínio
                desapareciam sem ninguém saber que existiram. */}
            <p className="us-ev-nota">
              {evidence.linhas.length > 0
                ? (evidence.linhas.length === 1
                    ? `Esta linha soma ${evidence.somaJanela} XP. `
                    : `Estas ${evidence.linhas.length} linhas somam ${evidence.somaJanela} XP. `)
                : ''}
              {`O registo guarda ${evidence.totalRegisto} entradas`}
              {evidence.semAtribuicao > 0
                ? `, e ${evidence.semAtribuicao} não têm domínio — são anteriores ao campo e não são atribuíveis a ninguém. `
                : '. '}
              Que evidência fez cada estrela já provada não é sabível: os níveis vêm de XP
              acumulado ao longo de meses e esta janela tem catorze linhas.
            </p>

            <div className="us-acts">
              <button className="mini" type="button" onClick={() => dispatch({ t: 'back' })}>Recuar</button>
            </div>
          </>
        )}

        {showCore && core && (
          <>
            <p className="us-hud-t">O Núcleo</p>
            {/* A frase mudou porque a vista mudou. Antes dizia "tudo converge
                aqui" e não mostrava nada; agora mostra a conta, e a leitura
                tem de dizer que É uma conta — senão os seis veios voltam a ser
                uma imagem bonita. */}
            <p className="us-hud-s">
              {core.somaGanhos === 0
                ? `Não é uma metáfora: os seis domínios estão no ponto de partida, por isso o Núcleo tem a massa mínima e o teu nível global é ${core.level}. Os veios ganham espessura quando um domínio sobe.`
                : `Não é uma metáfora: ${core.somaGanhos} ${core.somaGanhos === 1 ? 'nível ganho' : 'níveis ganhos'} acima do ponto de partida, mais um de base, dão o teu nível global de ${core.level}. Cada veio é o que um domínio entregou, à escala.`}
            </p>

            <dl className="rf-debrief">
              <div><dt>Rank</dt><dd style={{ color: core.band.color }}>{core.band.letter}</dd></div>
              <div><dt>Nível global</dt><dd>{core.level}</dd></div>
              <div><dt>XP acumulado</dt><dd>{core.totalXP.toLocaleString('pt-PT')}</dd></div>
            </dl>

            {/* A banda de rank. Quando não há seguinte, diz-se — não se desenha
                uma barra contra um limite que é um sentinela de código. */}
            <p className="us-hud-brief">
              {core.band.next
                ? `Faltam ${core.band.next.falta} ${core.band.next.falta === 1 ? 'nível' : 'níveis'} para o rank ${core.band.next.letter}.`
                : 'Último rank definido. Não existe banda seguinte no motor — o Núcleo continua a crescer, o rank não.'}
            </p>

            {/* O crescimento, se houver série datada. Sem dois pontos não há
                tendência, e desenhar uma seria inventá-la. */}
            {core.growth && (
              <p className="us-hud-brief">
                +{core.growth.ganho.toLocaleString('pt-PT')} XP desde {core.growth.desde},
                em {core.growth.pts.length} registos datados.
              </p>
            )}

            <p className="us-hud-brief">
              {core.shadows.n > 0
                ? `${core.shadows.n} ${core.shadows.n === 1 ? 'sombra erguida' : 'sombras erguidas'}${core.shadows.forte ? ` · a mais forte é ${core.shadows.forte.name} (Nv ${core.shadows.forte.lvl})` : ''}.`
                : 'Nenhuma sombra erguida ainda — cada missão concluída deixa uma aqui.'}
              {' '}
              {core.titulos.provados} de {core.titulos.total} títulos provados.
            </p>

            <div className="us-acts">
              <button className="mini" type="button" onClick={() => dispatch({ t: 'back' })}>Recuar</button>
            </div>
          </>
        )}

        {m.event && (
          <p className="us-pulse-note">
            {AM[m.event.domain]?.name} recebeu evidência nova. A energia está a convergir.
          </p>
        )}

        {/* O rank substitui a leitura toda enquanto dura. Não é um aviso ao
            lado do que estava — é o que está a acontecer. */}
        {m.rank && (
          <p className="us-rank-note" style={{ ['--rk' as string]: m.rank.cor }}>
            <span className="us-rank-k">{m.rank.texto}</span>
            <span className="us-rank-s">O sistema inteiro mudou de escala. A câmara recuou para o mostrar.</span>
          </p>
        )}
      </div>
    </div>
  );
}
