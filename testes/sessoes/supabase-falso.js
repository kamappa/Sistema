// Supabase FALSO para os testes da interface das sessões (testes/sessoes/ui.mjs).
// Corre DENTRO da página, injetado antes de qualquer script. Imita só o que o Sistema
// pede — auth.getSession, as tabelas app_state, study_sessions e courses (as outras
// vêm vazias) e as quatro funções das sessões — com as regras da migração
// 20260923120000: uma sessão ativa por pessoa, fecho no limite (4 h ou meia-noite de
// Lisboa), duration_min calculada e nunca escrita, e as mesmas restrições.
// A conta de Lisboa aqui é feita À PARTE (procura do desvio certo), não com o
// js/sessoes-logica.js: se a interface errar a hora, os dois discordam e o teste vê.
// Dados SINTÉTICOS. A "base" persiste em localStorage para sobreviver a um recarregar
// — é assim que o teste prova que a sessão continua depois de fechar a app.
(() => {
  const CFG = window.__CFG_FALSO || {};
  const UID = '00000000-0000-4000-8000-00000000000a';
  const CHAVE = '__falso_bd';
  const TIPOS = ['aula', 'revisao', 'exercicios', 'recall', 'leitura', 'projeto'];
  let bd;
  try { bd = JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch { bd = null; }
  if (!bd) bd = { study_sessions: [], courses: [], app_state: [], ...(CFG.semente || {}) };
  const guardar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(bd)); } catch { /* sem armazenamento */ } };
  const registo = [];
  const ctl = { falha: CFG.falha || null }; // null | 'rede' | 'inexistente'
  let seq = 0;
  const uuid = () => '10000000-0000-4000-8000-' + String(Date.now() % 1e6).padStart(6, '0') + String(++seq).padStart(6, '0');
  const agoraIso = () => new Date().toISOString();

  // ── Lisboa, feito à parte
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const partes = (ms) => Object.fromEntries(fmt.formatToParts(new Date(ms)).filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)]));
  const lisboa = (iso) => { const p = partes(Date.parse(iso)); const d = (n) => String(n).padStart(2, '0'); return `${p.year}-${d(p.month)}-${d(p.day)}T${d(p.hour)}:${d(p.minute)}`; };
  function meiaNoite(ms) {
    const p = partes(ms);
    const alvo = new Date(Date.UTC(p.year, p.month - 1, p.day + 1));
    for (const desvio of [60, 0, 120]) { // o primeiro desvio que dá 00:00 do dia seguinte em Lisboa
      const t = Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth(), alvo.getUTCDate()) - desvio * 60000;
      const q = partes(t);
      if (q.day === alvo.getUTCDate() && q.hour === 0 && q.minute === 0) return t;
    }
    throw new Error('meia-noite de Lisboa não encontrada');
  }
  const limite = (iniIso) => { const i = Date.parse(iniIso); return Math.min(i + 4 * 3600e3, meiaNoite(i)); };

  // ── regras da tabela
  const erro = (code, message) => ({ data: null, error: { code, message } });
  const duracao = (s) => (s.ended_at == null ? null
    : Math.max(0, Math.floor(((Date.parse(s.ended_at) - Date.parse(s.started_at)) / 1000 - s.paused_seconds) / 60)));
  function violacao(s) {
    if (!TIPOS.includes(s.kind)) return 'sessao_tipo_valido';
    if (!['cronometro', 'manual', 'recall_automatico'].includes(s.source)) return 'sessao_origem_valida';
    if (!['ativa', 'terminada', 'por_confirmar', 'descartada'].includes(s.state)) return 'sessao_estado_valido';
    if ((s.state === 'ativa') !== (s.ended_at == null)) return 'sessao_estado_coerente';
    if (s.ended_at != null && Date.parse(s.ended_at) < Date.parse(s.started_at)) return 'sessao_fim_depois_do_inicio';
    if (s.paused_at != null && s.state !== 'ativa') return 'sessao_pausa_so_ativa';
    if (s.source === 'manual' && s.state === 'ativa') return 'sessao_manual_fechada';
    if (s.note != null && (s.note.length > 140 || /[\r\n]/.test(s.note))) return 'sessao_nota_uma_linha';
    if (!(s.paused_seconds >= 0)) return 'sessao_pausa_positiva';
    return null;
  }
  const outraAtiva = (s) => s.state === 'ativa' && bd.study_sessions.some((o) => o.id !== s.id && o.user_id === s.user_id && o.state === 'ativa');
  function novaSessao(v) {
    const t = agoraIso();
    return { id: uuid(), user_id: UID, course_id: null, topic_id: null, class_id: null, note: null, closed_reason: null,
      started_at: t, ended_at: null, paused_at: null, paused_seconds: 0, created_at: t, updated_at: t, ...v };
  }

  // ── consultas (o subconjunto do PostgREST que o Sistema usa)
  const cmp = (a, b) => { const x = Date.parse(a), y = Date.parse(b); return (!isNaN(x) && !isNaN(y)) ? x - y : (a < b ? -1 : a > b ? 1 : 0); };
  class Consulta {
    constructor(tabela) { this.t = tabela; this.op = 'select'; this.filtros = []; this.ordem = null; this.lim = null; this.um = null; this.devolver = false; }
    select() { if (this.op !== 'select') this.devolver = true; return this; }
    insert(v) { this.op = 'insert'; this.valor = v; return this; }
    upsert(v) { this.op = 'upsert'; this.valor = v; return this; }
    update(v) { this.op = 'update'; this.valor = v; return this; }
    delete() { this.op = 'delete'; return this; }
    eq(c, v) { this.filtros.push((r) => r[c] === v); return this; }
    neq(c, v) { this.filtros.push((r) => r[c] !== v); return this; }
    in(c, vs) { this.filtros.push((r) => vs.includes(r[c])); return this; }
    gte(c, v) { this.filtros.push((r) => r[c] != null && cmp(r[c], v) >= 0); return this; }
    gt(c, v) { this.filtros.push((r) => r[c] != null && cmp(r[c], v) > 0); return this; }
    lt(c, v) { this.filtros.push((r) => r[c] != null && cmp(r[c], v) < 0); return this; }
    order(c, o) { this.ordem = [c, o && o.ascending === false ? -1 : 1]; return this; }
    limit(n) { this.lim = n; return this; }
    single() { this.um = 'single'; return this; }
    maybeSingle() { this.um = 'maybe'; return this; }
    then(res, rej) { return new Promise((r) => setTimeout(r, 15)).then(() => this.executar()).then(res, rej); }
    executar() {
      registo.push({ tabela: this.t, op: this.op, valor: this.valor === undefined ? null : JSON.parse(JSON.stringify(this.valor)) });
      if (ctl.falha === 'rede') return { data: null, error: { code: '', message: 'TypeError: Failed to fetch' } };
      if (ctl.falha === 'inexistente' && ['study_sessions', 'courses'].includes(this.t)) return erro('PGRST205', `Could not find the table 'public.${this.t}' in the schema cache`);
      const linhas = bd[this.t] || (bd[this.t] = []);
      const passa = (r) => this.filtros.every((f) => f(r));
      const acabar = (data) => {
        if (this.ordem) { const [c, s] = this.ordem; data = [...data].sort((a, b) => s * cmp(a[c], b[c])); }
        if (this.lim != null) data = data.slice(0, this.lim);
        if (this.um === 'single') return data.length === 1 ? { data: data[0], error: null } : erro('PGRST116', 'JSON object requested, multiple (or no) rows returned');
        if (this.um === 'maybe') return { data: data[0] || null, error: null };
        return { data, error: null };
      };
      const devolve = (rows) => (this.devolver ? acabar(rows.map((r) => ({ ...r }))) : { data: null, error: null });
      if (this.op === 'select') return acabar(linhas.filter(passa).map((r) => ({ ...r })));
      if (this.op === 'upsert') {
        const v = this.valor; const i = linhas.findIndex((r) => r.user_id === v.user_id);
        if (i >= 0) linhas[i] = { ...linhas[i], ...v }; else linhas.push({ ...v });
        guardar(); return devolve([v]);
      }
      if (this.op === 'insert') {
        const vs = Array.isArray(this.valor) ? this.valor : [this.valor];
        const novas = [];
        for (const v of vs) {
          if ('duration_min' in v) return erro('428C9', 'cannot insert a non-DEFAULT value into column "duration_min"');
          const s = this.t === 'study_sessions' ? novaSessao(v) : { id: uuid(), user_id: UID, ...v };
          if (this.t === 'study_sessions') {
            const x = violacao(s); if (x) return erro('23514', `new row violates check constraint "${x}"`);
            if (outraAtiva(s)) return erro('23505', 'duplicate key value violates unique constraint "study_sessions_uma_ativa"');
            s.duration_min = duracao(s);
          }
          novas.push(s);
        }
        linhas.push(...novas); guardar(); return devolve(novas);
      }
      if (this.op === 'update') {
        if ('duration_min' in this.valor) return erro('428C9', 'column "duration_min" can only be updated to DEFAULT');
        const alvo = linhas.filter(passa);
        const novas = alvo.map((r) => ({ ...r, ...this.valor, updated_at: agoraIso() }));
        for (const s of novas) {
          if (this.t !== 'study_sessions') continue;
          const x = violacao(s); if (x) return erro('23514', `new row violates check constraint "${x}"`);
          if (outraAtiva(s)) return erro('23505', 'duplicate key value violates unique constraint "study_sessions_uma_ativa"');
          s.duration_min = duracao(s);
        }
        novas.forEach((s) => { linhas[linhas.findIndex((r) => r.id === s.id)] = s; });
        guardar(); return devolve(novas);
      }
      if (this.op === 'delete') {
        const saem = linhas.filter(passa);
        bd[this.t] = linhas.filter((r) => !passa(r)); guardar(); return devolve(saem);
      }
      return erro('XX000', 'operação desconhecida');
    }
  }

  // ── as quatro funções, como no SQL
  function terminar(s) {
    const lim = limite(s.started_at), agora = Date.now();
    const passou = agora >= lim, fim = Math.min(agora, lim);
    const pausa = s.paused_at && Date.parse(s.paused_at) < fim ? Math.floor((fim - Date.parse(s.paused_at)) / 1000) : 0;
    Object.assign(s, { ended_at: new Date(fim).toISOString(), paused_seconds: s.paused_seconds + pausa, paused_at: null,
      state: passou ? 'por_confirmar' : 'terminada',
      closed_reason: !passou ? null : (lim === meiaNoite(Date.parse(s.started_at)) ? 'meia_noite' : 'limite_4h'), updated_at: agoraIso() });
    s.duration_min = duracao(s);
    return { ...s };
  }
  const minha = (id) => bd.study_sessions.find((s) => s.id === id && s.user_id === UID);
  function rpc(nome, args = {}) {
    registo.push({ rpc: nome, args });
    return new Promise((r) => setTimeout(r, 15)).then(() => {
      if (ctl.falha === 'rede') return { data: null, error: { code: '', message: 'TypeError: Failed to fetch' } };
      if (ctl.falha === 'inexistente') return erro('PGRST202', `Could not find the function public.${nome} without parameters in the schema cache`);
      let out = [];
      if (nome === 'normalizar_sessoes') {
        out = bd.study_sessions.filter((s) => s.user_id === UID && s.state === 'ativa' && Date.now() >= limite(s.started_at)).map(terminar);
      } else {
        const s = minha(args.sessao);
        if (nome === 'pausar_sessao' && s && s.state === 'ativa' && !s.paused_at) { s.paused_at = agoraIso(); s.updated_at = s.paused_at; out = [{ ...s }]; }
        if (nome === 'retomar_sessao' && s && s.state === 'ativa' && s.paused_at) {
          s.paused_seconds += Math.floor((Date.now() - Date.parse(s.paused_at)) / 1000); s.paused_at = null; s.updated_at = agoraIso(); out = [{ ...s }];
        }
        if (nome === 'terminar_sessao' && s && s.state === 'ativa') out = [terminar(s)];
        if (!['pausar_sessao', 'retomar_sessao', 'terminar_sessao'].includes(nome)) return erro('PGRST202', 'função desconhecida');
      }
      guardar();
      return { data: out, error: null };
    });
  }

  const sessao = CFG.comConta === false ? null
    : { access_token: 'falso', user: { id: UID, email: 'teste@exemplo.invalid' } };
  const cliente = {
    from: (t) => new Consulta(t),
    rpc,
    auth: {
      getSession: async () => ({ data: { session: sessao }, error: null }),
      getUser: async () => ({ data: { user: sessao && sessao.user }, error: null }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { user: sessao && sessao.user, session: sessao }, error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  };
  window.supabase = { createClient: () => cliente };
  // Para o teste: ver e mexer na "base" como se fosse outro dispositivo.
  window.__falso = { bd: () => bd, registo, ctl, UID, lisboa, limite, guardar, novaSessao, duracao };
})();
