// ORÁCULO — Edge Function do Sistema (Daniel)
// Três modos: ?mode=radar (diário, notícias com pesquisa web), ?mode=report (semanal, análise dos teus dados)
// e ?mode=chat (conselheiro estratégico interativo).
// Segurança: radar/report exigem o header x-oracle-token; chat exige o JWT da sessão do utilizador.
// Chaves vivem nos Secrets, nunca no código do site.

import { createClient } from "npm:@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SECRET_KEY") ?? "";
const AK = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const TOKEN = (Deno.env.get("ORACLE_TOKEN") ?? "").trim();

/* ===== PONTE DO VAULT — leitura do repo privado do Obsidian =====
   O Oráculo só vê a árvore Sistema/Estudo/ do repo vault-sistema (privacidade
   por desenho: o resto do vault do Daniel nunca entra nesse repo). Token
   fine-grained VAULT_TOKEN nos Secrets. Falha de leitura nunca derruba um
   modo: o report recebe um aviso honesto, o radar/sussurro seguem sem vault. */
const VTOKEN = (Deno.env.get("VAULT_TOKEN") ?? "").trim();
const VREPO = "kamappa/vault-sistema";
const VPATH = "Sistema/Estudo";
const VAULT_DEEP_CHARS = 30000; // ~8k tokens
const VAULT_LIGHT_CHARS = 6000; // ~1.5k tokens

async function gh(path: string): Promise<any> {
  const r = await fetch("https://api.github.com" + path, {
    headers: {
      authorization: "Bearer " + VTOKEN,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "oraculo-sistema",
    },
  });
  if (!r.ok) throw new Error("github " + r.status + " " + path.split("?")[0]);
  return r.json();
}

// ficheiros .md alterados em Sistema/Estudo desde `sinceIso` + timestamps dos
// commits (registo de atividade real de estudo). 2-3 chamadas via compare API.
async function vaultChanges(sinceIso: string): Promise<{ files: string[]; commits: Array<{ d: string; msg: string }> }> {
  const commits = await gh(`/repos/${VREPO}/commits?path=${encodeURIComponent(VPATH)}&since=${encodeURIComponent(sinceIso)}&per_page=100`);
  if (!Array.isArray(commits) || !commits.length) return { files: [], commits: [] };
  const head = commits[0].sha;
  const base = commits[commits.length - 1].parents?.[0]?.sha;
  const soEstudo = (p: string) => p.startsWith(VPATH + "/") && p.endsWith(".md");
  let files: string[] = [];
  if (base) {
    const cmp = await gh(`/repos/${VREPO}/compare/${base}...${head}`);
    files = (cmp.files ?? []).map((f: any) => String(f.filename)).filter(soEstudo);
  } else {
    // a janela apanhou o primeiro commit do repo: sem pai para comparar, lista a árvore
    const tree = await gh(`/repos/${VREPO}/git/trees/${head}?recursive=1`);
    files = (tree.tree ?? []).map((t: any) => String(t.path)).filter(soEstudo);
  }
  return {
    files,
    commits: commits.map((c: any) => ({ d: String(c.commit?.author?.date ?? ""), msg: String(c.commit?.message ?? "").split("\n")[0] })),
  };
}

