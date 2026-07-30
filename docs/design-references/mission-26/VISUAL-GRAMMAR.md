# VISUAL-GRAMMAR — princípios extraídos das referências

> Missão 26 · aberto 2026-07-28.
> **Este documento cresce com a análise.** Hoje assenta em três referências
> (R15, R17, R19). Não é uma teoria completa do movimento do Sistema — é o que
> se pode afirmar com base no que foi mesmo visto.

## A regra que governa este ficheiro

Um princípio só entra aqui quando:

1. foi observado numa referência concreta, identificada pelo ID;
2. está escrito em palavras próprias, não como descrição da referência;
3. tem uma consequência prática para o Sistema;
4. tem uma resposta para `prefers-reduced-motion`.

Sem os quatro, é uma impressão — e impressões não decidem código.

---

## 1. A energia converge para dentro

**Observado em:** R15.

Nessa referência os filamentos de luz varrem **do ambiente para a esfera**, não
da esfera para fora. A explosão para fora só acontece no pico, e dura pouco.

**Porque importa:** é a lei do Sistema já escrita no `CLAUDE.md` — *toda a
energia relevante converge para o Núcleo*. A referência dá-lhe forma visual.

**Consequência:** num evento de XP, nível ou missão concluída, o movimento
começa **na periferia** e resolve-se no centro. O contrário — partículas a
saltar do centro para fora — é o efeito de "confetti" genérico, e diz o oposto
da lei.

**Reduced motion:** a convergência é o significado, não o movimento. Sem
animação, exprime-se por uma transição de estado do Núcleo (A → B), sem trajeto.

---

## 2. Um evento tem de deixar o mundo diferente

**Observado em:** R15.

A esfera final não é a inicial: é maior e tem mais estrutura interna. O evento
não repõe o estado anterior.

**Porque importa:** liga-se a *o Sistema mostra provas, não sinais*. Uma
animação que acaba onde começou é decoração — comunicou entusiasmo, não
mudança.

**Consequência:** qualquer celebração no Sistema tem de ter um **delta
persistente**. Se depois da animação nada no ecrã está diferente, a animação
não devia existir. O Núcleo já faz isto (`coreSz = 46 + state*14`); o princípio
generaliza-se aos outros eventos.

**Reduced motion:** trivial — só o delta sobrevive, que é a parte que importa.

---

## 3. Presença é ciclo; evento é arco

**Observado em:** R19 (ciclo) contra R15 (arco).

R19 não tem princípio nem fim: as fitas rodam indefinidamente. R15 tem seis
fases claras e termina.

**Porque importa:** são duas gramáticas diferentes e não se misturam. Uma
presença que se comporta como evento vira alarme. Um evento que se comporta como
ciclo nunca comunica que terminou.

**Consequência:** o Oráculo em estado Ambient usa ciclo — lento, de baixa
amplitude, indiferente ao tempo. Um relatório novo, uma decisão pendente ou uma
subida de nível usam arco, com fim visível.

**Reduced motion:** o ciclo pára e fica a forma. O arco colapsa para a transição
entre estados finais.

---

## 4. O brilho da referência não é o brilho do produto

**Observado em:** R15 (bloom branco a 100%), R17 (azul saturado), R19 (violeta
em alta intensidade constante).

As três são peças isoladas em fundo preto, **sem texto por cima**. O Sistema tem
sempre texto por cima.

**Porque importa:** é o mesmo problema que já foi resolvido no céu — o véu a
0.45 existe porque a nebulosa bonita e o relatório legível competem pelo mesmo
espaço.

**Consequência:** ao portar qualquer destas referências, a intensidade desce.
O valor de referência é o **contraste relativo** entre repouso e pico, não o
valor absoluto de luminosidade.

**Reduced motion:** sem efeito direto, mas a mesma disciplina aplica-se ao
contraste estático.

---

## 5. Do difuso ao discreto marca o fim de um processo

**Observado em:** R17.

Durante a espera, partículas dispersas em órbita. Quando termina, formam um anel
de contas **contáveis**. O contínuo torna-se discreto.

**Porque importa:** é um indicador de progresso que não é uma barra nem um
spinner, e que distingue "a trabalhar" de "pronto" sem texto.

**Consequência:** candidato direto ao estado `ocBusy` do Oráculo, que hoje é um
`box-shadow` a pulsar (`hud.css:370`) — comunica atividade, mas não comunica
conclusão.

**Reduced motion:** a passagem difuso → discreto faz-se por troca de estado, sem
trajeto. Continua a ler-se.

---

## 6. Luz sobre preto, nunca sobre cinzento

**Observado em:** R17 e R19, ambas sobre preto puro.

O que dá o brilho não é a intensidade da luz — é a ausência de luz à volta dela.

**Porque importa:** confirma a decisão do véu translúcido. Um fundo cinzento
rouba o preto que faz a luz existir.

**Consequência:** onde houver um elemento luminoso do Sistema, o que está à
volta tem de descer, não o elemento subir. Foi o que se fez no botão primário:
calou-se o botão em vez de se acender tudo o resto.

