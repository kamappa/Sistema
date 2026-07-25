# CLAUDE.md — Sistema (Daniel)

> Este ficheiro é o bootloader permanente do projeto. É carregado no início
> de cada sessão. O estado de execução e a história das missões vivem em
> `SPEC-CLAUDE-CODE.md`; a visão-mãe vive em
> `SYSTEM-EVOLUTION-ROADMAP.md`.

## Fontes de verdade e precedência

### Ordem documental oficial (aprovada 2026-07-25)

Quando duas fontes se contradizem, prevalece a que estiver mais acima:

1. segurança, legalidade e verdade;
2. Daniel;
3. `SYSTEM-ORACLE-CONSTITUTION.md`;
4. `CLAUDE.md`;
5. `SPEC-CLAUDE-CODE.md`;
6. `SYSTEM-EVOLUTION-ROADMAP.md`;
7. `docs/oracle-governance/`;
8. `ORACULO-ROADMAP.md`, como documento histórico;
9. documentação de missão;
10. implementação e outputs de ferramentas.

Esta é a única lista de precedência do projeto. Nenhum outro documento a
redefine; os que precisem dela apontam para aqui.

### Ordem de leitura ao arrancar

1. `CLAUDE.md` — regras permanentes, identidade, segurança e método.
2. `SPEC-CLAUDE-CODE.md` — estado real das missões, decisões fechadas,
   backlog e próxima fase elegível.
3. `SYSTEM-EVOLUTION-ROADMAP.md` — visão de longo prazo e leis do mundo;
   não é autorização para executar tudo de uma vez.
4. Código, `git status`, histórico e branch atual — prova final do que existe.

Precedência e leitura são coisas diferentes. A lista acima resolve conflitos;
esta ordena o arranque. O código e o histórico confirmam o estado que existe,
mas não decidem o que deve ser — para isso vale a precedência. Nunca adivinhar.

Estes três nomes são os canónicos. Ficheiros com sufixo `v2` foram fontes de
uma reconciliação e não devem ser recriados nem tratados como autoridade
paralela — ver `SPEC-CLAUDE-CODE.md`, secção da reconciliação de 2026-07-25.

## Frase de recuperação

Quando o Daniel disser **"vamos começar o verdadeiro sistema"**:

1. Não editar código imediatamente.
2. Executar `git status`, identificar a branch e ler os commits recentes.
3. Ler este ficheiro, o SPEC e as secções relevantes do ROADMAP.
4. Comparar documentação com o código real; declarar qualquer divergência.
5. Confirmar as ferramentas disponíveis nesta sessão:
   - Claude in Chrome;
   - Context7;
   - Tavily MCP ou pesquisa equivalente;
   - Playwright MCP;
   - Chrome DevTools MCP;
   - skills/plugins instalados.
6. Observar `localhost` no browser real quando possível e recolher uma
   baseline visual, consola e estado de rede.
7. Identificar a missão ativa e a próxima fase elegível. A Missão 24 está
   formalmente PAUSADA desde 2026-07-25 e não deve ser retomada sem decisão
   explícita; a missão corrente é a Missão 26.
8. Apresentar diagnóstico, ficheiros afetados, riscos, plano por fases e diff
   proposto.
9. Esperar concordância antes de alterar código.

A frase inicia um protocolo de recuperação e execução disciplinada; não é uma
autorização para implementar todo o roadmap numa única sessão.

## Quem é o Daniel

Estudante de Segurança e Proteção de Dados para Sistemas de Informação (SPDSI)
no IPCA Braga, a trabalhar em part-time na Worten. Objetivos de carreira:
auditoria ISO 27001, NIS2, RGPD/proteção de dados, AI Governance (EU AI Act,
ISO/IEC 42001, NIST AI RMF), estágio em cibersegurança/GRC e evolução futura
para funções de DPO, GRC, Cloud Security, AI Governance ou vCISO.

Pontos fortes: aprendizagem rápida, reconhecimento de padrões, pensamento
estratégico e curiosidade. O Sistema deve ajudá-lo a transformar aprendizagem,
hábitos, projetos, evidências e decisões numa trajetória coerente.