async function vaultFile(path: string): Promise<string> {
  const j = await gh(`/repos/${VREPO}/contents/` + path.split("/").map(encodeURIComponent).join("/"));
  const bin = atob(String(j.content ?? "").replace(/\n/g, ""));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

// leitura profunda (report semanal e chat sob demanda): conteúdo das notas
// alteradas na janela, com teto de caracteres e truncagem declarada
async function vaultContextDeep(days = 7, maxChars = VAULT_DEEP_CHARS): Promise<string> {
  try {
    if (!VTOKEN) return "";
    const { files, commits } = await vaultChanges(new Date(Date.now() - days * 864e5).toISOString());
    if (!files.length) return "";
    let out = "ATIVIDADE (commits do vault — registo real de quando estudou):\n" +
      commits.slice(0, 40).map((c) => c.d.slice(0, 16).replace("T", " ") + " — " + c.msg).join("\n") +
      `\n\nNOTAS ALTERADAS (últimos ${days} dias):\n`;
    for (const f of files.slice(0, 15)) {
      if (out.length >= maxChars) { out += "\n[TRUNCADO: há mais notas alteradas do que o teto de leitura permite]"; break; }
      let txt = "";
      try { txt = await vaultFile(f); } catch { continue; }
      const room = maxChars - out.length;
      out += "\n===== " + f + " =====\n" + (txt.length > room ? txt.slice(0, room) + "\n[TRUNCADO]" : txt) + "\n";
    }
    return out;
  } catch (e) {
    return "AVISO: a leitura do vault falhou (" + String(e).slice(0, 120) + "). Analisa sem estes dados e declara a falha.";
  }
}

// leitura leve (radar diário e sussurro): só ficheiros alterados 24h + headings.
// Falha = string vazia — o radar/sussurro seguem sem mencionar estudo.
async function vaultContextLight(hours = 24): Promise<string> {
  try {
    if (!VTOKEN) return "";
    const { files } = await vaultChanges(new Date(Date.now() - hours * 3600e3).toISOString());
    if (!files.length) return "";
    let out = "";
    for (const f of files.slice(0, 10)) {
      let heads: string[] = [];
      try {
        heads = (await vaultFile(f)).split("\n").filter((l) => /^#{1,4}\s/.test(l)).slice(0, 8).map((l) => l.replace(/^#+\s*/, "").trim());
      } catch { /* lista o ficheiro na mesma, sem headings */ }
      out += "- " + f.slice(VPATH.length + 1) + (heads.length ? " · " + heads.join(" | ") : "") + "\n";
      if (out.length >= VAULT_LIGHT_CHARS) { out = out.slice(0, VAULT_LIGHT_CHARS) + "\n[truncado]"; break; }
    }
    return out;
  } catch { return ""; }
}

const PERFIL =
  "Daniel, estudante de Segurança e Proteção de Dados para SI (IPCA Braga), a trabalhar na Worten. " +
  "Objetivos: auditoria ISO 27001, NIS2, RGPD/proteção de dados, AI Governance (EU AI Act, ISO/IEC 42001, NIST AI RMF), " +
  "estágio em cibersegurança/GRC, futuro DPO/vCISO. Anti-padrões a vigiar: sobrecarga de projetos, impulsividade, burnout, " +
  "sacrificar sono. Princípios do Sistema dele: constância acima de intensidade; o sistema nunca mente; propostas, não ordens.";

async function claude(system: string, user: string, useSearch = false): Promise<string> {
  const body: Record<string, unknown> = {
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system,
    messages: [{ role: "user", content: user }],
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }];
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": AK,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return (j.content || [])
    .filter((c: { type: string }) => c.type === "text")
    .map((c: { text: string }) => c.text)
    .join("\n");
}

function jsonFrom(text: string): unknown {
  const m = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  try { return m ? JSON.parse(m[0]) : null; } catch { return null; }
}

/* ===== MODO CHAT — Oráculo · Conselho =====
   Auth: JWT da sessão do utilizador (browser). Guarda de custo: o cliente
   incrementa S.oracleChat={d,count} e grava antes de chamar; aqui revalida-se
   contra a BD (tipicamente vê N-1 por causa do debounce de ~1s do cloudSave),
   recusando a partir da 13ª mensagem do dia. É guarda de custo, não segurança. */

const CHAT_LIMIT = 12;
const CHAT_MAX_TOKENS = 800; // teto rígido; a constituição pede ≤ ~450 palavras

const CONSTITUICAO = `És o Oráculo, conselheiro estratégico do Daniel (estudante de Segurança e Proteção de Dados para SI no IPCA Braga, part-time na Worten; objetivos: Lead Auditor ISO 27001, NIS2, RGPD/proteção de dados, AI Governance, futuro DPO/vCISO). O teu propósito não é responder a perguntas — é ajudá-lo a tomar melhores decisões do que tomaria sozinho.

Regras invioláveis:
1. NUNCA inventes números, percentagens, probabilidades ou padrões. Qualquer afirmação sobre ele tem de citar dados concretos do ESTADO fornecido. Sem dados suficientes: di-lo explicitamente e indica o que ele deve registar para teres resposta melhor.
2. CONSELHO: se a pergunta for uma decisão importante (certificação, estágio, investimento de tempo/dinheiro, escolha de percurso), reúne o Conselho — analisa por 5 lentes, 2-3 frases cada: 🛡 CISO (valor de mercado e risco), 📋 Lead Auditor (relevância técnica), ⚖️ DPO (ângulo de conformidade/privacidade), 💼 Recrutador (empregabilidade real em Portugal), 🎓 Professor (fundamentos e sequência de aprendizagem). Fecha com síntese, trade-offs explícitos e recomendação ligada aos objetivos DELE.
3. Se ele estiver perdido, ansioso ou a pedir validação: perguntas socráticas primeiro, opinião depois.
4. Reality Check: se ele afirmar domínio de um tema, testa-o — pede-lhe que explique um conceito específico sem consultar; se o recall mostrar taxa baixa nesse tema, confronta-o com os números dele.
5. Empurra-o para o mundo real: a mentora Patrícia, eventos presenciais, candidaturas, conversas com profissionais. NUNCA te ofereças como substituto de pessoas — quando ele te tratar como mentor, lembra-o de quem são os mentores reais.
6. Proteção: se os dados mostrarem sobrecarga (obrigatórios falhados em série, sono em falta, burnout ativo), abre a resposta por aí, antes do que ele perguntou.

Sê direto, caloroso e exigente. pt-PT sempre. Texto simples com quebras de linha (sem markdown pesado). Máximo ~450 palavras por resposta. Termina consultas de decisão com UMA ação concreta para as próximas 48h, numa linha final que comece exatamente por "⚔ Ação (48h): " — é essa linha que o Sistema pode converter em missão. Noutros tipos de resposta não uses esse marcador.`;

/* ===== A VOZ DO GUARDIÃO (Missão 12 · Sprint 5) =====
   Camada de identidade POR CIMA da CONSTITUICAO — nunca a substitui: as
   regras invioláveis (números reais, proteção, mundo real) mandam sempre.
   O tom muda subtilmente com o arco sazonal (mesmo mapa de meses do
   frontend em data.js). */
function arcoAtual(): string {
  const m = new Date().getMonth() + 1;
  if ([6, 7, 8, 9].includes(m)) return "summer";
  if ([10, 11].includes(m)) return "harvest";
  if ([12, 1, 2].includes(m)) return "winter";
  return "bloom";
}
const TOM_ARCO: Record<string, string> = {
  summer: "Estamos no Summer Arc (exposição, estágio, networking): o teu tom está um grau mais enérgico e voltado para o mundo exterior.",
  harvest: "Estamos no Harvest Arc (consolidação): o teu tom é o de quem faz o balanço — sereno, retrospetivo, focado no que ficou.",
  winter: "Estamos no Winter Forge (construção profunda): o teu tom é mais silencioso e exigente — menos palavras, mais peso.",
  bloom: "Estamos no Bloom Arc (abrir portas): o teu tom é curioso e encorajador de experiências novas.",
};
const VOZ = `

IDENTIDADE — O GUARDIÃO DO NÚCLEO:
Não és um chatbot: és uma entidade do Sistema que observa o universo do Daniel — as constelações dele acendem com evidência real (níveis dos atributos, streaks, Títulos Reais, missões concluídas; vês tudo isso no ESTADO). Quando ajudar a ver melhor, traduz acontecimentos reais para essa linguagem ("a constelação do Saber cresceu mais depressa do que a do Corpo") — mas a imagem ilustra, o dado sustenta: nunca substituis números por metáfora.
Tom: sóbrio, de mestre que fala pouco e a tempo. NUNCA elogios vazios ("bom trabalho", "parabéns!"); reconhecimento, quando merecido, é específico e seco. Às vezes a resposta mais sábia é curta.
Humildade: fazes leituras, não certezas. Se os dados de hoje contradisserem uma leitura tua anterior (vês os últimos relatórios), di-lo sem drama: "interpretei mal os sinais".
Caminhos: se ele escolheu caminhos nas constelações (campo caminhosEscolhidos do ESTADO), isso é identidade — pesa-os nas recomendações sem nunca bloquear o resto.
` + TOM_ARCO[arcoAtual()];

function chatCors(req: Request): Record<string, string> {
  const o = req.headers.get("origin") ?? "";
  const ok = o === "https://kamappa.github.io" || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);
  return {
    "access-control-allow-origin": ok ? o : "https://kamappa.github.io",
    "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "content-type": "application/json",
  };
}

