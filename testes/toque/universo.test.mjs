// O Universo por toque — etapa 3 da publicação da Órbita, fase 1: testes primeiro (2026-09-27).
//
// Decisões do Daniel:
//   D1 — o 1.º toque num domínio desperta-o e ele fica aceso; o 2.º toque no mesmo mostra os
//        nomes; tocar noutro domínio desperta esse; tocar no céu vazio apaga. É o mesmo par do
//        computador (passar o rato / clicar), e deixa espreitar um domínio sem o abrir.
//   D2 — o Escape no toque é um toque duplo no céu vazio: centra, e se não houver desvio recua.
//   D3 — o texto de ajuda segue o TIPO de entrada, não a largura do ecrã.
// A parte do arrasto por toque fica de fora até à decisão D6: medido, um dedo no céu move-o
// ~24 px e o browser corta o gesto (pointercancel).
//
// O iPhone do Daniel (2026-09-27), depois de a fase 2 dar verde: o Universo abria «partido» —
// rótulos cortados nas margens, «Nv 1» gigante e desfocado, o cartão do Núcleo cortado. Era a
// escala do Núcleo, e chegava-se lá sem querer: um polegar pousado em qualquer sítio do ecrã
// contava como segundo dedo, e o dedo que rolava a página fazia uma pinça. Os testes do fim
// deste ficheiro reproduzem as duas coisas: o caminho (o polegar) e o que se via (a escala do
// Núcleo no telemóvel), com o computador como controlo positivo.
//
// O componente REAL (UniverseScene), com o CSS real, num Chrome sem cabeça (perfil temporário,
// nunca o do Daniel; rede fechada), com rato e com toque simulados pelo protocolo do Chrome.
// O instrumento tem o seu próprio controlo positivo (lição 9 do A.8.13): no modo toque o
// Chrome tem de dizer hover:none e pointer:coarse e dar pointerType "touch"; no modo rato, o
// contrário. Sem isso, um teste de toque podia estar a correr com rato e passar por acaso.
//
//   node --test testes/toque/universo.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from '../fumo/apoio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const TEXTO_RATO = 'Passa o cursor por um domínio para o despertar; clica para leres os nomes.';
const TEXTO_TOQUE = 'Toca num domínio para o despertar; toca outra vez para leres os nomes.';
const DICA_RATO = 'Arrasta para olhar · Ctrl+roda aprofunda · Escape centra';
// D6 (Daniel, 2026-09-27): dois dedos para olhar, um dedo rola a página.
const DICA_TOQUE = 'Dois dedos para olhar · pinça aprofunda · toque duplo centra';

