// escaparHtml: transforma texto em texto seguro para interpolar em innerHTML.
//
// O céu (src/stage/constellation.js) escreve cartões e rótulos com innerHTML, e mete lá
// dois valores que vêm do estado guardado (app_state), não de constantes do código: o
// caminho escolhido (S.constellation.choices[domínio]) e a data de nascimento de uma
// estrela. Se o estado for adulterado, esse texto corria como HTML. É o mesmo defeito do
// filtro de links — dados guardados tratados como código. Esta função escapa os cinco
// caracteres que abrem HTML; o mesmo conjunto que o escHTML do Vanilla (js/engine.js).
//
//   node --test testes/seguranca/escapar-html.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escaparHtml } from '../../src/lib/escaparHtml.ts';

const CASOS = [
  ['Auditoria', 'Auditoria'],
  ['<img src=x onerror="alert(1)">', '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'],
  ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'],
  ['a & b', 'a &amp; b'],
  ["o'reilly", 'o&#39;reilly'],
  ['aspas "duplas"', 'aspas &quot;duplas&quot;'],
  ['sem nada especial', 'sem nada especial'],
];

for (const [entrada, esperado] of CASOS) {
  test(`escapa ${JSON.stringify(entrada)}`, () => {
    assert.equal(escaparHtml(entrada), esperado);
  });
}

test('o & escapa-se primeiro, para não duplicar entidades', () => {
  assert.equal(escaparHtml('&lt;'), '&amp;lt;');
});

test('o que não é texto vira texto (nunca "undefined" nem "null")', () => {
  assert.equal(escaparHtml(null), '');
  assert.equal(escaparHtml(undefined), '');
  assert.equal(escaparHtml(42), '42');
});
