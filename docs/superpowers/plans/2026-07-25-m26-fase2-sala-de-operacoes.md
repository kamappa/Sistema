# Missão 26 · Fase 2 — Fundação visual e moldura da Sala de Operações

> **Para quem executa:** os passos usam `- [ ]` para seguimento. Nenhuma tarefa
> altera lógica, schemas, XP, autenticação, escrita ou produção.

**Objetivo:** construir a moldura da Sala de Operações — tokens, shell, zonas,
navegação e presença do Oráculo — em duas variações comparáveis (B1 e B2), sem
redesenhar os módulos e sem consolidar nenhuma das variações.

**Arquitetura:** a shell nova nasce ao lado do HUD atual, atrás de um
interruptor por query string (`?shell=b1`, `?shell=b2`; sem parâmetro = HUD
atual, intacto). Os 19 painéis existentes são REUTILIZADOS tal como estão
dentro das zonas — esta fase é a moldura, não o recheio. Assim nada regride e
as duas variações são comparáveis lado a lado no mesmo browser.

**Stack:** React 18 + Vite 6 + TypeScript (novos ficheiros em `.ts`/`.tsx`;
`allowJs` mantém o JS existente a funcionar). CSS custom properties em camadas.
Zero dependências novas.

## Constrangimentos globais

- Não alterar: schemas Supabase, autenticação, regras de XP, `app_state`,
  cálculos, escrita, backend do Oráculo, Edge Functions, agentes, produção.
- A UI operacional permanece em DOM. O WebGL serve atmosfera e universo.
- **A shell tem de funcionar sem WebGL.** A camada de atmosfera degrada para
  CSS.
- `prefers-reduced-motion` respeitado em todas as transições.
- Sem bordas como hierarquia principal. Sem glow permanente. Sem tudo no ecrã
  ao mesmo tempo. Sem cartões por defeito.
- Nada do 21st.dev Magic entra copiado — só como referência.
- Não consolidar B1 ou B2. Ambas ficam vivas no fim da fase.
- Verificação: `npm run typecheck`, `npm run build`, consola e network no
  Chrome real, screenshots Playwright a 1440×900, 1280×800, 768×1024, 390×844.
  O projeto não tem framework de testes unitários — a verificação é de browser,
  como em todas as missões anteriores. Não finjo TDD onde ele não existe.

---

## Tese visual

O Sistema não é um dashboard. É um **instrumento** — parente próximo de uma
consola de controlo e de um caderno de auditoria, não de um SaaS. Nesses
objetos a moldura é mate e recua; a luz vem da leitura, não da decoração.

Daí a lei desta fase, que resolve de uma vez o problema medido na baseline
(19 painéis, 2 cores de borda, 1 material):

> **A hierarquia faz-se com luz, não com bordas.**
> O que está em foco é iluminado por dentro. O que está em repouso é mate.
> Só uma coisa está acesa de cada vez.

Isto satisfaz literalmente "não usar bordas roxas como hierarquia" e "não usar
glow constante": o brilho deixa de ser ornamento e passa a ser **o indicador de
foco**, com um único portador em cada momento.

**Elemento-assinatura:** o Núcleo como centro estrutural da shell, não como um
painel. É a cosmologia que o projeto já declara — "toda a energia relevante
converge para o Núcleo" — aplicada à composição. Tudo orbita o Núcleo porque no
Sistema tudo já orbita o Núcleo.

**Tipografia — mudança de papéis, não de famílias.** As três famílias ficam
(Rajdhani, Inter, JetBrains Mono); o que muda é o uso. Hoje Rajdhani em
uppercase com 2,6px de tracking titula os 19 painéis — é a origem do ruído.
Passa a estar RESERVADA à identidade e às grandezas (letra de rank, nível, nome
de zona). Os títulos passam a Inter, tamanho pequeno, peso real. O JetBrains
Mono fica onde é certo: leituras de instrumento e números.

---

## Estrutura de ficheiros

**Tokens** — `src/design-system/tokens/`
| Ficheiro | Responsabilidade |
| --- | --- |
| `primitives.css` | valores crus, sem semântica (paleta, escala) |
| `color.css` | cor semântica (texto, domínio, estado, perigo) |
| `surface.css` | materiais de superfície (mate, lida, vidro) |
| `light.css` | luz e foco — o coração do sistema |
| `depth.css` | profundidade, elevação, sombra, blur |
| `type.css` | famílias, escala, pesos, tracking, medida |
| `space.css` | espaçamento e raio |
| `motion.css` | duração, easing, reduced-motion |
| `layer.css` | z-index nomeado |
| `quality.css` | tier gráfico (full/lite/off) |
| `index.css` | importa tudo, por ordem |

