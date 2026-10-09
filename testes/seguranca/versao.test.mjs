// O versao.json que o site publica diz o commit e as somas do build — e mais nada.
//
// É o que o verificar-destino e o sistema-vigia comparam com o que o Pages serve. Formato fixo
// (decisão do Daniel, 2026-10-10): só `commit` e `somas`, de uma lista fechada, nunca do ambiente.
// Um campo a mais é recusado — um ficheiro público que aceitasse campos novos acabaria, um dia,
// a publicar o que não devia.
//
// Cada recusa tem o seu caso plantado, e cada verificação tem o caso que tem de falhar: um byte
// trocado num ficheiro servido, um commit diferente, um ficheiro que desapareceu.
//
//   node --test testes/seguranca/versao.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validar, calcularSomas, gerar, verificar } from '../../scripts/versao.mjs';
import { servirEstatico } from '../fumo/apoio.mjs';

const COMMIT = 'fbc6f3992d24b796d5a048ff273f7fcc4a7b6c09';
const SOMA = 'a'.repeat(64);
let dist;

before(async () => {
  dist = await mkdtemp(path.join(tmpdir(), 'sistema-versao-'));
  await mkdir(path.join(dist, 'assets'));
  await writeFile(path.join(dist, 'index.html'), '<!doctype html><title>Órbita</title>\n');
  await writeFile(path.join(dist, 'assets', 'main-x.js'), 'console.log(1)\n');
});
after(() => rm(dist, { recursive: true, force: true }));

test('validar aceita só commit e somas, no formato certo (controlos plantados)', () => {
  const bom = { commit: COMMIT, somas: { 'index.html': SOMA, 'assets/main-x.js': SOMA } };
  assert.equal(validar(bom), bom);
  const recusados = {
    'campo a mais': { ...bom, ambiente: 'x' },
    'sem somas': { commit: COMMIT },
    'sem commit': { somas: bom.somas },
    'commit curto': { ...bom, commit: COMMIT.slice(0, 7) },
    'commit em maiúsculas': { ...bom, commit: COMMIT.toUpperCase() },
    'somas vazias': { ...bom, somas: {} },
    'soma com 63': { ...bom, somas: { 'index.html': SOMA.slice(1) } },
    'caminho com ..': { ...bom, somas: { '../fora.txt': SOMA } },
    'caminho absoluto': { ...bom, somas: { '/index.html': SOMA } },
    'o próprio versao.json': { ...bom, somas: { 'versao.json': SOMA } },
    'somas numa lista': { ...bom, somas: [SOMA] },
    'não é objeto': [COMMIT],
  };
  for (const [nome, obj] of Object.entries(recusados)) {
    assert.throws(() => validar(obj), undefined, `devia recusar: ${nome}`);
  }
});

test('gerar escreve só commit e somas de todos os ficheiros do dist, e recusa um commit inválido', async () => {
  const obj = await gerar(dist, COMMIT);
  const escrito = JSON.parse(await readFile(path.join(dist, 'versao.json'), 'utf8'));
  assert.deepEqual(Object.keys(escrito), ['commit', 'somas']);
  assert.deepEqual(escrito, obj);
  assert.deepEqual(Object.keys(escrito.somas), ['assets/main-x.js', 'index.html']);
  assert.deepEqual(await calcularSomas(dist), escrito.somas, 'o versao.json não entra nas próprias somas');
  await assert.rejects(() => gerar(dist, 'HEAD'), undefined, 'um commit que não é SHA tem de ser recusado');
});

test('verificar dá certo contra o dist servido, e falha num byte trocado, noutro commit e num ficheiro em falta', async () => {
  await gerar(dist, COMMIT);
  const site = await servirEstatico(dist);
  try {
    const opcoes = { tentativas: 1, intervaloMs: 0 };
    const bom = await verificar(site.url, COMMIT, opcoes);
    assert.equal(bom.ok, true, JSON.stringify(bom.falhas));
    assert.equal(bom.ficheiros, 2);

    const outro = await verificar(site.url, 'b'.repeat(40), opcoes);
    assert.equal(outro.ok, false);
    assert.match(outro.falhas.join('\n'), /commit/);

    const original = await readFile(path.join(dist, 'index.html'));
    await writeFile(path.join(dist, 'index.html'), Buffer.concat([original.subarray(0, 5), Buffer.from('X'), original.subarray(6)]));
    const trocado = await verificar(site.url, COMMIT, opcoes);
    assert.equal(trocado.ok, false);
    assert.match(trocado.falhas.join('\n'), /index\.html/);
    await writeFile(path.join(dist, 'index.html'), original);

    await rm(path.join(dist, 'assets', 'main-x.js'));
    const falta = await verificar(site.url, COMMIT, opcoes);
    assert.equal(falta.ok, false);
    assert.match(falta.falhas.join('\n'), /assets\/main-x\.js/);
  } finally {
    site.fechar();
  }
});
