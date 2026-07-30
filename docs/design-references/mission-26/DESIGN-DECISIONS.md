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

---

### 2026-07-29 · Command Core — a Próxima Ação substitui a faixa de prazos

**Decisão:** o `DeadlineBanner` sai do Núcleo. A informação que ele dava passa a
dois sítios com verbo: as missões urgentes tornam-se a **Próxima Ação** (visor
da coluna direita), os eventos a ≤7 dias tornam-se o **Horizonte** (coluna
esquerda). O componente **não foi apagado** — o HUD sem `?shell=`, que é o que
serve produção, continua a usá-lo.

**Porquê:** a faixa era o elemento mais brilhante do ecrã, ocupava a largura
toda e **não era acionável**. Anunciava "URGENTE" e deixava o Operador a
procurar onde resolver. Pior para a lei da luz: um alerta a gritar e um visor de
ação são dois portadores em competição, e dois portadores são zero hierarquia.

A urgência passa a ser o **motivo** da ação, num filete de 3px à esquerda do
visor e num rótulo mono. A mesma informação, uma fração do peso visual, no sítio
onde tem botão.

**Alternativa rejeitada:** manter a faixa e baixar-lhe o contraste. Resolvia o
brilho e mantinha o problema real — dizer duas vezes, uma delas sem saída.

**Onde vive:** `src/app/core/next-action.ts` (read model),
`NextAction.tsx`, `CoreQueue.tsx`, `CoreHorizon.tsx`, `command-core.css`.

---

### 2026-07-29 · O Núcleo passa a zona `instrument`, com colunas invertidas

**Decisão:** a zona `core` deixa de ser `reading` e passa a `instrument` com
duas colunas — **Estado** (esquerda) e **Ação** (direita) — e uma razão de
colunas própria, `1fr / 1.25fr`, declarada no registo (`zones.ts`, campo
`columns` novo).

**Porquê:** como `reading`, os painéis empilhavam-se numa faixa e a metade
direita do ecrã ficava sem função (item 1 do diagnóstico). E a razão padrão das
zonas instrumentais (1.55/1) daria à identidade do Operador mais largura do que
à ação, que é o contrário da hierarquia desta zona.

**Alternativa rejeitada:** uma regra CSS condicionada ao nome da zona. O registo
existe precisamente para a composição ser dado; uma exceção por nome no CSS teria
sido a primeira fissura nessa disciplina.

**Equilíbrio medido:** primeira versão 895px (ação) contra 649px (estado) — a
coluna direita transbordava e as saídas da decisão caíam abaixo da dobra. Mover
o Horizonte para a esquerda pôs as colunas a **612 / 720**, e a zona a 794px de
conteúdo em 621 visíveis (1,28 ecrãs, contra 5,94 da B2 pura).

---

### 2026-07-29 · O botão da Próxima Ação é a exceção à regra dos botões calados

**Decisão:** `.cc-act-go` é o único botão preenchido e aceso da shell.

**Porquê:** a decisão de 2026-07-28 calou os botões primários porque eram sete,
todos parados, todos no brilho máximo — luz sem estado. Este tem estado: é o
Sistema a dizer o que fazer a seguir, e é o portador da luz desta zona. Os
`.mini` da Decisão ficam calados pela mesma lei — se acendessem os dois, a
decisão competiria com a ação, e a precedência que a Próxima Ação estabelece
seria desmentida pelo ecrã.

**Contraste, medido:** o gradiente do `.btn` do HUD começa em `#8b5cf6` e, com o
texto escuro encostado à esquerda, dá **4,08:1** — abaixo dos 4,5. Baixar a letra
para preto puro chegava a 4,53, uma passagem por dois centésimos. O gradiente
passa a começar no violeta de identidade `#a78bfa` → **6,05:1**.

---

### 2026-07-29 · Interpretação do "briefing contextual do Oráculo"

**Contexto:** a decisão de produto fechada diz que a metade direita é *Próxima
Ação + briefing contextual do Oráculo*.

**Decisão:** o briefing foi implementado como a **fila, a decisão e o horizonte**
— leituras de instrumento com evidência — e **não** como uma segunda lista de
bullets ao lado do `OracleBriefing` que já existe na presença do Oráculo.

**Porquê:** os dois leriam a mesma fonte (missões vencidas, pilares por fechar,
arco por decidir, relatório) e diriam o mesmo com palavras diferentes, a 300px
de distância. Duplicar era o erro que esta missão corrige desde a Fase E.

**Fica em aberto:** a coluna da ação não tem atribuição visível ao Oráculo. É
deliberado — a presença do Oráculo é a faixa, e a Constituição diz que ele não é
um cartão. **Se o Daniel quiser a voz do Oráculo explícita nesta coluna, é uma
decisão dele e não minha**, porque muda a natureza da coluna de "instrumento do
Sistema" para "o Oráculo a falar".

---

### 2026-07-29 · A fronteira Sistema / Oráculo no Command Core

