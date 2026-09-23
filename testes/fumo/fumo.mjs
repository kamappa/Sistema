// Teste de fumo do Sistema — Lote 0 (2026-09-23).
//
//   node testes/fumo/fumo.mjs                        # corre tudo e compara com a linha de base
//   node testes/fumo/fumo.mjs --so-frontend          # só o browser
//   node testes/fumo/fumo.mjs --so-oraculo           # só a Edge Function, localmente
//   node testes/fumo/fumo.mjs --gravar-linha-de-base # grava o resultado como nova linha de base
//
// Código de saída 0 = tudo verde; 1 = alguma verificação falhou ou apareceu um erro
// novo na consola. Capturas e registos brutos vão para a pasta temporária do
// sistema — nunca para o repositório, que é público.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assinatura } from './apoio.mjs';
import { correrFrontend } from './frontend.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.resolve(aqui, '..', '..');
const FICHEIRO_BASE = path.join(aqui, 'linha-de-base.json');
const args = new Set(process.argv.slice(2));
const gravar = args.has('--gravar-linha-de-base');
const soFrontend = args.has('--so-frontend');
const soOraculo = args.has('--so-oraculo');

const pastaSaida = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-fumo-'));
const base = fs.existsSync(FICHEIRO_BASE) ? JSON.parse(fs.readFileSync(FICHEIRO_BASE, 'utf8')) : null;
const falhas = [];
const falha = (msg) => falhas.push(msg);
const zonasTodasComConteudo = (z) => z && Object.values(z).every((n) => typeof n === 'number' && n > 0);

// O contrato do frontend: cada linha diz que avaria apanha.
function verificarFrontend(v) {
  const c = v.calibracao;
  if (!(c.consolaErro && c.consolaAviso && c.excecao && c.http404)) falha('calibração: o instrumento não apanhou as sondas — os zeros não valem nada');
  if (!v.desktop.ecraEntrada) falha('desktop: sem sessão, o ecrã de entrada devia aparecer');
  if (!v.desktop.semSessao) falha('desktop: há uma sessão Supabase no perfil de teste — o teste podia escrever na conta real');
  if (!zonasTodasComConteudo(v.desktop.zonas)) falha('desktop: um ecrã principal não rendeu: ' + JSON.stringify(v.desktop.zonas));
  if (v.desktop.foraDoEcra) falha('desktop: conteúdo em fluxo mais largo do que o ecrã: ' + JSON.stringify(v.desktop.foraDoEcra));
  if (!v.desktop.arranqueCorreu) falha('desktop: a sequência de arranque não correu');
  if (!v.estacao.abre || v.estacao.planetas !== 7) falha('estação: o mapa não abriu com 7 planetas: ' + JSON.stringify(v.estacao));
  if (!v.estacao.fechaComEsc) falha('estação: Esc não fecha o mapa');
  if (!v.mobile.ecraEntrada || !zonasTodasComConteudo(v.mobile.zonas)) falha('mobile: entrada ou ecrãs principais: ' + JSON.stringify(v.mobile));
  if (v.mobile.foraDoEcra) falha('mobile: conteúdo em fluxo mais largo do que o ecrã (ficaria cortado): ' + JSON.stringify(v.mobile.foraDoEcra));
  if (!v.mobile.botaoEstacao) falha('mobile: sem botão da estação (a única entrada por toque)');
  if (!zonasTodasComConteudo(v.movimentoReduzido.zonas)) falha('movimento reduzido: ecrãs principais');
  if (!v.movimentoReduzido.arranqueSaltado) falha('movimento reduzido: a sequência de arranque correu — reduced motion não é respeitado');
  if (!v.semSupabase.ecraEntrada || !zonasTodasComConteudo(v.semSupabase.zonas)) falha('sem Supabase: a app não arrancou offline');
  // Sem o CDN o comportamento fica registado na linha de base e compara-se com ela —
  // só no que é estável (o comprimento do texto do painel de revisão varia de corrida
  // para corrida, porque as perguntas do dia mudam).
  if (base?.frontend?.verificacoes?.semCdn) {
    const resumo = (x) => JSON.stringify({ ecraEntrada: x.ecraEntrada, todasComConteudo: !!zonasTodasComConteudo(x.zonas) });
    const antes = resumo(base.frontend.verificacoes.semCdn), agora = resumo(v.semCdn);
    if (agora !== antes) falha(`sem CDN: mudou em relação à linha de base (${antes} → ${agora})`);
  }
}

function errosNovos(eventos, conhecidas) {
  const graves = eventos.filter((e) => ['error', 'warning'].includes(e.nivel) || e.tipo === 'excecao' || e.tipo === 'http' || e.tipo === 'rede');
  const vistas = new Map();
  for (const e of graves) { const a = assinatura(e); if (!vistas.has(a)) vistas.set(a, e); }
  const novas = [...vistas.keys()].filter((a) => !conhecidas.has(a));
  return { todas: [...vistas.keys()].sort(), novas };
}

const carimbo = () => ({ gerada: new Date().toISOString().slice(0, 10), base: execFileSync('git', ['-C', raiz, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim() });
const resultado = {};

if (!soOraculo) {
  console.log('▶ frontend (Chrome sem cabeça, perfil temporário)…');
  const fe = await correrFrontend({ raiz, pastaSaida });
  verificarFrontend(fe.verificacoes);
  const conhecidas = new Set(base?.frontend?.assinaturasDeErro ?? []);
  const erros = errosNovos(fe.eventos, conhecidas);
  if (!gravar) for (const a of erros.novas) falha('erro novo na consola/rede: ' + a);
  resultado.frontend = { ...carimbo(), verificacoes: fe.verificacoes, assinaturasDeErro: erros.todas };
  fs.writeFileSync(path.join(pastaSaida, 'eventos-frontend.json'), JSON.stringify(fe.eventos, null, 2));
  console.log(JSON.stringify(fe.verificacoes, null, 1));
  console.log(`  assinaturas de erro: ${erros.todas.length} (novas face à linha de base: ${gravar ? 'n/a' : erros.novas.length})`);
  for (const a of erros.todas) console.log('   · ' + a);
}

if (!soFrontend) {
  const { correrOraculo } = await import('./oraculo.mjs');
  console.log('▶ oráculo (Deno, modo de teste com dados fixos, rede só para 127.0.0.1)…');
  const or = await correrOraculo({ raiz });
  for (const f of or.falhas) falha('oráculo: ' + f);
  resultado.oraculo = { ...carimbo(), verificacoes: or.verificacoes };
  console.log(JSON.stringify(or.verificacoes, null, 1));
}

console.log(`\nregistos e capturas: ${pastaSaida}`);
if (gravar) {
  const anterior = base ?? {};
  const nova = { ...anterior, ...resultado };
  fs.writeFileSync(FICHEIRO_BASE, JSON.stringify(nova, null, 2) + '\n');
  console.log(`linha de base gravada em ${path.relative(raiz, FICHEIRO_BASE)}`);
}
if (falhas.length) {
  console.log(`\n✗ ${falhas.length} falha(s):`);
  for (const f of falhas) console.log('  - ' + f);
  process.exit(1);
}
console.log('\n✓ tudo verde');
