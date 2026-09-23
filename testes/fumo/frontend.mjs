// Fase do frontend: a aplicação carrega, os ecrãs principais abrem e a consola
// fica limpa — em desktop, mobile, movimento reduzido e com a rede a falhar.
// Cada cenário corre num separador novo e com o armazenamento do site limpo, para
// não depender do anterior. Perfil do Chrome temporário: sem sessão, sem escrita
// na base (ver apoio.mjs).
import path from 'node:path';
import { servirEstatico, lancarChrome, abrirSeparador, sleep } from './apoio.mjs';

// As sete zonas do Dock Celeste (js/nav.js) — os ecrãs principais do HUD.
const ZONAS = ['greet-h', 'oblig', 'objs', 'constel-cv', 'training', 'recall', 'oc-log'];

const JS_ZONAS = `Object.fromEntries(${JSON.stringify(ZONAS)}.map(id => {
  const el = document.getElementById(id);
  const painel = el && (el.closest('.panel,.card,section') || el.parentElement);
  return [id, el ? (painel ? painel.innerText.trim().length : 0) : null];
}))`;
// Conteúdo em fluxo mais largo do que o ecrã (o método da investigação da Missão 24).
// Nem o scrollWidth nem o scrollX servem: a aurora decorativa (<i> absoluto, ~524 px)
// alarga o scrollWidth sem haver overflow real, e o html{overflow-x:hidden} esconde
// o overflow que houver — um .wrap de 700 px fica CORTADO sem a página deslocar
// (medido a 2026-09-23). Ignora-se só o que está fora do fluxo (absoluto, fixo) e o
// que vive dentro de um contentor com scroll próprio. Prova de que falha: um div de
// 800 px dentro do .wrap é apanhado (812 px); um .wrap de 700 px também (712 px).
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
    if (!pior || r.right > pior.direita) pior = { tag: el.tagName, classe: String(el.className).slice(0, 40), direita: Math.round(r.right) };
  }
  return pior;
})()`;

async function entrarOffline(sep) {
  const ecraEntrada = await sep.avaliar(`!!document.querySelector('#auth-ov.show')`);
  if (ecraEntrada) {
    await sep.avaliar(`document.querySelector('.auth-off').click()`);
    await sleep(5000);
  }
  return ecraEntrada;
}

async function limparSite(sep, origem) {
  await sep.enviar('Storage.clearDataForOrigin', { origin: origem, storageTypes: 'all' });
}

export async function correrFrontend({ raiz, pastaSaida }) {
  const site = await servirEstatico(raiz);
  const origem = new URL(site.url).origin;
  const chrome = await lancarChrome();
  const eventos = [];
  const v = {};
  const separadores = [];
  const novo = async () => { const s = await abrirSeparador(chrome); separadores.push(s); return s; };
  try {
    // ── Calibração: o instrumento tem de apanhar uma falha feita de propósito.
    // Sem isto, "zero erros" podia ser só um instrumento cego.
    {
      const s = await novo(); s.fase = 'calibracao';
      await s.navegar(site.url, 3000);
      await s.avaliar(`console.error('SONDA-FUMO'); console.warn('SONDA-FUMO');
        setTimeout(() => { throw new Error('SONDA-FUMO') }, 10);
        fetch('/Sistema/sonda-fumo-404').catch(() => {}); true`);
      await sleep(2000);
      const sondas = s.eventos.filter((e) => (e.texto + e.url).includes('SONDA-FUMO') || e.url.includes('sonda-fumo-404'));
      v.calibracao = {
        consolaErro: sondas.some((e) => e.tipo === 'consola' && e.nivel === 'error'),
        consolaAviso: sondas.some((e) => e.tipo === 'consola' && e.nivel === 'warning'),
        excecao: sondas.some((e) => e.tipo === 'excecao'),
        http404: sondas.some((e) => e.tipo === 'http' && e.texto === '404'),
      };
    }

    // ── Desktop: carregar, entrar sem conta, ecrãs principais.
    {
      const s = await novo(); s.fase = 'desktop';
      await limparSite(s, origem);
      await s.navegar(site.url, 4000);
      const semSessao = await s.avaliar(`Object.keys(localStorage).filter(k => k.startsWith('sb-')).length === 0`);
      const ecraEntrada = await entrarOffline(s);
      v.desktop = {
        ecraEntrada, semSessao,
        zonas: await s.avaliar(JS_ZONAS),
        foraDoEcra: await s.avaliar(JS_FORA_DO_ECRA),
        arranqueCorreu: (await s.avaliar(`sessionStorage.getItem('sysboot')`)) === '1',
      };
      await s.captura(path.join(pastaSaida, 'desktop.png'));

      // Mapa da Estação (js/estacao.js): abre com o botão ✦, fecha com Esc.
      s.fase = 'estacao';
      await sleep(1500); // o botão só fica pronto 1,2 s depois do arranque
      await s.avaliar(`document.querySelector('.station-fab').click()`);
      await sleep(1500);
      const abre = await s.avaliar(`!!document.querySelector('.station-map.on')`);
      const planetas = await s.avaliar(`document.querySelectorAll('.station-map.on .station-planet').length`);
      await s.captura(path.join(pastaSaida, 'estacao.png'));
      await s.avaliar(`dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))`);
      await sleep(800);
      v.estacao = { abre, planetas, fechaComEsc: !(await s.avaliar(`!!document.querySelector('.station-map.on')`)) };
    }

    // ── Mobile (390×844).
    {
      const s = await novo(); s.fase = 'mobile';
      await limparSite(s, origem);
      await s.enviar('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
      await s.navegar(site.url, 4000);
      const ecraEntrada = await entrarOffline(s);
      v.mobile = {
        ecraEntrada,
        zonas: await s.avaliar(JS_ZONAS),
        foraDoEcra: await s.avaliar(JS_FORA_DO_ECRA),
        botaoEstacao: await s.avaliar(`!!document.querySelector('.station-fab')`),
      };
      await s.captura(path.join(pastaSaida, 'mobile.png'));
    }

    // ── Movimento reduzido: a sequência de arranque não pode correr.
    {
      const s = await novo(); s.fase = 'movimento-reduzido';
      await limparSite(s, origem);
      await s.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await s.navegar(site.url, 4000);
      const ecraEntrada = await entrarOffline(s);
      v.movimentoReduzido = {
        ecraEntrada,
        zonas: await s.avaliar(JS_ZONAS),
        arranqueSaltado: (await s.avaliar(`sessionStorage.getItem('sysboot')`)) === null,
      };
    }

    // ── Rede a falhar: sem o Supabase.
    {
      const s = await novo(); s.fase = 'sem-supabase';
      await limparSite(s, origem);
      await s.enviar('Network.setBlockedURLs', { urls: ['*supabase.co*'] });
      await s.navegar(site.url, 5000);
      const ecraEntrada = await entrarOffline(s);
      v.semSupabase = { ecraEntrada, zonas: await s.avaliar(JS_ZONAS) };
    }

    // ── Rede a falhar: sem o CDN de onde vem a biblioteca do Supabase.
    // O init() arranca em modo local quando `sb` não existe (js/auth.js:118-130).
    {
      const s = await novo(); s.fase = 'sem-cdn';
      await limparSite(s, origem);
      await s.enviar('Network.setBlockedURLs', { urls: ['*cdn.jsdelivr.net*'] });
      await s.navegar(site.url, 5000);
      const ecraEntrada = await entrarOffline(s);
      v.semCdn = { ecraEntrada, zonas: await s.avaliar(JS_ZONAS) };
      await s.captura(path.join(pastaSaida, 'sem-cdn.png'));
    }
  } finally {
    for (const s of separadores) { eventos.push(...s.eventos.filter((e) => e.fase !== 'calibracao')); await s.fechar(); }
    await chrome.fechar();
    site.fechar();
  }
  return { verificacoes: v, eventos };
}
