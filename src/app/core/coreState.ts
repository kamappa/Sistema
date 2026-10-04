/* Núcleo — máquina de estados.
 * Missão 26 · Fase C.
 *
 * O Núcleo é o centro estrutural do Sistema, e até aqui só existia dentro da
 * zona Universo (`constellation.js`, `mkCore`). Na shell era uma letra parada
 * com o rank. Uma letra parada não comunica estado nenhum.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  LEI: cada estado nasce de um facto verificável no estado real.      ║
 * ║  Nenhum é decorativo, nenhum é temporizado, nenhum é inventado.      ║
 * ║  Se não houver evidência, o Núcleo fica em `ambient` — nunca se      ║
 * ║  inventa drama para o ecrã ter movimento.                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * PRECEDÊNCIA. Os estados não se somam: um Núcleo só pode dizer uma coisa de
 * cada vez, e a ordem abaixo é deliberada. O que exige ação humana imediata
 * ganha ao que é bonito de mostrar.
 */

import { vitals } from '../../state/world.js';

export type CoreState =
  | 'dormant'     // sem sessão ou sem qualquer dado — o mundo ainda não começou
  | 'ambient'     // repouso. O estado por omissão, e o mais comum
  | 'listening'   // o Operador está a escrever para o Oráculo
  | 'processing'  // o Oráculo está a responder (ocBusy)
  | 'insight'     // há um relatório por ler
  | 'warning'     // prazos vencidos
  | 'levelup'     // o nível global subiu desde a última leitura
  | 'critical';   // risco de burnout alto, medido por vitals()

export interface CoreReading {
  state: CoreState;
  /** o facto que justifica o estado. Aparece no title — o Sistema mostra provas. */
  evidence: string;
  /** 0–1. Intensidade proporcional, não um degrau arbitrário. */
  charge: number;
}

export function readCore(input: {
  S: Record<string, any> | null;
  ocBusy?: boolean;
  report?: unknown;
  composing?: boolean;
  levelJumped?: boolean;
}): CoreReading {
  const { S, ocBusy, report, composing, levelJumped } = input;

  // 1. Sem estado não há mundo. Não é um erro — é o princípio.
  if (!S) return { state: 'dormant', evidence: 'Sem sessão.', charge: 0 };

  // 2. Burnout ganha a tudo. É o único estado sobre o CORPO do Operador, e
  //    nenhuma notícia do Sistema é mais importante do que ele parar.
  let burn = 0;
  try {
    burn = vitals(S).burn ?? 0;
  } catch {
    burn = 0; // sem histórico suficiente, não se afirma nada
  }
  if (burn >= 70) {
    return {
      state: 'critical',
      evidence: `Risco de burnout a ${burn}%.`,
      charge: Math.min(1, burn / 100),
    };
  }

  // 3. Estados de interação: acontecem AGORA, e o utilizador está a olhar.
  if (ocBusy) return { state: 'processing', evidence: 'O Oráculo está a responder.', charge: 1 };
  if (composing) return { state: 'listening', evidence: 'À escuta.', charge: 0.5 };

  // 4. Level up: transitório, e só se houve mesmo salto.
  if (levelJumped) return { state: 'levelup', evidence: 'O nível subiu.', charge: 1 };

  // 5. Prazos vencidos — facto duro lido das missões, com a mesma regra da
  //    lista: uma missão concluída não está atrasada.
  const hoje = new Date().toISOString().slice(0, 10);
  const overdue = (S.objectives ?? []).filter(
    (o: { status: string; deadline?: string | null }) =>
      o.status !== 'done' && o.deadline && o.deadline < hoje
  ).length;
  if (overdue > 0) {
    return {
      state: 'warning',
      evidence: `${overdue} ${overdue === 1 ? 'prazo vencido' : 'prazos vencidos'}.`,
      charge: Math.min(1, overdue / 4),
    };
  }

  // 6. Relatório por ler. Boa notícia, e por isso a última — nunca tapa um aviso.
  if (report) return { state: 'insight', evidence: 'Relatório da semana disponível.', charge: 0.6 };

  return { state: 'ambient', evidence: 'Em observação.', charge: 0.12 };
}
