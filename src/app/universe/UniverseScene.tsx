/* UNIVERSO — uma cena, três escalas.
 * Missão 26 · Fase 6C, segunda passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NÃO SÃO TRÊS ECRÃS COM ROUPAGEM DIFERENTE. É A MESMA CENA, e o que  ║
 * ║  muda é onde está a câmara.                                          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Tudo vive num único contexto 3D (`perspective` + `preserve-3d`), com as
 * camadas a profundidades diferentes. Aproximar é `translateZ` na cena — um
 * dolly de verdade. Por isso as camadas ganham parallax sozinhas: a divisão
 * perspética faz o fundo mover-se devagar e o que está perto passar de lado.
 * Não há troca de componentes, não há fade entre vistas, não há remontagem.
 *
 * A ORDEM DE PROFUNDIDADE, e é ela que faz o Núcleo ser um destino:
 *
 *   −1400  poeira distante        ambiente, quase imóvel
 *   −1000  nebulosa
 *    −520  O NÚCLEO               fundo, pequeno, por descobrir
 *    −120  anéis orbitais         inclinados (R13) — dão o chão da cena
 *       0  territórios            os seis domínios, com as suas estrelas
 *    +90   satélites              títulos e conquistas, à frente
 *
 * O Núcleo está ATRÁS do plano dos territórios de propósito. Ao viajar para
 * ele, a câmara ATRAVESSA esse plano — os territórios passam de lado e para
 * fora do enquadramento, e o que estava longe cresce. É isso que faz a
 * chegada parecer uma chegada em vez de um zoom sobre um cartão.
 *
 * REDUCED MOTION: a câmara continua a mudar de posição, sem transição. A
 * informação é ONDE estás, não o trajeto — e ninguém perde a exploração por
 * pedir menos movimento.
 */

import { useEffect, useRef, useState } from 'react';
import { readScene, type SceneRead } from './universe-read';
import Nucleus from './Nucleus';
import { subscribeSystemEvents } from '../events/systemEvents';
import { AM } from '../../state/config.js';
import './universe-scene.css';

type Cam = 'overview' | 'domain' | 'core';

/* O plano dos domínios é uma ELIPSE, não um círculo.
 *
 * Duas razões, e a segunda é a que importa. A primeira: a cena é larga e
 * baixa (1338×558 no desktop), e um círculo de raio 300 punha dois dos seis
 * domínios fora do enquadramento — foi medido. A segunda: os anéis estão
 * inclinados, e um conjunto de corpos disposto em círculo perfeito sobre um
 * plano inclinado contradiz o plano. A proporção 2:1 é exatamente cos(60°),
 * a mesma inclinação dos anéis — os domínios ficam SOBRE o plano em vez de
 * flutuarem à frente dele.
 *
 * O centro está acima do meio () porque o HUD ocupa a faixa de baixo. A
 * primeira montagem tinha o texto por cima do rótulo Vínculos.
 */
const R_X = 380;
const R_Y = 175;
const CY = -30;
/* O céu está descentrado para a direita porque o HUD ocupa a coluna esquerda.
 * A montagem anterior punha o texto POR CIMA do céu com um véu por baixo, e o
 * véu engolia os dois domínios de baixo — Mente e Vínculos ficavam a cinzento
 * enquanto os outros quatro estavam acesos. Um véu que apaga dados não é
 * composição, é uma avaria.
 *
 * Instrumento ao lado do visor, que é a relação de R26. Em ecrã estreito o
 * deslocamento é zero e o HUD vai para baixo — ver a media query. */
const CX_WIDE = 150;

/** Verdadeiro quando a coluna lateral do HUD cabe. Uma só fonte de verdade
 *  para o deslocamento: em JS, porque a câmara também precisa dele e um valor
 *  em CSS obrigava a duplicá-lo em dois sítios que se desalinhariam. O ponto
 *  de corte é o mesmo do `@media` que arruma o HUD para baixo. */