**Decisão do Daniel:** a coluna da ação continua a ser um instrumento do
Sistema; interpretação, prioridade explicada, risco e decisão sugerida passam a
ter atribuição explícita ao Oráculo.

**Como se implementou a fronteira**, e é uma regra que o código tem de resistir
a quebrar: o read model (`oracleRead.ts`) recusa-se a repetir um facto que o
visor mostra ao lado. De "1 prazo vencido" — que é do Sistema — só pode nascer
*"está à frente por ser o único prazo já passado; as outras 3 missões esperam
sem custo"*, que é o que aquele facto significa para a ordem de trabalho.

**Curto por lei:** duas falas, uma ou duas linhas. A análise extensa é da zona
Oráculo. Cada fala traz o `because` — a condição verificável que a produziu —
no `title`, para auditar sem sujar o corpo do texto.

**Distingue-se por três marcas, nenhuma decorativa:** o sigilo de onda (R01, a
única marca do Oráculo no produto), o rótulo em mono, e um filete no material do
Oráculo. Sem caixa, sem fundo próprio, sem avatar — a Constituição proíbe o
cartão de assistente, e uma voz não é um objeto.

**Nada disto chama um modelo.** É leitura local e determinística. O que custa
dinheiro e latência é o Conselho, e continua a ser um sítio próprio.

**Origem visual:** R01. **Rejeitado:** a esfera da R19 (o retrato-robô do
assistente de AI), qualquer avatar, e o formato de bolha de chat.

---

### 2026-07-29 · Fase 6A — a fila de eventos e o regime de movimento

**Decisão:** dois canais de anúncio, com fronteira declarada.
**SYSTEM EVENT** (fila, com consequência) para acontecimentos do mundo — missão
erguida, pilar fechado, nível, arco aceite, conquista. **Toast** (o herdado, um
de cada vez) para validação de formulário — "falta info", "data inválida",
"trava do Sistema".

**Porquê dois:** misturá-los faria da fila de eventos um caixote. Uma resposta a
um formulário não é um acontecimento. O que não podiam era ocupar o mesmo pixel
— e ocupavam: medido, os dois em `bottom: space-7 + 1.5rem`, sobrepostos e
ambos ilegíveis. O SYSTEM EVENT sobe, porque é o que tem consequência.

**O evento nasce depois da escrita, e isso é estrutural.** A primeira versão
confiava em cada sítio de chamada se lembrar de emitir depois do `save()`. Não
sobreviveu ao primeiro caso real: o `addXp` anuncia subidas de nível a meio da
ação, antes de qualquer escrita, e tem dez sítios de chamada. Agora quem emite
**encena** e o `save()` é que publica — ou deita fora, se a escrita local
falhar.

**Alternativa rejeitada:** esperar pela gravação na nuvem. É debounced a 900ms;
poria o feedback a um segundo do gesto e não seria mais verdadeiro — o dado já
está seguro no dispositivo, e quem diz se a nuvem falhou é o estado de
sincronização, que existe desde a Fase I.

**A causa antes da consequência:** o nível subia antes de a missão ser
anunciada. A ordem passou a ser por significado, não por ordem de chamada.

**Regime de movimento:** quatro sinais (reduced-motion, poupança de dados,
bateria, separador escondido) lidos num sítio e escritos em `<html
data-motion>`. `paused` **congela** com `animation-play-state` em vez de
desligar — quem muda de separador e volta não vê o mundo a recomeçar. `calm`
corta só o AMBIENT, que é o único custo contínuo.

**Origem visual:** R15 e a gramática 1 — a energia converge para dentro. O traço
do anúncio atravessa na direção do Núcleo e corre **uma vez**; um ciclo diria "a
processar", e isto terminou. **Rejeitado:** o bloom a 100%, as partículas de
celebração (dizem o oposto da convergência) e qualquer moldura de videojogo.

---

### 2026-07-29 · Fase 7 — Arc Engine data-driven

**Decisão:** o arco ativo lê-se num só sítio (`arcModel.ts`) e chega ao CSS como
duas cores e uma direção. Nenhum componente pergunta "isto é o Summer Arc?".

**Porquê:** condição explícita do Daniel. Um `if (arc.id === 'summer')` em cinco
ficheiros significa que o Bloom Arc exige cinco alterações — e a lei é que a
progressão muda o mundo, não que se reconstrói a aplicação de estação em
estação.

**A prova está no ficheiro:** o Bloom Arc são quatro linhas de CSS. Não existe
`<BloomLayer/>`. Verificado no browser: trocar `--arc-accent`,
`--arc-accent-soft` e `data-arc-flow` muda o mundo de âmbar para verde sem tocar
em código.

**O que a camada sazonal pode mexer:** atmosfera, cor **secundária**, motivo,
transições. **O que não pode:** estrutura, legibilidade, navegação, semântica de
perigo, acessibilidade.

