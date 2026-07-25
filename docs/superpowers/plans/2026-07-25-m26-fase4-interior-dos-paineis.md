# Missão 26 · Fase 4 — o interior dos painéis

**Objetivo:** fazer os painéis pertencerem à Órbita Instrumental por dentro, e
baixar o mobile dos ~7,9 ecrãs. É a primeira fase que edita conteúdo de painel —
a barreira que segurou as Fases 2 e 3 cai aqui, de propósito e com método.

**Arquitetura:** um primitivo de painel partilhado em `src/design-system/`
substitui as convenções do `hud.css` DENTRO da shell. Os painéis migram um a um,
começando pelo mais denso, que estabelece o padrão — o mesmo método que a Missão
25 Fase 3 usou com o herói.

## Constrangimentos globais

- **A lógica de cálculo não se toca.** Motor de XP, SM-2, triagem, anti-farm,
  reversões e streaks continuam intocados. Divergência de número = bug.
- O `hud.css` **não se apaga**: continua a servir o HUD sem `?shell=`, que é o
  comportamento por omissão até ao gate de produção.
- Um painel migrado tem de continuar a funcionar nas duas cascas.
- Sem alterações a schemas, escrita, autenticação ou produção.
- Verificação por browser real: `tsc`, `build`, consola, network, screenshots a
  1440×900 e 390×844, e **paridade de números antes/depois de cada painel**.

## O problema, medido

| | 1440 | 390 |
| --- | --- | --- |
| Operações, ecrãs de scroll | 3,81 | **7,85** |
| Largura do painel | 762 px | 284 px |

O desktop está resolvido pela composição externa. O mobile não, e não é
resolvível por fora: sete painéis desenhados para desktop numa coluna de 284 px
são sempre longos. O que os faz longos, painel a painel, é o que esta fase mede
primeiro e corta depois.

## Ordem — MEDIDA, não suposta

Escrevi este plano a assumir que as Missões eram o painel mais pesado. **A
medição desmentiu-me.** Operações a 390 px, com os mesmos dados densos:

| Painel | Altura | Quota |
| --- | --- | --- |
| **Treino** | **1271 px** | **28%** |
| Missões | 755 px | 17% |
| Calendário | 623 px | 14% |
| Diário | 585 px | 13% |
| Sono | 497 px | 11% |
| Revisão do Dia | 378 px | 8% |
| Shadow Army | 360 px | 8% |

Total 4 855 px em 605 px visíveis = **8,02 ecrãs**.

O Treino sozinho vale mais do que o Calendário e o Diário juntos, e quase o
dobro das Missões. É um formulário de 5 linhas de exercício, cada uma com
campos sempre abertos — a forma de painel que pior sobrevive a 284 px de
largura. Se há um painel que justifica abrir esta fase, é este.

Ordem corrigida:

1. **Treino** — 28% da altura. Padrão para todos os formulários.
2. **Missões** — o mais usado; padrão para listas com metadados.
3. **Calendário** — grelha de mês numa coluna de 284 px.
4. **Diário** — mata a grelha `.cols` herdada e a regra de rede de segurança
   sai do `instrumental.css`.
5. **Sono**, **Revisão**, **Shadow Army** — o resto de Operações.
6. Restantes zonas, se a fase não tiver esgotado o seu âmbito.

## Tarefa 1 — medir antes de cortar (CONCLUÍDA 2026-07-25)

Feita. A tabela está acima e mudou a ordem da fase. Foi barato e evitou
começar pelo painel errado.

## Tarefa 2 — o primitivo de painel

**Ficheiros:** criar `src/design-system/Panel.tsx` e `panel.css`.

**Produz:** `<Panel title, hint?, actions?, children>` — material de repouso,
sem borda, título em Inter com peso, `hint` colapsável em vez de permanente.

- [ ] Escrever o primitivo com a API acima.
- [ ] Aplicá-lo a um painel trivial primeiro (`Shadows`) para validar a API sem
      arriscar o painel mais complexo.
- [ ] Verificar que o HUD sem `?shell=` continua idêntico.
- [ ] Commit.

## Tarefa 3 — Treino, o padrão dos formulários

**Ficheiros:** modificar `src/components/Training.jsx`.

1271 px e 28% da zona. Cinco linhas de exercício com campos sempre abertos,
mais o conselho, mais as estatísticas. O que muda é apresentação; o avanço de
passo, o teto diário de XP e a trava do volume extra ficam intocados.

- [ ] Linhas de exercício: hoje todas abertas ao mesmo tempo. Passa a mostrar o
      passo atual e o alvo por linha, com os campos a abrir na linha em que se
      está a registar. A informação continua toda acessível — o que muda é
      quantos campos estão abertos de uma vez.
- [ ] Conselho (`trAdvice`): de bloco permanente a linha única, expansível.
- [ ] Estatísticas de sessões: de lista a resumo com detalhe expansível.
- [ ] **Paridade:** o mesmo passo por linha, o mesmo XP ao registar, o mesmo
      teto na segunda sessão do dia, a mesma trava aos 4 dias seguidos.
      Verificar com o mesmo estado semeado antes e depois.
- [ ] Medir a altura a 390 px e comparar com os 1271 px de partida.
- [ ] Commit — e **parar aqui para revisão**. O padrão só se replica depois de
      aprovado.

## Tarefas 4+ — replicar

Definidas depois da revisão da Tarefa 3, porque dependem do padrão que ela
fixar. Escrevê-las agora seria inventar o que ainda não sei.

## Riscos

| Risco | Mitigação |
| --- | --- |
| Esconder informação para cumprir a métrica | A Tarefa 1 mede antes de cortar; cada corte diz que informação continua acessível e como |
| Divergência de números ao mexer no markup | Paridade verificada painel a painel com o mesmo estado semeado |
| O painel migrado partir o HUD sem `?shell=` | Gate explícito em cada tarefa |
| A fase inchar para as 6 zonas | Âmbito declarado: Operações primeiro; o resto só se sobrar |

## Rollback

Cada painel é um commit próprio. Reverter um painel não afeta os outros, e a
shell continua a funcionar com painéis migrados e por migrar ao mesmo tempo.
