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

---

### 2026-07-28 · Curvas de motion derivadas de referência, não de gosto

**Decisão:** cinco tokens novos em `motion.css`, cada um com o ID da referência
que o originou: `--sys-ease-gravity` (R15), `--sys-ease-contract` (R17),
`--sys-ease-breath` (R19/R01), `--sys-cycle-ambient` 7,2 s, `--sys-cycle-attend`
3,4 s. Mais `--sys-rise`/`--sys-fall` como direção semântica.

**Porquê:** um easing escolhido por parecer bem não se pode defender nem
revisitar. Com o ID da referência, qualquer decisão futura sabe de onde veio.

**Alternativa rejeitada:** reutilizar `--sys-ease-out` para tudo. Fá-lo-ia
parecer coerente, mas apagaria a diferença entre um evento com massa e um
feedback de toque — que é precisamente a distinção que a gramática 3 exige.

**Onde vive:** `src/design-system/tokens/motion.css`.

---

### 2026-07-28 · Sigilo do Oráculo — onda (R01), não esfera (R19)

**Variantes consideradas:** duas, e a comparação foi real.

| | **A — esfera de fitas** (R19) | **B — onda horizontal** (R01) ✅ |
|---|---|---|
| Origem | a referência mais bonita das duas | a única já na paleta certa |
| Identidade | **esfera violeta a pulsar = retrato-robô do assistente de AI**; a missão proíbe por nome | horizontal, sem centro, sem contorno — não tem sósia óbvio |
| Encaixe | exige área quadrada; a faixa tem 20 px de altura | nasceu horizontal; encaixa onde a presença já vivia |
| Custo | esfera credível exige canvas ou muitas camadas | 3 paths SVG, anima só `transform` |

**Decisão: B.** A esfera é mais bonita isolada e pior como produto — ganharia um
elemento memorável à custa de parecer o que toda a gente já viu.

**Porquê funciona:** a amplitude e o ritmo são função do número de sinais
**reais**. Não há estado "bonito por defeito": o repouso é o mínimo de movimento
que ainda se vê. Medido — silêncio 0,7 px de pico; quatro sinais 11,7 px; rácio
16,7×. O alerta muda a **cor**, não o ritmo: acelerar seria pânico, e a
Constituição pede um moderador.

**Alternativa rejeitada dentro de B:** acelerar o ciclo com o alerta. Rejeitada
por transformar informação em urgência.

**Reduced motion:** o ciclo pára, a amplitude **fica**. É informação, não
enfeite.

**Onde vive:** `src/app/oracle/OracleSigil.tsx` + `oracle-sigil.css`.

**Erro registado:** a primeira versão tinha três paths que eram linhas retas
(pontos de controlo todos a y=10). `scaleY` sobre uma linha sem altura não faz
nada — as métricas diziam `scaleY(1.6)` e eram verdade, mas media-se um número
certo de uma coisa invisível. Só se apanhou por olhar para o screenshot em vez
de confiar na medição. Lição para as fases seguintes: **uma métrica não
substitui um olho**.

---

### 2026-07-28 · Rank como manómetro (Fase E)

**Decisão:** a letra do rank e a fração de progresso passam a ser **um único
instrumento**. Letra ao centro (qual), anel à volta (quanto), rótulo com o
destino ("Rank E → D") — que é o que o anel não sabe dizer.

**Porquê:** origem R25. Antes eram dois pedaços da mesma frase em sítios
diferentes do cartão: um crachá que não dizia nada e uma barra horizontal
noutro sítio. A barra foi removida — mostrar o mesmo número duas vezes no mesmo
cartão é ruído, não redundância útil.

**Rejeitado da referência:** o ciano flamejante e as unidades falsas ("rpm").
A cor vem de `r.color` (rank real), o anel de `rankFrac` (progresso real). Um
manómetro sem valor verdadeiro seria um crachá com pretensões.

**Cuidado técnico:** o id `#rankbadge` mantém-se — o `fx.js:76` e o
`stage/main.js:66` leem-no para a cerimónia de rank-up e para apontar um efeito
do palco. A chamada a `Motion.fillBar` ficou guardada pela existência do
elemento, para repor a barra não exigir mais nenhuma alteração.

**Medido:** letra `S`, anel a 0,556, cor `rgb(251,191,36)` do rank, `#rankbadge`
intacto, barra antiga removida.

---

## ⚠ Decisão que NÃO tomei sozinho — o avatar

`src/assets/avatar.js` é um JPEG em base64 (17 KB) com um retrato de estilo
**anime**, herdado do Vanilla.

A missão diz, textualmente: *"Não usar personagens de anime ou arte externa como
representação final"* e *"a identidade deve parecer um registo vivo de um
operador real"*.