**Shell** — `src/app/`
| Ficheiro | Responsabilidade |
| --- | --- |
| `Shell.tsx` | moldura; escolhe variação; hospeda zona ativa + Oráculo |
| `zones.ts` | registo das 6 zonas e dos painéis de cada uma |
| `useShellVariant.ts` | lê `?shell=`; devolve `'b1' \| 'b2' \| null` |
| `ZoneStage.tsx` | hospeda o conteúdo da zona ativa |
| `nav/RailNav.tsx` | navegação B1 (consola vertical) |
| `nav/OrbitNav.tsx` | navegação B2 (órbita à volta do Núcleo) |
| `oracle/OraclePresence.tsx` | orquestra os 3 estados |
| `oracle/OracleAmbient.tsx` | estado discreto permanente |
| `oracle/OracleActive.tsx` | conversa, briefing, decisões |
| `oracle/OracleWarRoom.tsx` | projetos, agentes, riscos (mock read-only) |
| `atmosphere/Atmosphere.tsx` | camada A; WebGL opcional, fallback CSS |
| `shell.css`, `b1.css`, `b2.css` | estilos da moldura e das variações |

**Modificados:** `src/App.jsx` (interruptor), `src/main.jsx` (importar tokens).
**Intocados:** `src/state/`, `src/store/`, `src/stage/`, `src/lib/`,
`src/components/*` (reutilizados sem edição).

## Mapa de zonas

| Zona | Painéis existentes reutilizados |
| --- | --- |
| **Command Core** | `Greet`, `DeadlineBanner`, `Hero`, `World` |
| **Radar** | `RadarNews` |
| **Operações** | `Diario`, `Objectives`, `Shadows`, `Recall`, `Training`, `Sleep` |
| **Universo** | `Attributes`, `Radar` (hexágono), `Constellations`, `Titles`, `Achievements` |
| **Oracle** | `OracleReport`, `Conselho`, `KnowledgeMap` |
| **Reflection** | `Debuffs`, `Calendar`, mais a linha 🕯 da Memória promovida a bloco |

Quatro atribuições são discutíveis e ficam assinaladas para decisão do Daniel
depois de ver a moldura a funcionar: `Calendar` (Operações ou Reflection),
`KnowledgeMap` (Oracle ou Universo), `Achievements` (Universo ou Core),
`Debuffs` (Core ou Reflection). Nenhuma bloqueia esta fase.

---

## Tarefa 1 — Camada de tokens

**Ficheiros:** criar `src/design-system/tokens/*.css` (11 ficheiros acima);
modificar `src/main.jsx`.

**Produz:** as custom properties consumidas por todas as tarefas seguintes.
Nomes exatos: `--sys-bg-void`, `--sys-surface-matte`, `--sys-surface-read`,
`--sys-light-focus`, `--sys-light-ambient`, `--sys-depth-1..4`,
`--sys-blur-recede`, `--sys-type-display`, `--sys-type-body`, `--sys-type-data`,
`--sys-step--1..6`, `--sys-space-1..8`, `--sys-radius-none|soft`,
`--sys-dur-instant|quick|calm|slow`, `--sys-ease-out|inout|spring`,
`--sys-z-atmosphere|stage|nav|oracle|overlay`, `--sys-quality`.

- [ ] **Passo 1:** criar `primitives.css` com a paleta em 6 valores nomeados
      (void, deep, violet, azure, ember, bone) e a escala tipográfica.
- [ ] **Passo 2:** criar `light.css` — o token central. `--sys-light-focus` é a
      única fonte de brilho; `--sys-light-ambient` é o repouso. Documentar no
      topo do ficheiro que só um elemento pode portar `focus` de cada vez.
- [ ] **Passo 3:** criar os restantes 8 ficheiros de token + `index.css`.
- [ ] **Passo 4:** importar `index.css` no `main.jsx` ANTES do `hud.css`, para
      o HUD atual continuar a ganhar (não pode regredir).
- [ ] **Passo 5:** `npm run build` e abrir o HUD atual sem `?shell=`.
      Esperado: **pixel-idêntico à baseline**. Se mudou, os tokens estão a
      vazar — corrigir antes de avançar.
