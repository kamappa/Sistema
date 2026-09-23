// Fase do Oráculo: a Edge Function corre LOCALMENTE, em Deno, no modo de teste com
// dados fixos (supabase/functions/oraculo/teste/). Garantias, por construção:
//   · o Deno só tem rede para 127.0.0.1:<porta> — um pedido à Anthropic, ao GitHub
//     ou ao Supabase real é recusado pelo runtime, não por boa vontade do código;
//   · as variáveis de ambiente são falsas (nenhum segredo real é lido nem existe aqui);
//   · o modo de teste só liga com um SUPABASE_URL local.
// Os valores esperados abaixo são literais, derivados à mão dos dados fixos.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const TOKEN_TESTE = 'token-de-teste-nao-secreto';
const JWT_OPERADOR = 'jwt-teste-operador';
const JWT_SEM_ESTADO = 'jwt-teste-sem-estado';
const hoje = () => new Date().toISOString().slice(0, 10); // a função usa o dia UTC

function caminhoDeno() {
  if (process.env.DENO_PATH) return process.env.DENO_PATH;
  const local = path.join(os.homedir(), '.deno', 'bin', process.platform === 'win32' ? 'deno.exe' : 'deno');
  if (fs.existsSync(local)) return local;
  return 'deno';
}

async function portaLivre() {
  return new Promise((res) => {
    const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); });
  });
}

