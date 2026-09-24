// Testes da lógica pura das sessões de estudo (js/sessoes-logica.js) — sem browser.
//
//   node testes/sessoes/logica.test.mjs
//
// Valores esperados literais, derivados à mão. Os limites repetem os casos do SQL
// (testes/bd/bd.mjs): o cliente mostra a hora de fecho, e tem de dizer a mesma que a
// base aplica — incluindo nas mudanças de hora de 25/10/2026 e 28/03/2027.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const L = require('../../js/sessoes-logica.js');

const resultados = [];
const igual = (nome, obtido, esperado) => resultados.push({ nome, ok: JSON.stringify(obtido) === JSON.stringify(esperado), obtido, esperado });
const iso = (d) => d.toISOString();

// ── fuso de Lisboa
igual('partes: 20:10 UTC em setembro são 21:10 em Lisboa', L.partesLisboa(new Date('2026-09-23T20:10:00Z')), { ano: 2026, mes: 9, dia: 23, hora: 21, minuto: 10 });
igual('partes: 20:10 UTC em dezembro são 20:10 em Lisboa', L.partesLisboa(new Date('2026-12-01T20:10:00Z')), { ano: 2026, mes: 12, dia: 1, hora: 20, minuto: 10 });
igual('para instante: 21:10 de setembro em Lisboa', iso(L.lisboaParaInstante('2026-09-23T21:10')), '2026-09-23T20:10:00.000Z');
igual('para instante: 21:10 de dezembro em Lisboa', iso(L.lisboaParaInstante('2026-12-01T21:10')), '2026-12-01T21:10:00.000Z');
igual('para instante: 00:30 de 25/10/2026 ainda é hora de verão', iso(L.lisboaParaInstante('2026-10-25T00:30')), '2026-10-24T23:30:00.000Z');
igual('para instante: 01:30 de 28/03/2027 não existe — avança para as 02:30 de verão', iso(L.lisboaParaInstante('2027-03-28T01:30')), '2027-03-28T01:30:00.000Z');
igual('para instante: 01:30 de 25/10/2026 repete-se — lê-se a de inverno, sempre a mesma', iso(L.lisboaParaInstante('2026-10-25T01:30')), '2026-10-25T01:30:00.000Z');
igual('para input: um instante vira a hora de Lisboa', L.instanteParaLisboaInput(new Date('2026-09-23T20:10:00Z')), '2026-09-23T21:10');
igual('hora: 21:10', L.horaLisboa(new Date('2026-09-23T20:10:00Z')), '21:10');

// ── limite: 4 h ou meia-noite de Lisboa (os mesmos casos do SQL)
igual('limite: 23:30 de 24/10/2026 → meia-noite', iso(L.limiteSessao(new Date('2026-10-24T22:30:00Z'))), '2026-10-24T23:00:00.000Z');
igual('limite: 00:30 de 25/10/2026 → 4 h reais (hora repetida)', iso(L.limiteSessao(new Date('2026-10-24T23:30:00Z'))), '2026-10-25T03:30:00.000Z');
igual('limite: 23:00 de 27/03/2027 → meia-noite', iso(L.limiteSessao(new Date('2027-03-27T23:00:00Z'))), '2027-03-28T00:00:00.000Z');
igual('limite: 00:30 de 28/03/2027 → 4 h reais (hora saltada)', iso(L.limiteSessao(new Date('2027-03-28T00:30:00Z'))), '2027-03-28T04:30:00.000Z');
igual('limite: 10:00 de um dia normal → 14:00', iso(L.limiteSessao(new Date('2026-09-23T09:00:00Z'))), '2026-09-23T13:00:00.000Z');

// ── tempo efetivo: nunca conta pausas
const base = { started_at: '2026-09-23T10:00:00Z', paused_seconds: 600, paused_at: null, ended_at: null };
const agora = new Date('2026-09-23T11:30:00Z');
igual('efetivos: 90 min menos 10 de pausa = 4800 s', L.segundosEfetivos(base, agora), 4800);
igual('efetivos: com uma pausa em curso há 10 min = 4200 s', L.segundosEfetivos({ ...base, paused_at: '2026-09-23T11:20:00Z' }, agora), 4200);
igual('efetivos: terminada conta até ao fim, não até agora', L.segundosEfetivos({ ...base, paused_seconds: 300, ended_at: '2026-09-23T11:00:00Z' }, agora), 3300);
igual('efetivos: nunca negativo', L.segundosEfetivos({ ...base, paused_seconds: 99999 }, agora), 0);

