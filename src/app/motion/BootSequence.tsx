/* ENTRADA NO SISTEMA.
 * Missão 26 · Fase 6G.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NÃO É UM SPLASH SCREEN, e há três coisas que garantem isso:         ║
 * ║  1. `pointer-events: none` desde o primeiro frame — nunca bloqueia;  ║
 * ║  2. o conteúdo real já está montado por baixo, por isso nada atrasa  ║
 * ║     dados nem provoca layout shift;                                  ║
 * ║  3. corre UMA VEZ POR SESSÃO.                                        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * A guarda é `sessionStorage`, não `useState`: sem ela, o HMR do Vite em
 * desenvolvimento reencenava a sequência a cada gravação de ficheiro, e um
 * regresso ao separador podia fazer o mesmo. O Sistema acorda uma vez — dizer
 * "acordei" outra vez seria falso.
 *
 * O que a sequência mostra é o NÚCLEO a formar-se e a órbita a aparecer em
 * redor: a mesma forma que fica no topo do ecrã depois. Não é um logótipo, e
 * não é um vídeo — são duas formas em CSS.
 */

import { useEffect, useState } from 'react';

const KEY = 'sistema:acordou';

export default function BootSequence() {
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem(KEY); } catch { return false; }
  });

  useEffect(() => {
    if (!show) return;
    // 1100ms é o fim da animação do véu. Desmontar antes deixaria o véu preto
    // no ecrã; desmontar muito depois deixaria um nó inútil montado.
    //
    // A MARCA É ESCRITA NO FIM, não no início. O StrictMode do React 18 monta,
    // desmonta e volta a montar em desenvolvimento: com a escrita no início, o
    // segundo mount lia a marca já posta e a sequência nunca chegava a ver-se.
    // Medido — `.sys-boot` ausente 250ms depois de entrar.
    //
    // Efeito lateral aceitável: quem sair antes de a sequência acabar volta a
    // vê-la. É preferível a nunca a ver.
    const t = window.setTimeout(() => {
      try { sessionStorage.setItem(KEY, '1'); } catch { /* modo privado: corre e pronto */ }
      setShow(false);
    }, 1150);
    return () => window.clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="sys-boot" aria-hidden="true">
      <span className="sys-boot-ring" />
      <span className="sys-boot-core" />
    </div>
  );
}
