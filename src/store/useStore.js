import { create } from 'zustand';
import { supabase, SUPABASE_URL, SUPABASE_ANON } from '../lib/supabase.js';
import { fresh } from '../state/fresh.js';
import { normalize } from '../state/normalize.js';
import { today, yday, fmt } from '../state/dates.js';
import { AM, PRI, OST, TIER_KEY, TIER_LABEL, RECALL_THEMES } from '../state/config.js';
import { xpMult, seasonArcNow, seasonBounds, whisperToday } from '../state/world.js';
import { addXp, plog, unlog } from '../state/engine.js';
import { triage } from '../state/objectives.js';
import { loadRecallBank, getDailyRecallSet, reviewQuestion, findQuestion, bumpStudyStreak, addDays } from '../state/recall.js';
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

// FX (Fase 17) — as primitivas visuais vivem em window.* (lib/fx.js), chamadas
// guardadas como no Vanilla ("divergência = bug"). As ações do store correm fora
// do evento de DOM, por isso o floatXP assenta ao centro (o fallback que o
// próprio floatXP já tem); o cardWave/scan precisa do elemento DEPOIS do render
// do React, por isso corre num requestAnimationFrame.
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const fx = (name, ...args) => { if (typeof window !== 'undefined' && window[name]) window[name](...args); };
// SYSTEM EVENT (M26·F6A). Mesma disciplina das outras primitivas de FX: guardada
// por existência, para o motor nunca depender de a casca React estar montada.
// A CHAMADA VEM SEMPRE DEPOIS DE `save()` DEVOLVER TRUE — ver systemEvents.ts.
const sysEvent = (ev) => { if (typeof window !== 'undefined' && window.sysEvent) window.sysEvent(ev); };

/* Dias seguidos com a rotina registada, a contar de hoje para trás. Puro. */
function bodyStreak(dates) {
  if (!dates || !dates.length) return 0;
  const set = new Set(dates); let c = 0; const d = new Date();
  for (;;) { const k = d.toISOString().slice(0, 10); if (set.has(k)) { c++; d.setDate(d.getDate() - 1); } else break; }
  return c;
}
export { bodyStreak };
const afterPaint = (fn) => { if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(() => requestAnimationFrame(fn)); };

