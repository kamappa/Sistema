import { create } from 'zustand';

// Store central do Sistema (Missão 25). Na Fase 1 passa a espelhar o app_state
// (o antigo global `S`) carregado do Supabase e a expor as ações que hoje vivem
// nos módulos clássicos (addXp, toggleHabit, reviewQuestion, ...) — a LÓGICA de
// cálculo dessas ações preserva-se linha a linha; só a "cola" de estado/render
// passa a ser o store. Por agora, esqueleto.
export const useStore = create((set, get) => ({
  S: null,
  setS: (S) => set({ S }),
}));

// Ponte para o palco WebGL (Fase 2): o loop rAF do palco lê o estado FORA do
// ciclo React via window.__store.getState().S — por isso Zustand, e não
// Context/useReducer.
if (typeof window !== 'undefined') window.__store = useStore;
