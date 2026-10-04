/* O TIPO DE ENTRADA — rato ou toque (etapa 3 da publicação da Órbita, 2026-09-27).
 *
 * O texto de ajuda do Universo escolhia-se pela largura do ecrã: um iPad deitado dizia
 * «Ctrl+roda» e uma janela estreita de computador dizia «pinça». O que decide o gesto é a
 * mão, não os píxeis (decisão D3 do Daniel).
 *
 * Parte da media do aparelho — rato quando o ponteiro principal paira e é fino — e segue o
 * último ponteiro usado, para os aparelhos que têm os dois: um iPad com trackpad, um
 * portátil com ecrã tátil. A caneta conta como toque: não tem roda nem Escape à mão. O
 * teclado não muda nada — quem navega com o Tab continua com o texto do seu ponteiro.
 */
import { useEffect, useState } from 'react';

export type TipoEntrada = 'rato' | 'toque';

const MEDIA_RATO = '(hover: hover) and (pointer: fine)';

function peloAparelho(): TipoEntrada {
  return typeof window !== 'undefined' && window.matchMedia?.(MEDIA_RATO).matches ? 'rato' : 'toque';
}

export function useTipoEntrada(): TipoEntrada {
  const [tipo, setTipo] = useState<TipoEntrada>(peloAparelho);
  useEffect(() => {
    const mq = window.matchMedia(MEDIA_RATO);
    const pelaMedia = () => setTipo(mq.matches ? 'rato' : 'toque');
    const peloPonteiro = (e: PointerEvent) => setTipo(e.pointerType === 'mouse' ? 'rato' : 'toque');
    mq.addEventListener('change', pelaMedia);
    window.addEventListener('pointerdown', peloPonteiro, { capture: true, passive: true });
    return () => {
      mq.removeEventListener('change', pelaMedia);
      window.removeEventListener('pointerdown', peloPonteiro, { capture: true });
    };
  }, []);
  return tipo;
}
