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

// Missões / triagem (data.js:151-166) — prioridades, estados e palavras-chave.
export const PRI = { P1: { xp: 150, lvl: 10, c: '#ef4444' }, P2: { xp: 90, lvl: 6, c: '#fb923c' }, P3: { xp: 50, lvl: 3, c: '#34d399' }, BOSS: { xp: 400, lvl: 15, c: '#facc15' } };
export const OST = ['pend', 'doing', 'done'];
export const OSTL = { pend: '⭘', doing: '⚔️', done: '✅' };
export const TIER_LABEL = { P3: 'Side', P2: 'Main', P1: 'Elite', BOSS: 'Boss' };
export const TIER_KEY = { side: 'P3', main: 'P2', elite: 'P1', boss: 'BOSS' };
export const KW_HI = ['exame', 'teste', 'entrega', 'trabalho', 'certifica', 'entrevista', 'audit', 'relat', 'apresenta', 'projeto', 'prova', 'estágio', 'estagio', 'urgente', 'defesa'];
export const KW_LO = ['comer', 'comprar', 'lavar', 'arrumar', 'limpar', 'marcar', 'encomenda', 'café', 'cafe', 'passear'];
export const KW_AREA = [
  ['corpo', ['trein', 'ginásio', 'ginasio', 'correr', 'muscul', 'dormir', 'sono', 'dieta', 'proteína', 'proteina', 'alonga', 'caminh', 'skincare']],
  ['saber', ['estud', 'exame', 'teste', 'curso', 'ler ', 'livro', 'apontament', 'revis', 'aula', 'frequência', 'frequencia', 'trabalho de']],
  ['oficio', ['iso', 'rgpd', 'nis2', 'audit', 'cv', 'linkedin', 'entrevista', 'estágio', 'estagio', 'certifica', 'cyber', 'seguranç', 'seguranc', 'compliance', 'governance', 'ai act', 'portefólio', 'portfolio', 'dpo']],
  ['vinculos', ['namorada', 'amig', 'família', 'familia', 'network', 'café com', 'cafe com', 'mensagem a', 'contacto', 'mentor', 'patrícia', 'patricia']],
  ['mente', ['medit', 'planear', 'plano da', 'refle', 'diário', 'diario', 'journal', 'organizar a semana']],
  ['disciplina', ['rotina', 'acordar cedo', 'hábito', 'habito', 'consistên', 'consisten']],
];
export const FUN_TAGS = ['🔥 Hot Quest', '🗡 Digna de Sombra', '☕ Café e Foco', '🧠 XP Mental', '👑 Material de Lenda', '🌫 Missão Sombria'];

// diffTag — usado na migração quests→objectives (objetivos.js:22-28)
export function diffTag(t) {
  const quick = ['marcar', 'enviar', 'comprar', 'ler ', 'email', 'mensagem', 'rever '];
  const epic = ['certifica', 'projeto', 'portef', 'portfolio', 'implementar', 'construir', 'sgsi', 'dominar'];
  if (epic.some((k) => t.includes(k))) return '🏔 Épica';
  if (quick.some((k) => t.includes(k))) return '⚡ Rápida';
  return '🔨 Média';
}

// Temas da Revisão Ativa (data.js:40-47).
export const RECALL_THEMES = {
  rgpd: { label: 'RGPD', color: 'var(--sky)' },
  iso27001: { label: 'ISO 27001', color: 'var(--em)' },
  nis2: { label: 'NIS2', color: 'var(--orange)' },
  iso19011: { label: 'ISO 19011', color: 'var(--cyan)' },
  aigov: { label: 'AI Governance', color: 'var(--gold)' },
  ia: { label: 'IA geral', color: 'var(--pink)' },
};

