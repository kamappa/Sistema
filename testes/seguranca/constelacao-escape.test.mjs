// O céu não deixa o estado guardado virar HTML.
//
// src/stage/constellation.js escreve os rótulos e os cartões com innerHTML. O caminho
// escolhido — S.constellation.choices[domínio] — vem do app_state, que é gravado pelos
// dois frontends e chega da nuvem. Hoje entra cru: um valor adulterado como
// `<img onerror=…>` nasceria como elemento no céu. Este teste monta o céu REAL num Chrome
// sem cabeça (perfil temporário, nunca o do Daniel; rede fechada), pela via do fallback
// em DOM (é a que mostra o «◈ Caminho: …» sem precisar de cliques nem de WebGL), e exige:
// um caminho normal aparece como texto (controlo positivo), e um caminho hostil aparece
// como texto — nenhum elemento nasce dele, nenhum onerror dispara.
//
//   node --test testes/seguranca/constelacao-escape.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from '../fumo/apoio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// A página de teste: força o WebGL a falhar (para o céu cair no fallback em DOM), semeia
// o estado com um caminho escolhido no Ofício, e monta o céu real.
const ENTRADA = `
import { initConstellation } from './src/stage/constellation.js';
import { ATTRS, AM, CONSTELLATIONS, TITLES_REAL } from './src/state/config.js';

// Globais que o constellation.js lê (o Stage.jsx faz o mesmo em produção).
window.ATTRS = ATTRS; window.AM = AM; window.CONSTELLATIONS = CONSTELLATIONS; window.TITLES_REAL = TITLES_REAL;

// Sem WebGL: getContext devolve null → o new THREE.WebGLRenderer(...) atira, e o
// initConstellation cai no initDomFallback, que desenha o «◈ Caminho: …» em #const-labels.
const getContextReal = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (tipo, ...resto) {
  if (String(tipo).includes('webgl') || String(tipo).includes('experimental')) return null;
  return getContextReal.call(this, tipo, ...resto);
};

function estadoCom(caminho) {
  const attrs = {};
  for (const a of ATTRS) attrs[a.id] = { level: 6, xp: 0 }; // nível 6 desbloqueia a Estrela de Escolha
  return { attrs, constellation: { choices: { oficio: caminho }, born: {} }, titleUnlocked: {}, objectives: [], oblig: [], extras: [] };
}

window.__teste = {
  render(caminho) {
    window.__marcador = 0;
    // DOM fresco a cada corrida.
    document.body.innerHTML = '<div class="const-dom-wrap"><div class="const-chips" id="const-chips"></div><div><canvas id="constel-cv"></canvas><div id="const-labels"></div></div></div>';
    window.S = estadoCom(caminho);
    initConstellation();
    const labels = document.getElementById('const-labels');
    return {
      html: labels.innerHTML,
      texto: labels.textContent,
      elementosInjetados: labels.querySelectorAll('img, script, svg, iframe, b, i').length,
      temImg: !!labels.querySelector('img'),
      marcador: window.__marcador,
    };
  },
};
`;

let pasta, site, chrome, s;
const respostasDeFora = [];

before(async () => {
  const r = await build({
    stdin: { contents: ENTRADA, resolveDir: RAIZ, sourcefile: 'entrada-teste.js', loader: 'js' },
    bundle: true, platform: 'browser', format: 'iife', target: 'es2020', write: false, jsx: 'automatic',
    loader: { '.js': 'jsx', '.css': 'empty', '.png': 'empty', '.svg': 'empty', '.jpg': 'empty', '.webp': 'empty', '.woff2': 'empty' },
    define: { 'import.meta.env': JSON.stringify({ DEV: false, PROD: true, MODE: 'production', BASE_URL: '/Sistema/' }), 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  pasta = await mkdtemp(path.join(tmpdir(), 'orbita-constel-'));
  await writeFile(path.join(pasta, 'teste.js'), r.outputFiles[0].text);
  await writeFile(path.join(pasta, 'index.html'),
    '<!doctype html><meta charset="utf-8"><title>teste do céu</title><body><script src="teste.js"></script></body>');

  site = await servirEstatico(pasta);
  chrome = await lancarChrome();
  s = await abrirSeparador(chrome);

  const local = new URL(site.url).origin + '/';
  s.ouvir('Fetch.requestPaused', (p) => {
    if (p.request.url.startsWith(local)) s.enviar('Fetch.continueRequest', { requestId: p.requestId }).catch(() => {});
    else s.enviar('Fetch.failRequest', { requestId: p.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
  });
  s.ouvir('Network.responseReceived', (p) => {
    const u = p.response.url;
    if (!u.startsWith(local) && !/^(data|blob):/.test(u)) respostasDeFora.push(u);
  });
  await s.enviar('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await s.enviar('Page.navigate', { url: site.url });
  for (let i = 0; i < 100 && !(await s.avaliar('!!window.__teste')); i++) await sleep(100);
  assert.ok(await s.avaliar('!!window.__teste'), 'a página de teste não arrancou');
});

after(async () => {
  await s?.fechar();
  await chrome?.fechar();
  site?.fechar();
  if (pasta) await rm(pasta, { recursive: true, force: true });
});

const render = (caminho) => s.avaliar(`window.__teste.render(${JSON.stringify(caminho)})`);

const HOSTIS = [
  '<img src=x onerror="window.__marcador=1">',
  '<b>negrito injetado</b>',
  '<svg onload="window.__marcador=1"></svg>',
  '</div><script>window.__marcador=1</script>',
];

test('caminho normal aparece como texto (controlo positivo)', async () => {
  const r = await render('Auditoria');
  assert.ok(r.texto.includes('Auditoria'), 'o caminho escolhido tinha de aparecer — sem isto o teste não prova nada');
  assert.equal(r.elementosInjetados, 0, 'um caminho normal não devia criar elementos');
});

for (const mau of HOSTIS) {
  test(`caminho hostil ${JSON.stringify(mau.slice(0, 32))}… fica como texto, sem nascer elemento`, async () => {
    const r = await render(mau);
    assert.equal(r.marcador, 0, 'um onerror/onload disparou — o HTML correu');
    assert.equal(r.temImg, false, 'nasceu um <img> do caminho escolhido');
    assert.equal(r.elementosInjetados, 0, 'nasceu um elemento do caminho escolhido');
    assert.ok(r.texto.includes(mau), 'o caminho tem de aparecer inteiro, como texto');
  });
}

test('nenhuma resposta veio de fora da página de teste (rede fechada)', () => {
  assert.deepEqual(respostasDeFora, []);
});
