import { useEffect, useRef } from 'react';

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
// BUNDLE (Missão 26 · Fase 1): o import de `../stage/constellation.js` era
// ESTÁTICO, e esse módulo importa o Three.js estaticamente. Como o App.jsx
// importa este componente estaticamente, o Rollup promovia o Three.js (675 KB)
// ao chunk de entrada, anulando o `import('./stage/main.js')` dinâmico do
// Stage.jsx:44 — o entry ficava com 979 KB e o palco só 16,8 KB. Passar a
// import() dinâmico aqui devolve o Three.js ao chunk assíncrono. Não muda
// comportamento: initConstellation() já só era chamado dentro deste efeito.
let inited = false;

export default function Constellations() {
  const cvRef = useRef(null);

  useEffect(() => {
    if (inited) return;                 // 1× por sessão (ver nota acima)
    if (!cvRef.current) return;
    inited = true;
    // agora o #constel-cv existe → nasce o céu (o módulo traz o Three.js consigo)
    import('../stage/constellation.js').then((m) => m.initConstellation());
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