function localLoad() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
// M26·F6A — devolve se GUARDOU MESMO. Antes engolia a exceção em silêncio, e um
// localStorage cheio ou bloqueado (modo privado, quota) fazia o Sistema
// continuar como se tivesse gravado. É a mesma classe de mentira estrutural que
// a Fase I apanhou no `loadOracleData`, e agora tem consequência prática: os
// SYSTEM EVENTS só nascem depois desta função dizer que sim.
function localSave(S) { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; } }

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
  fetchErr: null,     // M26: falha ao ir buscar Radar/relatório. NÃO se engole:
                      // sem isto, uma falha de rede mostrava o estado VAZIO, que
                      // diz "não há notícias" quando a verdade é "não consegui
                      // perguntar". São coisas diferentes e o Sistema não mente.
  ocMsgs: [],         // Conselho: log de exibição (não persiste) — Fase 15
  ocBusy: false,

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
    if (user) { get().loadOracleData(); get().fetchSussurro(); } // Oráculo (Fases 14/15)
    localSave(S);
    if (user) { const ok = await cloudSave(user, S); set({ sync: ok ? 'ok' : 'err' }); }
    else set({ sync: 'local' });
  },

  // Espelha save() do auth.js:76 — local imediato, nuvem com debounce.
  // Devolve se a escrita LOCAL passou. Quem quiser anunciar um evento tem de
  // esperar por este true — celebrar antes de guardar seria afirmar uma coisa
  // que ainda podia falhar.
  save: () => {
    const S = get().S; if (!S) return false;
    const okLocal = localSave(S);
    if (!okLocal) set({ sync: 'err' });
    // Publica (ou deita fora) os eventos encenados durante esta ação. É aqui
    // que a regra "o evento nasce depois da escrita" deixa de depender de quem
    // escreve o próximo componente e passa a ser estrutural.
    if (typeof window !== 'undefined' && window.sysCommit) window.sysCommit(okLocal);
    const user = get().user;
    if (user) {
      if (okLocal) set({ sync: 'saving' });
      clearTimeout(syncTimer);
      syncTimer = setTimeout(async () => {
        const ok = await cloudSave(user, get().S);
        set({ sync: ok ? 'ok' : 'err' });
      }, 900);
    }
    return okLocal;
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
    let gained = 0;
    if (!done) {
      h.undo = { streak: h.streak, lastDone: h.lastDone, peak: S.streakPeak || null };
      h.streak = (h.lastDone === yday()) ? h.streak + 1 : 1; h.lastDone = today();
      if (!S.streakPeak || h.streak > S.streakPeak.v) S.streakPeak = { v: h.streak, d: today(), h: h.name };
      const bonus = Math.min(h.streak, 10); const g = Math.round((h.xp + bonus) * xpMult(S, h.attr)); h.lastGain = g;
      addXp(S, h.attr, g); plog(S, h.name, g);
      fx('floatXP', '+' + g + ' XP', AM[h.attr].color);                    // engine.js:74
      gained = g;
    } else {
      const back = (h.lastGain !== undefined && h.lastGain !== null) ? h.lastGain : h.xp;
      addXp(S, h.attr, -back); unlog(S, h.name, today());
      fx('floatXP', '−' + back + ' XP', '#ef4444');
      if (h.undo) { h.streak = h.undo.streak; h.lastDone = h.undo.lastDone; if (h.undo.peak !== undefined) S.streakPeak = h.undo.peak; delete h.undo; }
      else { h.lastDone = null; h.streak = Math.max(0, h.streak - 1); }
    }
    // SYSTEM EVENT (M26·F6A) — encenado aqui, publicado pelo `save()`.
    //
    // Desmarcar não gera evento de propósito: é uma correção de registo, não um
    // acontecimento. Anunciar "desfizeste" seria o Sistema a comentar o
    // Operador em vez de registar o mundo.
    //
    // O toast do HUD saiu daqui: dizia a mesma coisa e era um elemento único no
    // DOM, por isso dois pilares seguidos anunciavam um. A fila resolve isso.
    //
    // Dedupe com o XP total: se o Daniel desmarcar e voltar a marcar no mesmo
    // dia, é um facto novo e tem de poder anunciar-se outra vez.
    if (!done) {
      sysEvent({
        dedupe: 'habit:' + id + ':' + today() + ':' + Math.round(S.totalXP),
        kind: list === 'oblig' ? 'pillar' : 'habit',
        title: list === 'oblig' ? 'Pilar confirmado' : 'Registado',
        subject: h.name,
        color: AM[h.attr].color,
        readings: [
          { label: AM[h.attr].name, value: '+' + gained + ' XP' },
          { label: 'Streak', value: h.streak + (h.streak === 1 ? ' dia' : ' dias') },
        ],
      });
    }
    set({ S: { ...S } }); get().save();
    // onda de conclusão (M12·3B) — depois do render do React, no elemento novo
    if (!done) afterPaint(() => fx('cardWave', document.querySelector('.hab[data-hid="' + id + '"]'), hexA(AM[h.attr].color, .5)));
  },

  // addHabit — porto de engine.js:101-106. Extra personalizado (id 'c...', 8 XP).
  // Trava do Sistema aos 14 extras (devolve erro; o toast é do fx, deferido).
  addHabit: (text, attr) => {
    const S = get().S; const t = (text || '').trim(); if (!t) return { error: 'vazio' };
    if (S.extras.length >= 14) { fx('toast', 'Trava do Sistema', 'Hábitos a mais = nenhum feito. Conclui ou apaga antes de adicionar.', '#fb923c'); return { error: 'limite' }; }
    S.extras.push({ id: 'c' + Date.now(), name: t, attr, xp: 8, streak: 0, lastDone: null, lastGain: 0 });
    set({ S: { ...S } }); get().save(); fx('floatXP', '+ hábito', '#a78bfa'); return {};
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
    if (auto || priSel === 'AUTO' || areaSel === 'AUTO') fx('toast', 'Triagem do Sistema', TIER_LABEL[pri] + ' · ' + AM[area].name + ' · ' + tr.why, PRI[pri].c);
    fx('floatXP', '+ objetivo', '#a78bfa');
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
      fx('floatXP', '+' + p.xp + ' XP', AM[o.area].color);                           // objetivos.js:56
      fx('cineArise');                                                                // A R I S E cinematográfico
    }
    if (o.status === 'done' && next !== 'done') {
      const p = PRI[o.pri]; addXp(S, o.area, -p.xp); unlog(S, '🗡 ARISE: ' + o.title, o.doneDate);
      S.shadows = S.shadows.filter((s) => s.ref !== o.id); delete o.doneDate;
    }
    o.status = next;
    // SYSTEM EVENT (M26·F6A) — substitui o toast; encenado aqui, publicado pelo
    // `save()`. A Sombra é a consequência persistente que a gramática 2 exige
    // ("um evento tem de deixar o mundo diferente"): não é um número de
    // celebração, é um objeto novo no exército que fica lá depois de a animação
    // acabar.
    if (next === 'done') {
      const p = PRI[o.pri];
      sysEvent({
        dedupe: 'mission:' + id + ':' + today() + ':' + Math.round(S.totalXP),
        kind: 'mission',
        title: 'Missão erguida',
        subject: o.title,
        color: AM[o.area] ? AM[o.area].color : undefined,
        readings: [
          { label: AM[o.area] ? AM[o.area].name : 'XP', value: '+' + p.xp + ' XP' },
          { label: 'Sombra', value: 'Nv ' + p.lvl },
        ],
        holdMs: 7000,
      });
    }
    set({ S: { ...S } }); get().save();
    if (next === 'done') afterPaint(() => fx('cardWave', document.querySelector('.obj-row[data-oid="' + id + '"]'), 'rgba(167,139,250,.5)'));
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
    fx('floatXP', '+' + gain + ' XP', AM.saber.color);                                // recall.js:160
    if (grade === 'ok') fx('toast', 'Conhecimento assimilado', '📖 ' + th.label + ' · +' + gain + ' XP', '#34d399');
  },

  // addCustomQuestion — porto de recall.js:36-49 (id 'meu-...'). Entra na mesma
  // rotação/SM-2 via questionPool. Toast de "incompleta" é fx (devolve erro).
  addCustomQuestion: ({ tema, dif, ref, q, a }) => {
    const S = get().S; if (!q || !q.trim() || !a || !a.trim()) { fx('toast', 'Pergunta incompleta', 'Preenche pelo menos a pergunta e a resposta.', '#fb923c'); return { error: 'incompleto' }; }
    S.customQ.push({ id: 'meu-' + Date.now(), tema, dif, q: q.trim(), a: a.trim(), ref: (ref && ref.trim()) || '—' });
    set({ S: { ...S } }); get().save(); fx('floatXP', '+ pergunta', '#a78bfa'); return {};
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
    if (!logged) { fx('toast', 'Sem registo', 'Regista pelo menos uma linha com repetições.', '#fb923c'); return { error: 'sem-registo' }; }
    const extra = !!form.extra; const notes = (form.notes || '').trim();
    const consec = consecTrained(S);
    const nToday = S.training.sessions.filter((s) => s.d === today()).length;
    const fator = nToday === 0 ? 1 : nToday === 1 ? 0.5 : 0;
    let xp = Math.round((15 + logged * 6) * xpMult(S, 'corpo') * fator); let extraOk = false;
    if (extra) {
      if (consec >= 3) { fx('toast', 'Trava do Sistema', '4º dia seguido — o músculo cresce no descanso. Extra sem bónus hoje.', '#fb923c'); }
      else { extraOk = true; xp += Math.round(10 * fator); const dg = Math.round(5 * fator); if (dg) addXp(S, 'disciplina', dg); }
    }
    if (xp) addXp(S, 'corpo', xp);
    const advXp = adv.length ? Math.round(30 * adv.length * xpMult(S, 'corpo') * fator) : 0;
    if (adv.length) { if (advXp) addXp(S, 'corpo', advXp); }
    S.training.sessions.push({ d: today(), lines, extra: extraOk, notes, adv: adv.length, xp: xp + advXp });
    plog(S, '🏋️ Treino (' + logged + ' linhas' + (extraOk ? ' + extra' : '') + (nToday ? ' · ' + (nToday + 1) + 'ª sessão do dia' : '') + ')', xp + advXp);
    // SYSTEM EVENT (M26·F7) — a sessão e a evolução de progressão são
    // acontecimentos do mundo, não avisos de formulário. Encenados antes do
    // `save()`, que é quem os publica. Os toasts que ficam nesta função são
    // TRAVAS e ressalvas ("4º dia seguido", "2ª sessão sem XP total") — esses
    // são resposta a um formulário e continuam onde estão.
    sysEvent({
      dedupe: 'train:' + today() + ':' + S.training.sessions.length,
      kind: 'habit',
      title: 'Sessão registada',
      subject: logged + (logged === 1 ? ' linha' : ' linhas') + (extraOk ? ' + volume extra' : ''),
      color: AM.corpo.color,
      readings: [{ label: AM.corpo.name, value: (xp + advXp) > 0 ? '+' + (xp + advXp) + ' XP' : 'sem XP' }],
    });
    if (adv.length) {
      sysEvent({
        dedupe: 'prog:' + today() + ':' + adv.join('|'),
        kind: 'levelup',
        title: 'Progressão',
        subject: adv.join(' · '),
        color: '#34d399',
        readings: [{ label: 'Passos', value: '+' + adv.length }],
        holdMs: 8000,
      });
    }
    set({ S: { ...S } }); get().save();
    if (nToday === 1) fx('toast', 'Sessão registada', '2.ª sessão de hoje — XP a metade. O músculo cresce no descanso.', '#fb923c');
    else if (nToday >= 2) fx('toast', 'Sessão registada', '3.ª+ sessão de hoje — registada sem XP. Dados honestos, corpo protegido.', '#fb923c');
    fx('floatXP', (xp + advXp) > 0 ? '+' + (xp + advXp) + ' XP' : 'registado', '#f472b6');
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
    if (!bed || !wake) { fx('toast', 'Falta info', 'Preenche hora de deitar e de acordar.', '#fb923c'); return { error: 'falta-info' }; }
    if (dt > today()) { fx('toast', 'Data inválida', 'O Sistema não regista o futuro.', '#fb923c'); return { error: 'futuro' }; }
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
      res.reward = 17; fx('floatXP', '+17 XP', '#34d399');                            // sono.js:18
    } else if (!recent) { plog(S, '😴 Registo retroativo ' + dt + ' (' + h + 'h)', 0); res.retro = true; fx('toast', 'Registo retroativo', 'Guardado para análise. XP só em registos do próprio dia — anti-farm.', '#a78bfa'); }
    else if (h < 7.5) { plog(S, '😴 Noite curta (' + h + 'h)', 0); res.short = true; fx('toast', 'Registado', 'Noite curta (' + h + 'h). Sem drama — o alvo de hoje é recuperar.', '#fb923c'); }
    set({ S: { ...S } }); get().save();
    return res;
  },

  // setSleepT — porto de sono.js:5. Hora-alvo de recolher.
  setSleepT: (k, v) => { const S = get().S; S.sleep[k] = v; set({ S: { ...S } }); get().save(); },

  // ===== ESTADOS / TÍTULOS (Fase 10) =====
  // toggleDebuff — porto de hud.js:15.
  toggleDebuff: (id) => { const S = get().S; S.debuffs[id] = !S.debuffs[id]; set({ S: { ...S } }); get().save(); },

  /* logBodyRoutine — Missão 26 · Fase 7.
   *
   * NÃO CRIA UMA REGRA DE XP NOVA, e é deliberado: o ganho é ZERO. O motor de
   * XP foi auditado na Missão 25 e "divergência de número = bug"; inventar um
   * valor para o pavimento pélvico ou para a mobilidade seria eu a decidir
   * quanto vale uma coisa que o Daniel nunca ponderou.
   *
   * O que isto faz é REGISTAR: uma entrada no diário e a data da última vez.
   * Se o Daniel quiser que estas rotinas dêem XP, é uma decisão dele e entra
   * como regra de domínio, com valor escolhido por ele.
   *
   * `S.bodyRoutines` é um campo novo no JSON do app_state. NÃO é uma alteração
   * de schema — a coluna do Supabase é `jsonb` — e o `normalize` preserva
   * campos desconhecidos, por isso sobrevive a um carregamento. */
  logBodyRoutine: (id, name) => {
    const S = get().S; if (!S) return { error: 'sem-estado' };
    S.bodyRoutines = S.bodyRoutines || {};
    const hist = S.bodyRoutines[id] || [];
    if (hist[hist.length - 1] === today()) return { error: 'ja-registada' };
    // 60 datas chegam para ler consistência de dois meses; guardar tudo faria
    // o estado crescer sem ninguém alguma vez o ler.
    S.bodyRoutines[id] = [...hist, today()].slice(-60);
    plog(S, name + ' · rotina feita', 0);
    sysEvent({
      dedupe: 'body:' + id + ':' + today(),
      kind: 'habit',
      title: 'Rotina registada',
      subject: name,
      color: AM.corpo.color,
      readings: [{ label: 'Seguidas', value: String(bodyStreak(S.bodyRoutines[id])) }],
    });
    set({ S: { ...S } }); get().save();
    return { ok: true };
  },

  // applyAntidote — porto de hud.js:16-22. 1× por estado por dia (Fuga 4):
  // repetir não dá efeito nem XP. Desliga o estado, +10 Disciplina, registo.
  applyAntidote: (id) => {
    const S = get().S; S.antidote = S.antidote || {};
    if (S.antidote[id] === today()) { fx('toast', 'Antídoto já usado hoje', '1× por estado e por dia. Se o estado voltou, desliga-o no cartão — sem XP repetido.', '#fb923c'); return { error: 'ja-usado' }; }
    S.antidote[id] = today();
    S.debuffs[id] = false; addXp(S, 'disciplina', 10);
    plog(S, 'Antídoto: ' + DEBUFFS.find((d) => d.id === id).name, 10);
    set({ S: { ...S } }); get().save(); fx('toast', 'Antídoto aplicado', '+10 Disciplina · bem gerido', '#34d399'); return { ok: true };
  },

  // toggleReq — porto de hud.js:38-47. Marca/desmarca evidência de um requisito;
  // 100% desbloqueia o Título Real (datado + registo); regredir re-tranca.
  // floatXP/toast = fx (deferido). Requisitos automáticos não são clicáveis.
  toggleReq: (tid, rid) => {
    const S = get().S; const t = TITLES_REAL.find((x) => x.id === tid); const r = t.reqs.find((x) => x.id === rid); if (r.auto) return;
    S.titleEv[tid] = S.titleEv[tid] || {}; S.titleEv[tid][rid] = !S.titleEv[tid][rid];
    if (S.titleEv[tid][rid]) fx('floatXP', '✓ evidência', '#fbbf24');                 // hud.js:41
    if (titleProg(S, t).pct === 100 && !S.titleUnlocked[tid]) { S.titleUnlocked[tid] = today(); plog(S, '👑 Título real: ' + t.name, 0); fx('toast', 'TÍTULO REAL DESBLOQUEADO', '👑 ' + t.name + ' — com evidência. Isto é teu.', '#fbbf24', false, true); }
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
    set({ S: { ...S } }); get().save(); fx('floatXP', '+' + g + ' XP', AM[w.attr].color); // world.js:44
  },

  // startRecovery — porto de world.js:61-66. 2 dias sem penalizações.
  startRecovery: () => {
    const S = get().S; const d = new Date(); d.setDate(d.getDate() + 2);
    S.recovery = { until: fmt(d) }; plog(S, '🌙 Recovery ativado (2 dias)', 0);
    set({ S: { ...S } }); get().save();
    fx('toast', 'Recovery ativado', '2 dias sem penalizações. Dorme. Recupera. O rank não foge.', '#34d399'); // world.js:64
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
    // SYSTEM EVENT (M26·F7) — aceitar um arco é um acontecimento do mundo, não
    // um aviso de formulário. O toast antigo saía num `setTimeout(900)`, o que
    // tinha um defeito por trás: anunciava passados 900ms QUER a gravação
    // tivesse corrido bem quer não. Agora é o `save()` que publica, e as
    // missões que entraram são a prova (gramática 2: o evento deixa o mundo
    // diferente).
    sysEvent({
      dedupe: 'arc:' + a.id + ':' + today(),
      kind: 'arc',
      title: 'Arco aceite',
      subject: a.name,
      color: '#fb923c',
      readings: n
        ? [
            { label: 'Missões', value: '+' + n },
            { label: 'Mente', value: '+15 XP' },
          ]
        : [{ label: 'Mente', value: '+15 XP' }],
      holdMs: 8000,
    });
    set({ S: { ...S } });
    // A cerimónia de aceitação NÃO pode começar antes de a escrita passar —
    // celebrar uma decisão que não ficou guardada seria o Sistema a afirmar
    // uma coisa falsa. `saved` é o que o overlay espera para animar.
    const saved = get().save();
    return { n, saved };
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
      set({ radar: r || [], report: (rep && rep[0]) || null, fetchErr: null });
    } catch (e) {
      // o estado anterior fica: dados velhos com aviso valem mais que um vazio
      // falso. O que muda é passar a haver aviso.
      set({ fetchErr: (e && e.message) ? String(e.message) : 'sem ligação' });
    }
  },

  // acceptRadarMission — porto de radar.js:81-88. Cria missão via triage (tag
  // 📡 Do Radar) e marca radarAccepted. Toast/floatXP = fx.
  acceptRadarMission: (id) => {
    const S = get().S; const it = get().radar.find((x) => x.id === id); if (!it || !it.missao || !it.missao.t) return;
    if (S.radarAccepted[id]) { fx('toast', 'Já aceite', 'Esta missão já está na tua lista.', '#fb923c'); return { error: 'ja-aceite' }; }
    const m = it.missao; const tr = triage(m.t, m.deadline || null);
    S.objectives.push({ id: 'o' + Date.now(), title: m.t, area: (m.area && AM[m.area]) ? m.area : (tr.area || 'oficio'), pri: (m.pri && PRI[m.pri]) ? m.pri : tr.imp, auto: true, deadline: m.deadline || null, status: 'pend', created: today(), tags: ['📡 Do Radar', ...(tr.tags || [])], oracle: true });
    S.radarAccepted[id] = true;
    set({ S: { ...S } }); get().save();
    fx('toast', 'Missão aceite', '⚔️ ' + m.t + ' — Sistema sincronizado', '#fbbf24'); fx('floatXP', '+ missão', '#fbbf24'); // radar.js:87
    return {};
  },

  // acceptOracleMission — porto de radar.js:74-80 (tag 🔮 Do Oráculo).
  acceptOracleMission: (i) => {
    const S = get().S; const r = get().report && get().report.report; if (!r || !r.missoes_propostas || !r.missoes_propostas[i]) return;
    const m = r.missoes_propostas[i]; const tr = triage(m.t || 'Missão do Oráculo', m.deadline || null);
    S.objectives.push({ id: 'o' + Date.now(), title: m.t || 'Missão do Oráculo', area: (m.area && AM[m.area]) ? m.area : (tr.area || 'oficio'), pri: (m.pri && PRI[m.pri]) ? m.pri : tr.imp, auto: true, deadline: m.deadline || null, status: 'pend', created: today(), tags: ['🔮 Do Oráculo', ...(tr.tags || [])], oracle: true });
    set({ S: { ...S } }); get().save();
    fx('toast', 'Missão aceite', '⚔️ Sistema sincronizado', '#a78bfa'); fx('floatXP', '+ missão', '#a78bfa'); // radar.js:79
  },

  // ===== ORÁCULO · CONSELHO (Fase 15) =====
  // ocQuotaLeft — mensagens restantes hoje (12/dia; conselho.js:10-14).
  ocQuotaLeft: () => { const S = get().S; const t = today(); if (!S || !S.oracleChat || S.oracleChat.d !== t) return 12; return Math.max(0, 12 - (S.oracleChat.count || 0)); },

  // sendConselho — porto de sendConselho (conselho.js:156-200). Chat com a Edge
  // Function ?mode=chat (JWT). Contador incrementa ANTES (servidor revalida);
  // falha NÃO consome quota nem envenena o histórico da API ("o sistema nunca
  // mente"). Teatro/typewriter = fx (deferido). ocMsgs guarda o log de exibição;
  // a história da API deriva das mensagens com role definido.
  sendConselho: async (text) => {
    if (get().ocBusy) return;
    const qtxt = (text || '').trim(); if (!qtxt) return;
    const user = get().user; if (!user || !supabase) { fx('toast', 'Sem sessão', 'Entra com a tua conta para falares com o Oráculo.', '#fb923c'); return { error: 'sem-sessao' }; }
    if (get().ocQuotaLeft() <= 0) { fx('toast', 'Limite diário', '12 mensagens/dia — guarda a pergunta para amanhã.', '#fb923c'); return { error: 'limite-local' }; }
    const S = get().S; const t = today();
    if (!S.oracleChat || S.oracleChat.d !== t) S.oracleChat = { d: t, count: 0 };
    S.oracleChat.count++;
    const userMsg = { cls: 'oc-user', content: qtxt, role: 'user' };
    set({ ocMsgs: [...get().ocMsgs, userMsg], ocBusy: true, S: { ...S } }); get().save();
    const apiHist = get().ocMsgs.filter((m) => m.role).map((m) => ({ role: m.role, content: m.content })).slice(-8);
    let ok = false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch(SUPABASE_URL + '/functions/v1/oraculo?mode=chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: SUPABASE_ANON, authorization: 'Bearer ' + session.access_token },
        body: JSON.stringify({ messages: apiHist }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.reply) { ok = true; set({ ocMsgs: [...get().ocMsgs, { cls: 'oc-orc', content: j.reply, role: 'assistant' }] }); if (window.Bus) window.Bus.emit('oracle:spoke'); }
      else if (j.error === 'limite') { ok = true; set({ ocMsgs: [...get().ocMsgs, { cls: 'oc-orc', content: 'O Oráculo confirma: as 12 mensagens de hoje esgotaram. Guarda a pergunta — amanhã o Conselho volta a reunir.', role: null }] }); }
      else { set({ ocMsgs: [...get().ocMsgs, { cls: 'oc-orc', content: 'O Oráculo não respondeu (' + (j.error || ('HTTP ' + r.status)) + '). A mensagem não contou para o limite — tenta outra vez.', role: null }] }); }
    } catch (e) {
      set({ ocMsgs: [...get().ocMsgs, { cls: 'oc-orc', content: 'Sem ligação ao Oráculo — verifica a rede. A mensagem não contou para o limite.', role: null }] });
    }
    // o sistema nunca mente: chamada falhada devolve a quota e tira a pergunta do histórico da API
    if (!ok) {
      const S2 = get().S; if (S2.oracleChat && S2.oracleChat.d === t) S2.oracleChat.count = Math.max(0, S2.oracleChat.count - 1);
      const msgs = get().ocMsgs.slice(); const uidx = msgs.map((m) => m.role).lastIndexOf('user'); if (uidx > -1) msgs[uidx] = { ...msgs[uidx], role: null };
      set({ ocMsgs: msgs, S: { ...S2 } }); get().save();
    }
    set({ ocBusy: false });
    return {};
  },

  // acceptConselhoMission — porto de acceptConselhoMission (conselho.js:116-123).
  // Prazo 48h, tag 🔮 Do Oráculo.
  acceptConselhoMission: (t) => {
    const S = get().S; if (!t) return; const dl = addDays(today(), 2); const tr = triage(t, dl);
    S.objectives.push({ id: 'o' + Date.now(), title: t, area: tr.area || 'oficio', pri: tr.imp, auto: true, deadline: dl, status: 'pend', created: today(), tags: ['🔮 Do Oráculo', ...(tr.tags || [])], oracle: true });
    set({ S: { ...S } }); get().save();
    fx('toast', 'Missão aceite', '⚔️ ' + t + ' — Sistema sincronizado', '#a78bfa'); fx('floatXP', '+ missão', '#a78bfa'); // conselho.js:122
  },

  // fetchSussurro — porto de fetchSussurro (conselho.js:76-91). 1 linha/dia do
  // ?mode=sussurro, cache em S.sussurro; erro = silêncio (nunca inventar).
  fetchSussurro: async () => {
    const user = get().user; if (!user || !supabase) return;
    const S = get().S; const t = today();
    if (S.sussurro && S.sussurro.d === t) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const r = await fetch(SUPABASE_URL + '/functions/v1/oraculo?mode=sussurro', {
        method: 'POST',
        headers: { 'content-type': 'application/json', apikey: SUPABASE_ANON, authorization: 'Bearer ' + session.access_token },
        body: '{}',
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return;
      const S2 = get().S; S2.sussurro = { d: t, line: j.linha || null };
      set({ S: { ...S2 } }); get().save();
    } catch (e) {}
  },
}));

// Ponte para o palco WebGL (Fase 2): o loop rAF do palco lê o estado FORA do
// ciclo React via window.__store.getState().S — por isso Zustand, e não
// Context/useReducer.
if (typeof window !== 'undefined') window.__store = useStore;
