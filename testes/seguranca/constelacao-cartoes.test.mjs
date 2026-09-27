// Os cartões do céu não deixam o estado guardado virar HTML.
//
// O constelacao-escape.test.mjs prova o fallback em DOM, sem WebGL. Este prova os outros
// dois sítios do src/stage/constellation.js que metem estado guardado em innerHTML, e que
// só existem com WebGL: o cartão da Estrela de Escolha (o caminho escolhido,
// S.constellation.choices[domínio]) e o cartão de uma estrela nascida (a data de
// nascimento, S.constellation.born['domínio:estrela'].d). Os dois vêm do app_state, que é
// gravado pelos dois frontends e chega da nuvem.
//
// A data parece inofensiva — o código só lê dez caracteres, e com dez caracteres já nasce
// um elemento (`<b/>`). Mas se o valor guardado for uma lista em vez de texto, o .slice
// devolve elementos inteiros e o limite desaparece: um <img onerror> inteiro passa.
//
// Monta o céu REAL num Chrome sem cabeça (perfil temporário, nunca o do Daniel; rede
// fechada), com WebGL e com reduced-motion — o cartão abre sem a viagem da câmara —, entra
// no Ofício pelo chip e clica nas estrelas nas coordenadas do config. Cada cartão tem o
// seu controlo positivo: o valor normal TEM de aparecer.
//
//   node --test testes/seguranca/constelacao-cartoes.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from '../fumo/apoio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// Coordenadas no céu do Ofício (src/state/config.js): a Estrela de Escolha e o RGPD.
const ESCOLHA = { x: 0.42, y: 0.16 };
const RGPD = { x: 0.18, y: 0.60 };

