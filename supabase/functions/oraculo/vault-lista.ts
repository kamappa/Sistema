/* LISTA DE LEITURA DO VAULT e leitura honesta dos commits — Lote 2 (2026-09-23).
 *
 * O VAULT_TOKEN lê o repositório vault-sistema inteiro, e desde 17/09 o repositório
 * tem mais do que Sistema/Estudo (o .gitignore do vault deixa entrar todo o Sistema/,
 * incluindo Eu/Ficha-do-Jogador.md). É ESTA lista, e não o token, que decide o que o
 * Oráculo vê — escrita como decisão, não deduzida do que existe (SPEC v2, "Correções
 * ao código existente"):
 *
 *   CONTEÚDO (enumerado e lido): Sistema/Estudo/ (IPCA/, Temas/, Cursos/),
 *     Sistema/Horario/alteracoes.md e Sistema/_MAPA.md.
 *   SÓ FORMA (lido a pedido, nunca enumerado como conteúdo): Sistema/Modelos/.
 *   FORA: Sistema/Eu/ e Sistema/Alimentar/ (Missão 32; Eu/ só depois de o Daniel
 *     confirmar que tirou os montantes da Ficha), qualquer caminho com um segmento
 *     Oraculo/ (o que o Oráculo escreveu não é estudo do Daniel) e *.excalidraw.md.
 *
 * Commits não são estudo. Uma sincronização do Obsidian diz que ficheiros mudaram e
 * quando foram enviados — não quanto tempo ele estudou, nem quando, nem com que
 * frequência. Uma reorganização (mover, renomear, apagar) muda muitos ficheiros sem
 * estudo nenhum. O tempo de estudo medido é o das sessões (Missão 34).
 */

/** Os caminhos pedidos ao GitHub para medir a atividade — só os de conteúdo. */
export const CAMINHOS_DE_ATIVIDADE = ["Sistema/Estudo", "Sistema/Horario/alteracoes.md", "Sistema/_MAPA.md"] as const;
const PASTAS_CONTEUDO = ["Sistema/Estudo/"];
const FICHEIROS_CONTEUDO = ["Sistema/Horario/alteracoes.md", "Sistema/_MAPA.md"];
const PASTAS_SO_FORMA = ["Sistema/Modelos/"];

// Recusado sempre, esteja onde estiver: não-Markdown, quadros do Excalidraw, saídas do
// Oráculo e qualquer caminho torto (segmento vazio, "." ou "..").
function proibido(p: string): boolean {
  if (!p.endsWith(".md") || p.endsWith(".excalidraw.md")) return true;
  return p.split("/").some((s) => s === "" || s === "." || s === ".." || s.toLowerCase() === "oraculo");
}

export function eConteudo(p: string): boolean {
  if (proibido(p)) return false;
  return PASTAS_CONTEUDO.some((d) => p.startsWith(d)) || FICHEIROS_CONTEUDO.includes(p);
}

/** O que pode ser lido: conteúdo sempre; os modelos só quando se pede a forma. */
export function podeLer(p: string, opcoes: { forma?: boolean } = {}): boolean {
  if (eConteudo(p)) return true;
  return !!opcoes.forma && !proibido(p) && PASTAS_SO_FORMA.some((d) => p.startsWith(d));
}

export interface Alteracao { filename: string; status: string; changes?: number; previous_filename?: string }
export interface Classificacao { conteudo: string[]; organizacao: number }

/** Separa texto novo ou alterado (conteúdo) de mover, renomear e apagar (organização). */
export function classificar(files: Alteracao[]): Classificacao {
  const conteudo = new Set<string>();
  let organizacao = 0;
  for (const f of files) {
    if (f.status === "unchanged") continue;
    const dentro = eConteudo(f.filename);
    const vinhaDeDentro = !!f.previous_filename && eConteudo(f.previous_filename);
    if (!dentro && !vinhaDeDentro) continue; // nunca visto nem contado
    const comTexto = (f.changes ?? 1) > 0;
    if (f.status === "removed") organizacao++;
    else if (dentro && comTexto) conteudo.add(f.filename);
    else organizacao++; // movida ou renomeada sem texto novo, criada vazia, ou saiu da lista
  }
  return { conteudo: [...conteudo].sort(), organizacao };
}

