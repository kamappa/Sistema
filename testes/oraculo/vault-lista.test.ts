// Testes da lista de leitura do vault e da leitura honesta dos commits (Lote 2).
//
//   deno test --no-prompt testes/oraculo/vault-lista.test.ts
//
// Sem permissões nenhumas: a lógica é pura. Valores esperados literais.
import { deepStrictEqual, ok, strictEqual } from "node:assert";
import {
  AVISO_COMMITS, CAMINHOS_DE_ATIVIDADE, classificar, eConteudo, grupoDe, podeLer, porGrupo, resumoDaAtividade,
} from "../../supabase/functions/oraculo/vault-lista.ts";

Deno.test("lista: o que é conteúdo", () => {
  ok(eConteudo("Sistema/Estudo/IPCA/Base-de-Dados/Aulas/2026-09-22.md"));
  ok(eConteudo("Sistema/Estudo/Temas/RGPD/Consentimento.md"));
  ok(eConteudo("Sistema/Estudo/Cursos/Curso-X/Notas/a.md"));
  ok(eConteudo("Sistema/Estudo/IPCA/_Arquivo/2025-26-S2/Etica/_index.md"));
  ok(eConteudo("Sistema/Horario/alteracoes.md"));
  ok(eConteudo("Sistema/_MAPA.md"));
});

Deno.test("lista: o que fica fora — e fica fora mesmo pedindo a forma", () => {
  for (const p of [
    "Sistema/Eu/Ficha-do-Jogador.md", "Sistema/Alimentar/Plano.md", "Sistema/Horario/horario.md",
    "Sistema/Estudo/IPCA/X/Oraculo/resumo.md", "Oraculo/relatorio-2026-09-20.md", "Sistema/Estudo/Temas/T/oraculo/x.md",
    "Sistema/Estudo/Temas/T/Quadro.excalidraw.md", "Sistema/Estudo/Temas/T/imagem.png",
    "Sistema/Estudo/../Eu/Ficha-do-Jogador.md", "Sistema/Estudo//x.md", "README.md", "Sistema/Modelos/aula.md",
  ]) {
    strictEqual(eConteudo(p), false, p);
    if (!p.startsWith("Sistema/Modelos/")) strictEqual(podeLer(p, { forma: true }), false, p);
  }
});

Deno.test("lista: os modelos leem-se só a pedido da forma, nunca como conteúdo", () => {
  strictEqual(podeLer("Sistema/Modelos/aula.md"), false);
  strictEqual(podeLer("Sistema/Modelos/aula.md", { forma: true }), true);
  strictEqual(podeLer("Sistema/Estudo/Temas/T/n.md"), true);
});

Deno.test("lista: a atividade só se pede para caminhos de conteúdo", () => {
  deepStrictEqual([...CAMINHOS_DE_ATIVIDADE], ["Sistema/Estudo", "Sistema/Horario/alteracoes.md", "Sistema/_MAPA.md"]);
});

Deno.test("classificar: texto novo ou alterado é conteúdo; mover e apagar é organização", () => {
  const c = classificar([
    { filename: "Sistema/Estudo/Temas/T/Nota.md", status: "modified", changes: 4 },
    { filename: "Sistema/Estudo/IPCA/A/Aulas/2026-09-22.md", status: "added", changes: 30 },
    { filename: "Sistema/Estudo/IPCA/_Arquivo/2025-26-S2/B/n.md", previous_filename: "Sistema/Estudo/IPCA/B/n.md", status: "renamed", changes: 0 },
    { filename: "Sistema/Estudo/IPCA/C/novo-nome.md", previous_filename: "Sistema/Estudo/IPCA/C/velho.md", status: "renamed", changes: 3 },
    { filename: "Sistema/Estudo/Temas/Velho/v.md", status: "removed", changes: 12 },
    { filename: "Sistema/Estudo/Temas/T/vazio.md", status: "added", changes: 0 },
    { filename: "Sistema/Eu/Ficha-do-Jogador.md", previous_filename: "Sistema/Estudo/Temas/T/ficha.md", status: "renamed", changes: 0 },
    { filename: "Sistema/Eu/Ficha-do-Jogador.md", status: "modified", changes: 9 },
    { filename: "Sistema/Estudo/IPCA/A/Oraculo/resumo.md", status: "added", changes: 5 },
    { filename: "Sistema/Modelos/aula.md", status: "modified", changes: 2 },
    { filename: "Sistema/Horario/alteracoes.md", status: "modified", changes: 1 },
    { filename: "Sistema/Estudo/Temas/T/Nota.md", status: "unchanged", changes: 0 },
  ]);
  deepStrictEqual(c.conteudo, [
    "Sistema/Estudo/IPCA/A/Aulas/2026-09-22.md", "Sistema/Estudo/IPCA/C/novo-nome.md",
    "Sistema/Estudo/Temas/T/Nota.md", "Sistema/Horario/alteracoes.md",
  ]);
  // movida sem texto novo, apagada, criada vazia, e a que saiu da lista para Eu/ (só contada)
  strictEqual(c.organizacao, 4);
});

