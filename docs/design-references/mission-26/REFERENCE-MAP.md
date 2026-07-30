# REFERENCE-MAP — inventário e análise das referências

> Missão 26 · Fase 0 · medido e analisado a 2026-07-28.
> `ffprobe` 4.0.2 para o medido; contact sheets de 12 frames para o interpretado.

## Como ler

Duas classes de coluna, que não se confundem:

- **Medido** — duração, resolução, framerate, peso. Facto.
- **Interpretado** — papel, propriedades, riscos. Juízo, e só existe onde houve
  observação real.

| Estado | Significa |
|---|---|
| `ANALISADO` | contact sheet vista, propriedades extraídas |
| `INVENTARIADO` | medido, frames extraídas, **por interpretar** |
| `INVÁLIDO` | o ficheiro não contém o que o nome promete |

**Confiança** — `alta` (vista e inequívoca), `média` (vista, leitura discutível),
`nenhuma` (não vista).

Nesta data: **9 analisadas · 39 inventariadas · 2 inválidas.**
Atualizado a 2026-07-30 com R13 e R14, abertas para a reconstrução do Universo.
Nota de contagem: R12 e R14 são o mesmo ficheiro por hash, tal como R22 e R23 —
abrir R14 fecha R12 na prática, mas a contagem segue os identificadores.

## Papéis

`STRUCTURE` composição e grelha · `MATERIAL` superfície e textura ·
`LIGHT` comportamento da luz · `MOTION` movimento no tempo ·
`TYPOGRAPHY` letra · `INFORMATION` densidade e leitura de dados ·
`IDENTITY` representação do operador · `ANTI-REFERENCE` o que evitar.

---

## As sete analisadas

### R01 · `01-shell-navigation/ao entrar` · LIGHT + MOTION
736×414 · 10,00 s · 30 fps · 2,9 MB · confiança **alta**

**Factual:** onda horizontal de luz violeta sobre preto, com filamentos internos
finos. Respira e ondula devagar; nunca se fecha em forma.

**Papel:** o som tornado visível. É a assinatura de entrada no Sistema, e a
única referência que já está na paleta certa sem correção.

**Extrair:** a horizontalidade como estado de repouso atento — larga, baixa,
sem centro. Os filamentos internos que se veem por transparência dão matéria a
uma forma que não tem contorno.
**Rejeitar:** ocupar o ecrã inteiro; ser a única coisa presente.
**Aplicação:** faixa do Oráculo em Ambient; sequência de boot.
**Prioridade:** alta. **Risco:** médio — a onda de voz é lugar-comum de
assistente. Salva-se se a amplitude vier de estado real.

### R11 · `07-core-level-events/lvl up` · LIGHT + MOTION
720×1280 · 54,03 s · 30 fps · confiança **alta**

**Factual:** feixes verticais de luz branco-azulada sobre preto, de espessuras
muito diferentes, a subir. Densidade varia ao longo do tempo.

**Papel:** ascensão. Subida de nível.

**Extrair:** a **verticalidade como significado** — o que sobe, melhora; e a
mesma distribuição de duas populações que já governa as estrelas (poucos feixes
francos, muitos ténues).
**Rejeitar:** o azul-branco; a tomada de conta do ecrã inteiro.
**Aplicação:** evento de nível; XP a convergir.
**Prioridade:** alta. **Risco:** baixo.

### R15 · `07-core-level-events/nucleo a explodir` · MOTION + LIGHT
720×1280 · 22,77 s · 30 fps · confiança **alta**

**Factual:** esfera de filamentos num bosque real. Seis fases legíveis.

| Fase | O que acontece | Tempo aprox. |
|---|---|---|
| inicial | esfera pequena, contida; partículas em deriva | 0–15% |
| aceleração | filamentos varrem **do ambiente para dentro** | 15–35% |
| transformação | cresce; estrutura interna torna-se legível | 35–55% |
| pico | bloom branco; irradiação; riscos rasantes ao solo | 55–65% |
| desaceleração | filamentos recolhem; luz desce | 65–85% |
| final | esfera **maior e mais complexa** que a inicial | 85–100% |

**Easing aparente:** entrada lenta, pico abrupto, saída longa — perto de
`cubic-bezier(.2,.8,.2,1)` com o pico deslocado para depois do meio.

