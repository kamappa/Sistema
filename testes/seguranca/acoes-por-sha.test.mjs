// As ações dos workflows estão fixadas por SHA — nenhuma etiqueta móvel decide o código que corre.
//
// Uma etiqueta como `@v5` é um ponteiro que quem mantém a ação pode mover; o job de deploy
// publica o site com `pages: write` e `id-token: write`, e o código que corre com essas
// permissões tem de ser o que foi lido, não o que a etiqueta apontar amanhã. Só um SHA de 40
// caracteres é imutável.
//
// O reconhecedor tem os seus controlos plantados (uma etiqueta, um ramo, um SHA curto, um SHA
// com uma letra a mais), e a leitura dos workflows tem de encontrar pelo menos uma ação — uma
// leitura que não encontra nada dava verde sem verificar nada.
//
//   node --test testes/seguranca/acoes-por-sha.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASTA = path.join(RAIZ, '.github', 'workflows');

// Devolve a referência de uma linha `uses:` (sem o comentário), ou null se a linha não for uma.
function referencia(linha) {
  const m = linha.match(/^\s*(?:-\s+)?uses:\s*(['"]?)([^'"\s#]+)\1\s*(?:#.*)?$/);
  return m ? m[2] : null;
}
const porSha = (ref) => /^[^@\s]+@[0-9a-f]{40}$/.test(ref);

test('o reconhecedor separa SHA de etiqueta (controlos plantados)', () => {
  const sha = 'fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09';
  const casos = [
    [`      - uses: actions/checkout@${sha}  # v5.1.0`, true],
    [`        uses: 'actions/setup-node@${sha}'`, true],
    ['      - uses: actions/checkout@v5', false],
    ['        uses: actions/checkout@main', false],
    [`        uses: actions/checkout@${sha.slice(0, 7)}`, false],
    [`        uses: actions/checkout@${sha}0`, false],
    [`        uses: actions/checkout@${sha.toUpperCase()}`, false],
    ['        uses: actions/checkout', false],
  ];
  for (const [linha, esperado] of casos) {
    const ref = referencia(linha);
    assert.ok(ref, `não reconheceu a linha como uses: ${linha}`);
    assert.equal(porSha(ref), esperado, linha);
  }
  assert.equal(referencia('        run: echo uses: actions/checkout@v5'), null, 'um run não é um uses');
});

test('todas as ações dos workflows estão fixadas por SHA', () => {
  const ficheiros = readdirSync(PASTA).filter((f) => /\.ya?ml$/.test(f));
  assert.ok(ficheiros.length > 0, 'nenhum workflow encontrado');
  const refs = [];
  for (const f of ficheiros) {
    readFileSync(path.join(PASTA, f), 'utf8').split(/\r?\n/).forEach((linha, i) => {
      const ref = referencia(linha);
      if (ref) refs.push({ onde: `${f}:${i + 1}`, ref });
    });
  }
  assert.ok(refs.length > 0, 'nenhuma linha uses: encontrada — a leitura não está a ler');
  const soltas = refs.filter((r) => !porSha(r.ref)).map((r) => `${r.onde} ${r.ref}`);
  assert.deepEqual(soltas, [], `ações sem SHA:\n${soltas.join('\n')}`);
});
