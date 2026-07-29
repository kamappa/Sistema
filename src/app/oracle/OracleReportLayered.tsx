/* RELATÓRIO DO ORÁCULO — apresentação por camadas.
 * Missão 26 · Fase 6B.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O CONTEÚDO NÃO MUDA. O backend não foi tocado, a Edge Function não  ║
 * ║  foi tocada, nenhum campo foi removido. O que muda é a FORMA.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O defeito era estrutural e não de escrita: catorze campos renderizados com a
 * mesma largura, a mesma cor, a mesma densidade e um por linha. Análise boa com
 * forma de parede — e uma parede lê-se do princípio ao fim ou não se lê.
 *
 * AS CAMADAS, e o que cada uma responde:
 *   1 · Resumo      — o que preciso de saber se só ler uma coisa
 *   2 · Sinais      — o que ele viu em cada domínio, com a prova ao lado
 *   3 · Interpretação — a voz do Oráculo, separada dos números
 *   4 · Decisões    — o que espera resposta
 *   5 · Missões     — o que posso aceitar
 *   6 · Recursos    — o que posso ler
 *   7 · Análise completa — TUDO, recolhido, incluindo campos que este
 *       componente não conhece
 *
 * NADA É ESCONDIDO. Recolher não é esconder: o resumo e o alerta ficam sempre
 * abertos, e a análise integral está a um clique com o texto inteiro.
 *
 * SEGURANÇA: zero `dangerouslySetInnerHTML`, zero parsing de HTML, zero
 * heurística de emojis. Tudo entra como texto em nós React.
 */

import { useState } from 'react';
import { useStore } from '../../store/useStore.js';
import { readReport } from './reportRead';
import OracleSigil from './OracleSigil';
import './report.css';

export default function OracleReportLayered({ S }: { S: Record<string, any> }) {
  const user = useStore((s: any) => s.user);
  const report = useStore((s: any) => s.report);
  const fetchErr = useStore((s: any) => s.fetchErr);
  const acceptOracleMission = useStore((s: any) => s.acceptOracleMission);
  const [full, setFull] = useState(false);

  // Uma falha de rede não pode disfarçar-se de "não há relatório" — foi uma
  // das duas mentiras estruturais que a Fase I corrigiu, e continua a valer.
  if (fetchErr) {
    return (
      <section className="panel or-empty">
        <p>Não consegui ir buscar o relatório. Isto é uma falha de ligação, não a ausência de um relatório.</p>
      </section>
    );
  }
  if (!user) {
    return <section className="panel or-empty"><p>Entra com a tua conta para veres os relatórios.</p></section>;
  }

  const r = readReport(report, S);
  if (!r) {
    return (
      <section className="panel or-empty">
        <p>O primeiro relatório chega no domingo à noite — o Oráculo lê a tua semana e escreve aqui.</p>
      </section>
    );
  }

  return (
    <article className="panel or" aria-label={`Relatório do Oráculo de ${r.date}`}>
      <header className="or-head">
        <h2 className="or-h">
          <OracleSigil signals={r.alert ? 3 : 1} alert={!!r.alert} />
          <span>Relatório da semana</span>
        </h2>
        <span className="or-date">{r.date}</span>
      </header>

      {/* ── 1 · RESUMO ── sempre aberto, e o único bloco em corpo grande. */}
      {r.summary && <p className="or-summary">{r.summary}</p>}

      {r.alert && (
        <p className="or-alert">
          <span className="or-alert-l">Maior risco</span>
          {r.alert}
        </p>
      )}

      {/* ── 2 · SINAIS ── a leitura do Oráculo com a prova do Sistema ao lado.
          É aqui que se vê quando o modelo escreveu algo que os dados não
          sustentam — e ver isso vale mais do que a frase. */}
      {r.signals.length > 0 && (
        <section className="or-sec">
          <h3 className="or-sh">Sinais</h3>
          <ul className="or-signals">
            {r.signals.map((s) => (
              <li key={s.key}>
                <span className="or-sig-d">{s.domain}</span>
                <p className="or-sig-t">{s.text}</p>
                {s.evidence.length > 0 && (
                  <dl className="or-sig-ev">
                    {s.evidence.map((e) => (
                      <div key={e.label}><dt>{e.label}</dt><dd>{e.value}</dd></div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
          <p className="or-sig-note">
            As leituras à direita são do Sistema, dos teus registos. As frases são do
            Oráculo. Quando não coincidem, a leitura ganha.
          </p>
        </section>
      )}

      {/* ── 3 · INTERPRETAÇÃO ── a voz, separada dos números. */}
      {r.interpretation.length > 0 && (
        <section className="or-sec or-interp">
          <h3 className="or-sh">Interpretação</h3>
          {r.interpretation.map((i) => (
            <p key={i.key} className="or-int">
              <span className="or-int-l">{i.label}</span>
              {i.text}
            </p>
          ))}
        </section>
      )}

      {/* ── 4 · DECISÕES ── */}
      {r.proposals.length > 0 && (
        <section className="or-sec">
          <h3 className="or-sh">Decisões pendentes</h3>
          <ul className="or-props">
            {r.proposals.map((p, i) => (
              <li key={i}>
                <p className="or-prop-t">{p.t}</p>
                {p.why && <p className="or-prop-w">{p.why}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 5 · MISSÕES ── a única camada com ação. */}
      {r.missions.length > 0 && (
        <section className="or-sec">
          <h3 className="or-sh">Missões propostas</h3>
          <ul className="or-props">
            {r.missions.map((m, i) => (
              <li key={i}>
                <p className="or-prop-t">{m.t}</p>
                {m.why && <p className="or-prop-w">{m.why}</p>}
                <button className="mini" type="button" onClick={() => acceptOracleMission(i)}>
                  Aceitar missão
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 6 · RECURSOS ── */}
      {r.resources.length > 0 && (
        <section className="or-sec">
          <h3 className="or-sh">Para complementar</h3>
          <ul className="or-res">
            {r.resources.map((x, i) => (
              <li key={i}>
                <a href={x.url} target="_blank" rel="noopener noreferrer">{x.titulo || x.url}</a>
                {x.porque && <span className="or-res-w">{x.porque}</span>}
                {x.fonte && <span className="or-res-s">{x.fonte}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 7 · ANÁLISE COMPLETA ──
          Recolhida, nunca removida. Percorre o objeto inteiro, por isso um
          campo novo da Edge Function aparece aqui mesmo que este componente
          não o conheça. É a garantia de que a recomposição não perdeu nada. */}
      {r.raw.length > 0 && (
        <section className="or-sec or-full">
          <button
            type="button"
            className="or-full-t"
            aria-expanded={full}
            onClick={() => setFull((f) => !f)}
          >
            {full ? 'Fechar a análise completa' : 'Ver análise completa'}
            <span className="or-full-n">{r.raw.length} campos</span>
          </button>
          {full && (
            <dl className="or-raw">
              {r.raw.map((x) => (
                <div key={x.key}>
                  <dt>{x.label}</dt>
                  {/* `white-space: pre-line` no CSS preserva as quebras das
                      listas sem interpretar uma única tag. */}
                  <dd>{x.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}
    </article>
  );
}