**Estados por implementar, e ficam declarados:** `milestone`, `climax` e
`archived` estão no tipo porque a máquina de estados é a aprovada, e
`arcState()` **nunca os devolve**. O domínio não tem onde guardar um marco
atingido; inventá-lo seria mostrar um marco que ninguém atingiu.

**Correção medida:** a primeira versão punha a camada só no fundo do ecrã.
`elementFromPoint` mostrou que a faixa do Oráculo e os painéis a cobriam quase
toda — o Sistema dizia que o mundo tinha mudado e o mundo estava igual. A
estação passou a entrar também na luz da zona, com o violeta a dominar 72/28.

---

### 2026-07-29 · Corpo e Recuperação — conteúdo de saúde com fonte

**Decisão:** nenhuma série, duração ou aviso entra sem fonte oficial
identificada e datada. As fontes vivem em `src/app/body/routines.ts` e aparecem
no produto, com ligação, junto de cada rotina.

| Fonte | Usada para |
|---|---|
| Cambridge University Hospitals NHS FT | identificação do músculo; não contrair glúteos/pernas/abdómen; **não usar parar o jato de urina como exercício** |
| North Tees and Hartlepool NHS FT | contração lenta 5 s × 8, rápidas × 10, ≥3× por dia |
| NHS — *10 ways to stop leaks* | respirar normalmente; meses até haver benefício |
| Worcestershire Acute Hospitals NHS Trust | posição de repouso da mandíbula, chin tuck 3–5 s × 8–10, abertura controlada × 8–10, lista do que evitar |
| Dynamic Health (NHS) | mobilidade cervical 5 s × 5–10, retração escapular, red flags |

**Divergência entre fontes, e como foi resolvida:** North Tees indica 5 s × 8;
Cambridge indica ≥10 contrações até 6× por dia sem duração; o NHS indica 2 s a
subir até 10 s. O Sistema usa o **conservador** — 5 s, 8 repetições, 3× por dia
— e **não sobe automaticamente**, porque subir depende de manter a técnica e o
Sistema não consegue ver isso. A divergência fica escrita no ficheiro.

**Excluído por não ter fonte oficial:** treino de "jawline", mastigação
excessiva, dispositivos de resistência, neck bridges, amplitudes forçadas.

**Demonstrações:** quatro figuras SVG originais, animadas pelo valor das fases.
Zero assets externos. **Abstratas de propósito** — uma silhueta sem rosto mostra
direção, amplitude e ritmo, que é tudo o que um exercício precisa de comunicar;
o pavimento pélvico é um *diagrama* de bacia, não um corpo.

**Sem regra de XP nova:** `logBodyRoutine` regista com ganho **zero**.
Verificado: `totalXP` igual antes e depois. Quanto vale o pavimento pélvico é
uma decisão do Daniel, não minha.

**Dois bugs apanhados na passagem:** o overlay dentro do palco ficava por baixo
da órbita (`.sys-stage-wrap` cria contexto de empilhamento) → portal; e ao sair
para o `<body>` o portal perdeu as correções da shell e a nota do Sono voltou a
2,25:1 → a classe `sys-instrumental` no overlay repõe-nas.

---

## Defeitos anteriores apanhados na Fase 5

Nenhum foi introduzido por esta fase. Ficam registados porque foram medidos.

| Defeito | Causa | Estado |
|---|---|---|
| `prefers-reduced-motion` não parava 12 animações | `*` não seleciona pseudo-elementos, e todas as animações decorativas do HUD vivem em `::before`/`::after` (`ringpulse`, `tipglow`, `cornerbreath`, `menteDrift`, `vincTwinkle`) | **corrigido** — `*,*::before,*::after`; medido: 12 → 0 |
| `.sys-group-name` a 3,23:1 | `--sys-ink-far` (bone a 40%) sobre o vazio, a 13px | **corrigido** — sobe a `--sys-ink-mut`. A auditoria da Fase J deu "zero falhas" e esta classe já lá estava: o método é que não compunha opacidades sobre o fundo |
| `.sys-sync-slot` por cima da faixa de comando em mobile | fixo no canto inferior direito, que em ≤900px é onde a órbita passa a viver | **corrigido** — passa a linha da grelha |
| Texto de ajuda do `at.exe` dentro de dois comentários de `instrumental.css` | interpolação de shell numa sessão anterior escreveu a saída de um comando dentro do ficheiro | **corrigido** — comentários reescritos |
| `.panel::before` — filete ciano de 34px a respirar 7,9s | herdado do HUD, onde marcava o canto de um cartão; na shell os painéis não têm caixa | **removido na shell** — animação decorativa e borda, as duas proibidas |

---

### 2026-07-29 · Relatório do Oráculo — camadas, não parede

**Decisão:** sete camadas com progressive disclosure, em vez de catorze campos
com a mesma largura, cor e densidade.

**O que tornou isto seguro:** o relatório **já chega estruturado**. Antes de
escrever uma linha inspecionei o que a Edge Function devolve — `report.report` é
um objeto JSON com campos nomeados. Não houve parser, não houve
`dangerouslySetInnerHTML`, não houve heurística de emojis. Verificado: zero
`<script>`, zero `innerHTML` no subárvore.

