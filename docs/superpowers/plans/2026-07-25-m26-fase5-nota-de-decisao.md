# Missão 26 · Fase 5 — Composição operacional mobile

> **NOTA DE DECISÃO. Nada implementado.** Nenhuma opção foi escolhida, e não
> foram criados separadores nem segundo nível. Os sete painéis continuam todos
> visíveis na zona Operações.

## De onde vem esta questão

A Fase 4 levou a zona Operações de **8,02 para 6,68 ecrãs** a 390 px, sem
esconder informação de leitura diária e sem alterar o modelo de utilização. O
Daniel retirou a meta rígida de "menos de 5 ecrãs" dos critérios da Fase 4,
por decisão explícita: persegui-la com compressões marginais degradaria a
legibilidade.

A questão que fica é diferente e mais funda: **a zona Operações deve mostrar
sete instrumentos de uma vez?** Isso não é um problema de altura — é um
problema de composição.

Estado medido no fecho da Fase 4 (390×844, dados densos):

| Painel | Altura |
| --- | --- |
| Treino | 933 px |
| Missões | 699 px |
| Calendário | 590 px |
| Diário | 527 px |
| Revisão do Dia | 326 px |
| Shadow Army | 308 px |
| Sono | 272 px |
| **Total** | **4 041 px em 605 visíveis = 6,68 ecrãs** |

## Opção A — Operações abre em "Hoje"

Diário e Missões como conteúdo primário; os restantes cinco com acesso
explícito e visível.

- **Vantagens:** o caso comum (ver o que falta hoje, marcar um pilar) fica no
  primeiro ecrã. ~1 226 px em vez de 4 041 à entrada.
- **Custos:** cria um segundo nível dentro de uma zona que já é um nível.
  Duplica o conceito de navegação — órbita para zonas, mais outra coisa dentro
  de Operações.
- **Uso diário:** melhor para o registo, pior para a revisão semanal.
- **Ações:** 0 para o comum; **+1** para Treino, Sono, Revisão, Calendário.
- **Risco de esquecimento:** **alto.** O Treino e o Sono passam a exigir
  intenção. Um hábito que depende de te lembrares dele é um hábito que se
  perde — e é precisamente o que o Sistema existe para evitar.

## Opção B — grupos: Agora · Rotina · Revisão e recuperação

Os mesmos grupos que já existem no `zones.ts` para desktop, tornados navegáveis
em mobile.

- **Vantagens:** reaproveita uma estrutura já decidida e testada em desktop.
  Coerência entre os dois tamanhos. ~3 grupos em vez de 7 painéis.
- **Custos:** continua a ser um segundo nível, mas com uma lógica que o
  Operador já viu no ecrã grande.
- **Uso diário:** "Agora" cobre o registo; "Rotina" o treino e o sono;
  "Revisão" o resto.
- **Ações:** +1 para sair do grupo atual; 0 dentro dele.
- **Risco de esquecimento:** **médio.** Três rótulos permanentes lembram que
  há mais — melhor do que a Opção A, onde o resto desaparece atrás de um
  botão genérico.

## Opção C — índice operacional no topo

Uma faixa com os sete nomes que salta para o painel, sem esconder nada.

- **Vantagens:** **zero conteúdo escondido** — a propriedade que a Fase 4
  defendeu a cada passo. Nenhum segundo nível. É o mais barato de construir e
  o mais fácil de reverter.
- **Custos:** os 6,68 ecrãs **continuam lá**. Resolve o "encontrar", não o
  "percorrer". Acrescenta ~44 px fixos ao topo.
- **Uso diário:** um toque leva a qualquer instrumento.
- **Ações:** +1 para saltar, mas evita o scroll longo.
- **Risco de esquecimento:** **nenhum.** Tudo continua listado e visível.

## Como testar num telemóvel real

O servidor de desenvolvimento só ouve em `localhost`. Para abrir no telemóvel:

```
npm run dev -- --host          # expõe na rede local
```

O Vite imprime um endereço `http://192.168.x.x:5173/Sistema/?shell=1`. O
telemóvel tem de estar no mesmo Wi-Fi. Entra em modo offline (o botão
"Continuar offline") para não tocar na conta real.

Alternativa mais fiel: ligar a Vercel ao repositório e usar o Preview
Deployment que já está configurado em `vercel.json` — sem depender da rede
local, e com o build de produção em vez do dev server.

## Achados do mobile que a Fase 5 deve considerar

- **As células do Calendário medem 23×44 px.** A largura está muito abaixo do
  alvo de toque de 44 px. É pré-existente e não foi introduzido pela Fase 4,
  mas numa grelha em que se toca para escolher o dia, é um defeito real.
- **Dois campos de formulário sem `id`/`name`** (aviso do DevTools). Sem
  impacto funcional; afeta o preenchimento automático do browser.

## Recomendação

Nenhuma ainda — por desenho. As três opções dependem de como o Daniel usa a
app no telemóvel, e essa informação não existe até ele a usar. A checklist do
teste real é o que a produz.

A única coisa que já digo: **a Opção A é a que mais me preocupa.** Esconder o
Treino e o Sono atrás de uma ação extra é pedir que ele se lembre deles — e o
Sistema existe porque lembrar-se sozinho não funciona.
