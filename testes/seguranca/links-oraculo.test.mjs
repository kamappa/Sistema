// Os links do Oráculo e do Radar só saem como link se forem http(s).
//
// O texto do Oráculo e do Radar é escrito por um modelo a partir da web. Um URL
// `javascript:` num href corria script na página do Sistema, com a sessão do
// Supabase, ao primeiro clique — e o React 18 não o bloqueia: só avisa em
// desenvolvimento. O Vanilla tem este filtro desde 2026-09-23; a Órbita não tinha.
//
// Os COMPONENTES REAIS são montados, com a store real, num Chrome sem cabeça (perfil
// temporário, nunca o do Daniel) e a rede fechada: só a página de teste responde. O
// esbuild que o Vite já traz empacota-os; nenhuma dependência nova. Cada componente
// leva um controlo positivo — com um https o link TEM de aparecer; sem isso, «não há
// javascript:» podia passar só porque nada foi desenhado. (Desenhar no servidor não
// serve: o zustand 5 dá ao servidor o estado INICIAL da store, e os componentes
// mostravam «Entra com a tua conta».)
//
//   node --test testes/seguranca/links-oraculo.test.mjs
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from '../fumo/apoio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// A página de teste: monta um componente real e devolve os href tal como ficaram no DOM.
const ENTRADA = `
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import RadarNews from './src/components/RadarNews.jsx';
import OracleReport from './src/components/OracleReport.jsx';
import RadarField from './src/app/radar/RadarField.tsx';
import OracleReportLayered from './src/app/oracle/OracleReportLayered.tsx';
import { useStore } from './src/store/useStore.js';

const COMPONENTES = { RadarNews, OracleReport, RadarField, OracleReportLayered };
window.__teste = {
  montar(qual, estado) {
    useStore.setState({ user: { id: 'u-teste' }, fetchErr: null, sync: 'ok', radar: [], report: null, ...estado });
    const el = document.createElement('div');
    document.body.appendChild(el);
    const raiz = createRoot(el);
    flushSync(() => raiz.render(createElement(COMPONENTES[qual], { S: { radarAccepted: {} } })));
    const ico = el.querySelector('.rd-ico');
    const r = {
      hrefs: [...el.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      texto: el.textContent,
      srcs: [...el.querySelectorAll('[src]')].map((e) => e.getAttribute('src')),
      icoTag: ico ? ico.tagName.toLowerCase() : null,
      icoCorFundo: ico ? (ico.style.background || ico.style.backgroundColor || '') : '',
      pontoCor: ico && ico.firstElementChild ? (ico.firstElementChild.style.background || ico.firstElementChild.style.backgroundColor || '') : '',
      pontoLado: ico && ico.firstElementChild ? ico.firstElementChild.style.width : '',
    };
    raiz.unmount();
    el.remove();
    return r;
  },
};
`;

let pasta;
let site;
let chrome;
let s;
const respostasDeFora = [];