// A página: o Universo real com um estado da app (fresh) e níveis variados; um registo de
// eventos de ponteiro para o controlo do instrumento; e leituras do que se vê.
const ENTRADA = `
import './src/design-system/tokens/index.css';
import './src/styles/base.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import UniverseScene from './src/app/universe/UniverseScene';
import { fresh } from './src/state/fresh.js';

const S = fresh();
const niveis = { oficio: 6, saber: 4, corpo: 3, mente: 2, vinculos: 2, disciplina: 5 };
for (const [k, n] of Object.entries(niveis)) { S.attrs[k].level = n; S.attrs[k].xp = 10; }

window.__eventos = [];
for (const t of ['pointerdown', 'click']) {
  document.addEventListener(t, (e) => window.__eventos.push(t + ':' + (e.pointerType || '-')), true);
}

// O histórico dos estados — um salto ao Núcleo entre duas leituras não passa despercebido —
// e o número máximo de dedos que a página viu ao mesmo tempo.
window.__estados = [];
window.__toquesMax = 0;
document.addEventListener('touchmove', (e) => { window.__toquesMax = Math.max(window.__toquesMax, e.touches.length); }, { capture: true, passive: true });
const vigiar = () => {
  const us = document.querySelector('.us');
  if (!us) return setTimeout(vigiar, 50);
  new MutationObserver(() => window.__estados.push(us.dataset.state)).observe(us, { attributes: true, attributeFilter: ['data-state'] });
};
vigiar();

const raiz = document.createElement('div');
// A caixa real do céu no telemóvel: na app, a zona tem 24 px de margem de cada lado e o céu
// mede 342 a 390 de largura (medido na app: 24..366). Com ?margem, a página repõe isso.
if (new URLSearchParams(location.search).has('margem')) raiz.style.padding = '0 24px';
document.body.appendChild(raiz);
createRoot(raiz).render(createElement(UniverseScene, { S }));
// Conteúdo por baixo, como na zona real: a página tem de poder rolar por cima do céu.
const resto = document.createElement('div');
resto.style.height = '2000px';
document.body.appendChild(resto);

window.__u = {
  pronto: () => !!document.querySelector('.us .us-terr-hit'),
  media: () => ({ hover: matchMedia('(hover: hover)').matches, semHover: matchMedia('(hover: none)').matches,
    fino: matchMedia('(pointer: fine)').matches, grosso: matchMedia('(pointer: coarse)').matches,
    foco: document.hasFocus() }),
  eventos: () => window.__eventos.splice(0),
  estado: () => {
    const us = document.querySelector('.us');
    return {
      estado: us.dataset.state,
      aceso: [...document.querySelectorAll('.us-terr[data-lit="true"]')].map((t) => t.dataset.sig),
      // «Aberto» é ter os nomes desenhados. Não é o data-sel: o modelo guarda o domínio
      // também quando só está desperto, e o data-sel marca-o nos dois casos.
      aberto: [...document.querySelectorAll('.us-terr')].filter((t) => t.querySelector('.us-mk-labels')).map((t) => t.dataset.sig),
      x: us.style.getPropertyValue('--free-x'), y: us.style.getPropertyValue('--free-y'),
      rolagem: Math.round(window.scrollY),
    };
  },
  // Um ponto de céu vazio perto do fundo da cena, com espaço para um dedo subir.
  ceuEmBaixo: () => {
    const us = document.querySelector('.us');
    const r = us.getBoundingClientRect();
    for (const fx of [0.06, 0.94, 0.03, 0.97, 0.12, 0.88]) {
      const x = Math.round(r.left + fx * r.width); const y = Math.round(r.top + 0.9 * r.height);
      const e = document.elementFromPoint(x, y);
      if (e && us.contains(e) && !e.closest('.us-terr, .us-hud, button, a')) return { x, y };
    }
    return null;
  },
  centroDaCena: () => {
    const r = document.querySelector('.us').getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
  },
  textos: () => ({
    texto: [...document.querySelectorAll('.us-hud-s')].map((p) => p.textContent).join(' '),
    dica: document.querySelector('.us-hint')?.textContent ?? null,
  }),
  // O centro do botão de um domínio, onde está agora (a câmara mexe).
  alvo: (id) => {
    const b = document.querySelector('.us-terr[data-sig="' + id + '"] .us-terr-hit').getBoundingClientRect();
    return { x: Math.round(b.left + b.width / 2), y: Math.round(b.top + b.height / 2) };
  },
  // Um ponto de céu vazio: dentro da cena, fora de domínios, do painel de texto e de botões.
  ceu: () => {
    const us = document.querySelector('.us');
    const r = us.getBoundingClientRect();
    for (const [fx, fy] of [[0.06, 0.12], [0.94, 0.12], [0.06, 0.9], [0.94, 0.9], [0.5, 0.06], [0.03, 0.5], [0.97, 0.5]]) {
      const x = Math.round(r.left + fx * r.width); const y = Math.round(r.top + fy * r.height);
      const e = document.elementFromPoint(x, y);
      if (e && us.contains(e) && !e.closest('.us-terr, .us-hud, button, a')) return { x, y };
    }
    return null;
  },
  focar: (id) => { document.querySelector('.us-terr[data-sig="' + id + '"] .us-terr-hit').focus(); },
  historico: () => window.__estados.splice(0),
  toquesMax: () => { const n = window.__toquesMax; window.__toquesMax = 0; return n; },
  // Os nomes e os níveis dos domínios («Saber», «Nv 1»): a altura no ecrã e se se veem — com
  // opacidade efetiva e dentro da caixa do céu.
  rotulos: () => {
    const us = document.querySelector('.us');
    const c = us.getBoundingClientRect();
    const out = [];
    for (const t of document.querySelectorAll('.us-terr')) {
      for (const n of t.querySelectorAll('.us-terr-n, .us-terr-l')) {
        const r = n.getBoundingClientRect();
        let o = 1;
        for (let e = n; e && e !== us; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden') o = 0;
          o *= parseFloat(cs.opacity);
        }
        const noCeu = r.right > c.left && r.left < c.right && r.bottom > c.top && r.top < c.bottom;
        out.push({ id: t.dataset.sig + ' «' + n.textContent + '»', h: r.height, visivel: o > 0.05 && noCeu });
      }
    }
    return out;
  },
  // Os seis nomes do interior do Núcleo: dentro da parte opaca da máscara (a máscara apaga 5%
  // de cada lado), dentro da caixa, e fora do cartão de texto.
  interior: () => {
    const c = document.querySelector('.us').getBoundingClientRect();
    const h = document.querySelector('.us-hud').getBoundingClientRect();
    const a = c.left + 0.05 * c.width; const b = c.right - 0.05 * c.width;
    const nomes = [...document.querySelectorAll('.ci-lab')];
    const problemas = [];
    for (const e of nomes) {
      const r = e.getBoundingClientRect();
      if (r.left < a || r.right > b || r.top < c.top || r.bottom > c.bottom) {
        problemas.push(e.textContent + ' cortado (' + Math.round(r.left) + '..' + Math.round(r.right) + ' num céu visível de ' + Math.round(a) + '..' + Math.round(b) + ')');
      }
      if (r.right > h.left && r.left < h.right && r.bottom > h.top && r.top < h.bottom) problemas.push(e.textContent + ' por baixo do cartão');
    }
    return { n: nomes.length, problemas };
  },
};
`;

