// A nota do vault não deixa o texto do modelo virar código — decisão do Daniel (2026-09-27).
//
//   DENO_NO_PACKAGE_JSON=1 deno test --no-prompt testes/oraculo/nota-vault.test.ts
//
// O relatório semanal é escrito no vault como nota NOVA em Oraculo/. No PC do Daniel, o
// Obsidian Git trá-la, e o Templater — com o gatilho de criação de ficheiros ligado — corre
// os comandos <% … %> de qualquer nota nova, sem ela ser aberta e sem clique. O texto é do
// modelo, que lê a web: uma página hostil pode tentar pô-lo lá. Por isso o texto do modelo
// entra na nota como texto: nada do que escreve forma comandos do Templater, HTML, links,
// imagens, embeds, blocos de código, fórmulas ou campos do Dataview. Os únicos links da nota
// são os recursos que o servidor validou (url-segura.ts), e o endereço não consegue sair do
// link. Sem permissões nenhumas: a lógica é pura. Os valores esperados estão escritos à mão;
// nenhum é calculado pela função testada.
import { ok, strictEqual } from "node:assert";
import { destinoMd, reportMd, textoMd } from "../../supabase/functions/oraculo/nota-vault.ts";

Deno.test("textoMd: o texto normal passa igual (controlo positivo)", () => {
  const normal = "Semana boa: estudaste RGPD (art. 32.º) e NIS2 — 3 notas novas, 100% das metas; *foco* e **ritmo**.\n"
    + "Segunda linha, com acentos: ação, coração, pôr. Pergunta: e agora? «Sim!» #tag";
  strictEqual(textoMd(normal), normal);
});

const HOSTIS: Array<[string, string]> = [
  // Templater: corre ao criar a nota, sem a abrir.
  ['<%* tp.file.create_new("marca") %>', '&lt;%* tp.file.create_new("marca") %&gt;'],
  ["<%+ tp.file.content %>", "&lt;%+ tp.file.content %&gt;"],
  // HTML e autolinks.
  ["<img src=x onerror=alert(1)>", "&lt;img src=x onerror=alert(1)&gt;"],
  ["<javascript:alert(1)>", "&lt;javascript:alert(1)&gt;"],
  // Links, imagens remotas, embeds e callouts.
  ["[clica](javascript:alert(1))", "&#91;clica&#93;(javascript:alert(1))"],
  ["![](https://exemplo.invalid/pixel.png)", "!&#91;&#93;(https&#58;//exemplo.invalid/pixel.png)"],
  ["![[Eu/Ficha-do-Jogador]]", "!&#91;&#91;Eu/Ficha-do-Jogador&#93;&#93;"],
  ["[x]: javascript:alert(1)", "&#91;x&#93;: javascript:alert(1)"],
  ["> [!note] chamada", "&gt; &#91;!note&#93; chamada"],
  // Blocos de código e JavaScript inline (Dataview e outros plugins).
  ["```dataviewjs\ndv.el('p', 1)\n```", "&#96;&#96;&#96;dataviewjs\ndv.el('p', 1)\n&#96;&#96;&#96;"],
  ["`$= dv.el('p', 1)`", "&#96;&#36;= dv.el('p', 1)&#96;"],
  ["~~~js\nx\n~~~", "&#126;&#126;&#126;js\nx\n&#126;&#126;&#126;"],
  // Fórmulas, campos do Dataview e esquemas de URL soltos.
  ["$\\href{javascript:alert(1)}{x}$", "&#36;&#92;href{javascript:alert(1)}{x}&#36;"],
  ["estudado:: 40h", "estudado:&#58; 40h"],
  ["obsidian://open?vault=Sintetico", "obsidian&#58;//open?vault=Sintetico"],
  // Disfarces: entidades já escritas e escapes de markdown.
  ["&lt;%* já codificado %&gt;", "&amp;lt;%* já codificado %&amp;gt;"],
  ["\\[x\\](javascript:alert(1))", "&#92;&#91;x&#92;&#93;(javascript:alert(1))"],
];

