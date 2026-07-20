import { useEffect, useState } from 'react';
import { useStore } from './store/useStore.js';
import { ATTRS, AM, rankOf, titleOf, overallLevel } from './state/config.js';

// Missão 25 · Fase 1 — a casca viva. Ainda SEM painéis do HUD: só o que prova
// que a fundação de estado está de pé — gate de auth mínimo e um ecrã de prova
// que lê números REAIS do store (nada inventado; "o sistema nunca mente"). O
// aspeto final do HUD entra quando os painéis migrarem nas fases seguintes.
export default function App() {
  const { booted, S, init } = useStore();
  useEffect(() => { init(); }, [init]);

  if (!booted) return <Splash text="A resolver sessão…" />;
  if (!S) return <AuthGate />;
  return <Proof />;
}

function Splash({ text }) {
  return (
    <div className="foundation">
      <div className="foundation-badge">SISTEMA · FOUNDATION</div>
      <p className="muted">{text}</p>
    </div>
  );
}

function AuthGate() {
  const { login, signup, offline } = useStore();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState(null); // {text, ok}
  const [busy, setBusy] = useState(false);

  async function run(fn, pending) {
    setBusy(true); setMsg({ text: pending, ok: true });
    const r = await fn();
    setBusy(false);
    if (r?.error) setMsg({ text: r.error, ok: false });
    else if (r?.info) setMsg({ text: r.info, ok: true });
    else setMsg(null);
  }

  return (
    <div className="foundation">
      <div className="foundation-badge">SISTEMA · FASE 1</div>
      <h1>Entrar no Sistema</h1>
      <form className="authbox" onSubmit={(e) => { e.preventDefault(); run(() => login(email, pass), 'A entrar…'); }}>
        <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        <input type="password" placeholder="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" />
        <div className="authrow">
          <button type="submit" disabled={busy} className="primary">Entrar</button>
          <button type="button" disabled={busy} onClick={() => run(() => signup(email, pass), 'A criar conta…')}>Criar conta</button>
        </div>
        <button type="button" disabled={busy} className="ghost" onClick={() => offline()}>Continuar offline (só neste dispositivo)</button>
      </form>
      {msg && <p className={'authmsg' + (msg.ok ? ' ok' : '')}>{msg.text}</p>}
    </div>
  );
}

function Proof() {
  const { S, user, sync, save, logout } = useStore();
  const lvl = overallLevel(S);
  const rank = rankOf(lvl);
  const syncLabel = { ok: '☁️ Sincronizado', saving: '⏳ A sincronizar…', err: '⚠️ Sem ligação — guardado localmente', local: '💾 Só neste dispositivo (sem conta)' }[sync];

  return (
    <div className="foundation">
      <div className="foundation-badge">SISTEMA · FASE 1 · CASCA VIVA</div>
      <h1>Estado carregado</h1>
      <p className="muted">
        {user ? user.email : 'sessão offline'} · <span className="sync">{syncLabel}</span>
      </p>

      <div className="proof">
        <div className="proof-hero">
          <span className="rankbadge" style={{ color: rank.color, borderColor: rank.color }}>{rank.l}</span>
          <div>
            <div className="proof-title">{titleOf(lvl)}</div>
            <div className="muted">Nível geral {lvl} · {S.totalXP} XP total</div>
          </div>
        </div>
        <div className="proof-attrs">
          {ATTRS.map((a) => (
            <div className="proof-attr" key={a.id}>
              <span className="dot" style={{ background: AM[a.id].color }} />
              <span>{a.name}</span>
              <span className="muted">Nv {S.attrs[a.id].level} · {S.attrs[a.id].xp} XP</span>
            </div>
          ))}
        </div>
        <div className="proof-meta muted">
          {S.objectives.length} objetivos · {S.history.length} dias no histórico · v{S.v}
        </div>
      </div>

      <div className="authrow">
        <button type="button" onClick={() => save()}>Forçar guardar</button>
        <button type="button" className="ghost" onClick={() => logout()}>Sair</button>
      </div>
      <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>
        Prova da Fase 1: estes números são lidos do store (nuvem/local), não fabricados.
        Os painéis do HUD entram nas fases seguintes.
      </p>
    </div>
  );
}