- [ ] **Passo 6:** commit `feat(tokens): camada de tokens da Sala de Operações`.

## Tarefa 2 — Esqueleto da shell e registo de zonas

**Ficheiros:** criar `src/app/zones.ts`, `useShellVariant.ts`, `Shell.tsx`,
`ZoneStage.tsx`, `shell.css`; modificar `src/App.jsx`.

**Consome:** tokens da Tarefa 1.
**Produz:** `useShellVariant(): 'b1'|'b2'|null`; `ZONES: Zone[]` com
`{ id: ZoneId; name: string; panels: ComponentType<{S:OperatorState}>[] }`;
`<Shell variant="b1"|"b2" />`.

- [ ] **Passo 1:** `zones.ts` com as 6 zonas e o mapa acima, tipado com
      `OperatorState` de `src/types/domain.ts`.
- [ ] **Passo 2:** `useShellVariant.ts` — lê `?shell=`, valida contra `b1|b2`,
      devolve `null` para tudo o resto.
- [ ] **Passo 3:** `Shell.tsx` com zona ativa em `useState`, a renderizar
      `ZoneStage` e um placeholder de navegação.
- [ ] **Passo 4:** no `App.jsx`, `variant ? <Shell/> : <Hud/>`.
- [ ] **Passo 5:** `npm run typecheck` e `npm run build`.
- [ ] **Passo 6:** verificar no Chrome: sem parâmetro → HUD idêntico;
      `?shell=b1` → shell com as 6 zonas navegáveis por estado.
- [ ] **Passo 7:** commit `feat(shell): esqueleto de zonas atrás de ?shell=`.

## Tarefa 3 — Navegação B1 (consola)

**Ficheiros:** criar `src/app/nav/RailNav.tsx`, `src/app/b1.css`.

Barra vertical estreita à esquerda: o Núcleo no topo como marca viva, as 6
zonas por baixo como marcas gravadas (não botões de sidebar). Zona ativa
iluminada com `--sys-light-focus`; as outras mate. Filete só onde separa
sistemas. Transição entre zonas: corte curto (`--sys-dur-quick`).

- [ ] **Passo 1:** `RailNav.tsx` com `role="navigation"`, marcas com
      `aria-current="page"` na ativa, foco de teclado visível.
- [ ] **Passo 2:** `b1.css` — grelha `[rail] [stage] [oracle]`.
- [ ] **Passo 3:** teclado: setas ↑↓ movem, Enter ativa.
- [ ] **Passo 4:** typecheck, build, verificar no Chrome.
- [ ] **Passo 5:** commit `feat(shell): navegacao B1 em consola vertical`.

## Tarefa 4 — Navegação B2 (órbita)

**Ficheiros:** criar `src/app/nav/OrbitNav.tsx`, `src/app/b2.css`.

Sem barra. O Núcleo ao centro do campo; as 6 zonas dispostas em órbita como
marcas ténues. A zona ativa avança e preenche o campo; as outras recuam com
`--sys-blur-recede` e opacidade. Sem separações visíveis — a profundidade faz o
trabalho da borda. Revelação progressiva: a zona só mostra o segundo nível de
informação depois de chegar à frente.

- [ ] **Passo 1:** `OrbitNav.tsx`, mesma API de `RailNav` (mesmas props).
- [ ] **Passo 2:** `b2.css` com as camadas de profundidade.
- [ ] **Passo 3:** `prefers-reduced-motion` → sem blur animado, troca direta.
- [ ] **Passo 4:** typecheck, build, verificar no Chrome.
- [ ] **Passo 5:** commit `feat(shell): navegacao B2 em orbita`.

## Tarefa 5 — Camada de presença do Oráculo

**Ficheiros:** criar `src/app/oracle/OraclePresence.tsx`, `OracleAmbient.tsx`,
`OracleActive.tsx`, `OracleWarRoom.tsx`.

Três estados, **read-only e simulados nesta fase**. Nada de voz, Hermes,
OpenClaw, n8n ou automações.

- **Ambient** — presença discreta permanente. Uma linha de estado real do
  Sistema, lida do store (ex.: "3 sinais no Radar · 1 decisão pendente"). Não é
  um cartão: é uma faixa fina, mate, sem borda.
- **Active** — expande sobre a zona, que escurece. Conversa, briefing e
  decisões pendentes. Reutiliza o `Conselho` existente onde fizer sentido.