**Extrair:** a convergência para dentro; o delta persistente entre início e fim.
**Rejeitar:** o bosque fotográfico; o bloom a 100%; a saturação.
**Aplicação:** evento do Núcleo (Level Up, Insight).
**Prioridade:** máxima. **Risco:** alto se virar partículas de celebração.
**Reduced motion:** estado A → estado B por opacidade e escala. Sobrevive o
delta, não o espetáculo.

### R17 · `02-oracle-presence/main interface` · MOTION
800×600 · 136 fr · ~33 fps · confiança **alta**

**Factual:** anéis concêntricos azuis a contrair, partículas em órbita, anel de
contas discretas no fim.

**Extrair:** contração = "a processar"; a passagem de **difuso a discreto** como
sinal de conclusão. Indicador de progresso que não é barra nem spinner.
**Rejeitar:** o azul-ciano — paleta de HUD de ficção científica.
**Aplicação:** estado `ocBusy` do Oráculo, hoje um `box-shadow` a pulsar.
**Prioridade:** alta. **Risco:** **máximo** — é a referência mais próxima do
cliché. Usar a gramática, nunca a aparência.

### R19 · `02-oracle-presence/oraculo` · LIGHT + MOTION
500×500 · 144 fr · 25 fps · confiança **alta**

**Factual:** esfera de fitas violeta e magenta sobre preto puro. Ciclo sem
princípio nem fim; nos extremos lê-se como crescente.

**Extrair:** presença por respiração contínua e lenta. A paleta — é a do Sistema.
**Rejeitar:** o brilho constante em alta intensidade.
**Aplicação:** Oráculo Ambient.
**Prioridade:** máxima. **Risco:** médio — esfera violeta = "AI assistant"
genérico. Salva-se se ligada a estado real.

### R25 · `05-operator-identity/ranks` · IDENTITY + INFORMATION
800×600 · 65 fr · ~33 fps · confiança **alta**

**Factual:** medidor circular com a letra **S** ao centro, leitura numérica por
baixo, anéis concêntricos e um anel exterior turbulento e vivo.

**Papel:** o rank como **instrumento**, não como crachá.

**Extrair:** a divisão de trabalho — a letra ao centro diz *qual*, o anel diz
*quanto*, e só o anel exterior se mexe. Um rank que é um manómetro é um rank
que tem de estar ligado a um valor verdadeiro.
**Rejeitar:** o ciano flamejante; unidades falsas ("rpm"); o ar de chefe de
videojogo.
**Aplicação:** identidade do Operador no Command Core. Hoje o Rank S é uma
letra estática num canto.
**Prioridade:** alta. **Risco:** médio.

### R26 · `01-shell-navigation/sistema` · STRUCTURE + INFORMATION
720×408 · 22,06 s · 30 fps · confiança **alta**

**Factual:** interface monocromática. Trilho estreito à esquerda com leituras
técnicas emparelhadas e um bloco de log a correr; visor grande à direita com a
Terra vista de órbita e arcos de rede a ligar luzes de cidades.

**Papel:** a estrutura assimétrica que as zonas instrumentais precisam.

**Extrair:** trilho de instrumentos + visor, em vez de grelha de cartões; as
métricas aos pares com rótulo mono minúsculo; **arcos como relação** entre
pontos — que é literalmente o que uma constelação é; a disciplina monocromática,
que liberta a cor para significar.
**Rejeitar:** cantos em esquadria, glifos decorativos, marca de água, densidade
de UI de filme que não informa nada.
**Aplicação:** Radar e Operações; ligações entre estrelas no Universo.
**Prioridade:** alta. **Risco:** alto — é o vizinho direto do "HUD
cinematográfico impossível de usar" que a missão proíbe.

---

### R13 · `07-core-level-events` · MATERIAL + STRUCTURE
500×281 · 72 fr · ~33 fps · confiança **alta** · aberta 2026-07-30

**Factual:** corpo orbital com anéis concêntricos inclinados em 3D, rastos de
partículas, satélites e rótulos de HUD ligados por linhas-guia.

**Extrair:** a profundidade não vem de sombra — vem de **anéis vistos de um
ângulo**. Um plano inclinado dá o chão da cena sem nada mais.
**Rejeitar:** o ciano, os rótulos de HUD de filme, o texto de telemetria falso
e a marca de água.
**Aplicação:** os três anéis do Universo, a 60° — cos(60°) = 0,5, que é a
proporção 2:1 da elipse onde os domínios assentam. Com 72° o plano dizia uma
inclinação e os corpos diziam outra, e o olho lê isso como erro.
**Prioridade:** alta. **Risco:** médio — é a referência mais próxima do painel
de nave espacial. Salva-se porque só se usou a geometria.

