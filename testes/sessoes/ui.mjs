// Testes da interface das sessões de estudo (js/sessoes.js) num Chrome real.
//
//   node testes/sessoes/ui.mjs
//
// O Supabase é FALSO (testes/sessoes/supabase-falso.js), injetado antes de qualquer
// script da página. A rede está fechada por construção: todo o pedido que não vá
// para o servidor estático local é recusado pelo próprio Chrome (domínio Fetch do
// CDP), e o teste falha se algum passar. Perfil do Chrome temporário, dados
// sintéticos, nada toca no Supabase verdadeiro nem na conta do Daniel.
// Cobre os critérios de aceitação da Missão 34 · Fase A: a sessão sobrevive a fechar
// a app; uma sessão esquecida não dá 9 horas; nada se cria sem carregar em iniciar
// ou em adicionar.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, sleep } from '../fumo/apoio.mjs';
import { abrirComFalso as abrir, esperar, texto, clicar, clicarTexto } from '../apoio/navegador-falso.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SAIDA = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-sessoes-ui-'));
const UID = '00000000-0000-4000-8000-00000000000a';

const resultados = [];
const verificar = (nome, ok, detalhe) => resultados.push({ nome, ok: !!ok, detalhe });

// Dados sintéticos. A terceira cadeira tem um nome hostil: tem de aparecer como texto.
const HOSTIL = '<img src=x onerror="window.__xss=1">';
const CADEIRAS = [
  { id: 'c0000000-0000-4000-8000-000000000001', user_id: UID, name: 'Cadeira Sintética A', short_name: 'CSA', active: true },
  { id: 'c0000000-0000-4000-8000-000000000002', user_id: UID, name: 'Cadeira Arquivada Sintética', short_name: 'ARQ', active: false },
  { id: 'c0000000-0000-4000-8000-000000000003', user_id: UID, name: HOSTIL, short_name: null, active: true },
];
const CSA = CADEIRAS[0].id;
const antes = (ms) => new Date(Math.floor((Date.now() - ms) / 60000) * 60000).toISOString(); // alinhado ao minuto
const H = 3600e3, MIN = 60e3;
const sessao = (v) => ({ id: v.id, user_id: UID, course_id: CSA, topic_id: null, class_id: null, kind: 'revisao', source: 'cronometro', state: 'ativa',
  note: null, closed_reason: null, ended_at: null, paused_at: null, paused_seconds: 0, created_at: v.started_at, updated_at: v.started_at,
  duration_min: null, ...v });

const bd = (s) => s.avaliar(`window.__falso.bd().study_sessions`);
const escritas = (s) => s.avaliar(`window.__falso.registo.filter(r=>r.tabela==='study_sessions'&&r.op!=='select')`);

const painelPronto = (s) => esperar(s, `!!document.querySelector('#sessoes .ss-esqueleto')&&!document.getElementById('sessoes').hidden`);

