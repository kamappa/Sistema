// Fumo da Órbita — o build de produção num Chrome a sério, no computador (1440×900) e no telemóvel
// (390×844, DPR 3, toque). Etapa 4 da publicação (2026-10-04).
//
//   node testes/fumo/orbita.mjs                                  # serve ./dist em /Sistema/ (depois do build)
//   node testes/fumo/orbita.mjs <pasta-do-dist>                  # outra pasta de build
//   node testes/fumo/orbita.mjs https://kamappa.github.io/Sistema/   # no destino, depois de publicar
//
// Perfil TEMPORÁRIO (sem sessão, nunca o do Daniel) e rede SÓ para a origem do site: o Supabase e o
// resto ficam bloqueados, por isso nada disto toca na conta nem nos dados dele. O «Continuar offline»
// grava só no perfil temporário, que se apaga no fim.
//
// O instrumento prova primeiro que consegue falhar (calibração): uma mensagem de erro na consola, uma
// exceção, um pedido com 404 e um elemento de 2000 px plantados de propósito têm de ser apanhados.
// Código de saída 0 = tudo verde; 1 = alguma verificação falhou.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from './apoio.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const alvo = process.argv[2] || path.join(raiz, 'dist');
const remoto = /^https?:\/\//.test(alvo);
if (!remoto && !fs.existsSync(path.join(alvo, 'index.html'))) {
  console.error(`não há build em ${alvo} — correr «npm run build» primeiro`);
  process.exit(2);
}
const site = remoto ? null : await servirEstatico(alvo);
const base = remoto ? (alvo.endsWith('/') ? alvo : alvo + '/') : site.url;
const origem = new URL(base).origin;
const pastaSaida = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-fumo-orbita-'));

const passou = [];
const falhou = [];
const verificar = (cond, nome, detalhe) => {
  if (cond) passou.push(nome);
  else falhou.push(detalhe === undefined ? nome : `${nome} — ${JSON.stringify(detalhe)}`);
};

// Conteúdo em fluxo mais largo do que o ecrã — o método do fumo do Vanilla (frontend.mjs do main,
// 2026-09-23): nem o scrollWidth nem o scrollX servem (decoração absoluta alarga o primeiro, e o
// overflow-x:hidden esconde o resto); ignora-se só o que está fora do fluxo e o que vive dentro de
// um contentor com scroll próprio.
const JS_FORA_DO_ECRA = `(() => {
  const W = document.documentElement.clientWidth;
  const foraDoFluxo = (el) => { for (let a = el; a && a !== document.body; a = a.parentElement) {
    const cs = getComputedStyle(a);
    if (cs.position === 'absolute' || cs.position === 'fixed') return true;
    if (a !== el && cs.overflowX !== 'visible') return true; } return false; };
  let pior = null;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (!r.width || r.right <= W + 0.5 || foraDoFluxo(el)) continue;
    if (!pior || r.right > pior.direita) pior = { tag: el.tagName, classe: String(el.className).slice(0, 40), direita: Math.round(r.right), ecra: W };
  }
  return pior;
})()`;

const JS_ENTRADA = `(() => {
  const visivel = (el) => !!el && el.offsetParent !== null;
  const pass = document.querySelector('input[type="password"]');
  const offline = [...document.querySelectorAll('button')].find((b) => /Continuar offline/.test(b.textContent));
  return { password: visivel(pass), offline: visivel(offline) };
})()`;

const JS_ESTADO_APP = `(() => {
  const root = document.getElementById('root');
  return { textoNaApp: root ? root.innerText.trim().length : 0, aindaNoLogin: !!document.querySelector('input[type="password"]') };
})()`;

const JS_NAVEGACAO = `(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? n.responseStatus : null; })()`;