### R14 · `07-core-level-events/aproximacao ao nucleo.mp4` · MOTION + MATERIAL
720×1280 · 20,04 s · 30 fps · confiança **alta** · aberta 2026-07-30

**Factual:** centro de luz branco-violeta com centenas de filamentos finos a
irradiar, cada um terminado numa partícula brilhante. O conjunto respira. Não há
contorno em lado nenhum — o que define a forma é a densidade de linhas.

**Extrair:** o núcleo é **matéria**, não um círculo; a densidade é que faz a
massa; cada filamento acaba num ponto de luz — é isso que separa um feixe vivo
de um sunburst desenhado.
**Rejeitar:** o bloom branco a 100% (o Sistema tem sempre texto por cima —
gramática 4) e a explosão constante: ali é um plano isolado, aqui é uma
presença, e uma presença que explode sem parar é um alarme.
**Aplicação:** o Núcleo. O número de filamentos e o raio vêm de `coreMass`, que
vem do nível global real — não há um estado "bonito por defeito".
**Prioridade:** máxima. **Risco:** baixo — a paleta já é a do Sistema.

## Inventariadas — medidas, por interpretar

Todas têm 12 frames e contact sheet em `98-extracted-frames/`. Confiança
**nenhuma** até serem vistas.

| ID | Categoria | Resolução | Duração | FPS | Papel provável |
|---|---|---|---|---|---|
| R02 | 04-panels · chart | 736×414 | 5,01 s | 23,98 | INFORMATION |
| R03 | 03-universe · cometa e estrela | 720×480 | 11,88 s | 25 | MOTION |
| R04 | 07-core · conquista | 256×144 | 11,33 s | 30 | MOTION |
| R05 | 07-core · conquista | 760×508 | 10,97 s | 30 | MOTION |
| R06 | 03-universe · constelação | 740×560 | 5,04 s | 24 | STRUCTURE |
| R07 | 03-universe · constelação | 499×281 | 93 fr | 50 | STRUCTURE |
| R09 | 04-panels · icon | 760×508 | 11,17 s | 30 | IDENTITY |
| R10 | 04-panels · icone.mp4 | 720×1280 | 5,00 s | 60 | IDENTITY |
| R12 | 07-core · núcleo | 720×1280 | 20,04 s | 30 | MOTION ⧉ |
| R13 | 07-core · núcleo | 500×281 | 72 fr | ~33 | MATERIAL — **ABERTA 2026-07-30** |
| R14 | 07-core · aproximação ao núcleo | 720×1280 | 20,04 s | 30 | MOTION ⧉ — **ABERTA 2026-07-30** |
| R16 | 02-oracle | 720×1280 | 29,21 s | 30 | LIGHT |
| R18 | 02-oracle · oracle.gif | 500×375 | 63 fr | 24 | LIGHT |
| R20 | 03-universe · outono | 1280×720 | 14,95 s | 29,97 | MATERIAL |
| R21 | 03-universe · primavera | 720×1280 | 171,02 s | 30 | MATERIAL |
| R22 | 03-universe · primavera | 720×1280 | 15,07 s | 30 | MATERIAL ⧉ |
| R23 | 03-universe · primavera | 720×1280 | 15,07 s | 30 | MATERIAL ⧉ |
| R24 | 04-panels · radar | 736×414 | 7,57 s | 30 | INFORMATION |
| R28 | 03-universe · verão | 720×1280 | 8,83 s | 30 | MATERIAL |
| R29 | 03-universe · winter | 1024×576 | 14,40 s | 50 | MATERIAL |
| R30 | 03-universe · winter | 600×338 | 35 fr | 7 | MATERIAL |

⧉ duplicado por hash: R12=R14, R22=R23.

### Estáticas (20) — medidas, nenhuma aberta

