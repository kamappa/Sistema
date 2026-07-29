/* A fala atribuída do Oráculo — Missão 26 · Fase 6B.
 *
 * A coluna da ação continua a ser um instrumento do SISTEMA. Este é o único
 * bloco dela que fala como Oráculo, e tem de o dizer: sem atribuição, uma
 * interpretação lida como facto, e o Sistema passaria a afirmar coisas que não
 * consegue provar.
 *
 * COMO SE DISTINGUE, e nenhuma das três é decoração:
 *   1. o sigilo de onda (R01) — a mesma marca da presença ambiente, e a única
 *      do produto. Ver o sigilo é saber quem fala.
 *   2. o rótulo "Oráculo", em mono.
 *   3. um filete no material do Oráculo (`--sys-mat-oracle`), diferente do
 *      violeta dos filetes de domínio.
 *
 * O `title` carrega o `because` — a condição que produziu a frase. Não vai no
 * corpo porque o corpo é para ler; isto é para auditar quando alguém duvidar.
 */

import OracleSigil from './OracleSigil';
import type { OracleNote as Note } from './oracleRead';

export default function OracleNotes({ notes }: { notes: Note[] }) {
  if (!notes.length) return null;

  return (
    <section className="cc-oracle" aria-label="Leitura do Oráculo">
      <h3 className="cc-oracle-h">
        {/* amplitude = número de falas: a presença aqui tem a mesma lei da faixa
            — o movimento é função do que há a dizer, nunca constante. */}
        <OracleSigil signals={notes.length} alert={notes.some((n) => n.tone === 'alert')} />
        <span>Oráculo</span>
      </h3>
      {notes.map((n) => (
        <p key={n.key} className="cc-oracle-t" data-kind={n.kind} data-tone={n.tone} title={n.because}>
          {n.text}
        </p>
      ))}
    </section>
  );
}