**O que acrescenta valor novo:** cada sinal do Oráculo passa a ter ao lado a
**evidência local do Sistema**. O Oráculo diz "média abaixo do alvo"; o Sistema
mostra "média 7d 7,5h". Quando não coincidem, vê-se — e ver isso vale mais do
que a frase.

**Nada se perde:** a análise completa percorre o objeto inteiro. Um campo que o
componente não conhece aparece com a própria chave. Verificado com um campo
inventado no teste.

**Alternativa rejeitada:** reescrever a Edge Function para devolver as camadas
prontas. Teria acoplado uma decisão de apresentação a um serviço com custo e
latência, e obrigaria a um deploy para mudar a ordem de dois blocos.

---

### 2026-07-29 · Summer Arc — preview e cerimónia

**Decisão:** aceitar um arco deixa de ser um clique de passagem. O botão do
Command Core abre um preview em ecrã inteiro, e é lá que se decide.

**Porquê:** um arco dura meses, muda multiplicadores, acrescenta missões e
altera a atmosfera. Decidir isso num botão de 26px entre duas linhas de texto é
pedir uma decisão de estação com a cerimónia de um checkbox.

**O que o preview mostra, tudo com dados reais:** mapa temporal (início, hoje,
fim), domínios com o multiplicador verdadeiro, o que aceitar faz (as missões que
entram, com nome e domínio), o que acontece se ignorar, e a pergunta do arco.

**O que NÃO inventa:** marcos. O domínio não guarda marcos atingidos. Um marco
no mapa seria prometer uma cerimónia que nunca ia acontecer.

**Sigilo procedural:** um desenho, quatro arcos. O comprimento e a inclinação
dos raios são função do `flow` do motivo, por isso um arco novo ganha sigilo sem
ninguém abrir o ficheiro. Origem R15 e gramática 1 — os raios **apontam para** o
núcleo, não saem dele. Rejeitado: o emblema, o brasão, o contorno grosso.

**A cerimónia só começa depois de a escrita passar.** `arcAccept` devolve o
resultado da gravação; se falhar, não há sigilo a formar-se — há uma mensagem a
dizer que não ficou guardado e um botão para repetir.

**Escala autorizada pela raridade:** é a única superfície do produto que pode
ser cena em vez de instrumento, e só porque acontece uma vez por estação.

### 2026-07-30 · Universo — a câmara é o estado, o gesto é um desvio

O problema que isto resolve, e é o mais difícil da zona: uma máquina de estados
e uma câmara manual querem os dois mandar na mesma `transform`.

**Decisão.** O estado manda na **escala**; o gesto produz um **desvio** que se
soma. `translate3d(calc(cam-x + free-x), …)`, num sítio só. Não são duas
camadas — se fossem, o parallax das camadas profundas aplicava-se a uma e não
à outra, e olhar à volta deixava de parecer espaço.

**Consequências, as duas deliberadas.** Arrastar nunca troca de escala: olhar à
volta não é viajar. E a roda **acumula** desvio em z e, ao passar um limiar,
**compromete** uma transição e volta a zero — o gesto é contínuo, o destino é
discreto, e a passagem tem um sítio definido em vez de duas máquinas a lutar.

**O gesto não escolhe destinos.** Pergunta "mais fundo" ou "recua"; quem resolve
é o reducer, que é quem sabe onde estamos. Uma roda que soubesse escolher
domínios era uma segunda máquina de estados escondida num handler.

**A roda exige Ctrl/⌘.** Não é timidez: a cena ocupa 558px de um contentor com
2620px de conteúdo por baixo, e capturar a roda prendia lá quem passasse o rato.
Convenção de mapa embebido, pela razão exata que a criou.

**Os limites são calculados.** 200×60 no largo, 90×34 no estreito, derivados da
folga real entre o domínio mais exterior e o bordo. A primeira escolha (260×150)
tornava o domínio do topo inalcançável — clipado pelo `overflow:hidden`.

---

### 2026-07-30 · Uma cerimónia de cada vez, e quem cede é quem não tem substituto

O ARISE escurece o ecrã inteiro a 60% durante 2,65s. No Universo isso caía por
cima do momento que o Universo existe para mostrar.

**Decisão.** A cerimónia global cede o palco quando a zona ativa encena a sua.
O Universo marca `data-sky-live` no `<html>`; o `cineArise` lê e cala-se.

**O critério não é "no Universo não há cerimónias".** É **haver substituto**. A
conclusão de missão tem um substituto local e melhor — diz qual domínio recebeu
o quê, coisa que a palavra ARISE nunca soube dizer. Uma **conquista** não tem:
o satélite dela é um ponto de 4px no bordo do enquadramento, e por isso a
cerimónia global fica.