export async function correrOraculo({ raiz }) {
  const deno = caminhoDeno();
  const porta = await portaLivre();
  const falhas = [];
  const v = {};
  const verificar = (nome, cond, detalhe = '') => { v[nome] = !!cond; if (!cond) falhas.push(`${nome} ${detalhe}`.trim()); };

  // As sondas correm com `deno run` e ficheiros temporários — NUNCA com `deno eval`,
  // que tem todas as permissões implícitas e ignora as flags (aprendido a
  // 2026-09-23: uma sonda com eval chegou a fazer um GET sem chave à Anthropic).
  const pastaSondas = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-fumo-deno-'));
  const sonda = (nome, codigo) => { const f = path.join(pastaSondas, nome); fs.writeFileSync(f, codigo); return f; };

  // ── 1. O isolamento é do runtime: com estas permissões, sair para a internet é
  // recusado ANTES de qualquer ligação. O alvo é um domínio reservado que não existe
  // (.invalid), para que nem uma falha do mecanismo contacte um servidor real; a
  // mensagem exigida (NotCapable) distingue "recusado" de "DNS falhou".
  const isol = spawnSync(deno, ['run', '--no-prompt', `--allow-net=127.0.0.1:${porta}`,
    sonda('isolamento.ts', "await fetch('https://exemplo.invalid/');\n")], { encoding: 'utf8', timeout: 60000 });
  verificar('isolamento: rede externa recusada pelo Deno', isol.status !== 0 && /NotCapable|Requires net access/i.test(isol.stderr),
    `(status ${isol.status}: ${String(isol.stderr).split('\n')[0]})`);

  // ── 2. O guarda do modo de teste: nunca liga contra o Supabase de produção.
  const moduloTeste = new URL('file:///' + path.join(raiz, 'supabase/functions/oraculo/teste/modo-teste.ts').replace(/\\/g, '/')).href;
  const guarda = spawnSync(deno, ['run', '--no-prompt', sonda('guarda.ts',
    `import { ativar } from '${moduloTeste}';
     console.log(JSON.stringify([
       ativar('fixtures', 'https://abcdefghijklmnop.supabase.co', 8787) === null,
       ativar('fixtures', 'http://127.0.0.1:54321', 8787) !== null,
       ativar(undefined, 'http://127.0.0.1:54321', 8787) === null,
       ativar('producao', 'http://localhost:54321', 8787) === null,
     ]));\n`)], { cwd: raiz, encoding: 'utf8', timeout: 60000 });
  verificar('guarda: fixtures nunca liga com SUPABASE_URL de produção', guarda.stdout.trim() === '[true,true,true,true]',
    `(${guarda.stdout.trim() || String(guarda.stderr).split('\n').slice(0, 2).join(' ')})`);

  // ── 3. A função arranca em modo de teste, só com rede local.
  const env = {
    ...process.env,
    ORACLE_TEST_MODE: 'fixtures', ORACLE_TEST_PORT: String(porta),
    SUPABASE_URL: 'http://127.0.0.1:54321',
    SUPABASE_SERVICE_ROLE_KEY: 'chave-de-teste-nao-secreta',
    ANTHROPIC_API_KEY: 'chave-de-teste-nao-secreta',
    ORACLE_TOKEN: TOKEN_TESTE,
    VAULT_TOKEN: 'token-de-teste-nao-secreto',
  };
  const permitidas = 'ORACLE_TEST_MODE,ORACLE_TEST_PORT,SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY,SUPABASE_SECRET_KEY,ANTHROPIC_API_KEY,ORACLE_TOKEN,VAULT_TOKEN';
  const proc = spawn(deno, ['run', '--no-prompt', `--allow-net=127.0.0.1:${porta}`, `--allow-env=${permitidas}`,
    'supabase/functions/oraculo/index.ts'], { cwd: raiz, env });
  let saida = '';
  proc.stdout.on('data', (d) => { saida += d; });
  proc.stderr.on('data', (d) => { saida += d; });
  const pronto = await new Promise((res) => {
    const t = setTimeout(() => res(false), 120000);
    const ver = setInterval(() => { if (/Listening on/.test(saida)) { clearTimeout(t); clearInterval(ver); res(true); } }, 200);
    proc.on('exit', () => { clearTimeout(t); clearInterval(ver); res(false); });
  });
  verificar('arranque: a função escuta em 127.0.0.1 no modo de teste', pronto, `(saída: ${saida.trim().split('\n').slice(-3).join(' | ')})`);
  if (!pronto) { proc.kill(); fs.rmSync(pastaSondas, { recursive: true, force: true }); return { verificacoes: v, falhas }; }

  const base = `http://127.0.0.1:${porta}/`;
  const pedir = async (qs, { token, jwt, corpo } = {}) => {
    const headers = { 'content-type': 'application/json' };
    if (token) headers['x-oracle-token'] = token;
    if (jwt) headers.authorization = 'Bearer ' + jwt;
    const r = await fetch(base + qs, { method: 'POST', headers, body: JSON.stringify(corpo ?? {}) });
    const texto = await r.text();
    let json = null; try { json = JSON.parse(texto); } catch { /* texto simples */ }
    return { status: r.status, texto, json };
  };
  const registo = async () => (await fetch(base + '?mode=teste-registo')).json();

  try {
    // Autenticação do cron: token errado → 403 e nenhum efeito.
    let r0 = await registo();
    let r = await pedir('?mode=radar', { token: 'errado' });
    let r1 = await registo();
    verificar('radar: token errado dá 403', r.status === 403 && r.texto === 'forbidden', `(${r.status} ${r.texto})`);
    verificar('radar: token errado não chama o modelo nem escreve', r1.anthropic.total === r0.anthropic.total && r1.bd.radar_items.inserts === r0.bd.radar_items.inserts);

    // Radar: 2 chamadas ao modelo (notícias + Vigia), dedupe por URL, limpeza > 30 dias.
    r0 = await registo();
    r = await pedir('?mode=radar', { token: TOKEN_TESTE });
    r1 = await registo();
    verificar('radar: responde 200 "ok radar"', r.status === 200 && r.texto === 'ok radar', `(${r.status} ${r.texto})`);
    verificar('radar: exatamente 2 chamadas ao modelo (radar + vigia)', r1.anthropic.porModo.radar - (r0.anthropic.porModo.radar ?? 0) === 1 && r1.anthropic.porModo.vigia - (r0.anthropic.porModo.vigia ?? 0) === 1 && r1.anthropic.total - r0.anthropic.total === 2);
    const novos = r1.bd.radar_items.inseridos.slice(r0.bd.radar_items.inseridos.length);
    const urls = novos.map((x) => x.url).sort();
    verificar('radar: insere os 3 itens novos e salta o já visto', JSON.stringify(urls) === JSON.stringify(['https://exemplo.invalid/a', 'https://exemplo.invalid/c', 'https://exemplo.invalid/vaga']), `(${JSON.stringify(urls)})`);
    verificar('radar: itens com o dia de hoje', novos.every((x) => x.d === hoje()));
    const c = novos.find((x) => x.url === 'https://exemplo.invalid/c');
    verificar('radar: alto impacto guarda impact e missão', c?.impact === 'alto' && c?.missao?.t === 'Ler o relatório sintético C');
    const vaga = novos.find((x) => x.url === 'https://exemplo.invalid/vaga');
    verificar('radar: a vaga da Vigia traz a missão Candidatar', vaga?.area === 'vaga' && vaga?.missao?.t === 'Candidatar: Vaga sintética (Organização Exemplo)');
    verificar('radar: apaga só o item com mais de 30 dias', r1.bd.radar_items.urlsApagados.length === 1 && r1.bd.radar_items.urlsApagados[0] === 'https://exemplo.invalid/antigo', `(${JSON.stringify(r1.bd.radar_items.urlsApagados)})`);

    // Relatório: 1 chamada, 1 linha em oracle_reports, escrita no vault BLOQUEADA.
    r0 = await registo();
    r = await pedir('?mode=report', { token: TOKEN_TESTE });
    r1 = await registo();
    verificar('relatório: responde 200 "ok report"', r.status === 200 && r.texto === 'ok report', `(${r.status} ${r.texto})`);
    verificar('relatório: 1 chamada ao modelo', r1.anthropic.total - r0.anthropic.total === 1 && r1.anthropic.porModo.report - (r0.anthropic.porModo.report ?? 0) === 1);
    const rel = r1.bd.oracle_reports.inseridos.slice(r0.bd.oracle_reports.inseridos.length);
    verificar('relatório: grava 1 relatório com o JSON do modelo', rel.length === 1 && rel[0].report?.resumo === '(sintético) semana de teste', `(${JSON.stringify(rel.map((x) => x.report?.resumo))})`);
    const esc = r1.github.escritasBloqueadas.slice(r0.github.escritasBloqueadas.length);
    verificar('relatório: tenta escrever Oraculo/relatorio-<hoje>.md e a escrita é bloqueada', esc.length === 1 && esc[0].caminho === `Oraculo/relatorio-${hoje()}.md`, `(${JSON.stringify(esc.map((x) => x.caminho))})`);
    verificar('relatório: a nota teria as secções certas', /# Relatório do Oráculo — \d{4}-\d{2}-\d{2}/.test(esc[0]?.conteudo ?? '') && (esc[0]?.conteudo ?? '').includes('## Resumo\n\n(sintético) semana de teste') && (esc[0]?.conteudo ?? '').includes('- **Missão sintética** — porque sim, é um teste'));
    verificar('relatório: o modelo recebeu a leitura profunda do vault (2 notas, sem ficheiros fora de Sistema/Estudo)',
      r1.anthropic.ultimoPedido.report.includes('===== Sistema/Estudo/IPCA/Cadeira-Sintetica/Aulas/2026-01-05.md =====')
      && r1.anthropic.ultimoPedido.report.includes('===== Sistema/Estudo/Temas/Tema-Sintetico/Nota.md =====')
      && !r1.anthropic.ultimoPedido.report.includes('Oraculo/relatorio-2026-01-04.md'));

    // Chat: JWT obrigatório; responde com o texto do modelo.
    r = await pedir('?mode=chat', { corpo: { messages: [{ role: 'user', content: 'olá' }] } });
    verificar('chat: sem JWT dá 401', r.status === 401, `(${r.status})`);
    r = await pedir('?mode=chat', { jwt: JWT_OPERADOR, corpo: { messages: [{ role: 'user', content: 'olá' }] } });
    verificar('chat: responde com o texto do modelo', r.status === 200 && r.json?.reply === 'Resposta sintética do Conselho.', `(${r.status} ${r.texto.slice(0, 80)})`);

    // Sussurro: uma linha.
    r = await pedir('?mode=sussurro', { jwt: JWT_OPERADOR });
    verificar('sussurro: devolve a linha do modelo', r.status === 200 && r.json?.linha === 'Linha sintética do sussurro.', `(${r.status} ${r.texto.slice(0, 80)})`);

    // vault-check: só o operador; leitura sem escrita; escrita de teste bloqueada.
    r = await pedir('?mode=vault-check', { jwt: JWT_SEM_ESTADO });
    verificar('vault-check: utilizador sem estado dá 403', r.status === 403, `(${r.status})`);
    r0 = await registo();
    r = await pedir('?mode=vault-check', { jwt: JWT_OPERADOR });
    verificar('vault-check: 2 commits e as 2 notas de estudo dos últimos 7 dias', r.status === 200 && r.json?.commits7d === 2
      && JSON.stringify(r.json?.ficheiros7d) === JSON.stringify(['Sistema/Estudo/IPCA/Cadeira-Sintetica/Aulas/2026-01-05.md', 'Sistema/Estudo/Temas/Tema-Sintetico/Nota.md']),
      `(${r.status} ${r.texto.slice(0, 200)})`);
    verificar('vault-check: leitura leve só com o que mudou em 24 h', r.json?.light24h === '- Temas/Tema-Sintetico/Nota.md · Nota sintética | Secção 1\n', `(${JSON.stringify(r.json?.light24h)})`);
    r = await pedir('?mode=vault-check&write=1', { jwt: JWT_OPERADOR });
    r1 = await registo();
    const escTeste = r1.github.escritasBloqueadas.slice(r0.github.escritasBloqueadas.length).map((x) => x.caminho);
    verificar('vault-check: a escrita de teste é bloqueada', r.status === 200 && JSON.stringify(escTeste) === JSON.stringify(['Oraculo/relatorio-teste.md']), `(${JSON.stringify(escTeste)})`);

    // report-dry: gera o relatório e não grava nada.
    r0 = await registo();
    r = await pedir('?mode=report-dry', { jwt: JWT_OPERADOR });
    r1 = await registo();
    verificar('report-dry: devolve o relatório', r.status === 200 && r.json?.dry === true && r.json?.report?.resumo === '(sintético) semana de teste', `(${r.status})`);
    verificar('report-dry: não grava na base nem no vault', r1.bd.oracle_reports.inserts === r0.bd.oracle_reports.inserts && r1.github.escritasBloqueadas.length === r0.github.escritasBloqueadas.length);

    // Nenhum pedido saiu para fora dos dados fixos.
    const fim = await registo();
    verificar('isolamento: nenhum pedido de rede fora dos dados fixos', fim.recusados.length === 0, `(${JSON.stringify(fim.recusados)})`);
    v.totais = { chamadasAoModeloSimuladas: fim.anthropic.total, leiturasGithubSimuladas: fim.github.leituras, escritasNoVaultBloqueadas: fim.github.escritasBloqueadas.length };
  } catch (e) {
    falhas.push('erro no teste: ' + String(e));
  } finally {
    proc.kill();
    fs.rmSync(pastaSondas, { recursive: true, force: true });
  }
  return { verificacoes: v, falhas };
}