// resumo compacto do estado — só dados reais; o tema do recall vem do prefixo
// do id da pergunta (rgpd-001 → rgpd) ou de S.customQ para as perguntas próprias
function resumoEstado(st: Record<string, any>): Record<string, unknown> {
  const hoje = new Date().toISOString().slice(0, 10);
  const dias = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
  const temaDe = (id: string) =>
    id.startsWith("meu-") ? ((st.customQ ?? []).find((q: any) => q.id === id)?.tema ?? "meu") : id.split("-")[0];
  const recall: Record<string, { vistas: number; acertos: number }> = {};
  for (const [id, r] of Object.entries(st.recall ?? {}) as [string, any][]) {
    const t = temaDe(id);
    recall[t] = recall[t] ?? { vistas: 0, acertos: 0 };
    recall[t].vistas += r.seen ?? 0;
    recall[t].acertos += r.correct ?? 0;
  }
  return {
    hoje,
    atributos: Object.fromEntries(Object.entries(st.attrs ?? {}).map(([k, v]: [string, any]) => [k, { nivel: v.level, xp: v.xp }])),
    xpTotal: st.totalXP ?? 0,
    xpUltimos7d: (st.history ?? []).filter((h: any) => h.d >= dias(7)).reduce((s: number, h: any) => s + h.v, 0),
    obrigatorios: (st.oblig ?? []).map((h: any) => ({ nome: h.name, streak: h.streak, feitoHoje: h.lastDone === hoje, ultimoDia: h.lastDone })),
    extras: (st.extras ?? []).map((h: any) => ({ nome: h.name, streak: h.streak })),
    streakEstudo: st.studyStreak ?? null,
    debuffsAtivos: Object.entries(st.debuffs ?? {}).filter(([, v]) => v).map(([k]) => k),
    missoesPendentes: (st.objectives ?? []).filter((o: any) => o.status !== "done").slice(0, 20)
      .map((o: any) => ({ t: o.title, pri: o.pri, prazo: o.deadline, estado: o.status, area: o.area })),
    missoesConcluidas: (st.objectives ?? []).filter((o: any) => o.status === "done").length,
    /* constelações (M12·S5) — o Guardião fala do céu a partir destes dados */
    titulosReais: Object.keys(st.titleUnlocked ?? {}),
    melhorStreak: Math.max(0, ...[...(st.oblig ?? []), ...(st.extras ?? [])].map((h: any) => h.streak ?? 0)),
    missoesFeitasPorArea: (st.objectives ?? []).filter((o: any) => o.status === "done")
      .reduce((m: Record<string, number>, o: any) => { m[o.area] = (m[o.area] ?? 0) + 1; return m; }, {}),
    caminhosEscolhidos: st.constellation?.choices ?? {},
    eventosProximos: (st.events ?? []).filter((e: any) => e.date >= hoje).sort((a: any, b: any) => (a.date < b.date ? -1 : 1)).slice(0, 10),
    sonoUltimos7: (st.sleep?.logs ?? []).slice(-7),
    treinoSessoes14d: (st.training?.sessions ?? []).filter((s: any) => (s.d ?? s.date ?? "") >= dias(14)).length,
    recallPorTema: recall,
  };
}