**Corolário que já custou uma regressão:** um facto = um canal de anúncio. Ao
ligar o evento de rank à fila, ficaram dois — o SYSTEM EVENT e o toast antigo do
`rankCeremony`, sobrepostos. É a avaria que a fila foi criada para resolver na
Fase 6A. As **palavras** vêm da fila; a **reação** (Bus, emblema, poeira) fica
onde estava.

---

### 2026-07-30 · O registo ganha domínio — e o que isso NÃO passa a saber

**Decisão de dados, tomada pelo Daniel** depois de o custo ter sido apresentado
duas vezes. `plog` ganha um quarto argumento opcional `attr`.

**O que passa a ser possível:** ver o que está a alimentar o **nível em curso**
de um domínio. É a única parte ainda em formação, a única que pode recuar, e a
única sobre a qual há decisão a tomar hoje.

**O que continua impossível, e tem de estar escrito onde alguém o leia antes de
tentar:** "que evidência fez a sétima estrela de Saber". Os níveis vêm de XP
acumulado ao longo de meses e o registo guarda **catorze entradas**. Nenhum
campo novo muda isso — a informação nunca existiu. Uma vista que o afirmasse
estava a inventar.

**As entradas antigas nunca terão dono.** O campo é aditivo. A leitura conta-as
e declara-o por extenso, em vez de as esconder ou de lhes atribuir um domínio
plausível. Um registo que aparecesse com menos linhas do que tem seria uma
omissão silenciosa.

**Um sítio ficou sem `attr` de propósito:** o título real. Não tem um domínio
só, e inventar-lhe um era pior do que a ausência.

---

### 2026-07-30 · O Núcleo é a soma, por isso pode ser decomposto

A chegada ao Núcleo era dramática e não pagava — um destino sem conteúdo é um
ecrã de fim de nível.

**Decisão.** `overallLevel` é literalmente a soma dos seis níveis menos cinco.
O Núcleo **não é uma metáfora de progresso**: é a soma. Entrar nele passa a ser
ver a conta — seis veios com a espessura da contribuição real, entrando pelo
ângulo do respetivo domínio para a continuidade espacial ser real e não
sugerida.

**Verificação obrigatória para uma vista destas:** o *share* implícito na
espessura desenhada tem de bater certo com o *share* real. Bate, até à quarta
casa decimal nos seis.

**O arco de rank não se desenha no último rank.** `max: 9999` é um sentinela de
código. Uma barra a 0,4% seria o Sistema a afirmar que quase não há progresso
quando o que não há é banda definida. Diz-se por extenso.

---

### 2026-07-30 · Regra de custo da cena 3D — quem tem profundidade não anima

Três erros da mesma família, todos medidos, e a regra que fica.

1. **Uma transform aplicada a conteúdo dentro de um SVG não é composta** —
   obriga a repintar o desenho inteiro a cada frame. Pôs a chegada ao Núcleo a
   50ms. As camadas do Núcleo passaram a `<svg>` próprios, e quem roda é o
   elemento.
2. **Um `@keyframes` que anima `transform` SUBSTITUI o transform do elemento.**
   A deriva da poeira estava a apagar o `translateZ(-1400px)` e o desvio do
   cursor: a camada aparecia como `matrix()` 2D. A deriva passou para filhos.
3. **A perspetiva tem de entrar na conta da escala.** Uma camada a −520px com a
   câmara a +780 é ampliada 1100/(1100−260) = 1,31, e ignorá-lo fez um desenho
   de 620 unidades renderizar a 617px num quadro de 558.

**A regra:** quem tem profundidade não anima, quem anima não tem profundidade.

**E uma sobre método:** sem GPU esta zona media 33ms e concluí que a culpa era
das camadas ambiente. A bissecção mostrou que desligar animações uma a uma não
mudava nada e só esconder a cena devolvia os 16,7ms — o custo era **compor a
subárvore 3D por software**. Com GPU: 8,3ms. Uma medição num ambiente que não é
o do utilizador é um sintoma, não um diagnóstico.

### 2026-07-30 · Fase 7Z — capacidades de arco: um comentário não é uma garantia

**Decisão formal do Daniel.** Estados utilizáveis: `proposed`, `accepted`,
`active`, `completed`, `declined`. Declarados e indisponíveis: `milestone`,
`climax`, `archived`.

**O que estava errado antes.** Os três indisponíveis eram membros de `ArcState`
com um comentário a dizer que `arcState()` nunca os devolvia. Isso é um acordo,
não uma garantia: bastava alguém escrever `return 'milestone'` e o compilador
deixava passar.

**O que passou a ser.** Saíram da união. Vivem em `ArcGatedState`, um tipo que
não é aceite em lado nenhum — nenhuma função o devolve, nenhum componente o
recebe. Devolver um deles **deixou de compilar**. `ARC_CAPABILITIES` está
congelado e cada entrada diz *porque* não existe, porque `false` sozinho não
distingue "ainda não fizemos" de "não há onde guardar":