- **War Room** — tomada total: projetos, agentes, riscos, Money Machine.
  **Mock declarado** — cada bloco tem de dizer que é maqueta, porque o Sistema
  nunca mente e uma War Room com números inventados seria exatamente isso.

Invocação: escrever `Oráculo` (ou `/` para focar a entrada). A interface
reorganiza-se à volta dele.

- [ ] **Passo 1:** `OraclePresence.tsx` com `state: 'ambient'|'active'|'warroom'`.
- [ ] **Passo 2:** `OracleAmbient.tsx` a ler contagens REAIS do store.
- [ ] **Passo 3:** `OracleActive.tsx` — expansão + Escape para fechar + foco
      preso enquanto aberto.
- [ ] **Passo 4:** `OracleWarRoom.tsx` com o rótulo de maqueta visível.
- [ ] **Passo 5:** atalho de invocação por teclado.
- [ ] **Passo 6:** typecheck, build, verificar os 3 estados no Chrome.
- [ ] **Passo 7:** commit `feat(oracle): camada de presenca com 3 estados`.

## Tarefa 6 — Camada de atmosfera (direção A)

**Ficheiros:** criar `src/app/atmosphere/Atmosphere.tsx`.

Fornece universo, luz e profundidade por trás da shell. Reutiliza o palco WebGL
existente quando disponível; **quando não há WebGL, degrada para gradientes CSS
e grão** — a shell tem de continuar legível e utilizável.

- [ ] **Passo 1:** `Atmosphere.tsx` a detetar contexto WebGL.
- [ ] **Passo 2:** fallback CSS derivado dos mesmos tokens de luz.
- [ ] **Passo 3:** ler `--sys-quality` e desligar em `reduced-motion`.
- [ ] **Passo 4:** testar com WebGL desligado à força no Chrome.
- [ ] **Passo 5:** commit `feat(shell): camada de atmosfera com fallback sem WebGL`.

## Tarefa 7 — Composição mobile das duas variações

**Ficheiros:** modificar `b1.css`, `b2.css`, `RailNav.tsx`, `OrbitNav.tsx`.

Mobile tem composição própria — não é a versão encolhida. B1: a consola passa a
faixa inferior. B2: a órbita passa a um seletor por gesto horizontal com as
zonas em profundidade. O Oráculo em Ambient ocupa uma linha; em Active toma o
ecrã.

- [ ] **Passo 1:** B1 mobile.
- [ ] **Passo 2:** B2 mobile.
- [ ] **Passo 3:** alvos de toque ≥ 44px.
- [ ] **Passo 4:** verificar a 390×844 e 768×1024.
- [ ] **Passo 5:** commit `feat(shell): composicao mobile de B1 e B2`.

## Tarefa 8 — Captura, comparação e entrega

- [ ] **Passo 1:** `npm run typecheck` e `npm run build`.
- [ ] **Passo 2:** capturar B1 e B2 nas 4 dimensões (8 capturas), com o mesmo
      estado semeado, mais o HUD atual como referência.
- [ ] **Passo 3:** medir em cada variação: altura do documento, número de
      elementos acesos em simultâneo, contraste dos textos de apoio.
- [ ] **Passo 4:** consola e network limpos; comparar o bundle com o da Fase 1.
- [ ] **Passo 5:** responder, para cada variação: "Parece Sistema ou parece um
      dashboard AI?" — com o argumento, não só o veredicto.
- [ ] **Passo 6:** atualizar o SPEC com o resultado da Fase 2.
- [ ] **Passo 7:** commit `docs(spec): resultado da Fase 2 e comparacao B1/B2`.

---

## Riscos

| Risco | Mitigação |
| --- | --- |
| Tokens vazam e alteram o HUD atual | Passo 5 da Tarefa 1 é um gate explícito de identidade pixel a pixel |
| `hud.css` (543 blocos) luta com a shell | Painéis reutilizados sem edição; a shell só fornece a moldura à volta |
| Colisão de nomes com `src/Stage.jsx` | O host de zona chama-se `ZoneStage.tsx` |
| Duas variações duplicam código | Mesma API de navegação; a diferença vive em CSS e composição |
| A fase incha para redesenho de módulos | Barreira explícita: os 19 painéis não se editam nesta fase |

## Rollback

Cada tarefa é um commit próprio e reversível. A shell inteira está atrás de
`?shell=`; sem o parâmetro, o Sistema é exatamente o que era. O rollback total é
`git revert` dos commits da fase — nenhum toca em lógica, estado ou dados.
