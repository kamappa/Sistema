import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';
import { fresh } from '../state/fresh.js';
import { normalize } from '../state/normalize.js';
import { today, yday, fmt } from '../state/dates.js';
import { AM, PRI, OST, TIER_KEY, RECALL_THEMES } from '../state/config.js';
import { xpMult, seasonArcNow, seasonBounds, whisperToday } from '../state/world.js';
import { addXp, plog, unlog } from '../state/engine.js';
import { triage } from '../state/objectives.js';
import { loadRecallBank, getDailyRecallSet, reviewQuestion, findQuestion, bumpStudyStreak } from '../state/recall.js';
import { TLINES, KLINE, PROG } from '../state/config.js';
import { consecTrained } from '../state/training.js';
import { calcHours } from '../state/sleep.js';
import { DEBUFFS, TITLES_REAL } from '../state/config.js';
import { titleProg } from '../state/titles.js';
import { guessEvType } from '../state/calendar.js';

// Store central do Sistema (Missão 25 · Fase 1 — a casca viva).
// Espelha o app_state (o antigo global `S`) e a cola de persistência do antigo
// auth.js: resolve sessão, carrega (nuvem se autenticado, senão localStorage,
// senão fresh), normaliza e persiste (localSave imediato + cloudSave com
// debounce 900ms — réplica exata de auth.js:76). A LÓGICA de estado (fresh/
// normalize) vive em src/state e é portada linha a linha. Ainda sem painéis:
// as ações do motor (addXp, toggleHabit, ...) entram nas fases seguintes.

const KEY = 'sistema_daniel_v1'; // auth.js:10
let syncTimer = null;

