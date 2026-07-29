/* CAMPO CELESTE — o Universo como cosmologia, não como lista.
 * Missão 26 · Fase 6C.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTA FORMA DIZ, e que uma lista de seis barras não dizia:     ║
 * ║                                                                       ║
 * ║  CENTRO         o Núcleo. Tamanho = nível global, cor = rank.        ║
 * ║  ÓRBITA INTERNA seis atributos. Raio fixo (são pares), tamanho =     ║
 * ║                 nível REAL, cor = domínio, movimento = assinatura.   ║
 * ║  ÓRBITA EXTERNA títulos e conquistas. Cheios = provados.             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * PORQUE O RAIO É FIXO E O TAMANHO É QUE VARIA: pôr o atributo mais forte mais
 * perto do centro sugeriria uma hierarquia entre domínios que não existe — os
 * seis são pares. O que varia entre eles é a MASSA, e é isso que o corpo mostra.
 *
 * NADA NASCE DO NADA. Um domínio a nível 1 continua a ter corpo, com o mínimo
 * visível — colapsá-lo num ponto diria que não conta. Um título bloqueado
 * aparece em contorno: o Sistema mostra o caminho, não só o troféu.
 *
 * A LISTA NÃO FOI APAGADA. Continua por baixo, como instrumento secundário com
 * os números exatos. O que muda é qual das duas é a experiência principal.
 */

import { useState } from 'react';
import { ATTRS, need, rankOf, overallLevel, TITLES_REAL, ACH } from '../../state/config.js';
import AchievementSigil from './AchievementSigil';
import './universe.css';

const CX = 200, CY = 200;
const R_INNER = 108;   // órbita dos atributos
const R_OUTER = 168;   // órbita de títulos e conquistas

const polar = (i: number, n: number, r: number, offset = -Math.PI / 2) => {
  const a = offset + (i * 2 * Math.PI) / n;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r, a };
};

