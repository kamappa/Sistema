import { useStore } from './store/useStore.js';

// Fase 0 (Missão 25 · Foundation) — ecrã de fundação: confirma que o ambiente
// Vite + React + Zustand monta e builda. NENHUM painel migrado ainda; o Vanilla
// funcional vive em legacy/. Os painéis entram um a um nas fases seguintes.
export default function App() {
  const ready = typeof useStore.getState === 'function';
  return (
    <div className="foundation">
      <div className="foundation-badge">SISTEMA · FOUNDATION</div>
      <h1>Fundação React</h1>
      <p>Missão 25 — ambiente Vite + React + Zustand operacional{ready ? '.' : '…'}</p>
      <p className="muted">
        Nenhum painel migrado ainda. O Vanilla vive em <code>legacy/</code> e continua
        a ser a referência visual. Os painéis entram um a um nas fases seguintes.
      </p>
    </div>
  );
}
