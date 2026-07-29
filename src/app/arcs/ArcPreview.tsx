/* PREVIEW E CERIMÓNIA DO ARCO.
 * Missão 26 · Fase 7.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  UM ARCO É UM ACONTECIMENTO DE MESES. Não pode continuar reduzido a  ║
 * ║  um emoji, um nome e três botões pequenos.                           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O preview responde às perguntas que uma decisão de meses levanta, e todas
 * com dados reais do registo de arcos:
 *   porque o mundo mudou · o que o arco é · quanto dura · que domínios afeta ·
 *   o que ganha · o que custa · o que acontece se ignorar
 *
 * O QUE NÃO INVENTA: marcos. O domínio não guarda marcos atingidos, por isso o
 * mapa temporal mostra o que EXISTE — início, hoje, fim — e as missões que a
 * aceitação vai acrescentar, que são factos do `SEASON_ARCS`. Um marco
 * inventado seria o Sistema a prometer uma cerimónia que nunca vai acontecer.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A CERIMÓNIA SÓ COMEÇA DEPOIS DE A ESCRITA PASSAR.                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * `arcAccept()` devolve `saved`. Se for falso, não há sigilo a formar-se, não
 * há energia a convergir: há uma mensagem a dizer que não ficou guardado e um
 * botão para repetir. Celebrar uma decisão que não persistiu seria a mentira
 * mais cara que este ecrã podia contar.
 */

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../store/useStore.js';
import { AM } from '../../state/config.js';
import { readArc } from './arcModel';
import ArcSigil from './ArcSigil';
import { eventsAnimate } from '../motion/motionTier';
import './arc-preview.css';

