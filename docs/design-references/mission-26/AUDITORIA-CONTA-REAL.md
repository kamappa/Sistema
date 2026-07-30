# Auditoria read-only à conta real — plano

Missão 26 · Fase 7Z · preparado a 2026-07-30
**Estado: por executar. Espera a sessão real do Chrome, dada pelo Daniel.**

Este documento existe para a auditoria ser **combinada antes** e não improvisada
durante. Enquanto ela não acontecer, a Missão 26 fica em
**A · IMPLEMENTAÇÃO CONCLUÍDA — ACEITAÇÃO PENDENTE**.

---

## 1 · Porque é que isto não pode ser feito com a semente

Tudo o que foi verificado até aqui correu num perfil de Chrome temporário e
vazio: sem sessão Supabase, com um estado semeado, no caminho offline. Isso
provou muita coisa e **não pode provar estas**:

- se os números que o Sistema mostra são os números que o Daniel tem;
- se o Oráculo responde, e o que responde;
- se o War Room lê o que diz que lê;
- se os relatórios existem e com que datas;
- se há dados reais que partem uma vista construída contra uma semente.

A semente foi escrita por mim. Uma vista que passa contra os meus próprios dados
está a passar contra a minha própria imaginação.

---

## 2 · O que se abre, e por que ordem

| # | Onde | O que se observa |
|---|---|---|
| 1 | Entrada / sessão | O estado carrega? Quanto demora? O indicador de sincronização diz o quê? |
| 2 | Núcleo | Próxima Ação — a precedência escolhe o mesmo que o Daniel escolheria? O briefing do Oráculo tem atribuição visível? Os zeros aparecem como `—` e não como `0`? |
| 3 | Radar | Qual dos quatro estados aparece com dados reais? A hora da próxima passagem está marcada como previsão? |
| 4 | Operações | As missões, os prazos e o calendário batem certo com o que o Daniel sabe de cor? |
| 5 | Corpo e Recuperação | O nível de recuperação; **e a verificação de que "Pavimento Pélvico" aparece uma só vez** |
| 6 | Universo | Os seis níveis; a soma dos veios = soma real; o rank; a protoestrela na fase certa; **a escala 3 com o registo real dele** |
| 7 | Oráculo | AMBIENT, LISTENING, THINKING, INSIGHT, WARNING, CONSELHO, WAR ROOM — os estados que offline não existem |
| 8 | Reflexão | O que mostra com histórico real |
| 9 | Escada de Ascensão | O rank real e o que falta |

---

## 3 · Ações PROIBIDAS

Nenhuma destas é executada por mim, em nenhuma circunstância, mesmo que pareça
inofensiva ou reversível:

- concluir · aceitar · ignorar · enviar · guardar · criar · responder · alterar
- selecionar uma opção que persista
- iniciar treino · registar sono · aceitar arco
- marcar um hábito, um pilar ou uma rotina
- abrir qualquer ação com efeitos secundários incertos

**Regra prática:** se não souber ao certo se um clique escreve, não clico.
Pergunto ao Daniel e ele decide.

**O que fica ao Daniel, se for preciso:** qualquer escrita. Eu observo e valido;
não executo.

---

## 4 · Riscos, e como são geridos

| Risco | Mitigação |
|---|---|
| Um clique de navegação que afinal persiste | Antes de clicar em qualquer coisa que não seja uma marca de órbita, digo em voz alta o que espero que aconteça e espero confirmação |
| A cerimónia de arco disparar por eu abrir o preview | O preview é read-only por desenho, mas **não abro** o botão de aceitar; e se o preview abrir sozinho, não toco |
| O Oráculo consumir mensagens do limite diário | Cada pergunta gasta uma das 12. Combinar quantas se podem gastar **antes** de começar |
| Custo de API do Oráculo | O mesmo: as perguntas custam. Nenhuma sem combinação prévia |
| Screenshots com dados pessoais | Ver secção 5 |
| Eu tomar um número real por um número errado | Os números reais são do Daniel; ele é a autoridade. Aponto divergências, não as corrijo |

---

## 5 · Screenshots e sanitização

**Nenhum screenshot da conta real entra no Git.** Nem em `docs/`, nem em
`local/` (que é gitignored mas é do repositório), nem em qualquer artefacto que
seja commitado.

Os screenshots vivem só no directório de scratchpad da sessão, e o que é
transportado para a documentação é **texto que eu escrevo**, não a imagem.

Precisa de sanitização, se alguma vez for citado por escrito:

- nomes de missões e objetivos reais (podem conter empregador, pessoas, projetos)
- entradas do registo (`S.log`) — dizem o que ele fez e quando
- datas de sono e de treino
- conteúdo do Oráculo: perguntas e respostas
- nomes em Vínculos
- qualquer coisa em Recall e no Vault
- e-mail e identificadores de sessão

**O que pode ser citado sem sanitização:** níveis, XP, contagens, rank, estados
de sincronização, e nomes de domínio (Ofício, Saber…) — que são do produto e não
dele.

---

## 6 · O que a auditoria tem de responder

1. Algum número mostrado contradiz o estado guardado? *(A primeira lei.)*
2. Alguma vista construída contra a semente parte com dados reais — listas
   vazias, textos demasiado longos, datas fora do intervalo esperado?
3. Os estados do Oráculo que offline não existem comportam-se como desenhados?
4. O War Room separa "ligado" de "não existe" com dados reais por trás?
5. Há alguma coisa que pareça um dado e não seja?

---

## 7 · Como começa

O Daniel diz quando. Precisa de:

- Chrome com a sessão dele iniciada;
- concordância sobre quantas perguntas ao Oráculo se podem gastar;
- estar presente, porque qualquer escrita é dele.

Eu não peço aprovação antes deste ponto — os quatro pontos anteriores da Fase 7Z
foram autorizados a correr sozinhos. **Aqui paro.**