---

## Riscos de imitação — o que não se copia

| Referência | O cliché | O que fazer |
|---|---|---|
| R17 | azul-ciano de HUD de ficção científica; anéis holográficos | usar a gramática (contrair, discretizar), manter violeta/magenta |
| R19 | esfera de fitas violeta = "AI assistant" genérico | ligar a estado real; se não há nada a dizer, não se agita |
| R15 | partículas de celebração; bloom de videojogo | convergência ligada a evidência, com delta persistente |
| Jarvis (geral) | anéis, wireframes azuis, tipografia mono a toda a largura | referência **funcional**: antecipar, resumir, executar. Não a aparência |

## Por escrever

Há 45 referências inventariadas e por interpretar. Estas secções abrem quando
houver observação real que as sustente — e não antes:

- **Transição entre zonas da shell** — a referência que existia (R27) é um PNG
  estático. Falta material.
- **Materiais do Universo** — nebulosa, poeira, profundidade.
- **Identidade do Operador** — ranks, títulos, cartão.
- **Estações** — outono, primavera, verão, winter: 12 ficheiros por ver.
- **Radar e notificações**.

---

# Segunda passagem — 2026-07-28 · Fase 0 completa

Sete referências analisadas. Os princípios 1–6 mantêm-se. Acrescentam-se:

## 7. Instrumento é trilho e visor, não grelha de cartões

**Observado em:** R26.

Um trilho estreito de leituras técnicas encostado a um lado, e um visor grande
com o objeto de atenção. A informação não está distribuída em caixas iguais:
está dividida entre **o que se lê** e **o que se observa**.

**Porque importa:** a missão proíbe transformar cada elemento num cartão, e a
Fase 4 já tinha medido o custo disso — sete painéis, 3,81 ecrãs. O trilho é a
alternativa estrutural, não um estilo.

**Consequência:** nas zonas instrumentais, separar métricas (trilho, densas,
mono, pequenas) do objeto de trabalho (visor, grande, com espaço). Radar e
Universo são os candidatos diretos.

**Reduced motion:** sem efeito — é estrutura, não movimento.

## 8. Uma relação desenha-se com um arco, não com uma linha de tabela

**Observado em:** R26 (arcos entre luzes de cidades).

O que torna aquele visor legível não são os pontos: são os arcos que os ligam.
A relação é a informação.

**Consequência:** as Constelações já ligam estrelas. O princípio estende-se: uma
missão que pertence a um arco sazonal, uma Sombra que nasceu de um objetivo, uma
revisão que vem de uma nota — todas são relações que hoje se exprimem com um
chip de texto. Um arco diz mais e ocupa menos.

**Reduced motion:** o arco é estático; só o seu aparecimento seria animado.

## 9. Vertical é ascensão

**Observado em:** R11.

Feixes de luz a subir. Não há metáfora a explicar: o que sobe, melhora.

**Consequência:** um evento de nível move-se para cima. Um decaimento move-se
para baixo. A direção do movimento passa a ser semântica e não escolha estética.

**Reduced motion:** a direção sobrevive numa transição sem trajeto — o elemento
aparece em cima em vez de percorrer o caminho.

## 10. Um rank é um manómetro, não um crachá

**Observado em:** R25.

A letra ao centro diz *qual*. O anel diz *quanto*. Só o anel exterior se mexe.

**Porque importa:** é a diferença entre um selo decorativo e um instrumento.
Um crachá com "S" pode ser desenhado sem dados; um manómetro não — precisa de um
valor verdadeiro para ter posição.

**Consequência:** o Rank do Operador passa a mostrar a distância ao próximo, não
só o atual. Se não houver valor real, não há anel.

**Reduced motion:** o anel não pulsa; a posição mantém-se, que é o que informa.

## 11. Quando não há referência, decide a gramática

**Observado em:** a ausência de R27.

A referência da transição entre zonas é um PNG estático — não existe. A
transição da Fase C foi construída a partir dos princípios 1, 3 e 9, e não de
uma imagem.

**CORREÇÃO, 2026-07-30.** Este princípio estava certo quanto ao facto (R27 não é
vídeo) e **incompleto** quanto à conclusão. A imagem foi finalmente aberta na
Fase 7Z e tem conteúdo utilizável: uma onda de luz violeta com véu largo por
fora e linhas discretas por dentro, na paleta exata do Sistema. Não havia
movimento para observar; havia matéria, e ninguém tinha olhado. O princípio
mantém-se — a decisão foi mesmo tomada sem referência — mas "não existe" era
demasiado forte: o que não existia era a sequência.

**Porque importa:** fica registado que aquela decisão **não tem referência
visual**. Se um dia aparecer o vídeo, a decisão é revisitável com base nova.
Uma decisão sem origem declarada é uma decisão que ninguém pode contestar.

## 12. Uma cerimónia de cada vez, e cede quem não tem substituto

