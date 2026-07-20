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

// Curva de XP por nível (engine.js:26) — quanto falta para o próximo nível.
export const need = (l) => 40 + l * 20;

// Derivações puras (engine.js:5,7,40) — usadas pela prova de boot e, mais tarde,
// pelos painéis. Lógica intocada.
export function rankOf(level) { for (const r of RANKS) { if (level >= r.min && level <= r.max) return r; } return RANKS[RANKS.length - 1]; }
export function titleOf(l) { let t = TITLES[0][1]; for (const [m, n] of TITLES) if (l >= m) t = n; return t; }
export const overallLevel = (S) => ATTRS.reduce((s, a) => s + S.attrs[a.id].level, 0) - (ATTRS.length - 1);

// Títulos Reais (data.js:98-129) — o cofre de evidência. O herói usa o último
// desbloqueado (👑) em vez do título por nível; o painel próprio migra depois.
export const TITLES_REAL = [
  { id: 'cncs', name: 'Cyber Foundations (CNCS)', reqs: [
    { id: 'a', t: 'Cursos do CNCS concluídos (evidência: certificados)' },
    { id: 'b', t: 'Resumo/portefólio das aprendizagens no teu Codex ou OneNote' },
    { id: 'c', t: '1 exercício ou desafio prático resolvido e documentado' },
  ] },
  { id: 'rgpd_appr', name: 'Privacy Apprentice (RGPD)', reqs: [
    { id: 'a', t: 'Princípios (art. 5º) e bases legais (art. 6º) dominados — testado, não só lido' },
    { id: 'b', t: '1 caso prático escrito (ex.: análise de um tratamento de dados real)' },
    { id: 'c', t: '1 registo de atividades de tratamento (RAT) de exemplo feito por ti' },
  ] },
  { id: 'aigov_novice', name: 'AI Governance Novice', reqs: [
    { id: 'a', t: 'EU AI Act — visão geral sólida (abordagem por risco, obrigações principais)' },
    { id: 'b', t: 'Fundamentos ISO/IEC 42001 estudados' },
    { id: 'c', t: '2 cursos de AI Governance concluídos (evidência: certificados)' },
    { id: 'd', t: '2 casos práticos escritos (ex.: classificar risco de um sistema de IA real)' },
  ] },
  { id: 'aigov_pract', name: 'AI Governance Practitioner', reqs: [
    { id: 'x', t: 'Título AI Governance Novice desbloqueado', auto: 'aigov_novice' },
    { id: 'a', t: '+3 projetos/casos práticos (total 5)' },
    { id: 'b', t: '1 risk assessment completo de um sistema de IA' },
    { id: 'c', t: '1 artigo publicado ou apresentação feita sobre AI Governance' },
    { id: 'd', t: 'NIST AI RMF mapeado contra ISO/IEC 42001 (documento teu)' },
  ] },
  { id: 'lead27001', name: 'ISO 27001 Lead Auditor', reqs: [
    { id: 'a', t: 'Fundamentos ISO 27001 (cláusulas 4–10 + Anexo A) dominados' },
    { id: 'b', t: 'Curso Lead Auditor acreditado (PECB, IRCA ou equivalente)' },
    { id: 'c', t: 'Exame oficial aprovado — certificado emitido (evidência: PDF/Credly)' },
    { id: 'd', t: 'ISO 19011 (diretrizes de auditoria) estudada' },
    { id: 'e', t: '≥1 auditoria (simulada ou real) com relatório escrito por ti' },
  ] },
];