let pasta, site, chrome;
const respostasDeFora = [];

before(async () => {
  const r = await build({
    stdin: { contents: ENTRADA, resolveDir: RAIZ, sourcefile: 'entrada-teste.js', loader: 'js' },
    bundle: true, platform: 'browser', format: 'iife', target: 'es2020', write: false, outdir: 'saida', jsx: 'automatic',
    loader: { '.js': 'jsx', '.png': 'empty', '.svg': 'empty', '.jpg': 'empty', '.webp': 'empty', '.woff2': 'empty', '.woff': 'empty' },
    define: { 'import.meta.env': JSON.stringify({ DEV: false, PROD: true, MODE: 'production', BASE_URL: '/Sistema/' }), 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent',
  });
  pasta = await mkdtemp(path.join(tmpdir(), 'orbita-toque-'));
  for (const f of r.outputFiles) await writeFile(path.join(pasta, path.basename(f.path)), f.contents);
  await writeFile(path.join(pasta, 'index.html'),
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
    + '<title>teste do toque no Universo</title><link rel="stylesheet" href="stdin.css">'
    + '<body style="margin:0;background:#000"><script src="stdin.js"></script></body>');
  site = await servirEstatico(pasta);
  chrome = await lancarChrome();
});

after(async () => {
  await chrome?.fechar();
  site?.fechar();
  if (pasta) await rm(pasta, { recursive: true, force: true });
});

// Um separador novo por cenário, com a emulação posta ANTES de a página carregar.
async function abrir({ toque, largura, altura, margem = false }) {
  const s = await abrirSeparador(chrome);
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
  await s.enviar('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 1, mobile: !!toque });
  await s.enviar('Emulation.setTouchEmulationEnabled', toque ? { enabled: true, maxTouchPoints: 5 } : { enabled: false });
  // Um separador sem cabeça não tem o foco da janela: o focus() muda o elemento ativo mas
  // não dispara o evento (medido: 0 eventos focusin). Com isto, a página comporta-se como a
  // janela que o Daniel tem à frente.
  await s.enviar('Emulation.setFocusEmulationEnabled', { enabled: true });
  await s.enviar('Page.navigate', { url: site.url + (margem ? '?margem' : '') });
  for (let i = 0; i < 100 && !(await s.avaliar('!!window.__u && window.__u.pronto()')); i++) await sleep(100);
  assert.ok(await s.avaliar('!!window.__u && window.__u.pronto()'), 'o Universo não arrancou');
  await sleep(300);
  return s;
}

const u = (s, expr) => s.avaliar('window.__u.' + expr);
const RATO = { toque: false, largura: 1440, altura: 900 };
const RATO_ESTREITO = { toque: false, largura: 900, altura: 900 };
const TOQUE_LARGO = { toque: true, largura: 1366, altura: 1024 };
const TOQUE_TELEMOVEL = { toque: true, largura: 390, altura: 844 };

async function tocar(s, { x, y }) {
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await sleep(30);
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x, y }] });
}
// O toque duplo leva o seu próprio ritmo — 150 ms entre toques, nos instantes que o
// protocolo dá aos eventos —, e não o da espera do arnês: com a página ocupada, esperar
// pela resposta de cada toque afastava-os mais do que qualquer dedo.
async function toqueDuplo(s, { x, y }) {
  const t = Date.now() / 1000;
  for (const dt of [0, 0.15]) {
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }], timestamp: t + dt });
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x, y }], timestamp: t + dt + 0.03 });
  }
}
async function arrastarDedo(s, { x, y }, dx, dy) {
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 1; i <= 10; i++) {
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (dx * i) / 10, y: y + (dy * i) / 10 }] });
    await sleep(16);
  }
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [{ x: x + dx, y: y + dy }] });
}
// Dois dedos a `raio` do ponto médio. O ponto médio anda (dx, dy); a distância entre os
// dedos passa de 2·raio a 2·raioFim; e os dedos rodam `graus` à volta do ponto médio —
// assim o dedo que o browser trata como principal percorre um caminho diferente do ponto
// médio, e um arrasto de UM dedo não consegue passar por arrasto de dois.
async function doisDedos(s, { x, y }, { dx = 0, dy = 0, raio = 50, raioFim = raio, graus = 0 } = {}) {
  const pontos = (t) => {
    const mx = x + dx * t; const my = y + dy * t; const r = raio + (raioFim - raio) * t;
    const a = (graus * t * Math.PI) / 180;
    return [
      { x: mx - r * Math.cos(a), y: my - r * Math.sin(a), id: 0 },
      { x: mx + r * Math.cos(a), y: my + r * Math.sin(a), id: 1 },
    ];
  };
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pontos(0) });
  for (let i = 1; i <= 12; i++) {
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: pontos(i / 12) });
    await sleep(16);
  }
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: pontos(1) });
}
const px = (v) => parseFloat(v);
const moverRato = (s, { x, y }) => s.enviar('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
async function clicarRato(s, { x, y }) {
  await moverRato(s, { x, y });
  await s.enviar('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await s.enviar('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}
async function arrastarRato(s, { x, y }, dx, dy) {
  await moverRato(s, { x, y });
  await s.enviar('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  for (let i = 1; i <= 10; i++) {
    await s.enviar('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + (dx * i) / 10, y: y + (dy * i) / 10, button: 'left', buttons: 1 });
    await sleep(16);
  }
  await s.enviar('Input.dispatchMouseEvent', { type: 'mouseReleased', x: x + dx, y: y + dy, button: 'left', clickCount: 1 });
}
// Um polegar pousado e parado em `polegar` há `ms`, e um dedo a rolar a página por cima do céu,
// a subir `dy` px a partir de `dedo`. É o gesto de quem segura o telemóvel com uma mão.
async function rolarComPolegar(s, polegar, dedo, dy, ms) {
  const P = { x: polegar.x, y: polegar.y, id: 0 };
  const D = (t) => ({ x: dedo.x, y: dedo.y + dy * t, id: 1 });
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [P] });
  await sleep(ms);
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [P, D(0)] });
  for (let i = 1; i <= 10; i++) {
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [P, D(i / 10)] });
    await sleep(16);
  }
  await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [P, D(1)] });
}
async function esperarEstado(s, alvo, ms = 3000) {
  let e;
  for (let t = 0; t < ms; t += 100) { e = await u(s, 'estado()'); if (e.estado === alvo) return e; await sleep(100); }
  return e;
}

