/* Collapse — recolher em ecrã estreito. Missão 26 · Fase 4.
 *
 * O primitivo que a medição justificou. O plano previa um `<Panel>` partilhado;
 * medi antes e os cabeçalhos custavam 12% enquanto as ajudas custavam 3% — não
 * havia abstração a construir ali. O que se repete de painel para painel é
 * ISTO: um bloco pesado (formulário, nota longa) que só é preciso quando se vai
 * usar.
 *
 * Contrato:
 *   - só recolhe abaixo de 900px, e só dentro da shell. Em desktop, e no HUD
 *     sem `?shell=`, o conteúdo está sempre visível e o botão escondido — o
 *     problema medido é do mobile;
 *   - `forceOpen` mantém aberto o que já tem trabalho feito dentro (texto
 *     escrito, valor preenchido). O que o Operador começou nunca se esconde;
 *   - o botão é um alvo de 44px com o estado no rótulo.
 */

import { useState, type ReactNode } from 'react';

interface Props {
  /** Rótulo fechado. Aberto, mostra "Fechar". */
  label: string;
  /** Mantém aberto independentemente do toggle (há trabalho por terminar). */
  forceOpen?: boolean;
  children: ReactNode;
}

export default function Collapse({ label, forceOpen = false, children }: Props) {
  const [open, setOpen] = useState(false);
  const aberto = open || forceOpen;

  return (
    <>
      <button
        type="button"
        className="sys-collapse-toggle"
        data-open={aberto}
        aria-expanded={aberto}
        onClick={() => setOpen((v) => !v)}
      >
        {aberto ? 'Fechar' : label}
      </button>
      <div className="sys-collapse" data-open={aberto}>
        {children}
      </div>
    </>
  );
}
