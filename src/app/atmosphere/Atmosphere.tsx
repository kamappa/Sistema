/* Camada de atmosfera — a direção A ao serviço da B.
 * Missão 26 · Fase 2.
 *
 * O céu WebGL já existe: o <Stage/> do App.jsx monta o #dust e corre o Solar
 * Engine, e continua a correr por trás da shell. Esta camada NÃO o duplica.
 * O que faz é:
 *
 *   1. decidir o tier gráfico e marcá-lo em <html data-sys-quality>, para o CSS
 *      seguir sem ter de saber porquê;
 *   2. garantir que a shell continua legível e utilizável QUANDO NÃO HÁ WebGL,
 *      com um campo de gradientes derivado dos mesmos tokens de luz.
 *
 * O fallback lê as variáveis --amb1/--amb2/--amb3 que o Solar escreve na raiz
 * quando está vivo; sem elas, cai nos tokens do Sistema. Assim a hora do dia
 * continua a pintar o ambiente mesmo em modo degradado.
 */

import { useEffect, useState } from 'react';
import './atmosphere.css';

type Quality = 'full' | 'lite' | 'off';

function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'off';

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return 'off';

  // Há contexto WebGL? Sem ele, o palco não pinta e a shell tem de se governar.
  let webgl = false;
  try {
    const c = document.createElement('canvas');
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    webgl = false;
  }
  if (!webgl) return 'off';

  // Ecrã estreito ou poucos núcleos: tier reduzido. O blur cai por CSS.
  const narrow = window.matchMedia?.('(max-width: 900px)').matches;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return narrow || weak ? 'lite' : 'full';
}

export default function Atmosphere() {
  const [quality, setQuality] = useState<Quality>('full');

  useEffect(() => {
    function apply() {
      const q = detectQuality();
      setQuality(q);
      document.documentElement.setAttribute('data-sys-quality', q);
    }
    apply();

    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqWidth = window.matchMedia('(max-width: 900px)');
    mqMotion.addEventListener('change', apply);
    mqWidth.addEventListener('change', apply);
    return () => {
      mqMotion.removeEventListener('change', apply);
      mqWidth.removeEventListener('change', apply);
      document.documentElement.removeAttribute('data-sys-quality');
    };
  }, []);

  return (
    <div className="sys-atmosphere" data-quality={quality} aria-hidden="true">
      {/* Só pinta quando não há palco WebGL. Com palco, fica transparente para
          não competir com ele nem duplicar luz. */}
      <div className="sys-atmosphere-field" />
    </div>
  );
}