// ── O INSTRUMENTO (controlos positivos da simulação) ──────────────────────────────────

test('instrumento: o modo rato é rato — hover:hover, pointer:fine e pointerType "mouse"', async () => {
  const s = await abrir(RATO);
  try {
    const m = await u(s, 'media()');
    assert.deepEqual(m, { hover: true, semHover: false, fino: true, grosso: false, foco: true });
    await u(s, 'eventos()');
    await clicarRato(s, await u(s, 'ceu()'));
    assert.ok((await u(s, 'eventos()')).includes('pointerdown:mouse'), 'o clique do rato não chegou como pointerType "mouse"');
  } finally { await s.fechar(); }
});

test('instrumento: o modo toque é toque — hover:none, pointer:coarse e pointerType "touch"', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    const m = await u(s, 'media()');
    assert.deepEqual(m, { hover: false, semHover: true, fino: false, grosso: true, foco: true });
    await u(s, 'eventos()');
    await tocar(s, await u(s, 'ceu()'));
    await sleep(100);
    const ev = await u(s, 'eventos()');
    assert.ok(ev.includes('pointerdown:touch'), 'o toque não chegou como pointerType "touch": ' + ev.join(', '));
    assert.ok(ev.includes('click:touch'), 'o toque não deu clique: ' + ev.join(', '));
  } finally { await s.fechar(); }
});

test('instrumento: o instante dado a cada toque chega ao evento — o ritmo do dedo, não a espera', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await s.avaliar("window.__ts = []; document.addEventListener('pointerdown', (e) => window.__ts.push(e.timeStamp), true)");
    const c = await u(s, 'ceu()');
    const t = Date.now() / 1000;
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c], timestamp: t });
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [c], timestamp: t + 0.03 });
    await sleep(600); // uma espera real muito maior do que o intervalo declarado
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [c], timestamp: t + 0.15 });
    await s.enviar('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [c], timestamp: t + 0.18 });
    await sleep(100);
    const ts = await s.avaliar('window.__ts');
    assert.equal(ts.length, 2, 'não chegaram dois pointerdown');
    assert.ok(Math.abs(ts[1] - ts[0] - 150) < 20, 'o intervalo entre os toques foi ' + Math.round(ts[1] - ts[0]) + ' ms, não 150');
  } finally { await s.fechar(); }
});