- `milestones` — `S.worldArc` guarda `{id, status, start, end}`. Não há campo
  para marcos nem regra que defina o que é atingir um.
- `climax` — nenhuma condição definida no domínio.
- `archive` — `S.worldArc` guarda **um** arco; aceitar o seguinte substitui o
  anterior. Não há histórico para arquivar.

**Verificado por ausência:** zero ocorrências de `milestone`, `climax` ou
`archived` em todo o `src/` fora do próprio `arcModel.ts`. Não há controlos, não
há placeholders, não há nada a insinuar que está a ser ligado.

**Duas notas honestas que a decisão obrigou a escrever.** `preview` era membro
de `ArcState` e nunca foi produzido — não é estado de ciclo de vida, é uma fase
de interface, e o `ArcPreview` já tinha o seu `Stage`. Saiu por não pertencer,
não por estar bloqueado. E `accepted`, embora aprovado como disponível, é
produzido pela **cerimónia** e não por `arcState()`: o que fica guardado é
`status: 'active'`, por isso à segunda leitura um arco aceite lê-se como
`active`. O estado existe no ciclo de vida; não existe no que é persistido.

**Como se destranca, quando o domínio souber:** mover o membro de
`ArcGatedState` para `ArcState`. O compilador aponta então todos os sítios que
precisam de saber lidar com ele — que é exatamente o efeito que se quer.

### 2026-07-30 · Fase 7Z — Pavimento Pélvico: um sítio, um modelo

**Decisão formal do Daniel.** Kegel é um **tipo de exercício dentro de
Pavimento Pélvico**. Não é módulo independente, não é sessão de calistenia, e
não é fonte automática de XP enquanto a regra de domínio não existir.

**A duplicação era visível e medida.** "Pavimento Pélvico" aparecia **duas
vezes** no mesmo subespaço: como quinta linha do formulário de treino — ao lado
de Empurrar, Puxar, Pernas e Core, com oito passos de progressão e XP próprio —
e como rotina guiada em Corpo e Recuperação, com zero XP. Dois modelos
diferentes para a mesma coisa, a um ecrã de distância.

**O que saiu:** a linha do formulário rápido. Verificado: de 2 ocorrências para
1, e o formulário passa a ter só as quatro linhas de calistenia.

**O que NÃO saiu, e é deliberado:** `S.training.prog.kegel` e o `lines.kegel`
das sessões já registadas continuam no estado, tal como estão. São dados de
treinos que aconteceram mesmo. Verificado antes e depois: `progKegel: 1` nos
dois. **Zero alterações a schema** — o que saiu foi a entrada de dados nova, não
o registo do que passou. `finishTraining` continua a receber o campo, para não
se mudar a assinatura do domínio por causa de uma linha de interface.

**A taxonomia passou para os dados.** Cada exercício declara o seu `kind`, em
vez de a estrutura viver só num documento — uma decisão de taxonomia num `.md`
perde-se à próxima pessoa que acrescenta um exercício.

**O relaxamento passou a exercício.** Já estava no conteúdo — "o relaxamento
entre repetições conta tanto como a contração", "um músculo que nunca solta não
fica mais forte, fica tenso" — mas vivia como **ressalva dentro de outros
exercícios**, e uma coisa que só aparece como aviso não se treina. Não é
conteúdo novo: é a mesma orientação das mesmas fontes (NTH), reorganizada para
ser praticável.

**Um tipo NÃO foi criado, e a razão fica escrita.** A estrutura aprovada lista
"coordenação respiratória" como quinto tipo. Não existe como exercício separado
porque as fontes tratam a respiração como **técnica que atravessa todos os
exercícios**, não como exercício autónomo — está em todas as fases (`breath`) e
na primeira ressalva da rotina. Inventar um exercício de respiração sem fonte
que o descreva como tal seria conteúdo de saúde inventado, e a regra da Fase 7
proíbe-o. Se aparecer fonte, o tipo já existe em `PelvicKind` à espera.

**Nenhum XP novo.** A rotina regista conclusão, consistência e histórico em
`S.bodyRoutines`, com XP zero — como já era antes desta decisão.

### 2026-07-30 · Fase 7Z — fecho das referências animadas

**As trinta animadas (R01–R30) estão todas abertas.** Restam 18 estáticas, que
não foram vistas e por isso não têm interpretação escrita — a regra é que nenhum
ficheiro conta como visto sem ter sido aberto, e a contagem di-lo em vez de o
esconder.

**Repartição:** 15 analisadas, 8 parcialmente úteis, 4 anti-referências, 1
rejeitada, 2 duplicadas por hash.

**As duas mais fortes por aplicar**, nomeadas para não se perderem:

- **R04** — coluna de luz violeta entre dois anéis, com partículas a subir e o
  bordo a passar de difuso a discreto. Paleta já certa, sem correção. Candidata
  à cerimónia de arco e à transferência de energia para o Núcleo, que hoje é uma
  linha fina de 300px.