Deno.test("grupos: por cadeira, tema ou curso — as arquivadas dizem-no", () => {
  strictEqual(grupoDe("Sistema/Estudo/IPCA/Base-de-Dados/Aulas/x.md"), "IPCA/Base-de-Dados");
  strictEqual(grupoDe("Sistema/Estudo/IPCA/_Arquivo/2025-26-S2/Etica/Notas/x.md"), "IPCA/Etica (arquivada, 2025-26-S2)");
  strictEqual(grupoDe("Sistema/Estudo/Temas/RGPD/x.md"), "Temas/RGPD");
  strictEqual(grupoDe("Sistema/Estudo/Cursos/Curso-X/x.md"), "Cursos/Curso-X");
  strictEqual(grupoDe("Sistema/Estudo/README.md"), "Estudo (geral)");
  strictEqual(grupoDe("Sistema/Horario/alteracoes.md"), "Horário");
  strictEqual(grupoDe("Sistema/_MAPA.md"), "Mapa do vault");
  deepStrictEqual(porGrupo(["Sistema/Estudo/Temas/T/b.md", "Sistema/Horario/alteracoes.md", "Sistema/Estudo/Temas/T/a.md"]),
    [["Horário", ["alteracoes.md"]], ["Temas/T", ["a.md", "b.md"]]]);
});

Deno.test("resumo: nunca apresenta commits como estudo", () => {
  const txt = resumoDaAtividade({
    sincronizacoes: ["2026-09-23T10:00:00Z", "2026-09-20T09:00:00Z"], truncado: false, comparacaoTruncada: false,
    conteudo: ["Sistema/Estudo/Temas/T/Nota.md", "Sistema/Horario/alteracoes.md"], organizacao: 108,
  }, 7);
  strictEqual(txt, [
    "ALTERAÇÕES NO VAULT (últimos 7 dias)",
    AVISO_COMMITS,
    "Sincronizações: 2, de 2026-09-20 a 2026-09-23.",
    "Notas com texto novo ou alterado, por cadeira ou tema:",
    "- Horário: 1 — alteracoes.md",
    "- Temas/T: 1 — Nota.md",
    "Reorganização (movidas ou renomeadas sem mudança de texto, ou apagadas): 108 ficheiros — não é estudo.",
  ].join("\n"));
  ok(AVISO_COMMITS.includes("NÃO dizem quanto tempo ele estudou"));
  ok(!/registo real|frequência real|quando estudou:/i.test(txt));
});

Deno.test("resumo: só reorganização, e as truncagens declaradas", () => {
  const txt = resumoDaAtividade({ sincronizacoes: ["2026-09-21T10:00:00Z"], truncado: true, comparacaoTruncada: true, conteudo: [], organizacao: 3 }, 1);
  ok(txt.startsWith("ALTERAÇÕES NO VAULT (últimas 24 horas)"));
  ok(txt.includes("Notas com texto novo ou alterado: nenhuma."));
  ok(txt.includes("3 ficheiros — não é estudo."));
  ok(txt.includes("AVISO: a lista de sincronizações foi cortada"));
  ok(txt.includes("AVISO: a comparação do GitHub só mostra 300 ficheiros"));
});