// O /Sistema/sw.js publicado tem de ser o da Órbita — nunca o interruptor da reversão
// (reversao/sw.js), que desligaria o service worker de quem a usa.
const JS_SW = `(async () => {
  const texto = await (await fetch('sw.js', { cache: 'no-store' })).text();
  const r = await Promise.race([
    navigator.serviceWorker.ready.then((x) => ({ ativo: !!x.active, script: x.active ? x.active.scriptURL : null })),
    new Promise((ok) => setTimeout(() => ok({ ativo: false, script: null, esgotou: true }), 10000)),
  ]);
  return { ...r, eDaOrbita: texto.includes('sistema-shell-'), eOInterruptor: texto.includes('Interruptor do service worker') };
})()`;

const JS_MANIFESTO = `(async () => {
  const l = document.querySelector('link[rel="manifest"]');
  if (!l) return { link: false };
  const r = await fetch(l.href, { cache: 'no-store' });
  let j = null; try { j = await r.json(); } catch { /* não é JSON */ }
  return { link: true, estado: r.status, startUrl: j && j.start_url, scope: j && j.scope };
})()`;

async function abrir(chrome, vista) {
  const s = await abrirSeparador(chrome);
  const bloqueados = new Set();
  s.ouvir('Fetch.requestPaused', (p) => {
    if (p.request.url.startsWith(origem)) s.enviar('Fetch.continueRequest', { requestId: p.requestId }).catch(() => {});
    else {
      try { bloqueados.add(new URL(p.request.url).host); } catch { bloqueados.add(p.request.url.slice(0, 60)); }
      s.enviar('Fetch.failRequest', { requestId: p.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
    }
  });
  await s.enviar('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await s.enviar('Emulation.setDeviceMetricsOverride', { width: vista.largura, height: vista.altura, deviceScaleFactor: vista.dpr, mobile: vista.movel });
  if (vista.movel) await s.enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  return { s, bloqueados };
}

// Erros que contam: da própria origem (os pedidos bloqueados para fora são esperados e listam-se à parte).
const errosDaFase = (s, fase) => s.eventos.filter((e) => e.fase === fase && e.nivel === 'error'
  && !(e.tipo === 'rede' && /bloqueado|BlockedByClient/.test(e.texto))
  && (!e.url || e.url.startsWith(origem)));

const chrome = await lancarChrome();
const relatorio = { alvo: base, vistas: {}, bloqueadosParaFora: [] };
try {
  // ── Calibração: o instrumento tem de apanhar o que se planta de propósito.
  {
    const { s } = await abrir(chrome, { largura: 1440, altura: 900, dpr: 1, movel: false });
    s.fase = 'calibracao';
    await s.navegar(base, 3000);
    await s.avaliar(`(() => { console.error('sonda-consola-fumo'); setTimeout(() => { throw new Error('sonda-excecao-fumo'); }, 0);
      fetch('${base}sonda-inexistente-fumo.js').catch(() => {}); return true; })()`);
    await sleep(1500);
    const ev = s.eventos.filter((e) => e.fase === 'calibracao');
    const largo = await s.avaliar(`(() => { const d = document.createElement('div'); d.id = 'sonda-larga-fumo'; d.style.width = '2000px'; d.style.height = '4px';
      document.body.appendChild(d); const r = ${JS_FORA_DO_ECRA}; d.remove(); return r; })()`);
    verificar(ev.some((e) => e.tipo === 'consola' && e.texto.includes('sonda-consola-fumo')), 'calibração: apanha um erro na consola');
    verificar(ev.some((e) => e.tipo === 'excecao' && e.texto.includes('sonda-excecao-fumo')), 'calibração: apanha uma exceção');
    verificar(ev.some((e) => e.tipo === 'http' && e.texto === '404' && e.url.includes('sonda-inexistente-fumo')), 'calibração: apanha um 404');
    verificar(!!largo && largo.direita >= 2000, 'calibração: apanha um elemento em fluxo mais largo do que o ecrã', largo);
    await s.fechar();
  }

  for (const vista of [
    { nome: 'computador 1440×900', largura: 1440, altura: 900, dpr: 1, movel: false },
    { nome: 'telemóvel 390×844', largura: 390, altura: 844, dpr: 3, movel: true },
  ]) {
    const { s, bloqueados } = await abrir(chrome, vista);
    const r = {};
    s.fase = 'entrada';
    await s.navegar(base, 4000);
    r.estadoDoDocumento = await s.avaliar(JS_NAVEGACAO);
    r.entrada = await s.avaliar(JS_ENTRADA);
    r.foraDoEcraNaEntrada = await s.avaliar(JS_FORA_DO_ECRA);
    await s.captura(path.join(pastaSaida, `${vista.movel ? 'telemovel' : 'computador'}-entrada.png`));
    r.errosNaEntrada = errosDaFase(s, 'entrada');

    s.fase = 'app';
    await s.avaliar(`(() => { const b = [...document.querySelectorAll('button')].find((x) => /Continuar offline/.test(x.textContent)); if (b) b.click(); return !!b; })()`);
    await sleep(4000);
    r.app = await s.avaliar(JS_ESTADO_APP);
    r.foraDoEcraNaApp = await s.avaliar(JS_FORA_DO_ECRA);
    await s.captura(path.join(pastaSaida, `${vista.movel ? 'telemovel' : 'computador'}-app.png`));
    r.errosNaApp = errosDaFase(s, 'app');
    if (!vista.movel) {
      r.serviceWorker = await s.avaliar(JS_SW);
      r.manifesto = await s.avaliar(JS_MANIFESTO);
    }
    r.bloqueados = [...bloqueados];
    relatorio.vistas[vista.nome] = r;

    const v = vista.nome;
    verificar(r.estadoDoDocumento === 200, `${v}: a página responde 200`, r.estadoDoDocumento);
    verificar(r.entrada && r.entrada.password && r.entrada.offline, `${v}: o ecrã de entrada mostra a password e o «Continuar offline»`, r.entrada);
    verificar(!r.foraDoEcraNaEntrada, `${v}: nada em fluxo sai do ecrã na entrada`, r.foraDoEcraNaEntrada);
    verificar(r.errosNaEntrada.length === 0, `${v}: entrada sem erros da própria origem`, r.errosNaEntrada.slice(0, 3));
    verificar(r.app && !r.app.aindaNoLogin && r.app.textoNaApp > 200, `${v}: «Continuar offline» abre a app desenhada`, r.app);
    verificar(!r.foraDoEcraNaApp, `${v}: nada em fluxo sai do ecrã na app`, r.foraDoEcraNaApp);
    verificar(r.errosNaApp.length === 0, `${v}: app sem erros da própria origem`, r.errosNaApp.slice(0, 3));
    if (!vista.movel) {
      verificar(r.serviceWorker && r.serviceWorker.ativo && /\/Sistema\/sw\.js$/.test(r.serviceWorker.script || ''), `${v}: o service worker regista-se em /Sistema/sw.js`, r.serviceWorker);
      verificar(r.serviceWorker && r.serviceWorker.eDaOrbita && !r.serviceWorker.eOInterruptor, `${v}: o sw.js publicado é o da Órbita, não o interruptor da reversão`, r.serviceWorker);
      verificar(r.manifesto && r.manifesto.link && r.manifesto.estado === 200 && String(r.manifesto.startUrl).includes('/Sistema/')
        && String(r.manifesto.scope).includes('/Sistema/'), `${v}: o manifesto responde 200 e aponta para /Sistema/`, r.manifesto);
    }
    for (const h of bloqueados) if (!relatorio.bloqueadosParaFora.includes(h)) relatorio.bloqueadosParaFora.push(h);
    await s.fechar();
  }
} finally {
  await chrome.fechar();
  if (site) site.fechar();
}

console.log(JSON.stringify(relatorio, null, 1));
console.log(`\npedidos para fora, bloqueados de propósito: ${relatorio.bloqueadosParaFora.join(', ') || 'nenhum'}`);
console.log(`capturas: ${pastaSaida}`);
console.log(`\n${passou.length} verificações passaram, ${falhou.length} falharam`);
if (falhou.length) {
  for (const f of falhou) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('✓ tudo verde');
