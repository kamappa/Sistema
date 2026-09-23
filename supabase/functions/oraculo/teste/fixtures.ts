/* DADOS FIXOS DO MODO DE TESTE DO ORÁCULO — TODOS SINTÉTICOS.
 *
 * Nada aqui é real: nem pessoas, nem notas, nem notícias, nem vagas. Os URLs usam o
 * domínio reservado `.invalid` (RFC 2606), que não resolve em lado nenhum. As datas
 * são relativas ao momento da corrida, para as janelas de 24 h e 7 dias da função
 * se comportarem como em produção.
 *
 * As respostas imitam a estrutura completa das APIs reais (GitHub REST e Anthropic
 * Messages), não só os campos que a função lê: um duplo parcial passa no teste e
 * parte na integração.
 */

export const UTILIZADOR_OPERADOR = "00000000-0000-4000-8000-000000000001";
export const UTILIZADOR_SEM_ESTADO = "00000000-0000-4000-8000-000000000002";

/** JWT de teste → utilizador. Qualquer outro JWT é recusado. */
export const JWTS: Record<string, string> = {
  "jwt-teste-operador": UTILIZADOR_OPERADOR,
  "jwt-teste-sem-estado": UTILIZADOR_SEM_ESTADO,
};

const dia = (deltaDias: number) => new Date(Date.now() + deltaDias * 864e5).toISOString().slice(0, 10);
const instante = (deltaHoras: number) => new Date(Date.now() + deltaHoras * 3600e3).toISOString().replace(/\.\d{3}Z$/, "Z");

function estadoSintetico(): Record<string, unknown> {
  return {
    v: 4,
    attrs: { oficio: { level: 1, xp: 10 }, saber: { level: 2, xp: 40 }, corpo: { level: 1, xp: 0 }, mente: { level: 1, xp: 5 }, vinculos: { level: 1, xp: 0 }, disciplina: { level: 1, xp: 18 } },
    totalXP: 73,
    history: [{ d: dia(-10), v: 0 }, { d: dia(-1), v: 18 }],
    oblig: [{ id: "o_estudo", name: "Estudo focado (sintético)", attr: "saber", xp: 18, streak: 1, lastDone: dia(-1) }],
    extras: [],
    studyStreak: { count: 1, lastDay: dia(-1) },
    debuffs: {},
    objectives: [{ id: "o-sintetico", title: "Objetivo sintético", pri: "P2", deadline: null, status: "pend", area: "saber", created: dia(-5) }],
    titleUnlocked: {},
    constellation: { choices: {}, coreSeen: 0, born: {} },
    streakPeak: null,
    events: [],
    sleep: { bedT: "23:30", wakeT: "07:30", logs: [] },
    training: { prog: { push: 0, pull: 0, legs: 0, core: 0 }, sessions: [] },
    recall: {},
    customQ: [],
    oracleChat: { d: null, count: 0 },
  };
}

type Linha = Record<string, unknown>;

/** O mundo inicial, criado de novo em cada arranque do modo de teste. */
export function baseInicial(): Record<string, Linha[]> {
  const item = (id: string, d: string, url: string, area: string, horas: number): Linha => ({
    id, user_id: UTILIZADOR_OPERADOR, d, title: "Notícia sintética " + id, source: "Fonte Exemplo", url,
    summary: "Resumo inventado para teste.", relevance: "Relevância inventada.", area,
    created_at: instante(horas), impact: null, missao: null,
  });
  return {
    app_state: [{ user_id: UTILIZADOR_OPERADOR, state: estadoSintetico(), updated_at: instante(-1) }],
    radar_items: [
      item("r-ja-visto", dia(-2), "https://exemplo.invalid/ja-visto", "rgpd", -48),
      item("r-antigo", dia(-40), "https://exemplo.invalid/antigo", "cyber", -40 * 24),
    ],
    oracle_reports: [{ id: "o-anterior", user_id: UTILIZADOR_OPERADOR, report: { resumo: "(sintético) relatório anterior", alerta: null }, created_at: instante(-7 * 24) }],
  };
}

/* ---------- vault sintético (repositório kamappa/vault-sistema) ---------- */