async function main() {
  const site = await servirEstatico(RAIZ);
  const chrome = await lancarChrome();
  const todos = [];
  const fechar = async (s) => { if (!todos.includes(s)) todos.push(s); await s.fechar(); };
  // Um cenário que rebenta conta como falha com nome, e os seguintes correm na mesma.
  const cenario = async (nome, fn) => {
    const abertos = [];
    const abrirAqui = async (...a) => { const s = await abrir(...a); abertos.push(s); return s; };
    try { await fn(abrirAqui); } catch (e) { verificar(`${nome}: o cenário correu até ao fim`, false, String((e && e.message) || e).split('\n')[0]); }
    finally { for (const s of abertos) await fechar(s); }
  };
  try {
    // ── 1. Sem conta: o painel explica, não mede.
    await cenario("Sem conta", async (abrir) => {
      const s = await abrir(chrome, site, 'sem-conta', { comConta: false, semente: { courses: CADEIRAS } });
      await esperar(s, `!!document.querySelector('#auth-ov.show')`);
      await clicar(s, '.auth-off');
      await painelPronto(s);
      const t = await texto(s, '#sessoes');
      verificar('sem conta: o painel diz que as sessões vivem na conta', t.includes('As sessões guardam-se na tua conta'), t.slice(0, 120));
      verificar('sem conta: não há botão de iniciar', t.length > 0 && !(await s.avaliar(`!!document.querySelector('.ss-iniciar')`)));
      verificar('sem conta: há o botão Entrar', await s.avaliar(`[...document.querySelectorAll('#sessoes button')].some(b=>b.textContent.trim()==='Entrar')`));
    });

    // ── 2. Migração por aplicar: o painel não aparece e a app segue.
    await cenario("Migração por aplicar", async (abrir) => {
      const s = await abrir(chrome, site, 'por-instalar', { falha: 'inexistente' });
      await esperar(s, `(document.getElementById('greet-h')||{}).textContent`);
      await sleep(1500);
      verificar('por instalar: o painel fica escondido', await s.avaliar(`document.getElementById('sessoes').hidden===true`));
      verificar('por instalar: o resto da app desenhou', (await texto(s, '#greet-h')).length > 0);
    });

    // ── 3. O cronómetro: iniciar, pausar, retomar, fechar a app, terminar.
    await cenario("O cronómetro", async (abrir) => {
      const s = await abrir(chrome, site, 'cronometro', { semente: { courses: CADEIRAS } });
      await painelPronto(s);
      await esperar(s, `!!document.querySelector('.ss-iniciar')`);
      verificar('arranque: nenhuma sessão criada sem carregar em iniciar', (await s.avaliar(`!!document.querySelector('.ss-iniciar')`)) && (await escritas(s)).length === 0);
      const opcoes = await s.avaliar(`[...document.querySelectorAll('#ss-cadeira option')].map(o=>o.textContent)`);
      verificar('cadeiras: só as ativas, mais "Sem cadeira" em primeiro', opcoes && opcoes[0] === 'Sem cadeira' && JSON.stringify([...opcoes].sort()) === JSON.stringify(['Sem cadeira', 'Cadeira Sintética A', HOSTIL].sort()), JSON.stringify(opcoes));
      verificar('cadeiras: um nome hostil aparece como texto, não como HTML',
        (await s.avaliar(`[...document.querySelectorAll('#ss-cadeira option')].some(o=>o.textContent===${JSON.stringify(HOSTIL)})&&!document.querySelector('#sessoes img')&&window.__xss===undefined`)));

      await clicar(s, '.ss-iniciar');
      await sleep(300);
      verificar('iniciar sem tipo: pede o tipo', (await texto(s, '#ss-erro-inicio')) === 'Escolhe o tipo de sessão.');
      verificar('iniciar sem tipo: não cria nada', (await texto(s, '#ss-erro-inicio')) !== '' && (await escritas(s)).length === 0);

      await s.avaliar(`document.getElementById('ss-cadeira').value=${JSON.stringify(CSA)};document.getElementById('ss-tipo').value='revisao';true`);
      await clicar(s, '.ss-iniciar');
      await esperar(s, `!!document.getElementById('ss-relogio')`);
      const [ins] = await escritas(s);
      verificar('iniciar: um insert, com a hora deixada ao servidor', ins && ins.op === 'insert' && !('started_at' in ins.valor) && ins.valor.source === 'cronometro' && ins.valor.state === 'ativa', JSON.stringify(ins));
      let linhas = await bd(s);
      verificar('iniciar: uma sessão ativa, da cadeira e do tipo escolhidos', linhas.length === 1 && linhas[0].state === 'ativa' && linhas[0].course_id === CSA && linhas[0].kind === 'revisao');
      verificar('iniciar: o painel marca a sessão viva', await s.avaliar(`document.getElementById('sessoes').classList.contains('ss-viva')`));
      const r1 = await texto(s, '#ss-relogio');
      await sleep(2200);
      const r2 = await texto(s, '#ss-relogio');
      verificar('relógio: avança sozinho', /^0:00:0\d$/.test(r1) && r2 > r1, `${r1} → ${r2}`);
      verificar('meta: diz a cadeira, o tipo e o fecho automático', /CSA · Revisão · desde as \d\d:\d\d · fecho automático às \d\d:\d\d/.test(await texto(s, '.ss-meta')), await texto(s, '.ss-meta'));

      await clicarTexto(s, '.ss-ativa', 'Pausar');
      await esperar(s, `document.getElementById('sessoes').classList.contains('ss-pausa')`);
      linhas = await bd(s);
      verificar('pausar: o servidor regista o início da pausa', !!linhas[0].paused_at);
      const p1 = await texto(s, '#ss-relogio'); await sleep(1600); const p2 = await texto(s, '#ss-relogio');
      verificar('pausar: o relógio para', p1 === p2, `${p1} / ${p2}`);
      verificar('pausar: aparece Retomar', await s.avaliar(`[...document.querySelectorAll('.ss-ativa button')].some(b=>b.textContent.trim()==='Retomar')`));
      await clicarTexto(s, '.ss-ativa', 'Retomar');
      await esperar(s, `document.getElementById('sessoes').classList.contains('ss-viva')`);
      linhas = await bd(s);
      verificar('retomar: a pausa fica somada (≥ 1 s)', !linhas[0].paused_at && linhas[0].paused_seconds >= 1, `paused_seconds=${linhas[0].paused_seconds}`);

      // Fechar a app a meio: recarregar a página. A "base" persiste; a sessão continua.
      const antesDeFechar = await texto(s, '#ss-relogio');
      await s.enviar('Page.reload', {});
      await painelPronto(s);
      await esperar(s, `!!document.getElementById('ss-relogio')`);
      await sleep(1200);
      const depois = await texto(s, '#ss-relogio');
      verificar('fechar a app: a sessão continua ao voltar', depois >= antesDeFechar && (await bd(s))[0].state === 'ativa', `${antesDeFechar} → ${depois}`);
      verificar('fechar a app: nenhuma sessão nova criada', (await escritas(s)).length === 0);

      await clicarTexto(s, '.ss-ativa', 'Terminar');
      await esperar(s, `!!document.querySelector('#ss-recentes .ss-linha')`);
      linhas = await bd(s);
      verificar('terminar: a sessão fica terminada, com duração calculada', linhas[0].state === 'terminada' && linhas[0].duration_min === 0 && !!linhas[0].ended_at);
      verificar('terminar: aparece nos últimos 7 dias como "Hoje"', (await texto(s, '#ss-recentes .ss-dia')) === 'Hoje');
      verificar('terminar: o aviso diz o que aconteceu', (await texto(s, '#tt')) === 'Sessão terminada', await texto(s, '#tt'));
      const ops = (await escritas(s)).map((e) => e.op);
      // (o registo do falso recomeça ao recarregar: aqui só estão as escritas depois de "fechar a app")
      verificar('terminar: o cliente nunca escreveu horas nem duração (só o servidor)', ops.length === 0, JSON.stringify(ops));
      verificar('terminar: volta o botão de iniciar', await s.avaliar(`!!document.querySelector('.ss-iniciar')`));
      await s.captura(path.join(SAIDA, 'cronometro.png'));
    });

    // ── 4. O aviso das 2 h — e as pausas não contam para ele.
    await cenario("Aviso das 2 h", async (abrir) => {
      const s = await abrir(chrome, site, 'aviso-2h', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000001', started_at: antes(2 * H + 2 * MIN) })] } });
      await painelPronto(s);
      const aviso = await esperar(s, `(document.querySelector('.ss-aviso')||{}).innerText||''`);
      verificar('2 h: pergunta se ainda estás a estudar', String(aviso).includes('Ainda estás a estudar?'), aviso);
      const clicou = await clicarTexto(s, '.ss-aviso', 'Continuo');
      await sleep(400);
      verificar('2 h: "Continuo" cala o aviso', clicou && !(await s.avaliar(`!!document.querySelector('.ss-aviso')`)));
      await s.enviar('Page.reload', {});
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-relogio')`); await sleep(1500);
      verificar('2 h: o aviso não volta ao recarregar', (await s.avaliar(`!!document.getElementById('ss-relogio')`)) && !(await s.avaliar(`!!document.querySelector('.ss-aviso')`)));
    });
    await cenario('Aviso das 2 h com pausas', async (abrir) => {
      const s = await abrir(chrome, site, 'aviso-pausas', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000002', started_at: antes(2 * H + 5 * MIN), paused_seconds: 600 })] } });
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-relogio')`); await sleep(1500);
      verificar('2 h: 2 h 05 de relógio com 10 min de pausa ainda não avisa', /^1:5\d:\d\d$/.test(await texto(s, '#ss-relogio')) && !(await s.avaliar(`!!document.querySelector('.ss-aviso')`)), await texto(s, '#ss-relogio'));
    });

    // ── 5. A sessão esquecida: fecha no limite, fica por confirmar; aceitar e corrigir.
    await cenario("A sessão esquecida", async (abrir) => {
      const esquecida = sessao({ id: 's0000000-0000-4000-8000-000000000003', started_at: antes(9 * H) });
      const outra = sessao({ id: 's0000000-0000-4000-8000-000000000004', started_at: antes(9 * H + 30 * MIN) });
      const s = await abrir(chrome, site, 'esquecida', { semente: { courses: CADEIRAS, study_sessions: [esquecida] } });
      await painelPronto(s);
      await esperar(s, `!!document.querySelector('.ss-pend')`);
      let [l] = await bd(s);
      verificar('esquecida (9 h): fechada no limite, por confirmar', l.state === 'por_confirmar' && l.duration_min <= 240 && !!l.closed_reason, `${l.state} ${l.duration_min} min ${l.closed_reason}`);
      const motivo = l.closed_reason === 'meia_noite' ? 'à meia-noite' : 'ao fim de 4 horas';
      verificar('esquecida: o painel diz porque fechou', (await texto(s, '.ss-pend .ss-l2')).includes(`O Sistema fechou-a ${motivo}.`), await texto(s, '.ss-pend .ss-l2'));
      verificar('esquecida: nenhuma sessão criada sem carregar em nada', l.state === 'por_confirmar' && (await escritas(s)).length === 0);
      verificar('esquecida: não há relógio a correr', (await s.avaliar(`!!document.querySelector('.ss-pend')&&!document.getElementById('ss-relogio')`)));

      // Corrigir: parou 90 min depois de começar. A hora de início fica intacta.
      await clicarTexto(s, '.ss-pend', 'Corrigir');
      await esperar(s, `!!document.getElementById('ss-e-fim')`);
      const inicioNoForm = await s.avaliar(`document.getElementById('ss-e-ini').value`);
      verificar('corrigir: o formulário traz a hora de Lisboa', inicioNoForm === (await s.avaliar(`window.__falso.lisboa(${JSON.stringify(l.started_at)})`)), inicioNoForm);
      const fim90 = await s.avaliar(`window.__falso.lisboa(new Date(Date.parse(${JSON.stringify(l.started_at)})+90*60e3).toISOString())`);
      await s.avaliar(`document.getElementById('ss-e-fim').value=${JSON.stringify(fim90)};true`);
      await clicarTexto(s, '.ss-edicao', 'Guardar e aceitar');
      await esperar(s, `!document.getElementById('ss-e-fim')`);
      [l] = await bd(s);
      const patch = (await escritas(s)).find((e) => e.op === 'update');
      verificar('corrigir: fica terminada, manual, com 90 min', l.state === 'terminada' && l.source === 'manual' && l.duration_min === 90, `${l.state} ${l.source} ${l.duration_min}`);
      verificar('corrigir: só a hora mudada foi enviada', patch && 'ended_at' in patch.valor && !('started_at' in patch.valor), JSON.stringify(patch && patch.valor));
      verificar('corrigir: sai da lista por confirmar e entra nos recentes', !(await s.avaliar(`!!document.querySelector('.ss-pend')`)) && (await texto(s, '#ss-recentes .ss-dur')) === '1 h 30 min', await texto(s, '#ss-recentes .ss-dur'));

      // Aceitar: outra esquecida, metida na "base" como se viesse de outro dispositivo.
      await s.avaliar(`(()=>{const F=window.__falso;F.bd().study_sessions.push(${JSON.stringify(outra)});F.guardar();return true})()`);
      await s.avaliar(`Sessoes.atualizar()`);
      await esperar(s, `!!document.querySelector('.ss-pend')`);
      await clicarTexto(s, '.ss-pend', 'Aceitar');
      await esperar(s, `!document.querySelector('.ss-pend')`);
      const aceite = (await bd(s)).find((x) => x.id === outra.id);
      verificar('aceitar: fica terminada com a duração até ao limite', aceite.state === 'terminada' && aceite.duration_min <= 240 && aceite.source === 'cronometro', `${aceite.state} ${aceite.duration_min} ${aceite.source}`);
    });

    // ── 6. Descartar pede confirmação e não apaga a linha.
    await cenario("Descartar", async (abrir) => {
      const s = await abrir(chrome, site, 'descartar', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000005', started_at: antes(6 * H) })] } });
      await painelPronto(s); await esperar(s, `!!document.querySelector('.ss-pend')`);
      await clicarTexto(s, '.ss-pend', 'Descartar');
      await sleep(300);
      verificar('descartar: pede confirmação primeiro', (await texto(s, '.ss-conf')).includes('Descartar esta sessão?') && (await bd(s))[0].state === 'por_confirmar');
      await clicarTexto(s, '.ss-conf', 'Descartar');
      await esperar(s, `!document.querySelector('.ss-pend')`);
      const [l] = await bd(s);
      verificar('descartar: a linha fica, marcada descartada, fora das listas', l && l.state === 'descartada' && !(await s.avaliar(`!!document.querySelector('#ss-recentes .ss-linha')`)));
    });

    // ── 7. Sessão manual: validação, sobreposição, editar, apagar.
    await cenario("Sessão manual", async (abrir) => {
      const existente = sessao({ id: 's0000000-0000-4000-8000-000000000006', started_at: antes(5 * H), ended_at: antes(4 * H), state: 'terminada', duration_min: 60 });
      const s = await abrir(chrome, site, 'manual', { semente: { courses: CADEIRAS, study_sessions: [existente] } });
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-m-ini')`);
      // (ms negativo = no futuro; os parênteses evitam o "Date.now()--1800000")
      const lx = (ms) => s.avaliar(`window.__falso.lisboa(new Date(Math.floor((Date.now()-(${ms}))/60000)*60000).toISOString())`);
      const preencher = async (ini, fim, tipo) => s.avaliar(`(()=>{document.querySelector('.ss-manual').open=true;
        document.getElementById('ss-m-ini').value=${JSON.stringify(ini)};document.getElementById('ss-m-fim').value=${JSON.stringify(fim)};
        document.getElementById('ss-m-tipo').value=${JSON.stringify(tipo)};document.getElementById('ss-m-cad').value=${JSON.stringify(CSA)};
        document.getElementById('ss-m-nota').value='Nota sintética';return true})()`);
      const guardar = async () => { await clicarTexto(s, '.ss-manual', 'Guardar sessão'); await sleep(500); };
      const inserts = async () => (await escritas(s)).filter((e) => e.op === 'insert').length;

      await preencher(await lx(3 * H), await lx(-30 * MIN), 'leitura'); await guardar();
      verificar('manual: recusa o futuro', (await texto(s, '#ss-m-erro')) === 'O Sistema não regista o futuro.' && (await inserts()) === 0, await texto(s, '#ss-m-erro'));
      await preencher(await lx(2 * H), await lx(3 * H), 'leitura'); await guardar();
      verificar('manual: recusa o fim antes do início', (await texto(s, '#ss-m-erro')) === 'O fim tem de ser depois do início.');
      await preencher(await lx(3 * H), await lx(2 * H), ''); await guardar();
      verificar('manual: pede o tipo', (await texto(s, '#ss-m-erro')) === 'Escolhe o tipo de sessão.');
      await preencher(await lx(4 * H + 30 * MIN), await lx(3 * H + 30 * MIN), 'leitura'); await guardar();
      verificar('manual: recusa sobrepor outra sessão (o mesmo tempo não conta duas vezes)',
        (await texto(s, '#ss-m-erro')).includes('o mesmo tempo não conta duas vezes') && (await inserts()) === 0, await texto(s, '#ss-m-erro'));
      verificar('manual: o formulário guarda o que foi escrito depois do erro', (await s.avaliar(`document.getElementById('ss-m-nota').value`)) === 'Nota sintética');

      await preencher(await lx(3 * H), await lx(2 * H), 'leitura'); await guardar();
      await esperar(s, `document.querySelectorAll('#ss-recentes .ss-linha').length===2`);
      const nova = (await bd(s)).find((x) => x.source === 'manual');
      verificar('manual: guardada como manual, terminada, 60 min', nova && nova.state === 'terminada' && nova.duration_min === 60 && nova.note === 'Nota sintética');
      verificar('manual: a lista marca-a como manual', (await texto(s, '#ss-recentes')).includes('manual'));

      // Editar só o tipo: as horas não se enviam e a origem não muda.
      await s.avaliar(`document.querySelector('#ss-recentes .ss-linha[data-id="${nova.id}"] .ss-op').click();true`);
      await esperar(s, `!!document.getElementById('ss-e-tipo')`);
      await s.avaliar(`document.getElementById('ss-e-tipo').value='exercicios';true`);
      await clicarTexto(s, '.ss-edicao', 'Guardar');
      await esperar(s, `!document.getElementById('ss-e-tipo')`);
      const upd = (await escritas(s)).filter((e) => e.op === 'update').pop();
      const editada = (await bd(s)).find((x) => x.id === nova.id);
      verificar('editar o tipo: não envia horas', upd && !('started_at' in upd.valor) && !('ended_at' in upd.valor), JSON.stringify(upd && upd.valor));
      verificar('editar o tipo: muda o tipo e mais nada', editada.kind === 'exercicios' && editada.duration_min === 60 && editada.source === 'manual');

      // Editar a cronometrada por cima da manual: sobreposição recusada, o que foi escrito fica.
      await s.avaliar(`document.querySelector('#ss-recentes .ss-linha[data-id="${existente.id}"] .ss-op').click();true`);
      await esperar(s, `!!document.getElementById('ss-e-fim')`);
      await s.avaliar(`document.getElementById('ss-e-fim').value=${JSON.stringify(await lx(2 * H + 30 * MIN))};true`);
      await clicarTexto(s, '.ss-edicao', 'Guardar');
      await sleep(600);
      verificar('editar: recusa sobrepor outra sessão', (await texto(s, '#ss-e-erro')).includes('o mesmo tempo não conta duas vezes'), await texto(s, '#ss-e-erro'));
      verificar('editar: o valor escrito fica no formulário', (await s.avaliar(`document.getElementById('ss-e-fim').value`)) === (await lx(2 * H + 30 * MIN)));
      await clicarTexto(s, '.ss-edicao', 'Cancelar');
      await sleep(300);

      // Apagar: pede confirmação; depois a linha sai da base.
      await s.avaliar(`document.querySelector('#ss-recentes .ss-linha[data-id="${nova.id}"] .ss-op-x').click();true`);
      await sleep(300);
      verificar('apagar: pede confirmação primeiro', (await texto(s, '.ss-conf')).includes('Apagar esta sessão?') && (await bd(s)).some((x) => x.id === nova.id));
      await clicarTexto(s, '.ss-conf', 'Apagar');
      await esperar(s, `document.querySelectorAll('#ss-recentes .ss-linha').length===1`);
      const restam = await bd(s);
      verificar('apagar: sai essa linha e só essa', !restam.some((x) => x.id === nova.id) && restam.some((x) => x.id === existente.id), `${restam.length} na base`);
      await s.captura(path.join(SAIDA, 'manual.png'));
    });

    // ── 8. Outro dispositivo começou uma sessão: a base recusa a segunda.
    await cenario("Outro dispositivo começou uma sessão", async (abrir) => {
      const s = await abrir(chrome, site, 'conflito', { semente: { courses: CADEIRAS } });
      await painelPronto(s); await esperar(s, `!!document.querySelector('.ss-iniciar')`);
      await s.avaliar(`(()=>{const F=window.__falso;F.bd().study_sessions.push(F.novaSessao({kind:'aula',source:'cronometro',state:'ativa'}));F.guardar();return true})()`);
      await s.avaliar(`document.getElementById('ss-tipo').value='revisao';true`);
      await clicar(s, '.ss-iniciar');
      await esperar(s, `!!document.getElementById('ss-relogio')`);
      verificar('conflito: explica que já há uma sessão a decorrer', (await texto(s, '#tt')) === 'Já há uma sessão a decorrer', await texto(s, '#tt'));
      verificar('conflito: mostra a sessão do outro dispositivo, só uma ativa', (await bd(s)).filter((x) => x.state === 'ativa').length === 1 && (await texto(s, '.ss-meta')).startsWith('Aula'));
    });

    // ── 9. Sem ligação a meio: o que está no ecrã fica, com um aviso; nada finge sucesso.
    await cenario("Sem ligação a meio", async (abrir) => {
      const s = await abrir(chrome, site, 'sem-ligacao', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000007', started_at: antes(3 * H), ended_at: antes(2 * H), state: 'terminada', duration_min: 60 })] } });
      await painelPronto(s); await esperar(s, `!!document.querySelector('#ss-recentes .ss-linha')`);
      await s.avaliar(`window.__falso.ctl.falha='rede';Sessoes.atualizar()`);
      await sleep(300);
      verificar('sem ligação: aparece o aviso', (await texto(s, '#ss-rede')).startsWith('Sem ligação à base'));
      verificar('sem ligação: a lista que estava no ecrã fica', await s.avaliar(`!!document.querySelector('#ss-recentes .ss-linha')`));
      await s.avaliar(`document.getElementById('ss-tipo').value='revisao';true`);
      await clicar(s, '.ss-iniciar');
      await sleep(400);
      verificar('sem ligação: iniciar diz que não chegou à base', (await texto(s, '#tt')) === 'Sem ligação' && !(await s.avaliar(`!!document.getElementById('ss-relogio')`)), await texto(s, '#tt'));
      const avisoAntes = await texto(s, '#ss-rede');
      await s.avaliar(`window.__falso.ctl.falha=null;Sessoes.atualizar()`);
      await sleep(300);
      verificar('sem ligação: o aviso sai quando a ligação volta', avisoAntes !== '' && (await texto(s, '#ss-rede')) === '');
    });

    // ── 10. Telemóvel (390×844) e movimento reduzido.
    await cenario("Telemóvel", async (abrir) => {
      const s = await abrir(chrome, site, 'movel', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000008', started_at: antes(40 * MIN) }),
          sessao({ id: 's0000000-0000-4000-8000-000000000009', started_at: antes(26 * H), ended_at: antes(25 * H), state: 'terminada', duration_min: 60, note: 'Uma nota sintética comprida o bastante para testar a quebra de linha no telemóvel' })] } }, { movel: true });
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-relogio')`); await sleep(1200);
      const fora = await s.avaliar(`(()=>{const W=document.documentElement.clientWidth;let pior=null;
        for(const el of document.querySelectorAll('#sessoes *')){const r=el.getBoundingClientRect();if(r.width&&r.right>W+0.5&&(!pior||r.right>pior.d))pior={t:el.tagName,c:String(el.className).slice(0,30),d:Math.round(r.right)}}return pior})()`);
      verificar('telemóvel: nada do painel sai do ecrã', (await s.avaliar(`!!document.getElementById('ss-relogio')&&!!document.querySelector('#ss-recentes .ss-linha')`)) && fora === null, JSON.stringify(fora));
      await s.captura(path.join(SAIDA, 'movel.png'));
    });
    await cenario('Movimento reduzido', async (abrir) => {
      const s = await abrir(chrome, site, 'reduzido', { semente: { courses: CADEIRAS,
        study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000010', started_at: antes(10 * MIN) })] } }, { reduzido: true });
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-relogio')`);
      const anim = await s.avaliar(`getComputedStyle(document.getElementById('sessoes'),'::before').animationName`);
      verificar('movimento reduzido: o traço da sessão viva não respira', anim === 'none', anim);
    });
    // ── 11. O relógio não treme: a largura fica igual enquanto os segundos passam
    // (de 1:11:07 a 1:11:13 passam 0, 1, 7, 8, 9 — os algarismos de larguras mais diferentes).
    await cenario('Relógio estável', async (abrir) => {
      const inicio = new Date(Date.now() - (H + 11 * MIN + 6500)).toISOString();
      const s = await abrir(chrome, site, 'relogio', { semente: { courses: CADEIRAS, study_sessions: [sessao({ id: 's0000000-0000-4000-8000-000000000011', started_at: inicio })] } });
      await painelPronto(s); await esperar(s, `!!document.getElementById('ss-relogio')`);
      const amostras = [];
      for (let i = 0; i < 12; i++) {
        amostras.push(await s.avaliar(`(()=>{const el=document.getElementById('ss-relogio'),r=document.createRange();r.selectNodeContents(el);return [el.innerText,Math.round(r.getBoundingClientRect().width*10)/10]})()`));
        await sleep(500);
      }
      const larguras = new Set(amostras.map((a) => a[1]));
      const textos = new Set(amostras.map((a) => a[0]));
      verificar('relógio: a largura não muda com os algarismos (não treme)', textos.size >= 4 && larguras.size === 1, amostras.map((a) => a.join(' ')).join(' | '));
      verificar('relógio: o leitor de ecrã lê a hora inteira', /^\d+:\d\d:\d\d$/.test(await s.avaliar(`document.getElementById('ss-relogio').getAttribute('aria-label')`)));
    });
  } finally {
    await chrome.fechar();
    site.fechar();
  }

  // ── A rede esteve mesmo fechada, e não houve exceções.
  const recusados = todos.flatMap((s) => s.recusados);
  const hosts = [...new Set(recusados.map((u) => { try { return new URL(u).host; } catch { return u; } }))].sort();
  verificar('rede (calibração): o intercetor viu e recusou o CDN do supabase-js', hosts.includes('cdn.jsdelivr.net'), `recusados: ${hosts.join(', ') || 'nenhum'}`);
  const fugas = todos.flatMap((s) => s.respostasDeFora);
  verificar('rede: nenhuma resposta veio de fora do computador', fugas.length === 0, fugas.slice(0, 5).join(' | '));
  const excecoes = todos.flatMap((s) => s.eventos.filter((e) => e.tipo === 'excecao').map((e) => `${s.fase}: ${e.texto.split('\n')[0]}`));
  verificar('consola: nenhuma exceção de JavaScript', excecoes.length === 0, excecoes.join(' | '));
  const falhas = resultados.filter((r) => !r.ok);
  for (const r of resultados) console.log(`${r.ok ? '  ok ' : '  FALHA'} ${r.nome}${!r.ok && r.detalhe ? `  → ${r.detalhe}` : ''}`);
  console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações · capturas em ${SAIDA}`);
  console.log(resultados.find((r) => r.nome.startsWith('rede (calibração)')).detalhe);
  process.exit(falhas.length ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(2); });
