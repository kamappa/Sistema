import { useEffect, useState } from 'react';
import { useStore } from './store/useStore.js';
import Stage from './Stage.jsx';
import Hero from './components/Hero.jsx';
import Attributes from './components/Attributes.jsx';
import Radar from './components/Radar.jsx';
import Diario from './components/Diario.jsx';
import Objectives from './components/Objectives.jsx';
import Shadows from './components/Shadows.jsx';
import Recall from './components/Recall.jsx';
import Training from './components/Training.jsx';

// Missão 25 — casca React sobre o palco WebGL. Fase 1: store espelha o
// app_state. Fase 2: o palco vive por trás de tudo. Fase 3: o primeiro painel
// do HUD real (o herói) migra com o css/hud.css intacto e valores idênticos ao
// Vanilla ("divergência = bug"). Os restantes painéis entram um a um.
export default function App() {
  const { booted, S, init } = useStore();
  useEffect(() => { init(); }, [init]);

  return (
    <>
      <Stage />
      <div className="app-content">
        {!booted ? <Splash text="A resolver sessão…" /> : !S ? <AuthGate /> : <Hud />}
      </div>
    </>
  );
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

// HUD — o quadro real (por agora, só o herói migrado). O css/hud.css intacto dá
// o aspeto; os restantes painéis do Vanilla entram nas fases seguintes.
function Hud() {
  const { S, user, sync, logout } = useStore();
  const syncLabel = sync === 'ok' ? '☁️ Sincronizado' + (user ? ' · ' + user.email : '')
    : sync === 'saving' ? '⏳ A sincronizar…'
    : sync === 'err' ? '⚠️ Sem ligação à nuvem — guardado localmente'
    : '💾 Só neste dispositivo (sem conta)';

  return (
    <div className="wrap">
      <div className="syslabel"><span>Sistema · Estado do Operador</span></div>

      <Hero S={S} />

      <div className="cols">
        <Attributes S={S} />
        <Radar S={S} />
      </div>

      <Diario S={S} />

      <Recall S={S} />

      <Training S={S} />

      <div className="cols"><Shadows S={S} /></div>
      <Objectives S={S} />

      <div className="foot">
        <small id="sync-st">{syncLabel}</small>
        <div style={{ display: 'flex', gap: 8 }}>
          {user && <button className="rst" onClick={() => logout()}>Sair</button>}
        </div>
      </div>
    </div>
  );
}