// ── D3: O TEXTO SEGUE O TIPO DE ENTRADA ────────────────────────────────────────────────

test('texto: com rato num ecrã largo fala de cursor, Ctrl+roda e Escape (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    const { texto, dica } = await u(s, 'textos()');
    assert.ok(texto.includes('Passa o cursor por um domínio para o despertar'), texto);
    assert.ok(dica.includes('Ctrl+roda aprofunda') && dica.includes('Escape centra'), dica);
  } finally { await s.fechar(); }
});

test('texto: com rato numa janela estreita continua a ser rato', async () => {
  const s = await abrir(RATO_ESTREITO);
  try {
    const { texto, dica } = await u(s, 'textos()');
    assert.ok(texto.includes(TEXTO_RATO), 'texto do rato em falta: ' + texto.slice(-120));
    assert.equal(dica, DICA_RATO);
  } finally { await s.fechar(); }
});

for (const [nome, cenario] of [['num ecrã largo (iPad deitado)', TOQUE_LARGO], ['no telemóvel (390×844)', TOQUE_TELEMOVEL]]) {
  test(`texto: com toque ${nome} fala de toques, não de cursor, Ctrl nem Escape`, async () => {
    const s = await abrir(cenario);
    try {
      const { texto, dica } = await u(s, 'textos()');
      assert.ok(texto.includes(TEXTO_TOQUE), 'texto do toque em falta: ' + texto.slice(-120));
      assert.ok(!/cursor/i.test(texto), 'o texto ainda fala de cursor');
      assert.equal(dica, DICA_TOQUE);
    } finally { await s.fechar(); }
  });
}

// ── O COMPUTADOR FICA COMO ESTÁ (controlos positivos) ──────────────────────────────────

test('rato: passar por cima desperta, sair apaga, um clique abre (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    await moverRato(s, await u(s, 'alvo("oficio")'));
    let e = await esperarEstado(s, 'DOMAIN_HOVER', 1000);
    assert.equal(e.estado, 'DOMAIN_HOVER'); assert.deepEqual(e.aceso, ['oficio']);
    await moverRato(s, await u(s, 'ceu()'));
    e = await esperarEstado(s, 'OVERVIEW', 1000);
    assert.equal(e.estado, 'OVERVIEW'); assert.deepEqual(e.aceso, []);
    await clicarRato(s, await u(s, 'alvo("oficio")'));
    e = await esperarEstado(s, 'DOMAIN_FOCUS', 1500);
    assert.equal(e.estado, 'DOMAIN_FOCUS'); assert.deepEqual(e.aberto, ['oficio']);
  } finally { await s.fechar(); }
});

test('teclado: o foco desperta e o Enter abre (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    await u(s, 'focar("saber")');
    let e = await esperarEstado(s, 'DOMAIN_HOVER', 1000);
    assert.equal(e.estado, 'DOMAIN_HOVER'); assert.deepEqual(e.aceso, ['saber']);
    // Sem `text`, o keyDown do protocolo não gera o carácter, e é ele que ativa o botão.
    await s.enviar('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r', unmodifiedText: '\r' });
    await s.enviar('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    e = await esperarEstado(s, 'DOMAIN_FOCUS', 1500);
    assert.equal(e.estado, 'DOMAIN_FOCUS'); assert.deepEqual(e.aberto, ['saber']);
  } finally { await s.fechar(); }
});

test('rato: Escape centra primeiro e só depois recua (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    await arrastarRato(s, await u(s, 'ceu()'), 80, 30);
    let e = await u(s, 'estado()');
    assert.notEqual(e.x, '0.0px', 'o arrasto do rato não deslocou o céu');
    await s.enviar('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await s.enviar('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(200);
    e = await u(s, 'estado()');
    assert.equal(e.x, '0.0px'); assert.equal(e.y, '0.0px');
    assert.equal(e.estado, 'OVERVIEW');
  } finally { await s.fechar(); }
});

// ── D1: O DESPERTAR POR TOQUE ──────────────────────────────────────────────────────────

test('toque: o primeiro toque num domínio desperta-o e ele fica aceso, sem abrir', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await tocar(s, await u(s, 'alvo("oficio")'));
    await sleep(400);
    const e = await u(s, 'estado()');
    assert.equal(e.estado, 'DOMAIN_HOVER', 'devia ficar desperto, estado ' + e.estado);
    assert.deepEqual(e.aceso, ['oficio']);
    assert.deepEqual(e.aberto, [], 'abriu o domínio ao primeiro toque');
  } finally { await s.fechar(); }
});

