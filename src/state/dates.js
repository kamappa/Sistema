// Datas — portadas linha a linha de legacy/js/engine.js:19-23 (lógica intocada,
// contrato da Missão 25). Puras, sem dependências.
export const fmt = (d) => d.toISOString().slice(0, 10);
export const today = () => fmt(new Date());
export const yday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return fmt(d); };
export const diffDays = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
