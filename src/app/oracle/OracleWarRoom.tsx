/* Oráculo · War Room — coordenação.
 * Missão 26 · Fase 2, reescrita na Fase 6B.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DOIS ESTADOS, E A DIFERENÇA ENTRE ELES É A PARTE HONESTA:           ║
 * ║                                                                       ║
 * ║  LIGADO     lê estado real, e cada número traz de onde veio.         ║
 * ║  NÃO EXISTE o subsistema não foi construído. Não é uma maqueta à     ║
 * ║             espera de cabo — é uma coisa que ainda não há.           ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A versão anterior punha "MAQUETA — DADOS AINDA NÃO LIGADOS" nos quatro
 * blocos. Para Projetos e Riscos isso era verdade. Para Agentes e Money
 * Machine era falso: não há registry, não há pipeline, não há nada por ligar.
 * Dizer "ainda não ligado" sobre uma coisa que não existe é mentir por
 * implicatura — e é a mesma classe de erro que a Fase I apanhou quando um
 * `catch` vazio fazia uma falha de rede passar por "não há notícias".
 *
 * Nenhum campo inventa um número. Onde não há valor, há travessão.
 */

import { useStore } from '../../store/useStore.js';
import { readWarRoom } from './warRoomRead';

export default function OracleWarRoom() {
  const S = useStore((s: { S: Record<string, any> | null }) => s.S);
  const blocks = readWarRoom(S);

  const live = blocks.filter((b) => b.state === 'live');
  const absent = blocks.filter((b) => b.state === 'absent');

  return (
    <div className="sys-warroom">
      <div className="sys-warroom-grid">
        {live.map((b) => (
          <section key={b.id} className="sys-warroom-block" data-state="live">
            <header className="sys-warroom-head">
              <h3 className="sys-warroom-name">{b.name}</h3>
            </header>
            <dl className="sys-warroom-fields">
              {b.fields?.map((f) => (
                <div key={f.label} className="sys-warroom-field" data-tone={f.tone}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                  {/* A origem de cada número. Sem ela seria um sinal, e a lei
                      diz que o Sistema mostra provas. */}
                  {f.from && <p className="sys-warroom-from">{f.from}</p>}
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {absent.length > 0 && (
        <section className="sys-warroom-absent" aria-label="Subsistemas por construir">
          <h3 className="sys-warroom-ah">Ainda não existe</h3>
          <ul>
            {absent.map((b) => (
              <li key={b.id}>
                <p className="sys-warroom-an">{b.name}</p>
                <p className="sys-warroom-am">{b.missing}</p>
                {b.rule && <p className="sys-warroom-ar">{b.rule}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="sys-warroom-note">
        Estes dois não são maquetas à espera de ligação: são subsistemas por
        construir. Abrem com o programa Oracle Intelligence &amp; Governance —
        ver <code>docs/oracle-governance/17_PHASED_ROADMAP.md</code>.
      </p>
    </div>
  );
}