// Treino · progressões de calistenia (data.js:131-150). 4 linhas de força (8
// passos {n,t}) + Pavimento Pélvico (8 passos {n,cyc}).
export const PROG = {
  push: [{ n: 'Flexões inclinadas (mãos numa mesa)', t: 12 }, { n: 'Flexões de joelhos', t: 12 }, { n: 'Flexões completas', t: 10 }, { n: 'Flexões diamante', t: 10 }, { n: 'Flexões declinadas (pés elevados)', t: 10 }, { n: 'Flexões arqueiro', t: 8 }, { n: 'Pseudo-planche push-ups', t: 8 }, { n: 'Flexões a um braço (assistidas)', t: 5 }],
  pull: [{ n: 'Dead hang (segundos)', t: 40 }, { n: 'Remada australiana', t: 12 }, { n: 'Remada australiana pés elevados', t: 10 }, { n: 'Negativas de pull-up (desce em 5s)', t: 6 }, { n: 'Pull-ups', t: 8 }, { n: 'Pull-ups peito à barra', t: 6 }, { n: 'Pull-ups arqueiro', t: 6 }, { n: 'Pull-up a um braço (assistida)', t: 3 }],
  legs: [{ n: 'Agachamento assistido', t: 15 }, { n: 'Agachamento livre', t: 15 }, { n: 'Avanços alternados (lunges)', t: 12 }, { n: 'Agachamento búlgaro', t: 10 }, { n: 'Step-ups altos', t: 10 }, { n: 'Pistol squat assistido', t: 6 }, { n: 'Agachamento shrimp', t: 6 }, { n: 'Pistol squat', t: 5 }],
  core: [{ n: 'Prancha (segundos)', t: 45 }, { n: 'Hollow hold (segundos)', t: 30 }, { n: 'Elevações de pernas no chão', t: 15 }, { n: 'Elevações de joelhos suspenso', t: 10 }, { n: 'Elevações de pernas suspenso', t: 10 }, { n: 'Windshield wipers deitado', t: 10 }, { n: 'Toes-to-bar', t: 8 }, { n: 'Dragon flag (negativas)', t: 5 }],
  kegel: [
    { n: 'Lentas 3s/3s ×8', cyc: 2 },
    { n: 'Lentas 4s/4s ×8 + rápidas ×5', cyc: 2 },
    { n: 'Lentas 5s/5s ×10 + rápidas ×8', cyc: 2 },
    { n: 'Lentas 6s/6s ×10 + rápidas ×10', cyc: 2 },
    { n: 'Lentas 7s/7s ×10 + rápidas ×12', cyc: 3 },
    { n: 'Lentas 8s/8s ×12 + rápidas ×15', cyc: 3 },
    { n: 'Lentas 9s/9s ×12 + rápidas ×18', cyc: 3 },
    { n: 'Lentas 10s/10s ×12 + rápidas ×20', cyc: 3 },
  ],
};
export const TLINES = [{ id: 'push', n: 'Empurrar', c: '#f472b6' }, { id: 'pull', n: 'Puxar', c: '#38bdf8' }, { id: 'legs', n: 'Pernas', c: '#34d399' }, { id: 'core', n: 'Core', c: '#fbbf24' }];
export const KLINE = { id: 'kegel', n: 'Pavimento Pélvico', c: '#c084fc' };

// Curva de XP por nível (engine.js:26) — quanto falta para o próximo nível.
export const need = (l) => 40 + l * 20;

// Arcos sazonais (data.js:68-77) — o xpMult usa id/months/bonus; o painel do
// World Engine (migra depois) usa o resto.
export const SEASON_ARCS = [
  { id: 'summer', name: '☀️ Summer Arc', months: [6, 7, 8, 9], desc: 'Estágio · cursos · eventos · networking · IA', boss: '"Quem sou eu comparado com junho?"', bonus: { oficio: 1.2, vinculos: 1.2 },
    quests: [{ t: 'Conseguir uma entrevista ou contacto direto para estágio', area: 'oficio', pri: 'P1' }, { t: 'Participar num evento ou webinar de cibersegurança durante o arco', area: 'vinculos', pri: 'P2' }, { t: 'Concluir um curso (CNCS ou Mastermind) até ao fim do arco', area: 'saber', pri: 'P2' }, { t: 'Um dia de praia sem culpa — recarregar é estratégia', area: 'corpo', pri: 'P3' }] },
  { id: 'harvest', name: '🍂 Harvest Arc', months: [10, 11], desc: 'Consolidar · organizar · rever conhecimento', boss: '"O que ficou realmente meu?"', bonus: { saber: 1.25, mente: 1.2 },
    quests: [{ t: 'Consolidar os apontamentos do semestre num resumo-mestre', area: 'saber', pri: 'P2' }, { t: 'Rever e atualizar o portefólio com o que aprendeste', area: 'oficio', pri: 'P2' }, { t: 'Fazer a retrospetiva do Summer Arc por escrito', area: 'mente', pri: 'P3' }] },
  { id: 'winter', name: '❄️ Winter Forge', months: [12, 1, 2], desc: 'Construção profunda · muito estudo · pouca exposição', boss: '"O que forjei no silêncio?"', bonus: { saber: 1.4, mente: 1.25 },
    quests: [{ t: 'Dominar um domínio técnico a fundo (ISO 27001 ou AI Act)', area: 'oficio', pri: 'P1' }, { t: 'Ler um livro técnico completo com notas', area: 'saber', pri: 'P2' }, { t: 'Construir um projeto prático em silêncio (Shadow Work)', area: 'disciplina', pri: 'P2' }] },
  { id: 'bloom', name: '🌸 Bloom Arc', months: [3, 4, 5], desc: 'Experimentar · conhecer pessoas · abrir portas', boss: '"Que porta nova abri?"', bonus: { vinculos: 1.3, corpo: 1.15 },
    quests: [{ t: 'Fazer 10 ligações novas no LinkedIn com mensagem pessoal', area: 'vinculos', pri: 'P2' }, { t: 'Tomar um café com alguém da indústria', area: 'vinculos', pri: 'P2' }, { t: 'Mostrar publicamente algo que construíste (post, demo)', area: 'oficio', pri: 'P1' }] },
];

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
