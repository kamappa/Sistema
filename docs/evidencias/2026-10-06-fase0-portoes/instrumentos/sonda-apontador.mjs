// Sonda (0.1, 2026-10-06): o --blink-settings controla o que o Chrome sem cabeça diz de hover/pointer?
// Hipótese: no runner Linux não há dispositivo apontador → hover:none, pointer:none. Se for o caso, lançar com as
// definições a «nenhum» reproduz isso aqui; com «fino + hover» fica rato; e a emulação de toque continua a mandar.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sondar(rotulo, extra, comToque = false) {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'sonda-apontador-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', ...extra, 'about:blank'], { stdio: 'ignore' });
  const f = path.join(perfil, 'DevToolsActivePort');
  for (let i = 0; i < 80 && !fs.existsSync(f); i++) await sleep(250);
  const porta = fs.readFileSync(f, 'utf8').split('\n')[0].trim();
  const t = await (await fetch(`http://127.0.0.1:${porta}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
  const enviar = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  if (comToque) await enviar('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  const r = await enviar('Runtime.evaluate', { returnByValue: true, expression:
    `({hover: matchMedia('(hover: hover)').matches, semHover: matchMedia('(hover: none)').matches,
      fino: matchMedia('(pointer: fine)').matches, grosso: matchMedia('(pointer: coarse)').matches,
      semApontador: matchMedia('(pointer: none)').matches})` });
  console.log(rotulo.padEnd(46), JSON.stringify(r.result?.result?.value ?? r));
  ws.close(); proc.kill(); await sleep(400);
  try { fs.rmSync(perfil, { recursive: true, force: true }); } catch { /* o Windows às vezes segura ficheiros */ }
}

const NENHUM = '--blink-settings=primaryPointerType=1,availablePointerTypes=1,primaryHoverType=1,availableHoverTypes=1';
const RATO = '--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2';
await sondar('1. sem definições (o PC, com rato)', []);
await sondar('2. definições «nenhum» (o runner?)', [NENHUM]);
await sondar('3. definições «rato»', [RATO]);
await sondar('4. definições «rato» + emulação de toque', [RATO], true);
await sondar('5. definições «nenhum» + emulação de toque', [NENHUM], true);
