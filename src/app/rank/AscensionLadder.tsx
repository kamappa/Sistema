/* ESCADA DE ASCENSÃO.
 * Missão 26 · Fase 6D.
 *
 * Abre do Núcleo da órbita — a letra de rank no topo deixa de ser decoração e
 * passa a ser a porta para o que ela significa.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A ESCADA VERTICAL É O SIGNIFICADO, não uma escolha estética.        ║
 * ║  Gramática 9 (origem R11): o que sobe, melhora. Uma lista horizontal ║
 * ║  de degraus diria "estes são os ranks"; a vertical diz "estás aqui e ║
 * ║  aquilo fica acima".                                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE NÃO INVENTA: requisitos. O domínio tem um só critério de rank, e é o
 * nível global. Os degraus futuros dizem quantos níveis faltam — que é
 * verdade — e a secção final diz por extenso o que ainda **não está
 * definido**, em vez de encher a escada com regras que ninguém escreveu.
 *
 * Acessibilidade: `role="dialog"` com `aria-modal`, foco entra no painel e
 * volta ao Núcleo ao fechar, Escape fecha, scroll interno próprio.
 */

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { readLadder, readLadderOracle } from './ladderRead';
import OracleSigil from '../oracle/OracleSigil';
import './ladder.css';

export default function AscensionLadder({
  S,
  onClose,
}: {
  S: Record<string, any>;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const l = readLadder(S);

  useEffect(() => { panelRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!l) return null;
  const oracle = readLadderOracle(l);

  return createPortal(
    <div className="al-overlay sys-instrumental" role="dialog" aria-modal="true" aria-label="Escada de Ascensão">
      <div className="al-panel" ref={panelRef} tabIndex={-1}>
        <header className="al-head">
          <div>
            <p className="al-kicker">Escada de Ascensão</p>
            <h2 className="al-title" style={{ color: l.current.color }}>Rank {l.current.letter}</h2>
            <p className="al-sub">
              Nível global {l.level}
              {l.next
                ? ` · faltam ${l.levelsToNext} ${l.levelsToNext === 1 ? 'nível' : 'níveis'} para ${l.next.letter}`
                : ' · último degrau definido'}
            </p>
          </div>
          <button className="al-close" type="button" onClick={onClose} aria-label="Fechar">✕</button>
        </header>

        <div className="al-scroll">
          {/* ── A ESCADA ──
              De baixo para cima: o passado em baixo, o futuro em cima. É a
              direção que carrega o significado, não a ordem de leitura. */}
          <ol className="al-steps">
            {[...l.steps].reverse().map((s) => (
              <li key={s.letter} className="al-step" data-state={s.state} style={{ ['--rank' as string]: s.color }}>
                <div className="al-step-mark">
                  <span className="al-step-l">{s.letter}</span>
                </div>
                <div className="al-step-b">
                  <p className="al-step-r">
                    {s.max >= 9999 ? `nível ${s.min} e acima` : `níveis ${s.min}–${s.max}`}
                    {s.state === 'future' && s.levelsAway > 0 && (
                      <span className="al-away"> · faltam {s.levelsAway}</span>
                    )}
                    {s.state === 'current' && <span className="al-here"> · estás aqui</span>}
                  </p>
                  {s.titles.length > 0 && (
                    <p className="al-step-t">{s.titles.join(' · ')}</p>
                  )}
                  {s.state === 'current' && l.next && (
                    <div className="al-prog" role="img"
                      aria-label={`${Math.round(l.progress * 100)}% do degrau ${s.letter}`}>
                      <span style={{ width: `${l.progress * 100}%` }} />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* ── O CAMINHO MAIS CURTO ──
              Derivado, não inventado: `overallLevel` é a soma dos seis
              domínios, por isso o que tem menos XP em falta é literalmente o
              mais barato de subir. */}
          <section className="al-sec">
            <h3 className="al-sh">O que puxa para cima</h3>
            <ul className="al-pull">
              {l.pull.map((d, i) => (
                <li key={d.id} style={{ ['--dom' as string]: d.color }} data-first={i === 0 ? 'true' : undefined}>
                  <span className="al-pull-n">{d.name}</span>
                  <span className="al-pull-l">Nv {d.level}</span>
                  <span className="al-pull-x">{d.xpLeft} XP para o próximo</span>
                </li>
              ))}
            </ul>
            <p className="al-note">
              O nível global é a soma dos seis domínios. Não há atalho: o degrau seguinte
              chega quando a soma chegar.
            </p>
          </section>

          {oracle && (
            <section className="al-oracle">
              <h3 className="al-oracle-h">
                <OracleSigil signals={1} />
                <span>Oráculo</span>
              </h3>
              <p title={oracle.because}>{oracle.text}</p>
            </section>
          )}

          {/* ── O QUE NÃO ESTÁ DEFINIDO ──
              A parte honesta. O desenho aprovado pedia requisitos, benefícios e
              histórico de promoções; o domínio não guarda nenhum dos três.
              Inventá-los seria mostrar critérios que ninguém escreveu. */}
          <section className="al-sec al-pending">
            <h3 className="al-sh">Critérios ainda não definidos</h3>
            <ul>
              {l.undefined_.map((u) => <li key={u}>{u}</li>)}
            </ul>
            <p className="al-note">
              O único critério de rank que o Sistema tem é aritmético: o nível global.
              Enquanto não existirem os outros, esta escada não os inventa.
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
