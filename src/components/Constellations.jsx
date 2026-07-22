import { useEffect, useRef } from 'react';
import { initConstellation } from '../stage/constellation.js';

// Constelações — o Céu do Operador (Missão 25 · Fase 16). O motor
// (src/stage/constellation.js, 1255 linhas) já estava portado da Missão 16/17;
// faltava a casca React que fornece o DOM que ele procura (#constel-cv,
// #const-labels, #const-chips) e o dispara. O painel replica exatamente a marca
// do Vanilla (legacy/index.html) para o css/hud.css intacto dar o aspeto.
//
// Ciclo de vida: initConstellation() é idempotente-por-desenho aqui — corre 1×
// quando o canvas existe (o main.js do palco já o chamou no import, mas sem
// canvas desistiu em silêncio). O renderer WebGL fica preso a ESTE canvas; por
// isso um guard de módulo garante uma só inicialização (o StrictMode re-corre o
// efeito sobre o mesmo nó de canvas — reinicializar criaria dois contextos WebGL
// no mesmo canvas). A reatividade (nascimento de estrelas por evidência) vem do
// window.renderConstellation() disparado no subscribe do Stage.jsx.
//
// NOTA (fx/motion deferido): sem window.Motion, a câmara (fly-in/zoom/dolly)
// assenta sem mola — funcional, mas sem o cinematográfico. A camada de mola
// entra na fase da migração dedicada ao fx/motion.
let inited = false;

export default function Constellations() {
  const cvRef = useRef(null);

  useEffect(() => {
    if (inited) return;                 // 1× por sessão (ver nota acima)
    if (!cvRef.current) return;
    inited = true;
    initConstellation();                // agora o #constel-cv existe → nasce o céu
  }, []);

  return (
    <div className="panel reveal" style={{ animationDelay: '.325s' }}>
      <div className="ptitle"><b>Constelações</b> · o céu do Operador</div>
      <div className="dhint">Cada estrela nasce de evidência real — nível, streak, missões ou um Título Real. Nada nasce à mão. O céu começa vazio e povoa-se com o teu crescimento.</div>
      <div className="const-chips" id="const-chips"></div>
      <div className="const-wrap">
        <canvas id="constel-cv" ref={cvRef} aria-hidden="true"></canvas>
        <div id="const-labels"></div>
      </div>
    </div>
  );
}
