# WebGL e Motion

## Princípio

WebGL cria atmosfera e cosmologia.

Não deve substituir toda a UI.

## Camadas

```text
DOM UI
├── texto
├── formulários
├── missões
├── Radar
└── Oráculo

WebGL
├── sky
├── Core
├── constellations
├── particles
├── nebulas
├── weather atmosphere
└── cinematic events
```

## React Three Fiber

Usar onde ajuda:

- composição de cena;
- lifecycle;
- refs;
- integração com React;
- suspense e lazy loading;
- postprocessing;
- componentização de entidades.

Não usar por dogma.

Shaders críticos podem continuar em GLSL/Three.js puro dentro da cena.

## Render pipeline

- scene;
- camera;
- quality manager;
- world uniforms;
- selective bloom;
- event reactions;
- performance guard.

## Performance

- adaptive DPR;
- quality tiers;
- instancing;
- Points;
- memoização;
- pooling;
- pause on hidden;
- reduced motion;
- mobile fallback;
- lazy scene load;
- render-on-demand onde possível;
- FPS guard sem promover automaticamente.

## Motion 2D

Usar Motion para:

- layout transitions;
- panel entry;
- navigation;
- hover físico;
- buttons;
- presence;
- reduced motion.

## Motion hierarchy

- background: quase imóvel;
- nebulas: muito lentas;
- stars: cintilação;
- Core: respiração;
- UI: estável;
- feedback: rápido e físico;
- eventos: raros e claros.

## Proibição

- partículas de confetti;
- animação constante em todos os elementos;
- bloom sobre texto;
- pós-processamento que reduz legibilidade;
- WebGL como demonstração técnica.
