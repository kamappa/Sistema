/* MODO DE TESTE DO ORÁCULO — Lote 0 (2026-09-23).
 *
 * Substitui só as três fronteiras externas da função — a API da Anthropic, a API do
 * GitHub (o vault) e o cliente Supabase — por duplos sobre dados fixos e sintéticos
 * (fixtures.ts). A lógica da função corre toda de verdade: autenticação, dedupe do
 * radar, limpeza, geração e gravação do relatório, leitura do vault.
 *
 * Garantias:
 *   · zero chamadas à Anthropic e zero escritas no vault: os pedidos vão para os
 *     duplos; o que não tiver dados fixos é RECUSADO e registado, nunca deixado
 *     passar. O Deno corre com rede só para 127.0.0.1 (testes/fumo), por isso nem
 *     um erro aqui chegaria à internet;
 *   · só liga com ORACLE_TEST_MODE=fixtures E um SUPABASE_URL local. Em produção o
 *     SUPABASE_URL é o do projeto: o modo não pode ligar-se lá, por construção.
 *
 * Nada deste ficheiro corre em produção: `ativar` devolve null e a função segue
 * pelo `fetch` e pelo `createClient` reais.
 */

import { baseInicial, COMMITS, dataDoCommit, JWTS, NOTAS, RESPOSTAS_DO_MODELO, type CommitSintetico } from "./fixtures.ts";

type Linha = Record<string, unknown>;
const VREPO = "kamappa/vault-sistema";
const MODOS = ["radar", "vigia", "report", "chat", "sussurro"] as const;

export function ativar(flag: string | undefined, supabaseUrl: string | undefined, porta: number) {
  if (flag !== "fixtures") return null;
  let local = false;
  try {
    const u = new URL(supabaseUrl ?? "");
    local = u.protocol === "http:" && (u.hostname === "127.0.0.1" || u.hostname === "localhost");
  } catch { local = false; }
  if (!local) {
    console.warn("ORACLE_TEST_MODE=fixtures ignorado: o SUPABASE_URL não é local.");
    return null;
  }
  return criarMundo(porta);
}