/** A cadeira, o tema ou o curso a que um caminho pertence. */
export function grupoDe(p: string): string {
  const r = p.replace(/^Sistema\//, "");
  if (r === "Horario/alteracoes.md") return "Horário";
  if (r === "_MAPA.md") return "Mapa do vault";
  const s = r.split("/");
  if (s[0] !== "Estudo") return "Outros";
  if (s[1] === "IPCA" && s[2] === "_Arquivo" && s.length > 5) return `IPCA/${s[4]} (arquivada, ${s[3]})`;
  if (["IPCA", "Temas", "Cursos"].includes(s[1]) && s[2] !== "_Arquivo" && s.length > 3) return `${s[1]}/${s[2]}`;
  return "Estudo (geral)";
}

// O resto do caminho dentro do grupo (para listar nomes curtos).
function dentroDoGrupo(p: string): string {
  const s = p.replace(/^Sistema\//, "").split("/");
  if (s[0] !== "Estudo") return s[s.length - 1];
  if (s[1] === "IPCA" && s[2] === "_Arquivo" && s.length > 5) return s.slice(5).join("/");
  if (["IPCA", "Temas", "Cursos"].includes(s[1]) && s.length > 3) return s.slice(3).join("/");
  return s.slice(1).join("/");
}

export function porGrupo(caminhos: string[]): Array<[string, string[]]> {
  const m = new Map<string, string[]>();
  for (const p of caminhos) { const g = grupoDe(p); if (!m.has(g)) m.set(g, []); m.get(g)!.push(dentroDoGrupo(p)); }
  return [...m.entries()].map(([g, l]): [string, string[]] => [g, l.sort()]).sort(([a], [b]) => a.localeCompare(b, "pt"));
}

export const AVISO_COMMITS =
  "Isto são sincronizações do Obsidian (commits): dizem que notas mudaram e quando foram enviadas — " +
  "NÃO dizem quanto tempo ele estudou, nem quando, nem com que frequência. Não deduzas horas, dias nem " +
  "frequência de estudo daqui. Uma reorganização muda muitos ficheiros sem estudo nenhum.";

export interface Atividade extends Classificacao { sincronizacoes: string[]; truncado: boolean; comparacaoTruncada: boolean }

/** O resumo que o modelo recebe: o que mudou, por cadeira — nunca tempo de estudo. */
export function resumoDaAtividade(a: Atividade, dias: number): string {
  const L = [`ALTERAÇÕES NO VAULT (${dias === 1 ? "últimas 24 horas" : `últimos ${dias} dias`})`, AVISO_COMMITS];
  const datas = a.sincronizacoes.map((d) => d.slice(0, 10)).filter(Boolean).sort();
  L.push(datas.length
    ? `Sincronizações: ${a.sincronizacoes.length}, de ${datas[0]} a ${datas[datas.length - 1]}.`
    : "Sincronizações: nenhuma.");
  if (a.conteudo.length) {
    L.push("Notas com texto novo ou alterado, por cadeira ou tema:");
    for (const [g, l] of porGrupo(a.conteudo)) L.push(`- ${g}: ${l.length} — ${l.slice(0, 5).join(", ")}${l.length > 5 ? ` e mais ${l.length - 5}` : ""}`);
  } else L.push("Notas com texto novo ou alterado: nenhuma.");
  if (a.organizacao) L.push(`Reorganização (movidas ou renomeadas sem mudança de texto, ou apagadas): ${a.organizacao} ficheiros — não é estudo.`);
  if (a.truncado) L.push("AVISO: a lista de sincronizações foi cortada — há mais do que as contadas.");
  if (a.comparacaoTruncada) L.push("AVISO: a comparação do GitHub só mostra 300 ficheiros — houve mais alterações do que as listadas.");
  return L.join("\n");
}