test('toque: o segundo toque no mesmo domínio mostra os nomes', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await tocar(s, await u(s, 'alvo("oficio")'));
    await sleep(400);
    // Sem este passo o teste passava com o código de hoje, em que o PRIMEIRO toque já abre:
    // «aberto depois de dois toques» não distingue os dois comportamentos.
    let e = await u(s, 'estado()');
    assert.equal(e.estado, 'DOMAIN_HOVER', 'o primeiro toque devia só despertar, estado ' + e.estado);
    await tocar(s, await u(s, 'alvo("oficio")'));
    e = await esperarEstado(s, 'DOMAIN_FOCUS', 1500);
    assert.equal(e.estado, 'DOMAIN_FOCUS', 'devia mostrar os nomes, estado ' + e.estado);
    assert.deepEqual(e.aberto, ['oficio']);
  } finally { await s.fechar(); }
});

test('toque: tocar noutro domínio desperta esse, sem abrir', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await tocar(s, await u(s, 'alvo("oficio")'));
    await sleep(400);
    await tocar(s, await u(s, 'alvo("saber")'));
    await sleep(400);
    const e = await u(s, 'estado()');
    assert.equal(e.estado, 'DOMAIN_HOVER', 'estado ' + e.estado);
    assert.deepEqual(e.aceso, ['saber']);
    assert.deepEqual(e.aberto, []);
  } finally { await s.fechar(); }
});

test('toque: tocar no céu vazio apaga o domínio desperto', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await tocar(s, await u(s, 'alvo("oficio")'));
    await sleep(400);
    const ceu = await u(s, 'ceu()');
    assert.ok(ceu, 'não encontrei céu vazio para tocar');
    await tocar(s, ceu);
    await sleep(400);
    const e = await u(s, 'estado()');
    assert.equal(e.estado, 'OVERVIEW', 'estado ' + e.estado);
    assert.deepEqual(e.aceso, []);
  } finally { await s.fechar(); }
});

// ── D2: O TOQUE DUPLO NO CÉU VAZIO É O ESCAPE ──────────────────────────────────────────

test('toque duplo no céu vazio centra a câmara deslocada', async () => {
  // O desvio faz-se com o rato, como num iPad com trackpad: o arrasto por toque espera pela D6.
  const s = await abrir(TOQUE_LARGO);
  try {
    await arrastarRato(s, await u(s, 'ceu()'), 80, 30);
    let e = await u(s, 'estado()');
    assert.notEqual(e.x, '0.0px', 'preparação: o arrasto não deslocou o céu');
    await toqueDuplo(s, await u(s, 'ceu()'));
    await sleep(300);
    e = await u(s, 'estado()');
    assert.equal(e.x, '0.0px', 'o toque duplo não centrou (x)');
    assert.equal(e.y, '0.0px', 'o toque duplo não centrou (y)');
  } finally { await s.fechar(); }
});

test('toque duplo no céu vazio, sem desvio, recua um passo', async () => {
  // O domínio abre-se com um clique de rato, para este teste depender só da D2 e não da D1.
  const s = await abrir(TOQUE_LARGO);
  try {
    await clicarRato(s, await u(s, 'alvo("oficio")'));
    let e = await esperarEstado(s, 'DOMAIN_FOCUS', 1500);
    assert.equal(e.estado, 'DOMAIN_FOCUS', 'preparação: o clique do rato não abriu o domínio, estado ' + e.estado);
    const ceu = await u(s, 'ceu()');
    assert.ok(ceu, 'não encontrei céu vazio para tocar');
    await toqueDuplo(s, ceu);
    e = await esperarEstado(s, 'OVERVIEW', 3000);
    assert.equal(e.estado, 'OVERVIEW', 'o toque duplo não recuou, estado ' + e.estado);
  } finally { await s.fechar(); }
});

// ── D6: DOIS DEDOS PARA OLHAR, UM DEDO ROLA A PÁGINA ───────────────────────────────────

test('toque: a pinça a abrir aprofunda — dois dedos chegam à cena (controlo positivo)', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await doisDedos(s, await u(s, 'centroDaCena()'), { raio: 30, raioFim: 90 });
    let e;
    for (let t = 0; t < 2500; t += 100) {
      e = await u(s, 'estado()');
      if (e.estado === 'CORE_APPROACH' || e.estado === 'CORE_INSIDE') break;
      await sleep(100);
    }
    assert.ok(e.estado === 'CORE_APPROACH' || e.estado === 'CORE_INSIDE', 'a pinça não aprofundou, estado ' + e.estado);
  } finally { await s.fechar(); }
});