| ID | Categoria | Resolução | | ID | Categoria | Resolução |
|---|---|---|---|---|---|---|
| S01 | 07-core · conquista | 1200×602 | | S11 | 04-panels · notificações | 1200×750 |
| S02 | 03-universe | 1199×675 | | S12 | 07-core · núcleo | 1200×800 |
| S03 | 03-universe | 1200×675 | | S13 | 03-universe · outono | 1080×1350 |
| S04 | 03-universe | 736×736 | | S14 | 03-universe · primavera | 736×1104 |
| S05 | 03-universe | 736×1104 | | S15 | 01-shell | 1199×675 |
| S06 | 03-universe | 736×414 | | S16 | 01-shell | 736×1104 |
| S07 | 03-universe · cons.jpg | 711×399 | | S17 | 03-universe · verão | 736×1104 |
| S08 | 03-universe · constelacao.jpg | 735×441 | | S18 | 03-universe · verão | 736×1104 |
| S09 | 03-universe · mapa de workflow | 1024×1024 | | S19 | 03-universe · verão | 500×282 |
| S10 | 03-universe · universo.jpg | 736×414 | | S20 | 03-universe · winter | 735×934 |

---

## Inválidas

**R08** `constelação/consv.gif` e **R27** `sistema/ao entrar no sistema ou a
mudar de categoria de uma para outra.gif` são **PNG estáticos** com extensão
`.gif`. O `file` confirma: *PNG image data, 8-bit/color RGBA*.

R27 é, pelo nome, a referência da **transição de zona** — precisamente o que a
Fase C tem de resolver. Essa animação não existe em disco; só o poster.
Consequência: a transição de zona foi desenhada **sem referência**, a partir da
gramática (ver `VISUAL-GRAMMAR.md`, princípio 7).

## Notas de método

**Os nomes dos ficheiros são lixo.** 26 dos 50 começam por `From Klickpin.com-`
com títulos de Pinterest sobre casas de banho e receitas. Não descrevem nada. O
sinal é o **nome da pasta**, dado pelo Daniel. Classificar sempre pelo ID.

**Origem e URL não são recuperáveis.** Perderam-se no download. As colunas
ficam vazias em vez de inventadas — o que tem consequência prática: **nenhuma
destas imagens pode entrar no produto**, porque não há licença verificável. São
referência privada de estudo, e só isso.

**Biblioteca organizada.** Os 50 ficheiros foram triados do `00-inbox` para as
categorias `01`–`07` por cópia. Os originais permanecem em `docs/design
references/`. Zero por classificar.

---

## S09 · `mapa de workflow seja constelacao seja agentes.jpg` — DUPLA CLASSIFICAÇÃO

1024×1024 · analisada 2026-07-28 · confiança **alta**

Esta merece entrada própria porque é a única referência com um **nome que
declara intenção** em vez de descrever uma imagem — e porque é boa e má ao
mesmo tempo.

**Factual:** mockup de um "AI Agent Directory". Nós hexagonais com ícones,
ligados por arcos curvos; dois centros a brilhar (magenta e ciano); gradiente
roxo; barra lateral à esquerda. O texto está **corrompido** — "Rebet Activity",
"Talding", "Neuralls", "Settings" duas vezes. É uma imagem gerada por AI.

### Como STRUCTURE — aproveitável

**Extrair:** o grafo onde a relação é a informação. Os nós valem pouco sozinhos;
o que se lê são os arcos e quais os centros com mais ligações. É a gramática 8
com forma, e é o que o nome que o Daniel lhe deu quer dizer: um mapa que serve
de constelação e de árvore de agentes ao mesmo tempo.

**Onde já vive:** as Constelações **já são este grafo** — estrelas ligadas por
arcos, com o Núcleo como centro. A intenção está servida; não se constrói um
segundo grafo ao lado. Quando o registo de agentes do Oráculo existir, é esta a
forma que já cá está para o receber.

### Como ANTI-REFERENCE — a rejeitar inteira

A aparência é, ponto por ponto, o que a missão proíbe por nome:

| Na referência | A missão diz |
|---|---|
| gradiente roxo de fundo | "template roxo" |
| barra lateral com ícones | "sidebar administrativa" |
| hexágonos com ícones de cérebro/circuito | "dashboard AI genérico" |
| ciano sobre roxo | a paleta é violeta/magenta sobre preto |

**Veredicto:** extrair a topologia, rejeitar tudo o que se vê. E registar que o
texto corrompido é o sinal de que a imagem é gerada — uma referência assim serve
para pensar, nunca para copiar detalhe.
