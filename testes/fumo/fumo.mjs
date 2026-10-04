// Teste de fumo do Sistema — Lote 0 (2026-09-23); no ramo da Órbita desde 2026-09-27.
//
//   node testes/fumo/fumo.mjs                        # o Oráculo, localmente
//   node testes/fumo/fumo.mjs --so-oraculo           # o mesmo (aceite por compatibilidade)
//   node testes/fumo/fumo.mjs --gravar-linha-de-base # grava o resultado como nova linha de base
//
// NA ÓRBITA, SÓ O ORÁCULO. A parte do frontend deste teste verificava o Vanilla — os
// ecrãs do HUD, o Mapa da Estação, o painel das sessões — servido a partir da raiz do
// repositório. Neste ramo a raiz é o index.html do Vite, que só funciona depois do
// build: o teste abriria outra aplicação e diria que verificou o frontend. Um teste que
// diz verificar o frontend e verifica outro é pior do que não ter teste (decisão do
// Daniel, 2026-09-27). A parte do Vanilla ficou no `main` (testes/fumo/frontend.mjs); o
// fumo da Órbita, com o build de produção e 390×844, é o testes/fumo/orbita.mjs (2026-10-04).
//
// Código de saída 0 = tudo verde; 1 = alguma verificação falhou.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const FICHEIRO_BASE = path.join(aqui, 'linha-de-base.json');
const args = new Set(process.argv.slice(2));
const gravar = args.has('--gravar-linha-de-base');

if (args.has('--so-frontend')) {
  console.log('✗ o fumo do frontend da Órbita é outro ficheiro: node testes/fumo/orbita.mjs (depois do build).');
  console.log('  O de testes/fumo/frontend.mjs verificava o Vanilla e ficou no main.');
  process.exit(1);
}

const base = fs.existsSync(FICHEIRO_BASE) ? JSON.parse(fs.readFileSync(FICHEIRO_BASE, 'utf8')) : null;
const falhas = [];
const falha = (msg) => falhas.push(msg);

const carimbo = () => ({ gerada: new Date().toISOString().slice(0, 10), base: execFileSync('git', ['-C', raiz, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim() });
const resultado = {};

// O Deno 2 descobre o package.json da raiz — que na Órbita existe, com o node_modules do
// Vite — e passa a resolver os pacotes npm por lá. O Oráculo não pertence a esse
// package.json: em produção é publicado sem ele, e no `main` este teste corria sem ele.
// Sem esta variável, o Deno falha a procurar tipos no node_modules do frontend, ou usa o
// supabase-js do frontend em vez do da função. DENO_NO_PACKAGE_JSON desliga a descoberta
// (documentação do Deno, variáveis de ambiente); as sondas e a função herdam-na daqui.
process.env.DENO_NO_PACKAGE_JSON = '1';

const { correrOraculo } = await import('./oraculo.mjs');
console.log('▶ oráculo (Deno, modo de teste com dados fixos, rede só para 127.0.0.1)…');
const or = await correrOraculo({ raiz });
for (const f of or.falhas) falha('oráculo: ' + f);
resultado.oraculo = { ...carimbo(), verificacoes: or.verificacoes };
console.log(JSON.stringify(or.verificacoes, null, 1));

if (gravar) {
  const anterior = base ?? {};
  const nova = { ...anterior, ...resultado };
  fs.writeFileSync(FICHEIRO_BASE, JSON.stringify(nova, null, 2) + '\n');
  console.log(`linha de base gravada em ${path.relative(raiz, FICHEIRO_BASE)}`);
}
if (falhas.length) {
  console.log(`\n✗ ${falhas.length} falha(s):`);
  for (const f of falhas) console.log('  - ' + f);
  process.exit(1);
}
console.log('\n✓ tudo verde');