// ── formatação
igual('relógio: 4200 s', L.formatarRelogio(4200), '1:10:00');
igual('relógio: 59 s', L.formatarRelogio(59), '0:00:59');
igual('relógio: 10 h', L.formatarRelogio(36000), '10:00:00');
igual('duração: 85 min', L.formatarDuracao(85), '1 h 25 min');
igual('duração: 45 min', L.formatarDuracao(45), '45 min');
igual('duração: 60 min', L.formatarDuracao(60), '1 h');
igual('duração: 0 min', L.formatarDuracao(0), '0 min');

// ── aviso das 2 horas
igual('aviso: 7199 s ainda não', L.precisaAviso2h({ ...base, paused_seconds: 0 }, new Date(Date.parse(base.started_at) + 7199e3)), false);
igual('aviso: às 2 h certas sim', L.precisaAviso2h({ ...base, paused_seconds: 0 }, new Date(Date.parse(base.started_at) + 7200e3)), true);
igual('aviso: pausas não contam para as 2 h', L.precisaAviso2h({ ...base, paused_seconds: 600 }, new Date(Date.parse(base.started_at) + 7200e3)), false);

// ── sessão manual
const noite = new Date('2026-09-23T22:00:00Z');
igual('manual: sem horas', L.validarManual('', '', noite), { ok: false, erro: 'Indica o início e o fim.' });
igual('manual: fim antes do início', L.validarManual('2026-09-23T21:00', '2026-09-23T20:00', noite), { ok: false, erro: 'O fim tem de ser depois do início.' });
igual('manual: no futuro', L.validarManual('2026-09-23T22:00', '2026-09-23T23:30', noite), { ok: false, erro: 'O Sistema não regista o futuro.' });
igual('manual: acaba agora (o minuto corrente) — aceite', L.validarManual('2026-09-23T22:30', '2026-09-23T23:00', noite).ok, true);
igual('manual: acaba daqui a 2 minutos — recusada', L.validarManual('2026-09-23T22:30', '2026-09-23T23:02', noite), { ok: false, erro: 'O Sistema não regista o futuro.' });
const valida = L.validarManual('2026-09-23T20:00', '2026-09-23T21:30', noite);
igual('manual: válida devolve os instantes em UTC', [valida.ok, iso(valida.inicio), iso(valida.fim)], [true, '2026-09-23T19:00:00.000Z', '2026-09-23T20:30:00.000Z']);

// ── rótulos de dia (em Lisboa, não em UTC)
const ref = new Date('2026-09-23T10:00:00Z');
igual('dia: hoje', L.rotuloDia(new Date('2026-09-23T08:00:00Z'), ref), 'Hoje');
igual('dia: ontem', L.rotuloDia(new Date('2026-09-22T20:00:00Z'), ref), 'Ontem');
igual('dia: 00:30 de Lisboa ainda é hoje, embora em UTC seja ontem', L.rotuloDia(new Date('2026-09-22T23:30:00Z'), ref), 'Hoje');
igual('dia: mais antigo, com o dia da semana à portuguesa', L.rotuloDia(new Date('2026-09-20T12:00:00Z'), ref), 'domingo, 20/09');
igual('dia: segunda-feira sem o -feira', L.rotuloDia(new Date('2026-09-14T12:00:00Z'), ref), 'segunda, 14/09');
igual('dia: sábado', L.rotuloDia(new Date('2026-09-19T12:00:00Z'), ref), 'sábado, 19/09');
igual('tipos: rótulos em português', L.TIPOS.map((t) => L.ROTULO_TIPO[t]), ['Aula', 'Revisão', 'Exercícios', 'Recall', 'Leitura', 'Projeto']);

const falhas = resultados.filter((r) => !r.ok);
for (const r of resultados) console.log(`${r.ok ? '  ok ' : '  FALHA'} ${r.nome}${r.ok ? '' : `  → obtido ${JSON.stringify(r.obtido)}, esperado ${JSON.stringify(r.esperado)}`}`);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações`);
process.exit(falhas.length ? 1 : 0);