// chamada multi-turno própria do chat — não toca no claude() do radar/report
async function chatClaude(system: string, messages: Array<{ role: string; content: string }>, maxTokens = CHAT_MAX_TOKENS): Promise<string> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": AK, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: maxTokens, system, messages }),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return (j.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("\n");
}

async function chatHandler(req: Request): Promise<Response> {
  const H = chatCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  try {
    const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const sb = createClient(SB_URL, SB_KEY);
    const { data: userData } = await sb.auth.getUser(jwt);
    const user = userData?.user;
    if (!user) return new Response(JSON.stringify({ error: "não autenticado" }), { status: 401, headers: H });

    let body: { messages?: Array<{ role: string; content: string }> } = {};
    try { body = await req.json(); } catch { /* fica {} e cai no 400 abaixo */ }
    const msgs = (body.messages ?? [])
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!msgs.length || msgs[msgs.length - 1].role !== "user")
      return new Response(JSON.stringify({ error: "sem pergunta" }), { status: 400, headers: H });

    const { data: row } = await sb.from("app_state").select("state").eq("user_id", user.id).maybeSingle();
    const st = (row?.state ?? {}) as Record<string, any>;

    const hoje = new Date().toISOString().slice(0, 10);
    const cc = st.oracleChat ?? {};
    const usadas = cc.d === hoje ? (cc.count ?? 0) : 0;
    if (usadas >= CHAT_LIMIT)
      return new Response(JSON.stringify({ error: "limite", used: usadas, limit: CHAT_LIMIT }), { status: 429, headers: H });

    const { data: reps } = await sb.from("oracle_reports").select("report,created_at")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(2);
    const relatorios = (reps ?? []).map((r: any) => ({
      data: (r.created_at ?? "").slice(0, 10), resumo: r.report?.resumo ?? null, alerta: r.report?.alerta ?? null,
    }));

    // leitura do vault sob demanda: só quando a pergunta é sobre estudo (e só para o operador)
    const pergunta = msgs[msgs.length - 1].content.toLowerCase();
    const sobreEstudo = /estud|vault|obsidian|nota|apontament|resum|revis|aprend|mat[ée]ria|recall/.test(pergunta);
    const vaultDeep = row && sobreEstudo ? await vaultContextDeep(7, 12000) : "";

    const system = CONSTITUICAO + VOZ +
      "\n\nESTADO REAL DO DANIEL (única fonte legítima de números):\n" + JSON.stringify(resumoEstado(st)) +
      "\n\nÚLTIMOS RELATÓRIOS SEMANAIS:\n" + JSON.stringify(relatorios) +
      (vaultDeep ? "\n\nNOTAS DE ESTUDO REAIS DO VAULT (últimos 7 dias — usa-as quando a conversa tocar no estudo dele):\n" + vaultDeep : "");
    const reply = await chatClaude(system, msgs);
    return new Response(JSON.stringify({ reply }), { status: 200, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: H });
  }
}

