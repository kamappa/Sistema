import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';
import { fresh } from '../state/fresh.js';
import { normalize } from '../state/normalize.js';
import { today, yday } from '../state/dates.js';
import { xpMult } from '../state/world.js';
import { addXp, plog, unlog } from '../state/engine.js';

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
    set({ S, booted: true });
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
}));

// Ponte para o palco WebGL (Fase 2): o loop rAF do palco lê o estado FORA do
// ciclo React via window.__store.getState().S — por isso Zustand, e não
// Context/useReducer.
if (typeof window !== 'undefined') window.__store = useStore;
