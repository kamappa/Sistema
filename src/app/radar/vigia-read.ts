/* VIGIA DE ESTÁGIOS — a avaliação de qualidade.
 * Missão 13 · o item que ficou por fechar desde 2026-07-19.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O ITEM, TAL COMO FICOU ESCRITO NO SPEC                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 *   "Verificar após a 1ª corrida real: qualidade das vagas e ruído — afinar a
 *    query se vier lixo."
 *
 * A Vigia está **deployada e a correr todos os dias às 06:30 UTC** desde essa
 * data. Gasta uma chamada com pesquisa por dia. Ninguém olhou.
 *
 * O problema de "ninguém olhou" não é preguiça — é que olhar a sério exige
 * abrir a lista, comparar itens, procurar repetições, verificar se as vagas têm
 * prazo, e perceber se as fontes se repetem. Feito à mão, é meia hora que nunca
 * há. Feito assim, são segundos.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ISTO NÃO DECIDE, MEDE                                               ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Não afina a query, não apaga itens, não classifica um item como lixo. Conta e
 * mostra — a decisão de "isto está bom ou tenho de mexer na query" é do Daniel,
 * e depende de coisas que este ficheiro não sabe: se as vagas eram adequadas,
 * se ele se candidatou, se valeu a pena.
 *
 * O que este ficheiro sabe medir são os **sinais de ruído mecânicos**, e esses
 * são exatamente os que se veem mal a olho.
 */

import { RAREA } from '../../state/config.js';
import { today, diffDays } from '../../state/dates.js';
import { cont, dias as nDias } from '../shared/plural';

/** Um item do Radar, na forma em que chega de `radar_items`. */
export interface RadarItem {
  id?: string;
  d?: string;
  title?: string;
  source?: string;
  url?: string;
  summary?: string;
  relevance?: string;
  area?: string;
  missao?: { t?: string; deadline?: string | null; pri?: string; area?: string } | null;
  created_at?: string;
}

export interface VigiaQuality {
  /** Quantos itens no período analisado. */
  total: number;
  /** Só os da Vigia — `vaga` e `evento`. O resto do Radar são notícias e não é
   *  o que esta missão vigia. */
  vigia: number;
  vagas: number;
  eventos: number;

  /** ── SINAIS DE RUÍDO ─────────────────────────────────────────────── */
  /** Itens com o mesmo URL. O dedupe de 30 dias devia impedir isto; se
   *  aparecerem, o dedupe tem um buraco. */
  urlsRepetidos: { url: string; vezes: number }[];
  /** Títulos quase iguais com URLs diferentes — a mesma vaga em dois sítios.
   *  O dedupe por URL não apanha isto por desenho, e é o ruído mais provável. */
  titulosParecidos: { a: string; b: string }[];
  /** Vagas sem `missao` anexada. A regra da missão diz que **toda** a vaga leva
   *  uma missão P1 "Candidatar" obrigatória — uma vaga sem missão é a regra a
   *  falhar, não uma preferência. */
  vagasSemMissao: RadarItem[];
  /** Vagas cuja missão não tem prazo. Não é defeito — o prazo só entra se for
   *  detetável — mas a proporção diz se as fontes estão a ser úteis. */
  vagasSemPrazo: number;
  /** Itens sem URL. Sem URL não há como verificar, e a regra da missão diz
   *  "só URLs da pesquisa dessa conversa". */
  semUrl: RadarItem[];
  /** Fontes distintas e quantas vezes cada uma aparece. Uma fonte a dominar é
   *  sinal de que a query encontrou um agregador e ficou por lá. */
  fontes: { fonte: string; vezes: number }[];
  /** Dias do período sem um único item da Vigia. Silêncio prolongado pode ser
   *  o mercado ou pode ser a query a falhar — o número não distingue, mas
   *  mostra que a pergunta existe. */
  diasSemVigia: number;

  /** Áreas encontradas que não existem no `RAREA` — a Edge Function a inventar
   *  categorias. */
  areasDesconhecidas: string[];

  /** Vazio quando há dados. */
  absence: string;
}

const normaliza = (s: string) => s.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Semelhança por palavras partilhadas. Deliberadamente simples: o objetivo é
 *  levantar a suspeita para um humano olhar, não decidir que dois itens são o
 *  mesmo. Um algoritmo esperto aqui produziria confiança a mais. */
function parecidos(a: string, b: string): boolean {
  const pa = new Set(normaliza(a).split(' ').filter((w) => w.length > 3));
  const pb = new Set(normaliza(b).split(' ').filter((w) => w.length > 3));
  if (pa.size < 3 || pb.size < 3) return false;
  let comuns = 0;
  for (const w of pa) if (pb.has(w)) comuns++;
  return comuns / Math.min(pa.size, pb.size) >= 0.7;
}

