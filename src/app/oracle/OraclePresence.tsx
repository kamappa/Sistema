/* Camada de presença do Oráculo — Missão 26 · Fase 2.
 *
 * Três estados: ambient → active → warroom.
 *
 * Invocação: escrever "Oráculo" em qualquer sítio (fora de campos de texto), ou
 * a tecla `/`. Escape recolhe um nível de cada vez. O Active escurece a zona
 * sem a destruir — o contexto continua atrás, legível, e volta-se de imediato.
 *
 * Read-only nesta fase. Sem voz, sem Hermes, sem OpenClaw, sem n8n, sem
 * automações.
 */

import { useEffect, useRef, useState } from 'react';
import OracleAmbient from './OracleAmbient';
import OracleWarRoom from './OracleWarRoom';
import OracleBriefing from './OracleBriefing';
import Conselho from '../../components/Conselho.jsx';
import './oracle.css';

type OracleState = 'ambient' | 'active' | 'warroom';

const INVOKE_WORD = 'oraculo';

// Sem prop `S`: o Ambient lê o estado real diretamente do store (radar, report,
// objetivos) e o Conselho é o componente existente, que já se serve sozinho.
// Passar S aqui seria uma segunda via para os mesmos dados.
export default function OraclePresence() {
  const [state, setState] = useState<OracleState>('ambient');
  const panelRef = useRef<HTMLDivElement>(null);
  const typed = useRef('');

  // Invocação por escrita. Ignora campos de texto para não roubar o que o
  // Operador está a escrever.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable);

      if (e.key === 'Escape') {
        setState((s) => (s === 'warroom' ? 'active' : s === 'active' ? 'ambient' : s));
        return;
      }
      if (typing) return;

      if (e.key === '/') {
        e.preventDefault();
        setState('active');
        return;
      }
      if (e.key.length === 1) {
        typed.current = (typed.current + e.key.toLowerCase())
          .replace(/[^a-z]/g, '')
          .slice(-INVOKE_WORD.length);
        if (typed.current === INVOKE_WORD) {
          typed.current = '';
          setState('active');
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Foco entra no painel quando abre — e volta ao documento quando fecha.
  useEffect(() => {
    if (state !== 'ambient') panelRef.current?.focus();
  }, [state]);

  return (
    <aside className="sys-oracle" data-state={state}>
      {state === 'ambient' && <OracleAmbient onInvoke={() => setState('active')} />}

      {state !== 'ambient' && (
        <div
          className="sys-oracle-panel"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-label="Oráculo"
        >
          <header className="sys-oracle-head">
            <span className="sys-oracle-title">Oráculo</span>
            <nav className="sys-oracle-modes">
              <button
                type="button"
                data-on={state === 'active'}
                onClick={() => setState('active')}
              >
                Conselho
              </button>
              <button
                type="button"
                data-on={state === 'warroom'}
                onClick={() => setState('warroom')}
              >
                War Room
              </button>
            </nav>
            <button
              type="button"
              className="sys-oracle-close"
              onClick={() => setState('ambient')}
              aria-label="Recolher o Oráculo"
            >
              ✕
            </button>
          </header>

          <div className="sys-oracle-body">
            {/* O Oraculo diz o que JA SABE antes de pedir para escreveres.
                Sem isto, invoca-lo dava um campo vazio - uma caixa de chat, que
                e o que a Constituicao proibe por nome. */}
            {state === 'active' ? <><OracleBriefing /><Conselho /></> : <OracleWarRoom />}
          </div>
        </div>
      )}
    </aside>
  );
}
