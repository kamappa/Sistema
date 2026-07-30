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

Nesta data: **30 abertas · 18 por abrir · 2 inválidas** — total 50.

Atualizado a 2026-07-30, Fase 7Z. **As 30 animadas (R01–R30) estão TODAS
abertas.** Das 18 por abrir, todas são estáticas (S01–S20 menos as duas
inválidas) — nenhuma foi vista, e por isso nenhuma tem interpretação escrita.

Repartição das 30 animadas por estado:
**analisadas 15** · **parcialmente úteis 8** · **anti-referências 4** ·
**rejeitadas 1** · **duplicadas 2**.

Nota de contagem: R12 e R14 são o mesmo ficheiro por hash, tal como R22 e R23.
Os duplicados são registados como duplicados e não reabertos — abrir duas vezes
o mesmo conteúdo para o contar como duas análises seria inflacionar o número.

Nota de método, para quem vier a seguir: as folhas por CATEGORIA
(`SHEET-0X-*.jpg`) estão incompletas — a de `03-universe-materials` mostra 3
frames para 27 ficheiros, e a das estáticas mostra 8 de 20. A triagem foi feita
pelas folhas de contacto INDIVIDUAIS, em `98-extracted-frames/<ID>/`.

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

## Analisadas na Fase 7Z — 2026-07-30

As 21 animadas que faltavam. **Todas abertas** pela folha de contacto do próprio
ficheiro, em `98-extracted-frames/<ID>/CONTACT-SHEET.jpg`; as folhas por
categoria (`SHEET-0X`) estavam incompletas e não serviram de triagem — fica
registado para quem confiar nelas a seguir.

Confiança **alta** em todas, exceto onde dito.

### R02 · `04-panels-instruments/chart` · INFORMATION — parcialmente útil
736×414 · 5,01 s · 23,98 fps

**Factual:** uma linha quebrada azul-neon a desenhar-se da esquerda para a
direita, com um ponto luminoso na ponta que a puxa. Termina numa subida.

**Extrair:** o ponto na ponta é o que faz a linha parecer **estar a acontecer**
em vez de estar desenhada — a extremidade é o presente. E a linha desenha-se em
vez de aparecer.
**Rejeitar:** o azul-neon; a tendência sempre a subir, que é um gráfico a
prometer em vez de a medir; o glow uniforme.
**Risco de imitação:** médio — é o gráfico de dashboard genérico.
**Aplicação possível:** a série datada de XP no interior do Núcleo, hoje ausente
por falta de dois pontos em muitos casos. O ponto-presente na ponta resolveria a
leitura sem barra.
**Estado:** parcialmente útil.

### R03 · `03-universe-materials/cometa e estrela` · MOTION — rejeitada
740×560 · MP4

