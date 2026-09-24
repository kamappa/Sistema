/* ===== SESSÕES DE ESTUDO — lógica pura (Missão 34 · Fase A, Lote 1) =====
   Contas de tempo sem DOM nem rede: o fuso de Lisboa, o limite de fecho (4 h ou
   meia-noite, o que vier primeiro), o tempo efetivo sem pausas e a validação da
   sessão manual. Script clássico (global SessoesLogica) e, em Node, módulo
   CommonJS para os testes (testes/sessoes/logica.test.mjs).
   A regra do limite é a MESMA da base (public.limite_sessao): aqui só serve para
   MOSTRAR a que horas uma sessão esquecida fecha — quem fecha é o servidor. */
const SessoesLogica = (() => {
  const FUSO = 'Europe/Lisbon';
  const QUATRO_HORAS_MS = 4 * 3600e3;
  const TIPOS = ['aula', 'revisao', 'exercicios', 'recall', 'leitura', 'projeto'];
  const ROTULO_TIPO = { aula: 'Aula', revisao: 'Revisão', exercicios: 'Exercícios', recall: 'Recall', leitura: 'Leitura', projeto: 'Projeto' };
  const ROTULO_MOTIVO = { limite_4h: 'ao fim de 4 horas', meia_noite: 'à meia-noite' };

  const fmtPartes = new Intl.DateTimeFormat('en-GB', {
    timeZone: FUSO, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  });
  // Tabela fixa, não Intl: o formato curto do pt-PT varia entre motores (Node, Chrome, Safari).
  const DIA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const dois = (n) => String(n).padStart(2, '0');

  function partesCompletas(d) {
    const p = {};
    for (const x of fmtPartes.formatToParts(d)) if (x.type !== 'literal') p[x.type] = Number(x.value);
    return { ano: p.year, mes: p.month, dia: p.day, hora: p.hour, minuto: p.minute, segundo: p.second };
  }
  /** A data e a hora de parede em Lisboa, nesse instante. */
  function partesLisboa(d) {
    const p = partesCompletas(d);
    return { ano: p.ano, mes: p.mes, dia: p.dia, hora: p.hora, minuto: p.minuto };
  }
  // Minutos de avanço de Lisboa sobre UTC nesse instante (60 no verão, 0 no inverno).
  function desvioMin(ms) {
    const p = partesCompletas(new Date(ms));
    return Math.round((Date.UTC(p.ano, p.mes - 1, p.dia, p.hora, p.minuto, p.segundo) - Math.floor(ms / 1000) * 1000) / 60000);
  }
  /** 'AAAA-MM-DDTHH:MM' lido como hora de Lisboa (seja qual for o fuso do aparelho). */
  function lisboaParaInstante(texto) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(texto || ''));
    if (!m) return null;
    const alvo = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
    let t = alvo - desvioMin(alvo) * 60000;
    t = alvo - desvioMin(t) * 60000; // segunda passagem: acerta perto das mudanças de hora
    return new Date(t);
  }
  function instanteParaLisboaInput(d) {
    const p = partesLisboa(d);
    return `${p.ano}-${dois(p.mes)}-${dois(p.dia)}T${dois(p.hora)}:${dois(p.minuto)}`;
  }
  function horaLisboa(d) {
    const p = partesLisboa(d);
    return `${dois(p.hora)}:${dois(p.minuto)}`;
  }
  function meiaNoiteSeguinte(d) {
    const p = partesLisboa(d);
    const amanha = new Date(Date.UTC(p.ano, p.mes - 1, p.dia + 1));
    return lisboaParaInstante(`${amanha.getUTCFullYear()}-${dois(amanha.getUTCMonth() + 1)}-${dois(amanha.getUTCDate())}T00:00`);
  }
  /** Quando uma sessão esquecida deixa de contar: 4 h reais ou a meia-noite de Lisboa. */
  function limiteSessao(inicio) {
    const i = new Date(inicio);
    return new Date(Math.min(i.getTime() + QUATRO_HORAS_MS, meiaNoiteSeguinte(i).getTime()));
  }
  /** Segundos de estudo, sem as pausas — nem as acumuladas, nem a que está a decorrer. */
  function segundosEfetivos(s, agora) {
    const ini = Date.parse(s.started_at);
    const fim = s.ended_at ? Date.parse(s.ended_at) : agora.getTime();
    const pausaCorrente = !s.ended_at && s.paused_at ? Math.max(0, agora.getTime() - Date.parse(s.paused_at)) : 0;
    return Math.max(0, Math.floor((fim - ini - pausaCorrente) / 1000) - (s.paused_seconds || 0));
  }
  function precisaAviso2h(s, agora) {
    return !s.ended_at && segundosEfetivos(s, agora) >= 7200;
  }
  function formatarRelogio(seg) {
    const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    return `${h}:${dois(m)}:${dois(s)}`;
  }
  function formatarDuracao(min) {
    const h = Math.floor(min / 60), m = min % 60;
    if (!h) return `${m} min`;
    return m ? `${h} h ${m} min` : `${h} h`;
  }
  /** A sessão declarada à mão: as horas vêm de dois campos datetime-local, em Lisboa. */
  function validarManual(inicioTxt, fimTxt, agora) {
    if (!inicioTxt || !fimTxt) return { ok: false, erro: 'Indica o início e o fim.' };
    const inicio = lisboaParaInstante(inicioTxt), fim = lisboaParaInstante(fimTxt);
    if (!inicio || !fim) return { ok: false, erro: 'Indica o início e o fim.' };
    if (fim <= inicio) return { ok: false, erro: 'O fim tem de ser depois do início.' };
    if (fim.getTime() > agora.getTime() + 60e3) return { ok: false, erro: 'O Sistema não regista o futuro.' };
    return { ok: true, inicio, fim };
  }
  /** 'Hoje', 'Ontem' ou 'domingo, 20/09' — sempre pelo dia de Lisboa, não pelo de UTC. */
  function rotuloDia(d, agora) {
    const a = partesLisboa(d), b = partesLisboa(agora);
    const dias = Math.round((Date.UTC(b.ano, b.mes - 1, b.dia) - Date.UTC(a.ano, a.mes - 1, a.dia)) / 864e5);
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    return `${DIA_SEMANA[new Date(Date.UTC(a.ano, a.mes - 1, a.dia)).getUTCDay()]}, ${dois(a.dia)}/${dois(a.mes)}`;
  }

  return {
    FUSO, TIPOS, ROTULO_TIPO, ROTULO_MOTIVO,
    partesLisboa, lisboaParaInstante, instanteParaLisboaInput, horaLisboa, limiteSessao,
    segundosEfetivos, precisaAviso2h, formatarRelogio, formatarDuracao, validarManual, rotuloDia,
  };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = SessoesLogica;