const ENTRADA = `
import { initConstellation } from './src/stage/constellation.js';
import { ATTRS, AM, CONSTELLATIONS, TITLES_REAL } from './src/state/config.js';

// Globais que o constellation.js lê (o Stage.jsx faz o mesmo em produção).
window.ATTRS = ATTRS; window.AM = AM; window.CONSTELLATIONS = CONSTELLATIONS; window.TITLES_REAL = TITLES_REAL;

window.__teste = {
  // Céu novo com o caminho e a data dados; entra no Ofício pelo chip (sem Motion, o
  // fly-in é imediato). Nível 6 acende o RGPD e desbloqueia a Estrela de Escolha.
  montar(caminho, data) {
    window.__marcador = 0;
    const attrs = {};
    for (const a of ATTRS) attrs[a.id] = { level: 6, xp: 0 };
    window.S = {
      attrs, titleUnlocked: {}, objectives: [], oblig: [], extras: [],
      constellation: { choices: { oficio: caminho }, born: { 'oficio:rgpd': { d: data } }, bornInit: '2026-01-01' },
    };
    document.body.innerHTML = '<div id="const-chips"></div>'
      + '<div style="position:relative;width:800px;height:500px">'
      + '<canvas id="constel-cv" style="display:block;width:800px;height:500px"></canvas>'
      + '<div id="const-labels"></div></div>';
    initConstellation();
    const chips = [...document.querySelectorAll('#const-chips [data-d]')].map((e) => e.dataset.d);
    document.querySelector('#const-chips [data-d="oficio"]')?.click();
    return {
      webgl: chips.includes('__uni') && !document.querySelector('#const-labels .cfb'),
      dominio: document.querySelector('#const-chips .on')?.dataset.d || null,
    };
  },
  // Clica no céu na posição dada (fração da tela) e devolve o cartão que abriu.
  clicar(x, y) {
    const cv = document.getElementById('constel-cv');
    const r = cv.getBoundingClientRect();
    cv.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + x * r.width, clientY: r.top + y * r.height }));
    const card = document.querySelector('.const-card');
    if (!card) return null;
    const b = card.querySelector('b');
    const now = card.querySelector('.now');
    return {
      texto: card.textContent,
      injetados: card.querySelectorAll('img, script, svg, iframe, i, u, s').length,
      dentroDoNome: b ? b.children.length : -1,
      naData: now ? [...now.children].filter((e) => e.tagName !== 'BR').length : -1,
    };
  },
  marcador: () => window.__marcador,
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
  pasta = await mkdtemp(path.join(tmpdir(), 'orbita-cartoes-'));
  await writeFile(path.join(pasta, 'teste.js'), r.outputFiles[0].text);
  await writeFile(path.join(pasta, 'index.html'),
    '<!doctype html><meta charset="utf-8"><title>teste dos cartões do céu</title><body><script src="teste.js"></script></body>');

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
  // Com reduced-motion, clicar numa estrela abre o cartão sem a viagem da câmara.
  await s.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
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

const montar = (caminho, data) => s.avaliar(`window.__teste.montar(${JSON.stringify(caminho)}, ${JSON.stringify(data)})`);
const clicar = ({ x, y }) => s.avaliar(`window.__teste.clicar(${x}, ${y})`);
// Um onerror dispara depois de o pedido da imagem falhar: esperar antes de ler o marcador.
const marcadorDepois = async () => { await sleep(400); return s.avaliar('window.__teste.marcador()'); };

test('o céu arranca com WebGL e entra no Ofício (sem isto os cartões não existem)', async () => {
  const m = await montar('Auditoria', '2026-09-27');
  assert.equal(m.webgl, true, 'o céu caiu no fallback em DOM — este teste precisa do caminho WebGL');
  assert.equal(m.dominio, 'oficio');
});

test('cartão da Estrela de Escolha: um caminho normal aparece (controlo positivo)', async () => {
  await montar('Auditoria', '2026-09-27');
  const c = await clicar(ESCOLHA);
  assert.ok(c, 'o cartão da Estrela de Escolha não abriu');
  assert.ok(c.texto.includes('Auditoria'), 'o caminho escolhido tinha de aparecer — sem isto o teste não prova nada');
  assert.equal(c.dentroDoNome, 0);
  assert.equal(c.injetados, 0);
});

const HOSTIS = [
  '<img src=x onerror="window.__marcador=1">',
  '<b>negrito injetado</b>',
  '<svg onload="window.__marcador=1"></svg>',
  '</div><script>window.__marcador=1</script>',
];

for (const mau of HOSTIS) {
  test(`cartão da Estrela de Escolha: caminho hostil ${JSON.stringify(mau.slice(0, 32))}… fica como texto`, async () => {
    await montar(mau, '2026-09-27');
    const c = await clicar(ESCOLHA);
    assert.ok(c, 'o cartão da Estrela de Escolha não abriu');
    assert.equal(await marcadorDepois(), 0, 'um onerror/onload disparou — o HTML correu');
    assert.equal(c.injetados, 0, 'nasceu um elemento do caminho escolhido');
    assert.equal(c.dentroDoNome, 0, 'nasceu um elemento dentro do nome do caminho');
    assert.ok(c.texto.includes(mau), 'o caminho tem de aparecer inteiro, como texto');
  });
}

test('cartão de uma estrela nascida: a data normal aparece (controlo positivo)', async () => {
  await montar('Auditoria', '2026-09-27');
  const c = await clicar(RGPD);
  assert.ok(c, 'o cartão do RGPD não abriu');
  assert.ok(c.texto.includes('Nasceu a 27/09/2026'), 'a data de nascimento tinha de aparecer — sem isto o teste não prova nada');
  assert.equal(c.naData, 0);
});

test('cartão de uma estrela nascida: dez caracteres de data hostil ficam como texto', async () => {
  // O código lê d[8..10] + "/" + d[5..7] + "/" + d[0..4]: isto dá "<b/>x/ZZZZ".
  await montar('Auditoria', 'ZZZZ->x-<b');
  const c = await clicar(RGPD);
  assert.ok(c, 'o cartão do RGPD não abriu');
  assert.equal(c.naData, 0, 'nasceu um elemento da data de nascimento');
  assert.ok(c.texto.includes('<b/>x/ZZZZ'), 'a data tem de aparecer como texto');
});

test('cartão de uma estrela nascida: uma data guardada como lista não passa o limite', async () => {
  // Numa lista, o .slice(8,10) devolve os elementos 8 e 9 inteiros.
  const lista = ['', '', '', '', '', '', '', '', '<img src=x onerror="window.__marcador=1">', ''];
  await montar('Auditoria', lista);
  const c = await clicar(RGPD);
  assert.ok(c, 'o cartão do RGPD não abriu');
  assert.equal(await marcadorDepois(), 0, 'o onerror disparou — o HTML da data correu');
  assert.equal(c.injetados, 0, 'nasceu um elemento da data de nascimento');
  assert.equal(c.naData, 0, 'nasceu um elemento da data de nascimento');
  assert.ok(c.texto.includes('<img src=x onerror='), 'a data tem de aparecer como texto');
});

test('nenhuma resposta veio de fora da página de teste (rede fechada)', () => {
  assert.deepEqual(respostasDeFora, []);
});
