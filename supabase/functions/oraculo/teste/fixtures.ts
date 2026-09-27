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

/* ---------- vault sintético (repositório kamappa/vault-sistema) ----------
 * Imita a semana real de 20/09: sincronizações de 15 em 15 minutos (mais de 100 na
 * janela de 7 dias — obriga a paginar), uma reorganização (renomear sem mudar texto,
 * apagar), uma alteração SÓ à Ficha em Eu/ (tem de ficar invisível), saídas do Oráculo
 * dentro de uma cadeira, um quadro do Excalidraw, um modelo e o Horario/alteracoes.md. */

export const CAMINHO = {
  aula: "Sistema/Estudo/IPCA/Cadeira-Sintetica/Aulas/2026-01-05.md",
  tema: "Sistema/Estudo/Temas/Tema-Sintetico/Nota.md",
  velha: "Sistema/Estudo/Temas/Tema-Velho/Velha.md",
  antigaOrigem: "Sistema/Estudo/IPCA/Cadeira-Antiga/Notas/Resumo.md",
  antigaDestino: "Sistema/Estudo/IPCA/_Arquivo/2025-26-S2/Cadeira-Antiga/Notas/Resumo.md",
  oraculoNaCadeira: "Sistema/Estudo/IPCA/Cadeira-Sintetica/Oraculo/resumo.md",
  quadro: "Sistema/Estudo/Temas/Tema-Sintetico/Quadro.excalidraw.md",
  modelo: "Sistema/Modelos/aula.md",
  ficha: "Sistema/Eu/Ficha-do-Jogador.md",
  horario: "Sistema/Horario/alteracoes.md",
} as const;

export const NOTAS: Record<string, string> = {
  [CAMINHO.aula]: "---\ntags: [tipo/aula]\nid: 2026-01-05\n---\n# 2026-01-05 — Aula 01 — Cadeira-Sintetica\n## Tema sintético\nTexto inventado para teste. #exame\n",
  [CAMINHO.tema]: "# Nota sintética\n## Secção 1\nTexto inventado para teste.\n",
  [CAMINHO.horario]: "# Alterações ao horário (sintético)\n## Semana sintética\n- Aula sintética adiada.\n",
  [CAMINHO.antigaDestino]: "# Resumo sintético arquivado\n",
  // Estes existem no repositório sintético e NUNCA podem ser lidos pela função:
  [CAMINHO.ficha]: "# Ficha sintética — NÃO DEVE SER LIDA\nMontante sintético: 0 €\n",
  [CAMINHO.oraculoNaCadeira]: "# Saída sintética do Oráculo — NÃO É ESTUDO\n",
  [CAMINHO.quadro]: "# Quadro sintético — NÃO DEVE SER LIDO\n",
  [CAMINHO.modelo]: "# Modelo sintético de aula\n",
};

export interface CommitSintetico {
  sha: string;
  pai: string | null;
  horas: number; // relativo a agora
  mensagem: string;
  ficheiros: Array<{ filename: string; status: "added" | "modified" | "removed" | "renamed"; changes?: number; previous_filename?: string }>;
}

/** Sincronizações entre -70 h e -30 h: fora da janela de 24 h, dentro da de 7 dias. */
export const SINCRONIZACOES = 110;

/** Do mais recente para o mais antigo, como a API devolve. */
export const COMMITS: CommitSintetico[] = (() => {
  const lista: CommitSintetico[] = [];
  let n = 0;
  const juntar = (horas: number, mensagem: string, ficheiros: CommitSintetico["ficheiros"]) => {
    n++;
    lista.push({ sha: n.toString(16).padStart(40, "0"), pai: lista.length ? lista[lista.length - 1].sha : null, horas, mensagem, ficheiros });
  };
  juntar(-240, "vault: base sintética C0", [
    { filename: CAMINHO.tema, status: "added" }, { filename: CAMINHO.velha, status: "added" }, { filename: CAMINHO.antigaOrigem, status: "added" },
  ]);
  juntar(-72, "vault: alteração sintética C1", [{ filename: CAMINHO.aula, status: "added" }, { filename: CAMINHO.tema, status: "modified" }]);
  for (let i = 0; i < SINCRONIZACOES; i++) juntar(-70 + i * (40 / SINCRONIZACOES), `vault: sincronização sintética ${i + 1}`, [{ filename: CAMINHO.tema, status: "modified" }]);
  juntar(-6, "vault: só a ficha (sintético)", [{ filename: CAMINHO.ficha, status: "modified" }]);
  juntar(-4, "vault: reorganização sintética", [
    { filename: CAMINHO.antigaDestino, previous_filename: CAMINHO.antigaOrigem, status: "renamed", changes: 0 },
    { filename: CAMINHO.velha, status: "removed" },
    { filename: CAMINHO.oraculoNaCadeira, status: "added" },
    { filename: CAMINHO.quadro, status: "added" },
    { filename: CAMINHO.modelo, status: "modified" },
  ]);
  juntar(-2, "vault: alteração sintética C2", [
    { filename: CAMINHO.tema, status: "modified" }, { filename: "Oraculo/relatorio-2026-01-04.md", status: "added" }, { filename: CAMINHO.horario, status: "modified" },
  ]);
  return lista.reverse();
})();

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