**Não o removi**, e a razão é que isto não é uma decisão de design — é a cara que
o Daniel escolheu para se representar. Apagá-la por interpretação de uma regra
seria eu a decidir sobre a identidade dele.

Três caminhos, para escolher:

- **A** — manter. A regra passa a ser lida como "não gerar arte de anime nova",
  e o avatar existente é uma escolha pessoal explícita.
- **B** — substituir por um sigilo **procedural** derivado dos dados reais
  (níveis por domínio, streaks, títulos): uma forma que muda com a evolução e
  que é, literalmente, um registo vivo. Original, sem licença de terceiros.
- **C** — remover e deixar só o manómetro e o nome. O mais austero, e talvez o
  mais coerente com "instrumento, não menu de RPG".

Sem resposta, fica **A** — a opção que não destrói nada.

---

### 2026-07-28 · Avatar → sigilo procedural (opção B)

**Decisão:** o retrato de estilo anime herdado do Vanilla é substituído por um
**sigilo derivado dos dados reais**. Escolha do Daniel entre as três opções
registadas acima.

**Como funciona:** seis vértices, um por domínio, com o raio dado pelo nível real
normalizado pelo mais alto. Uma teia de referência por trás mostra onde a forma
estaria se tudo fosse igual — sem ela um polígono sozinho não tem contra o quê
ser lido, e o desequilíbrio não se veria. Cor de preenchimento = rank. Um ponto
por vértice na cor do domínio.

Piso de 0,22 no raio: um domínio a zero continua a **existir**, só não tem
alcance. Colapsar o polígono num ponto diria que o domínio não conta.

**Porquê:** um retrato fixo é igual no dia em que começas e no dia em que chegas
a Rank S. A missão pede uma identidade que pareça "um registo vivo de um
operador real" — isto é literalmente isso: se os dados mudarem, a cara muda.

**Origem visual: nenhuma.** Não havia referência para isto na biblioteca. Fica
registado, porque uma decisão sem origem declarada é uma decisão que ninguém
pode contestar depois.

**Reversível:** o `src/assets/avatar.js` **não foi apagado**. Voltar atrás é
reimportar o `AVATAR` e trocar o componente pelo `<img>` — uma linha em cada
sítio.

**Correção a meio:** a primeira versão trazia um anel próprio com a streak.
Duplicava o "MELHOR STREAK" que está a dois centímetros no mesmo cartão, e
ficava colado ao anel de XP que já envolve o avatar — dois anéis concêntricos
com dados diferentes a 6px não se leem. O anel saiu; a streak ficou só na
leitura para leitor de ecrã.

**Medido:** 6 vértices, 6 pontos de domínio, cor `rgb(251,191,36)` do rank,
leitura completa em `.sr-only`, `<img>` antigo ausente do DOM.

---

### 2026-07-28 · Fase 5 — resolvida por medição, sem intervenção estrutural

**Contexto:** a Fase 5 nasceu para decidir como reduzir a zona Operações, que
media 5,94 ecrãs na B2 e 3,81 na primeira composição. Três opções em aberto:
**A** vista "Hoje", **B** grupos, **C** índice.

**Medição de hoje, depois da Fase F:** com 5 missões, Operações mede
**2807px de conteúdo em 621px visíveis = 4,52 ecrãs**.

**Decisão: nenhuma das três.** O problema que a Fase 5 ia resolver por estrutura
foi resolvido por densidade — tirar as molduras às linhas de missão, hábito,
métrica e calendário encolheu a zona sem esconder um único dado.

Porque não cada uma:

- **A · vista "Hoje"** — é uma funcionalidade de produto, não uma correção de
  composição. Criaria um segundo sítio onde a verdade vive, e a decisão sobre
  o que é "hoje" teria de ser tomada em vez de mostrada. Fica no backlog como
  ideia de produto, não como remédio de layout.
- **B · grupos** — **já existem** desde a Fase 3 (`zones.ts`: prioridade, rotina
  e execução, revisão e recuperação). Estava resolvida antes de ser proposta.
- **C · índice** — a 4,52 ecrãs não se justifica. Um índice para saltar entre
  sete painéis a menos de cinco ecrãs acrescenta um controlo para poupar um
  gesto de scroll.

**O que fica registado:** o Daniel proibiu explicitamente perseguir a meta dos
cinco ecrãs "através de compressões marginais, redução de legibilidade ou
ocultação arbitrária de conteúdo". Não se comprimiu nada, não se escondeu nada,
e a legibilidade **subiu** — os títulos ganharam o peso que as caixas lhes
roubavam. A meta foi atingida por consequência, não por perseguição.

**Reaberta se:** a zona voltar a passar dos 5 ecrãs com dados reais do Daniel.
Nessa altura a opção A é a primeira a reconsiderar, e como funcionalidade.