**Observado em:** o ARISE por cima do céu, numa folha de contacto do Universo.

Dois dos doze frames da sequência de evidência eram só a palavra ARISE por cima
de um escurecimento a 60%. Por baixo estava a partícula a atravessar o campo, a
estrela a nascer e a energia a convergir — exatamente o que o Universo existe
para mostrar.

**A regra não é "menos cerimónias".** É que quando duas anunciam o mesmo facto,
cede a que tem **substituto** no sítio onde o Operador está. A conclusão de
missão tem um substituto local e melhor, porque diz qual domínio recebeu o quê.
Uma conquista **não tem**: o satélite dela é um ponto de 4px no bordo, e por
isso a cerimónia global fica.

**Corolário, e já custou uma regressão:** um facto = um canal de anúncio. As
palavras vêm da fila; a reação do mundo fica onde estava.

**Reduced motion:** irrelevante — a regra é de atenção, não de movimento.

## 13. Quem tem profundidade não anima; quem anima não tem profundidade

**Observado em:** três defeitos da mesma família, todos medidos.

Um `@keyframes` que anima `transform` **substitui** o transform do elemento. A
deriva da poeira estava a apagar o `translateZ(-1400px)` que lhe dava
profundidade: a camada aparecia como `matrix()` 2D e o cursor não a movia. E uma
transform aplicada a conteúdo **dentro** de um SVG não é composta — repinta o
desenho inteiro a cada frame, o que pôs a chegada ao Núcleo a 50ms.

**A regra:** a camada carrega a profundidade e fica quieta; os filhos derivam.
Num espaço com perspetiva isto não é arrumação — é a diferença entre haver
espaço e haver uma imagem que se mexe.

**Corolário de método:** a perspetiva entra na conta da escala. Uma camada a
−520px com a câmara a +780 é ampliada 1100/(1100−260) = 1,31.

**Reduced motion:** a profundidade sobrevive inteira; é a deriva que para. É
mais um argumento para a separação.

## 14. Uma anti-referência arquivada na pasta certa é mais perigosa que uma má ideia

**Observado em:** R16 na pasta `02-oracle-presence`, R09 na pasta `icon`.

Das trinta referências animadas, quatro são anti-referências — e as duas piores
não estão numa pasta de rejeitados: estão arquivadas exatamente onde alguém as
vai procurar. R16 é **um olho** guardado na pasta do Oráculo; R09 é uma **moldura
ornamentada com neon roxo** guardada na pasta de identidade.

O risco não é o conteúdo. É a **localização**: quem for buscar "uma referência
para o Oráculo" encontra um olho primeiro, e um olho, para um assistente, diz
vigilância e não conselho — é Sauron ou HAL antes de ser qualquer outra coisa, e
a Constituição do Oráculo tem exatamente essa leitura a perder.

**A regra:** uma anti-referência tem de ser marcada como tal **no sítio onde
está**, e não só numa lista à parte. Um ficheiro sem veredicto escrito é um
convite.

**Reduced motion:** irrelevante — é uma regra de arquivo, não de movimento.

## 15. Um estado distingue-se pela FORMA antes de se distinguir pela cor ou pelo ritmo

**Observado em:** S05.

A referência mostra três estados cognitivos — PREDICTION, COGNITIVE
MISALIGNMENT, MEMORY ECHO — e cada um é uma **forma diferente** de filamentos:
ramificação aberta, dois núcleos a puxar em sentidos opostos, dispersão sem
centro. Tudo branco sobre preto. Nenhuma cor, nenhum rótulo colorido, nenhuma
velocidade diferente — e distinguem-se de relance.

O Oráculo do Sistema distingue os seus estados por **intensidade e ritmo do
mesmo sigilo**. Funciona, e é frágil: quem não vir o movimento não vê o estado,
e em `prefers-reduced-motion` fica só a intensidade.

**A regra:** a forma é o canal mais robusto. Cor pode falhar por daltonismo,
ritmo falha em reduced motion, intensidade falha em ecrã claro. A forma
sobrevive aos três.

**Reduced motion:** é o argumento principal, não uma nota de pé de página.

## 16. Uma maqueta com dados falsos não é uma referência — é um aviso

**Observado em:** S08, S16, S09.

Três das vinte estáticas são interfaces de demonstração que ninguém reviu. S08
tem **todos** os rótulos a dizer "Thema" — o texto de exemplo do template. S16
repete "WISDOM" e "CHARISMA" duas vezes, com valores diferentes. S09 inventa um
diretório de agentes com nomes que não existem.

Nenhuma delas é má por ser feia. São más porque **parecem dados e não são**, e
quem as usar como referência importa esse hábito antes de importar o estilo.

**A regra:** antes de extrair alguma coisa de uma referência de interface, ler
o texto dela. Se o texto for falso, o resto também é decoração — e a lei do
projeto é que o Sistema mostra provas, não sinais.

**Reduced motion:** irrelevante — é uma regra de leitura, não de movimento.

