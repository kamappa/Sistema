/* A ESCALA 3 — o que está a alimentar este domínio.
 * Missão 26 · Fase 6C, sexta passagem.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTA VISTA NÃO PODE SER, e é preciso dizê-lo primeiro:        ║
 * ║  "que evidência fez a sétima estrela de Saber". NÃO É SABÍVEL.       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Os níveis vêm de XP acumulado ao longo de meses e o registo guarda catorze
 * entradas. Nenhum campo novo muda isso — a informação nunca existiu. Uma vista
 * que dissesse "esta estrela veio destas missões" estava a inventar, e a
 * primeira lei do projeto é que o Sistema nunca mente.
 *
 * O QUE É SABÍVEL, e é o que interessa: o que está a alimentar o NÍVEL EM
 * CURSO. É a única parte ainda em formação, a única que pode recuar, e a única
 * sobre a qual há uma decisão a tomar hoje. Uma protoestrela a 40% com três
 * entradas de Saber nos últimos dias diz uma coisa; a mesma protoestrela sem
 * nenhuma entrada há uma semana diz outra, e são as duas acionáveis.
 *
 * AS ENTRADAS ANTIGAS NÃO TÊM DOMÍNIO e nunca vão ter — o campo é novo. São
 * contadas e declaradas em vez de escondidas: um registo que aparecesse com
 * menos linhas do que tem seria uma omissão silenciosa.
 */

import { AM, need } from '../../state/config.js';

export interface EvidenceLine {
  /** O que aconteceu, como foi escrito no registo. */
  texto: string;
  /** XP ganho. Pode ser zero — nem toda a evidência dá XP, e isso é verdade
   *  do produto, não uma falha da leitura. */
  ganho: number;
  data: string;
}

export interface EvidenceRead {
  domain: string;
  name: string;
  color: string;
  /** Nível a formar-se e o seu progresso real. */
  level: number;
  xp: number;
  xpNeed: number;
  /** Entradas do registo atribuídas a este domínio, da mais recente à mais
   *  antiga. */
  linhas: EvidenceLine[];
  /** Soma do XP das linhas mostradas. NÃO é o XP do nível: o registo é uma
   *  janela de catorze entradas e o nível pode ter começado antes dela. */
  somaJanela: number;
  /** Quantas entradas do registo não têm domínio atribuído. */
  semAtribuicao: number;
  /** Total de entradas no registo. */
  totalRegisto: number;
}

export function readEvidence(S: Record<string, any> | null, domain: string | null): EvidenceRead | null {
  if (!S || !domain || !AM[domain]) return null;
  const a = AM[domain];
  const st = S.attrs?.[domain];
  if (!st) return null;

  const raw: any[] = Array.isArray(S.log) ? S.log : [];
  const linhas: EvidenceLine[] = [];
  let semAtribuicao = 0;

  for (const e of raw) {
    if (!e) continue;
    // O registo teve duas formas ao longo do projeto: `{text, gain, d}` do
    // `plog` e `{t, v, d}` de estados mais antigos. Ler as duas é mais barato
    // do que migrar dados que já existem no dispositivo do Daniel.
    const texto = e.text ?? e.t ?? '';
    const ganho = typeof e.gain === 'number' ? e.gain : (typeof e.v === 'number' ? e.v : 0);
    if (!e.attr) { semAtribuicao++; continue; }
    if (e.attr !== domain) continue;
    linhas.push({ texto: String(texto), ganho, data: String(e.d ?? '') });
  }

  return {
    domain,
    name: a.name,
    color: a.color,
    level: st.level,
    xp: st.xp,
    xpNeed: need(st.level),
    linhas,
    somaJanela: linhas.reduce((n, l) => n + l.ganho, 0),
    semAtribuicao,
    totalRegisto: raw.length,
  };
}