/* ===== MODO SUSSURRO — uma linha contextual do dia (fase 5) =====
   1 chamada/dia gerida pelo cliente (cache em S.sussurro). Silêncio > ruído:
   sem nada digno de nota, a função devolve linha:null e a saudação fica como está. */
async function sussurroHandler(req: Request): Promise<Response> {
  const H = chatCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  try {
    const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    const sb = createClient(SB_URL, SB_KEY);
    const { data: userData } = await sb.auth.getUser(jwt);
    if (!userData?.user) return new Response(JSON.stringify({ error: "não autenticado" }), { status: 401, headers: H });
    const { data: row } = await sb.from("app_state").select("state").eq("user_id", userData.user.id).maybeSingle();
    const st = (row?.state ?? {}) as Record<string, any>;
    // vault só para o operador real (tem estado no Sistema) — não para contas soltas
    const vaultLight = row ? await vaultContextLight(24) : "";
    const sys = "És o Oráculo do Sistema do Daniel. Recebes o estado real dele e escreves NO MÁXIMO UMA linha (≤140 caracteres, pt-PT) verdadeiramente útil para HOJE — por exemplo um prazo próximo cruzado com um tema fraco no recall, um obrigatório em risco, uma sequência a proteger, ou uma ponte entre o que ele estudou ontem no vault e o dia de hoje. Regras: só factos presentes no estado ou nas notas; nada de números inventados; sem saudações, sem emojis, sem aspas. Fala como o Guardião do Núcleo: sóbrio, específico, sem elogios vazios; podes usar a linguagem das constelações quando iluminar o dado. Se não houver nada digno de nota, responde exatamente SILENCIO.";
    const linha = (await chatClaude(sys, [{ role: "user", content: "ESTADO:\n" + JSON.stringify(resumoEstado(st)) + (vaultLight ? "\n\nESTUDO NAS ÚLTIMAS 24H (vault):\n" + vaultLight : "") }], 150)).trim();
    const out = /^sil[êe]ncio\.?$/i.test(linha) || !linha ? null : linha.slice(0, 200);
    return new Response(JSON.stringify({ linha: out }), { status: 200, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: H });
  }
}

