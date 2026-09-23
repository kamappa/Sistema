// Apoio do teste de fumo: servidor estático, Chrome sem cabeça e protocolo CDP.
// Só módulos do Node (≥ 20). Nada daqui toca no Supabase nem na conta do Daniel:
// o Chrome arranca com um perfil TEMPORÁRIO e vazio, logo sem sessão, logo o
// frontend só pode seguir o caminho offline (o cloudSave exige utilizador).
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm',
  '.woff2': 'font/woff2', '.glb': 'model/gltf-binary',
};

/** Serve `raiz` em http://127.0.0.1:<porta livre>/Sistema/ — o mesmo caminho do GitHub Pages. */
export async function servirEstatico(raiz) {
  const base = path.resolve(raiz);
  const servidor = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!p.startsWith('/Sistema/')) { res.writeHead(404); return res.end(); }
    p = p.slice('/Sistema/'.length) || 'index.html';
    const f = path.resolve(base, p);
    if (!f.startsWith(base + path.sep) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404); return res.end('não encontrado');
    }
    res.writeHead(200, { 'content-type': TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${servidor.address().port}/Sistema/`, fechar: () => servidor.close() };
}

function caminhoChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidatos = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  const c = candidatos.find((x) => fs.existsSync(x));
  if (!c) throw new Error('Chrome não encontrado — definir CHROME_PATH');
  return c;
}

/** Chrome sem cabeça com perfil temporário; devolve o endpoint CDP e como o fechar. */
export async function lancarChrome() {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-fumo-perfil-'));
  const proc = spawn(caminhoChrome(), [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=1440,900',
    'about:blank',
  ], { stdio: 'ignore' });
  // Com a porta 0, o Chrome escolhe uma porta livre e escreve-a em DevToolsActivePort.
  const ficheiro = path.join(perfil, 'DevToolsActivePort');
  for (let i = 0; i < 80 && !fs.existsSync(ficheiro); i++) await sleep(250);
  const porta = fs.readFileSync(ficheiro, 'utf8').split('\n')[0].trim();
  const fechar = async () => {
    proc.kill();
    await sleep(500);
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* o Windows às vezes segura ficheiros */ }
  };
  return { http: `http://127.0.0.1:${porta}`, fechar };
}

/** Abre um separador novo (sessionStorage limpo) e liga-lhe um cliente CDP com captura de eventos. */
export async function abrirSeparador(chrome) {
  const t = await (await fetch(`${chrome.http}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pendentes = new Map();
  const eventos = [];
  const pedidos = new Map();
  const ouvintes = new Map(); // método CDP → função (ex.: Fetch.requestPaused, para filtrar a rede)
  let fase = 'inicio';
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pendentes.has(m.id)) {
      const { res, rej } = pendentes.get(m.id); pendentes.delete(m.id);
      return m.error ? rej(new Error(m.error.message)) : res(m.result);
    }
    const p = m.params;
    if (ouvintes.has(m.method)) ouvintes.get(m.method)(p);
    switch (m.method) {
      case 'Runtime.consoleAPICalled': {
        const texto = (p.args || []).map((a) => (a.value !== undefined ? String(a.value) : (a.description || a.type))).join(' ');
        eventos.push({ fase, tipo: 'consola', nivel: p.type, texto: texto.slice(0, 300), url: p.stackTrace?.callFrames?.[0]?.url || '' });
        break;
      }
      case 'Runtime.exceptionThrown': {
        const d = p.exceptionDetails;
        eventos.push({ fase, tipo: 'excecao', nivel: 'error', texto: (d.exception?.description || d.text || '').slice(0, 400), url: d.url || '' });
        break;
      }
      case 'Log.entryAdded':
        if (p.entry.level !== 'verbose') eventos.push({ fase, tipo: 'log:' + p.entry.source, nivel: p.entry.level, texto: (p.entry.text || '').slice(0, 300), url: p.entry.url || '' });
        break;
      case 'Network.requestWillBeSent': pedidos.set(p.requestId, p.request.url); break;
      case 'Network.responseReceived':
        if (p.response.status >= 400) eventos.push({ fase, tipo: 'http', nivel: 'error', texto: String(p.response.status), url: p.response.url });
        break;
      case 'Network.loadingFailed':
        if (!p.canceled) eventos.push({ fase, tipo: 'rede', nivel: 'error', texto: (p.errorText || '') + (p.blockedReason ? ' bloqueado:' + p.blockedReason : ''), url: pedidos.get(p.requestId) || '' });
        break;
    }
  };
  const enviar = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id; pendentes.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
  });
  await enviar('Page.enable'); await enviar('Runtime.enable'); await enviar('Log.enable'); await enviar('Network.enable');
  const avaliar = async (expr) => (await enviar('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.value;
  return {
    eventos,
    set fase(f) { fase = f; },
    get fase() { return fase; },
    enviar,
    avaliar,
    ouvir(metodo, fn) { ouvintes.set(metodo, fn); },
    async navegar(url, esperaMs) { await enviar('Page.navigate', { url }); await sleep(esperaMs); },
    async captura(ficheiro) {
      const r = await enviar('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(ficheiro, Buffer.from(r.data, 'base64'));
    },
    async fechar() { try { await fetch(`${chromeHttpDe(t)}/json/close/${t.id}`); } catch { /* já fechado */ } ws.close(); },
  };
}

function chromeHttpDe(alvo) {
  return new URL(alvo.webSocketDebuggerUrl.replace(/^ws/, 'http')).origin;
}

/** Assinatura estável de um evento, para comparar com a linha de base (portas e ids variáveis saem). */
export function assinatura(e) {
  const norm = (s) => String(s)
    .replace(/127\.0\.0\.1:\d+/g, '127.0.0.1:PORTA')
    .replace(/\?[^\s]*$/g, '')
    .replace(/:\d+:\d+\)?$/g, '');
  return `${e.tipo}|${e.nivel}|${norm(e.texto)}|${norm(e.url)}`;
}
