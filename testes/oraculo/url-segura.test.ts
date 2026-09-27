// O Oráculo só guarda URLs http(s) — etapa 1 da publicação da Órbita (2026-09-27).
//
//   DENO_NO_PACKAGE_JSON=1 deno test --no-prompt testes/oraculo/url-segura.test.ts
//
// Sem permissões nenhumas: a lógica é pura. É o mesmo contrato do filtro do frontend: o
// endereço normalizado se for http(s) absoluto, null em tudo o resto — incluindo
// `javascript:` disfarçado (maiúsculas, espaços, tabulação, caracteres de controlo à
// frente), `data:`, `vbscript:`, relativos e o que nem é texto. Os valores esperados
// estão escritos à mão; nenhum é calculado pela função testada.
import { deepStrictEqual, strictEqual } from "node:assert";
import { recursosSeguros, urlSegura } from "../../supabase/functions/oraculo/url-segura.ts";

const ACEITES: Array<[string, string]> = [
  ["https://exemplo.invalid/a?b=1#c", "https://exemplo.invalid/a?b=1#c"],
  ["http://exemplo.invalid", "http://exemplo.invalid/"],
  ["  https://exemplo.invalid/x  ", "https://exemplo.invalid/x"],
  ["HTTPS://EXEMPLO.INVALID/Caminho", "https://exemplo.invalid/Caminho"],
];

const RECUSADOS = [
  "javascript:alert(1)",
  "JAVASCRIPT:alert(1)",
  " javascript:alert(1)",
  "java\tscript:alert(1)",
  "java\nscript:alert(1)",
  "\u0000javascript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
  "file:///C:/Windows/win.ini",
  "ftp://exemplo.invalid/f",
  "mailto:alguem@exemplo.invalid",
  "//exemplo.invalid/x",
  "/relativo",
  "relativo",
  "www.exemplo.invalid/sem-esquema",
  "",
  "https://",
];

Deno.test("urlSegura: aceita http(s) absoluto e devolve-o normalizado (controlo positivo)", () => {
  for (const [entrada, esperado] of ACEITES) strictEqual(urlSegura(entrada), esperado, JSON.stringify(entrada));
});

Deno.test("urlSegura: recusa tudo o que não é http(s) absoluto", () => {
  for (const entrada of RECUSADOS) strictEqual(urlSegura(entrada), null, JSON.stringify(entrada));
});

Deno.test("urlSegura: recusa o que não é texto", () => {
  for (const entrada of [null, undefined, 42, {}, ["https://exemplo.invalid/"]]) {
    strictEqual(urlSegura(entrada), null, Object.prototype.toString.call(entrada));
  }
});

Deno.test("recursosSeguros: fica o recurso com link seguro, normalizado; saem os outros, contados", () => {
  deepStrictEqual(
    recursosSeguros([
      { titulo: "Válido", url: " HTTPS://EXEMPLO.INVALID/Recurso ", fonte: "ENISA", porque: "p" },
      { titulo: "Hostil", url: "javascript:alert(1)", fonte: "artigo", porque: "p" },
      { titulo: "Sem url" },
      null,
      "texto solto",
    ]),
    { recursos: [{ titulo: "Válido", url: "https://exemplo.invalid/Recurso", fonte: "ENISA", porque: "p" }], recusados: 4 },
  );
});

Deno.test("recursosSeguros: o que não é lista não inventa recursos", () => {
  deepStrictEqual(recursosSeguros(undefined), { recursos: [], recusados: 0 });
  deepStrictEqual(recursosSeguros("texto"), { recursos: [], recusados: 0 });
});