## Como colaborar

- Português de Portugal sempre.
- Sê intelectualmente exigente e honesto. Se uma proposta for apressada,
  sobrecarregada, incompatível com a arquitetura ou fugir do plano de fases,
  diz isso antes de executar.
- Explica o porquê, não só o quê. Usa exemplos práticos e, quando relevante,
  referências concretas de ISO 27001, ISO 19011, RGPD, NIS2, EU AI Act,
  ISO/IEC 42001 e NIST AI RMF.
- Privilegia decisões sustentáveis sobre demonstrações rápidas.
- Não transformar AI Governance em compliance seco: integrar estudo, risco,
  inventário, decisões, evidências, Radar, Oráculo e eventos do mundo.

## Leis do Sistema

- **O Sistema nunca mente.** Nada visualiza progresso sem evidência real;
  nenhum estado exibido pode contradizer o estado guardado.
- **O Sistema não representa a vida; manifesta visualmente a evolução.**
- **O mundo existe mesmo quando o Operador para.** Idle motion subtil,
  continuidade, tempo, clima e memória; nunca ruído constante.
- **Nenhuma animação é decorativa.** Movimento comunica estado, energia,
  tempo, foco, consequência ou transição.
- **Toda a energia relevante converge para o Núcleo.** XP, missões,
  certificações, projetos, hábitos, conhecimento e eventos geram respostas
  proporcionais e verificáveis.
- **O Sistema mostra provas, não sinais.** Um arco ou evento altera ambiente,
  recomendações, missões, narrativa e comportamento; não se reduz a um ícone.
- **Nada nasce do nada.** Estrelas, artefactos, memórias e eventos devem ter
  trigger, origem, data e evidência.
- **O produto é premium desde o primeiro dia.** A progressão muda o mundo e a
  história, não desbloqueia qualidade visual que estava artificialmente
  escondida.

## Regras de ouro de engenharia

- Propor antes de alterar: mostrar plano/diff e obter concordância.
- Uma fase de cada vez; não misturar missões nem saltar gates.
- Commits pequenos e descritivos, como trilho de evidência (A.8.32).
- Tudo o que gera dados fica estruturado, datado e interpretável pelo Oráculo.
- Preservar reversibilidade, fallbacks e rollback.
- Testar comportamento normal, `prefers-reduced-motion`, mobile e falha de
  rede antes de declarar uma fase concluída.
- Segredos nunca entram no código, documentação, prompts, screenshots ou
  commits. Usar Supabase Secrets, variáveis de ambiente ou autenticação MCP.
- Nunca fazer deploy, merge para `main` ou trocar produção sem autorização
  explícita do Daniel.

## Regra de arquitetura

A stack da frontend mudou por missão própria, com plano, verificação e
rollback — não por impulso nem por influência de skills ou referências. O
estado real, a 2026-07-25:

- **Produção** (GitHub Pages a servir `main`) continua a ser a aplicação
  estática Vanilla: scripts clássicos globais, `css/hud.css`, ilha WebGL de ES
  modules em `js/stage/` com Three.js r170 vendorizado, sem build step.
- **`react-migration`** contém a frontend React + Vite completa e verificada
  (Missão 25, 18 fases). O Vanilla vive nessa branch em `legacy/` como
  referência standalone.
- **`mission-26/renaissance-visual`** deriva de `react-migration` e é a branch
  de trabalho corrente (Missão 26 — Renaissance Visual).

Consequências para o método:

- A migração React/Vite **já foi executada**. Não a repetir, não a
  recomeçar e não a tratar como experiência futura ou hipótese.
- Não migrar implicitamente para Next.js, Tailwind, shadcn ou outra stack só
  porque aparecem em referências ou skills. Cada adição de tecnologia exige
  justificação, custo, alternativa, plano de rollback e aprovação — a mesma
  disciplina que produziu a Missão 25.
- O gate de produção mantém-se intacto: a troca do Pages do Vanilla para o
  React exige decisão explícita do Daniel. Enquanto não existir, `main` é a
  verdade em produção e não se altera.
- A frontend Vanilla não se apaga enquanto o React não estiver em produção e
  validado com a conta real.

