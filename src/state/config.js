// Constantes de configuração do modelo de estado (Missão 25 · Fase 1).
// Portadas de legacy/js/data.js e legacy/js/engine.js SEM alteração de lógica.
// Aqui vive só o subconjunto que a "casca de estado" precisa (fresh/normalize
// e a prova de boot). O resto das constantes (ACH, DEBUFFS, PROG, PRI,
// CONSTELLATIONS, ...) entra com os painéis respetivos nas fases seguintes.

// ATRIBUTOS (data.js:6-14)
export const ATTRS = [
  { id: 'oficio',    name: 'Ofício',     sub: 'Carreira · Cyber · GRC', color: '#38bdf8' },
  { id: 'saber',     name: 'Saber',      sub: 'Estudo · Conhecimento',  color: '#34d399' },
  { id: 'corpo',     name: 'Corpo',      sub: 'Saúde · Físico',         color: '#f472b6' },
  { id: 'mente',     name: 'Mente',      sub: 'Foco · Equilíbrio',      color: '#a78bfa' },
  { id: 'vinculos',  name: 'Vínculos',   sub: 'Relações · Networking',  color: '#fb923c' },
  { id: 'disciplina',name: 'Disciplina', sub: 'Rotina · Consistência',  color: '#ef4444' },
];
export const AM = Object.fromEntries(ATTRS.map((a) => [a.id, a]));

// RANKS (data.js:16-23)
export const RANKS = [
  { l: 'E', min: 1,  max: 4,    color: '#94a3b8' },
  { l: 'D', min: 5,  max: 9,    color: '#34d399' },
  { l: 'C', min: 10, max: 14,   color: '#38bdf8' },
  { l: 'B', min: 15, max: 19,   color: '#a78bfa' },
  { l: 'A', min: 20, max: 24,   color: '#fb923c' },
  { l: 'S', min: 25, max: 9999, color: '#fbbf24' },
];

// TÍTULOS por nível (data.js:24)
export const TITLES = [[1, 'Novice Auditor'], [3, 'Privacy Apprentice'], [5, 'Cyber Initiate'], [8, 'Compliance Adept'], [12, 'Cyber Strategist'], [15, 'Lead Auditor Candidate'], [19, 'Risk Architect'], [23, 'GRC Consultant'], [27, 'Master of Governance']];

// HÁBITOS (data.js:26-39)
export const OBLIG = [
  { id: 'o_sono',   name: 'Dormir 7,5–9h',             attr: 'corpo', xp: 18, pen: 15 },
  { id: 'o_estudo', name: 'Estudo focado (deep work)', attr: 'saber', xp: 18, pen: 15 },
  { id: 'o_treino', name: 'Treino / mover o corpo',    attr: 'corpo', xp: 18, pen: 15 },
];
export const EXTRAS = [
  { id: 'e_disc', name: 'Acordar à hora + plano do dia', attr: 'disciplina', xp: 12 },
  { id: 'e_ler',  name: 'Leitura + notas',               attr: 'saber',      xp: 9 },
  { id: 'e_pro',  name: 'Atualização / networking pro',  attr: 'oficio',     xp: 9 },
  { id: 'e_vinc', name: 'Contacto significativo',        attr: 'vinculos',   xp: 9 },
  { id: 'e_rev',  name: 'Planeamento / revisão do dia',  attr: 'mente',      xp: 8 },
  { id: 'e_agua', name: 'Hidratação',                    attr: 'corpo',      xp: 6 },
  { id: 'e_pele', name: 'Skincare + fio dentário',       attr: 'corpo',      xp: 6 },
];

// diffTag — usado na migração quests→objectives (objetivos.js:22-28)
export function diffTag(t) {
  const quick = ['marcar', 'enviar', 'comprar', 'ler ', 'email', 'mensagem', 'rever '];
  const epic = ['certifica', 'projeto', 'portef', 'portfolio', 'implementar', 'construir', 'sgsi', 'dominar'];
  if (epic.some((k) => t.includes(k))) return '🏔 Épica';
  if (quick.some((k) => t.includes(k))) return '⚡ Rápida';
  return '🔨 Média';
}

// Derivações puras (engine.js:5,7,40) — usadas pela prova de boot e, mais tarde,
// pelos painéis. Lógica intocada.
export function rankOf(level) { for (const r of RANKS) { if (level >= r.min && level <= r.max) return r; } return RANKS[RANKS.length - 1]; }
export function titleOf(l) { let t = TITLES[0][1]; for (const [m, n] of TITLES) if (l >= m) t = n; return t; }
export const overallLevel = (S) => ATTRS.reduce((s, a) => s + S.attrs[a.id].level, 0) - (ATTRS.length - 1);