export const NOTAS: Record<string, string> = {
  "Sistema/Estudo/IPCA/Cadeira-Sintetica/Aulas/2026-01-05.md":
    "---\ntags: [tipo/aula]\nid: 2026-01-05\n---\n# 2026-01-05 — Aula 01 — Cadeira-Sintetica\n## Tema sintético\nTexto inventado para teste. #exame\n",
  "Sistema/Estudo/Temas/Tema-Sintetico/Nota.md":
    "# Nota sintética\n## Secção 1\nTexto inventado para teste.\n",
};

export interface CommitSintetico {
  sha: string;
  pai: string | null;
  horas: number; // relativo a agora
  mensagem: string;
  ficheiros: Array<{ filename: string; status: "added" | "modified" | "removed" }>;
}

/** Do mais recente para o mais antigo, como a API devolve. C2 toca num ficheiro FORA
 *  de Sistema/Estudo, para provar que o filtro da função o deixa de fora. */
export const COMMITS: CommitSintetico[] = [
  {
    sha: "2222222222222222222222222222222222222222", pai: "1111111111111111111111111111111111111111", horas: -2,
    mensagem: "vault: alteração sintética C2",
    ficheiros: [
      { filename: "Sistema/Estudo/Temas/Tema-Sintetico/Nota.md", status: "modified" },
      { filename: "Oraculo/relatorio-2026-01-04.md", status: "added" },
    ],
  },
  {
    sha: "1111111111111111111111111111111111111111", pai: "0000000000000000000000000000000000000001", horas: -72,
    mensagem: "vault: alteração sintética C1",
    ficheiros: [
      { filename: "Sistema/Estudo/IPCA/Cadeira-Sintetica/Aulas/2026-01-05.md", status: "added" },
      { filename: "Sistema/Estudo/Temas/Tema-Sintetico/Nota.md", status: "modified" },
    ],
  },
  {
    sha: "0000000000000000000000000000000000000001", pai: null, horas: -240,
    mensagem: "vault: base sintética C0",
    ficheiros: [{ filename: "Sistema/Estudo/Temas/Tema-Sintetico/Nota.md", status: "added" }],
  },
];

export const dataDoCommit = (c: CommitSintetico) => instante(c.horas);

/* ---------- respostas sintéticas do modelo ---------- */

const noticia = (sufixo: string, area: string, extra: Linha = {}): Linha => ({
  title: "Notícia sintética " + sufixo.toUpperCase(), source: "Fonte Exemplo", url: "https://exemplo.invalid/" + sufixo,
  summary: "Resumo inventado para teste.", relevance: "Relevância inventada.", area, ...extra,
});

export const RESPOSTAS_DO_MODELO: Record<string, { texto: string; pesquisa: boolean }> = {
  radar: {
    pesquisa: true,
    texto: "Resultados da pesquisa:\n" + JSON.stringify([
      noticia("a", "nis2"),
      noticia("ja-visto", "rgpd"),
      noticia("c", "aigov", { impact: "alto", missao: { t: "Ler o relatório sintético C", why: "teste", area: "saber", pri: "P2", deadline: null } }),
    ]),
  },
  vigia: {
    pesquisa: true,
    texto: JSON.stringify([{
      title: "Vaga sintética", source: "Organização Exemplo", url: "https://exemplo.invalid/vaga",
      summary: "Requisitos inventados.", relevance: "Relevância inventada.", area: "vaga",
      missao: { t: "Candidatar: Vaga sintética (Organização Exemplo)", why: "teste", area: "oficio", pri: "P1", deadline: null },
    }]),
  },
  report: {
    pesquisa: true,
    texto: JSON.stringify({
      resumo: "(sintético) semana de teste", treino: "(sintético) sem dados de treino.", sono: "(sintético) sem registos de sono.",
      estudo: "(sintético) duas notas alteradas.", alerta: null, propostas: [],
      missoes_propostas: [{ t: "Missão sintética", why: "porque sim, é um teste", area: "saber", pri: "P2", deadline: null }],
      recursos: [], efemeride: null, profecia: null, recompensa: "(sintético) recompensa",
      titulo: "(sintético) título", legado: "(sintético) pergunta de reflexão?",
    }),
  },
  chat: { pesquisa: false, texto: "Resposta sintética do Conselho." },
  sussurro: { pesquisa: false, texto: "Linha sintética do sussurro." },
};