- **R21** — flores sobre preto com caixas de deteção e valores de confiança
  sobrepostos. É a relação inteira do Sistema numa imagem: o mundo é matéria, o
  instrumento mede-o, e nenhum dos dois vira decoração do outro. Com uma
  ressalva ética escrita no mapa — copiar a *aparência* de medição sem medir
  nada é exatamente a mentira que o projeto proíbe.

**Uma referência que muda uma decisão já tomada:** R06 mostra que **abrir o
plano** (subir a câmara até as órbitas deixarem de ser elipses achatadas) é uma
forma de ganhar espaço sem mudar de sítio. A cerimónia de rank usa hoje escala
para dizer "o mundo ficou maior"; abrir o plano diz o mesmo com geometria em vez
de com tamanho, e é mais difícil de confundir com um zoom.

**Partes do Sistema que não refletem a biblioteca** — a pergunta que o Daniel
mandou responder no fim:

1. **O Mapa de Conhecimento**, por fazer. R08 mostra exatamente o que ele NÃO
   pode ser — uma teia onde tudo liga a tudo, que não diz relação nenhuma, diz
   densidade. E não há na biblioteca uma única referência do que ele DEVE ser.
   É uma lacuna de referência, não de implementação: começar a desenhá-lo hoje
   seria decidir sem base.
2. **A camada sazonal.** R20, R22, R28, R29 e R30 são cinco tipos de matéria de
   estação — folhas com parallax por desfoque, floração em sequência, luz partida
   na água, duas populações de neve, cristal hexagonal. O Arc Engine usa, por
   estação, um par de cores e um `flow`. A biblioteca é muito mais rica do que o
   produto.
3. **A formação de uma constelação.** R22 mostra floração em sequência, de baixo
   para cima, legível na ordem. No Universo as estrelas de um domínio aparecem
   todas de uma vez — o céu tem *tempo acumulado* mas não tem *tempo a
   acontecer*, exceto no evento de evidência.

**Nenhum código foi alterado nesta análise**, e foi condição explícita: não
mexer no produto só para poder dizer que todas as referências foram usadas.

### 2026-07-30 · Fase 7Z — biblioteca de referências fechada: 50 de 50

**Zero pendentes.** 30 animadas + 20 estáticas, todas abertas.

**Correção de uma contagem minha.** Escrevi "30 abertas · 18 por abrir · 2
inválidas". Era dupla contagem: as duas inválidas (R08, R27) são PNG com
extensão `.gif` e já estavam dentro das 30. As estáticas eram 20.

**O retrato da biblioteca, agora que está toda vista:** de 50 referências, **11
são anti-referências** e 3 são rejeitadas. Quase 30% da biblioteca é material
a evitar — e isso não é um defeito da biblioteca, é o valor dela: saber o que
não fazer estava a custar zero e ninguém o tinha inventariado.

**As três mais fortes por aplicar**, somando animadas e estáticas:

- **S05** — três estados cognitivos, cada um com forma de filamentos própria,
  branco sobre preto. É a resposta mais próxima que a biblioteca tem para o que
  falta ao Oráculo, cujos estados hoje se distinguem por ritmo e intensidade do
  mesmo sigilo. Deu a gramática 15.
- **S01** — terreno de partículas, anel-portal, interface reduzida a dois
  affordances, e itálico serif na palavra que carrega o significado. Candidata à
  zona Reflexão, cujo nome a referência tem literalmente ("memory").
- **R04** — coluna de luz entre dois anéis, já registada.

**Duas paletas com hex reais e utilizáveis**, e é preciso dizer que são paletas
e não direção visual: **S13** (outono, cinco hex terrosos) e **S20** (inverno,
seis hex dessaturados, com `Pine #27363F` e `BERRY #6B212C` a funcionarem sobre
preto). As de primavera e verão (S14, S17) são pastéis sobre branco — o oposto
da direção, e ficam rejeitadas para uso direto.

**Um extrato dentro de uma anti-referência**, que é o caso mais interessante:
**S12** é um infográfico de HUD de ficção científica e é para rejeitar inteiro —
menos uma coisa. Mostra N componentes, cada um com **ícone próprio**, ligados
por linha-guia ao objeto central que compõem. É a estrutura do interior do
Núcleo, e aponta a peça que lá falta: um ícone por domínio, que hoje não existe.

**Onde as anti-referências estão arquivadas continua a ser o maior risco.** A
gramática 14 nasceu de duas; agora são mais: **S15** (dashboard de big data)
está em `01-shell-navigation`, a pasta da shell, e **S03** (árvore de talentos)
está em `constelação`, onde alguém vai procurar referência para o Mapa de
Conhecimento. As duas estão agora marcadas no sítio onde estão.

**Nenhum código foi alterado nesta análise.**

### 2026-07-30 · Fase 7Z — o sigilo do Oráculo ganha quatro silhuetas

**Primeira aplicação da gramática 15**, que saiu da análise das referências duas
horas antes. É deliberado que a primeira seja aqui: o sigilo é a presença do
Oráculo em três sítios do produto, e era o sítio onde o problema era pior.

