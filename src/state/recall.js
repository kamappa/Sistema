import { fmt, today, yday } from './dates.js';

// Revisão Ativa — banco de perguntas + SM-2 + seleção diária. Portado linha a
// linha de legacy/js/recall.js (S passado explícito; QBANK em módulo). As fns
// puras não tocam FX; addXp/plog do answer vivem na ação do store.

let QBANK = [];
export const bankSize = () => QBANK.length;

// loadQuestionBank (recall.js:7-21) — via import.meta.env.BASE_URL para resolver
// /Sistema/perguntas/ independentemente do caminho atual.
export async function loadRecallBank() {
  const base = import.meta.env.BASE_URL;
  const lotes = [1, 2, 3, 4, 5, 6];
  const results = await Promise.all(lotes.map(async (n) => {
    try {
      const r = await fetch(base + 'perguntas/lote' + n + '.json');
      if (!r.ok) return [];
      return await r.json();
    } catch (e) { return []; }
  }));
  const seen = new Set();
  QBANK = results.flat().filter((q) => {
    if (seen.has(q.id)) { console.warn('Pergunta com id duplicado ignorada:', q.id); return false; }
    seen.add(q.id); return true;
  });
}

const addDays = (dateStr, n) => { const d = new Date(dateStr); d.setDate(d.getDate() + n); return fmt(d); };
export { addDays };
const failCount = (S, id) => { const r = S.recall[id]; return r ? r.seen - r.correct : 0; };
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
export const questionPool = (S) => QBANK.concat(S.customQ || []);
export const findQuestion = (S, id) => QBANK.find((q) => q.id === id) || (S.customQ || []).find((q) => q.id === id);

// SM-2 simplificado (recall.js:51-68).
export function reviewQuestion(S, id, grade) {
  const t = today();
  let r = S.recall[id];
  if (!r) r = S.recall[id] = { seen: 0, correct: 0, lastReview: null, interval: 0, ease: 2.5, due: t };
  r.seen++;
  if (grade === 'fail') { r.interval = 1; r.ease = Math.max(1.3, r.ease - 0.2); }
  else if (grade === 'meh') { r.interval = Math.max(1, Math.round(r.interval * 1.5)); }
  else if (grade === 'ok') { r.correct++; r.interval = r.interval > 0 ? Math.round(r.interval * r.ease) : 1; }
  r.lastReview = t;
  r.due = addDays(t, r.interval);
  return r;
}

function pickDiverse(pool, k, alreadyChosen) {
  const picked = []; const remaining = [...pool];
  while (picked.length < k && remaining.length > 0) {
    const usedThemes = new Set([...alreadyChosen, ...picked].map((q) => q.tema));
    let idx = remaining.findIndex((q) => !usedThemes.has(q.tema));
    if (idx === -1) idx = 0;
    picked.push(remaining[idx]); remaining.splice(idx, 1);
  }
  return picked;
}

function selectRecallQuestions(S, n) {
  n = n || 5;
  const t = today();
  const pool = questionPool(S);
  const overdue = pool.filter((q) => S.recall[q.id] && S.recall[q.id].due <= t)
    .sort((a, b) => { const fa = failCount(S, a.id), fb = failCount(S, b.id); if (fb !== fa) return fb - fa; return S.recall[a.id].due < S.recall[b.id].due ? -1 : 1; });
  const freshQ = shuffle(pool.filter((q) => !S.recall[q.id]));
  const chosen = pickDiverse(overdue, n, []);
  chosen.push(...pickDiverse(freshQ, n - chosen.length, chosen));
  return chosen;
}

// getDailyRecallSet (recall.js:97-105) — muta S.recallToday (uma vez por dia).
export function getDailyRecallSet(S) {
  const t = today();
  if (S.recallToday && S.recallToday.d === t) return S.recallToday.ids.map((id) => findQuestion(S, id)).filter(Boolean);
  const picked = selectRecallQuestions(S, 5);
  S.recallToday = { d: t, ids: picked.map((q) => q.id), results: {} };
  return picked;
}

// bumpStudyStreak (recall.js:166-171) — streak de estudo só quando o lote fecha.
export function bumpStudyStreak(S) {
  const t = today();
  if (S.studyStreak.lastDay === t) return;
  S.studyStreak.count = (S.studyStreak.lastDay === yday()) ? S.studyStreak.count + 1 : 1;
  S.studyStreak.lastDay = t;
}
