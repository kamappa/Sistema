/* A NOTA DO VAULT — o texto do modelo entra como texto (2026-09-27).
 *
 * O relatório semanal é escrito no vault como nota NOVA em Oraculo/. No PC do Daniel, o
 * Obsidian Git trá-la, e o Templater — com o gatilho de criação de ficheiros ligado —
 * corre os comandos <% … %> de qualquer nota nova, sem ela ser aberta e sem clique. O
 * Obsidian também segue links, carrega imagens remotas, embebe outras notas e, com os
 * plugins certos, corre blocos de código. O texto é do modelo, que lê a web: uma página
 * hostil pode tentar pôr lá qualquer uma destas coisas. É a mesma classe dos outros
 * achados — um caminho de dados tratado como código —, aqui com execução sem interação.
 *
 * Por isso, decisão do Daniel: todo o texto que o modelo escreve entra na nota como texto.
 * Os caracteres que formam comandos do Templater, HTML e autolinks (< >), links, imagens,
 * embeds e callouts ([ ]), blocos e código inline (` ~), fórmulas ($), escapes (\), campos
 * do Dataview (::) e esquemas soltos (://) passam a entidades: o Obsidian mostra-os iguais,
 * e nada se forma. O & vai primeiro, para uma entidade já escrita pelo modelo ficar texto.
 * Os únicos links da nota são os recursos que o servidor validou (url-segura.ts), com o
 * endereço codificado para não conseguir sair do link. Só a nota muda: a base guarda o
 * relatório como veio, e os frontends mostram-no como texto.
 */
import { urlSegura } from "./url-segura.ts";

const ENTIDADES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "[": "&#91;", "]": "&#93;",
  "`": "&#96;", "~": "&#126;", "$": "&#36;", "\\": "&#92;",
  "::": ":&#58;", "://": "&#58;//",
};
const ATIVO = /::|:\/\/|[&<>[\]`~$\\]/g;

/** O texto do modelo, tal e qual à vista, sem nada que o Obsidian ou os plugins executem. */
export function textoMd(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).replace(ATIVO, (c) => ENTIDADES[c]);
}

/** O destino de um link já validado (http(s), normalizado): o parser de URL deixa ( ) [ ]
 *  no caminho e ` na pesquisa, e sem isto um recurso válido fechava o link e abria outro. */
export function destinoMd(url: string): string {
  return url.replace(/[()[\]<>`\\"' $]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"));
}

export function reportMd(rep: Record<string, any>, d: string): string {
  const L: string[] = ["---", "tipo: relatorio-oraculo", "data: " + d, "---", "", "# Relatório do Oráculo — " + d, ""];
  const sec = (t: string, v: unknown) => { if (v && v !== "null") L.push("## " + t, "", textoMd(v), ""); };
  sec("Resumo", rep.resumo);
  sec("Estudo", rep.estudo);
  sec("Treino", rep.treino);
  sec("Sono", rep.sono);
  sec("Alerta", rep.alerta);
  if (Array.isArray(rep.missoes_propostas) && rep.missoes_propostas.length) {
    L.push("## Missões propostas", "");
    for (const m of rep.missoes_propostas) L.push("- **" + textoMd(m.t) + "** — " + textoMd(m.why));
    L.push("");
  }
  if (Array.isArray(rep.recursos) && rep.recursos.length) {
    L.push("## Para complementar o estudo", "");
    for (const r of rep.recursos) {
      // Os recursos já chegam filtrados (recursosSeguros); o filtro repete-se aqui para a
      // nota nunca levar um link que não seja http(s), venha o relatório de onde vier.
      const url = urlSegura(r.url);
      const titulo = textoMd(r.titulo ?? url ?? "");
      L.push("- " + (url ? "[" + titulo + "](" + destinoMd(url) + ")" : titulo) + " · " + textoMd(r.fonte) + " — " + textoMd(r.porque));
    }
    L.push("");
  }
  sec("Efeméride", rep.efemeride);
  sec("Profecia", rep.profecia);
  sec("Recompensa", rep.recompensa);
  sec("Título da semana", rep.titulo);
  sec("Legado", rep.legado);
  return L.join("\n");
}