**Factual:** NÃO é uma referência de produto — é um **tutorial de After
Effects**. Os frames trazem os nomes dos passos sobrepostos ("Fractal Noise /
Optical Flares", "Polar Coordinates", "CC Sphere Mesh Warp", "CC Radial Blur /
Displacement Map / Wave Warp / S. Shake / Camera Lens Blur", "Final"). O
resultado é um cometa branco de quatro pontas com cauda multicolor.

**Extrair:** nada de utilizável. A forma final — estrela de quatro pontas com
cauda — já existe no Sistema pelo sigilo e pelas estrelas do céu.
**Rejeitar:** a cauda arco-íris, proibida por nome pela direção visual; e o
próprio formato, que é pipeline e não referência.
**Risco de imitação:** baixo, por ser inutilizável.
**Estado:** rejeitada. Fica no inventário para ninguém a voltar a abrir à espera
de uma referência.

### R04 · `07-core-level-events/conquista` · MOTION + LIGHT — analisada
MP4 · **das mais fortes por aplicar**

**Factual:** uma **coluna de luz violeta entre dois anéis** — um em cima, um em
baixo — com partículas a subir pelo eixo. Os anéis são concêntricos e têm contas
discretas no bordo. Paleta violeta pura sobre preto.

**Extrair:** a coluna vertical entre dois anéis como forma de dizer "**algo está
a ser transferido**"; a passagem de difuso (partículas soltas) a discreto
(contas alinhadas no anel) como marca de conclusão — mesmo princípio da
gramática 5; a paleta, que já é a do Sistema sem correção nenhuma.
**Rejeitar:** a leitura de "portal de videojogo" se a coluna for grossa e opaca;
a duração longa — no produto isto tem de ser um arco de segundos.
**Risco de imitação:** médio-alto. É bonito o suficiente para se usar sem
motivo, e a lei diz que nenhuma animação é decorativa.
**Aplicação possível:** a cerimónia de aceitação de arco, e a transferência de
energia do domínio para o Núcleo — que hoje é uma linha fina e podia ser isto.
Gramática 9: vertical é ascensão.
**Estado:** analisada.

### R05 · `07-core-level-events/conquista` · ANTI-REFERÊNCIA
MP4

**Factual:** uma **barra de progresso de MMO** com chama magenta a arder por
cima, ornamento metálico nas pontas, sobre fundo cinzento.

**Extrair:** só um princípio, e o Sistema já o aplica por outra via — uma
medida pode ter matéria em vez de preenchimento.
**Rejeitar:** tudo o resto. Ornamento metálico, moldura, chama constante e fundo
cinzento, que viola a gramática 6 (luz sobre preto, nunca sobre cinzento). É o
"gaming HUD" que a direção lista como a evitar.
**Risco de imitação:** **máximo** se alguém a tomar por referência de progresso.
**Estado:** anti-referência.

### R06 · `03-universe-materials/constelação` · STRUCTURE + MATERIAL — analisada
740×560 · 5,04 s · 24 fps

**Factual:** sistema planetário estilizado visto de um ângulo baixo: órbitas
elípticas concêntricas de espessuras diferentes, um centro de luz branco-azul
que é um **domo de partículas** e não um disco, planetas com anéis. Ao longo da
sequência a câmara sobe e o plano das órbitas abre.

**Extrair:** confirma R13 por outra via — a profundidade vem do plano visto de
ângulo. E acrescenta duas coisas: o centro é **volume de partículas**, não uma
forma preenchida; e **abrir o plano** (subir a câmara) é uma forma de ganhar
espaço sem mudar de sítio.
**Rejeitar:** o azul-ciano; o realismo planetário, que puxa para a simulação
astronómica em vez do símbolo.
**Risco de imitação:** médio.
**Aplicação possível:** os anéis do Universo já usam a inclinação. A abertura do
plano é candidata à cerimónia de rank, onde hoje se usa escala.
**Estado:** analisada.

### R07 · `03-universe-materials/constelação` · MOTION — parcialmente útil
499×281 · 93 fr · 50 fps

**Factual:** um cometa branco a atravessar um campo de estrelas, com cauda azul
larga e difusa. A cabeça é um ponto branco duro; a cauda perde-se.

**Extrair:** a relação **cabeça dura / cauda difusa**. O que diz a direção do
movimento não é a cauda, é o contraste entre um ponto nítido e um rasto que se
desfaz. É exatamente a estrutura da partícula de evidência do Universo, e
confirma-a a posteriori.
**Rejeitar:** o azul saturado; a cauda larga, que a esta escala vira mancha.
**Risco de imitação:** baixo.
**Estado:** parcialmente útil — confirma uma decisão já tomada em vez de abrir
uma nova.

### R08 · `03-universe-materials/constelação` · STRUCTURE — anti-referência
GIF, baixa resolução

**Factual:** um **grafo de nós e arestas** denso, com rótulos de texto ilegíveis,
um cursor circular ao centro e uma marca de água laranja no canto. Linhas a
cruzarem-se em todas as direções.

**Extrair:** nada que o Sistema deva usar. É a imagem que a `S09` já tinha
levantado com dupla classificação.
**Rejeitar:** a teia. Um grafo onde tudo liga a tudo não diz relação nenhuma —
diz densidade. A gramática 8 (uma relação desenha-se com um arco) existe
precisamente contra isto.
**Risco de imitação:** **alto** — é a imagem que qualquer pessoa desenha quando
lhe pedem "mapa de conhecimento", e o Sistema tem um Mapa de Conhecimento por
fazer.
**Estado:** anti-referência.

### R09 · `04-panels-instruments/icon` · ANTI-REFERÊNCIA
760×508 · 11,17 s · 30 fps

**Factual:** uma **moldura ornamentada** com cantos barrocos e contorno neon
roxo, com uma nebulosa cinzenta a mexer-se lá dentro, sobre fundo cinzento.

**Rejeitar:** quatro proibições da direção visual numa só imagem — borda roxa
em todos os componentes, moldura, neon barato e fundo cinzento.
**Risco de imitação:** **máximo**, e agravado por estar arquivada em `icon`, o
que sugere que alguém a considerou para identidade.
**Estado:** anti-referência.

### R10 · `04-panels-instruments/icone.mp4` · MATERIAL — parcialmente útil
720×1280 · 5,00 s · 60 fps

**Factual:** uma **chama violeta-azul** sobre preto puro, em loop. Núcleo branco,
bordos violeta, línguas que sobem e se desfazem.

**Extrair:** a estrutura de temperatura — branco no interior, cor no bordo,
escuro no exterior. É a mesma que o Núcleo usa, e confirma-a. E a irregularidade:
a chama nunca repete a forma, que é o que a faz parecer matéria.
**Rejeitar:** a chama como ícone. Fogo é a metáfora errada para este produto —
diz consumo, e o Sistema é acumulação.
**Risco de imitação:** médio.
**Estado:** parcialmente útil.

### R12 · `07-core-level-events` · DUPLICADA
720×1280 · 20,04 s · 30 fps

**Duplicada por hash de R14**, já analisada. Não foi reaberta: são o mesmo
ficheiro, e abrir duas vezes o mesmo conteúdo para o registar como duas
referências seria inflacionar a contagem.
**Estado:** duplicada (= R14).

### R16 · `02-oracle-presence` · ANTI-REFERÊNCIA
720×1280 · 29,21 s · 30 fps

**Factual:** **um olho**. Íris azul-lavanda com pupila negra, dentro de uma forma
de amêndoa que abre e fecha, sobre um fundo de caracteres de código.

**Extrair:** só um gesto — a **lente que abre e fecha** como estado de atenção
contra repouso. Isso já existe no sigilo do Oráculo por outra forma.
**Rejeitar:** o olho, inteiro. Para um assistente, um olho diz **vigilância** e
não conselho, e é a leitura que a Constituição do Oráculo mais tem a perder —
está lá escrito que ele não pode ser um chatbot genérico nem imitar personagem
protegida, e um olho que observa é Sauron ou HAL antes de ser qualquer outra
coisa. O fundo de código é o cliché de "AI" que a direção proíbe.
**Risco de imitação:** **máximo**, agravado por estar arquivada na pasta do
Oráculo — quem lá for buscar uma referência encontra isto primeiro.
**Estado:** anti-referência.

### R18 · `02-oracle-presence/oracle.gif` · LIGHT — parcialmente útil
500×375 · 63 fr · 24 fps

**Factual:** uma **esfera de linhas de energia azul** sobre preto — fitas
luminosas que envolvem um interior escuro, em rotação lenta. O centro é vazio,
não brilhante.

**Extrair:** **o centro vazio**. A presença é feita pela casca, não pelo miolo —
e isso resolve o problema de uma esfera luminosa parecer um assistente genérico:
o que se vê é uma superfície em movimento, não uma bola acesa.
**Rejeitar:** o azul elétrico; a densidade das fitas, que a esta escala vira
novelo.
**Risco de imitação:** alto — esfera luminosa = "AI assistant", o mesmo risco já
registado em R19.
**Aplicação possível:** o Oráculo Ambient já usa respiração; o centro vazio é
uma alternativa por explorar ao estado `thinking`.
**Estado:** parcialmente útil.

### R20 · `03-universe-materials/outono` · MATERIAL — parcialmente útil
1280×720 · 14,95 s · 29,97 fps

**Factual:** folhas de outono a cair, desfocadas em vários planos, sobre um fundo
verde-acinzentado. Partículas pequenas entre as folhas.

**Extrair:** o **parallax por desfoque** — três profundidades distinguidas só
pela nitidez, sem mudar de tamanho. E a mistura de dois tamanhos de matéria
(folhas grandes, partículas pequenas) na mesma queda.
**Rejeitar:** o fundo verde-acinzentado (gramática 6) e o realismo fotográfico —
o Sistema é simbólico, e uma folha fotográfica num céu de símbolos é uma colagem.
**Risco de imitação:** baixo.
**Aplicação possível:** o arco Harvest, se a camada sazonal ganhar matéria.
**Estado:** parcialmente útil.

### R21 · `03-universe-materials/primavera` · MATERIAL + INFORMATION — analisada
720×1280 · 171,02 s · 30 fps · **das mais fortes por aplicar**

**Factual:** flores de cerejeira sobre preto puro, com **caixas de deteção e
valores de confiança sobrepostos** — retângulos brancos finos, linhas-guia entre
pontos, e números como `0.90000004`, `0.7`, `1.2`. Matéria orgânica por baixo,
instrumento analítico por cima. Nos bordos a matéria desfaz-se em partículas.

**Extrair:** esta é a relação inteira do Sistema numa imagem — **o mundo é
matéria, o instrumento mede-o**, e os dois coexistem sem que um vire decoração do
outro. Caixas finas e brancas, linhas-guia entre pontos medidos, tipografia de
dados pequena. A paleta magenta-violeta já é a certa.
**Rejeitar:** os números como textura. `0.90000004` é ruído de vírgula flutuante
a fingir precisão, e no Sistema um número que aparece tem de ser real —
a lei "o Sistema mostra provas, não sinais".
**Risco de imitação:** médio. O risco não é estético, é ético: copiar a
*aparência* de medição sem medir nada é exatamente a mentira que o projeto
proíbe.
**Aplicação possível:** o arco Bloom; e a linguagem "instrumento sobre matéria"
que a zona Universo já usa sem a ter nomeado.
**Estado:** analisada.

### R22 · `03-universe-materials/primavera` · MATERIAL — analisada
720×1280 · 15,07 s · 30 fps

**Factual:** um **ramo de cerejeira a florir em time-lapse** sobre preto puro. Os
botões abrem em sequência de baixo para cima; no fim a imagem escurece.

**Extrair:** **a floração como sequência e não como estado**. O ramo não aparece
florido — floresce, e a ordem é legível. É o argumento visual para a progressão
por acumulação em vez de por preenchimento, e a única referência da biblioteca
que mostra *tempo biológico*.
**Rejeitar:** o realismo botânico; o escurecimento final, que é fim de clipe e
não fim de arco.
**Risco de imitação:** baixo.
**Aplicação possível:** o arco Bloom, e a formação de uma constelação de domínio
— hoje as estrelas aparecem todas de uma vez.
**Estado:** analisada.

### R23 · `03-universe-materials/primavera` · DUPLICADA
720×1280 · 15,07 s · 30 fps

**Duplicada por hash de R22.** Não reaberta, pela mesma razão de R12.
**Estado:** duplicada (= R22).

### R24 · `04-panels-instruments/radar` · INFORMATION — analisada
736×414 · 7,57 s · 30 fps

**Factual:** duas partes. Primeiro, um **alvo circular de HUD** que se compõe por
camadas — anéis concêntricos, arcos segmentados, contas, tracejados — a partir de
um ponto. Depois, um **campo de arestas** azul com um clarão central.

**Extrair:** a **composição por camadas a partir de um ponto**: o alvo não aparece
feito, monta-se de dentro para fora, e cada camada acrescenta precisão. É uma
forma de dizer "a focar" que não é um spinner.
**Rejeitar:** tudo o resto — o ciano, os arcos segmentados de HUD de ficção
científica, a barra diagonal de varrimento e o campo de arestas, que é o mesmo
erro de R08.
**Risco de imitação:** **alto**. O Radar do Sistema já esteve perto disto e foi
salvo por passar o eixo para o tempo; esta referência puxa-o de volta.
**Estado:** analisada, com a ressalva de que o valor está na *ordem de montagem*
e não em nada do que se vê.

### R27 · `01-shell-navigation/sistema` · LIGHT — analisada
Imagem única (não é vídeo — ver gramática 11)

**Factual:** uma **onda de luz violeta horizontal** sobre preto: camadas de véu
sobrepostas, com uma zona central de linhas finas paralelas que dá textura. As
extremidades desvanecem.

**Extrair:** a paleta é exatamente a do Sistema, sem correção. E a estrutura da
onda — véu largo por fora, **linhas discretas por dentro** — é a mesma passagem
de difuso a discreto da gramática 5, mas em repouso em vez de em transição.
**Rejeitar:** a moldura clara à volta, que é do ficheiro e não do conteúdo.
**Risco de imitação:** baixo.
**Nota de registo:** a gramática 11 diz que "a referência da transição entre
zonas é um PNG estático — não existe". Estava certa quanto a não haver vídeo, e
**incompleta**: a imagem existe e tem conteúdo utilizável. Corrigido lá.
**Estado:** analisada.

### R28 · `03-universe-materials/verão` · MATERIAL — parcialmente útil
720×1280 · 8,83 s · 30 fps

**Factual:** **reflexo do sol na água ao pôr-do-sol** — uma coluna vertical de luz
dourada que se parte em centenas de lascas brilhantes sobre ondulação escura.

**Extrair:** **uma fonte de luz vista através de matéria irregular vira muitos
pontos**. É a explicação física do céu do Sistema: uma só origem, muitas
estrelas. E a coluna vertical mantém-se legível apesar de ser feita de fragmentos
soltos — coerência sem continuidade.
**Rejeitar:** o dourado saturado; o realismo fotográfico.
**Risco de imitação:** baixo.
**Estado:** parcialmente útil.

### R29 · `03-universe-materials/winter` · MATERIAL — parcialmente útil
1024×576 · 14,40 s · 50 fps

**Factual:** **flocos de neve brancos a cair sobre preto puro**, com densidade a
aumentar ao longo do clipe. Tamanhos variados; alguns flocos são estrelas de seis
pontas nítidas, a maioria são riscos.

**Extrair:** as **duas populações** — poucos objetos definidos e muitos traços
indistintos. É a distribuição que o céu do Sistema já usa nas estrelas e nos
filamentos do Núcleo, e esta é a referência que a justifica. E a densidade a
crescer como forma de dizer intensidade sem mudar nada mais.
**Rejeitar:** a queda vertical constante, que num céu diz chuva e não espaço.
**Risco de imitação:** baixo — o preto puro e o branco são a base do produto.
**Estado:** parcialmente útil.

### R30 · `03-universe-materials/winter` · MATERIAL — parcialmente útil
600×338 · 35 fr · 7 fps

**Factual:** macro de um **cristal de gelo** com profundidade de campo curta —
o cristal nítido ao centro, bokeh azul e âmbar à volta. 7 fps: o movimento é
quase uma sequência de fotografias.

**Extrair:** **estrutura hexagonal cristalina** como forma de "consolidado" —
o oposto exato do difuso. E o bokeh: luzes fora de foco são profundidade barata e
legível.
**Rejeitar:** o âmbar no bokeh, que suja a paleta; e os 7 fps, que no produto
seriam lidos como falha.
**Risco de imitação:** baixo.
**Aplicação possível:** o arco Winter; e a forma cristalina como alternativa ao
círculo para uma estrela consolidada.
**Estado:** parcialmente útil.

## Inventariadas — medidas, por interpretar

Todas têm 12 frames e contact sheet em `98-extracted-frames/`. Confiança
**nenhuma** até serem vistas.

| ID | Categoria | Resolução | Duração | FPS | Papel provável |
|---|---|---|---|---|---|
_As 21 animadas que estavam nesta tabela foram abertas e passaram para a secção
"Analisadas na Fase 7Z", acima. A tabela de inventário animado deixou de existir
porque deixou de ter linhas._
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
