// O versao.json do site: o commit e as somas do build que o Pages serve — e mais nada.
//
// Gerado no build, logo a seguir ao Vite; conferido pelo verificar-destino depois do deploy (a
// fatia 3 do 0.1) e, todos os dias, pelo sistema-vigia, que tem a sua própria cópia do validador
// de propósito (um erro aqui não pode enganar quem vigia).
//
// Formato fixo (decisão do Daniel, 2026-10-10): só `commit` e `somas`. O commit vem do git da
// cópia de trabalho, nunca de variáveis de ambiente; o `gerar` valida antes de escrever e recusa-se
// a escrever um objeto inválido.
//
//   node scripts/versao.mjs gerar [dist]
//   node scripts/versao.mjs verificar <url-do-site> [--tentativas N] [--intervalo-ms N]
//
// Sem dependências: corre no runner do verificar-destino, que não faz `npm ci`.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const NOME = 'versao.json';
const CAMPOS = ['commit', 'somas'];
const RE_COMMIT = /^[0-9a-f]{40}$/;
const RE_SOMA = /^[0-9a-f]{64}$/;
const RE_CAMINHO = /^[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)*$/;

export function validar(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('versao.json: não é um objeto');
  const chaves = Object.keys(obj).sort();
  if (chaves.join(',') !== [...CAMPOS].sort().join(',')) {
    throw new Error(`versao.json: os campos têm de ser exatamente ${CAMPOS.join(' e ')} (tem: ${chaves.join(', ')})`);
  }
  if (typeof obj.commit !== 'string' || !RE_COMMIT.test(obj.commit)) throw new Error('versao.json: commit não é um SHA de 40 caracteres');
  const { somas } = obj;
  if (!somas || typeof somas !== 'object' || Array.isArray(somas)) throw new Error('versao.json: somas não é um objeto');
  const caminhos = Object.keys(somas);
  if (caminhos.length === 0) throw new Error('versao.json: somas vazias');
  for (const c of caminhos) {
    if (!RE_CAMINHO.test(c) || c.split('/').some((p) => p === '.' || p === '..')) throw new Error(`versao.json: caminho inválido: ${c}`);
    if (c === NOME) throw new Error('versao.json: não pode conter a própria soma');
    if (typeof somas[c] !== 'string' || !RE_SOMA.test(somas[c])) throw new Error(`versao.json: soma inválida em ${c}`);
  }
  return obj;
}

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

export async function calcularSomas(dist) {
  const ficheiros = (await readdir(dist, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile())
    .map((e) => path.relative(dist, path.join(e.parentPath ?? e.path, e.name)).split(path.sep).join('/'))
    .filter((c) => c !== NOME)
    .sort();
  const somas = {};
  for (const c of ficheiros) somas[c] = sha256(await readFile(path.join(dist, c)));
  return somas;
}

export function lerCommit(cwd = process.cwd()) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd, encoding: 'utf8' }).trim();
}

export async function gerar(dist, commit) {
  const obj = validar({ commit, somas: await calcularSomas(dist) });
  await writeFile(path.join(dist, NOME), JSON.stringify(obj, null, 2) + '\n');
  return obj;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function obter(url) {
  const r = await fetch(url, { cache: 'no-store', headers: { 'cache-control': 'no-cache' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} em ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

// Lê o versao.json servido, até o commit ser o esperado (a CDN do Pages guarda até 10 min), e
// confere a soma de cada ficheiro listado. Devolve { ok, ficheiros, falhas }, sem lançar.
export async function verificar(base, commitEsperado, { tentativas = 13, intervaloMs = 60_000 } = {}) {
  const raiz = base.endsWith('/') ? base : base + '/';
  let versao;
  for (let i = 1; i <= tentativas; i++) {
    try {
      versao = validar(JSON.parse((await obter(raiz + NOME)).toString('utf8')));
    } catch (e) {
      return { ok: false, ficheiros: 0, falhas: [`${NOME}: ${e.message}`] };
    }
    if (versao.commit === commitEsperado) break;
    if (i < tentativas) await esperar(intervaloMs);
  }
  if (versao.commit !== commitEsperado) {
    return { ok: false, ficheiros: 0, falhas: [`commit servido ${versao.commit}, esperado ${commitEsperado}`] };
  }
  const falhas = [];
  for (const [c, soma] of Object.entries(versao.somas)) {
    try {
      const servida = sha256(await obter(raiz + c));
      if (servida !== soma) falhas.push(`${c}: soma servida ${servida} ≠ ${soma}`);
    } catch (e) {
      falhas.push(`${c}: ${e.message}`);
    }
  }
  return { ok: falhas.length === 0, ficheiros: Object.keys(versao.somas).length, falhas };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [modo, alvo, ...resto] = process.argv.slice(2);
  const opcao = (nome) => { const i = resto.indexOf(nome); return i >= 0 ? Number(resto[i + 1]) : undefined; };
  if (modo === 'gerar') {
    const obj = await gerar(alvo || 'dist', lerCommit());
    console.log(`${NOME}: commit ${obj.commit}, ${Object.keys(obj.somas).length} ficheiros`);
  } else if (modo === 'verificar' && alvo) {
    const commit = lerCommit();
    const r = await verificar(alvo, commit, { tentativas: opcao('--tentativas'), intervaloMs: opcao('--intervalo-ms') });
    console.log(`alvo ${alvo}; commit esperado ${commit}; ficheiros conferidos: ${r.ficheiros}`);
    for (const f of r.falhas) console.log(`✗ ${f}`);
    console.log(r.ok ? '✓ o site serve este build' : `✗ ${r.falhas.length} falha(s)`);
    process.exitCode = r.ok ? 0 : 1;
  } else {
    console.error('uso: node scripts/versao.mjs gerar [dist] | verificar <url> [--tentativas N] [--intervalo-ms N]');
    process.exitCode = 2;
  }
}