type Stage = 'preview' | 'forming' | 'done' | 'failed';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const fmtDay = (iso: string) => `${iso.slice(8, 10)} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;

export default function ArcPreview({ S, onClose }: { S: Record<string, any>; onClose: () => void }) {
  const arcAccept = useStore((s: any) => s.arcAccept);
  const arcLater = useStore((s: any) => s.arcLater);
  const arcIgnore = useStore((s: any) => s.arcIgnore);
  const [stage, setStage] = useState<Stage>('preview');
  const [added, setAdded] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const arc = readArc(S);

  useEffect(() => { panelRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Durante a formação, Escape não fecha: o estado já mudou e fechar a
      // meio deixaria o Operador sem saber o que aconteceu.
      if (e.key === 'Escape' && stage !== 'forming') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, stage]);

  if (!arc) return null;
  const { motif } = arc;

  const accept = () => {
    const res = arcAccept();
    if (!res || res.saved === false) { setStage('failed'); return; }
    setAdded(res.n ?? 0);
    setStage('forming');
    // A formação tem duração fixa e curta; sem movimento permitido salta
    // direto para o estado final, que é o que interessa.
    const wait = eventsAnimate() ? 1500 : 0;
    window.setTimeout(() => setStage('done'), wait);
  };

  const style = {
    ['--arc-accent' as string]: motif.accent,
    ['--arc-accent-soft' as string]: motif.accentSoft,
  } as React.CSSProperties;

  return createPortal(
    <div className="ap-overlay sys-instrumental" data-stage={stage} style={style}
      role="dialog" aria-modal="true" aria-label={`${arc.plainName} — proposta do mundo`}>
      <div className="ap-panel" ref={panelRef} tabIndex={-1}>

        {stage === 'preview' && (
          <>
            <header className="ap-head">
              <div>
                <p className="ap-kicker">O mundo mudou</p>
                <h2 className="ap-title">{arc.plainName}</h2>
                <p className="ap-desc">{arc.desc}</p>
              </div>
              <button className="ap-close" type="button" onClick={onClose} aria-label="Fechar">✕</button>
            </header>

            <div className="ap-body">
              <div className="ap-sigil" data-ambient>
                <ArcSigil accent={motif.accent} accentSoft={motif.accentSoft} flow={motif.flow} progress={arc.progress} />
                <p className="ap-gesture">{motif.gesture}</p>
              </div>

              <div className="ap-info">
                {/* ── MAPA TEMPORAL ──
                    Só o que existe: início, hoje, fim. Sem marcos inventados. */}
                <section className="ap-sec">
                  <h3 className="ap-sh">Quanto dura</h3>
                  <div className="ap-time">
                    <div className="ap-time-bar">
                      {arc.progress != null && (
                        <span className="ap-time-now" style={{ left: `${arc.progress * 100}%` }} aria-hidden="true" />
                      )}
                    </div>
                    <div className="ap-time-l">
                      <span>{fmtDay(arc.start)}</span>
                      <span>
                        {arc.day == null
                          ? `${arc.totalDays} dias`
                          : `dia ${arc.day} de ${arc.totalDays} · faltam ${arc.daysLeft}`}
                      </span>
                      <span>{fmtDay(arc.end)}</span>
                    </div>
                  </div>
                </section>

                {/* ── DOMÍNIOS ── o multiplicador real, não uma promessa. */}
                {arc.bonus.length > 0 && (
                  <section className="ap-sec">
                    <h3 className="ap-sh">O que o arco favorece</h3>
                    <dl className="ap-bonus">
                      {arc.bonus.map((b) => (
                        <div key={b.id} style={{ ['--dom' as string]: AM[b.id]?.color }}>
                          <dt>{AM[b.id]?.name ?? b.id}</dt>
                          <dd>×{b.mult}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="ap-note">
                      Multiplicador de XP enquanto o arco durar. É a única coisa que muda nos
                      números — o motor não é tocado.
                    </p>
                  </section>
                )}

                {/* ── O QUE CUSTA ── literalmente o que a aceitação faz. */}
                <section className="ap-sec">
                  <h3 className="ap-sh">O que aceitar faz</h3>
                  <ul className="ap-cost">
                    <li>
                      <b>{arc.quests.length} missões</b> entram na lista-mestra, com prazo no fim do arco
                    </li>
                    <li><b>+15 XP de {AM.mente.name}</b> por assumires a decisão</li>
                    <li>A atmosfera do Sistema passa a ter a cor da estação</li>
                  </ul>
                  {arc.quests.length > 0 && (
                    <ol className="ap-quests">
                      {arc.quests.map((q, i) => (
                        <li key={i}>
                          <span className="ap-q-t">{q.t}</span>
                          <span className="ap-q-d" style={{ color: AM[q.area]?.color }}>
                            {AM[q.area]?.name ?? q.area}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>

                {/* ── O QUE CUSTA IGNORAR ── honesto, sem chantagem. */}
                <section className="ap-sec">
                  <h3 className="ap-sh">Se ignorares</h3>
                  <p className="ap-plain">
                    Nada se perde do que já tens. O mundo fica sem arco até à próxima estação:
                    sem multiplicadores, sem missões da estação e sem atmosfera própria.
                    {arc.day != null && ` Restam ${arc.daysLeft} dias deste — depois fecha sozinho.`}
                  </p>
                </section>

                <section className="ap-sec">
                  <h3 className="ap-sh">A pergunta do arco</h3>
                  <p className="ap-boss">{arc.boss}</p>
                </section>
              </div>
            </div>

            <footer className="ap-acts">
              <button className="cc-act-go" type="button" onClick={accept}>
                Aceitar o arco
              </button>
              <button className="mini" type="button" onClick={() => { arcLater(); onClose(); }}>
                Decidir mais tarde
              </button>
              <button className="mini" type="button" onClick={() => { arcIgnore(); onClose(); }}>
                Ignorar esta estação
              </button>
            </footer>
          </>
        )}

        {/* ── CERIMÓNIA ──
            O sigilo forma-se e a energia converge (R15, gramática 1). Só
            começa depois de `saved` ser verdadeiro. */}
        {stage === 'forming' && (
          <div className="ap-ceremony" aria-live="polite">
            <div className="ap-form">
              <ArcSigil accent={motif.accent} accentSoft={motif.accentSoft} flow={motif.flow} progress={arc.progress} size={180} form={1} />
            </div>
            <p className="ap-cer-t">{arc.plainName} aceite</p>
          </div>
        )}

        {stage === 'done' && (
          <div className="ap-ceremony ap-done" aria-live="polite">
            <ArcSigil accent={motif.accent} accentSoft={motif.accentSoft} flow={motif.flow} progress={arc.progress} size={150} />
            <h2 className="ap-title">{arc.plainName}</h2>
            <dl className="ap-done-r">
              <div><dt>Missões novas</dt><dd>{added}</dd></div>
              <div><dt>Dias restantes</dt><dd>{arc.daysLeft}</dd></div>
              {arc.bonus.map((b) => (
                <div key={b.id}><dt>{AM[b.id]?.name ?? b.id}</dt><dd>×{b.mult}</dd></div>
              ))}
            </dl>
            {/* O briefing curto do Oráculo — a voz, atribuída, como em todo o
                lado. Uma frase, derivada dos factos que acabaram de mudar. */}
            <p className="ap-oracle">
              <span className="ap-oracle-l">Oráculo</span>
              {added > 0
                ? `As ${added} missões do arco têm todas o mesmo prazo. Se as deixares para o fim, chegam juntas — começa pela que puxa o domínio mais atrasado.`
                : 'O arco está ativo e não trouxe missões novas: as que existiam já cobriam o que ele pede.'}
            </p>
            <button className="cc-act-go" type="button" onClick={onClose}>Entrar no arco</button>
          </div>
        )}

        {/* Falha de escrita: sem cerimónia, sem fingimento. */}
        {stage === 'failed' && (
          <div className="ap-ceremony" role="alert">
            <h2 className="ap-title">Não ficou guardado</h2>
            <p className="ap-plain">
              A decisão não foi escrita, por isso o arco NÃO está aceite. Nada mudou
              no teu estado.
            </p>
            <div className="ap-acts">
              <button className="cc-act-go" type="button" onClick={accept}>Tentar outra vez</button>
              <button className="mini" type="button" onClick={onClose}>Fechar</button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