## Pesquisa e ferramentas

O WebSearch/WebFetch nativo pode não existir no plano atual. Quando for
necessária informação atual:

1. Context7 para documentação de bibliotecas e APIs.
2. Tavily MCP para pesquisa web, descoberta e extração de páginas.
3. Claude in Chrome para observar o browser real e referências renderizadas.
4. Playwright MCP para screenshots, fluxos e testes desktop/mobile.
5. Chrome DevTools MCP para DOM, consola, network e performance.

Usar estas ferramentas autonomamente quando a decisão depende de versão,
documentação atual, API externa, browser, WebGL, plugin, MCP ou referência
visual. Preferir documentação oficial, GitHub oficial, MDN, npm e fornecedores.
Se uma ferramenta não estiver disponível, declarar a limitação — nunca fingir
que uma referência foi vista.

Ao usar referências como Linear, Raycast, Stripe, VisionOS, Framer, Lusion,
Active Theory, Destiny, Solo Leveling, TBATE, JWST ou Shadertoy, extrair
princípios concretos; nunca copiar literalmente nem criar uma colagem genérica.

## Direção visual permanente

Evitar:

- dashboard AI/SaaS genérico;
- grelha previsível de cartões;
- borda roxa em todos os componentes;
- monoespaçado e uppercase em excesso;
- neon barato, arco-íris e cyberpunk cliché;
- partículas aleatórias sem significado;
- animações que prejudicam leitura ou performance.

Preferir:

- hierarquia cinematográfica;
- roxo/preto com azul profundo e magenta subtil;
- materiais escuros, profundidade, luz seletiva e espaço negativo;
- tipografia premium e humana;
- motion físico, lento e intencional;
- Oráculo como presença, Núcleo como entidade e mundo como contexto;
- serenidade por defeito e eventos épicos raros;
- 60 FPS como alvo, degradação progressiva e reduced motion real.

Pergunta obrigatória antes de concluir uma alteração visual:

> Isto parece um produto único chamado Sistema, ou parece uma interface
> gerada por AI?

## Arquitetura real (2026-07-25)

O inventário de stack e de ficheiros é derivável do repositório (`package.json`,
`ls`, `.github/workflows/`) e não se repete aqui. O que o código NÃO consegue
explicar sozinho, e por isso vive neste ficheiro:

- **Produção é `main`, Vanilla, sem build step.** A branch React existe mas não
  está em produção. Confundir as duas é o erro que este parágrafo previne.
- **O palco WebGL não foi reescrito na migração** — foi copiado para
  `src/stage/` e alimentado por uma ponte de globais (`window.S`,
  `window.__store`), porque ele corre num rAF fora do ciclo React. Quem mexer
  nele tem de preservar essa ponte.
- **O Vanilla inteiro está em `legacy/` com histórico** (`git mv`), e não se
  apaga enquanto o React não estiver validado em produção.
- **A anon key do Supabase em `src/lib/supabase.js` é pública por desenho** —
  quem a vir no código não encontrou uma fuga; o RLS é que protege.
- **O workflow de deploy está preparado e inativo** de propósito. Só dispara em
  `push` para `main`.
- **O Modo Estação só existe no Vanilla** — não foi migrado.

## Estado de execução

**Ler sempre `SPEC-CLAUDE-CODE.md`.** Um resumo do estado aqui divergiria do
SPEC à primeira fase concluída, e este ficheiro não tem como saber que ficou
desatualizado.

Duas decisões de numeração que o SPEC regista e que NÃO se voltam a discutir: a
Missão 30 da documentação está SUPERADA pela Missão 25 e o número fica
reservado; a Missão 24 está PAUSADA e não se retoma desenvolvimento Vanilla.

## Autoridade da migração frontend

Antes de qualquer trabalho que envolva TypeScript, R3F, Drei,
pós-processamento, Vercel, substituição da shell ou redesign estrutural, ler:

`docs/frontend-migration/00_READ_ME_FIRST.md`

Depois, ler todos os ficheiros dessa pasta pela ordem documentada.