test('toque: um dedo no céu rola a página e não mexe o céu', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    const p = await u(s, 'ceuEmBaixo()');
    assert.ok(p, 'não encontrei céu vazio em baixo');
    await arrastarDedo(s, p, 0, -220);
    await sleep(500);
    const e = await u(s, 'estado()');
    // A rolagem prova que o gesto chegou; sem ela, «o céu não se mexeu» não provava nada.
    assert.ok(e.rolagem > 40, 'a página não rolou (' + e.rolagem + ' px)');
    assert.equal(e.x, '0.0px', 'um dedo mexeu o céu (x)');
    assert.equal(e.y, '0.0px', 'um dedo mexeu o céu (y)');
  } finally { await s.fechar(); }
});

test('toque: dois dedos arrastam o céu pelo ponto médio', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    await doisDedos(s, await u(s, 'centroDaCena()'), { dx: 50, dy: 20, raio: 50, graus: 90 });
    await sleep(300);
    const e = await u(s, 'estado()');
    assert.ok(Math.abs(px(e.x) - 50) <= 8, 'o céu não seguiu o ponto médio em x: ' + e.x);
    assert.ok(Math.abs(px(e.y) - 20) <= 8, 'o céu não seguiu o ponto médio em y: ' + e.y);
    assert.equal(e.estado, 'OVERVIEW', 'dois dedos à mesma distância não podiam mudar de escala');
  } finally { await s.fechar(); }
});

// ── O POLEGAR POUSADO NÃO É UM SEGUNDO DEDO (o iPhone do Daniel, 2026-09-27) ────────────
// «Se um polegar encostado à borda basta para pôr o Universo na escala do Núcleo sem eu
// perceber, [...] é a diferença entre "só se chega lá por um gesto" e "chega-se lá por
// acidente ao pegar no telemóvel". Trata como bug.» O dedo que rola é o mesmo do teste «um
// dedo no céu rola a página», que é o controlo de que este caminho, sozinho, rola.

test('toque: um polegar pousado fora do céu não faz de segundo dedo — o dedo que rola, rola a página', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    const dedo = await u(s, 'ceuEmBaixo()');
    assert.ok(dedo, 'não encontrei céu vazio em baixo');
    // Por baixo do céu, no conteúdo da página: fora da cena.
    const polegar = { x: 20, y: 700 };
    assert.ok(!(await s.avaliar(`!!document.elementFromPoint(${polegar.x}, ${polegar.y}).closest('.us')`)), 'preparação: o polegar caiu dentro do céu');
    await u(s, 'toquesMax()'); await u(s, 'historico()');
    await rolarComPolegar(s, polegar, dedo, -220, 1000);
    await sleep(500);
    // O controlo do instrumento: sem os dois dedos em simultâneo, o teste não provava nada.
    assert.equal(await u(s, 'toquesMax()'), 2, 'controlo: a página não viu os dois dedos ao mesmo tempo');
    const h = await u(s, 'historico()');
    const e = await u(s, 'estado()');
    assert.deepEqual(h, [], 'o polegar fez de segundo dedo e a cena mudou de escala: ' + h.join(' > '));
    assert.equal(e.x, '0.0px', 'o polegar fez de segundo dedo e o céu mexeu (x)');
    assert.equal(e.y, '0.0px', 'o polegar fez de segundo dedo e o céu mexeu (y)');
    assert.ok(e.rolagem > 40, 'a página não rolou (' + e.rolagem + ' px)');
  } finally { await s.fechar(); }
});

test('toque: um polegar pousado no céu há um segundo não faz de segundo dedo', async () => {
  const s = await abrir(TOQUE_TELEMOVEL);
  try {
    const dedo = await u(s, 'ceuEmBaixo()');
    assert.ok(dedo, 'não encontrei céu vazio em baixo');
    // No canto de baixo do céu, onde encosta o polegar de quem segura o telemóvel.
    const polegar = { x: 8, y: 650 };
    assert.ok(await s.avaliar(`(() => { const e = document.elementFromPoint(${polegar.x}, ${polegar.y}); return !!e.closest('.us') && !e.closest('.us-terr, .us-hud, button, a'); })()`),
      'preparação: o polegar não caiu em céu vazio');
    await u(s, 'toquesMax()'); await u(s, 'historico()');
    await rolarComPolegar(s, polegar, dedo, -220, 1000);
    await sleep(500);
    assert.equal(await u(s, 'toquesMax()'), 2, 'controlo: a página não viu os dois dedos ao mesmo tempo');
    const h = await u(s, 'historico()');
    const e = await u(s, 'estado()');
    assert.deepEqual(h, [], 'o polegar fez de segundo dedo e a cena mudou de escala: ' + h.join(' > '));
    assert.equal(e.x, '0.0px', 'o polegar fez de segundo dedo e o céu mexeu (x)');
    assert.equal(e.y, '0.0px', 'o polegar fez de segundo dedo e o céu mexeu (y)');
    assert.ok(e.rolagem > 40, 'a página não rolou (' + e.rolagem + ' px)');
  } finally { await s.fechar(); }
});