export default function CelestialField({ S }: { S: Record<string, any> }) {
  const [sel, setSel] = useState<string | null>(null);

  const lvl = overallLevel(S);
  const rank = rankOf(lvl);

  const levels = ATTRS.map((a: any) => S.attrs[a.id].level);
  const maxLvl = Math.max(1, ...levels);

  // O Núcleo cresce com o nível global, com teto. A mesma ideia do
  // `coreSz = 46 + state*14` do palco: o delta é persistente e proporcional.
  const coreR = 26 + Math.min(18, lvl * 0.45);

  const unlockedTitles = Object.keys(S.titleUnlocked ?? {});
  const seen: string[] = S.seenAch ?? [];

  // Órbita externa: títulos primeiro, conquistas depois. A ordem é estável
  // porque vem das tabelas do domínio, não de um sort por estado — um objeto
  // que muda de sítio ao ser desbloqueado perderia a memória de onde estava.
  const outer = [
    ...TITLES_REAL.map((t: any) => ({ kind: 'title' as const, id: t.id, name: t.name, on: unlockedTitles.includes(t.id) })),
    ...ACH.map((a: any) => ({ kind: 'ach' as const, id: a.id, name: a.name, on: seen.includes(a.id) })),
  ];

  const selAttr = sel ? ATTRS.find((a: any) => a.id === sel) : null;
  const selData = selAttr ? S.attrs[selAttr.id] : null;

  return (
    <div className="cf">
      <svg viewBox="0 0 400 400" className="cf-svg" role="img"
        aria-label={`Campo celeste: Núcleo em rank ${rank.l}, seis domínios em órbita`}>
        {/* Órbitas: a estrutura contra a qual tudo se lê. Sem elas, os corpos
            seriam pontos dispersos em vez de um sistema. */}
        <circle cx={CX} cy={CY} r={R_INNER} className="cf-ring" />
        <circle cx={CX} cy={CY} r={R_OUTER} className="cf-ring cf-ring-far" />

        {/* ── ÓRBITA EXTERNA ── */}
        {outer.map((o, i) => {
          const p = polar(i, outer.length, R_OUTER);
          return o.kind === 'title' ? (
            <g key={o.kind + o.id} className="cf-sat" data-on={o.on ? 'true' : 'false'}>
              <circle cx={p.x} cy={p.y} r={o.on ? 4.5 : 3} />
              {o.on && <circle cx={p.x} cy={p.y} r="9" className="cf-sat-halo" />}
              <title>{o.name} — {o.on ? 'título provado' : 'por provar'}</title>
            </g>
          ) : (
            <g key={o.kind + o.id} className="cf-ach" data-on={o.on ? 'true' : 'false'}
              transform={`translate(${p.x - 11} ${p.y - 11})`}>
              <foreignObject width="22" height="22">
                <AchievementSigil id={o.id} unlocked={o.on} size={22} title={o.name} />
              </foreignObject>
              <title>{o.name} — {o.on ? 'desbloqueada' : 'bloqueada'}</title>
            </g>
          );
        })}

        {/* ── VÍNCULOS ── os arcos entre domínios.
            Origem: gramática 8 — uma relação desenha-se com um arco. Só
            aparecem quando um domínio está selecionado: são a relação DAQUELE
            com o Núcleo, e desenhá-los sempre seria uma teia decorativa. */}
        {sel && (() => {
          const i = ATTRS.findIndex((a: any) => a.id === sel);
          const p = polar(i, ATTRS.length, R_INNER);
          return <line x1={CX} y1={CY} x2={p.x} y2={p.y} className="cf-link" />;
        })()}

        {/* ── ÓRBITA INTERNA · os seis domínios ── */}
        {ATTRS.map((a: any, i: number) => {
          const p = polar(i, ATTRS.length, R_INNER);
          const s = S.attrs[a.id];
          // Piso de 9px: um domínio a zero CONTINUA a existir. Mesma decisão
          // do sigilo do Operador (Fase E), pela mesma razão.
          const r = 9 + (s.level / maxLvl) * 13;
          const frac = s.xp / need(s.level);
          const isSel = sel === a.id;
          return (
            <g key={a.id} className="cf-body" data-dom={a.id} data-sel={isSel ? 'true' : 'false'}
              data-ambient={isSel ? 'dominant' : ''} style={{ ['--dom' as string]: a.color }}
              transform={`translate(${p.x} ${p.y})`}>
              {/* halo: a energia acumulada do nível atual, como fração */}
              <circle r={r + 7} className="cf-halo" opacity={0.1 + frac * 0.35} />
              <circle r={r} className="cf-core" />
              <circle r={r} className="cf-edge" />
              {/* o alvo clicável é maior do que o corpo — um domínio a nível 1
                  tem 9px de raio e ninguém acerta em 18px de diâmetro */}
              <circle
                r={Math.max(22, r + 10)} className="cf-hit"
                tabIndex={0} role="button"
                aria-label={`${a.name}, nível ${s.level}`}
                aria-pressed={isSel}
                onClick={() => setSel(isSel ? null : a.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(isSel ? null : a.id); }
                }}
              />
              <text y={r + 16} className="cf-label">{a.name}</text>
            </g>
          );
        })}

        {/* ── O NÚCLEO ── */}
        <g className="cf-nucleus" style={{ ['--rank' as string]: rank.color }}>
          <circle cx={CX} cy={CY} r={coreR + 12} className="cf-nucleus-halo" />
          <circle cx={CX} cy={CY} r={coreR} className="cf-nucleus-body" />
          <text x={CX} y={CY + 1} className="cf-rank">{rank.l}</text>
          <text x={CX} y={CY + 18} className="cf-lvl">Nv {lvl}</text>
        </g>
      </svg>

      {/* ── LEITURA ──
          O campo mostra a forma; isto mostra o número. Sem seleção, diz o que
          o campo é — não fica um espaço vazio à espera de um clique. */}
      <div className="cf-read" aria-live="polite">
        {selAttr && selData ? (
          <>
            <p className="cf-read-d" style={{ color: selAttr.color }}>{selAttr.name}</p>
            <p className="cf-read-s">{selAttr.sub}</p>
            <dl className="rf-debrief">
              <div><dt>Nível</dt><dd>{selData.level}</dd></div>
              <div><dt>XP no nível</dt><dd>{selData.xp} / {need(selData.level)}</dd></div>
              <div><dt>Rank do domínio</dt><dd style={{ color: rankOf(selData.level).color }}>{rankOf(selData.level).l}</dd></div>
            </dl>
            <button className="mini" type="button" onClick={() => setSel(null)}>Fechar leitura</button>
          </>
        ) : (
          <>
            <p className="cf-read-d">O teu sistema</p>
            <p className="cf-read-s">
              O Núcleo ao centro cresce com o nível global e tem a cor do rank. Os seis
              corpos em órbita são os domínios — o tamanho é o nível real, não uma
              posição de tabela. Na órbita de fora, cheios são títulos provados e
              conquistas desbloqueadas; em contorno, o que falta.
            </p>
            <dl className="rf-debrief">
              <div><dt>Rank</dt><dd style={{ color: rank.color }}>{rank.l}</dd></div>
              <div><dt>Nível global</dt><dd>{lvl}</dd></div>
              <div><dt>Provado</dt><dd>{unlockedTitles.length + seen.length} de {outer.length}</dd></div>
            </dl>
            <p className="cf-hint">Toca num domínio para o ler.</p>
          </>
        )}
      </div>
    </div>
  );
}
