// @ts-check
import { SEASON_ARCS, WHISPERS, WH_SEASON } from './config.js';
import { today, yday, diffDays } from './dates.js';

// World Engine — o subconjunto que o motor de XP precisa (multiplicadores).
// Portado linha a linha de legacy/js/world.js:6-27. O resto (sinais vitais,
// recovery, sussurros, o painel) migra com o painel do World Engine.
/** FNV-1a — o gerador determinístico do projeto. @param {string} s @returns {number} */
export function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
/** @param {string} s @returns {number} */
export const seededPct = (s) => hashStr(s) % 100;

/* ── O ANO ESTÁ SEMPRE COBERTO, E AGORA ISSO É VERIFICÁVEL ──────────────
 * Os quatro arcos cobrem os 12 meses: 6-9, 10-11, 12-2, 3-5. A função nunca
 * devolveu `undefined` — mas o `find` diz que pode, e três sítios do
 * `xpMult` liam `a.bonus` sem rede.
 *
 * A verificação corre uma vez, no arranque, e só em desenvolvimento: um mês
 * descoberto é um erro de config que se apanha a programar, não algo que deva
 * rebentar em frente ao Operador a meio de uma sessão. Em produção o fallback
 * segura o Sistema de pé — e nunca chega a ser usado enquanto o config estiver
 * inteiro. */
if (import.meta.env && import.meta.env.DEV) {
  const semArco = [];
  for (let m = 1; m <= 12; m++) if (!SEASON_ARCS.some((a) => a.months.includes(m))) semArco.push(m);
  if (semArco.length) console.error('[world] meses sem arco sazonal:', semArco.join(', '));
}

/**
 * O arco sazonal de hoje. Devolve sempre um — ver a nota acima.
 * @returns {typeof SEASON_ARCS[number]}
 */
export function seasonArcNow() {
  const m = new Date().getMonth() + 1;
  return SEASON_ARCS.find((a) => a.months.includes(m)) ?? SEASON_ARCS[0];
}
// limites do arco sazonal atual (world.js:10-17).
/** @param {typeof SEASON_ARCS[number]} a */
export function seasonBounds(a) {
  const now = new Date(); let sy = now.getFullYear();
  if (a.id === 'winter' && (now.getMonth() + 1) <= 2) sy--;
  const sm = a.months[0], em = a.months[a.months.length - 1];
  const ey = (em < sm) ? sy + 1 : sy;
  return { start: sy + '-' + String(sm).padStart(2, '0') + '-01', end: ey + '-' + String(em).padStart(2, '0') + '-' + String(new Date(ey, em, 0).getDate()).padStart(2, '0') };
}
export function isoWeekKey() { const d = new Date(); const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()); t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7)); const w1 = new Date(t.getFullYear(), 0, 4); const wk = 1 + Math.round(((t.getTime() - w1.getTime()) / 864e5 - 3 + ((w1.getDay() + 6) % 7)) / 7); return t.getFullYear() + 'W' + wk; }
export function doubleXPActive() { const dw = new Date().getDay(); return (dw === 0 || dw === 6) && seededPct('dxp' + isoWeekKey()) < 20; }
/** @param {any} S */
export const rainyActive = (S) => S.weather && S.weather.d === today() && S.weather.rain >= 8;
/** @param {any} S */
export const heatActive = (S) => S.weather && S.weather.d === today() && S.weather.tmax >= 32;

// sussurro do dia (world.js:40) — determinístico por dia, do pool base + sazonal.
/* O parâmetro `S` saiu: estava na assinatura e não era lido. Um argumento que
   não faz nada promete que o sussurro depende do estado — e ele depende só do
   dia e da estação, que é o que o torna determinístico. */
/**
 * O sussurro de hoje. Não é uma frase — é uma MICRO-MISSÃO com domínio e XP,
 * e a primeira anotação que escrevi aqui dizia `string`. Estava errada, e o
 * verificador apanhou-a de imediato: quem lesse a assinatura ficaria a pensar
 * que isto devolve texto, quando devolve uma coisa que se pode cumprir.
 * @returns {{ t: string, attr: string, xp: number }}
 */
export const whisperToday = () => {
  const sazonais = /** @type {Record<string, typeof WHISPERS>} */ (WH_SEASON)[seasonArcNow().id] ?? [];
  const pool = WHISPERS.concat(sazonais);
  return pool[hashStr('wh' + today()) % pool.length] ?? WHISPERS[0];
};

// sinais vitais (world.js:48-60) — estimados dos dados reais.
/** @param {any} S */
export function vitals(S) {
  const last7 = S.history.filter((/** @type {any} */ h) => diffDays(h.d, today()) < 7).reduce((/** @type {number} */ s, /** @type {any} */ h) => s + Math.max(0, h.v), 0);
  const momentum = Math.max(0, Math.min(100, Math.round(last7 / (7 * 45) * 100)));
  const sono = S.oblig.find((/** @type {any} */ h) => h.id === 'o_sono');
  const sonoOk = sono && (sono.lastDone === today() || sono.lastDone === yday());
  const maxStk = Math.max(0, ...S.oblig.map((/** @type {any} */ h) => h.streak), ...S.extras.map((/** @type {any} */ h) => h.streak));
  let burn = 0;
  if (maxStk >= 14) burn += 25; if (maxStk >= 25) burn += 15;
  if (!sonoOk) burn += 30; if ((sono ? sono.streak : 0) === 0) burn += 10;
  if (last7 > 7 * 60) burn += 20;
  burn = Math.min(100, burn);
  return { momentum, burn, recovery: Math.max(0, 100 - burn) };
}

// xpMult(S, attr) — multiplicador de XP: bónus do arco sazonal ativo, Double XP
// de fim de semana, chuva a favor do Saber (world.js:23-27, S passado explícito).
/** @param {any} S @param {string} attr @returns {number} */
export function xpMult(S, attr) {
  let m = 1; const a = seasonArcNow();
  /* Cada arco só declara os domínios que bonifica — o Summer não tem `saber`
     e isso não é omissão, é o desenho: uma estação favorece umas coisas e é
     indiferente às outras. Daí o `Partial`: a chave em falta significa
     "multiplicador 1", que é o que o `if` abaixo já fazia. */
  const bonus = /** @type {Partial<Record<string, number>>} */ (a.bonus);
  if (S.worldArc && S.worldArc.status === 'active' && S.worldArc.id === a.id && bonus[attr]) m *= bonus[attr];
  if (doubleXPActive()) m *= 2;
  if (rainyActive(S) && attr === 'saber') m *= 1.15;
  return m;
}