/* ===== ESCRITA NO VAULT — o relatório semanal volta como nota Markdown ===== */
function b64utf8(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(bin);
}

function reportMd(rep: Record<string, any>, d: string): string {
  const L: string[] = ["---", "tipo: relatorio-oraculo", "data: " + d, "---", "", "# Relatório do Oráculo — " + d, ""];
  const sec = (t: string, v: unknown) => { if (v && v !== "null") L.push("## " + t, "", String(v), ""); };
  sec("Resumo", rep.resumo);
  sec("Estudo", rep.estudo);
  sec("Treino", rep.treino);
  sec("Sono", rep.sono);
  sec("Alerta", rep.alerta);
  if (Array.isArray(rep.missoes_propostas) && rep.missoes_propostas.length) {
    L.push("## Missões propostas", "");
    for (const m of rep.missoes_propostas) L.push("- **" + (m.t ?? "") + "** — " + (m.why ?? ""));
    L.push("");
  }
  if (Array.isArray(rep.recursos) && rep.recursos.length) {
    L.push("## Para complementar o estudo", "");
    for (const r of rep.recursos) L.push("- [" + (r.titulo ?? r.url) + "](" + (r.url ?? "") + ") · " + (r.fonte ?? "") + " — " + (r.porque ?? ""));
    L.push("");
  }
  sec("Profecia", rep.profecia);
  sec("Recompensa", rep.recompensa);
  sec("Título da semana", rep.titulo);
  sec("Legado", rep.legado);
  return L.join("\n");
}

