/* AS TRÊS AÇÕES QUE SÓ EXISTIAM NO HUD.
 * Missão 26 · o que faltava para a Órbita poder ser a única interface.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE ISTO FOI O BLOQUEIO                                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O Daniel decidiu que a Órbita passa a ser o Sistema. Antes de trocar, fui
 * comparar painel a painel o que o HUD tinha e a Órbita não — e quase tudo
 * estava coberto: o `RadarNews` foi substituído pelo `RadarField` na Fase 6E, o
 * `Debuffs` pela Reflexão na Fase 8, o `Training` e o `Sleep` mudaram-se para o
 * subespaço Corpo na Fase 7.
 *
 * **Três coisas não tinham casa nenhuma:** sair da conta, exportar o estado e
 * reiniciar o Sistema. Viviam no rodapé do HUD e mais lado nenhum.
 *
 * Trocar sem isto deixava o Operador sem forma de terminar sessão — o que não é
 * uma falha de conveniência, é perder o controlo sobre a própria conta.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE NÃO É UM PAINEL                                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Um painel vive numa zona, e estas ações não pertencem a nenhuma: não são
 * Núcleo, nem Operações, nem Reflexão. São o Sistema a falar de si próprio.
 *
 * Ficam na faixa de sistema, ao lado do estado de gravação — que é o outro
 * sítio onde o Sistema fala de si e não do Operador.
 */

import { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { exportStateFile } from '../lib/exports.js';
import './system-actions.css';

export default function SystemActions() {
  const S = useStore((s: { S: Record<string, unknown> | null }) => s.S);
  const user = useStore((s: { user: { email?: string } | null }) => s.user);
  const logout = useStore((s: { logout: () => void }) => s.logout);
  const resetAll = useStore((s: { resetAll: () => void }) => s.resetAll);

  const [aberto, setAberto] = useState(false);

  return (
    <div className="sys-actions" data-aberto={aberto ? 'true' : 'false'}>
      <button
        type="button"
        className="sys-actions-btn"
        aria-expanded={aberto}
        aria-label={user?.email ? `Conta: ${user.email}` : 'Conta e sistema'}
        onClick={() => setAberto((v) => !v)}
      >
        {/* O email é a única identificação, e só aparece quando existe sessão.
            Sem conta, o botão não inventa um nome. */}
        {user?.email ? user.email.split('@')[0] : 'sistema'}
      </button>

      {aberto && (
        <div className="sys-actions-menu" role="group" aria-label="Ações do Sistema">
          <button
            type="button"
            className="mini"
            onClick={() => { exportStateFile(S); setAberto(false); }}
          >
            Exportar estado
          </button>

          {user && (
            <button type="button" className="mini" onClick={() => { logout(); setAberto(false); }}>
              Terminar sessão
            </button>
          )}

          {/* REINICIAR fica separado e por último. É a única ação daqui que
              destrói dados, e a confirmação vive no store — não aqui: o gate de
              integridade pertence a quem escreve, não a quem desenha o botão. */}
          <button
            type="button"
            className="mini sys-actions-perigo"
            onClick={() => { resetAll(); setAberto(false); }}
          >
            Reiniciar Sistema
          </button>
        </div>
      )}
    </div>
  );
}
