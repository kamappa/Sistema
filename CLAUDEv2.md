# CLAUDE.md — Sistema (Daniel)

> Este ficheiro é o bootloader permanente do projeto. É carregado no início
> de cada sessão. O estado de execução e a história das missões vivem em
> `SPEC-CLAUDE-CODE.md`; a visão-mãe vive em
> `SYSTEM-EVOLUTION-ROADMAP.md`.

## Fontes de verdade e precedência

Ler, por esta ordem:

1. `CLAUDE.md` — regras permanentes, identidade, segurança e método.
2. `SPEC-CLAUDE-CODE.md` — estado real das missões, decisões fechadas,
   backlog e próxima fase elegível.
3. `SYSTEM-EVOLUTION-ROADMAP.md` — visão de longo prazo e leis do mundo;
   não é autorização para executar tudo de uma vez.
4. Código, `git status`, histórico e branch atual — prova final do que existe.

Se houver conflito, nunca adivinhar. O código e o histórico confirmam o estado;
o SPEC decide o plano corrente; o ROADMAP orienta a direção futura.

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
7. Identificar a missão ativa e a próxima fase elegível. A Missão 24 não pode
   ser ignorada sem ser concluída ou formalmente colocada em pausa.
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

A baseline documentada continua a ser uma aplicação estática em GitHub Pages:
scripts clássicos globais, Supabase e uma ilha WebGL de ES modules em
`js/stage/`, com Three.js r170 vendorizado e sem build step obrigatório.

Não migrar implicitamente para React, React Three Fiber, Vite, Next.js,
Tailwind, shadcn ou outra stack só porque aparecem em referências ou skills.
Essas tecnologias podem ser estudadas e usadas como inspiração. Uma migração
real exige missão própria, comparação de custos, plano de rollback, prova de
compatibilidade com Supabase/GitHub Pages e aprovação explícita.

Se a branch atual já contiver uma migração experimental React/Vite, parar e
reconciliar essa branch com o SPEC antes de continuar ou fazer deploy.

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

## Arquitetura documentada (julho de 2026)

- Frontend estático em GitHub Pages, com `index.html`, `css/hud.css`, scripts
  clássicos e ordem de carregamento documentada. `js/estacao.js` foi inserido
  entre memória e navegação na Missão 24.
- Palco WebGL em `js/stage/`, Three.js vendorizado em `js/vendor/`, façade
  global e comunicação por `js/bus.js`.
- Supabase: auth de utilizador único, `app_state`, `radar_items`,
  `oracle_reports`, RLS e Edge Function `oraculo`.
- Oráculo: Radar, relatório, Conselho, Sussurro, contexto do Vault e voz de
  Guardião do Núcleo.
- Vault privado: Obsidian Git → `kamappa/vault-sistema` → Oráculo, com
  whitelist de privacidade e relatórios escritos de volta.
- Sistemas: missões, hábitos, sono, treino, revisão ativa, títulos reais,
  constelações de evidência, Celestial Core, World/Solar Engine, Living
  Memory, Radar, Oráculo e Modo Estação.

## Estado de execução

O estado e o próximo passo não são inferidos deste resumo. Ler sempre
`SPEC-CLAUDE-CODE.md`. À data desta revisão, a Missão 24 está em curso e as
novas missões recuperadas do chat perdido começam apenas depois de a missão
ativa ser concluída ou formalmente pausada.

## Autoridade da migração frontend

Antes de qualquer trabalho que envolva React, TypeScript, Vite, Vercel,
React Three Fiber, substituição da shell, redesign estrutural ou migração da
frontend, ler obrigatoriamente:

`docs/frontend-migration/00_READ_ME_FIRST.md`

Depois, ler todos os ficheiros dessa pasta pela ordem documentada.

Essa pasta é a fonte de autoridade para a frontend de próxima geração e define:

- arquitetura-alvo: TypeScript + React + Vite;
- Motion para UI e interação 2D;
- Three.js e React Three Fiber de forma seletiva;
- Supabase preservado como backend e fonte de verdade;
- Vercel inicialmente como ambiente de Preview;
- migração incremental em branch paralela;
- modo read-only no início;
- testes de paridade antes de ativar escrita;
- gates visuais, funcionais, de dados e performance;
- preservação da versão estável até aprovação explícita.

Esta autoridade não substitui as regras permanentes:

- propor antes de alterar;
- uma fase de cada vez;
- commits pequenos;
- não alterar produção sem gate;
- o Sistema nunca mente.

A frontend atual não deve ser apagada nem convertida através de uma reescrita
única. A nova frontend nasce numa branch própria e só substitui produção
quando existir paridade, rollback, testes reais e aprovação do Daniel.

## Ferramentas obrigatórias para a migração

A preparação da nova frontend exige confirmação e prova prática de:

- Claude in Chrome;
- Context7;
- Tavily MCP;
- Playwright MCP;
- Chrome DevTools MCP;
- `frontend-design`;
- `claude-code-setup`;
- `skill-creator`;
- Superpowers;
- ui-ux-pro-max;
- 21st.dev Magic;
- TypeScript LSP.

Superpowers, ui-ux-pro-max e 21st.dev Magic são requisitos formais, não extras.
Nenhuma destas ferramentas pode impor uma identidade genérica ou fazer commit
automático sem revisão. Todo o output passa pela direção visual do Sistema e
pela pergunta:

> Isto parece um produto único chamado Sistema, ou parece um dashboard gerado
> por AI?
