# DESIGN-DECISIONS — registo de decisões visuais da Missão 26

> Aberto 2026-07-28. Uma linha por decisão tomada, com data, motivo e o que
> ficou por decidir. Serve para não se voltar a discutir o que já foi fechado —
> e para saber porquê quando alguém perguntar daqui a três meses.

## Formato

Cada entrada tem: **data · decisão · porquê · alternativa rejeitada · onde vive
no código**. Sem o "porquê", é só um registo de que alguém mudou de ideias.

---

## Decisões fechadas

### 2026-07-25 · Direção B2.1 — Órbita Instrumental

**Decisão:** a shell, o Núcleo, a cosmologia, a atmosfera, a navegação e o
Oráculo seguem a direção B2 (Órbita). Os princípios arquitetónicos da B1
(Consola) aplicam-se **apenas dentro de zonas densas**.

**Porquê:** a B2 pura falhou o teste difícil na zona Operações — 5,94 ecrãs,
painéis de 277px, 797px desperdiçados. O diagnóstico não foi conceptual: era o
`max-width: 68ch` aplicado a todas as zonas. A densidade passou a ser dado
(`reading` vs `instrument`), não estilo.

**Alternativa rejeitada:** B1 como direção principal — produzia uma sidebar de
SaaS.

**Onde vive:** `src/app/zones.ts`, `src/app/instrumental.css`.

---

### 2026-07-25 · A luz tem um portador por zona

**Decisão:** em cada zona, um só elemento carrega a luz (`--sys-mat-active` +
`--sys-glow-inner`). Os restantes são transparentes.

**Porquê:** impede o regresso à parede de 19 caixas iguais. Luz comunica foco.

**Onde vive:** `instrumental.css`, regra `.sys-zone-body:not(:has(.panel:focus-within)) > .sys-group:first-child .panel`.

---

### 2026-07-28 · No Universo, o portador da luz é o céu

**Decisão:** o painel das Constelações dissolve-se — sem fundo, sem sombra, sem
padding lateral. A zona inteira alinha a 32px.

**Porquê:** com o céu do palco visível por trás, o painel criava **dois céus com
uma fronteira reta**. A zona chama-se Universo e o universo estava numa caixa.
A lei da luz não é quebrada: o Universo tem portador, e é o céu.

**Alternativa rejeitada:** manter a caixa e escurecer o céu por trás — resolvia
a fronteira apagando a coisa boa.

**Onde vive:** `instrumental.css`, `.sys-zone[data-zone='universe']`.

---

### 2026-07-28 · O botão primário está calado em repouso

**Decisão:** dentro da shell, `.btn` perde o gradiente violeta cheio. Fica borda
a 24% e acende no hover ou no foco de teclado.

**Porquê:** sete botões no brilho máximo, todos parados. Luz comunica estado, e
um botão em repouso não tem estado que justifique ser o elemento mais brilhante
do ecrã.

**Alternativa rejeitada:** acender só quando o campo associado tem conteúdo —
mais preciso, mas a marcação difere por painel e tornava a regra frágil.

**Onde vive:** `instrumental.css`, secção "Botões primários".

---

### 2026-07-28 · O véu da shell fica a 0.45

**Decisão:** `.sys-shell` mantém `rgb(4 3 10 / 0.45)`.

**Porquê:** é o ponto onde o céu procedural se vê e o texto continua legível.
Confirmado pelo Daniel depois de ver o resultado.

**Onde vive:** `src/app/shell.css`.

---

## Decisões em aberto

Nenhuma destas se decide sozinha. Ficam registadas para não se perderem.

| Assunto | Estado | Bloqueio |
|---|---|---|
| **Fase 5** — vista "Hoje" / grupos / índice | à espera | teste real do Daniel |
| **Modo Estação** — renascer / absorver / reformar | à espera | decisão do Daniel |
| **Composição do Oráculo** | por abrir | hoje lê-se como três blocos de texto com uma caixa de escrita. A Constituição diz que não é uma caixa de chat |
| **Colunas de leitura em ecrã largo** | não mexer | 643px centrados em 1440px é o conceito Órbita aprovado. Só se mexe por decisão explícita |
| **TypeScript, Motion/Framer, R3F, Drei, pós-processamento, Vercel** | por decidir | matriz de tecnologia da migração |
| **ffmpeg como dependência** | por decidir | hoje é um binário portátil fora do projeto; ver `00_READ_ME_FIRST.md` |
| **Transição entre zonas** | sem referência | a referência que existia é um PNG estático (R27) |

## O que esta missão não vai fazer

Registado para travar deriva:

- não repetir a migração React/Vite — está feita (Missão 25);
- não migrar para Tailwind, Next.js ou shadcn por influência de skills;
- não trocar a tipografia por indicação de uma skill de design;
- não alterar produção sem gate explícito.
