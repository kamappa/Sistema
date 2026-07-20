import { AM, KW_HI, KW_LO, KW_AREA, FUN_TAGS, diffTag } from './config.js';
import { daysUntil } from './dates.js';
import { hashStr } from './world.js';

// Triagem automática de missões — portada linha a linha de objetivos.js:7-21.
// Regras transparentes (o Oráculo refina depois): palavras-chave de alto/baixo
// impacto, prazo aperta a prioridade, área por palavra-chave, tags (dificuldade
// + tag divertida determinística). Pura — não toca em S.
export function triage(title, deadline) {
  const t = title.toLowerCase(); const why = [];
  const hi = KW_HI.find((k) => t.includes(k)), lo = KW_LO.find((k) => t.includes(k));
  let imp = hi ? 'P1' : lo ? 'P3' : 'P2';
  if (hi) why.push('"' + hi + '"'); if (lo && !hi) why.push('tarefa do dia-a-dia');
  if (deadline) {
    const d = daysUntil(deadline);
    why.push(d < 0 ? 'já atrasado' : d === 0 ? 'prazo é hoje' : 'prazo em ' + d + 'd');
    if (d <= 2 && imp !== 'P1') { imp = (imp === 'P3') ? 'P2' : 'P1'; }
    else if (d <= 7 && imp === 'P3') imp = 'P2';
  }
  let area = null;
  for (const pair of KW_AREA) { const k = pair[1].find((x) => t.includes(x)); if (k) { area = pair[0]; why.push(AM[pair[0]].name + ' ("' + k.trim() + '")'); break; } }
  const tags = [diffTag(t)];
  if (hashStr(t) % 3 === 0) tags.push(FUN_TAGS[hashStr('f' + t) % FUN_TAGS.length]);
  return { imp, area, tags, why: why.join(' · ') || 'sem sinais fortes — peso médio' };
}
