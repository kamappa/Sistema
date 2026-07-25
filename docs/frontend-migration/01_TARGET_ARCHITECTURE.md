# Arquitetura-alvo

## Decisão técnica

A próxima geração da frontend do Sistema deve usar:

- **TypeScript** como linguagem principal da frontend;
- **React** como arquitetura de componentes;
- **Vite** para desenvolvimento e build;
- **CSS moderno**, tokens e design system próprio;
- **Motion / Framer Motion** para interação e transições 2D;
- **Three.js** para o motor gráfico;
- **React Three Fiber** apenas nas áreas em que melhora composição,
  lifecycle, integração e testabilidade;
- **Drei** para helpers adequados;
- **@react-three/postprocessing** para bloom e pós-processamento seletivo;
- **Supabase** preservado como backend;
- **Vercel** para previews e, apenas mais tarde, produção;
- **n8n** numa missão posterior de automação;
- **Hermes/OpenClaw** numa missão posterior de agentes.

## O que TypeScript resolve

- contratos claros para estado;
- deteção de erros em build;
- modelos explícitos para missões, weather, events, constellations, Core,
  Oracle e Supabase;
- refactors mais seguros;
- redução de estados inconsistentes;
- melhor autocomplete e documentação viva.

## O que React resolve

- componentes com responsabilidade clara;
- shell substituível sem partir lógica;
- reutilização;
- isolamento de estados;
- testes de componentes;
- integração com ferramentas modernas de UI;
- possibilidade de variações visuais controladas;
- melhor evolução desktop/mobile.

## O que Vite resolve

- desenvolvimento rápido;
- hot reload;
- imports modernos;
- build otimizado;
- code splitting;
- assets tratados corretamente;
- output previsível em `dist`;
- integração direta com Vercel.

## Arquitetura proposta

```text
src/
├── app/
│   ├── App.tsx
│   ├── routes/
│   ├── providers/
│   └── bootstrap/
├── components/
│   ├── operator/
│   ├── oracle/
│   ├── radar/
│   ├── missions/
│   ├── habits/
│   ├── training/
│   └── shared/
├── design-system/
│   ├── tokens/
│   ├── primitives/
│   ├── surfaces/
│   ├── typography/
│   └── motion/
├── world/
│   ├── time/
│   ├── weather/
│   ├── seasons/
│   ├── events/
│   └── atmosphere/
├── universe/
│   ├── scene/
│   ├── core/
│   ├── constellations/
│   ├── particles/
│   ├── shaders/
│   └── postprocessing/
├── state/
│   ├── operator/
│   ├── progress/
│   ├── world/
│   └── ui/
├── services/
│   ├── supabase/
│   ├── oracle/
│   ├── weather/
│   └── vault/
├── adapters/
│   ├── legacy-state/
│   └── supabase-state/
├── types/
├── styles/
└── tests/
```

## Estado

O backend continua a ser a fonte de verdade.

A frontend nova não cria uma segunda verdade.

O estado deve separar:

```text
Progress Engine = verdade e evidência
World Engine = contexto e atmosfera
Event Engine = eventos simbólicos
Visual Engine = representação
Oracle Engine = interpretação
```

## Limite arquitetural

React Three Fiber não deve engolir toda a aplicação.

A UI 2D deve continuar DOM acessível.

WebGL serve o universo, o Core, partículas, ambiente e eventos, não formulários
ou texto operacional.