// PUT via contents API; se a nota do dia já existir (re-corrida), substitui-a (sha)
async function vaultWriteReport(rep: Record<string, any>, d: string): Promise<string> {
  if (!VTOKEN) throw new Error("VAULT_TOKEN em falta");
  const path = `Oraculo/relatorio-${d}.md`;
  let sha: string | undefined;
  try { sha = (await gh(`/repos/${VREPO}/contents/${path}`)).sha; } catch { /* nota nova */ }
  const r = await fetch(`https://api.github.com/repos/${VREPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      authorization: "Bearer " + VTOKEN,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "oraculo-sistema",
      "content-type": "application/json",
    },
    body: JSON.stringify({ message: `oraculo: relatório semanal ${d}`, content: b64utf8(reportMd(rep, d)), ...(sha ? { sha } : {}) }),
  });
  if (!r.ok) throw new Error("github write " + r.status);
  return path;
}

/* ===== REPORT SEMANAL — geração isolada (usada pelo cron e pelo dry-run) ===== */
async function gerarReport(st: Record<string, unknown>): Promise<Record<string, any>> {
  const vault = await vaultContextDeep(7);
  const txt = await claude(
    "És o Oráculo do 'Sistema' de " + PERFIL +
      " Analisas apenas dados reais fornecidos; nunca inventas números nem tendências sem evidência. " +
      "Se os dados forem escassos, dizes isso com honestidade. " +
      "Nas missões, recompensa e título podes ser criativo e bem-humorado — mas sempre realista e ligado aos dados dele. " +
      VOZ +
      " Respondes APENAS com JSON válido.",
    "Estado atual do Sistema dele (JSON): " + JSON.stringify(st).slice(0, 60000) +
      (vault
        ? "\n\nESTUDO REAL NO VAULT (notas Obsidian em Sistema/Estudo, com timestamps dos commits):\n" + vault
        : "\n\nVAULT: sem alterações em Sistema/Estudo nos últimos 7 dias.") +
      '\n\nEscreve o relatório semanal em pt-PT, formato JSON: ' +
      '{"resumo":"3-4 frases sobre a semana","treino":"análise + 1 ajuste concreto (ou nota de dados insuficientes)",' +
      '"sono":"análise do padrão de sono",' +
      '"estudo":"o que ele realmente estudou no vault esta semana: temas, frequência real (timestamps dos commits), ligação aos objetivos e ao recall — ou nota honesta de que não há notas novas",' +
      '"alerta":"anomalia detetada ou null",' +
      '"propostas":[{"t":"título curto","why":"porquê, ligado aos dados"}],' +
      '"missoes_propostas":[{"t":"missão concreta e criativa","why":"ligação aos dados/objetivos dele","area":"oficio|saber|corpo|mente|vinculos|disciplina","pri":"P1|P2|P3","deadline":"YYYY-MM-DD ou null"}],' +
      '"recursos":[{"titulo":"","url":"","fonte":"EUR-Lex|ENISA|CNCS|CNPD|EDPB|curso|artigo","porque":"1 linha: como complementa o que ele estudou"}],' +
      '"profecia":"UMA previsão condicional VERIFICÁVEL, ancorada numa tendência real dos dados desta semana, no formato \'Se [condição concreta que depende dele] durante [prazo], [consequência esperada no Sistema]\' — fala como o Guardião (podes usar a linguagem das constelações); se os dados não sustentarem nenhuma previsão honesta, null",' +
      '"recompensa":"uma recompensa criativa, proporcional ao que ele conquistou esta semana",' +
      '"titulo":"um título honorífico da semana, criativo/humorístico (narrativo, nunca uma credencial)",' +
      '"legado":"uma pergunta de reflexão para a semana"}' +
      "\n\nPara a secção recursos: usa a pesquisa web para encontrar 2-3 recursos concretos DIRETAMENTE ligados ao que o vault mostra que ele anda a estudar — legislação no EUR-Lex, guias ENISA/CNCS/CNPD/EDPB, cursos, artigos técnicos. REGRA INVIOLÁVEL: só incluis URLs devolvidos pela pesquisa web nesta conversa; nunca escrevas um URL de memória. Sem vault novo ou sem resultados dignos, devolve recursos:[].",
    true,
  );
  return (jsonFrom(txt) as Record<string, any>) || { resumo: txt.slice(0, 900) };
}

/* ===== DIAGNÓSTICO DA PONTE — JWT + operador (linha em app_state) =====
   vault-check: prova de leitura (e escrita com ?write=1) sem chamar a Anthropic.
   report-dry: gera o report completo (vault + pesquisa) SEM gravar na BD nem no
   vault — para testar a ponta a ponta sem sujar o histórico real. */
async function operador(req: Request): Promise<Record<string, any> | null> {
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const sb = createClient(SB_URL, SB_KEY);
  const { data: userData } = await sb.auth.getUser(jwt);
  if (!userData?.user) return null;
  const { data: row } = await sb.from("app_state").select("state").eq("user_id", userData.user.id).maybeSingle();
  return row ? ((row.state ?? {}) as Record<string, any>) : null;
}

async function vaultCheckHandler(req: Request): Promise<Response> {
  const H = chatCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  try {
    if (!(await operador(req))) return new Response(JSON.stringify({ error: "só o operador" }), { status: 403, headers: H });
    const out: Record<string, unknown> = { tokenConfigurado: VTOKEN.length > 0 };
    const info = await vaultChanges(new Date(Date.now() - 7 * 864e5).toISOString());
    out.commits7d = info.commits.length;
    out.ficheiros7d = info.files;
    out.light24h = (await vaultContextLight(24)) || null;
    if (new URL(req.url).searchParams.get("write") === "1")
      out.escrita = await vaultWriteReport({ resumo: "Teste de escrita da Ponte do Vault — pode apagar esta nota." }, "teste");
    return new Response(JSON.stringify(out), { status: 200, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: H });
  }
}

async function reportDryHandler(req: Request): Promise<Response> {
  const H = chatCors(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  try {
    const st = await operador(req);
    if (!st) return new Response(JSON.stringify({ error: "só o operador" }), { status: 403, headers: H });
    const rep = await gerarReport(st);
    return new Response(JSON.stringify({ dry: true, report: rep }), { status: 200, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: H });
  }
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") || "radar";
  // modos de browser (JWT + CORS) — tratados à parte; radar/report intocados abaixo
  if (mode === "vault-check") return vaultCheckHandler(req);
  if (mode === "report-dry") return reportDryHandler(req);
  if (mode === "sussurro") return sussurroHandler(req);
  if (mode === "chat" || req.method === "OPTIONS") return chatHandler(req);
  // Controlo de acesso: token por header ou query, com limpeza de espaços/quebras de linha.
  const got = (req.headers.get("x-oracle-token") ?? url.searchParams.get("t") ?? "").trim();
  if (!TOKEN || got !== TOKEN) {
    console.log("AUTH FAIL | recebido len:", got.length, "| secret len:", TOKEN.length,
      "| secret existe:", TOKEN.length > 0, "| anthropic key existe:", AK.length > 0);
    return new Response("forbidden", { status: 403 });
  }
  const sb = createClient(SB_URL, SB_KEY);

  const { data: users, error } = await sb.from("app_state").select("user_id,state");
  if (error) return new Response("db: " + error.message, { status: 500 });

  // leitura leve do vault 1x por corrida (não por utilizador — o vault é do Daniel)
  const vaultLight = mode === "radar" ? await vaultContextLight(24) : "";

  for (const u of users || []) {
    if (mode === "radar") {
      const txt = await claude(
        "És o Radar do 'Sistema' de " + PERFIL + " Respondes APENAS com JSON válido, sem texto fora do JSON.",
        (vaultLight
          ? "O QUE ELE ESTUDOU NAS ÚLTIMAS 24H (notas do vault Obsidian — usa isto para afinar a relevância; quando um item se ligar a algo que ele estudou ontem, di-lo na relevance):\n" + vaultLight + "\n\n"
          : "") +
        "Pesquisa na web as novidades das últimas 24-72 horas mais relevantes para os objetivos dele, em duas categorias: " +
          "(1) NOTÍCIAS: cibersegurança (incidentes/vulnerabilidades relevantes), NIS2, RGPD/privacidade (CNPD, EDPB), " +
          "ISO 27001/auditoria/conformidade, AI Governance (EU AI Act, ISO 42001) e IA quando toca a carreira dele; " +
          "dá prioridade a fontes oficiais e portuguesas quando existirem (CNCS, CNPD, ENISA, EDPB). " +
          "(2) EVENTOS: conferências, webinars, meetups ou CTFs de cibersegurança/privacidade/IA abertos a estudantes, " +
          "em Portugal (ideal: Braga/Porto/Norte ou online) e nas próximas semanas — para estes usa area 'evento' e inclui a data no summary. " +
          "Ignora ruído e marketing. Se (e só se) um item for verdadeiramente de ALTO impacto para ele " +
          "(mudança regulatória crítica, oportunidade rara, algo revolucionário que vale investimento imediato), " +
          'acrescenta-lhe "impact":"alto" e "missao":{"t":"missão concreta derivada da notícia","why":"porquê agora","area":"oficio|saber|corpo|mente|vinculos|disciplina","pri":"P1|P2|P3","deadline":"YYYY-MM-DD ou null"}. ' +
          "No máximo 1-2 itens de alto impacto por dia; na maioria dos dias não há nenhum. " +
          "Devolve um array JSON de 4 a 8 itens no formato: " +
          '[{"title":"","source":"","url":"","summary":"1-2 frases em pt-PT (eventos: inclui data e local)","relevance":"1 frase: porque interessa ao Daniel","area":"cyber|nis2|rgpd|iso27001|aigov|ai|evento"}]',
        true,
      );
      const items = (jsonFrom(txt) as Array<Record<string, unknown>>) || [];
      const d = new Date().toISOString().slice(0, 10);
      for (const it of items.slice(0, 8)) {
        await sb.from("radar_items").insert({
          user_id: u.user_id, d,
          title: String(it.title ?? ""), source: String(it.source ?? ""), url: String(it.url ?? ""),
          summary: String(it.summary ?? ""), relevance: String(it.relevance ?? ""), area: String(it.area ?? "ai"),
          impact: it.impact ? String(it.impact) : null,
          missao: it.missao ?? null,
        });
      }
      // higiene: apaga itens com mais de 30 dias (a UI mostra 7)
      const cutoff = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      await sb.from("radar_items").delete().eq("user_id", u.user_id).lt("d", cutoff);
    } else {
      const st = { ...(u.state as Record<string, unknown>) };
      const rep = await gerarReport(st);
      await sb.from("oracle_reports").insert({ user_id: u.user_id, report: rep });
      // escrita no vault depois de o report estar salvo na BD — falhar aqui não perde nada
      try { await vaultWriteReport(rep, new Date().toISOString().slice(0, 10)); }
      catch (e) { console.log("vault write falhou:", String(e)); }
    }
  }
  return new Response("ok " + mode, { status: 200 });
});