**O diagnóstico.** Quatro estados, três canais — amplitude, ritmo, cor — e todos
frágeis. O pior era a cor: violeta contra magenta separava "tenho algo para ti"
de "há um prazo vencido", e esse é precisamente o par que uma deuteranopia não
distingue. Duas mensagens opostas no canal mais falível.

**A escolha das formas** seguiu uma regra: cada uma tem de significar o que
mostra, não ser um símbolo arbitrário.

- **repouso** — linha contínua e quase plana. Sem sinais, não há onda.
- **atento** — um **nó** onde os filamentos se cruzam. Há aqui alguma coisa, e
  está num sítio. O nó cresce com o número de sinais, por isso a amplitude
  continua a informar — deixou é de estar sozinha.
- **alerta** — a linha **parte-se**. Uma interrupção é a única forma que diz
  "isto não está a correr" sem recorrer a vermelho nem a piscar. E a
  Constituição pede um moderador, não um alarme: uma quebra é séria e é calada.
- **a processar** — os filamentos **retraem-se**. É a mesma gramática da
  contração que já lá estava (R17), mas agora deixa marca na forma: parado, o
  sigilo a processar é visivelmente mais curto do que os outros três.

**O teste que decide, e devia ser rotina:** render os estados lado a lado em
reduced motion e em escala de cinzentos. Se se confundirem assim, a distinção
não existe — existe só enquanto tudo corre bem para quem está a olhar.

Foi esse teste que apanhou a primeira versão do alerta: só o portador se partia,
os outros dois passavam por cima, e o intervalo não se via na imagem apesar de
existir no DOM.

### 2026-07-30 · Fase 7Z — uma estação passa a ter matéria

A análise das 50 referências fechou com cinco tipos de matéria e duas paletas de
hex reais documentados. O produto continuava a tratar uma estação como duas
cores e um `flow`. Esta foi a maior distância entre o que estava guardado e o
que estava a ser usado — e por isso a primeira a fechar.

**A decisão de arquitetura veio antes da decisão visual.** A tentação óbvia era
um componente por estação. A Fase 7 tinha estabelecido o contrário — não existe
`<BloomLayer/>`, não existe `if (arc.id === ...)` — e essa disciplina é mais
valiosa do que qualquer efeito. Um arco novo continua a ganhar matéria
declarando **uma palavra** no `MOTIFS`.

**O que cada referência deu, e não é ilustração:**

- **R28 → cintilação.** Uma fonte de luz vista através de água irregular
  parte-se em centenas de fragmentos e continua a ler-se como coluna. Coerência
  sem continuidade — que é o verão inteiro numa frase. Os fragmentos acendem e
  apagam em fases diferentes e **não se deslocam**: a água move-se, a luz fica.
- **R20 → queda.** Três profundidades distinguidas só pela **nitidez**, não pelo
  tamanho. Aqui a opacidade faz o papel do desfoque, porque `filter: blur()` em
  duas dúzias de elementos a cair é o custo contínuo que a regra do projeto
  proíbe.
- **R29 → assentamento.** Duas populações: poucos objetos francos, muitos traços
  indistintos. É a mesma distribuição do céu do Sistema, e esta é a referência
  que a justifica. A queda é lenta e quase vertical — o inverno não irrompe.
- **R22 → abertura.** A floração acontece em **sequência**, de baixo para cima, e
  a ordem é legível. É a única matéria com atraso **positivo** e proporcional ao
  índice; semear ao acaso destruía exatamente aquilo que a referência mostra.
- **S13 e S20 → cor com fonte.** O `#60a5fa` do inverno era o azul-cliché que a
  direção visual proíbe. S20 dá `#8EA1AE` e `#BEB3AC`, e o que distingue essa
  paleta das de primavera e verão é a dessaturação — que é também o que a torna
  utilizável sobre preto sem correção.

**A correção que importa registar** é de ordem de pintura, e o screenshot é que
a encontrou: a camada estava por cima do texto. `z-index: 0` parecia certo por
analogia com a atmosfera, e a analogia era falsa — a atmosfera é um gradiente a
4% de opacidade, e por cima de texto não se vê; um ponto sólido de 7px vê-se.

**E a decisão que quase ficou errada:** em reduced motion, manter as partículas
paradas parecia generoso. Não é. Pontos imóveis não são queda nem floração — a
matéria É o movimento. Uma animação que, parada, deixa de comunicar era
decoração, e a lei diz que nenhuma animação é decorativa. A camada sai, e a
estação continua a dizer-se por três canais que não dependem de movimento.

**Isto parece um produto único chamado Sistema?** Sim, e a razão é que a matéria
nunca se apresenta: passa **atrás** do vidro dos painéis, com a mesma lógica com
que o céu já passava. Uma camada de partículas por cima da interface seria
confete gerado por AI — que foi literalmente o que a primeira versão parecia.