Essa pasta continua a ser a fonte de autoridade da frontend de próxima
geração. Nota de estado, para não a ler como se nada tivesse acontecido: a
parte executável dela — React, Vite, migração incremental em branch paralela,
preservação do Supabase, paridade de dados — **foi cumprida na Missão 25**. O
que dela permanece por decidir ou por fazer:

- TypeScript (avaliação incremental, `allowJs`, sem conversão total);
- Motion / Framer Motion para UI;
- React Three Fiber e Drei, apenas onde reduzirem complexidade real;
- `@react-three/postprocessing` seletivo, sem custo de legibilidade;
- Vercel como Preview Deployment;
- os gates visuais de `09_ACCEPTANCE_GATES.md`.

As regras permanentes continuam acima desta autoridade:

- propor antes de alterar;
- uma fase de cada vez;
- commits pequenos;
- não alterar produção sem gate;
- o Sistema nunca mente.

A frontend Vanilla não deve ser apagada. Só sai de cena quando o React estiver
em produção, validado com a conta real e com rollback documentado.

## Ferramentas obrigatórias

A preparação da nova frontend exige confirmação e **prova prática** de cada
ferramenta — nunca presumir que está a funcionar:

Superpowers · Context7 · 21st.dev Magic · ui-ux-pro-max · frontend-design ·
Playwright MCP · Chrome DevTools MCP · Claude in Chrome · TypeScript LSP.

O estado verificado de cada uma vive no `SPEC-CLAUDE-CODE.md`, na fase que a
verificou — não aqui. Uma tabela de estado num ficheiro sempre carregado
envelhece em silêncio e passa a mentir; o SPEC é datado por fase e não tem esse
problema.

O Google Chrome é o browser oficial para Claude in Chrome, Playwright, Chrome
DevTools, baseline visual, consola, network e performance. Brave/CDP fica como
fallback.

Superpowers, ui-ux-pro-max e 21st.dev Magic são requisitos formais, não extras.
Nenhuma destas ferramentas pode impor uma identidade genérica ou fazer commit
automático sem revisão. Todo o output passa pela direção visual do Sistema e
pela pergunta:

> Isto parece um produto único chamado Sistema, ou parece um dashboard gerado
> por AI?

## Oracle Governance Authority

Obrigatório para todo o trabalho relacionado com o Oráculo.

**Antes de alterar voz, personalidade, memória, autonomia, agentes,
notificações, Money Printing Machine, moderação ou execução externa, ler:**
`SYSTEM-ORACLE-CONSTITUTION.md`, depois `docs/oracle-governance/` pela ordem do
`00_READ_ME_FIRST.md`. O programa técnico vive na secção "Programa Oracle
Intelligence & Governance" do `SPEC-CLAUDE-CODE.md`; a sequência de evolução na
Camada V do `SYSTEM-EVOLUTION-ROADMAP.md`.

O Oráculo é Chief Intelligence Officer, Chief of Staff, assistente pessoal,
moderador, supervisor de agentes, guardião da verdade e auditor. **Não é uma
caixa de chat.**

### Regras invioláveis

Estas ficam aqui, sempre carregadas, porque são proibições de segurança e não
podem depender de alguém ter aberto o documento certo. O Claude Code não pode:

- aumentar autonomia sem política;
- criar memória silenciosa;
- conceder permissões a agentes sem registry;
- permitir autoelevação de privilégios;
- executar ações externas críticas sem consentimento;
- esconder custo, erro ou incerteza;
- declarar sucesso sem evidência;
- confundir tarefa delegada com tarefa concluída;
- criar um chatbot genérico;
- imitar diretamente uma personagem protegida;
- usar animação para fingir inteligência;
- criar loops de agentes sem limites;
- colocar segredos no frontend;
- alterar produção sem gate.

### Gate final

Nenhuma funcionalidade é aceite apenas porque funciona. Tem de provar utilidade,
verdade, segurança, auditabilidade, reversibilidade, controlo humano,
consistência, qualidade visual e benefício superior ao risco.

O detalhe operacional — processo, autonomia por níveis, voz, memória, agentes,
Money Machine, estados de UI — está em `docs/oracle-governance/` e carrega-se
quando for preciso, não em todas as sessões.