function useWide(): boolean {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1101px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    on();
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}
/** Órbita externa dos satélites, na mesma proporção. */
const R_SX = 600;
const R_SY = 276;

export default function UniverseScene({ S }: { S: Record<string, any> }) {
  const scene: SceneRead | null = readScene(S);
  const [cam, setCam] = useState<Cam>('overview');
  const [sel, setSel] = useState<string | null>(null);
  const [pulse, setPulse] = useState<{ domain: string; color: string; at: number } | null>(null);
  const wide = useWide();
  const CX = wide ? CX_WIDE : 0;
  // Em ecrã estreito o HUD ocupa a faixa de baixo, por isso o céu sobe mais.
  const CY_ = wide ? CY : 0;
  /* Fator de escala do plano, e são DOIS porque o problema é diferente em cada
     eixo. Num quadro de 342×439, um raio horizontal de 380 punha quatro dos
     seis domínios fora do enquadramento; encolher os dois eixos igualmente
     resolvia isso e criava outro — os rótulos passavam a sobrepor-se, porque
     a elipse ficava baixa demais para os separar. Ambos foram medidos.
     Horizontal aperta, vertical abre: o quadro estreito é alto.

     `CY_` volta a zero no estreito porque quem faz a cena subir passa a ser o
     `bottom` da própria caixa transformada (ver o CSS) — subtrair aqui outra
     vez levantava o céu duas vezes e o rótulo de cima saía pelo topo. */
  const kx = wide ? 1 : 0.30;
  const ky = wide ? 1 : 0.74;
  const rootRef = useRef<HTMLDivElement>(null);

  /* ── O UNIVERSO REAGE AO PROGRESSO ──────────────────────────────────
   * Assina a fila de eventos. Quando uma missão ou um pilar é concluído — e
   * só DEPOIS de a escrita ter passado, porque é essa a regra da fila — o
   * território do domínio acende, nasce a estrela e a energia converge para o
   * Núcleo.
   *
   * O DELTA PERSISTENTE é a estrela: ela vem do nível real e fica lá depois
   * de a animação acabar (gramática 2). O pulso é o anúncio; a estrela é a
   * prova. Sem isto, o Universo era um relatório que não sabia que algo tinha
   * acontecido. */
  useEffect(() => {
    let last = '';
    return subscribeSystemEvents((q) => {
      const ev = q[0];
      if (!ev || ev.dedupe === last) return;
      if (ev.kind !== 'mission' && ev.kind !== 'pillar' && ev.kind !== 'habit') return;
      last = ev.dedupe;
      const dom = ev.domain && AM[ev.domain] ? ev.domain : null;
      if (!dom) return;
      setPulse({ domain: dom, color: AM[dom].color, at: Date.now() });
    });
  }, []);

  // O pulso tem fim visível: é um arco, não um ciclo (gramática 3).
  useEffect(() => {
    if (!pulse) return;
    const t = window.setTimeout(() => setPulse(null), 2600);
    return () => window.clearTimeout(t);
  }, [pulse]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (cam === 'core') { setCam('domain'); return; }
      if (cam === 'domain') { setCam('overview'); setSel(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cam]);

  if (!scene) return null;

  const selT = sel ? scene.territories.find((t) => t.id === sel) : null;

  /* A câmara. Três posições no mesmo espaço — e a transição entre elas é uma
     interpolação de `transform`, por isso é literalmente o mesmo movimento. */
  const camPos = (() => {
    if (cam === 'core') return { x: -CX, y: -CY_, z: 780 };
    if (cam === 'domain' && selT) {
      const a = ((selT.angle - 90) * Math.PI) / 180;
      return { x: -(Math.cos(a) * R_X * kx + CX), y: -(Math.sin(a) * R_Y * ky + CY_), z: 380 };
    }
    return { x: 0, y: 0, z: 0 };
  })();

  const enter = (id: string) => { setSel(id); setCam('domain'); };

  return (
    <div className="us" ref={rootRef} data-cam={cam} data-pulse={pulse ? 'true' : 'false'}>
      <div
        className="us-scene"
        style={{
          ['--cam-x' as string]: camPos.x + 'px',
          ['--cam-y' as string]: camPos.y + 'px',
          ['--cam-z' as string]: camPos.z + 'px',
        }}
      >
        {/* Poeira e nebulosa: AMBIENTE, e declarado como tal. Não conta nada —
            é o que faz o vazio parecer espaço em vez de fundo. */}
        <div className="us-layer us-dust" data-ambient aria-hidden="true" />
        <div className="us-layer us-neb" data-ambient="dominant" aria-hidden="true" />

        {/* O Núcleo, ao fundo. Pequeno e por descobrir no plano geral. */}
        <div className="us-layer us-core-layer" style={{ ['--cy' as string]: CY_ + 'px', ['--cx' as string]: CX + 'px' }}>
          <Nucleus
            mass={scene.coreMass}
            color={scene.rank.color}
            focus={cam === 'core' ? 1 : cam === 'domain' ? 0.45 : 0.18}
            pulse={pulse?.color ?? null}
            size={340}
          />
        </div>

        {/* Anéis inclinados — ORIGEM R13. Naquela referência a profundidade
            não vem de sombra nenhuma: vem de anéis vistos de through um
            ângulo. Rejeitado da mesma: o ciano, os rótulos de HUD de filme e
            a marca de água. */}
        <div className="us-layer us-rings" aria-hidden="true"
             style={{ ['--cy' as string]: CY_ + 'px', ['--cx' as string]: CX + 'px' }}>
          <span /><span /><span />
        </div>

        {/* Os territórios. */}
        <div className="us-layer us-terr-layer">
          {scene.territories.map((t) => {
            const a = ((t.angle - 90) * Math.PI) / 180;
            const tx = Math.cos(a) * R_X * kx + CX;
            const ty = Math.sin(a) * R_Y * ky + CY_;
            const isSel = sel === t.id;
            const fed = pulse?.domain === t.id;
            return (
              <div
                key={t.id}
                className="us-terr"
                data-sel={isSel ? 'true' : 'false'}
                data-fed={fed ? 'true' : 'false'}
                data-dim={sel && !isSel ? 'true' : 'false'}
                style={{
                  ['--tx' as string]: tx + 'px',
                  ['--ty' as string]: ty + 'px',
                  ['--dom' as string]: t.color,
                  ['--rot' as string]: (Math.atan2(ty, tx) * 180) / Math.PI + 180 + 'deg',
                }}
              >
                {/* O campo do domínio: um disco de luz, não um círculo com
                    borda. O tamanho vem do nível real. */}
                <span
                  className="us-field"
                  style={{ ['--field' as string]: 90 + Math.min(120, t.level * 6) + 'px' }}
                />

                {/* As estrelas. Cada uma é um nível provado; a última, se
                    existir, é a que está a nascer. */}
                <span className="us-stars">
                  {t.stars.map((st) => (
                    <span
                      key={st.id}
                      className="us-star"
                      data-forming={st.forming ? 'true' : 'false'}
                      data-tw={st.tw ? 'true' : 'false'}
                      style={{
                        left: `calc(50% + ${st.x * (60 + t.level * 3)}px)`,
                        top: `calc(50% + ${st.y * (60 + t.level * 3)}px)`,
                        ['--s' as string]: st.size.toFixed(2) + 'px',
                        ['--l' as string]: st.light.toFixed(2),
                        ['--d' as string]: (st.z * 1.8).toFixed(2) + 's',
                      }}
                      title={st.forming
                        ? `${t.name} — nível ${st.level} a formar-se (${Math.round(st.light * 100)}%)`
                        : `${t.name} — nível ${st.level}`}
                    />
                  ))}
                </span>

                {/* A ligação ao Núcleo. Só aparece quando há energia a
                    caminho — desenhá-la sempre daria uma teia decorativa. */}
                {fed && <span className="us-flow" aria-hidden="true" />}

                <button
                  type="button"
                  className="us-terr-hit"
                  onClick={() => (isSel && cam === 'domain' ? setCam('core') : enter(t.id))}
                  aria-label={`${t.name}, nível ${t.level}, ${t.proven} ${t.proven === 1 ? 'estrela' : 'estrelas'}`}
                >
                  <span className="us-terr-n">{t.name}</span>
                  <span className="us-terr-l">Nv {t.level}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Satélites: títulos e conquistas, na órbita externa.
            Os provados ganham o sigilo determinístico — cada conquista tem uma
            forma sua, gerada do id, e é sempre a mesma. Os por provar ficam um
            ponto apagado: existem, e vê-se que estão vazios. */}
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
          Fora da cena, fixa. É o instrumento; a cena é o visor (R26). */}
      <div className="us-hud" aria-live="polite">
        {cam === 'overview' && (
          <>
            <p className="us-hud-t">O teu céu</p>
            <p className="us-hud-s">
              Cada estrela é um nível provado num domínio. As que ainda estão a formar-se
              brilham menos — são o XP do nível em curso, e é a única coisa aqui que pode
              recuar. Toca num domínio para te aproximares.
            </p>
            <dl className="rf-debrief">
              <div><dt>Estrelas</dt><dd>{scene.totalStars}</dd></div>
              <div><dt>Rank</dt><dd style={{ color: scene.rank.color }}>{scene.rank.letter}</dd></div>
              <div><dt>Nível global</dt><dd>{scene.level}</dd></div>
            </dl>
          </>
        )}

        {cam === 'domain' && selT && (
          <>
            <p className="us-hud-t" style={{ color: selT.color }}>{selT.name}</p>
            <p className="us-hud-s">{selT.sub}</p>
            <dl className="rf-debrief">
              <div><dt>Estrelas</dt><dd>{selT.proven}</dd></div>
              <div><dt>A formar-se</dt><dd>{selT.xp} / {selT.xpNeed} XP</dd></div>
              <div><dt>Rank</dt><dd style={{ color: selT.rankColor }}>{selT.rankLetter}</dd></div>
            </dl>
            <div className="us-acts">
              <button className="cc-act-go" type="button" onClick={() => setCam('core')}>
                Continuar até ao Núcleo
              </button>
              <button className="mini" type="button" onClick={() => { setCam('overview'); setSel(null); }}>
                Recuar
              </button>
            </div>
          </>
        )}

        {cam === 'core' && (
          <>
            <p className="us-hud-t">O Núcleo</p>
            <p className="us-hud-s">
              Tudo o que provaste converge aqui. A massa do feixe é o teu nível global —
              não há estado bonito por omissão: um Sistema no princípio tem um núcleo
              pequeno, e este é o teu.
            </p>
            {/* Esta leitura estava desenhada DENTRO da cena, por baixo do
                Núcleo. À escala de chegada o Núcleo ocupa o enquadramento
                inteiro e o texto saía por fora — existia e não se via. Um dado
                que não se lê é um dado que não está lá. */}
            <dl className="rf-debrief">
              <div><dt>Rank</dt><dd style={{ color: scene.rank.color }}>{scene.rank.letter}</dd></div>
              <div><dt>Nível global</dt><dd>{scene.level}</dd></div>
              <div><dt>Convergem</dt><dd>{scene.totalStars}</dd></div>
            </dl>
            <div className="us-acts">
              <button className="mini" type="button" onClick={() => setCam(sel ? 'domain' : 'overview')}>
                Recuar
              </button>
              {sel && (
                <button className="mini" type="button" onClick={() => { setCam('overview'); setSel(null); }}>
                  Voltar ao céu
                </button>
              )}
            </div>
          </>
        )}

        {pulse && (
          <p className="us-pulse-note">
            {AM[pulse.domain]?.name} recebeu evidência nova. A energia está a convergir.
          </p>
        )}
      </div>
    </div>
  );
}
