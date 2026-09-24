// Abrir o Sistema num separador do Chrome com o Supabase FALSO e a rede fechada.
//
// O Supabase falso (testes/sessoes/supabase-falso.js) é injetado antes de qualquer
// script da página. A rede fecha-se por construção: todo o pedido que não vá para o
// servidor estático local é recusado pelo próprio Chrome (domínio Fetch do CDP), e
// qualquer resposta vinda de fora fica registada — é uma fuga do intercetor e o teste
// deve falhar por ela. Usado por testes/sessoes/ui.mjs e testes/seguranca/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { abrirSeparador, sleep } from '../fumo/apoio.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FALSO = fs.readFileSync(path.join(RAIZ, 'testes/sessoes/supabase-falso.js'), 'utf8');

/** Abre um separador com o Supabase falso configurado por `cfg` (semente, comConta, falha). */
export async function abrirComFalso(chrome, site, nome, cfg, opcoes = {}) {
  const s = await abrirSeparador(chrome); s.fase = nome;
  const local = new URL(site.url).origin + '/';
  const recusados = [];
  s.ouvir('Fetch.requestPaused', (p) => {
    if (p.request.url.startsWith(local)) s.enviar('Fetch.continueRequest', { requestId: p.requestId }).catch(() => {});
    else { recusados.push(p.request.url); s.enviar('Fetch.failRequest', { requestId: p.requestId, errorReason: 'BlockedByClient' }).catch(() => {}); }
  });
  // Prova independente: nenhuma resposta pode chegar de fora. O Fetch recusa antes de sair,
  // por isso uma resposta de um endereço não local seria uma fuga do intercetor.
  const respostasDeFora = [];
  s.ouvir('Network.responseReceived', (p) => { const u = p.response.url; if (!u.startsWith(local) && !/^(data|blob):/.test(u)) respostasDeFora.push(u); });
  await s.enviar('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await s.enviar('Storage.clearDataForOrigin', { origin: new URL(site.url).origin, storageTypes: 'all' });
  // opcoes.relogio: desvio em ms aplicado ao relógio da página (Date e Date.now) ANTES de
  // qualquer script — a app e o Supabase falso veem a mesma hora, que avança em tempo
  // real a partir daí. Serve para os testes não dependerem da hora a que correm.
  if (opcoes.relogio) {
    await s.enviar('Page.addScriptToEvaluateOnNewDocument', { source: `(() => {
      const DESVIO = ${Number(opcoes.relogio)}, Real = Date;
      function Desviada(...a) {
        if (!new.target) return new Real(Real.now() + DESVIO).toString();
        return a.length ? new Real(...a) : new Real(Real.now() + DESVIO);
      }
      Desviada.prototype = Real.prototype;
      Desviada.now = () => Real.now() + DESVIO;
      Desviada.parse = Real.parse;
      Desviada.UTC = Real.UTC;
      window.Date = Desviada;
    })();` });
  }
  await s.enviar('Page.addScriptToEvaluateOnNewDocument', { source: `window.__CFG_FALSO=${JSON.stringify(cfg)};\n${FALSO}` });
  if (opcoes.movel) await s.enviar('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  if (opcoes.reduzido) await s.enviar('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await s.enviar('Page.navigate', { url: site.url });
  s.recusados = recusados;
  s.respostasDeFora = respostasDeFora;
  return s;
}

export async function esperar(s, expr, ms = 8000) {
  const fim = Date.now() + ms;
  for (;;) {
    let v; try { v = await s.avaliar(expr); } catch { v = undefined; }
    if (v || Date.now() > fim) return v;
    await sleep(100);
  }
}
export const texto = (s, sel) => s.avaliar(`(document.querySelector(${JSON.stringify(sel)})||{}).innerText||''`);
export const clicar = (s, sel) => s.avaliar(`(()=>{const el=document.querySelector(${JSON.stringify(sel)});if(!el)return false;el.click();return true})()`);
// textContent e não innerText: o innerText aplica o text-transform (o .btn é maiúsculas)
export const clicarTexto = (s, dentro, t) => s.avaliar(`(()=>{const el=[...document.querySelectorAll(${JSON.stringify(dentro + ' button')})].find(b=>b.textContent.trim()===${JSON.stringify(t)});if(!el)return false;el.click();return true})()`);
