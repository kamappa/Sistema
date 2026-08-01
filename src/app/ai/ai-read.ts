/* AI GOVERNANCE — o read model do inventário.
 * Missão 29 · Fase 1.
 *
 * Uma função, um resultado. Não escreve, não classifica por lei, não avisa
 * ninguém. Diz o que está no inventário e o que lhe falta.
 *
 * A pergunta que este ficheiro responde é a primeira de qualquer auditoria de
 * IA, e é sempre a mesma: **o que é que usam, e quem verifica?**
 */

import { AI_USES_KEY, REVIEW_DAYS } from './aiModel';
import type { AiInventory, AiUse } from './aiModel';
import { today, diffDays } from '../../state/dates.js';
import { pl, dias as nDias } from '../shared/plural';

const RISCOS = new Set(['baixo', 'medio', 'alto', 'por-avaliar']);
const SUPERVISOES = new Set(['antes', 'depois', 'nenhum', 'por-definir']);

/** Normaliza um registo cru. Devolve `null` quando não é um uso válido —
 *  mesma regra do World Engine II e do Vault: prova incompleta não entra. */
function normaliza(raw: any): AiUse | null {
  if (!raw || typeof raw !== 'object') return null;
  const id = typeof raw.id === 'string' ? raw.id.trim() : '';
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  if (!id || !name) return null;
  const addedAt = typeof raw.addedAt === 'string' && !Number.isNaN(Date.parse(raw.addedAt))
    ? raw.addedAt : '';
  if (!addedAt) return null;

  /* Um campo com valor desconhecido cai para o estado que ADMITE não saber, e
     nunca para o mais benigno. Tratar um risco ilegível como `baixo` seria o
     Sistema a inventar tranquilidade. */
  const risk = RISCOS.has(raw.risk) ? raw.risk : 'por-avaliar';
  const oversight = SUPERVISOES.has(raw.oversight) ? raw.oversight : 'por-definir';

  return {
    id, name,
    purpose: typeof raw.purpose === 'string' ? raw.purpose : '',
    provider: typeof raw.provider === 'string' ? raw.provider : '',
    data: Array.isArray(raw.data) ? raw.data.filter((d: unknown) => typeof d === 'string') : [],
    personalData: raw.personalData === true ? true : raw.personalData === false ? false : null,
    oversight,
    risk,
    /* A avaliação só conta com data. Um `riskAssessedAt` ilegível é o mesmo que
       não haver avaliação — e é assim que aparece na lista de `unassessed`. */
    ...(typeof raw.riskAssessedAt === 'string' && !Number.isNaN(Date.parse(raw.riskAssessedAt))
      ? { riskAssessedAt: raw.riskAssessedAt } : {}),
    ...(typeof raw.evidence === 'string' && raw.evidence.trim() ? { evidence: raw.evidence } : {}),
    addedAt,
    active: raw.active !== false,
  };
}

export function readAi(S: Record<string, any> | null): AiInventory {
  const vazio = (absence: string): AiInventory => ({
    uses: [], active: 0, unassessed: [], overdue: [],
    oversightUnknown: [], personalDataUnassessed: [], absence,
  });

  if (!S) return vazio('Sem estado carregado.');

  const cru = (S as Record<string, unknown>)[AI_USES_KEY];
  if (!Array.isArray(cru)) {
    /* A ausência de inventário não é neutra: é a lacuna que quase todos os
       eventos da Missão 29 esperam. Dizê-lo por extenso evita que um painel
       vazio seja lido como "está tudo bem". */
    return vazio(
      'Não há inventário de IA. Catorze dos dezoito eventos desta missão dependem '
      + 'dele — sem saber que IA é usada, não há risco a rever nem supervisão a '
      + 'verificar. Um inventário vazio e um inventário inexistente não são a '
      + 'mesma coisa, e isto é o segundo.',
    );
  }

  const uses = (cru as any[]).map(normaliza).filter((u): u is AiUse => !!u);
  if (!uses.length) {
    return vazio('Chegaram registos, mas nenhum tinha id, nome e data de entrada.');
  }

  const ativos = uses.filter((u) => u.active);

  /* Sem data de avaliação não há avaliação — independentemente do que o campo
     `risk` diga. Um `risk: 'baixo'` sem data é uma opinião, não uma avaliação. */
  const unassessed = ativos.filter((u) => !u.riskAssessedAt);

  const overdue: { use: AiUse; daysLate: number }[] = [];
  for (const u of ativos) {
    if (!u.riskAssessedAt) continue;
    const prazo = REVIEW_DAYS[u.risk];
    const idade = diffDays(u.riskAssessedAt.slice(0, 10), today());
    if (idade > prazo) overdue.push({ use: u, daysLate: idade - prazo });
  }
  overdue.sort((a, b) => b.daysLate - a.daysLate);

  return {
    uses,
    active: ativos.length,
    unassessed,
    overdue,
    oversightUnknown: ativos.filter((u) => u.oversight === 'por-definir'),
    /* O cruzamento que produz a lista de prioridades real: toca dados pessoais
       E não tem avaliação datada. É por aqui que se começa, não pelo maior. */
    personalDataUnassessed: ativos.filter((u) => u.personalData === true && !u.riskAssessedAt),
    absence: '',
  };
}

/**
 * O inventário por extenso, para o Oráculo poder dizer o que se passa.
 *
 * Nunca afirma conformidade — só descreve o que está registado e o que falta.
 * "Está conforme" é uma conclusão jurídica e o Sistema não a produz.
 */
export function explainAi(inv: AiInventory): string[] {
  if (inv.absence) return [inv.absence];
  /* A concordância vive em `shared/plural` — ver o cabeçalho de lá para saber
     porque é que isto passou a ser um ficheiro e não uma ternária repetida. */
  const s = pl;
  const linhas = [
    `${inv.active} ${s(inv.active, 'utilização de IA ativa', 'utilizações de IA ativas')}, `
    + `de ${inv.uses.length} ${s(inv.uses.length, 'registada', 'registadas')}.`,
  ];
  if (inv.personalDataUnassessed.length) {
    const n = inv.personalDataUnassessed.length;
    linhas.push(`${n} ${s(n, 'toca', 'tocam')} dados pessoais e ${s(n, 'não tem', 'não têm')} avaliação datada — é por aqui que se começa.`);
  }
  if (inv.unassessed.length) linhas.push(`${inv.unassessed.length} sem avaliação de risco datada.`);
  if (inv.overdue.length) {
    const pior = inv.overdue[0];
    const n = inv.overdue.length;
    linhas.push(`${n} com revisão em atraso; a mais antiga há ${nDias(pior.daysLate)}.`);
  }
  if (inv.oversightUnknown.length) {
    linhas.push(`${inv.oversightUnknown.length} sem supervisão humana definida — não se sabe quem verifica.`);
  }
  if (linhas.length === 1) linhas.push('Nada em atraso e nada por avaliar.');
  return linhas;
}