Deno.test("textoMd: nada do que o modelo escreve forma sintaxe ativa, e o texto fica todo", () => {
  for (const [entrada, esperado] of HOSTIS) strictEqual(textoMd(entrada), esperado, JSON.stringify(entrada));
});

Deno.test("textoMd: o que não é texto", () => {
  strictEqual(textoMd(null), "");
  strictEqual(textoMd(undefined), "");
  strictEqual(textoMd(42), "42");
});

Deno.test("destinoMd: um endereço normal fica igual (controlo positivo)", () => {
  strictEqual(destinoMd("https://exemplo.invalid/recurso?a=1&b=2#c"), "https://exemplo.invalid/recurso?a=1&b=2#c");
});

Deno.test("destinoMd: um endereço válido não consegue sair do link", () => {
  // O parser de URL deixa ( ) [ ] no caminho e ` na pesquisa: sem isto, um recurso
  // https válido fechava o link e abria outro a seguir.
  strictEqual(
    destinoMd("https://exemplo.invalid/a)[x](javascript:alert(1))"),
    "https://exemplo.invalid/a%29%5Bx%5D%28javascript:alert%281%29%29",
  );
  strictEqual(destinoMd("https://exemplo.invalid/?q=`$x`"), "https://exemplo.invalid/?q=%60%24x%60");
});

Deno.test("reportMd: um relatório hostil inteiro dá uma nota com um só link — o recurso validado", () => {
  const rep = {
    resumo: '<%* tp.file.create_new("marca") %>',
    estudo: "```dataviewjs\ndv.el('p', 1)\n```",
    alerta: "![](https://exemplo.invalid/pixel.png) e [clica](javascript:alert(1))",
    efemeride: "![[Eu/Ficha-do-Jogador]] e estudado:: 40h",
    missoes_propostas: [{ t: "Missão <%* x %>", why: "porque [sim](javascript:alert(1))" }],
    recursos: [
      { titulo: "Recurso válido", url: "https://exemplo.invalid/recurso", fonte: "ENISA", porque: "complementa" },
      { titulo: "Título ]( <img src=x onerror=alert(1)>", url: "https://exemplo.invalid/a)[x](javascript:alert(1))", fonte: "`x`", porque: "~~~" },
      { titulo: "Sem link seguro", url: "javascript:alert(1)", fonte: "artigo", porque: "p" },
    ],
  };
  const nota = reportMd(rep, "2026-09-27");
  // Controlos positivos: a forma da nota e o recurso validado, como link.
  ok(nota.startsWith("---\ntipo: relatorio-oraculo\ndata: 2026-09-27\n---\n\n# Relatório do Oráculo — 2026-09-27\n"), nota.slice(0, 120));
  ok(nota.includes("## Resumo\n\n&lt;%* tp.file.create_new(\"marca\") %&gt;\n"));
  ok(nota.includes("- **Missão &lt;%* x %&gt;** — porque &#91;sim&#93;(javascript:alert(1))"));
  ok(nota.includes("- [Recurso válido](https://exemplo.invalid/recurso) · ENISA — complementa"));
  ok(nota.includes("- [Título &#93;( &lt;img src=x onerror=alert(1)&gt;](https://exemplo.invalid/a%29%5Bx%5D%28javascript:alert%281%29%29) · &#96;x&#96; — &#126;&#126;&#126;"));
  // O recurso sem link seguro fica como texto, sem link.
  ok(nota.includes("- Sem link seguro · artigo — p"));
  // Nada ativo: só os dois links que o servidor escreveu, e nenhum comando, HTML ou código.
  strictEqual((nota.match(/\[/g) || []).length, 2, "só os [ dos dois recursos validados");
  strictEqual((nota.match(/\]\(/g) || []).length, 2, "só os ]( dos dois recursos validados");
  ok(!nota.includes("<"), "nenhum < (Templater, HTML, autolinks)");
  ok(!/[`~$\\]/.test(nota), "nenhum bloco de código, fórmula ou escape");
  ok(!nota.includes("::"), "nenhum campo do Dataview");
});