function criarMundo(porta: number) {
  const bd = baseInicial();
  const registo = {
    anthropic: {
      total: 0,
      porModo: Object.fromEntries(MODOS.map((m) => [m, 0])) as Record<string, number>,
      ultimoPedido: {} as Record<string, string>,
    },
    github: { leituras: 0, escritasBloqueadas: [] as Array<{ caminho: string; conteudo: string; mensagem: string }> },
    bd: {
      radar_items: { inserts: 0, inseridos: [] as Linha[], deletes: 0, urlsApagados: [] as string[], linhas: 0 },
      oracle_reports: { inserts: 0, inseridos: [] as Linha[], linhas: 0 },
    } as Record<string, { inserts: number; inseridos: Linha[]; deletes?: number; urlsApagados?: string[]; linhas: number }>,
    recusados: [] as string[],
  };
  const atualizarLinhas = () => {
    for (const t of Object.keys(registo.bd)) registo.bd[t].linhas = (bd[t] ?? []).length;
  };
  atualizarLinhas();

  /* ---------------- Anthropic (Messages API) ---------------- */
  function modoDoPedido(corpo: { system?: unknown; messages?: Array<{ content?: unknown }> }): string | null {
    const sistema = String(corpo.system ?? "");
    const primeira = String(corpo.messages?.[0]?.content ?? "");
    if (sistema.includes("És o Radar")) return "radar";
    if (sistema.includes("Vigia de Estágios")) return "vigia";
    if (primeira.includes("Escreve o relatório semanal")) return "report";
    if (sistema.includes("NO MÁXIMO UMA linha")) return "sussurro";
    if (sistema.includes("conselheiro estratégico")) return "chat";
    return null;
  }

  function anthropic(init?: RequestInit): Response {
    const corpo = JSON.parse(String(init?.body ?? "{}"));
    const modo = modoDoPedido(corpo);
    if (!modo) {
      registo.recusados.push("POST https://api.anthropic.com/v1/messages (pedido sem dados fixos)");
      return Response.json({ type: "error", error: { type: "invalid_request_error", message: "modo de teste: pedido sem dados fixos" } }, { status: 400 });
    }
    registo.anthropic.total++;
    registo.anthropic.porModo[modo]++;
    registo.anthropic.ultimoPedido[modo] = (corpo.messages ?? []).map((m: { content?: unknown }) => String(m.content ?? "")).join("\n");
    const r = RESPOSTAS_DO_MODELO[modo];
    const content: unknown[] = [];
    if (r.pesquisa) {
      // Estrutura real de uma resposta com a ferramenta de pesquisa: blocos de
      // ferramenta antes do texto. A função tem de ficar só com o texto.
      content.push({ type: "server_tool_use", id: "srvtoolu_teste", name: "web_search", input: { query: "pesquisa sintética" } });
      content.push({ type: "web_search_tool_result", tool_use_id: "srvtoolu_teste", content: [{ type: "web_search_result", url: "https://exemplo.invalid/fonte", title: "Fonte sintética", encrypted_content: "", page_age: null }] });
    }
    content.push({ type: "text", text: r.texto });
    return Response.json({
      id: "msg_teste_" + registo.anthropic.total, type: "message", role: "assistant", model: corpo.model ?? "desconhecido",
      content, stop_reason: "end_turn", stop_sequence: null,
      usage: { input_tokens: 0, output_tokens: 0, server_tool_use: { web_search_requests: r.pesquisa ? 1 : 0 } },
    });
  }

  /* ---------------- GitHub (vault) ---------------- */
  const b64 = (texto: string) => {
    const bytes = new TextEncoder().encode(texto);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/(.{60})/g, "$1\n"); // o GitHub parte o base64 em linhas
  };
  const deB64 = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, "")), (c) => c.charCodeAt(0)));
  const api = `https://api.github.com/repos/${VREPO}`;
  const commitApi = (c: CommitSintetico) => ({
    sha: c.sha, node_id: "C_teste_" + c.sha.slice(0, 7),
    commit: {
      author: { name: "Obsidian Git (sintético)", email: "sintetico@exemplo.invalid", date: dataDoCommit(c) },
      committer: { name: "Obsidian Git (sintético)", email: "sintetico@exemplo.invalid", date: dataDoCommit(c) },
      message: c.mensagem, tree: { sha: "t" + c.sha.slice(1), url: `${api}/git/trees/t${c.sha.slice(1)}` },
      url: `${api}/git/commits/${c.sha}`, comment_count: 0,
      verification: { verified: false, reason: "unsigned", signature: null, payload: null, verified_at: null },
    },
    url: `${api}/commits/${c.sha}`, html_url: `https://github.com/${VREPO}/commit/${c.sha}`,
    comments_url: `${api}/commits/${c.sha}/comments`, author: null, committer: null,
    parents: c.pai ? [{ sha: c.pai, url: `${api}/commits/${c.pai}`, html_url: `https://github.com/${VREPO}/commit/${c.pai}` }] : [],
  });
  const naoEncontrado = () => Response.json({ message: "Not Found", documentation_url: "https://docs.github.com/rest", status: "404" }, { status: 404 });

  function github(url: URL, metodo: string, init?: RequestInit): Response {
    const caminho = decodeURIComponent(url.pathname);
    const pre = `/repos/${VREPO}`;
    if (!caminho.startsWith(pre)) return recusar(metodo, url);
    const resto = caminho.slice(pre.length);

    if (metodo === "PUT" && resto.startsWith("/contents/")) {
      // ESCRITA NO VAULT — bloqueada. Regista o que a função teria escrito.
      const corpo = JSON.parse(String(init?.body ?? "{}"));
      const destino = resto.slice("/contents/".length);
      registo.github.escritasBloqueadas.push({ caminho: destino, conteudo: deB64(String(corpo.content ?? "")), mensagem: String(corpo.message ?? "") });
      return Response.json({
        content: { name: destino.split("/").pop(), path: destino, sha: "0".repeat(40), type: "file" },
        commit: { sha: "0".repeat(40), message: corpo.message ?? "" },
      }, { status: 201 });
    }
    if (metodo !== "GET") return recusar(metodo, url);
    registo.github.leituras++;

    if (resto === "/commits") {
      const alvo = url.searchParams.get("path") ?? "";
      const desde = Date.parse(url.searchParams.get("since") ?? "1970-01-01T00:00:00Z");
      const lista = COMMITS
        .filter((c) => Date.parse(dataDoCommit(c)) >= desde)
        .filter((c) => !alvo || c.ficheiros.some((f) => f.filename === alvo || f.filename.startsWith(alvo + "/")))
        .map(commitApi);
      return Response.json(lista);
    }
    const cmp = resto.match(/^\/compare\/([0-9a-f]{40})\.\.\.([0-9a-f]{40})$/);
    if (cmp) {
      const [, base, cabeca] = cmp;
      const iCabeca = COMMITS.findIndex((c) => c.sha === cabeca);
      const iBase = COMMITS.findIndex((c) => c.sha === base);
      if (iCabeca < 0 || iBase < 0 || iBase <= iCabeca) return naoEncontrado();
      const intervalo = COMMITS.slice(iCabeca, iBase).reverse(); // do mais antigo ao mais recente
      const estado = new Map<string, string>();
      for (const c of intervalo) for (const f of c.ficheiros) {
        const antes = estado.get(f.filename);
        estado.set(f.filename, antes === "added" && f.status === "modified" ? "added" : f.status);
      }
      const files = [...estado.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([filename, status]) => ({
        sha: "f".repeat(40), filename, status, additions: 1, deletions: status === "removed" ? 1 : 0, changes: 1,
        blob_url: `https://github.com/${VREPO}/blob/${cabeca}/${filename}`, raw_url: `https://github.com/${VREPO}/raw/${cabeca}/${filename}`,
        contents_url: `${api}/contents/${filename}?ref=${cabeca}`, patch: "@@ sintético @@",
      }));
      return Response.json({
        url: `${api}/compare/${base}...${cabeca}`, html_url: `https://github.com/${VREPO}/compare/${base}...${cabeca}`,
        status: "ahead", ahead_by: intervalo.length, behind_by: 0, total_commits: intervalo.length,
        base_commit: commitApi(COMMITS[iBase]), merge_base_commit: commitApi(COMMITS[iBase]),
        commits: intervalo.map(commitApi), files,
      });
    }
    if (resto.startsWith("/contents/")) {
      const alvo = resto.slice("/contents/".length);
      const texto = NOTAS[alvo];
      if (texto === undefined) return naoEncontrado();
      return Response.json({
        type: "file", encoding: "base64", size: new TextEncoder().encode(texto).length,
        name: alvo.split("/").pop(), path: alvo, content: b64(texto), sha: "a".repeat(40),
        url: `${api}/contents/${alvo}`, git_url: `${api}/git/blobs/${"a".repeat(40)}`,
        html_url: `https://github.com/${VREPO}/blob/main/${alvo}`, download_url: `https://raw.githubusercontent.com/${VREPO}/main/${alvo}`,
        _links: { self: `${api}/contents/${alvo}`, git: `${api}/git/blobs/${"a".repeat(40)}`, html: `https://github.com/${VREPO}/blob/main/${alvo}` },
      });
    }
    return recusar(metodo, url);
  }

  function recusar(metodo: string, url: URL): Response {
    registo.recusados.push(`${metodo} ${url.origin}${url.pathname}`);
    return Response.json({ message: "modo de teste: pedido sem dados fixos" }, { status: 501 });
  }

  /* ---------------- rede: tudo passa por aqui ---------------- */
  const fetchTeste = (entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = new URL(typeof entrada === "string" ? entrada : entrada instanceof URL ? entrada.href : entrada.url);
    const metodo = (init?.method ?? "GET").toUpperCase();
    if (url.hostname === "api.anthropic.com" && url.pathname === "/v1/messages" && metodo === "POST") return Promise.resolve(anthropic(init));
    if (url.hostname === "api.github.com") return Promise.resolve(github(url, metodo, init));
    return Promise.resolve(recusar(metodo, url));
  };

  /* ---------------- Supabase (base de dados e autenticação) ---------------- */
  class Consulta implements PromiseLike<{ data: unknown; error: null }> {
    private filtros: Array<(l: Linha) => boolean> = [];
    private operacao: "select" | "insert" | "delete" = "select";
    private colunas = "*";
    private ordem: { coluna: string; asc: boolean } | null = null;
    private limite: number | null = null;
    private unica = false;
    private novas: Linha[] = [];
    constructor(private tabela: string) {}
    select(colunas = "*") { this.colunas = colunas; return this; }
    eq(c: string, v: unknown) { this.filtros.push((l) => l[c] === v); return this; }
    gte(c: string, v: unknown) { this.filtros.push((l) => String(l[c]) >= String(v)); return this; }
    lt(c: string, v: unknown) { this.filtros.push((l) => String(l[c]) < String(v)); return this; }
    order(c: string, o?: { ascending?: boolean }) { this.ordem = { coluna: c, asc: o?.ascending !== false }; return this; }
    limit(n: number) { this.limite = n; return this; }
    maybeSingle() { this.unica = true; return this; }
    insert(linhas: Linha | Linha[]) { this.operacao = "insert"; this.novas = Array.isArray(linhas) ? linhas : [linhas]; return this; }
    delete() { this.operacao = "delete"; return this; }

    private executar(): { data: unknown; error: null } {
      const tabela = (bd[this.tabela] ??= []);
      const r = registo.bd[this.tabela];
      if (this.operacao === "insert") {
        for (const n of this.novas) {
          const linha = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...structuredClone(n) };
          tabela.push(linha);
          if (r) { r.inserts++; r.inseridos.push(structuredClone(n)); }
        }
        atualizarLinhas();
        return { data: null, error: null };
      }
      const alvo = tabela.filter((l) => this.filtros.every((f) => f(l)));
      if (this.operacao === "delete") {
        bd[this.tabela] = tabela.filter((l) => !alvo.includes(l));
        if (r) { r.deletes = (r.deletes ?? 0) + alvo.length; r.urlsApagados?.push(...alvo.map((l) => String(l.url ?? ""))); }
        atualizarLinhas();
        return { data: null, error: null };
      }
      let linhas = [...alvo];
      if (this.ordem) {
        const { coluna, asc } = this.ordem;
        linhas.sort((a, b) => (String(a[coluna]) < String(b[coluna]) ? -1 : String(a[coluna]) > String(b[coluna]) ? 1 : 0) * (asc ? 1 : -1));
      }
      if (this.limite !== null) linhas = linhas.slice(0, this.limite);
      const cols = this.colunas.split(",").map((c) => c.trim()).filter(Boolean);
      const projetar = (l: Linha) => (cols.includes("*") ? structuredClone(l) : Object.fromEntries(cols.map((c) => [c, structuredClone(l[c])])));
      const dados = linhas.map(projetar);
      return { data: this.unica ? (dados[0] ?? null) : dados, error: null };
    }
    then<A = { data: unknown; error: null }, B = never>(ok?: ((v: { data: unknown; error: null }) => A | PromiseLike<A>) | null, falha?: ((e: unknown) => B | PromiseLike<B>) | null): PromiseLike<A | B> {
      return Promise.resolve().then(() => this.executar()).then(ok, falha);
    }
  }

  const clienteSupabase = {
    from: (tabela: string) => new Consulta(tabela),
    auth: {
      getUser: (jwt?: string) => {
        const id = jwt ? JWTS[jwt] : undefined;
        return Promise.resolve(id
          ? { data: { user: { id, aud: "authenticated", role: "authenticated", email: "operador@exemplo.invalid" } }, error: null }
          : { data: { user: null }, error: { message: "invalid JWT", status: 401 } });
      },
    },
  };

  return {
    fetch: fetchTeste as typeof fetch,
    supabase: () => clienteSupabase,
    /** Serve a função em 127.0.0.1 e expõe o registo de efeitos (só neste modo). */
    servir(tratar: (req: Request) => Promise<Response>) {
      Deno.serve({
        hostname: "127.0.0.1", port: porta,
        onListen: ({ hostname, port }) => console.log(`Listening on http://${hostname}:${port}/ (Oráculo em modo de teste — dados fixos)`),
      }, (req) => (new URL(req.url).searchParams.get("mode") === "teste-registo" ? Promise.resolve(Response.json(registo)) : tratar(req)));
    },
  };
}