// ── A ESCALA DO NÚCLEO NO TELEMÓVEL (o iPhone do Daniel, 2026-09-27) ───────────────────
// O que ele viu: «Nv 1» gigante e desfocado por cima de tudo; «CIPLINA», «ULOS», «SABER» e
// «CORPO» cortados nas margens; o cartão do Núcleo por cima do céu. Medido no componente: no
// estreito a perspetiva é 800 e a câmara do Núcleo avança os mesmos 780 do computador, que
// tem 1100 — o plano dos domínios fica a 20 px do olho e cresce 40×; no computador, 3,4×.
// O critério é o computador, que é o aspeto aprovado na Missão 26.

async function irAoNucleo(s, toque) {
  const c = await u(s, 'centroDaCena()');
  if (toque) await doisDedos(s, c, { raio: 30, raioFim: 90 });
  else {
    await moverRato(s, c);
    await s.enviar('Input.dispatchMouseEvent', { type: 'mouseWheel', x: c.x, y: c.y, deltaX: 0, deltaY: -400, modifiers: 2 });
  }
  const e = await esperarEstado(s, 'CORE_INSIDE', 4000);
  assert.equal(e.estado, 'CORE_INSIDE', 'preparação: não cheguei ao Núcleo, estado ' + e.estado);
  await sleep(2200); // a câmara pára e os nomes do interior acabam de aparecer
}
const ampliacoes = (antes, depois) => depois.map((d) => ({ ...d, x: d.h / antes.find((a) => a.id === d.id).h }));

test('computador: no Núcleo os domínios crescem 3,4× e nenhum fica gigante no céu (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    const antes = await u(s, 'rotulos()');
    // O controlo da medida: na vista geral vê os doze (seis nomes, seis níveis).
    assert.equal(antes.filter((r) => r.visivel).length, 12, 'a medida não vê os doze rótulos na vista geral');
    await irAoNucleo(s, false);
    const amp = ampliacoes(antes, await u(s, 'rotulos()'));
    // Acima de 2 prova que a câmara se aproximou e que a medida o vê.
    const min = Math.min(...amp.map((a) => a.x));
    assert.ok(min > 2, 'a medida não viu a câmara aproximar-se (' + min.toFixed(1) + '×)');
    const gigantes = amp.filter((a) => a.visivel && a.x > 4).map((a) => a.id + ' ' + a.x.toFixed(0) + '×');
    assert.deepEqual(gigantes, []);
  } finally { await s.fechar(); }
});

test('telemóvel: no Núcleo nenhum domínio fica gigante no céu — não cresce mais do que no computador', async () => {
  const s = await abrir({ ...TOQUE_TELEMOVEL, margem: true });
  try {
    const antes = await u(s, 'rotulos()');
    assert.equal(antes.filter((r) => r.visivel).length, 12, 'a medida não vê os doze rótulos na vista geral');
    await irAoNucleo(s, true);
    const amp = ampliacoes(antes, await u(s, 'rotulos()'));
    const gigantes = amp.filter((a) => a.visivel && a.x > 4).map((a) => a.id + ' ' + a.x.toFixed(0) + '×');
    assert.deepEqual(gigantes, [], 'texto gigante no céu: ' + gigantes.join(', '));
  } finally { await s.fechar(); }
});

test('computador: os seis nomes do interior do Núcleo cabem no céu, fora do cartão (controlo positivo)', async () => {
  const s = await abrir(RATO);
  try {
    await irAoNucleo(s, false);
    const r = await u(s, 'interior()');
    assert.equal(r.n, 6, 'a medida não encontrou os seis nomes do interior');
    assert.deepEqual(r.problemas, []);
  } finally { await s.fechar(); }
});

test('telemóvel: os seis nomes do interior do Núcleo cabem no céu, fora do cartão (a caixa real, 342 px)', async () => {
  const s = await abrir({ ...TOQUE_TELEMOVEL, margem: true });
  try {
    await irAoNucleo(s, true);
    const r = await u(s, 'interior()');
    assert.equal(r.n, 6, 'a medida não encontrou os seis nomes do interior');
    assert.deepEqual(r.problemas, [], r.problemas.join('; '));
  } finally { await s.fechar(); }
});

test('nenhuma resposta veio de fora da página de teste (rede fechada)', () => {
  assert.deepEqual(respostasDeFora, []);
});