before(async () => {
  const r = await build({
    stdin: { contents: ENTRADA, resolveDir: RAIZ, sourcefile: 'entrada-teste.js', loader: 'js' },
    bundle: true,
    platform: 'browser',
    format: 'iife',
    target: 'es2020',
    write: false,
    jsx: 'automatic',
    loader: { '.js': 'jsx', '.css': 'empty', '.png': 'empty', '.svg': 'empty', '.jpg': 'empty', '.webp': 'empty', '.woff2': 'empty' },
    define: {
      'import.meta.env': JSON.stringify({ DEV: false, PROD: true, MODE: 'production', BASE_URL: '/Sistema/' }),
      'process.env.NODE_ENV': '"production"',
    },
    logLevel: 'silent',
  });
  pasta = await mkdtemp(path.join(tmpdir(), 'orbita-links-'));
  await writeFile(path.join(pasta, 'teste.js'), r.outputFiles[0].text);
  await writeFile(path.join(pasta, 'index.html'),
    '<!doctype html><meta charset="utf-8"><title>teste dos links</title><body><script src="teste.js"></script></body>');

  site = await servirEstatico(pasta);
  chrome = await lancarChrome();
  s = await abrirSeparador(chrome);

  // Rede fechada: só a página de teste passa. Uma resposta vinda de fora seria uma
  // fuga do intercetor, e o último teste falha por ela.
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

// Forma real de uma linha de radar_items e de oracle_reports, com os campos que os
// componentes leem.
const itemRadar = (url) => ({
  id: 'r1', user_id: 'u-teste', d: '2026-09-20', title: 'Sinal de teste', url,
  summary: 'Resumo do sinal.', relevance: 'Porque importa.', source: 'Fonte de teste',
  area: 'ai', impact: 'medio', missao: null, created_at: '2026-09-20T07:31:00Z',
});
const relatorio = (url) => ({
  id: 'o1', user_id: 'u-teste', created_at: '2026-09-20T19:05:00Z',
  report: {
    resumo: 'Resumo da semana.',
    recursos: [{ titulo: 'Recurso de teste', url, porque: 'Para aprofundar.', fonte: 'Fonte de teste' }],
  },
});

const montar = (qual, estado) => s.avaliar(`window.__teste.montar(${JSON.stringify(qual)}, ${JSON.stringify(estado)})`);

const SEGURO = 'https://exemplo.invalid/legitimo';
const MALICIOSOS = [
  'javascript:alert(document.domain)',
  'JavaScript:alert(1)',
  '  javascript:alert(1)',
  'java\tscript:alert(1)',
  '\u0001javascript:alert(1)',
  'data:text/html,<script>alert(1)</script>',
  'vbscript:msgbox(1)',
];

const CASOS = [
  { qual: 'RadarNews', estado: (u) => ({ radar: [itemRadar(u)] }), titulo: 'Sinal de teste' },
  { qual: 'RadarField', estado: (u) => ({ radar: [itemRadar(u)] }), titulo: 'Sinal de teste' },
  { qual: 'OracleReport', estado: (u) => ({ report: relatorio(u) }), titulo: 'Recurso de teste' },
  { qual: 'OracleReportLayered', estado: (u) => ({ report: relatorio(u) }), titulo: 'Recurso de teste' },
];

for (const c of CASOS) {
  test(`${c.qual}: um link https aparece (controlo positivo)`, async () => {
    const r = await montar(c.qual, c.estado(SEGURO));
    assert.ok(r.hrefs.includes(SEGURO), 'o link seguro tinha de aparecer — sem isto o teste não prova nada');
  });

  for (const mau of MALICIOSOS) {
    test(`${c.qual}: ${JSON.stringify(mau)} não sai como link e o título fica como texto`, async () => {
      const r = await montar(c.qual, c.estado(mau));
      const perigosos = r.hrefs.filter((h) => !/^https?:\/\//i.test(h));
      assert.deepEqual(perigosos, [], 'href com um esquema que não é http(s)');
      assert.ok(r.texto.includes(c.titulo), 'o título tem de continuar a aparecer, como texto');
    });
  }
}

// Os ícones do Radar não podem pedir nada a terceiros: até aqui cada item pedia o favicon
// a google.com/s2/favicons, o que dava ao Google os domínios que o Radar mostra ao Daniel
// (incluindo as vagas da Vigia). Sai; a área passa a um ponto na cor local (RAREA).
// Forma escolhida pelo Daniel a 2026-09-27, entre duas imagens: um ponto de 8 px dentro da
// caixa escura do ícone antigo, e não um disco cheio de 30 px — o disco repetia o que o chip
// da área já mostra e destoava da linguagem da Órbita.
test('RadarNews não pede ícones a terceiros', async () => {
  const cor = '#c084fc'; // RAREA.ai — a área do item de teste
  const r = await montar('RadarNews', { radar: [itemRadar(SEGURO)] });
  const fora = r.srcs.filter((u) => /^https?:\/\//i.test(u));
  assert.deepEqual(fora, [], 'o Radar carregou algo de um servidor externo (ícone de terceiros)');
  assert.ok(!r.srcs.some((u) => /google/i.test(u)), 'ainda pede o favicon ao Google');
  assert.notEqual(r.icoTag, 'img', 'o ícone ainda é uma imagem — devia ser um ponto local');
  // Controlo positivo: o ponto TEM de existir, com a cor da área; sem isto, as asserções de
  // cima passavam também com um Radar que não desenhou nada.
  assert.ok(r.pontoCor.includes('192') || r.pontoCor.toLowerCase().includes(cor), 'o ponto da área tinha de existir dentro da caixa, com a cor da área');
  assert.equal(r.pontoLado, '8px', 'o ponto tem 8 px');
  assert.equal(r.icoCorFundo, '', 'a caixa do ícone ficou pintada com a cor da área — o ponto é pequeno, dentro da caixa escura');
});

test('nenhuma resposta veio de fora da página de teste (rede fechada)', () => {
  assert.deepEqual(respostasDeFora, []);
});
