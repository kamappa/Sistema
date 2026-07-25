/* Oráculo · War Room — coordenação. Missão 26 · Fase 2.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  TUDO AQUI É MAQUETA E DIZ QUE É.                                     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Uma sala de guerra com projetos, agentes, riscos e Money Machine inventados
 * seria a violação mais direta possível da lei do projeto. Por isso cada bloco
 * carrega o rótulo `MAQUETA — DADOS AINDA NÃO LIGADOS`, e os campos estão
 * VAZIOS em vez de preenchidos com números plausíveis. Um traço não mente; um
 * "3 agentes ativos" mentiria.
 *
 * Nada de agentes, Money Machine ou execução nesta fase — só a moldura.
 */

const BLOCKS = [
  { id: 'projects', name: 'Projetos', fields: ['Ativo', 'Bloqueado', 'Próxima entrega'] },
  { id: 'agents', name: 'Agentes', fields: ['Registados', 'Em execução', 'Kill switch'] },
  { id: 'risks', name: 'Riscos', fields: ['Abertos', 'Aceites', 'Em escalada'] },
  { id: 'money', name: 'Money Machine', fields: ['Pipeline', 'Drafts', 'Por aprovar'] },
];

export default function OracleWarRoom() {
  return (
    <div className="sys-warroom">
      <div className="sys-warroom-grid">
        {BLOCKS.map((b) => (
          <section key={b.id} className="sys-warroom-block">
            <header className="sys-warroom-head">
              <h3 className="sys-warroom-name">{b.name}</h3>
              <span className="sys-mock-tag">MAQUETA — DADOS AINDA NÃO LIGADOS</span>
            </header>
            <dl className="sys-warroom-fields">
              {b.fields.map((f) => (
                <div key={f} className="sys-warroom-field">
                  <dt>{f}</dt>
                  {/* Vazio de propósito. Nenhum valor inventado. */}
                  <dd aria-label="sem dados">—</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="sys-warroom-note">
        A War Room é moldura. Os dados ligam-se quando o programa Oracle
        Intelligence &amp; Governance abrir — ver
        <code> docs/oracle-governance/17_PHASED_ROADMAP.md</code>.
      </p>
    </div>
  );
}