function localLoad() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
function localSave(S) { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

async function cloudLoad(user) {
  const { data, error } = await supabase.from('app_state').select('state').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return data ? data.state : null;
}
async function cloudSave(user, S) {
  const { error } = await supabase.from('app_state').upsert({ user_id: user.id, state: S, updated_at: new Date().toISOString() });
  return !error;
}

export const useStore = create((set, get) => ({
  S: null,
  user: null,
  sync: 'local',      // 'ok' | 'saving' | 'err' | 'local' (espelha setSync do auth.js)
  booted: false,      // já resolveu sessão + (tentou) carregar estado
  initStarted: false, // guarda contra o duplo-invoke do StrictMode
  radar: [],          // radar_items (Oráculo · Fase 14)
  report: null,       // último oracle_report

  setS: (S) => set({ S }),

  // Espelha init() do auth.js: se houver sessão, entra direto; senão mostra o
  // gate de auth (booted=true, S=null) e espera login/offline.
  init: async () => {
    if (get().initStarted) return;
    set({ initStarted: true });
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) { set({ user: session.user }); await get().boot(); return; }
      } catch (e) {}
    }
    set({ booted: true });
  },

  // Espelha bootState() do auth.js (sem as chamadas ao motor/painéis — ver
  // normalize.js): carrega → normaliza → localSave → cloudSave/local.
  boot: async () => {
    const user = get().user;
    let cloud = null;
    if (user) { try { cloud = await cloudLoad(user); } catch (e) { set({ sync: 'err' }); } }
    let S;
    if (cloud) { S = cloud; }
    else { const raw = localLoad(); if (raw) { try { S = JSON.parse(raw); } catch (e) { S = fresh(); } } else S = fresh(); }
    S = normalize(S);
    // Revisão Ativa (Fase 7): carrega o banco e constrói o set do dia antes do
    // 1º render (o que o antigo bootState fazia com loadQuestionBank +
    // getDailyRecallSet). Falha de fetch degrada para set vazio, sem derrubar.
    try { await loadRecallBank(); getDailyRecallSet(S); } catch (e) {}
    set({ S, booted: true });
    get().fetchWeather(); // meteo real, fire-and-forget (World Engine · Fase 13)
    if (user) get().loadOracleData(); // Radar + relatório do Oráculo (Fase 14)
    localSave(S);
    if (user) { const ok = await cloudSave(user, S); set({ sync: ok ? 'ok' : 'err' }); }
    else set({ sync: 'local' });
  },

  // Espelha save() do auth.js:76 — local imediato, nuvem com debounce.
  save: () => {
    const S = get().S; if (!S) return;
    localSave(S);
    const user = get().user;
    if (user) {
      set({ sync: 'saving' });
      clearTimeout(syncTimer);
      syncTimer = setTimeout(async () => {
        const ok = await cloudSave(user, get().S);
        set({ sync: ok ? 'ok' : 'err' });
      }, 900);
    }
  },

  login: async (email, password) => {
    if (!supabase) return { error: 'Sem ligação ao Supabase.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message === 'Invalid login credentials' ? 'Credenciais inválidas.' : error.message };
    set({ user: data.user });
    await get().boot();
    return {};
  },

  signup: async (email, password) => {
    if (!supabase) return { error: 'Sem ligação ao Supabase.' };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.session) { set({ user: data.user }); await get().boot(); return {}; }
    return { info: 'Conta criada. Confirma o email que recebeste e depois entra.' };
  },

  // goOffline() do auth.js:60 — sem conta, estado só local.
  offline: async () => { set({ user: null }); await get().boot(); },

  // doLogout() do auth.js:61 — na Fase 1 sem a animação sys-sleep (é de UI/HUD).
  logout: async () => { if (supabase) await supabase.auth.signOut(); location.reload(); },

  // ===== AÇÕES DO MOTOR (Fase 5) =====
  // toggleHabit — porto de engine.js:64-85. Marca/desmarca um hábito: streak
  // com memória undo, pico histórico datado, XP com bónus de streak × xpMult;
  // desmarcar devolve o valor EXATO gravado (lastGain). FX (floatXP/toast/
  // cardWave) deferido. set({S:{...S}}) força o re-render do React sobre a
  // mutação em-lugar do motor; save() persiste + o palco reage pelo Bus.
  toggleHabit: (list, id) => {
    const S = get().S;
    const h = S[list].find((x) => x.id === id); if (!h) return;
    const done = h.lastDone === today();
    if (!done) {
      h.undo = { streak: h.streak, lastDone: h.lastDone, peak: S.streakPeak || null };
      h.streak = (h.lastDone === yday()) ? h.streak + 1 : 1; h.lastDone = today();
      if (!S.streakPeak || h.streak > S.streakPeak.v) S.streakPeak = { v: h.streak, d: today(), h: h.name };
      const bonus = Math.min(h.streak, 10); const g = Math.round((h.xp + bonus) * xpMult(S, h.attr)); h.lastGain = g;
      addXp(S, h.attr, g); plog(S, h.name, g);
    } else {
      const back = (h.lastGain !== undefined && h.lastGain !== null) ? h.lastGain : h.xp;
      addXp(S, h.attr, -back); unlog(S, h.name, today());
      if (h.undo) { h.streak = h.undo.streak; h.lastDone = h.undo.lastDone; if (h.undo.peak !== undefined) S.streakPeak = h.undo.peak; delete h.undo; }
      else { h.lastDone = null; h.streak = Math.max(0, h.streak - 1); }
    }
    set({ S: { ...S } }); get().save();
  },

  // addHabit — porto de engine.js:101-106. Extra personalizado (id 'c...', 8 XP).
  // Trava do Sistema aos 14 extras (devolve erro; o toast é do fx, deferido).
  addHabit: (text, attr) => {
    const S = get().S; const t = (text || '').trim(); if (!t) return { error: 'vazio' };
    if (S.extras.length >= 14) return { error: 'limite' };
    S.extras.push({ id: 'c' + Date.now(), name: t, attr, xp: 8, streak: 0, lastDone: null, lastGain: 0 });
    set({ S: { ...S } }); get().save(); return {};
  },

  // delHabit — porto de engine.js:107. Só extras (id 'c...').
  delHabit: (id) => { const S = get().S; S.extras = S.extras.filter((h) => h.id !== id); set({ S: { ...S } }); get().save(); },

  // ===== MISSÕES / OBJETIVOS-MESTRA (Fase 6) =====
  // addObjective — porto de objetivos.js:29-40. Triagem automática (AUTO) ou
  // manual de prioridade/área. O toast "Triagem do Sistema" é fx (deferido);
  // devolve a triagem para a UI mostrar se quiser.
  addObjective: ({ title, deadline, priSel, areaSel }) => {
    const S = get().S; const t = (title || '').trim(); if (!t) return { error: 'vazio' };
    const dl = deadline || null;
    const tr = triage(t, dl);
    let pri = TIER_KEY[priSel], auto = false, area = areaSel;
    if (priSel === 'AUTO') { pri = tr.imp; auto = true; }
    if (areaSel === 'AUTO') area = tr.area || 'oficio';
    S.objectives.push({ id: 'o' + Date.now(), title: t, area, pri, auto, deadline: dl, status: 'pend', created: today(), tags: tr.tags });
    set({ S: { ...S } }); get().save();
    return { triaged: auto || areaSel === 'AUTO', pri, area, why: tr.why };
  },

  // delObjective — porto de objetivos.js:41-50. Apagar missão FEITA reverte o XP
  // exato + Sombra + registo (Fuga 1), com confirmação (não é fx — é o gate de
  // integridade "o sistema nunca mente").
  delObjective: (id) => {
    const S = get().S; const o = S.objectives.find((x) => x.id === id);
    if (o && o.status === 'done') {
      const p = PRI[o.pri];
      if (!window.confirm('Esta missão está FEITA. Apagar reverte o XP ganho (−' + p.xp + ' ' + AM[o.area].name + '), remove a Sombra e a entrada do registo — como se nunca tivesse existido. Confirmar?')) return;
      addXp(S, o.area, -p.xp); unlog(S, '🗡 ARISE: ' + o.title, o.doneDate);
      S.shadows = S.shadows.filter((s) => s.ref !== id);
    }
    S.objectives = S.objectives.filter((x) => x.id !== id);
    set({ S: { ...S } }); get().save();
  },

  // cycleObj — porto de objetivos.js:51-64. pend → doing → done. Concluir invoca
  // A R I S E: XP da prioridade, Sombra datada, registo. Regredir de done reverte
  // exato. Cinematográfico/toast/floatXP/onda = fx (deferido).
  cycleObj: (id) => {
    const S = get().S; const o = S.objectives.find((x) => x.id === id); if (!o) return;
    const next = OST[(OST.indexOf(o.status) + 1) % OST.length];
    if (next === 'done') {
      const p = PRI[o.pri]; addXp(S, o.area, p.xp); o.doneDate = today();
      S.shadows.push({ id: 's' + Date.now(), ref: o.id, name: o.title, lvl: p.lvl, d: today() });
      plog(S, '🗡 ARISE: ' + o.title, p.xp);
    }
    if (o.status === 'done' && next !== 'done') {
      const p = PRI[o.pri]; addXp(S, o.area, -p.xp); unlog(S, '🗡 ARISE: ' + o.title, o.doneDate);
      S.shadows = S.shadows.filter((s) => s.ref !== o.id); delete o.doneDate;
    }
    o.status = next; set({ S: { ...S } }); get().save();
  },

  // ===== REVISÃO ATIVA (Fase 7) =====
  // answerRecall — porto de recall.js:151-165. SM-2 + XP de Saber (×xpMult) +
  // registo; fecha o lote → streak de estudo. FX (floatXP/toast) deferido.
  answerRecall: (id, grade) => {
    const S = get().S; const q = findQuestion(S, id); if (!q) return;
    reviewQuestion(S, id, grade);
    S.recallToday.results[id] = grade;
    const gain = Math.round((8 + (grade === 'ok' ? 4 : 0)) * xpMult(S, 'saber'));
    addXp(S, 'saber', gain);
    const th = RECALL_THEMES[q.tema] || { label: q.tema };
    plog(S, '📖 Revisão · ' + th.label, gain);
    if (S.recallToday.ids.every((qid) => qid in S.recallToday.results)) bumpStudyStreak(S);
    set({ S: { ...S } }); get().save();
  },

  // addCustomQuestion — porto de recall.js:36-49 (id 'meu-...'). Entra na mesma
  // rotação/SM-2 via questionPool. Toast de "incompleta" é fx (devolve erro).
  addCustomQuestion: ({ tema, dif, ref, q, a }) => {
    const S = get().S; if (!q || !q.trim() || !a || !a.trim()) return { error: 'incompleto' };
    S.customQ.push({ id: 'meu-' + Date.now(), tema, dif, q: q.trim(), a: a.trim(), ref: (ref && ref.trim()) || '—' });
    set({ S: { ...S } }); get().save(); return {};
  },

  // ===== TREINO (Fase 8) =====
  // finishTraining — porto de treino.js:9-52. Lê o formulário (form em vez do
  // DOM), avança passos (3×alvo limpo; kegel = 3 dias distintos), XP com teto
  // diário (Fuga 2: 1ª sessão inteira, 2ª a metade, 3ª+ a zero — registo sempre
  // guardado). Toasts/floatXP = fx (deferido); devolve o resumo p/ a UI.
  finishTraining: (form) => {
    const S = get().S;
    const lines = {}, adv = []; let logged = 0;
    TLINES.forEach((L) => {
      const rv = parseInt(form.lines?.[L.id]?.reps) || 0;
      const fv = form.lines?.[L.id]?.feel || 'ok';
      if (rv > 0) {
        logged++; const idx = S.training.prog[L.id]; const st = PROG[L.id][idx];
        lines[L.id] = { step: idx, ex: st.n, reps: rv, feel: fv };
        if (rv >= st.t && fv !== 'd' && idx < PROG[L.id].length - 1) { S.training.prog[L.id]++; adv.push(L.n + ' → ' + PROG[L.id][idx + 1].n); }
      }
    });
    if (form.kegel?.done) {
      logged++; const idx = S.training.prog.kegel; const st = PROG.kegel[idx]; const fv = form.kegel.feel || 'ok';
      lines.kegel = { step: idx, ex: st.n, cyc: st.cyc, feel: fv };
      if (fv !== 'd' && idx < PROG.kegel.length - 1) {
        const days = new Set(S.training.sessions.filter((s) => s.lines && s.lines.kegel && s.lines.kegel.step === idx && s.lines.kegel.feel !== 'd').map((s) => s.d));
        days.add(today());
        if (days.size >= 3) { S.training.prog.kegel++; adv.push(KLINE.n + ' → ' + PROG.kegel[idx + 1].n); }
      }
    }
    if (!logged) return { error: 'sem-registo' };
    const extra = !!form.extra; const notes = (form.notes || '').trim();
    const consec = consecTrained(S);
    const nToday = S.training.sessions.filter((s) => s.d === today()).length;
    const fator = nToday === 0 ? 1 : nToday === 1 ? 0.5 : 0;
    let xp = Math.round((15 + logged * 6) * xpMult(S, 'corpo') * fator); let extraOk = false;
    if (extra) {
      if (consec >= 3) { /* teto: 4º dia seguido, extra sem bónus (toast deferido) */ }
      else { extraOk = true; xp += Math.round(10 * fator); const dg = Math.round(5 * fator); if (dg) addXp(S, 'disciplina', dg); }
    }
    if (xp) addXp(S, 'corpo', xp);
    const advXp = adv.length ? Math.round(30 * adv.length * xpMult(S, 'corpo') * fator) : 0;
    if (adv.length) { if (advXp) addXp(S, 'corpo', advXp); }
    S.training.sessions.push({ d: today(), lines, extra: extraOk, notes, adv: adv.length, xp: xp + advXp });
    plog(S, '🏋️ Treino (' + logged + ' linhas' + (extraOk ? ' + extra' : '') + (nToday ? ' · ' + (nToday + 1) + 'ª sessão do dia' : '') + ')', xp + advXp);
    set({ S: { ...S } }); get().save();
    return { logged, adv, xp: xp + advXp, nToday, extraBlocked: extra && consec >= 3 };
  },

  // ===== SONO (Fase 9) =====
  // logSleep — porto de sono.js:7-26. Regista a noite; se no alvo (7,5–9,5h),
  // recente e ainda não premiada (rw), dá +12 Corpo +5 Disciplina e marca o
  // pilar do sono (lastGain=0 — o prémio vive no registo, não é revertível pelo
  // toggle). Retroativo/curto: registo a 0 (anti-farm). Toasts = fx (devolve
  // estado p/ a UI).
  logSleep: ({ bed, wake, q, date }) => {
    const S = get().S;
    const dt = date || today();
    if (!bed || !wake) return { error: 'falta-info' };
    if (dt > today()) return { error: 'futuro' };
    const h = calcHours(bed, wake);
    let L = S.sleep.logs.find((l) => l.d === dt);
    if (L) Object.assign(L, { bed, wake, h, q });
    else { L = { d: dt, bed, wake, h, q, rw: false }; S.sleep.logs.push(L); S.sleep.logs.sort((a, b) => (a.d < b.d ? -1 : 1)); }
    const recent = (dt === today() || dt === yday());
    const res = { h };
    if (h >= 7.5 && h <= 9.5 && !L.rw && recent) {
      L.rw = true; addXp(S, 'corpo', 12); addXp(S, 'disciplina', 5);
      plog(S, '😴 Noite no alvo (' + h + 'h)', 17);
      const so = S.oblig.find((x) => x.id === 'o_sono');
      if (dt === today() && so && so.lastDone !== today()) { so.undo = { streak: so.streak, lastDone: so.lastDone }; so.streak = (so.lastDone === yday()) ? so.streak + 1 : 1; so.lastDone = today(); so.lastGain = 0; }
      res.reward = 17;
    } else if (!recent) { plog(S, '😴 Registo retroativo ' + dt + ' (' + h + 'h)', 0); res.retro = true; }
    else if (h < 7.5) { plog(S, '😴 Noite curta (' + h + 'h)', 0); res.short = true; }
    set({ S: { ...S } }); get().save();
    return res;
  },

  // setSleepT — porto de sono.js:5. Hora-alvo de recolher.
  setSleepT: (k, v) => { const S = get().S; S.sleep[k] = v; set({ S: { ...S } }); get().save(); },

  // ===== ESTADOS / TÍTULOS (Fase 10) =====
  // toggleDebuff — porto de hud.js:15.
  toggleDebuff: (id) => { const S = get().S; S.debuffs[id] = !S.debuffs[id]; set({ S: { ...S } }); get().save(); },

  // applyAntidote — porto de hud.js:16-22. 1× por estado por dia (Fuga 4):
  // repetir não dá efeito nem XP. Desliga o estado, +10 Disciplina, registo.
  applyAntidote: (id) => {
    const S = get().S; S.antidote = S.antidote || {};
    if (S.antidote[id] === today()) return { error: 'ja-usado' };
    S.antidote[id] = today();
    S.debuffs[id] = false; addXp(S, 'disciplina', 10);
    plog(S, 'Antídoto: ' + DEBUFFS.find((d) => d.id === id).name, 10);
    set({ S: { ...S } }); get().save(); return { ok: true };
  },

  // toggleReq — porto de hud.js:38-47. Marca/desmarca evidência de um requisito;
  // 100% desbloqueia o Título Real (datado + registo); regredir re-tranca.
  // floatXP/toast = fx (deferido). Requisitos automáticos não são clicáveis.
  toggleReq: (tid, rid) => {
    const S = get().S; const t = TITLES_REAL.find((x) => x.id === tid); const r = t.reqs.find((x) => x.id === rid); if (r.auto) return;
    S.titleEv[tid] = S.titleEv[tid] || {}; S.titleEv[tid][rid] = !S.titleEv[tid][rid];
    if (titleProg(S, t).pct === 100 && !S.titleUnlocked[tid]) { S.titleUnlocked[tid] = today(); plog(S, '👑 Título real: ' + t.name, 0); }
    if (titleProg(S, t).pct < 100 && S.titleUnlocked[tid]) delete S.titleUnlocked[tid];
    set({ S: { ...S } }); get().save();
  },

  // ===== CALENDÁRIO (Fase 11) =====
  // addEvent — porto de hud.js:79 (tipo AUTO via guessEvType).
  addEvent: ({ date, title, type }) => {
    const S = get().S; const t = (title || '').trim(); if (!date || !t) return { error: 'incompleto' };
    let ty = type; if (ty === 'AUTO') ty = guessEvType(t);
    S.events.push({ id: 'e' + Date.now(), date, title: t, type: ty });
    set({ S: { ...S } }); get().save(); return {};
  },
  // delEvent — porto de hud.js:81.
  delEvent: (id) => { const S = get().S; S.events = S.events.filter((e) => e.id !== id); set({ S: { ...S } }); get().save(); },

  // resetAll — porto de engine.js:86. Recomeço total (com confirmação). Reconstrói
  // o estado normalizado + o set de recall do dia, como um boot fresco.
  resetAll: () => {
    if (!window.confirm('Reiniciar todo o progresso? Não há volta atrás.')) return;
    const S = normalize(fresh()); try { getDailyRecallSet(S); } catch (e) {}
    set({ S: { ...S } }); get().save();
  },

  // ===== WORLD ENGINE (Fase 13) =====
  // fetchWeather — porto de world.js:29-37. Meteo real (Open-Meteo, V.N.Famalicão)
  // alimenta o Solar/rainy/heat. Fire-and-forget no boot; falha degrada.
  fetchWeather: async () => {
    const S = get().S; if (S.weather && S.weather.d === today()) return;
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.41&longitude=-8.52&daily=temperature_2m_max,precipitation_sum&forecast_days=1&timezone=auto');
      const j = await r.json();
      S.weather = { d: today(), tmax: j.daily.temperature_2m_max[0], rain: j.daily.precipitation_sum[0] };
      set({ S: { ...S } }); get().save();
      if (window.ambientApply) window.ambientApply();
    } catch (e) {}
  },

  // claimWhisper — porto de world.js:41-45. 1 sussurro/dia; XP ×xpMult + registo.
  claimWhisper: () => {
    const S = get().S; if (S.whisper[today()]) return; const w = whisperToday(S);
    S.whisper[today()] = true; const g = Math.round(w.xp * xpMult(S, w.attr));
    addXp(S, w.attr, g); plog(S, '🌬 ' + w.t, g);
    set({ S: { ...S } }); get().save();
  },

  // startRecovery — porto de world.js:61-66. 2 dias sem penalizações.
  startRecovery: () => {
    const S = get().S; const d = new Date(); d.setDate(d.getDate() + 2);
    S.recovery = { until: fmt(d) }; plog(S, '🌙 Recovery ativado (2 dias)', 0);
    set({ S: { ...S } }); get().save();
  },

  // arcAccept/Later/Ignore — porto de world.js:69-81. Aceitar traz as missões do
  // arco (via triage, prazo no fim do arco) + 15 Mente.
  arcAccept: () => {
    const S = get().S; const a = seasonArcNow(), b = seasonBounds(a);
    S.worldArc = { id: a.id, status: 'active', start: b.start, end: b.end }; let n = 0;
    (a.quests || []).forEach((q, i) => {
      if (S.objectives.some((o) => o.title === q.t)) return;
      const tr = triage(q.t, b.end);
      S.objectives.push({ id: 'o' + Date.now() + '_' + i, title: q.t, area: q.area || tr.area || 'oficio', pri: q.pri || tr.imp, auto: true, deadline: b.end, status: 'pend', created: today(), tags: [a.name.split(' ')[0] + ' Arco', ...(tr.tags || [])], arc: a.id }); n++;
    });
    addXp(S, 'mente', 15); plog(S, 'Arco aceite: ' + a.name, 15);
    set({ S: { ...S } }); get().save(); return { n };
  },
  arcLater: () => { const S = get().S; S.worldArc = { id: seasonArcNow().id, status: 'later', snooze: today() }; set({ S: { ...S } }); get().save(); },
  arcIgnore: () => { const S = get().S; S.worldArc = { id: seasonArcNow().id, status: 'dismissed' }; set({ S: { ...S } }); get().save(); },

  // ===== RADAR + ORÁCULO (Fase 14) =====
  // loadOracleData — porto de radar.js:7-17. Lê radar_items (7d) + o último
  // oracle_report do Supabase. Só com sessão; falha degrada em silêncio.
  loadOracleData: async () => {
    const user = get().user; if (!user || !supabase) return;
    try {
      const since = new Date(); since.setDate(since.getDate() - 7);
      const { data: r } = await supabase.from('radar_items').select('*').gte('d', fmt(since)).order('created_at', { ascending: false }).limit(48);
      const { data: rep } = await supabase.from('oracle_reports').select('report,created_at').order('created_at', { ascending: false }).limit(1);
      set({ radar: r || [], report: (rep && rep[0]) || null });
    } catch (e) {}
  },

  // acceptRadarMission — porto de radar.js:81-88. Cria missão via triage (tag
  // 📡 Do Radar) e marca radarAccepted. Toast/floatXP = fx.
  acceptRadarMission: (id) => {
    const S = get().S; const it = get().radar.find((x) => x.id === id); if (!it || !it.missao || !it.missao.t) return;
    if (S.radarAccepted[id]) return { error: 'ja-aceite' };
    const m = it.missao; const tr = triage(m.t, m.deadline || null);
    S.objectives.push({ id: 'o' + Date.now(), title: m.t, area: (m.area && AM[m.area]) ? m.area : (tr.area || 'oficio'), pri: (m.pri && PRI[m.pri]) ? m.pri : tr.imp, auto: true, deadline: m.deadline || null, status: 'pend', created: today(), tags: ['📡 Do Radar', ...(tr.tags || [])], oracle: true });
    S.radarAccepted[id] = true;
    set({ S: { ...S } }); get().save(); return {};
  },

  // acceptOracleMission — porto de radar.js:74-80 (tag 🔮 Do Oráculo).
  acceptOracleMission: (i) => {
    const S = get().S; const r = get().report && get().report.report; if (!r || !r.missoes_propostas || !r.missoes_propostas[i]) return;
    const m = r.missoes_propostas[i]; const tr = triage(m.t || 'Missão do Oráculo', m.deadline || null);
    S.objectives.push({ id: 'o' + Date.now(), title: m.t || 'Missão do Oráculo', area: (m.area && AM[m.area]) ? m.area : (tr.area || 'oficio'), pri: (m.pri && PRI[m.pri]) ? m.pri : tr.imp, auto: true, deadline: m.deadline || null, status: 'pend', created: today(), tags: ['🔮 Do Oráculo', ...(tr.tags || [])], oracle: true });
    set({ S: { ...S } }); get().save();
  },
}));

// Ponte para o palco WebGL (Fase 2): o loop rAF do palco lê o estado FORA do
// ciclo React via window.__store.getState().S — por isso Zustand, e não
// Context/useReducer.
if (typeof window !== 'undefined') window.__store = useStore;
