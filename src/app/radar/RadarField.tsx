/* RADAR — campo de sinais, não grelha de cartões.
 * Missão 26 · Fase 6E.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  QUATRO ESTADOS, e nenhum deles é uma página por acabar:             ║
 * ║  SCANNING  · a ir buscar. Diz o que está a fazer.                    ║
 * ║  SIGNAL    · encontrou. O sinal nasce num trilho temporal.           ║
 * ║  NO SIGNAL · não encontrou nada relevante — e continua a vigiar.     ║
 * ║  ERROR     · falhou. Diz que falhou, e não finge um vazio.           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ORIGEM: R26 — trilho + visor. O trilho aqui é TEMPORAL: os dias descem pela
 * esquerda como marcas de varrimento, e os sinais vivem à direita de cada
 * marca. Rejeitado da mesma referência: os cantos em esquadria e a densidade
 * de HUD de filme.
 *
 * A GRELHA DE CARTÕES SAIU. Cada sinal era uma caixa igual às outras, o que
 * fazia um artigo de opinião parecer igual a uma vaga de emprego. Agora o que
 * distingue é o filete da categoria e a luz do alto impacto.
 */

import { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore.js';
import { readRadar } from './radarRead';
import './radar.css';

export default function RadarField({ S }: { S: Record<string, any> }) {
  const user = useStore((s: any) => s.user);
  const radar = useStore((s: any) => s.radar);
  const sync = useStore((s: any) => s.sync);
  const fetchErr = useStore((s: any) => s.fetchErr);
  const loadOracleData = useStore((s: any) => s.loadOracleData);
  const acceptRadarMission = useStore((s: any) => s.acceptRadarMission);
  const ref = useRef<HTMLDivElement>(null);

  const r = readRadar(radar, S);

  // Scanline uma vez por sessão quando há material fresco — comportamento
  // herdado (radar.js:40-43), mantido porque comunica "isto é novo".
  useEffect(() => {
    try {
      if ((window as any).panelScan && !sessionStorage.getItem('scanRadar') && r.days.some((d) => d.signals.some((s) => s.fresh))) {
        sessionStorage.setItem('scanRadar', '1');
        (window as any).panelScan(ref.current);
      }
    } catch { /* sem fx, sem scanline */ }
  }, [r.days]);

  /* ── ERROR ── o único estado que não pode ser confundido com vazio. */
  if (fetchErr) {
    return (
      <section className="rdf panel" data-state="error" ref={ref} aria-label="Radar">
        <Head r={r} state="error" />
        <p className="rdf-msg">
          Não consegui chegar ao Radar. Isto é uma <b>falha de ligação</b>, não a
          ausência de sinais — o que estiveres a ver pode estar desatualizado.
        </p>
        <button className="cc-act-go" type="button" onClick={() => loadOracleData()}>
          Tentar outra vez
        </button>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="rdf panel" ref={ref} aria-label="Radar">
        <Head r={r} state="off" />
        <p className="rdf-msg">O Radar sincroniza com a tua conta. Sem sessão, não corre.</p>
      </section>
    );
  }

  /* ── SCANNING ── estado real, lido do `sync`, não um spinner decorativo. */
  const scanning = sync === 'saving';

  /* ── NO SIGNAL ── operacional: o que vigia, quando olhou, quando volta. */
  if (!r.total) {
    return (
      <section className="rdf panel" data-state={scanning ? 'scanning' : 'quiet'} ref={ref} aria-label="Radar">
        <Head r={r} state={scanning ? 'scanning' : 'quiet'} />
        <p className="rdf-msg">
          {scanning
            ? 'A varrer as fontes.'
            : 'Sem novos sinais relevantes nos últimos 7 dias. O Radar continua a vigiar.'}
        </p>
        <Watching r={r} />
      </section>
    );
  }

  /* ── SIGNAL ── */
  return (
    <section className="rdf panel" data-state={scanning ? 'scanning' : 'live'} ref={ref} aria-label="Radar">
      <Head r={r} state={scanning ? 'scanning' : 'live'} />

      <div className="rdf-rail">
        {r.days.map((day) => (
          <section key={day.d} className="rdf-day" aria-label={day.label}>
            {/* A marca de varrimento: o dia é o eixo, e é ele que torna isto um
                mapa temporal em vez de uma lista. */}
            <div className="rdf-mark">
              <span className="rdf-mark-l">{day.label}</span>
              <span className="rdf-mark-n">{day.signals.length}</span>
            </div>

            <ul className="rdf-sigs">
              {day.signals.map((s) => (
                <li key={s.id} className="rdf-sig" data-high={s.high ? 'true' : 'false'}
                  style={{ ['--area' as string]: s.areaColor }}>
                  <div className="rdf-sig-h">
                    {s.url ? (
                      <a className="rdf-sig-t" href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a>
                    ) : (
                      <span className="rdf-sig-t">{s.title}</span>
                    )}
                    {s.fresh && <span className="rdf-new">nova</span>}
                  </div>

                  {s.summary && <p className="rdf-sig-s">{s.summary}</p>}

                  {/* "porque importa" é o que separa um agregador de notícias
                      de um radar. Vem escrito do próprio item — não é gerado
                      aqui nem inferido. */}
                  {s.relevance && (
                    <p className="rdf-sig-r"><span>Porque importa</span>{s.relevance}</p>
                  )}

                  <div className="rdf-sig-m">
                    <span className="rdf-area" style={{ color: s.areaColor }}>{s.areaLabel}</span>
                    {s.source && <span>{s.source}</span>}
                    {s.time && <span>{s.time}</span>}
                    {s.high && <span className="rdf-high">alto impacto</span>}
                  </div>

                  {s.mission && (
                    <button className="mini" type="button" disabled={s.accepted}
                      onClick={() => acceptRadarMission(s.id)}>
                      {s.accepted ? 'Missão aceite' : 'Aceitar missão do Radar'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Watching r={r} />
    </section>
  );
}

/* Cabeçalho de instrumento: o estado, quando olhou, quando volta. É isto que
   torna um Radar sem notícias diferente de uma página por acabar. */
function Head({ r, state }: { r: ReturnType<typeof readRadar>; state: string }) {
  const st: Record<string, string> = {
    live: 'a vigiar', scanning: 'a varrer', quiet: 'a vigiar', error: 'sem ligação', off: 'inativo',
  };
  return (
    <header className="rdf-head">
      <h2 className="rdf-h">
        <span className="rdf-dot" data-state={state} aria-hidden="true" />
        Radar · {st[state] ?? state}
      </h2>
      <dl className="rf-debrief rdf-stats">
        <div><dt>Última passagem</dt><dd>{r.lastLabel ?? '—'}</dd></div>
        <div><dt>Próxima, prevista</dt><dd>{r.nextPass}</dd></div>
        <div><dt>Sinais (7 dias)</dt><dd>{r.total}{r.highCount > 0 && <span className="rdf-hi"> · {r.highCount} de alto impacto</span>}</dd></div>
      </dl>
    </header>
  );
}

function Watching({ r }: { r: ReturnType<typeof readRadar> }) {
  return (
    <div className="rdf-watch">
      <h3 className="rdf-wh">O que está a ser vigiado</h3>
      <ul>
        {r.watching.map((w) => (
          <li key={w.id} style={{ ['--area' as string]: w.color }}>{w.label}</li>
        ))}
      </ul>
      <p className="rdf-note">
        A hora da próxima passagem é a cadência conhecida do Radar, não uma garantia —
        quem a executa é o serviço, e a aplicação não tem como confirmar o horário.
      </p>
    </div>
  );
}