export function readVigia(itens: RadarItem[] | null, diasPeriodo = 7): VigiaQuality {
  const vazio = (absence: string): VigiaQuality => ({
    total: 0, vigia: 0, vagas: 0, eventos: 0,
    urlsRepetidos: [], titulosParecidos: [], vagasSemMissao: [], vagasSemPrazo: 0,
    semUrl: [], fontes: [], diasSemVigia: diasPeriodo, areasDesconhecidas: [], absence,
  });

  if (!Array.isArray(itens)) {
    return vazio('Sem dados do Radar. É preciso sessão iniciada — o Radar vive no Supabase, não no estado local.');
  }
  if (!itens.length) {
    return vazio('O Radar respondeu e veio vazio. Isso pode ser mercado parado ou a query a falhar; este número não distingue os dois.');
  }

  const daVigia = itens.filter((i) => i.area === 'vaga' || i.area === 'evento');
  const vagas = daVigia.filter((i) => i.area === 'vaga');

  /* URLs repetidos */
  const porUrl = new Map<string, number>();
  for (const i of daVigia) { const u = (i.url || '').trim(); if (u) porUrl.set(u, (porUrl.get(u) || 0) + 1); }
  const urlsRepetidos = [...porUrl.entries()].filter(([, n]) => n > 1)
    .map(([url, vezes]) => ({ url, vezes })).sort((a, b) => b.vezes - a.vezes);

  /* Títulos parecidos com URLs diferentes */
  const titulosParecidos: { a: string; b: string }[] = [];
  for (let x = 0; x < daVigia.length; x++) {
    for (let y = x + 1; y < daVigia.length; y++) {
      const A = daVigia[x], B = daVigia[y];
      if (!A.title || !B.title) continue;
      if ((A.url || '') === (B.url || '')) continue;
      if (parecidos(A.title, B.title)) titulosParecidos.push({ a: A.title, b: B.title });
    }
  }

  /* Fontes */
  const porFonte = new Map<string, number>();
  for (const i of daVigia) { const f = (i.source || 'sem fonte').trim(); porFonte.set(f, (porFonte.get(f) || 0) + 1); }

  /* Dias cobertos */
  const dias = new Set(daVigia.map((i) => (i.d || i.created_at || '').slice(0, 10)).filter(Boolean));
  let comItem = 0;
  for (let k = 0; k < diasPeriodo; k++) {
    const alvo = [...dias].some((d) => diffDays(d, today()) === k);
    if (alvo) comItem++;
  }

  const conhecidas = new Set(Object.keys(RAREA as Record<string, unknown>));
  const areasDesconhecidas = [...new Set(itens.map((i) => i.area || '').filter((a) => a && !conhecidas.has(a)))];

  return {
    total: itens.length,
    vigia: daVigia.length,
    vagas: vagas.length,
    eventos: daVigia.length - vagas.length,
    urlsRepetidos,
    titulosParecidos,
    /* A regra da Missão 13 é explícita: toda a vaga leva missão P1 obrigatória.
       Uma vaga sem missão não é uma preferência falhada — é a regra a falhar. */
    vagasSemMissao: vagas.filter((v) => !v.missao || !v.missao.t),
    vagasSemPrazo: vagas.filter((v) => v.missao && v.missao.t && !v.missao.deadline).length,
    semUrl: daVigia.filter((i) => !(i.url || '').trim()),
    fontes: [...porFonte.entries()].map(([fonte, vezes]) => ({ fonte, vezes })).sort((a, b) => b.vezes - a.vezes),
    diasSemVigia: diasPeriodo - comItem,
    areasDesconhecidas,
    absence: '',
  };
}

/** O veredicto por extenso — factos, e a pergunta que só o Daniel responde. */
export function explainVigia(q: VigiaQuality): string[] {
  if (q.absence) return [q.absence];
  const L: string[] = [];
  L.push(`${cont(q.vigia, 'item', 'itens')} da Vigia em ${q.total} do Radar — `
    + `${cont(q.vagas, 'vaga', 'vagas')}, ${cont(q.eventos, 'evento', 'eventos')}.`);
  if (q.diasSemVigia) L.push(`${nDias(q.diasSemVigia)} do período sem um único item da Vigia.`);
  if (q.urlsRepetidos.length) L.push(`${cont(q.urlsRepetidos.length, 'URL repetido', 'URLs repetidos')} — o dedupe de 30 dias tem um buraco.`);
  if (q.titulosParecidos.length) L.push(`${cont(q.titulosParecidos.length, 'par', 'pares')} de títulos quase iguais com URLs diferentes — a mesma vaga em sítios diferentes.`);
  if (q.vagasSemMissao.length) L.push(`${cont(q.vagasSemMissao.length, 'vaga', 'vagas')} SEM missão anexada — a regra diz que é obrigatória.`);
  if (q.semUrl.length) L.push(`${cont(q.semUrl.length, 'item', 'itens')} sem URL — não há como verificar.`);
  if (q.areasDesconhecidas.length) L.push(`${q.areasDesconhecidas.length === 1 ? 'área' : 'áreas'} fora do RAREA: ${q.areasDesconhecidas.join(', ')}.`);
  if (q.fontes.length) {
    const top = q.fontes[0];
    if (q.vigia && top.vezes / q.vigia > 0.5) L.push(`${top.fonte} é ${Math.round(top.vezes / q.vigia * 100)}% dos itens — a query pode ter ficado presa num agregador.`);
  }
  if (q.vagas) L.push(`${q.vagasSemPrazo} de ${cont(q.vagas, 'vaga', 'vagas')} sem prazo detetado.`);
  /* A pergunta que os números não respondem, e que é a que decide a missão. */
  L.push('O que isto não mede: se as vagas eram adequadas e se valeu a pena candidatar-se. Essa é a tua.');
  return L;
}
