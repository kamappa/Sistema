// urlSegura: o único caminho por onde um endereço vindo de dados passa a link.
//
// Devolve o endereço normalizado se for http(s) absoluto, e null em tudo o resto —
// incluindo `javascript:` disfarçado (maiúsculas, espaços, tabulação, caracteres de
// controlo à frente), `data:`, `vbscript:`, relativos e o que nem é texto. Os
// valores esperados estão escritos à mão; nenhum é calculado pela função testada.
//
//   node --test testes/seguranca/url-segura.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { urlSegura } from '../../src/lib/urlSegura.ts';

const ACEITES = [
  ['https://exemplo.invalid/a?b=1#c', 'https://exemplo.invalid/a?b=1#c'],
  ['http://exemplo.invalid', 'http://exemplo.invalid/'],
  ['  https://exemplo.invalid/x  ', 'https://exemplo.invalid/x'],
  ['HTTPS://EXEMPLO.INVALID/Caminho', 'https://exemplo.invalid/Caminho'],
];

const RECUSADOS = [
  'javascript:alert(1)',
  'JAVASCRIPT:alert(1)',
  ' javascript:alert(1)',
  'java\tscript:alert(1)',
  'java\nscript:alert(1)',
  '\u0000javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
  'file:///C:/Windows/win.ini',
  'ftp://exemplo.invalid/f',
  'mailto:alguem@exemplo.invalid',
  '//exemplo.invalid/x',
  '/relativo',
  'relativo',
  '',
  'https://',
];

for (const [entrada, esperado] of ACEITES) {
  test(`aceita ${JSON.stringify(entrada)} como ${esperado}`, () => {
    assert.equal(urlSegura(entrada), esperado);
  });
}

for (const entrada of RECUSADOS) {
  test(`recusa ${JSON.stringify(entrada)}`, () => {
    assert.equal(urlSegura(entrada), null);
  });
}

for (const entrada of [null, undefined, 42, {}, ['https://exemplo.invalid/']]) {
  test(`recusa o que não é texto: ${Object.prototype.toString.call(entrada)}`, () => {
    assert.equal(urlSegura(entrada), null);
  });
}
