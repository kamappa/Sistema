# SPEC — Sessão Claude Code · Sistema (Daniel)

> Este ficheiro é a memória de engenharia do projeto. O Claude Code deve lê-lo
> antes de qualquer alteração. Regras de ouro: propor antes de alterar (mostrar
> diff), uma fase de cada vez, tudo o que gera dados fica estruturado e datado
> (pronto para o Oráculo), e "o sistema nunca mente".

## Protocolo de recuperação de sessão

Trigger: **"vamos começar o verdadeiro sistema"**.

Este protocolo existe para recuperar uma conversa perdida sem destruir o
método de trabalho já estabelecido:

1. Não alterar código na primeira resposta.
2. Confirmar `git status`, branch, últimos commits e diferenças não commitadas.
3. Ler `CLAUDE.md`, este SPEC e o ROADMAP.
4. Comparar o estado documentado com o código; o branch real pode estar à
   frente da documentação.
5. Confirmar capacidades: Claude in Chrome, Context7, Tavily, Playwright,
   Chrome DevTools e skills/plugins.
6. Abrir o Sistema em localhost e descrever o que é realmente visível; recolher
   screenshot, consola e network quando possível.
7. Identificar a missão ativa. A Missão 24 está PAUSADA desde 2026-07-25; a
   missão corrente é a Missão 26.
8. Propor uma única fase, com objetivo, ficheiros, riscos, testes e rollback.
9. Esperar autorização antes de aplicar alterações.

O ficheiro gigante de recuperação não deve ser executado como um prompt único.

## Reconciliação documental de 2026-07-25

A 2026-07-24 foi carregado para `origin/main`, por upload web, um pacote
documental novo: `CLAUDE.md` reescrito, `SPEC-CLAUDE-CODEv2.md`,
`SYSTEM-EVOLUTION-ROADMAPv2.md`, `SYSTEM-ORACLE-CONSTITUTION.md`,
`docs/frontend-migration/` (11 ficheiros) e `docs/oracle-governance/` (35).

Esses documentos foram escritos como se a migração React nunca tivesse
acontecido: declaravam a Missão 24 ativa, tratavam a branch React como
"experiência separada" e planeavam React + Vite + TypeScript como uma Missão
30 futura e condicionada. O código dizia outra coisa — a Missão 25 estava
concluída e verificada em 18 fases na branch `react-migration`.

A reconciliação foi feita a 2026-07-25, na branch
`mission-26/renaissance-visual`, com estas decisões do Daniel:

- a realidade verificada no código e no histórico tem prioridade sobre a
  numeração criada posteriormente na documentação;
- a migração React + Vite mantém-se oficialmente como **Missão 25**,
  concluída em 18 fases;
- a **Missão 26** é a Renaissance Visual, sobre a base React;
- a **Missão 30** da documentação fica SUPERADA / ABSORVIDA PELA MISSÃO 25 e
  o número fica reservado, sem reutilização;
- a **Missão 24** fica formalmente PAUSADA, com o escopo visual restante
  absorvido pela Missão 26;
- as missões órfãs da renumeração foram absorvidas: o "Ambiente Autónomo do
  Claude Code" tornou-se a Fase 0 da Missão 26, e o "Shell sem aspeto de AI
  Dashboard" tornou-se o corpo da Missão 26.

Factos apurados na comparação, para não se repetir o trabalho:

- o ROADMAP v2 era um superset puro do da branch (+505 linhas, zero remoções);
- as Missões 1–24 eram byte-idênticas nos dois SPECs (788 linhas);
- `docs/oracle-governance/CLAUDE-ORACLE-BLOCK.md`, `SPEC-ORACLE-BLOCK.md` e
  `ROADMAP-ORACLE-BLOCK.md` são blocos de inserção nos três documentos
  canónicos, e já referenciavam os nomes sem sufixo `v2`.

Os nomes canónicos são `CLAUDE.md`, `SPEC-CLAUDE-CODE.md` e
`SYSTEM-EVOLUTION-ROADMAP.md`. Os ficheiros `v2` serviram de fonte e não
entram no repositório com esse nome.

## Estado atual (2026-07-25)

**Produção** — GitHub Pages a servir `main`: continua a aplicação estática
Vanilla, sem build step. Scripts clássicos globais, `css/hud.css`, ilha WebGL
de ES modules em `js/stage/` com Three.js r170 vendorizado. `js/estacao.js`
entre memória e navegação (Missão 24). Esta é a verdade em produção e não se
altera sem gate explícito.

**`react-migration`** — a frontend React + Vite completa e verificada (Missão
25, 18 fases). React 18, Vite 6, JSX sem TypeScript, Zustand com a ponte
`window.__store`, `@supabase/supabase-js` por npm, palco WebGL portado sem
reescrita, camada fx/motion completa. O Vanilla inteiro preservado em
`legacy/`. Workflow de deploy preparado e inativo.

**`mission-26/renaissance-visual`** — branch de trabalho corrente, derivada de
`react-migration`, com a documentação de autoridade (`docs/frontend-migration/`,
`docs/oracle-governance/`, `SYSTEM-ORACLE-CONSTITUTION.md`) trazida por
checkout limitado por caminho.

**Backend, comum às duas** — Supabase: auth de utilizador único, `app_state`
JSONB com RLS, `radar_items`, `oracle_reports` e Edge Function `oraculo`.
Oráculo: Radar, relatório semanal, Conselho, Sussurro, contexto do Vault,
profecias e voz de Guardião do Núcleo. Vault: Obsidian Git → repo privado
`vault-sistema`, apenas conteúdo whitelisted.

**Sistemas funcionais** — missões, hábitos, treino, sono, revisão ativa,
títulos, memória, Radar, Oráculo, calendário, navegação, constelações de
evidência, Celestial Core, World/Solar Engine e Modo Estação (este último só
no Vanilla; não foi migrado para React).

**Gate por levantar** — a troca da source do GitHub Pages de `main` (Vanilla)
para o build React exige três passos manuais do Daniel e a sua decisão
explícita. Enquanto não acontecer, o React não está em produção.

## Missão 31 — Compliance Intelligence OS (VISÃO REGISTADA 2026-08-01)

**ESTADO: VISÃO REGISTADA — IMPLEMENTAÇÃO NÃO AUTORIZADA.**

Não é uma missão em curso e não interrompe a Missão 26. Está aqui para não se
perder e para não ser começada de improviso — que eram as duas formas de a
estragar.

Ecossistema de **agentes especializados sob governação** para RGPD,
privacidade, RATs, AIPDs, gestão de risco, ISO/IEC 27001, ISO/IEC 27701, NIS2,
AI Act, ISO/IEC 42001, auditoria, evidência e atualização regulatória. Origem:
conversa com uma profissional sénior da área, que mostrou modelos e processos
reais. Nome, marca e modelos **não constam** da documentação.

O objetivo **não é** substituir advogados, DPOs, auditores ou consultores. É
reduzir trabalho repetitivo, organizar evidência, manter conhecimento
versionado e preparar decisões humanas.

**Documentação:** `COMPLIANCE-INTELLIGENCE-MISSION.md` na raiz e
`docs/compliance-intelligence/` (17 ficheiros, ler `00_READ_ME_FIRST.md`).

Três coisas que ficam decididas e não se voltam a discutir:

- a expressão *"agentes que nunca ficam desatualizados"* **não se usa**. A
  garantia é outra: nenhum agente conclui sem demonstrar data, jurisdição,
  versão e fonte — e diz quando não sabe;
- o profissional sénior trabalha **por exceção, não por confirmação**. Um
  sistema que exige aprovação de cada correção custa mais do que poupa, e essa
  é a forma mais provável de esta missão falhar;
- **dados reais de terceiros não entram no ambiente pessoal.** Nem para testar.

Nove afirmações regulatórias e de preço estão registadas como **NÃO
VERIFICADAS** (V1–V9). É deliberado, e é a primeira aplicação da própria
missão: um sistema cuja proposta é *"nunca concluímos sem saber a fonte"* não
pode nascer de um documento que afirma datas de cabeça.

**Gates:** catorze, treze por cumprir. **Perguntas por responder:** dezanove. A
primeira é a única que não se responde a trabalhar — se existe interesse real
da outra parte, ou se foi uma conversa interessante.
## Missão 1 — FUNDIR Missões + Objetivos (CONCLUÍDA)

Os dois painéis sobrepõem-se. Fundir num único quadro "Missões" com o motor
dos objetivos:

- Tiers com sabor RPG mapeados ao peso: Side=P3 (50 XP, Sombra Nv3),
  Main=P2 (90 XP, Nv6), Elite=P1 (150 XP, Nv10), Boss=novo tier (400 XP, Nv15)
- Manter: triagem automática (prioridade+área+tags), prazos, filtros
  (estado/área/ordenação + novo: por tag/dificuldade), faixa URGENTE, Sombras
  para TUDO, botões de aceitar do Oráculo/Radar
- Migração: converter S.quests existentes para o formato novo sem perder o
  estado feito/por fazer; remover o painel antigo
- Arcos: manter a marca "☀️ Summer" nos itens do arco ativo

## Missão 2 — Refactor do monólito (CONCLUÍDA)

`index.html` partido em módulos mantendo GitHub Pages a funcionar (sem
build). Decisão estrutural: scripts clássicos por ordem de carregamento,
não ES modules — o HTML usa `onclick` inline, que exige funções globais;
migrar para modules seria outra missão. Commits pequenos por fase
(trilho de evidência — prática A.8.32), cada um verificado em headless.

- Fase 1: `css/hud.css` (425 linhas de estilo)
- Fase 2: `js/data.js` (28 constantes de configuração)
- Fase 3: `js/fx.js` (camada visual: toast, celebrações, fundo vivo)
- Fase 4 (a-d): `js/engine.js` (estado, XP, render), `js/world.js`,
  `js/hud.js` (conquistas/debuffs/trees/títulos/calendário/saudação),
  `js/recall.js`, `js/treino.js`, `js/sono.js`, `js/objetivos.js`,
  `js/radar.js`, `js/auth.js` (Supabase+persist+`init()`, carrega em
  último)
- Fase 5: index.html final com 233 linhas (só HTML + 11 scripts com a
  ordem documentada em comentário)

## Missão 3 — Visual vivo (CONCLUÍDA)

Animações avançadas e fundo dinâmico, mantendo identidade preto+roxo, cores
semânticas de áreas/eventos/ranks e prefers-reduced-motion. Feita em fases
por letras (as micro-interações de hover/focus já existiam na camada de
animação do CSS):

- Fase A: fundo vivo — aurora CSS (3 manchas roxo/rosa em deriva lenta, só
  transform) + canvas de partículas `#dust` (densidade limitada, DPR≤2,
  pausa com separador oculto, desligado com reduced-motion)
- Fase B: reveal ao entrar no viewport (IntersectionObserver, degrada para
  o comportamento antigo sem IO) + `celebrate()`/`dustBurst()` no level-up
  (flash radial na cor do atributo + partículas efémeras); corrigido bug:
  com prefers-reduced-motion os painéis `.reveal` ficavam invisíveis
- Fase C: cerimónia de rank-up (deteção de promoção no `render()`, toast
  RANK UP, pop do badge, dupla vaga de partículas — despromoção não
  celebra) + contadores animados (`setNum()` em nível/XP total, 600ms,
  escrita direta com reduced-motion ou página oculta)

## Missão 3 v2 — Universo Vivo (CONCLUÍDA)

Redesign profundo sobre a Missão 3: minimalismo premium + HUD futurista
(referências: Raycast, Framer, Stripe, Solo Leveling). Regras: só
transform/opacity — com blur de 200ms como exceção deliberada nos
momentos altos —, reduced-motion respeitado, touch intocado, lógica
intocada. Inclui fix de integridade: reversões de XP (desmarcar hábito,
regredir objetivo) removem a entrada correspondente do registo (unlog).

- Fase 1: motor de ambiente — `--amb1/2/3` e `--horizon` interpoladas ao
  minuto entre 10 âncoras horárias (madrugada índigo → amanhecer com
  âmbar → dia luminoso → pôr do sol no horizonte → noite = estado
  "casa"); meteo real modula (chuva dessatura e as partículas descem;
  céu limpo aviva); coordenadas Open-Meteo = V. N. Famalicão
- Fase 2: boot sequence 1x/sessão (<2.5s, saltável com clique: fundo →
  partículas → saudação typewriter → painéis em stagger; bootstrap de
  1 linha no head) + voz do Sistema nos toasts (Missão aceite — Sistema
  sincronizado; Conhecimento assimilado; Pilar confirmado) + o Oráculo
  escreve o relatório (sysTypeHTML, teto 2.5s, só na 1ª visualização)
- Fase 3: presença — tilt 3D nos painéis (máx 3°), botões magnéticos
  (±2.5px) com glow, aurora segue o rato; só pointer:fine
- Fase 4: momentos cinematográficos — A R I S E (overlay tipográfico +
  flash + cinePulse + dupla vaga) e level-up/rank-up com cinePulse;
  quietude visual no resto do sistema

## Missão 3 v3 — O Sistema Existe (CONCLUÍDA)

Diretiva definitiva sobre a v2: "vida não é animação — é o sistema existir
mesmo quando o utilizador para". Nada 100% estático, mas quase tudo a
mover-se tão pouco que só se nota quando se procura. Regras invioláveis:
transform/opacity (box-shadow permitido por precedente da v2),
reduced-motion mata tudo, degradação corta efeitos e não fps, dados
sempre reais, lógica intocada. Verificação nova: screenshot headless
antes/depois de cada fase (ver nota no fim).

- Fase 1: palco em 3 camadas — campo de estrelas (120/50) com parallax
  de scroll, cintilação dessincronizada e brilho comandado pela hora;
  nebulosas gigantes com núcleo (gradiente duplo) em deriva de minutos;
  partículas com profundidade z (70/35); estrela cadente rara (60-120s);
  rasto do rato (pointer:fine, máx 8); guarda de FPS que corta densidade
- Fase 2: idle universal com períodos primos (3.1-13s) — batimento no
  chip de rank, halo do anel do avatar, losangos a flutuar com delays
  próprios, luzes de canto desfasadas, gradiente lento nos títulos,
  calendário (hoje + pontos de eventos), glow lateral nas missões em
  curso; scanline única via panelScan() quando o Radar traz itens <12h
  ou há relatório novo do Oráculo
- Fase 3: barras de energia — plasma lento (9.7s) + ponta luminosa que
  desaparece a 0%; easing entre renders (repõe largura anterior 1 frame);
  mini-burst de 3-5 partículas no addXp (gancho de 1 linha); count-up em
  streak/missões; topbar glass fixa (rank+nível+XP, espelho do render,
  aparece após o herói, encolhe em scroll fundo)
- Fase 4: assinatura por domínio (hover em Atributos e Skill Trees,
  classe dom-<id>) — Ofício cantos duros steps(2); Saber constelação
  SVG; Corpo batimento no losango; Mente névoa em travessia; Vínculos
  partículas douradas; Disciplina grid com máscara
- Fase 5: Shadow Army — raridade determinística por nível (3 Comum,
  6 Rara/azul, 10 Épica/roxa+partículas, 15 Lendária/dourada+shimmer),
  auras inset (o clip-path corta box-shadow exterior!), idle
  dessincronizado por carta, hover ergue e revela a data; cineMoment()
  genérico (escurece 400ms → luz cresce → texto entra → dissolve, 2.6s)
  usado por A R I S E e Conquistas, com toast como fallback
- Fase 6: calendário — mês desliza na direção da navegação, hover
  expande célula com mini-card via content:attr(title) (clip-path
  levantado no hover), selo ✓ em dias passados com XP no S.history,
  eventos flutuam 1px

Verificação (novo método, ver memória do Claude Code): o --screenshot
do Brave headless está partido nesta máquina; a alternativa que funciona
é servidor HTTP local (PowerShell HttpListener) + CDP por WebSocket
(Page.captureScreenshot, Runtime.evaluate para semear estado real,
Input.dispatchMouseEvent para hover). Com o CDN bloqueado o init() entra
em modo offline sem login — HUD completo visível.

## Missão 4 — CLAUDE.md (CONCLUÍDA)

Criar `CLAUDE.md` na raiz a partir do PROMPT.md (contexto do Daniel, regras
do Sistema, estas regras de engenharia) para carregamento automático.

## Missão 5 — Revisão Ativa (CONCLUÍDA)

Sistema de active recall para consolidar conhecimento de RGPD, ISO 27001,
NIS2, ISO 19011 e AI Governance, com repetição espaçada (SM-2), fundido no
pilar Saber:

- Fase 1: banco de perguntas (`perguntas/lote1-6.json`, tema+dificuldade+
  pergunta+resposta+referência) e modelo `S.recall` (seen, correct, interval,
  ease, due)
- Fase 2: seleção diária (`selectRecallQuestions`) — vencidas primeiro
  (ordenadas por nº de falhas), distribuídas por tema, completadas com
  perguntas novas; algoritmo SM-2 simplificado em `reviewQuestion`
- Fase 3: painel "Revisão do Dia" — revelar resposta antes de autoavaliar,
  XP de Saber por pergunta, resumo no fim do lote diário
- Fase 4: streak de estudo (`S.studyStreak`) separado dos streaks de hábitos,
  incrementado só quando o lote diário fica completo
- Fase 5: perguntas próprias — formulário no painel para adicionar perguntas
  ao banco (`S.customQ`, id prefixo `meu-`), entram na mesma rotação e SM-2
  via `questionPool()`/`findQuestion()`; gancho vazio `oracleRefreshQuestions()`
  reservado para o Oráculo injetar perguntas no futuro (sem lógica ainda)

## Missão 6 — Oráculo v2 · Conselho (CONCLUÍDA)

O Oráculo evoluiu de relatórios agendados para conselheiro estratégico
interativo. A fonte da Edge Function passou a ser versionada em
`supabase/functions/oraculo/index.ts` (descarregada da produção e comparada
antes de mexer; radar/report ficaram intocados além do router de modos).
Deploy via CLI do Supabase (`~/bin/supabase.exe`, login interativo do Daniel).

- Fase 1: `?mode=chat` na Edge Function — JWT da sessão (radar/report mantêm
  ORACLE_TOKEN; deploy com `--no-verify-jwt` porque a validação é interna),
  CORS para kamappa.github.io, constituição do conselheiro (5 lentes do
  Conselho, socrático, Reality Check, mundo real/Patrícia, proteção contra
  sobrecarga, ~450 palavras), contexto real do `app_state` (`resumoEstado`:
  atributos, streaks, obrigatórios, missões+prazos, sono, debuffs, recall
  agregado por tema via prefixo do id) + últimos 2 relatórios; guarda de
  custo 12 msgs/dia lida de `S.oracleChat` (o cliente incrementa, o servidor
  revalida — best-effort, não é segurança)
- Fase 2: `js/conselho.js` + painel no HUD — chat na identidade do sistema,
  teatro de pensamento (linhas em sequência; ambiente, não engano),
  typewriter saltável com clique e desligado com reduced-motion; falha de
  rede devolve a quota e tira a mensagem do histórico (o sistema nunca mente)
- Fase 3: aceitar como missão — a constituição pede a ação final na linha
  "⚔ Ação (48h): ..."; o botão só aparece quando o Oráculo a declara;
  aceitar cria missão via triage com tag 🔮 Do Oráculo e prazo a 48h
- Fase 4: Mapa de Conhecimento — 100% cliente, agrega S.recall por tema
  (taxa de acerto, nº perguntas vistas, 2 piores ease); tema só aparece
  com ≥5 perguntas vistas, antes disso "dados insuficientes"
- Fase 5: Sussurro do Conselheiro — `?mode=sussurro` (JWT, max_tokens 150),
  1 chamada/dia com cache em `S.sussurro`, linha na saudação; sem nada
  digno devolve null e não aparece nada (silêncio > ruído)
- Fase 6: teste end-to-end com utilizador efémero (admin API, apagado no
  fim) — verificado que sem dados o Oráculo recusa inventar números e diz
  o que registar; verificação headless (CDP) do HUD com os painéis novos

Nota de produção observada na fase 1: o token do radar/report também é
aceite por query param `?t=` — funcional, mas tokens em URL podem ficar em
logs; candidato a limpeza futura.

## Missão 7 — Auditoria de integridade do XP + Pavimento Pélvico (CONCLUÍDA)

Auditoria completa às vias de XP ("o sistema nunca mente"), fechada em
2026-07-12, seguida de uma extensão ao treino. Verificação headless (CDP,
Runtime.evaluate a exercitar os fluxos reais) em cada parte.

- Notas A e B (commits b2a3745, 111f381): streak com memória `undo` no
  toggle; regra única do xpMult (avanços de progressão também multiplicam)
- Toasts legíveis (7d9929c): duração por texto, pausa em hover, dispensar
- 4 fugas de XP (66ad9c6):
  1. Apagar missão "feita" reverte XP exato + Sombra + entrada do registo,
     com confirmação no UI; cancelar não altera nada
  2. Treino: registo ilimitado (dados honestos) mas XP com teto diário —
     1.ª sessão completa, 2.ª a metade, 3.ª+ registada a 0 XP
  3. Pilar do sono: a marca automática grava `lastGain=0`; desmarcar
     devolve o valor exato gravado (o +17 da noite vive no registo do sono)
  4. Antídoto de debuff: 1 uso por debuff por dia (`S.antidote` datado);
     repetir não dá efeito nem XP
- Parte 2 (9a9cbb5): 5.ª linha de treino "Pavimento Pélvico" (Kegel) —
  `PROG.kegel` com 8 passos (lentas Xs/Xs × reps + rápidas 1s/1s × reps,
  × ciclos; do 3s/3s ×8 · 2 ciclos ao 10s/10s ×12 + rápidas ×20 · 3
  ciclos), cartão com "sessão feita" + sensação (fora de TLINES: protocolo
  prescrito, não "melhor série"), evolui com 3 dias distintos no alvo
  (derivado das sessões, sem contador paralelo), XP de Corpo dentro da
  sessão datada normal, notas de técnica na UI
- Parte 3 (Ponte do Vault): por apresentar — a especificação ficou na
  conversa perdida; aguarda o Daniel

## Missão 8 — Ponte do Vault (CONCLUÍDA)

Ligação bidirecional e autónoma entre o vault Obsidian do Daniel e o Oráculo:
o Oráculo lê o que ele estuda e escreve as análises de volta no vault. Fechada
em 2026-07-13. Regra de privacidade por desenho: o Oráculo só vê a árvore
`Sistema/Estudo/` do repo `vault-sistema`; o resto do vault nunca entra nesse repo.

Infraestrutura:
- Repo privado `kamappa/vault-sistema` (auto-init, branch main)
- Vault movido do OneDrive institucional do IPCA para
  `C:\Users\shohe\Documents\ObsidianVault` (privacidade + evitar conflito
  Git/OneDrive); Obsidian repontado; plugin Obsidian Git (auto-commit/push 15 min)
- `.gitignore` de whitelist: só `Sistema/`, `Oraculo/`, `README.md`, `.gitignore`
  entram no repo — tudo o resto do vault fica fora
- Token fine-grained `VAULT_TOKEN` (leitura+escrita só neste repo) nos Secrets
  do Supabase. Nota: o token tem de listar explicitamente o repo em "Repository
  access" — um repo criado depois do token não entra sozinho (deu 404 até corrigir)

Edge Function `oraculo` (radar/report/chat/sussurro intocados na lógica; só
ganharam contexto do vault):
- Helpers GitHub API: `gh()`, `vaultChanges()` (compare API para o diff da
  janela; usa a árvore quando a janela apanha o 1º commit), `vaultFile()`
- `vaultContextDeep()` — report semanal e chat sob demanda: conteúdo das notas
  alteradas 7d, teto ~8k tokens (~30k chars) com truncagem declarada; timestamps
  dos commits = registo real de atividade de estudo
- `vaultContextLight()` — radar e sussurro: ficheiros alterados 24h + headings,
  teto ~1.5k tokens; afina a relevância das notícias e liga estudo de ontem a hoje
- Chat lê o vault só quando a pergunta é sobre estudo (regex de deteção)
- Falha de leitura nunca derruba um modo: report recebe aviso honesto,
  radar/sussurro seguem sem vault
- Escrita: `vaultWriteReport()` grava `Oraculo/relatorio-YYYY-MM-DD.md` (Markdown
  com frontmatter) via contents API depois de o report estar salvo na BD;
  re-corrida no mesmo dia substitui a nota (sha). Falha só regista em log
- Secção "Para complementar o estudo": `gerarReport()` usa pesquisa web (como o
  radar) e devolve 2-3 recursos ligados ao estudo real; regra inviolável no
  prompt — só URLs devolvidos pela pesquisa, nunca de memória
- Campos novos no report JSON: `estudo` e `recursos`; render no HUD (js/radar.js)
- Modos de diagnóstico `vault-check` (leitura + escrita com `?write=1`) e
  `report-dry` (report completo sem gravar), gate JWT + operador (linha em app_state)

Verificação (2026-07-13): utilizador efémero via admin API, apagado no fim.
`vault-check` confirmou leitura (README.md, heading) e escrita (nota de teste,
removida a seguir). `report-dry` gerou o report completo — leitura honesta ("setup,
não estudo mensurável"), campo `estudo` correto, e 2 recursos ENISA com URLs reais
verificados a 200. Guarda-custo estimado abaixo.

Guarda-custo (estimativa apresentada e aceite antes de aplicar):
- Leitura leve diária (radar + sussurro): ~1.5k tokens de input cada, 2×/dia ⇒
  ~3k tokens/dia acrescidos ao que já se gastava
- Leitura profunda semanal (report): até ~8k tokens de input, 1×/semana; a
  pesquisa web dos recursos acrescenta as chamadas de search já usadas pelo radar
- Chat: só quando a pergunta é sobre estudo, teto 12k chars

## Missão 12 — Living Operating System (SPRINTS 1-6 CONCLUÍDOS 2026-07-18)

Visão-mãe em `SYSTEM-EVOLUTION-ROADMAP.md` (raiz do repo, guardada tal e qual
a 2026-07-18). Era o item "Missão 4 WebGL" do backlog; o gate "falta Rank C"
foi levantado deliberadamente pelo Daniel ao lançar a missão. Decisões de
arquitetura fechadas: Three.js vanilla incremental (r170 vendorizado em
`js/vendor/`, sem CDN em runtime), SEM React e SEM build step — a app continua
scripts clássicos + GitHub Pages; o palco WebGL é uma ilha de ES modules em
`js/stage/` que só EXPORTA globals (façade `dustStart`/`dustBurst`/`dustSpark`
com os nomes do antigo fundo 2D — fx/engine/boot intocados). Performance
budget inegociável: 60fps desktop e mobile; degradação progressiva
(tier full/lite/off em `caps.js` + guarda de FPS em runtime que nunca promove
de volta); `prefers-reduced-motion` = palco nem nasce; pausa total com
`document.hidden`. Regra de cada adição: "isto faz o Sistema parecer mais
vivo?" — se não, não entra. Sem sons no Sprint 1.

Sprint 1 — Motor Visual, por fases (diff → OK → commit):
- 1A (CONCLUÍDA 2026-07-18): céu procedural (gradiente 3 cores + fbm lento +
  glow de horizonte + dithering), estrelas com cintilação/parallax no shader,
  poeira com pool pré-alocado de bursts (zero alocações em runtime); substitui
  o fundo canvas 2D no mesmo canvas `#dust` (movido para antes da aurora no
  DOM — céu opaco por baixo, nebulosas CSS por cima). Perdas deliberadas e
  temporárias: estrela cadente (volta no Sprint 2/Living World) e rasto do
  rato (substituído pelo glow-segue-cursor na 1C). Verificação de fumo:
  headless Brave/CDP — consola limpa, façade a disparar, screenshots ok.
- 1B (CONCLUÍDA 2026-07-18): Solar Engine — curva contínua de keyframes
  horários (06h azul fria → golden → sunset → moonlight → deep night) em
  `js/stage/solar.js`; a mesma amostra alimenta os uniforms do céu WebGL
  (lerp por frame) e as variáveis CSS `--amb1/2/3`/`--horizon` (único
  escritor; absorveu o motor de ambiente do fx.js). Meteo real modula
  (chuva dessatura/acalma; céu limpo aviva); `ambientApply`/`ambientRain`
  mantêm nome e semântica. O lado CSS corre mesmo com o palco off.
- 1C (CONCLUÍDA 2026-07-18): motion físico — `js/motion.js` (script
  clássico): integrador de molas partilhado (loop rAF único que dorme em
  idle), tokens snappy/gentle/slow + `--dur-quick/base/slow` em CSS; tilt,
  botões magnéticos e aurora migrados para alvos de mola com inércia; glow
  que segue o cursor via `--mx/--my` (nasce no ponto de entrada;
  `.panel::after`, escondido com reduced-motion).
- 1D (CONCLUÍDA 2026-07-18): reduced-motion emulado por CDP → tier off,
  engine ausente, tilt morto; consola limpa em todas as corridas; overlay
  `?fps=1` (tier · ms · fps · ↓ se degradado · pausado). 60fps confirmados
  pelo Daniel em hardware real — desktop e Brave do telemóvel.

Sprint 1 — Motor Visual: CONCLUÍDO 2026-07-18 (push 3dc422b).

Sprint 2 — World Engine / Living World (CONCLUÍDO 2026-07-18):
- 2A: nebulosa em 2ª camada com domain warp e cor própria; estrela cadente
  de volta (WebGL, rara 60-120s, invisível entre voos, relógio pausa em
  background). `Stage.debug.meteor()`.
- 2B: `js/bus.js` (pub/sub) + emissores de 1 linha (addXp→`xp:gain`,
  rankCeremony→`rank:up`); `react.js` — energia com decaimento ~2s:
  nebulosas respiram, céu pulsa, poeira acelera (tempo elástico uWarp).
  Arco sazonal ativo tinge a 2ª nebulosa (summer laranja / winter azul /
  harvest âmbar / bloom rosa); Recovery acalma o mundo inteiro. Tudo
  derivado de S com guardas.
- 2C: respiração da cena (~22s, ±0.4%) + ritmo do dia (`pace` nos
  keyframes do Solar: 1.1x de manhã, 0.7x de madrugada) no tempo elástico.
- 2D: bateria automatizada — cadeia real addXp→Bus→energia confirmada
  (0.61 após +5 XP), reduced-motion com eventos a cair no vazio sem
  erros, consola limpa. FPS em aparelho: palco só ganhou trabalho de
  shader marginal desde a medição do Sprint 1; Daniel re-verifica com
  `?fps=1` no próximo uso normal.
- Debug: `Stage.debug.{setHour,meteor,pulse,energy,world}`.

Sprint 3 — Motion profundo (CONCLUÍDO 2026-07-18):
- 3A: barras com física — `Motion.fillBar` (mola sub-amortecida, token
  `fill`; registo por chave que sobrevive a re-renders por innerHTML) nas
  barras do herói/topbar/atributos; `setNum` migrado de easing cúbico para
  mola; transitions CSS de largura removidas.
- 3B: onda de conclusão — `cardWave` (~700ms, recortada pelo clip-path):
  hábito marcado → cor do atributo; missão concluída → violeta; disparada
  após o re-render; reversões não celebram. Toast mantém a curva CSS de
  overshoot (migração para mola real = custo sem ganho percetível).
- 3C: Oráculo a pensar (moldura do Conselho respira + botão pulsa,
  entra/sai no ocTheaterStart/stop) + logout adormece o mundo (650ms).
- 3D: bateria — fluxo de conclusão completo sob reduced-motion sem uma
  única animação (onda ausente, barra direta, tier off, zero erros);
  consola limpa; overlay `?fps=1` operacional. FPS em aparelho: Daniel
  re-verifica com `?fps=1` no uso normal.

Sprint 4 — Constellation System (CONCLUÍDO 2026-07-18):
- 4A: catálogo `CONSTELLATIONS` em data.js (6 domínios, 37+6 estrelas,
  posições à mão) com regras de evidência declarativas — {lvl}/{title}/
  {streak}/{done} — avaliadas de S; SEM caminho manual ("o Núcleo nunca
  mente"). Canvas WebGL próprio no painel, render on demand, estados
  acesa/descoberta/oculta (nome só nas acesas — descoberta é mistério).
- 4B: nevoeiro fbm do domínio, energia a correr nas ligações acesas,
  paralaxe com profundidade, hover, cartão de evidência (regra + estado
  atual por extenso; nome escondido nas adormecidas), nascimento com
  overshoot + ligações a desenharem-se + `star:lit` no bus (mundo pulsa;
  1ª avaliação é baseline; deteção em todos os domínios). Loop rAF só
  com painel visível e sem reduced-motion.
- 4C: Estrelas de Escolha (1/domínio; desbloqueio por evidência; cartão
  "identidade, não evidência"; reversível; `S.constellation.choices`;
  `star:choice`) — influência em radar/missões/Oráculo fica para o
  Sprint 5. Fallback DOM sem WebGL (lista honesta + escolha funcional).
  Skill Trees removidas (painel + renderTree + TREES) — os nós por nível
  são as espinhas das constelações; Títulos Reais intocado (é o cofre da
  evidência que acende estrelas-chave).
- 4D: bateria — evidência real a acender estrelas (addXp→nível→star:lit),
  escolha persistida, reduced-motion = céu estático mas funcional
  (cartões incluídos), consola limpa em todas as corridas.

Sprint 5 — Oráculo vivo (CONCLUÍDO 2026-07-18 — deployado e validado em
produção com utilizador efémero, apagado no fim: a voz respondeu com
linguagem das constelações, tom do Summer Arc, zero elogios vazios e a
regra dos números reais a disparar primeiro perante estado vazio):
- Servidor (Edge Function `oraculo`, deploy CLI --project-ref): bloco VOZ
  por cima da CONSTITUICAO — Guardião do Núcleo, linguagem das
  constelações ancorada em dados ("a imagem ilustra, o dado sustenta"),
  tom sóbrio sem elogios vazios, humildade ("interpretei mal os sinais"),
  tom por arco sazonal (mesmo mapa de meses do frontend). Entra no chat,
  report e sussurro (versão leve). `resumoEstado` ganha titulosReais,
  melhorStreak, missoesFeitasPorArea e caminhosEscolhidos — as Estrelas
  de Escolha pesam nas recomendações (dívida da 4C paga). Report ganha
  `profecia` (condicional verificável ou null), renderizada no HUD (🔮)
  e na nota do vault. Custo: ~+350 tokens input/chamada, ~+100 output
  semanal.
- Frontend: `oracle:spoke` no bus quando o Conselho responde — o mundo
  abranda e escuta (poeira −30%, nebulosa encorpada, decaimento ~6s).
- Radar das 06:30 e report de domingo intocados na lógica; nada de sons.
- Verificação pendente do Daniel: pergunta ao Conselho (voz do Guardião +
  mundo a abrandar) e/ou `report-dry` para ver a profecia.

Sprint 6 — Polimento (CONCLUÍDO 2026-07-18; a porta fica aberta):
- Auditoria: aurora tinha transition CSS de 2.4s EM CIMA da mola do
  motion.js (dupla suavização) — removida, a mola é a única dona do
  movimento; Solar CSS pausa em background e re-aplica ao voltar.
- Consola 100% limpa: meta mobile-web-app-capable moderno + favicon
  (icon-192) — warning e 404 eliminados.
- Calibração de intensidade (resposta ao "está igual" do Daniel):
  nebulosas +20% (multiplicador único na amostra do Solar), 2ª camada
  .042/.065, estrelas de fundo mais vivas, estrelas acesas 20px.
- Polimento fino CONTINUA quando o Daniel trouxer fricção de uso real —
  registar aqui como itens do Sprint 6b quando chegarem.
- Sprint 6b (2026-07-19, fricção real do Daniel — constelações): blocos
  quadrados no fundo (hash sin(dot)*43758 degenerado em GPUs ANGLE/D3D →
  hash sem seno de Hoskins no ruído e no dither); profundidade do céu
  (poeira neutra + 2 camadas de estrelas distantes com paralaxe própria +
  estrelas escondidas como pontos ténues sem nome nem clique); zoom
  cinematográfico por dolly (uZoom/uOff nos shaders, re-render à resolução
  nativa — nunca escala de bitmap) com Motion.Spring: wheel ancorado ao
  cursor, pinch, arrasto, duplo-clique; reduced-motion assenta sem
  animação. Commit f39c93b, push feito.

Missão 12 — estado final: os 6 sprints do plano estão concluídos e no ar.
Fases futuras do roadmap (SYSTEM-EVOLUTION-ROADMAP.md) ainda por abrir
como missões próprias: Universe Navigation, Living Memory, World Events
completos, Celestial Core, sons opt-in.

Camada II (2026-07-20): a visão-mãe ganhou a secção final "Camada II —
Organismo, Núcleo e Navegação por Câmara" no SYSTEM-EVOLUTION-ROADMAP.md
(anexada tal e qual, sem edição). NÃO é missão nova — é aprofundamento da
visão da M12 que as fases já em fila (Dock Celeste/estação espacial,
Celestial Core, Universe Navigation) devem seguir. Consolida como leis:
Idle Motion (nenhum frame parado), Motion Hierarchy (cada camada à sua
velocidade), Camera Motion (a câmara respira sempre), Núcleo como
entidade multicamada (não círculo; "o Núcleo nunca mente" mantém-se),
ligações como energia viva (veias de luz), World Engine reativo ao tempo
e ao comportamento, Galactic Civilization (zoom universo → galáxia →
constelação → estrela → nó → evidência; nunca acaba), e a lei final:
nenhuma animação é decorativa — cada movimento comunica um estado.

Sprints seguintes (roadmap): 2 World Engine · 3 Motion · 4 Constellation
System · 5 Oráculo vivo · 6 Polimento.

## Missão 13 — Vigia de Estágios (DEPLOYADA 2026-07-19; 1ª corrida real
no radar das 06:30 UTC seguinte)

Decisões do Daniel: Norte de Portugal + remoto; estágios/trainee E
eventos (recrutamento + ciber/NIS2/ISO 27001/RGPD); cadência diária.
- Servidor: 2ª pesquisa web na corrida do radar — vagas (area 'vaga',
  com `missao` P1 "Candidatar" obrigatória, deadline se detetável) e
  eventos (area 'evento'). Regra inviolável: só URLs da pesquisa dessa
  conversa; sem nada digno → []. Try/catch: a Vigia falhar nunca derruba
  o radar.
- Dedupe por URL contra 30 dias em radar_items — aplicado TAMBÉM às
  notícias (defeito antigo do radar corrigido: podia repetir itens).
- HUD: área 'vaga' no RAREA (🎯 verde), destaque tipo alto-impacto sem
  pulso; botão de aceitar missão reutiliza o fluxo existente
  (verificado com item simulado).
- Custo: +1 chamada com pesquisa/dia (~duplica o radar matinal; o report
  semanal continua a dominar o custo total).
- Verificar após a 1ª corrida real: qualidade das vagas e ruído — afinar
  a query se vier lixo.

### A verificação de qualidade, finalmente com ferramenta (2026-08-01)

O item que ficou aberto a 2026-07-19:

> *"Verificar após a 1ª corrida real: qualidade das vagas e ruído — afinar a
> query se vier lixo."*

A Vigia está deployada e a correr **todos os dias às 06:30 UTC** desde essa
data, a gastar uma chamada com pesquisa por dia. **Ninguém olhou.**

E o motivo não é preguiça: olhar a sério exige abrir a lista, comparar itens,
procurar repetições, verificar prazos e perceber se as fontes se repetem. Feito
à mão é meia hora que nunca há.

`app/radar/vigia-read.ts` faz isso em segundos.

#### Mede, não decide

Não afina a query, não apaga itens, não classifica nada como lixo. A última
linha do veredicto é deliberada:

> *O que isto não mede: se as vagas eram adequadas e se valeu a pena
> candidatar-se. Essa é a tua.*

#### Os sete sinais de ruído

| sinal | porque interessa |
|---|---|
| URLs repetidos | o dedupe de 30 dias devia impedir; se aparecem, tem buraco |
| títulos quase iguais, URLs diferentes | a mesma vaga em dois sítios — o dedupe por URL não apanha isto por desenho |
| vagas **sem missão** anexada | a regra da missão diz que é obrigatória: é a regra a falhar, não uma preferência |
| vagas sem prazo | não é defeito (o prazo só entra se for detetável), mas a proporção diz se as fontes servem |
| itens sem URL | a regra diz "só URLs da pesquisa dessa conversa" — sem URL não há como verificar |
| domínio de uma fonte | acima de 50% dos itens, a query pode ter ficado presa num agregador |
| dias sem um único item | pode ser o mercado ou a query — o número não distingue, mas mostra que a pergunta existe |

Mais: **áreas fora do `RAREA`**, que seria a Edge Function a inventar
categorias.

#### Verificado com um lote construído para conter cada defeito

Sete itens, cinco da Vigia. Todos os detetores dispararam: 1 URL repetido, 1 par
de títulos parecidos, 1 vaga sem missão, 1 item sem URL, `itjobs.pt` a 80% dos
itens, 1 área inventada, 4 dias sem cobertura, 2 de 4 vagas sem prazo. Zero
erros de consola.

A ausência distingue dois casos que parecem iguais no ecrã: **sem sessão** (o
Radar vive no Supabase) e **respondeu vazio** (pode ser mercado parado ou a
query a falhar — e o texto diz que não distingue).

#### O que falta, e não é código

Correr isto com a **sessão real do Daniel**. O modelo está pronto e testado; os
dados estão no Supabase e não chegam a este ambiente.
## Missão 14 — Universe Navigation · Fase 1: Vista de Universo
(CONCLUÍDA 2026-07-19)

Primeira fase do item "Universe Navigation" do roadmap (SYSTEM-EVOLUTION-
ROADMAP.md), deliberadamente confinada ao painel das Constelações — a
navegação universal entre painéis do HUD fica para fases futuras.

- O Céu do Operador abre na Vista de Universo: as 6 constelações em anel
  (a identidade do hexágono), cada uma com a sua cor, ligações e os três
  estados de estrela; escondidas como pontos ténues também aqui.
- Núcleo ao centro — nunca editável: o brilho É a fração de estrelas
  acesas de todo o céu (evidência; os estados nomeados do Núcleo ficam
  para a missão Celestial Core).
- Navegação cinematográfica com a mola de câmara da M12: clicar numa
  constelação (ou no chip da área) mergulha nela — fly-in com
  continuidade matemática (a câmara do destino nasce no ponto equivalente
  à do modo anterior; sem cortes). Zoom-out no limite do domínio,
  duplo-clique ou o chip "✦ Universo" regressam (fly-out). Reduced-motion
  troca de vista sem animação; o rAF continua a só correr com o painel
  visível.
- Chips ganharam "✦ Universo"; a label de cada domínio acende na cor da
  área quando tem ≥1 estrela acesa, apagada caso contrário.
- Defeitos apanhados na verificação: uniRegions era limpo no early-return
  do draw (o clique morria após qualquer re-render — corrigido); label do
  domínio das 6h saía do céu (clamp a 93%).
- Verificação headless (CDP): ciclo completo universo → fly-in (Ofício) →
  zoom no domínio → fly-out; consola limpa em todas as corridas.

## Missão 15 — Living Memory · Fase 1 (CONCLUÍDA 2026-07-19)

"Aqui o sistema começa a lembrar-se" (roadmap). 100% cliente, derivação
pura de evidência datada que já vive no estado — nada é gravado, nada é
inventado; sem memória digna do dia, silêncio (a regra do sussurro).

- `js/memoria.js` — script clássico novo entre conselho e auth (ordem
  documentada no index.html e no CLAUDE.md atualizada; são 14 scripts).
- `memoriaDoDia()`: fontes = S.history[0] (a primeira centelha),
  S.titleUnlocked (datas reais), objectives[].doneDate,
  training.sessions[].d. Determinística por dia (hashStr).
- Prioridades: aniversários anuais (títulos provados, nascimento do
  Sistema) > marcos redondos de existência (30/50/100/…) > ecos dos
  primeiros passos aos 100/180 dias (1ª missão, 1º título, 1º treino) >
  "neste dia, há 30 dias" (missões concluídas nesse dia exato).
- Render: linha 🕯 `.memoria` na saudação, debaixo do sussurro (vela, não
  holofote); `renderMemoria()` no render() do engine.
- Verificação headless (CDP): estado fresco = silêncio; com evidência
  semeada a prioridade decide bem (aniversário de título vence o marco
  dos 100 dias e o eco dos 30) e a linha entra no DOM; consola limpa.

Fase 2 (CONCLUÍDA 2026-07-19): streaks máximos históricos —
`S.streakPeak={v,d,h}` registado no toggleHabit no momento em que o pico
é real; o undo do toggle guarda e repõe o pico anterior EXATO (o sistema
nunca mente). Memórias novas: eco do melhor streak (30/100/365 dias
depois) e aniversário anual de estrelas nascidas (facto histórico — vale
mesmo se a evidência regrediu; datas "observadas" o=1 não têm
aniversário). Eco visual no céu: no dia do aniversário a estrela pulsa
suavemente (aPulse) no domínio e no universo. Verificado headless:
pico+rollback exatos, os dois textos novos, render com pulso sem erros.
Fase 3 (CONCLUÍDA 2026-07-19, deployada): o Oráculo lembra-se —
`memoriasHoje(st)` na Edge Function (espelho compacto do memoria.js:
idade do Sistema, aniversários de títulos/estrelas nascidas sem o=1,
eco do melhor streak; máx 2, nunca derruba um modo) entra no
resumoEstado como `memoriasDoDia` (chat/sussurro herdam pela VOZ, que
fica proibida de inventar efemérides). O report semanal ganha o campo
`efemeride` (o Guardião reescreve UMA memória com a data real intacta;
null sem nada digno), renderizado no HUD (🕯, antes da Profecia) e na
nota do vault. Custo marginal. Verificado: deploy + preflight 204;
render cliente confirmado em headless com relatório injetado.

## Missão 16 — O Céu Renasce (CONCLUÍDA 2026-07-19; 5 fases A–E)

Salto de qualidade + mudança de conceito nas Constelações, com plano
aprovado pelo Daniel antes de tocar no código. Decisões dele: fundo
procedural SAI (pureza absoluta — só textura indistinta, nunca pontos
legíveis); evidência regressiva RECOLHE a estrela (data fica no registo);
SILÊNCIO TOTAL sobre o que falta (sem contadores nem pistas; o vazio vivo
com poeira/nebulosa/respiração). Auditoria de honestidade: as 37 estrelas
de evidência + 6 de Escolha confirmadas sem enchimento.

- Fase A (conceito): as estrelas NASCEM — o céu só contém regras
  verdadeiras AGORA; estados descoberta/oculta removidos da renderização.
  Registo `S.constellation.born` com data do 1º nascimento (títulos usam
  a data real de titleUnlocked; migração inicial marca o=1 "observada";
  save adiado para fora do ciclo de render). Regressão recolhe; a data
  histórica fica. Subtítulo do painel e fallback DOM alinhados.
- Fase B (qualidade): núcleo nítido + coração branco + halo curto
  exponencial (zero borrão); difração em cruz nas estrelas de maior
  evidência; tamanho por peso (22/20/17); profundidade z determinística
  por estrela (parallax real; as ligações herdam o z das pontas); linhas
  com gradiente de energia + fluxo.
- Fase C (supernova): clarão branco com pico de tamanho, anel de choque
  (~0.85s), 12 partículas ease-out (lite 6), micro-push da câmara por
  impulso de velocidade na mola. Pools pré-alocados (48+4) que sobrevivem
  ao clear(). Reduced-motion = fade simples via uniform uRM + mini-loop
  de 1.4s; corrigido defeito pré-existente (com rm o uTime não avançava e
  a estrela nascida ficava invisível na frame estática).
- Fase D (inspeção): clique → dolly-in a enquadrar + cartão da história
  (domínio na cor, evidência por extenso, data de nascimento/observação,
  ponte "Ver nos Títulos Reais" nas estrelas de título); cartão
  posicionado pela câmara-ALVO. Abertura cinematográfica 1×/sessão na 1ª
  intersecção: grande plano sobre a última estrela nascida → recuo em
  mola até ao Universo (sem estrelas ou com rm, abre direto).
- Fase E (Solar Engine): a mesma amostra horária do céu do palco
  (sampleSolar + weatherNow, meteo incluído) alimenta uAmb — poeira do
  fundo e halo das estrelas (nunca o núcleo); amostra 5s + lerp por
  frame. Entardecer aquece, noite arrefece; domínio manda sempre.
- Verificação headless por fase (CDP): migração/nascimento/regressão,
  render de qualidade com 13 estrelas, supernova em movimento e rm,
  cartão com data histórica real e ponte, sunset vs deep night; consola
  limpa em todas as corridas. 60fps reais: Daniel confirma com ?fps=1
  nos dois aparelhos.

## Missão 17 — Celestial Core · Fases 1+2 (CONCLUÍDAS 2026-07-19)

O Núcleo ganha estados nomeados — derivados SÓ de evidência, nunca à mão
("o utilizador nunca altera o Núcleo; ele apenas vive"). Fase 1 confinada
ao céu; a influência no mundo inteiro (react/Oráculo) fica para a Fase 2.

- coreState(): fração de estrelas de evidência verdadeiras AGORA →
  Dormente (0) · Desperto (≥1) · Ressonante (≥25%) · Ascendente (≥50%) ·
  Celeste (≥75%) · Transcendente (100%). Os limiares usam o total
  internamente; o total nunca é mostrado (silêncio total do M16).
- Visual na Vista de Universo: o corpo do Núcleo cresce, aviva e ganha
  difração com os estados (tamanho 20→36, fade pela fração, pulso subtil
  a partir de Celeste). Clicável: cartão "Núcleo · <Estado>" com o nº de
  estrelas nascidas e a regra ("nunca se edita — responde ao céu").
- Subida de estado testemunhada em sessão: energia a partir do centro
  (pool da supernova) + micro-push + Bus.emit('core:up',{state,name});
  S.constellation.coreSeen persiste o estado observado — a 1ª avaliação
  de uma sessão regista em silêncio (transições não vividas não celebram).
  Reduced-motion: sem fx, evento na mesma. Fallback DOM: linha
  "◉ Núcleo: <Estado>" + mesmo registo/evento.
- Verificado headless (CDP): cartão Dormente a 0, subida em sessão para
  Ressonante com core:up emitido e coreSeen=2 persistido, cartão com 13
  estrelas; consola limpa.
- Fase 2 — o Núcleo influencia o mundo (cliente): `world.core` (0-5) em
  state.js, amostrado a cada 5s do coreState() das constelações (import
  circular seguro — só uso em runtime); react.js ouve core:up (vaga 1.6,
  como rank up) e o estado cria um CHÃO de energia permanente
  (core×.05, 0→.25) — quanto mais forte o Núcleo, mais vivo o mundo em
  repouso; Recovery amortece o chão (core×.02). Todas as camadas que já
  liam world.energy herdam de graça. Stage.debug.world() expõe core.
  Verificado headless: fresco 0.000/core 0; core:up → 1.185; repouso
  Ressonante = 0.100 exato com world.core=2; consola limpa.
- Fase 2b (CONCLUÍDA 2026-07-19, deployada — autorização geral do Daniel
  "continua até acabar o planeado"): resumoEstado ganha `nucleo`
  {estado: Dormente..Transcendente via coreSeen, estrelasNascidas} e a
  VOZ aprende a usá-lo com parcimónia ("o teu Núcleo já ressoa"),
  proibida de revelar quantas estrelas faltam. Radar/report/chat/sussurro
  intocados na lógica; ~+40 tokens input/chamada. Deploy CLI
  --no-verify-jwt; smoke test: preflight 204 com CORS correto.

Fases futuras do Núcleo seguem a Camada II do roadmap (ver Missão 12):
o Núcleo deixa de ser um círculo e torna-se entidade multicamada
(interior, exterior, aura, partículas, anéis, campo) que reage a cada
ação real com onda pela rede; a regra "o Núcleo nunca mente" mantém-se.

## Missão 19 — Universe Navigation · Fase 1: Dock Celeste
(CONCLUÍDA 2026-07-19; forma escolhida pelo Daniel entre 3 opções)

Navegação como viagem, não como salto — aditiva e reversível (o scroll
normal fica intacto). A "estação espacial total" (eliminar o scroll,
zonas por câmara) fica como missão futura própria.

- `js/nav.js` (16º script... 15º clássico; ordem documentada no
  index.html e CLAUDE.md): mini-hexágono fixo no bordo direito — Núcleo
  ao centro (→ topo) + 6 zonas (Diário, Missões, Céu, Treino, Revisão,
  Conselho), cada ponto na cor da sua área com tooltip mono.
- Clicar viaja em mola (Motion.Spring · gentle) até ao painel; o
  parallax de scroll do palco WebGL dá o dolly do céu de graça.
  Re-aponta 1× a meio (a página pode crescer durante a viagem). Qualquer
  wheel/touch/tecla do Daniel cancela a viagem na hora — a mão dele
  manda sempre.
- Ponto ativo = zona mais próxima do quarto superior do ecrã (robusto
  mesmo quando o fim da página impede o encaixe exato).
- Só desktop/pointer:fine e ≥900px — em mobile não nasce (sem clutter);
  reduced-motion = salto direto; aparece 1.2s depois do boot.
- Verificado headless (CDP): 7 pontos, viagem até ao Céu com encaixe
  exato (painel a 50px do topo) e ponto ativo correto; consola limpa.
  Nota: o rAF do headless corre em câmara-lenta (SwiftShader) — a
  velocidade real da viagem confirma-se em hardware.

## Missão 20 — Limpezas recuperadas do backlog (CONCLUÍDA 2026-07-19)

Duas ideias da lista "recuperáveis" pagas de uma vez:

- Token `?t=` REMOVIDO do radar/report (nota de produção da M6): o acesso
  passa a ser só por header `x-oracle-token` — tokens em URL podem ficar
  em logs de proxies/gateways. Deploy + smoke: `?mode=radar&t=inválido` →
  403; preflight do chat → 204. ⚠ Confirmar a 1ª corrida real do radar
  (06:30 UTC de 2026-07-20): o pg_cron chama por header desde o início
  (documentado no CLAUDE.md), mas a prova viva é a corrida.
- Exportação .ics: botão "📅 Exportar .ics" no Calendário — eventos +
  prazos de missões pendentes, all-day, RFC 5545 (CRLF, escaping de
  ;/,/\n), gerado 100% no cliente (nada sai do browser); sem nada para
  exportar avisa e não gera ficheiro. Verificado headless: estrutura,
  contagem, escaping e datas exatas.

## Missão 21 — Camada II · Fase 1: a câmara respira (CONCLUÍDA 2026-07-20)

Primeira aplicação das leis da Camada II (ver Missão 12): Camera Motion +
Idle Motion + Motion Hierarchy no palco e no céu das constelações. Tudo
em uniforms/vertex shader — zero alocações, custo de GPU marginal;
reduced-motion intocado (o palco nem nasce; o loop do céu não corre).

- Palco (engine.js): drift de câmara — deriva lissajous de poucos px
  (máx ~9px) com períodos longos primos entre si em ctx.driftX/Y; cada
  camada aplica-o com peso de profundidade (hierarquia): céu/nebulosa a
  meia-velocidade, estrelas .25+.75z, poeira z (a mais próxima mexe mais).
- Estrelas de fundo (stars.js): micro-órbita própria — cada estrela anda
  em círculo lento (raio ~1-2px, períodos 40-70s derivados da frequência
  de cintilação já existente; zero atributos novos). Margens de wrap
  alargadas 8→28px nas estrelas e na poeira para o drift nunca deixar
  pontos a saltar dentro do ecrã.
- Céu das constelações: drift idle da câmara no tick (dX/dY somados ao
  pan do rato, labels e hit-tests incluídos — o céu nunca está fixo,
  mesmo sem rato) + micro-órbita determinística da posição de mundo no
  ST_VERT, com o LN_VERT a reproduzir a fórmula exata — as ligações
  ficam matematicamente presas às estrelas em órbita.
- Verificação headless (CDP, arnês PowerShell puro reconstruído:
  HttpListener + ClientWebSocket + host-resolver-rules a bloquear a rede
  → modo offline): tier full com loop a correr e shaders a compilar,
  drift vivo sem rato (transform dos labels muda sozinho), evidência
  semeada → 28 estrelas nascidas e ligações presas no fly-in ao Ofício,
  reduced-motion = tier off; consola limpa em todas as corridas.
- 60fps reais: Daniel confirma com ?fps=1 nos dois aparelhos (drift e
  órbitas são só matemática de vértice — impacto esperado nulo).

## Missão 22 — Celestial Core · Fase 3: o Núcleo como entidade
(CONCLUÍDA 2026-07-20)

Segunda aplicação da Camada II ("o Core não deve ser um círculo — deve ser
quase uma entidade"), sobre a fundação honesta da M17: todas as camadas
derivam SÓ do coreState()/evidência. Confinado ao céu das constelações.

- Núcleo multicamada (CORE_VERT/CORE_FRAG, um único point sprite — custo
  marginal): interior de plasma turbulento em rotação lenta + coração
  branco + casca fina + aura que respira; anéis orbitais achatados em
  sentidos opostos (Ressonante+), 3 partículas a percorrer o 1º anel
  (Ascendente+), campo cintilante no perímetro (Celeste+). Dormente é
  ténue mas nunca morto. O Núcleo pulsa, nunca orbita (Motion Hierarchy).
  Tamanho 46→116px com o estado; cartão/clique intocados.
- Onda pela rede (a cadeia literal da Camada II: ação real → energia
  sobe → onda percorre a rede → estrelas respondem): Bus no céu —
  xp:gain (.6), star:lit/core:up/rank:up (1), star:choice (.8) →
  waveFire: frente radial a 300px/s do centro que aviva ligações
  (LN_FRAG, vDc=distância ao Núcleo) e estrelas (ST_VERT/FRAG, tamanho
  +30% e cor a branco na passagem), ~2.4s; uCoreE faz o Núcleo flamejar
  e decai analiticamente (vale no loop normal e no miniLoop, agora
  parametrizável). Painel invisível ou reduced-motion = eventos caem no
  vazio sem custo.
- Verificação headless (CDP): coreSeen 0→4 com evidência semeada (28
  estrelas), entidade com anéis visível no screenshot, onda capturada a
  meio da viagem (ligações do Ofício avivadas), rm = tier off e evento
  emitido sem erro; consola limpa em todas as corridas.
- Calibração de gosto pendente do Daniel em hardware real (intensidades
  das camadas e da onda são multiplicadores únicos).

## Missão 23 — World Engine reativo ao comportamento
(CONCLUÍDA 2026-07-20)

Terceira aplicação da Camada II — as duas leis do World Engine que
faltavam ("ao passar muitos dias sem progresso o universo perde
intensidade luminosa e algumas partículas desaparecem"; "ao domingo o
universo está mais calmo"). Tudo derivado de evidência datada real, nunca
de um flag manual — "o sistema nunca mente".

- `world.neglect` (0-1) em state.js: dias sem progresso REAL medidos à
  última entrada de S.history (o registo de XP agrega por dia). 0 até 2
  dias; rampa linear até 1 aos 14. Recovery é descanso deliberado e
  ZERA a negligência (nunca é castigo do descanso); Sistema sem histórico
  não é julgado (neglect 0). `world.sunday` = getDay()===0.
- Efeito (só intensidade luminosa, nunca brusco): solar.js baixa
  nebulosas (calm×(1-neg·.3)), brilho das estrelas (glow×(1-neg·.35)) e
  ritmo (pace×(1-neg·.2)); domingo abranda o pace ×.85. dust.js ganhou
  uDim — a negligência apaga primeiro as partículas mais ténues
  (×(1-neg·.45)), sem tocar na alocação. react.js baixa o chão de energia
  do Núcleo (×(1-neg·.6)) — sem progresso, o mundo apaga-se em repouso.
- Stage.debug.world() expõe neglect e sunday.
- Verificado headless (CDP): fresco=0, hoje=0, 19 dias=1 (glow 0.99→0.39),
  5 dias=0.22 (rampa), Recovery anula (0); consola limpa.

## Missão 24 — Universe Navigation · Estação Espacial (Modo Estação)
(PAUSADA 2026-07-25 — Fases A e B concluídas)

ESTADO: pausada formalmente, não concluída. As Fases A e B foram entregues e
ficam registadas abaixo com o seu histórico intacto. O escopo restante —
gestos globais entre planetas com snap, profundidade/foco no voo e calibração
do dolly em hardware real — foi ABSORVIDO PELA MISSÃO 26 (Renaissance Visual
sobre React), porque incidia sobre o HUD Vanilla que a Missão 26 vai
substituir. Não retomar desenvolvimento Vanilla nesta fase. Nada deste
trabalho se apaga: o Modo Estação continua vivo em produção (`main`) e em
`legacy/`, e serve de referência de conceito para a navegação da Missão 26.

Item "estação espacial total" do backlog, aberto com plano aprovado pelo
Daniel (3 opções apresentadas): decisões dele — abordagem "Modo Estação
ADITIVO" (câmara por cima do HUD, scroll clássico intacto por baixo,
reversível, sem reescrever painéis) e "TAMBÉM mobile". A estação total
sem scroll foi recusada (risco de layout/mobile); o mapa dedicado também.

- Fase A (CONCLUÍDA): mecanismo de voo com dolly. `js/estacao.js` (16º
  script clássico, entre memoria e nav — ordem documentada no index.html
  e CLAUDE.md). `window.Estacao.flyTo(alvoFn)`: a viagem entre zonas
  ganha câmara — o .wrap AFASTA-SE (scale em sino, 1 nas pontas → ~.915
  a meio; transform-origin ancorado ao centro do olhar = scrollY+innerH/2),
  DESLIZA (scroll real por baixo, mola gentle do Motion) e APROXIMA-SE,
  assentando com transform LIMPO. O dolly vive só durante a viagem — o
  repouso é scroll puro (mobile incluído), sem conflito com transform
  permanente. O Dock Celeste (nav.js) delega-lhe a viagem quando existe.
  Cancelamento por wheel/touch/tecla limpa o wrap (nunca fica encolhido —
  lição do defeito da M12·6b). reduced-motion = salto direto sem câmara.
  Parallax do palco WebGL acompanha (lê scrollY). Verificado headless
  (CDP): voo 0→4126 (alvo 4130), scale aplicado a meio e limpo no fim,
  cancelamento seguro, rm salta direto, consola limpa.
- Fase B (CONCLUÍDA): o Mapa da Estação — overlay navegável (a linguagem
  da Vista de Universo aplicada a todo o HUD). Um gatilho flutuante ✦
  (`.station-fab`, nasce em desktop E mobile — resolve a entrada em toque,
  onde o Dock não existe) abre um overlay com os 7 planetas/zonas em anel
  à volta do Núcleo, cada um na cor da sua zona; a zona atual (a mais
  próxima do quarto superior do ecrã) destaca-se. Tocar num planeta fecha
  o mapa e voa lá (flyTo da Fase A). Esc/tocar-fora/✕ fecham. AMP do dolly
  subiu .085→.11 (mais percetível). Verificado headless (CDP): FAB pronto,
  overlay com 7 planetas, zona ativa destacada, clique→voo até ao destino
  (scrollY exato, transform limpo), funciona em viewport mobile; consola
  limpa.
- Overflow horizontal em mobile — investigado a fundo (o Daniel pediu a
  causa raiz, não um remendo). Conclusão honesta: NÃO há overflow de
  conteúdo real — o elemento mais largo em fluxo é o próprio .wrap a 378px
  (cabe nos 390). O descentramento do overlay que aparecia no screenshot
  era ARTEFACTO da emulação `mobile=true`+dsf=2 do CDP (infla o layout
  viewport por interação com decoração fixed grande — os `<i>` da aurora a
  74vmax≈625px em retrato). Em emulação de ecrã estreito realista o overlay
  mede 375×844 left:0 (centrado). Correções defensivas aplicadas (boas
  práticas, ficam): `html{overflow-x:hidden}` (raiz, mata qualquer scroll-x
  parasita) e `.ptitle{flex-wrap:wrap}` (o título+2 botões do Calendário
  já não cortam em ecrã estreito).
- Fases seguintes (planeadas): gestos globais (wheel/drag/pinch para saltar
  entre planetas, snap); profundidade/foco (zonas fora do destino recuam no
  voo); calibração do dolly em hardware real.

## Missão 25 — Foundation: migração para React + Vite (CONCLUÍDA 2026-07-22)
Branch `react-migration` (o `main` Vanilla fica intacto como ponto de
retorno; merge só no fim, com aceitação toda verde). Fase 1 de um plano de
dois tempos; a Renaissance visual é a Missão 26, prompt separado, só depois
desta base estar estável em produção.

ESTADO FINAL: 18 fases concluídas e verificadas. Toda a funcionalidade e a
camada fx/motion estão migradas; o workflow de deploy está preparado e
inativo. O que falta não é trabalho de migração — é o GATE DE PRODUÇÃO, que
só o Daniel levanta. Esta missão ABSORVE e SUPERA a "Missão 30 — Migração
Frontend Next Generation" da documentação de `docs/frontend-migration/`.

Contrato (aprovado pelo Daniel): a LÓGICA DE CÁLCULO preserva-se linha a
linha (motor de XP com reversões/clamps/bónus — auditado, intocado; SM-2;
coreState; Solar; etc.). A COLA de estado/render muda necessariamente (o
padrão `S global + render() por innerHTML + save()` é incompatível com
React e desaparece). O que tem de ficar IDÊNTICO é tudo o que o Daniel
observa: aspeto, fluxos, números, estados. Divergência = bug. BARREIRA:
nenhum redesign visual nesta missão.

Decisões: Zustand para o store (o palco WebGL lê o estado fora do ciclo
React num rAF via `window.__store.getState()` — Zustand serve isso,
Context não); JS+JSX (sem TypeScript); o palco WebGL (`js/stage/`, ~2065
linhas afinadas) NÃO se reescreve — a app React monta o canvas e uma ponte
alimenta-o (Fase 2, o maior risco, resolvido cedo). Deploy passa a ter
build (GitHub Actions); a troca da source do Pages para Actions é no merge.

- Fase 0 (CONCLUÍDA 2026-07-20): ambiente. Branch criada; o Vanilla inteiro
  (index.html, js/, css/, perguntas/, manifest, ícones) movido para
  `legacy/` com `git mv` (histórico preservado; serve standalone como
  referência visual das comparações antes/depois). Scaffold na raiz:
  package.json, vite.config.js (`base:'/Sistema/'`), index.html (entry),
  src/main.jsx, src/App.jsx (ecrã de fundação placeholder), src/store/
  useStore.js (Zustand + ponte `window.__store`), src/styles/base.css.
  Verificado: `npm install` (76 pacotes), `vite build` OK (Vite 6.4.3), o
  preview serve em /Sistema/ (200), o React monta o ecrã de fundação, a
  ponte existe, rede/consola limpa (favicon inline resolveu o 404). Zero
  painéis migrados — próximo passo (Fase 1) é a casca viva: store a
  espelhar o app_state do Supabase (auth+load+save) antes de qualquer UI.

- Fase 1 (CONCLUÍDA 2026-07-20): a casca viva — o store espelha o app_state
  antes de qualquer painel. Camada de estado PURA em `src/state/`, portada
  linha a linha do `legacy/` (contrato: lógica intocada): `dates.js`
  (fmt/today/yday/diffDays), `config.js` (ATTRS/AM/RANKS/TITLES/OBLIG/EXTRAS
  + diffTag + rankOf/titleOf/overallLevel — só o subconjunto que o modelo de
  estado precisa; o resto entra com os painéis), `fresh.js` e `normalize.js`
  (o bloco de saneamento do antigo bootState: defaults, migração
  quests→objectives, quebra de streaks). `src/lib/supabase.js` troca o
  `window.supabase` do CDN pelo pacote npm (mesma URL/anon key). O store
  (Zustand) ganhou a cola de persistência do antigo auth.js: `init` (resolve
  sessão), `boot` (carrega nuvem/local/fresh → normaliza → localSave →
  cloudSave), `save` (local imediato + cloudSave debounce 900ms — réplica de
  auth.js:76), `login/signup/offline/logout`. Ficam DELIBERADAMENTE de fora
  (não são "casca" — entram com o motor/painéis): processDayClose (motor de
  XP), loadQuestionBank/getDailyRecallSet, calInit/fetchWeather. A app tem um
  gate de auth mínimo (login/criar conta/offline) e um ecrã de PROVA que lê
  números reais do store (rank/nível/XP/atributos/sync) — nada fabricado.
  Verificação: `vite build` OK; smoke test Node aos módulos de estado
  (16/16 — fresh, defaults, migração com prioridades+diffTag, idempotência,
  quebra de streak); headless Brave/CDP do arranque real (React monta → gate
  → offline → prova com estado fresh: rank E, Novice Auditor, nível 1, 0 XP,
  6 atributos, v4 normalizado, localStorage escrito, migratedQuests, ponte
  window.__store viva; consola limpa). O caminho de NUVEM (cloudLoad/
  cloudSave) é porto verbatim do auth.js já provado em produção; fica por
  exercitar com a conta real do Daniel (o único ponto que toca dados reais —
  a seu critério). Nota honesta: entrar na casca com a conta real grava de
  volta um estado normalizado mas SEM day-close — inócuo (normalize é
  idempotente no v4 e o legacy fecha os dias em atraso ao voltar).

- Fase 2 (CONCLUÍDA 2026-07-20): a ponte para o palco WebGL — o maior risco,
  resolvido cedo. Contrato honrado: o palco (~2065 linhas) NÃO se reescreve.
  Decisão: o palco é código VIVO, não referência — copiado (não movido) de
  `legacy/js/stage/` + `legacy/js/vendor/three.module.min.js` para `src/stage/`
  + `src/vendor/` (o legacy mantém a sua cópia para a referência standalone;
  duplicação intencional e temporária até o legacy ser apagado no fim). Zero
  edições ao palco: ele continua a ler o global `S` com guardas `typeof` —
  `src/Stage.jsx` monta o `<canvas id="dust">`, espelha `useStore` para
  `window.S` (o palco corre num rAF FORA do ciclo React; a ponte é um global,
  não props) e expõe `window.today` (para o Recovery em state.js); Bus/
  seasonArcNow degradam graciosamente até migrarem. O palco é `import()`
  dinâmico (chunk próprio ~523KB com THREE, code-split). `#dust` fixo por trás
  do conteúdo (z-index 0; `.app-content` z-index 1) — a auth e a prova aparecem
  por cima do céu vivo, como no Vanilla. Verificação headless (Brave/CDP com
  swiftshader): canvas com contexto WebGL, `Stage.tier=lite` (full em hardware),
  engine a correr, façade `dustStart` viva, ponte `window.S` sincronizada,
  Solar a escrever `--amb1` (cores de fim de tarde às 20h reais),
  `debug.world()` com hora/pace/glow reais, `debug.pulse(1)` faz a energia
  reagir (0→0.57 com decaimento), consola limpa; screenshot confirma o céu a
  pintar por trás da prova. 60fps reais e tier full: Daniel confirma com
  `?fps=1` em hardware. Falta ligar o Bus (xp:gain→pulso) quando as ações do
  motor migrarem — aí o mundo volta a reagir ao comportamento real.

- Fase 3 (CONCLUÍDA 2026-07-20): o primeiro painel do HUD real — o herói.
  Estabelece o padrão de migração que os painéis seguintes reutilizam: o
  `css/hud.css` (791 linhas) entra INTACTO (copiado para `src/styles/hud.css`,
  importado no main.jsx; fontes Google iguais às do Vanilla no index.html) e o
  markup renderiza-se com as CLASSES REAIS. `src/components/Hero.jsx` porta o
  markup de legacy/index.html:59-88 e os cálculos de engine.js:108-133 (lvl,
  rank, título 👑/nível, XP total pt-PT, missões, melhor streak, anel de
  progresso, barra de rank) — a lógica dos números fica idêntica; só a cola
  (JSX + store) muda. Avatar extraído verbatim para `src/assets/avatar.js`;
  `config.js` ganhou `need` e `TITLES_REAL`. `Stage.jsx` ganhou a camada de
  fundo do Vanilla (aurora/horizonte/grelha, estilados pelo hud.css, a ler as
  variáveis --amb do Solar). O ecrã de prova da Fase 1 deu lugar ao HUD (.wrap
  com syslabel + herói + rodapé de sync/logout). DEFERIDO (entra com motion.js):
  a camada de ANIMAÇÃO — setNum count-up, Motion.fillBar, cerimónia de rank-up;
  os valores renderizam-se diretos (repouso idêntico; o anel usa a mesma
  transition CSS do Vanilla). Também deferidos: topbar glass (precisa do scroll
  handler), botões exportar/reiniciar do rodapé. Verificação headless (Brave/CDP):
  fresh = rank E, Novice Auditor, nível 1, "Rank E → D"; estado semeado (attrs
  nv5+20xp, totalXP 12345, título cncs, 2 missões, streak 13) = nível 25, rank
  S, 👑 Cyber Foundations, "12 345", barra 2.381% (cálculo exato conferido à
  mão), fonte Rajdhani ativa, avatar carregado, consola limpa; screenshot
  confirma o herói fiel ao Vanilla sobre o céu+aurora+grelha.

- Fase 4 (CONCLUÍDA 2026-07-20): Atributos + Núcleo (radar) — o par natural a
  seguir ao herói (partilham S.attrs). `src/components/Attributes.jsx` porta o
  render de engine.js:143-156 (6 linhas dom-<id> com pontos de cor, rank badge,
  barra e XP; a mola Motion.fillBar deferida — largura direta). `Radar.jsx`
  porta renderRadar (engine.js:173-190) gerando o SVG idêntico via
  dangerouslySetInnerHTML (escala axisMax sobe com o rank). Entram numa `.cols`
  a seguir ao herói. Verificado headless (Brave/CDP): fresh = 6 atributos nv1/E,
  0/60 XP, radar com 5 polígonos + 6 labels + rank central E; semeado (oficio
  nv5+20xp, saber nv12) = oficio Nv5 rank D barra 14% (20/140), saber rank C,
  herói recalcula p/ nível 16 rank B Lead Auditor Candidate; consola limpa,
  screenshot fiel ao Vanilla.

- Fase 5 (CONCLUÍDA 2026-07-20): o motor de XP + o Bus + o Diário (o 1º painel
  INTERATIVO). Aqui migra o núcleo auditado ("o sistema nunca mente"):
  `src/state/engine.js` (addXp/plog/unlog, porto de engine.js:27-44 — S passado
  explícito, matemática de XP/níveis/totalXP/histórico idêntica; FX de subida de
  nível deferido), `src/state/world.js` (xpMult + deps: seasonArcNow, isoWeekKey,
  doubleXPActive, rainyActive — world.js:6-27) e `SEASON_ARCS` em config. O
  `src/lib/bus.js` (porto verbatim) é importado no main.jsx ANTES do palco montar
  → o react.js do palco liga-se e o mundo volta a reagir ao XP REAL (dívida da
  Fase 2 paga). Ações no store: `toggleHabit` (engine.js:64-85 — streak com undo,
  pico datado, XP com bónus×xpMult, reversão pelo lastGain EXATO), `addHabit`,
  `delHabit`; cada uma muta S em-lugar e faz set({S:{...S}})+save. FX deferido
  (floatXP/toast/cardWave/onda). `src/components/Diario.jsx` (habHTML de
  engine.js:90-99). Verificado headless (Brave/CDP): marcar 1º obrigatório =
  +19 XP (round((18+1)×1)) com coerência total (attr=total=registo=lastGain),
  streak 1, e a energia do palco subiu para 0.47 (Bus ligado); desmarcar reverte
  tudo a 0 exatamente; add via input React (setter nativo) cria extra 'c...' de 8
  XP com ✕, marcá-lo dá +9 XP de mente, ✕ apaga; consola limpa. NOTA: o teto
  diário de XP do treino, a penalização (processDayClose) e o unlog de reversões
  de missão migram com os painéis/motor respetivos.

- Fase 6 (CONCLUÍDA 2026-07-20): Missões (objetivos-mestra) + Shadow Army — o
  maior painel de lógica. `src/state/objectives.js` (triage, porto de
  objetivos.js:7-21: palavras-chave hi/lo, prazo aperta prioridade, área por
  keyword, tags). Constantes em config (PRI/OST/OSTL/TIER_LABEL/TIER_KEY/KW_*/
  FUN_TAGS); `daysUntil` em dates. Ações no store: `addObjective` (triagem AUTO
  ou manual), `delObjective` (apagar missão FEITA reverte XP+Sombra+registo com
  window.confirm — Fuga 1), `cycleObj` (pend→doing→done = A R I S E: XP da
  prioridade, Sombra datada, registo; regredir reverte exato). Componentes
  `Objectives.jsx` (filtros locais est/area/sort/dif, lista ordenada, chips
  área/tier/arco/tags/prazo, add form) e `Shadows.jsx` (poder, raridade por
  nível). FX (toast da triagem, floatXP, cineArise, onda) deferido; o confirm
  de integridade fica. Verificado headless (Brave/CDP): triagem de "Estudar
  para exame de RGPD" = P1/Elite, saber, 🔨 Média; A R I S E = saber 3/10/150
  (exato) + Sombra Épica Nv10 + registo ARISE; reverter = 1/0/0, 0 sombras, log
  vazio; filtro Feitos esconde pendente; apagar missão feita (confirm) reverte
  XP; consola limpa.

- Fase 7 (CONCLUÍDA 2026-07-21): Revisão Ativa (Active Recall) + SM-2. Banco de
  perguntas copiado para `public/perguntas/` (100 perguntas, 6 lotes) e carregado
  por fetch com `import.meta.env.BASE_URL`. `src/state/recall.js` porta
  loadQuestionBank, addDays/failCount/shuffle/questionPool/findQuestion,
  reviewQuestion (SM-2), pickDiverse/selectRecallQuestions/getDailyRecallSet,
  bumpStudyStreak (S explícito; QBANK em módulo). `RECALL_THEMES` em config. O
  `boot` do store carrega o banco e constrói o set do dia antes do 1º render.
  Ações: `answerRecall` (SM-2 + XP de Saber ×xpMult + registo; fecha o lote →
  streak de estudo) e `addCustomQuestion` (id 'meu-...'). `Recall.jsx` (revelar/
  notas/resumo + formulário de pergunta própria; `revealed` é estado local). FX
  deferido. Verificado headless (Brave/CDP): banco carregado (5 perguntas
  diversas), revelar mostra resposta+3 notas, acertar dá +12 XP de Saber, lote
  completo (5×12=60) → saber nível 2 + resumo + streak 1; addCustomQuestion
  válida cria 'meu-...', incompleta rejeitada; consola limpa.

- Fase 8 (CONCLUÍDA 2026-07-21): Treino (calistenia). `PROG`/`TLINES`/`KLINE` em
  config; `src/state/training.js` (consecTrained/weekSessions/kegelDaysAtStep/
  trAdvice, S explícito). Ação `finishTraining(form)` — porto de treino.js:9-52:
  avanço de passo (3×alvo limpo; kegel = 3 dias distintos), XP de Corpo com teto
  diário (Fuga 2: 1ª sessão inteira, 2ª a metade, 3ª+ a zero; registo sempre
  guardado), volume extra com trava aos 4 dias seguidos. `Training.jsx` — inputs
  controlados (React) em vez do trKeep do Vanilla; os valores persistem
  naturalmente entre re-renders (comportamento idêntico). FX (toasts de evolução/
  teto, floatXP) deferido. Verificado headless (Brave/CDP): 5 linhas; 1ª sessão
  (push 12 avança + kegel) = Corpo +57 (27 base + 30 avanço), push Passo 2/8,
  registo; 2ª sessão no mesmo dia = teto a metade (inputs persistem como no
  Vanilla → re-regista push+core+kegel, 2 avanços, 17+30=47); herói recalcula p/
  nível 2, Corpo Nv2 44/80, total 104; consola limpa.

- Fase 9 (CONCLUÍDA 2026-07-21): Sono (regulador). `src/state/sleep.js`
  (calcHours, sleepStreak). Ações `logSleep(form)` (porto de sono.js:7-26:
  noite no alvo 7,5–9,5h + recente + não premiada → +12 Corpo +5 Disciplina e
  marca o pilar o_sono com undo/lastGain=0 — o prémio vive no registo, anti-farm
  para retroativo/futuro) e `setSleepT`. `Sleep.jsx` (barras 14 dias, stats,
  form controlado, hora-alvo de recolher). FX (toasts) deferido. Verificado
  headless (Brave/CDP): noite 23:00/07:00=8h → Corpo 12 + Disciplina 5 (total
  17), pilar o_sono marcado (done, streak 1, lastGain 0), streak no alvo 1;
  re-registo do mesmo dia não duplica (rw), futuro rejeitado, retroativo 3d a 0
  XP (plog retroativo); consola limpa.

- Fase 10 (CONCLUÍDA 2026-07-21): painéis do hud.js (parte 1) — Saudação,
  Faixa de prazos, Conquistas, Estados/Debuffs, Títulos Reais. Constantes ACH/
  DEBUFFS/QUOTES/EVT em config; `src/state/titles.js` (reqMet/titleProg/
  isTitleUnlocked, S explícito). Ações: `toggleDebuff`, `applyAntidote` (Fuga 4:
  1×/dia, +10 Disciplina), `toggleReq` (evidência → 100% desbloqueia o Título
  Real datado; regredir re-tranca). Componentes `Greet` (saudação+citação
  determinística), `DeadlineBanner`, `Achievements` (read-only, cond avaliada de
  S — a cerimónia/seenAch fica com o fx), `Debuffs`, `Titles` (open local).
  Verificado headless (Brave/CDP): 11 conquistas (1ª desbloqueia com XP), 4
  estados (toggle + antídoto +10 Disciplina + dedup 1×/dia), 5 títulos — marcar
  os 3 requisitos do CNCS desbloqueia-o (👑) e o HERÓI passa a mostrar "👑 Cyber
  Foundations (CNCS)" (reatividade entre painéis pelo mesmo store); consola
  limpa. FX deferido; notificações browser (enableNotif/checkNotif) por migrar.

- Fase 11 (CONCLUÍDA 2026-07-21): Calendário + eventos + exportações (parte 2 do
  hud.js). `src/state/calendar.js` (guessEvType, MONTHS); `src/lib/exports.js`
  (exportStateFile JSON + exportICS — porto verbatim do M20, RFC 5545). Ações:
  `addEvent` (tipo AUTO via guessEvType), `delEvent`, `resetAll` (recomeço com
  confirmação → normalize(fresh)+set do dia). `Calendar.jsx` — grelha do mês
  navegável (calY/calM local), selo em dias passados com XP, pontos/eventos,
  próximos prazos, add/remover, botão Exportar .ics. Rodapé completo (Exportar
  p/ Advisor JSON + Reiniciar sistema). Notificações browser adiadas para uma
  fase de PWA. Verificado headless (Brave/CDP): calendário "Julho 2026" com
  célula de hoje; adicionar "Exame de RGPD" → tipo exame, ponto no dia, em
  próximos prazos, faixa de prazos visível; navegar → "Agosto 2026"; botão .ics
  existe e clica sem erro; apagar evento → 0; resetAll (confirm) zera o total
  (19→0); consola limpa.

- Fase 12 (CONCLUÍDA 2026-07-21): Living Memory + Mapa de Conhecimento (painéis
  self-contained, derivação 100% cliente). `CONSTELLATIONS` portado para config
  (usado pelo Memória e pela futura fase das Constelações). `src/state/memory.js`
  (memoriaDoDia, porto de memoria.js:10-80: aniversários anuais > marcos redondos
  > ecos dos primeiros passos > "há 30 dias"; determinístico por dia; silêncio
  sem evidência). `Greet` ganha a linha 🕯 debaixo da citação. `KnowledgeMap.jsx`
  (porto de renderMapa/conselho.js:128-154: agrega S.recall por tema, taxa de
  acerto, 2 piores ease; tema só ≥5 vistas). Verificado headless (Brave/CDP):
  fresh = Memória em silêncio + Mapa "sem dados"; com nascimento há 100 dias →
  "🕯 O Sistema existe há 100 dias. A primeira centelha: 12/04/2026"; 5 perguntas
  rgpd semeadas → Mapa mostra rgpd 60% (3/5) + volume + 2 pontos fracos; consola
  limpa.

- Fase 13 (CONCLUÍDA 2026-07-21): World Engine. Constantes WHISPERS/WH_SEASON em
  config; `world.js` ganha seasonBounds, heatActive, whisperToday, vitals (porto
  de world.js:10-60). Ações: `fetchWeather` (Open-Meteo, fire-and-forget no
  boot), `claimWhisper` (1/dia, XP×xpMult), `startRecovery` (2 dias sem
  penalização), `arcAccept`/`arcLater`/`arcIgnore` (aceitar traz as missões do
  arco via triage + 15 Mente). `World.jsx` — arco (propor/ativo com contagem de
  dias e bónus), eventos do dia (Double XP/Rainy/Heat/Recovery/recolher), sussurro
  do dia, sinais vitais (momentum/burnout/recuperação) e sugestão de Recovery aos
  70% de burnout. FX (toasts) deferido. Verificado headless (Brave/CDP): Summer
  Arc a propor (3 botões), 3 vitais (burnout 40%), sussurro reclamável (+10 XP,
  ✓), aceitar arco → ativo + 4 missões sazonais + 15 Mente + 2 chips de bónus,
  Recovery ativa o chip; consola limpa.
  Falta migrar (server/WebGL): Radar Diário + Oráculo (radar.js, lê Supabase),
  Conselho (chat Edge Function) e o painel das Constelações (WebGL) + Vista de
  Universo. Mais a camada fx/motion (animações deferidas).

- Fase 14 (CONCLUÍDA 2026-07-21): Radar Diário + Oráculo (relatório). `RAREA` em
  config. Store ganhou `radar`/`report` + `loadOracleData` (porto de radar.js:
  7-17; lê radar_items 7d + último oracle_report do Supabase; corre no boot com
  sessão), `acceptRadarMission` (tag 📡 Do Radar) e `acceptOracleMission` (tag
  🔮 Do Oráculo), ambos via triage. `RadarNews.jsx` (notícias por dia, alto
  impacto, favicon, chip de área, aceitar) e `OracleReport.jsx` (resumo/treino/
  sono/estudo/alerta/propostas/missões/recursos/efeméride/profecia/recompensa/
  título/legado). FX (scanline/typewriter) deferido. Verificado headless (Brave/
  CDP, dados semeados via setState — a validação com dados REAIS do Supabase fica
  para o Daniel com a conta dele): offline = convite a entrar; com user+radar+
  report semeados → item de alto impacto com chip NIS2 e botão; aceitar Radar →
  objetivo "📡 Do Radar" + radarAccepted + botão "✓ Missão aceite"; relatório com
  resumo/título "Forjador"/profecia; aceitar missão do Oráculo → objetivo "🔮 Do
  Oráculo" pri P1; consola limpa. Falta migrar: Conselho (chat Edge Function) e
  Constelações WebGL; camada fx/motion.

- Fase 15 (CONCLUÍDA 2026-07-21): Oráculo · Conselho (chat) + Sussurro. Store
  ganhou `ocMsgs`/`ocBusy` + `ocQuotaLeft` (12/dia), `sendConselho` (porto de
  conselho.js:156-200: contador incrementa ANTES, servidor revalida; falha
  devolve a quota e tira a pergunta do histórico da API — "o sistema nunca
  mente"; `oracle:spoke` no Bus), `acceptConselhoMission` (parse "⚔ Ação (48h):"
  → objetivo 🔮 prazo 48h) e `fetchSussurro` (?mode=sussurro, 1/dia, cache em
  S.sussurro; erro = silêncio). `Conselho.jsx` (log, quota, enviar, aceitar-
  missão por resposta) e `Greet` ganha a linha 🔮 do sussurro. `supabase.js`
  exporta URL/ANON. Teatro/typewriter = fx (deferido). Verificado headless
  (Brave/CDP; o sucesso em REDE fica para o Daniel com a Edge Function): offline
  = convite + enviar desativado; seed user → prompt + quota 12/12; enviar sem
  sessão → bolha de erro "Sem ligação" + quota DEVOLVIDA (12/12); resposta com
  "⚔ Acao (48h)" → botão "Aceitar como missão" → objetivo 🔮 Do Oráculo prazo
  48h + botão "✓ Missão aceite"; sussurro 🔮 na saudação; consola limpa. Falta:
  Constelações WebGL + Vista de Universo; camada fx/motion (animações).

- Fase 16 (CONCLUÍDA 2026-07-22): Constelações WebGL + Vista de Universo — o
  último painel funcional. O motor `src/stage/constellation.js` (1255 linhas)
  já estava portado das M16/17 mas nunca montado: faltava a casca React que
  fornece o DOM que ele procura (`#constel-cv`, `#const-labels`, `#const-chips`)
  e as pontes dos globais do Vanilla. `src/components/Constellations.jsx` replica
  a marca do painel do legacy (o `css/hud.css` intacto dá o aspeto) e chama
  `initConstellation()` 1× no mount (guard de módulo — o renderer WebGL prende-se
  ao canvas; StrictMode re-corre o efeito no mesmo nó). `Stage.jsx` pontou os
  globais em falta (`CONSTELLATIONS`/`ATTRS`/`AM`/`TITLES_REAL`/`save`) e passou
  a chamar `window.renderConstellation()` no subscribe do store — o equivalente
  ao `renderConstellation()` no fim de cada `render()` do Vanilla (deteta
  nascimentos de estrelas por evidência nova). Bónus: pontar `CONSTELLATIONS`
  corrigiu um bug pré-existente — `state.js` (palco) chama `coreState()` a cada
  `updateWorld()`, mas sem o global o `world.core` esteve sempre em 0; agora o
  Núcleo do mundo responde à evidência. Verificado headless (Brave/CDP): fresh =
  0 estrelas + `world.core` 0; evidência semeada (saber lvl12 + título cncs) → 6
  estrelas nascem, `saber:esp` (lvl12), `oficio:cncs` com a DATA REAL do título
  (2026-05-10, não hoje), `oficio:iso` NÃO nasce (sem evidência) — "o sistema
  nunca mente"; `world.core` sobe a 1; Universo → clicar Saber mergulha (chip
  ativo) → volta ao Universo; regressão (saber lvl1) preserva a data histórica
  de nascimento (conceito M16); consola limpa. NOTA fx/motion deferido: sem
  `window.Motion`, a câmara (fly-in/zoom/dolly) assenta sem mola — funcional mas
  sem o cinematográfico. Falta migrar: a camada fx/motion (animações deferidas
  em TODAS as fases) — é a próxima e última fase da migração.

- Fase 17 (CONCLUÍDA 2026-07-22): camada fx/motion — a última grande peça, que
  fora DEFERIDA em todas as 16 fases. Porto fiel do fx do Vanilla ("divergência
  = bug"), com as skills emilkowalski/impeccable (ver [[skills-design-animacao]])
  como grelha de qualidade — as regras do Emil (só transform/opacity, easings
  fortes, <300ms em UI, springs interrompíveis, reduced-motion) já eram as leis
  do projeto, por isso portar É segui-las.
  - `src/lib/motion.js` (porto verbatim de legacy/js/motion.js): motor de molas
    `Motion.Spring` + tokens + `fillBar` + presença (tilt 3D, botões magnéticos,
    aurora e glow que seguem o cursor). Uma diferença de forma: `.aurora` é
    procurada LAZY (o palco React monta depois do load). Expõe `window.Motion` —
    o que **desbloqueia de imediato o cinematográfico da câmara das Constelações
    (fly-in/zoom em mola) da Fase 16**, que assentava sem mola.
  - `src/lib/fx.js` (porto das primitivas): toast (duração por texto, pausa em
    hover), floatXP, celebrate/cinePulse, cineMoment/cineArise (A R I S E),
    rankCeremony, setNum (contadores em mola), cardWave, panelScan, barBurst,
    sysType, reveal-ao-scroll. Continuam em `window.*`, chamadas guardadas como
    no Vanilla. `src/components/Toast.jsx` monta o `#toast` + listeners de pausa.
  - Ligação sem tocar na lógica: `addXp` (state/engine.js) restaura o fx de
    subida de nível (toast + celebrate + barBurst) — seam ÚNICO que cobre TODOS
    os level-ups. As ações do store restauram os floatXP/toasts/cineArise
    específicos nos mesmos pontos do Vanilla (floatXP assenta ao centro fora do
    evento de DOM — o fallback que ele já tinha; cardWave/scan pós-render via
    `requestAnimationFrame`). `Hero.jsx`/`Attributes.jsx` ganham um
    `useLayoutEffect` que espelha o `render()` (cerimónia de rank-up + setNum +
    fillBar) sem mudar o JSX (1º render e reduced-motion ficam corretos; a partir
    daí a mola por id/chave assume). `Achievements.jsx` ganha a cerimónia de
    conquista com 1ª avaliação silenciosa (baseline, sem rajada ao carregar).
    `Conselho.jsx` ganha o teatro (moldura respira + linha rotativa com `ocBusy`)
    e o typewriter da resposta. Radar/Oráculo ganham a scanline (1×/sessão).
  - Verificado headless (Brave/CDP): `Motion`+9 primitivas no window + `#toast`
    montado; marcar pilar → toast "Pilar confirmado" + floatXP; missão completa →
    status done + overlay cinemático + cardWave na obj-row + toast "A R I S E" (e
    a cerimónia de conquista "👣 Primeiro passo" a disparar no 1º XP — o cinemático
    é um-de-cada-vez, os outros caem para toast, como no Vanilla); setNum apanhado
    a meio da mola (#txp 138 rumo a 150 — a animação corre); Constelações com
    Motion mergulham em mola; reduced-motion = 0 overlays sem erro; consola limpa.
  - (O typewriter do relatório do Oráculo entrou na Fase 18, abaixo — a camada
    fx/motion ficou 100% migrada.)

- Fase 17b (CONCLUÍDA 2026-07-22): polimento aditivo — topbar-glass + boot
  sequence.
  - `src/components/Topbar.jsx` (porto de legacy/index.html:34-39 + o IIFE de
    scroll do fx.js): barra glass fixa que espelha rank+nível+barra de rank,
    aparece ao passar o herói (scrollY>430) e encolhe em scroll fundo (>1100);
    a barra usa `Motion.fillBar`. Montada no topo do `<Hud>` (só com sessão).
  - Boot sequence: bootstrap inline no `<head>` do index.html marca `html.boot`
    1×/sessão (antes do 1º paint, como no Vanilla); o IIFE no fx.js corre a
    sequência (fundo→partículas→saudação escrita→painéis em stagger, ~1.1s,
    saltável com clique). `typeGreet` re-tenta até o `#greet-h` existir (o HUD
    React monta depois da sessão resolver). Para o uso diário do Daniel (sessão
    em cache) o HUD monta a tempo e a boot toca sobre ele.
  - Correção importante para o React: removidos o handler `animationend` que
    removia `.reveal` e o `installReveal` (IntersectionObserver) — ambos mutavam
    a className, que o React possui e reescreve a cada render (conflito). O CSS
    `.reveal{animation:rise … forwards}` já mantém o painel visível no fim; no
    React todos os painéis animam uma vez no mount (comportamento das fases 1-16).
  - Verificado headless (Brave/CDP) com SCREENSHOT (ground truth): HUD completo e
    sólido — herói, topbar-label, World, Atributos, Núcleo, Diário; herói opacity
    1 (o "0" do getComputedStyle é artefacto do headless — o `forwards` renderiza
    visível); boot corre (`boot-on`/`boot-greet`, `boot` removido) sem prender
    painéis; topbar espelha nível (1→11 após XP); scroll na window (porto fiel);
    consola limpa. NOTA: o toggle de scroll da topbar é flaky no headless (o
    `scrollTo` nem sempre regista) mas o código é o porto exato do Vanilla.

- Fase 18a — Typewriter do relatório do Oráculo (CONCLUÍDA 2026-07-22): o último
  fx deferido, agora portado (fecha a camada fx/motion a 100%). `sysTypeHTML`
  portado para `lib/fx.js`; `OracleReport.jsx` chama-o 1×/relatório (guarda de
  sessionStorage) sobre as secções `.orc-sec`/`.orc-leg`, junto com a scanline.
  React-safe por DEGRADAÇÃO (não por evitar o conflito): o relatório só
  re-renderiza quando muda (raro) e o typing corre em idle; se um re-render o
  apanhar a meio, o React recria o texto completo dos nós (o closure continua a
  escrever em nós já destacados — inofensivo), nunca um estado partido.
  Verificado headless (Brave/CDP): relatório semeado → `sysTypeHTML` chamado
  (orcSeen no sessionStorage), 7 secções, escrita parcial a meio (77 chars),
  resumo escrito por extenso, consola limpa.

- Fase 18 — Deploy (PREPARADO, NÃO ATIVO — 2026-07-22): `.github/workflows/
  deploy-react.yml` criado na branch. Build Vite → `upload-pages-artifact` →
  `deploy-pages`. Só dispara em `push` para `main` (+ `workflow_dispatch`) — na
  branch `react-migration` NUNCA corre, a produção continua no Vanilla. SEM
  secrets: a app não usa env — a URL e a anon key do Supabase estão hardcoded em
  `src/lib/supabase.js` (anon pública por desenho, RLS protege); o Three.js é
  import de source empacotado pelo Vite (não precisa de `public/`). Simulado o CI
  localmente: `npm ci` (76 pacotes) + `npm run build` → `dist/index.html`
  referencia `/Sistema/assets/...` (base correto). PASSOS MANUAIS do Daniel antes
  de ativar (o CI não os faz), documentados no cabeçalho do workflow: (1) Repo →
  Settings → Pages → Source: "GitHub Actions"; (2) Supabase → Auth URL config
  incluir `kamappa.github.io/Sistema/` (só p/ emails de confirmação do signUp);
  (3) merge `react-migration` → `main` (o gate; rollback = reverter o merge).

Missão 25 — estado: toda a FUNCIONALIDADE e a camada fx/motion (incl. 17b) estão
migradas e verificadas na branch `react-migration`, e o workflow de deploy está
PREPARADO mas inativo. Falta só a decisão do Daniel de ativar (os 3 passos
manuais acima) — o gate que troca o site em produção do Vanilla para o React.
Antes disso, ele deve testar a branch com a conta real (Oráculo chat/sussurro/
report + sync Supabase — o único que o headless não cobre).

## Missão 26 — Renaissance Visual sobre React (ATIVA)
(branch `mission-26/renaissance-visual`, derivada de `react-migration`)

Objetivo: dar ao Sistema uma linguagem visual própria sobre a base React já
construída. Não é uma modernização tecnológica — essa foi a Missão 25. É a
segunda passagem de direção artística, aquela em que o HUD deixa de parecer
uma grelha de cartões gerada por AI e passa a pertencer ao mesmo universo que
as Constelações, o Núcleo e o World Engine já habitam.

Pergunta que governa cada entrega desta missão:

> Isto parece um produto único chamado Sistema, ou parece uma interface
> gerada por AI?

### Missões absorvidas

Esta missão absorve três escopos que a reconciliação de 2026-07-25 deixou sem
número próprio:

- o "Ambiente Autónomo do Claude Code e Inteligência Visual" (ferramentas,
  provas, segurança de segredos) — passa a ser a **Fase 0**;
- o "Verdadeiro Sistema · Shell sem aspeto de AI Dashboard" (auditoria visual,
  design system, herói e shell, Radar e Oráculo, motion) — passa a ser o
  **corpo** das Fases 1 a 5, agora sobre React em vez de Vanilla;
- o escopo visual restante da **Missão 24** (gestos globais, profundidade/foco,
  calibração do dolly).

### Modo Estação

ESTADO: CONCEITO PRESERVADO — DECISÃO VISUAL PENDENTE

O Modo Estação (Missão 24) existe apenas no Vanilla: não foi migrado na Missão
25 e continua vivo em produção (`main`) e em `legacy/`. Não se apaga nem se
migra automaticamente. O conceito será avaliado durante as três direções
visuais da Fase 2, com três possibilidades:

- **A.** renascer como modo imersivo de navegação da nova shell React;
- **B.** ser absorvido pelo World Engine e pelos modos operacionais;
- **C.** ser retirado da interface principal, preservando apenas as ideias
  visuais e de movimento que acrescentem valor.

Nenhuma destas se implementa antes de a direção visual estar escolhida.

O Modo Estação NÃO bloqueia a baseline, a direção artística, o Preview
Deployment, a nova shell nem o design system. Se a decisão ainda não existir
quando essas peças avançarem, avançam sem ele.

### Fonte de autoridade

`docs/frontend-migration/` na íntegra, com destaque para
`03_VISUAL_QUALITY_SYSTEM.md` (pipeline visual obrigatório e critério de
força) e `09_ACCEPTANCE_GATES.md` (os seis gates). Para tudo o que toque na
presença do Oráculo: `SYSTEM-ORACLE-CONSTITUTION.md` e
`docs/oracle-governance/14_UI_UX_AND_PRESENCE.md`.

### Barreiras

- A lógica de cálculo não se toca. O motor de XP, SM-2, coreState, Solar,
  anti-farm, reversões e streaks foram auditados na Missão 25 e permanecem
  intocados. Divergência de número = bug.
- Nenhuma alteração a schemas do Supabase.
- Produção continua no Vanilla. Esta missão não ativa deploy.
- O palco WebGL não se reescreve por dogma. Só muda onde houver ganho medido.

### Fase 0 — ambiente e baseline (CONCLUÍDA 2026-07-25)

- **Ferramentas**: todas as obrigatórias operacionais e provadas. Google
  Chrome 150 instalado e adotado como browser oficial (Brave/CDP passa a
  fallback). TypeScript LSP resolvido na Fase 1 — ver abaixo.
- **Reconciliação documental**: feita (secção própria acima).
- **Baseline visual** levantada no Chrome real, com o Vite em
  `localhost:5173/Sistema/`, estados vazio e semeado (offline, sem tocar em
  dados reais). Capturas a 1440×900, 1280×800, 768×1024 e 390×844.

Medições que passam a ser o ponto de partida da missão:

| Medida | Valor |
| --- | --- |
| Altura do documento, 1440, conta VAZIA | 5685 px (6,3 ecrãs) |
| Altura do documento, 390, com dados | 9825 px (11,6 ecrãs) |
| Painéis | 19, todos `.panel` |
| Cores de borda distintas entre os 19 | **2** (18 iguais) |
| Materiais de fundo distintos | **1** |
| `border-radius` distintos | **1** (`0px`) |
| Consola | limpa (0 erros, 0 warnings) |
| CLS | 0.00 |
| Bundle bloqueante (antes da Fase 1) | 979 KB / 288,7 KB gzip |

Leitura: a identidade do Sistema existe e é forte — céu, Solar Engine,
Constelações, Títulos Reais. Está enterrada debaixo de uma casca genérica de
19 cartões idênticos numa pilha vertical sem navegação. O problema da missão
não é inventar identidade; é desenterrá-la.

Defeitos apurados (nenhum corrigido nesta fase, exceto o bundle):

- rótulo "Disciplina" do Núcleo cortado 22 px — o SVG tem
  `viewBox="0 0 320 320"` com `overflow:hidden` e o rótulo (`text-anchor:end`,
  x=43.95, largura 66) cai em −22. **Herdado do Vanilla** (`Radar.jsx:17` ≡
  `engine.js:184`), logo presente também em produção;
- o ecrã de entrada mostra `SISTEMA · FASE 1`, rótulo da fase da M25;
- contraste abaixo de 4.5:1 em várias legendas de apoio (`#4a5568`);
- `hud.css` com 791 linhas, 543 blocos e apenas **10 variáveis CSS** — não há
  tokens sobre os quais construir um design system.

Três direções visuais apresentadas (A · O Observatório, B · A Sala de
Operações, C · O Diário do Operador). Escolha do Daniel: **B como shell, A como
camada ambiental, C como modo especializado** — ver Fase 3.

### Fase 1 — fundação (PARCIAL 2026-07-25)

Executada a parte que é INDEPENDENTE da direção visual. A moldura/shell fica
retida até a direção estar escolhida, porque essa é específica da direção.

- **Bundle** (`1967fa0`): o Three.js saiu do chunk de entrada. O import de
  `stage/constellation.js` em `Constellations.jsx` era estático e arrastava o
  Three.js (675 KB) para o entry, anulando o `import()` dinâmico do
  `Stage.jsx:44` — deriva entrada na Fase 16 da M25. Passou a `import()`
  dentro do `useEffect` (onde `initConstellation` já era chamado: zero mudança
  de comportamento) + `manualChunks` a isolar o React.
  **979 → 492 KB; 288,7 → 156,6 KB gzip (−46%).** Verificado no Chrome real:
  WebGL vivo, 24 estrelas nascidas de evidência semeada, consola limpa.
- **TypeScript** (`1d89404`): `allowJs: true`, `checkJs: false`, `noEmit`.
  `src/types/domain.ts` DESCREVE o `app_state` existente — não propõe modelo
  novo. `npm run typecheck`. TypeScript fixado em **^5** e não ^7: a linha 7 é
  a reescrita nativa e não traz `lib/tsserver.js`, o que mantinha o
  TypeScript LSP inoperacional; com 5.9.3 o LSP responde.
- **Vercel** (`16d9e12`): `vercel.json` só para Preview. `--base=/` explícito
  (o `/Sistema/` do vite.config é do Pages). Produção intacta.

### Fase 2 — tokens, moldura e as duas variações (CONCLUÍDA 2026-07-25)

Lei da missão, formalizada em `src/design-system/tokens/material.css`:

> **A hierarquia faz-se com luz, não com bordas.** O elemento em foco é
> iluminado por dentro. Os restantes permanecem mate. Só existe UM portador
> principal de luz por estado.

Resposta direta ao que a baseline mediu (19 painéis, 2 cores de borda, 1
material, 1 border-radius entre todos): a hierarquia não existia porque nada
era diferente de nada.

7 ficheiros de tokens (`primitives`, `material`, `type`, `space`, `motion`,
`system`, `index`), com gate de identidade passado — os tokens só DEFINEM
custom properties `--sys-*` e o HUD ficou pixel-idêntico à baseline.

Moldura atrás de `?shell=`, com **todas as zonas montadas em permanência**: a
troca de zona é de visibilidade, nunca de montagem. `visibility:hidden` e não
`display:none`, porque este colapsaria a caixa de layout e o canvas das
Constelações passaria a 0×0. Preserva identidade React, estado local, scroll
interno por zona, efeitos já corridos e o contexto WebGL — provado marcando os
nós com `data-*` e fazendo Operações→Universo→Operações.

Duas variações construídas e comparadas com dados densos:

| Operações @1440 | B1 · Consola | B2 · Órbita |
| --- | --- | --- |
| Ecrãs de scroll interno | 4,01 | 5,94 |
| Largura do painel | 444 px | 277 px |
| Largura desperdiçada | — | 797 px |

A B2 falhou o teste de stress: a `--sys-measure` de 68ch, elegante no Núcleo,
estrangulava o conteúdo operacional. **A B2 não tinha um problema de conceito —
tinha uma medida única.**

### Fase 3 — Órbita Instrumental, B2.1 (CONCLUÍDA 2026-07-25)

Direção oficial, decidida pelo Daniel: **B2 define shell, Núcleo, cosmologia,
atmosfera, navegação e presença do Oráculo; os princípios arquitetónicos da B1
entram apenas na organização interna das zonas densas.** Não é mistura estética
— é a resposta ao número medido.

**Densidade data-driven** em `zones.ts`: `density: 'reading' | 'instrument'`
mais grupos com `weight: main | side | full`. A composição decide-se por
data-attribute no CSS; zero verificações por nome de zona no JSX.

- `reading` → Núcleo, Oráculo, Reflexão (medida editorial)
- `instrument` → Radar, Operações, Universo (largura disponível, colunas)

Operações reorganizada por função **e por apetite de largura**, apurado a
medir: prioridade (Missões + Sombras) na coluna principal, rotina (Diário +
Treino) na lateral, revisão (Revisão + Sono + Calendário) em largura total.
Duas composições anteriores ficaram acima do alvo (4,65 e 4,47) porque a coluna
lateral puxava a altura toda; mover o Sono para o grupo `full` equilibrou.

| Operações @1440, dados densos | HUD | B1 | B2 | **B2.1** |
| --- | --- | --- | --- | --- |
| Ecrãs de scroll | 5685 px de página | 4,01 | 5,94 | **3,81** |
| Painel principal | — | 444 px | 277 px | **762 px** |
| Largura desperdiçada | — | — | 797 px | **74 px** |

Dois bugs estruturais corrigidos na composição, sem editar painéis: o
`Diario.jsx` traz do HUD antigo a sua própria grelha `.cols` (1fr 1fr),
pensada para largura total — numa coluna estreita partia-se em 220px, e dentro
de um grupo `full` apanhava só uma faixa. Colapsa em `side`, atravessa em
`full`. Sai quando os painéis forem redesenhados.

**Luz de foco corrigida.** Pertencia ao contentor de largura total e pintava um
retângulo iluminado vazio. Agora pertence ao painel, com um só portador
garantido por `:not(:has(.panel:focus-within))`.

**Mobile:** a órbita da B2 mostrava 3 de 6 zonas atrás de um gesto não
anunciado. Passa a faixa de comando inferior com as 6 em grelha fixa, marcas
gravadas, alvos a 44px exatos. A identidade orbital fica no Núcleo.

**Consolidação:** B1 e B2 removidas depois de passarem os gates. Uma shell só,
atrás de `?shell=1`. Sem parâmetro — ou com valor inválido — o HUD atual
permanece intacto; a troca do comportamento por omissão é um gate à parte.

Corrigidos ainda: o rótulo `SISTEMA · FASE 1` que vazava para o ecrã de entrada
(passa a `SISTEMA · ACESSO`) e o cabeçalho de zona que roçava o Núcleo no
mobile (2px → 26px de folga).

Bundle: entry inalterado em ~114 KB gzip; CSS 15,45 KB gzip.

### Por fazer — Fase 4

O redesenho interno dos painéis. É o que falta para o mobile descer dos ~7,9
ecrãs: sete painéis desenhados para desktop numa coluna de 284px são sempre
longos, e nenhuma composição externa resolve isso. Também é aí que o `.cols`
do Diário desaparece e a regra de rede de segurança sai do `instrumental.css`.

Depois disso: a decisão do Modo Estação (A/B/C), a matriz de lacunas técnicas
(Motion, R3F, Drei, pós-processamento, Vercel) e o gate de produção.

### Fase 1 — auditoria visual real

- Inventário dos componentes React que controlam topbar, saudação, Operator
  Identity, World Shift, missões, Radar, Oráculo, calendário, treino e
  revisão.
- Matriz manter / refinar / fundir / retirar.
- Medir densidade, hierarquia, contraste, largura de texto, repetição de
  borders e custo de motion.
- Identificar o maior problema visual único, e não uma lista de vinte.

### Fase 2 — direção visual

- Três direções realmente distintas, cada uma com conceito, composição,
  centro visual, tipografia, superfícies, iluminação, profundidade, motion,
  navegação, integração do Oráculo, integração do universo, comportamento
  mobile, riscos e custo técnico.
- Comparação em desktop e mobile no browser real.
- Escolha de uma direção pelo Daniel. As restantes ficam registadas.

### Fase 3 — design system

- Tokens de luz, superfície, profundidade, tipografia, spacing, estados e
  motion, em CSS moderno sobre o Vite já existente.
- Uppercase espaçado apenas em micro-labels.
- Painéis com borda seletiva, materiais e profundidade; nunca glassmorphism
  uniforme em tudo.
- Documentação dos componentes.

### Fase 4 — shell, Radar e Oráculo

- Hierarquia do topo reescrita: identidade do Sistema, estado do Operador,
  fase temporal/climática e prioridade atual.
- Operator Identity deixa de ser um card RPG genérico.
- World Shift torna-se acontecimento do mundo, não banner.
- Radar como feed técnico compacto, temporal e operacional.
- Oráculo como presença nobre, silenciosa e contextual — não um card
  equivalente aos restantes. Estados reais (idle, thinking, speaking,
  silent), conforme `14_UI_UX_AND_PRESENCE.md`.
- Background, painéis e topbar partilham a iluminação do Solar/World Engine.

### Fase 5 — motion, universo e validação

- Motion comunica estado; sem hover gratuito nem pulso em todos os painéis.
- Motion hierarchy: fundo quase imóvel, nebulosas lentas, estrelas a
  cintilar, Núcleo a respirar, UI estável, feedback rápido, eventos raros.
- Escopo herdado da Missão 24: gestos globais entre zonas, profundidade/foco
  no voo, calibração do dolly em hardware real.
- Validação em desktop, mobile e `prefers-reduced-motion`; consola limpa;
  comparação antes/depois no browser real.

### Matriz de lacunas técnicas — a decidir nesta missão

Nenhuma destas entra por estar mencionada na documentação. Cada uma exige
benefício real, custo, risco, impacto no código atual, estratégia incremental,
ficheiros afetados e critérios de aceitação, apresentados antes de instalar.

| Tecnologia | Existe | Regra de entrada |
| --- | --- | --- |
| TypeScript | não | migração incremental com `allowJs`, nunca conversão total imediata; começa pelos tipos de domínio e adaptadores |
| Motion / Framer Motion | não | só se melhorar consistência e controlo da UI face ao `src/lib/motion.js` já portado |
| React Three Fiber | não | não substituir Three.js funcional por dogma |
| Drei | não | só quando reduzir complexidade real |
| `@react-three/postprocessing` | não | seletivo; preservar legibilidade e performance; nunca bloom sobre texto |
| Vercel | não | começa como Preview Deployment, nunca como produção |

### Gates

Os seis de `docs/frontend-migration/09_ACCEPTANCE_GATES.md`: fundação,
visual, motion, performance, dados e produção. O gate de produção é o último e
é do Daniel.

### Critério de conclusão

Um screenshot novo já não parece um dashboard AI; a shell integra-se no mundo
existente sem quebrar lógica, touch nem performance; os números continuam
idênticos aos da Missão 25; e o mobile parece produto, não versão encolhida.

### Execução — 2026-07-28 (28 commits, branch `mission-26/renaissance-visual`)

Registo do que foi feito, com o que foi **medido**, não com o que se pretendia.
Cada fase tem commits próprios; o `docs/design-references/mission-26/` tem a
biblioteca, a gramática e as decisões com alternativas rejeitadas.

**Fase 0 · biblioteca de referências** — CONCLUÍDA
50 ficheiros triados (21 mp4, 9 gif, 20 jpg), 338 frames extraídas, 30 contact
sheets. **9 analisadas a fundo**, 41 continuam `INVENTARIADO`. Cinco documentos
versionados; a pasta `local/` fica gitignored (direitos de autor, 120 MB, e não
são fonte de verdade). Achados: dois ficheiros `.gif` são PNG estáticos — um
deles era a referência da transição de zona, que **não existe**; três duplicados
por hash; 26 nomes são lixo de scraper e o sinal são os nomes das pastas.

**Fase B · tokens** — CONCLUÍDA
Cinco curvas com o ID da referência que as originou (`--sys-ease-gravity` R15,
`--sys-ease-contract` R17, `--sys-ease-breath` R19/R01), dois períodos de ciclo
e `--sys-rise`/`--sys-fall` como direção semântica.

**Fase C · Núcleo** — CONCLUÍDA
Oito estados presos a evidência real, com precedência deliberada: `critical`
ganha a tudo (é o único sobre o corpo do Operador), `insight` fica em último
(boa notícia não tapa aviso). **7 dos 8 verificados em uso**; `dormant` é
inalcançável pela shell por desenho. Corpo volumétrico com halo, não contorno.

**Fase D · Oráculo** — PARCIAL
Ambient feito: sigilo de onda derivado da R01 (não da esfera R19, que é o
cliché do assistente de AI), com amplitude função de sinais reais — silêncio
0,7px de pico, quatro sinais 11,7px. Active feito: briefing que diz o que o
Oráculo já sabe, com a evidência de cada linha, antes do campo de escrita.
**War Room continua maqueta**, rotulada como tal.

**Fase E · identidade** — CONCLUÍDA
Rank como manómetro (R25): letra ao centro, anel com `rankFrac`, rótulo com o
destino. Avatar substituído por sigilo procedural de seis vértices derivado dos
níveis reais — decisão do Daniel entre três opções; `avatar.js` **não foi
apagado**.

**Fase F · Operações** — CONCLUÍDA
Sete painéis. Missões, hábitos, métricas, calendário e revisão passam de caixas
a instrumentos. Zona mede **4,52 ecrãs** com 5 missões.

**Fase G · Universo** — CONCLUÍDA
Céu reescrito: fbm de 5 oitavas com ruído *ridged* e domain warping, mais camada
contínua de gás. Estrelas com leque de tamanho 2,3× e difração que **nunca tinha
desenhado nada** (o braço morria mais perto do centro que o núcleo). Painéis e
atributos na mesma língua.

**Fase H · varredura** — CONCLUÍDA
Últimas molduras herdadas do HUD. Campos de entrada mantêm contorno de propósito:
é afordância, não decoração.

**Fase I · estados de sistema** — CONCLUÍDA
Vazios como convite. **Duas mentiras estruturais corrigidas**, e são os achados
mais sérios da missão: o `sync` existia desde a M25 e nunca foi mostrado; o
`loadOracleData` tinha `catch (e) {}` e uma falha de rede disfarçava-se de "não
há notícias". Toast reposicionado — tapava o Núcleo, precisamente no momento em
que havia algo para mostrar.

**Fase J · mobile e a11y** — PARCIAL
Medido a 390×844: transbordo 129→6px, alvos de toque 9→0 abaixo de 32px. Zonas
passam a `role="region"` com nome; `inert` nas inativas já funcionava, com zero
fugas de teclado.

**Fora de fase · PWA** — CONCLUÍDA
O Vanilla era instalável e a migração da M25 perdeu isso. Manifest, ícones e
service worker que guarda a **shell e nunca os dados** — servir dados em cache
mostraria o Sistema de ontem como se fosse o de hoje.

### Fase 5 — resolvida sem intervenção estrutural

As três opções (vista "Hoje" / grupos / índice) deixaram de se justificar: a
recomposição da Fase F trouxe Operações a 4,52 ecrãs por densidade. Os grupos já
existiam desde a Fase 3. Reabre-se se passar dos 5 ecrãs com dados reais.

### Fase 5 · segunda passagem — Command Core composto (CONCLUÍDA 2026-07-29)

A Fase 5 tinha sido fechada por medição (acima). O Daniel reabriu-a com um
diagnóstico novo, e este é diferente do anterior: já não é densidade, é
**composição**. *"O conteúdo foi espalhado pelo viewport, mas ainda não foi
composto como um único instrumento."*

**O que mudou, e é estrutural.** O Núcleo deixou de ser uma zona `reading` com
quatro painéis empilhados e passou a zona `instrument` com duas naturezas de
informação e razão de colunas própria:

- **ESTADO** (esquerda) — saudação, Operador, mundo, horizonte. Lê-se.
- **AÇÃO** (direita) — Próxima Ação, decisão, fila. Executa-se.

**A Próxima Ação** é um read model novo (`src/app/core/next-action.ts`) que
implementa a precedência de produto fechada pelo Daniel — vencida/urgente →
em curso → pilar de hoje → decisão pendente → briefing → nada crítico — com
desempate determinístico (prazo → já iniciada → mais antiga → id). **Não é uma
regra de domínio nova**: lê o estado que já existe e herda o limiar de 2 dias do
`DeadlineBanner` em vez de inventar um seu.

**O que saiu.** O `DeadlineBanner` sai do Núcleo (o componente fica — o HUD de
produção usa-o); a proposta de arco sai do painel World. Nada se perdeu: as
missões urgentes viraram o visor, os eventos viraram o Horizonte, a decisão
ganhou cabeçalho e três saídas alinhadas em vez de três botões a flutuar.

**Medido, a 1440×900, conta semeada com 5 missões abertas, 2 eventos, arco por
decidir e burnout a 85%:**

| Medida | Antes | Depois |
| --- | --- | --- |
| Altura da zona | 975 px em 621 | **794 px em 621** (1,28 ecrãs) |
| Equilíbrio das colunas | — (uma coluna) | 612 / 720 px |
| Corpo da ação dominante | não existia | 34,6 px, contra 28 px do nome da zona |
| Portadores de luz | 2 (faixa vermelha + painel) | **1** (o visor) |
| Falhas WCAG AA na zona | 12 em 58 elementos | **0 em 58** |
| Alvos de toque < 32 px | 2 | **0** |
| Animações sob `reduced-motion` | 12 | **0** |
| Transbordo horizontal | 0 | 0 |
| Erros de consola | 0 | 0 |

Verificado a 1440×900, 1280×800, 768×1024 e 390×844, em Chrome headless com
**perfil isolado** — a sessão Supabase real do Daniel vive no perfil normal, e
clicar num botão desta zona escreveria no estado dele.

**Conta vazia:** "quatro zeros parecem loading" resolvido na origem — um valor
sem registo mostra travessão, não zero, e o `setNum` só assume quando há valor.
Nível 1, XP —, streak —, missões —. A zona cabe (28 px de corte).

**Quatro defeitos anteriores apanhados por medição**, nenhum introduzido nesta
fase: a guarda de `prefers-reduced-motion` nunca apanhou pseudo-elementos;
`.sys-group-name` estava a 3,23:1 desde a Fase 3 (a auditoria da Fase J deu
"zero falhas" porque não compunha opacidades sobre o fundo — o número era
otimista, o método é que estava errado); o estado de gravação tapava a faixa de
comando em mobile; e dois comentários do `instrumental.css` tinham dentro a
ajuda do `at.exe`, escrita por interpolação de shell numa sessão anterior.

Detalhe, alternativas rejeitadas e origens visuais em
`docs/design-references/mission-26/DESIGN-DECISIONS.md`.

### Fase 6A + 6B(voz) + 7(motor) — Sistema Vivo, fundações (2026-07-29)

O Daniel abriu a **Fase 6 — Sistema Vivo** (13 subsistemas) e a **Fase 7 — Arc
Engine + Corpo e Recuperação** (23 secções) no mesmo pedido. Esta sessão
entregou as **fundações de que tudo o resto depende**, verificadas; o restante
está listado em "Por fazer da Fase 6/7" e **não** foi começado.

**Voz do Oráculo no Command Core** — CONCLUÍDA
A coluna da ação continua a ser instrumento do Sistema. Interpretação,
prioridade explicada, risco e decisão sugerida ganham atribuição explícita, com
o sigilo R01 e o rótulo em mono. O read model recusa repetir factos que o visor
já mostra; cada fala traz a condição que a produziu.

**Fase 6A · motion e eventos** — CONCLUÍDA
Regime de movimento em `<html data-motion>` a partir de quatro sinais.
`paused` congela em vez de desligar. Fila de eventos com deduplicação,
contador, dispensa e pausa ao ler — o toast do HUD é um elemento único e
**perdia o primeiro de dois eventos seguidos**. O evento passa a nascer depois
da escrita, e isso é estrutural: quem emite encena, o `save()` publica.
O `localSave` deixou de engolir a exceção.

**Fase 7 · Arc Engine** — MOTOR CONCLUÍDO
Read model único; a shell passa duas cores e uma direção ao CSS. O Bloom Arc
são quatro linhas de CSS e nenhum componente novo — verificado no browser.
`milestone`/`climax`/`archived` ficam declarados e inalcançáveis: o domínio não
tem onde guardar um marco.

Medido em perfil Chrome isolado (a sessão real do Daniel vive no perfil normal
e um clique escreveria no estado dele):

| Medida | Resultado |
| --- | --- |
| Missão concluída | +150 XP, Sombra criada, estado escrito, visor recalculado |
| Dois pilares seguidos | dois anúncios (antes: um) |
| Três emissões com a mesma chave | uma entrada |
| Ordem | causa antes da consequência |
| Contraste WCAG AA, com arco ativo | 62 elementos, **0 falhas** |
| Alvos < 32 px | 0 |
| Animações sob `reduced-motion` | 0 |
| Transbordo horizontal (4 resoluções) | 0 |
| Erros de consola | 0 |
| Build | passa · JS 1,03 MB / 292 KB gzip |

### Fase 8 · Reflexão — Observatório Interior (CONCLUÍDA 2026-07-29)

A zona prometia memória, debrief e aprendizagem e entregava quatro
interruptores. Passa a sete leituras em duas colunas — observação e memória —
com a interpretação curta do Oráculo. "Inimigos internos" saiu; o binário ganhou
tempo (última ação, frequência no registo) sem inventar uma escala que ninguém
registou. 74 elementos, zero falhas de contraste.

### Fase 7 · Corpo e Recuperação (CONCLUÍDA 2026-07-29)

Subespaço full-screen dentro de Operações — a órbita continua com seis marcas.
Reúne Treino, Sono, Pavimento Pélvico e Mandíbula/Pescoço, ligados pelo estado
de recuperação (sono + carga). Sessão guiada com demonstrações SVG originais,
temporizador que congela em pausa, e registo só por confirmação. **Sem regra de
XP nova** — verificado: `totalXP` igual antes e depois.

Conteúdo de saúde com **fonte oficial, data de revisão e divergência entre
fontes registada**; ver `DESIGN-DECISIONS.md`. O que não tinha fonte não entrou.

### Fase 6B · Relatório do Oráculo por camadas (CONCLUÍDA 2026-07-29)

A parede de texto era de forma, não de conteúdo. **O relatório já chega
estruturado** — `report.report` é JSON com campos nomeados — por isso não houve
parser nenhum, nem `dangerouslySetInnerHTML`, nem heurística de emojis.

Sete camadas, com o resumo e o alerta sempre abertos e a análise integral
recolhida. Valor novo: **cada sinal do Oráculo tem ao lado a evidência local do
Sistema** — quando não coincidem, vê-se. A análise completa percorre o objeto
inteiro, por isso um campo novo da Edge Function aparece em vez de desaparecer
(verificado com um campo inventado: os 14 aparecem). 82 elementos, zero falhas.

### Fase 7 · Preview e cerimónia do Summer Arc (CONCLUÍDA 2026-07-29)

Mapa temporal, domínios com multiplicador real, o que aceitar faz (as 4 missões
com nome e domínio), o que acontece se ignorar, e a pergunta do arco. Sigilo
**procedural** — um desenho, quatro arcos, com o comprimento e a inclinação dos
raios em função do fluxo do motivo.

**A cerimónia só começa depois de a escrita passar**: `arcAccept` devolve o
resultado da gravação; se falhar, não há sigilo a formar-se, há uma mensagem a
dizer que não ficou guardado. Verificado ponta a ponta: `worldArc` null →
active, missões 6 → 10, e o mundo fica com a camada da estação ao fechar.

### Fase 7 · Treino em fluxo guiado (CONCLUÍDA 2026-07-30)

Sessão guiada de calistenia com três contagens distintas, cinco resultados com
nome (em vez do `OK`, que não dizia se era dificuldade, execução, dor ou
qualidade), demonstrações por exercício, descanso de 90 s contado, e um resumo
que mostra linha a linha o que vai ser gravado e prediz o que sobe de passo.

**Dor não promove:** "dor/desconforto" e "demasiado difícil" mapeiam para
`feel: 'd'`, e o domínio já recusa avançar com esse valor. Não é regra nova.

**Registo rápido** continua a existir — o painel antigo, inteiro. A preferência
fica em `localStorage`, porque é escolha de interface e não dado do Operador.

Verificado: sessões 8→9, progressão `push` 4→5 com 14 reps contra alvo 10,
+51 XP, pausa congela o relógio, 41 elementos sem falha de contraste.

**Bug apanhado por medição:** o anúncio de evento ficava por baixo do overlay do
Corpo e Recuperação — `elementFromPoint` no centro do cartão devolvia
`bs-r-meta`. A shell cria contexto de empilhamento e um filho não sai dele. Um
evento invisível é indistinguível de um evento que não aconteceu.

### Fase 6C · Universo — campo celeste (SUPERADA 2026-07-30)

> **Este registo descreve código que já não existe.** O `CelestialField` foi
> removido na reconstrução do mesmo dia — ver *Fase 6C bis* mais abaixo. Fica
> aqui porque é a origem das decisões que sobreviveram (a inversão, o raio
> igual entre pares, a órbita externa) e porque apagar um estado anterior
> apagava a razão de o seguinte existir.

A inversão: o campo abre a zona, a lista de seis barras desce para instrumento
secundário. Núcleo ao centro (tamanho pelo nível global, cor pelo rank), seis
domínios em órbita de **raio fixo** — são pares, e pôr o mais forte mais perto
sugeriria uma hierarquia que não existe; o que varia é a massa. Órbita externa
com títulos e conquistas, cheios quando provados.

**Assinaturas de movimento** com a mesma gramática física, uma por domínio, e
só a do domínio **selecionado** anima. **Sigilos paramétricos** gerados de um
hash do id — não classifico por domínio porque o `ACH` não guarda domínio.

**Rótulo cortado do radar: FECHADO.** Defeito da Fase 0, herdado do Vanilla e
presente em produção. A correção abre a janela do `viewBox` e não mexe na
geometria, por isso não pode introduzir divergência de números.

### Fase 6C bis · Universo — reconstrução em sete passagens (CONCLUÍDA 2026-07-30)

O Daniel devolveu a primeira montagem com um veredicto que estava certo:
"demasiado segura, demasiado contida e demasiado pouco transformadora". Era
uma ilustração do estado, não um sítio onde se entra. A reconstrução aconteceu
em sete passagens, cada uma com o seu commit.

**Não foi um redesenho contínuo.** A composição foi aprovada ao fim da segunda
passagem e não voltou a mexer-se; da terceira em diante o trabalho foi dar-lhe
comportamento.

#### 1 · Uma cena, três escalas (`dce18ee`)

Deixa de haver vistas. Há **um** contexto 3D e uma câmara que se aproxima:
`overview`, `domain` e `core` são a mesma realidade a aprofundar-se,
interpolando uma `transform`. O Núcleo está **atrás** do plano dos domínios, por
isso chegar lá é atravessar o céu — é isso que faz dele um destino e não um
logótipo ao centro.

Profundidades: poeira −1400, nebulosa −1000, **Núcleo −520**, anéis −120,
territórios 0, satélites +90.

Verdade dos dados: posições por hash FNV-1a, nunca `Math.random()` — a mesma
evidência dá sempre o mesmo céu. Cada nível provado é uma estrela; o XP do
nível em curso é uma estrela a formar-se, a única que pode recuar.

Composição, tudo medido e não estimado:

- domínios numa **elipse 2:1** (= cos 60°, a inclinação dos anéis) em vez de
  círculo — 6 de 6 rótulos dentro do enquadramento, zero sobreposições;
- o HUD passa a **coluna ao lado do visor**; em ecrã estreito a cena recua e
  cada um fica com a sua faixa;
- **máscara nos quatro bordos**: o céu deixa de acabar numa aresta;
- camadas profundas com `inset` negativo — a nebulosa acabava a meio do céu
  porque a perspetiva encolhe uma camada a −1000px para 52%. O fator é
  1100/(1100+|z|);
- **o rank deixa de pintar a matéria do Núcleo** (rank S punha-o dourado);
- a leitura do Núcleo sai da cena para o HUD: à escala de chegada ficava fora.

Os sigilos de conquista saem do céu — a 22px liam-se como autocolantes — e
entram no painel Conquistas, onde têm tamanho. O emoji e o cadeado saem de lá.

**Erro registado:** sem GPU a zona media 33ms e concluí que a culpa era das
camadas ambiente. A bissecção mostrou que só esconder a cena inteira mudava
alguma coisa — o custo era **compor a subárvore 3D por software**. Com GPU:
8,3ms medianos.

#### 2 · Vida, orientação e reação (`0a6de99`)

- **Máquina de estados** (`universe-states.ts`) com transições declaradas numa
  tabela, em vez de três flags soltas que davam oito combinações das quais
  metade não fazia sentido.
- **Ambiente medido, não afirmado:** em 3,2s mexeram-se as sete camadas
  instrumentadas. Períodos 52/71/86/96/149/227s — nenhum múltiplo de outro, por
  isso o conjunto nunca se repete numa sessão. Estrelas cintilam 1 em 4.
- **Núcleo vivo:** três conchas de filamentos com rotação diferencial em
  sentidos opostos, matéria em órbita, ejeções raras, quatro estados. Cada
  camada é um `<svg>` próprio e quem roda é o **elemento** — animar um `<g>`
  dentro de um SVG repinta o desenho inteiro, e foi isso que pôs a chegada a
  50ms na passagem anterior.
- **Gravidade do cursor:** duas custom properties escritas num rAF, com
  inércia, deslocamento por profundidade. O React não participa.
- **Assinaturas:** seis domínios que só se distinguissem pela cor eram seis
  etiquetas. Ofício alinha, Saber ramifica, Corpo pulsa, Mente converge,
  Vínculos aproxima e liga, Disciplina sincroniza. Verificado como seis
  desenhos genuinamente diferentes.
- **Protoestrela** em quatro fases (poeira → difusa → a condensar → quase
  formada), existente mesmo a 0% — a diferença entre "não comecei" e "estou a
  meio" era invisível.
- **Evento em sete tempos**, provado por medição: a partícula foi amostrada em
  (1008,127) → (877,301) → (862,321), monótona até ao destino.
- **Pausa:** zona inativa ou tab escondida → 43 animações em `paused`.

**Dois defeitos apanhados:** um `@keyframes` que anima `transform` **substitui**
o transform do elemento — a deriva da poeira estava a apagar o
`translateZ(-1400px)` e a gravidade do cursor. E no mobile o rótulo de Mente
ficava **por baixo** do título do HUD: `elementFromPoint` no centro do alvo
devolvia `.us-hud-t`, ou seja o domínio existia e não se podia tocar.

#### 3 · A escala 4 — dentro do Núcleo (`b518c1f`)

Chegar ao Núcleo era dramático e não pagava. A resposta estava na aritmética do
próprio motor: `overallLevel` é a soma dos seis níveis menos cinco, portanto o
Núcleo **é** a soma e pode ser decomposto.

Seis veios entram no corpo pelo ângulo do respetivo domínio. A espessura é a
contribuição, verificada: o *share* implícito bate certo com o real até à
quarta casa decimal nos seis, e os números desenhados somam 69 = a soma dos
níveis no estado.

O arco de rank fecha à volta — **mas no rank S não há arco** e a leitura diz
porquê: o último rank tem `max: 9999`, que é um sentinela de código, e uma
barra a 0,4% seria o Sistema a afirmar que quase não há progresso quando o que
não há é banda definida.

**Três erros de escala meus**, corrigidos e registados no código: faltava-me o
fator da **perspetiva** (1,31 à chegada) na conta da escala; os rótulos estavam
em cima dos veios; e centrado, o desenho ficava por cima da coluna de leitura.

#### 4 · O rank passa a existir (`f328baf`)

`kind: 'rank'` estava declarado na fila desde a Fase 6A e **nunca foi emitido
por ninguém**. `addXp` passa a comparar `rankOf(overallLevel)` antes e depois. A
descida também se anuncia, como aviso.

`RANK_EVENT` é a única transição que ignora onde o Operador estava: sai-se
sempre para a vista geral, porque é de lá que se vê que o mundo ficou maior — a
lógica do NASA Eyes, referência dada pelo Daniel.

Cerimónia medida frame a frame: escala 1,00 → 0,26 → **0,18 (o silêncio)** →
1,35 → 1,55 → 1,13 → OVERVIEW.

**Bug:** o Universo lia só a cabeça da fila. A fila é do *anúncio* e ordena
causa antes de consequência, por isso a missão fica à frente e segura o lugar 7
segundos. Reagir ao mundo e anunciar ao Operador são coisas diferentes.

**Afirmação minha corrigida:** escrevi que "a massa nova fica" apontando para o
`scale(1.12)` final. Não fica — medido, o corpo volta a 0,985. O que fica é
`coreMass = nívelGlobal/40`, que subiu.

#### 5 · Câmara manual (`c42367f`)

O estado manda na **escala**; o gesto produz um **desvio** somado por cima. Duas
consequências deliberadas: arrastar nunca troca de escala, e a roda acumula
desvio em z e **compromete** uma transição ao passar um limiar. O gesto é
contínuo, o destino é discreto.

**Três defeitos:** os limites eram escolhidos e não calculados (com 260×150 o
domínio do topo ficava clipado e inalcançável); a pinça não tinha trava de
compromisso e um gesto atravessava duas escalas; e a roda **prendia a página** —
a cena ocupa 558px de um contentor com 2620px de conteúdo por baixo. Passa a
exigir Ctrl/⌘, como qualquer mapa embebido.

#### 6 · Uma cerimónia de cada vez (`28464db`)

O ARISE escurece o ecrã a 60% durante 2,65s e caía por cima do momento que o
Universo existe para mostrar. Cede o palco quando o Universo está ativo
(`data-sky-live` no `<html>`), e **só onde há substituto**: no Núcleo aparecem
278 frames de "A R I S E"; no Universo, zero.

As conquistas **não** cedem, pela mesma razão pela outra ponta: uma conquista é
um facto que o céu não mostra de forma legível — o satélite dela é um ponto de
4px no bordo.

**Regressão minha, do commit anterior:** ao ligar `kind: 'rank'` à fila, o rank
passou a ser anunciado por dois sistemas ao mesmo tempo — o SYSTEM EVENT e o
toast antigo do `rankCeremony`. É a avaria que a fila foi criada para resolver
na Fase 6A. O toast saiu; a reação ficou.

#### 7 · A escala 3 — o que alimenta o domínio (`5f9a6ca`)

**Decisão de dados tomada pelo Daniel** (concordância dada por "continua",
depois de o custo ter sido apresentado duas vezes).

`plog` ganha um quarto argumento opcional `attr`. Doze dos treze sítios passam
o domínio; o título real fica sem, porque não tem um domínio só.

O que esta vista **não pode ser**: "que evidência fez a sétima estrela de
Saber". Não é sabível — os níveis vêm de XP acumulado ao longo de meses e o
registo guarda catorze entradas. O que é sabível é o que alimenta o **nível em
curso**, que é a única parte em formação e a única sobre a qual há decisão a
tomar hoje.

As entradas antigas ficam sem `attr` para sempre e a leitura **conta-as e
declara-o**. `EVIDENCE_FOCUS` não muda a escala da câmara: o que há para revelar
é texto, e o texto vive no instrumento.

#### Estado verificado no fim das sete passagens

| | |
|---|---|
| Custo (GPU), repouso e hover | 8,3 ms medianos · p95 8,5 |
| Contraste | 115 elementos · 0 falhas AA · 0 alvos pequenos |
| Reduced motion | 0 animações; câmara continua a chegar; assinaturas continuam desenhadas |
| Enquadramento | 6/6 domínios · 0 sobreposições · desktop e mobile |
| Evidência real | 75 → 76 estrelas, nos dois tamanhos |
| Interior do Núcleo | 494×494 em 1338×558; conta 69 = 69 |
| Consola | 0 erros |

#### O que fica declarado como não existente

- **Que evidência fez cada estrela já provada.** Não é sabível e não passará a
  ser; ver a passagem 7.
- **Requisitos de evidência por rank.** O domínio tem um só critério e é
  aritmético — já estava dito na Fase 6D e continua.
- **Atribuição das entradas de registo anteriores a 2026-07-30.** O campo é
  novo; essas entradas não têm dono e a leitura di-lo.

#### Correção de proveniência

Atribuí a **R23** uma imagem de galáxia espiral violeta que o Daniel enviou no
chat. R23 é `03-universe · primavera`, um vídeo de 15s do catálogo, e não tem
nada a ver. A imagem existe e foi vista; o número é que não existia. Corrigido
no cabeçalho de `Nucleus.tsx` — pôr um número de referência numa imagem que veio
do chat é inventar uma proveniência.

Referências do catálogo efetivamente usadas nesta reconstrução: **R14** (feixe
de filamentos branco-violeta, densidade em vez de contorno, ponta luminosa em
cada filamento — rejeitado o bloom a 100%) e **R13** (anéis inclinados como
fonte de profundidade — rejeitado o HUD ciano e a marca de água).

### Fase 7Z · Capacidades de arco (CONCLUÍDA 2026-07-30)

Decisão formal do Daniel implementada. `milestone`, `climax` e `archived`
saíram da união `ArcState` e passaram a `ArcGatedState` — um tipo que nenhuma
função devolve e nenhum componente recebe. **Devolver um deles deixou de
compilar**, o que substitui um comentário por uma garantia.

`ARC_CAPABILITIES` está congelado e cada entrada declara porque a capacidade
não existe, e não apenas que não existe. Verificado por ausência: zero
ocorrências dos três em `src/` fora do `arcModel.ts`.

Duas correções que a revisão obrigou: `preview` saiu da união por ser fase de
interface e não estado de ciclo de vida; e ficou escrito que `accepted`, embora
disponível, é produzido pela cerimónia e não por `arcState()` — o que se
persiste é `status: 'active'`.

### Fase 7Z · Pavimento Pélvico — um sítio, um modelo (CONCLUÍDA 2026-07-30)

Decisão formal implementada. "Pavimento Pélvico" aparecia **duas vezes** no
mesmo subespaço — quinta linha do formulário de treino com progressão e XP, e
rotina guiada sem XP. Saiu a linha do formulário: verificado, de 2 ocorrências
para 1.

Dados preservados: `S.training.prog.kegel` e o `lines.kegel` histórico ficam
intactos (`progKegel: 1` antes e depois). Zero alterações a schema.

A taxonomia passou para os dados (`PelvicKind`), o relaxamento passou de
ressalva a exercício, e "coordenação respiratória" **não** foi criada: as fontes
tratam-na como técnica transversal, não como exercício, e inventá-la era
conteúdo de saúde sem fonte.

### Fase 7Z · Referências animadas — fechadas (CONCLUÍDA 2026-07-30)

As trinta animadas (R01–R30) estão TODAS abertas. Contagem: **30 abertas · 18
por abrir · 2 inválidas**, total 50. As 18 por abrir são todas estáticas e
ficam registadas como não vistas — nenhum ficheiro conta como visto sem ter
sido aberto, e a contagem di-lo em vez de o esconder.

Repartição das 30: 15 analisadas, 8 parcialmente úteis, 4 anti-referências, 1
rejeitada, 2 duplicadas por hash (R12=R14, R22=R23, não reabertas).

Quatro anti-referências, e duas estão arquivadas exatamente onde alguém as vai
procurar: R16 é **um olho** na pasta do Oráculo, R09 é uma **moldura com neon
roxo** na pasta de identidade. Daí a gramática 14 nova — uma anti-referência
tem de ser marcada no sítio onde está, não só numa lista à parte.

A gramática 11 foi corrigida: dizia que a referência da transição "não existe".
Estava certa quanto a não haver vídeo e incompleta quanto à conclusão — R27 é
uma imagem, foi aberta, e tem conteúdo utilizável na paleta exata do Sistema.

Nota de método registada no mapa: as folhas por CATEGORIA estão incompletas (a
de universe mostra 3 frames para 27 ficheiros). A triagem útil é a folha de
contacto individual de cada referência.

Zero alterações a código — condição explícita do Daniel.
### Fase 7Z · Performance mobile — medida (CONCLUÍDA 2026-07-30)

**O QUE ESTES NÚMEROS SÃO, e é a primeira coisa a dizer:** Chrome desktop a
emular 390×844 com DPR 2. O CPU e a GPU são os desta máquina. Servem para
comparar cenários entre si e para apanhar regressões — **não são FPS de
dispositivo real** e não prometem 60 FPS ao Daniel num telemóvel.

Duas passagens, e a distinção não é pedantismo: nesta missão já confundi as
duas uma vez e cheguei a uma conclusão errada sobre a causa de um custo.

| cenário | GPU (real) | sem GPU (limite inferior) |
|---|---|---|
| shell em repouso | 8,3 ms · p95 8,4 | 16,7 ms · p95 16,8 |
| troca rápida de 4 zonas | 8,3 · p95 8,4 | 16,7 · p95 16,8 |
| Universo overview | 8,3 · p95 8,4 | 16,7 · p95 16,7 |
| Universo domínio | 8,3 · p95 8,4 | 16,7 · p95 16,7 |
| Universo Núcleo (escala 4) | 8,3 · p95 8,4 | 16,7 · p95 16,7 |
| Oráculo ambient | 8,3 · p95 8,4 | 16,7 · p95 16,7 |
| Reflexão | 8,3 · p95 8,4 | 16,7 · p95 16,7 |

**Zero frames acima de 33 ms e zero long tasks em todos os catorze cenários,
nas duas passagens.** Memória: 23–27 MB de heap JS. Zero erros de consola.

Sistemas ativos por cenário: 64 animações no shell, 102 no Universo em
overview e domínio, 125 na chegada ao Núcleo (as camadas do interior). 11
elementos com `filter`, **zero com `backdrop-filter`** — o que confirma que a
proibição de `filter` em área grande está a ser respeitada.

**DPR: o canvas NÃO segue o `devicePixelRatio` de 2.** Medido: o canvas
principal tem backing store 390×844 para uma caixa CSS de 390×844 (DPR 1), e o
das Constelações tem 513×588 para 342×392 (DPR ~1,5). Não sei dizer se é
limitação deliberada ou omissão — está medido, não julgado, e fica como item
para quem tocar no palco.

**Tab escondida:** o Universo pausa (0 animações suas). As 64 do shell continuam
com `playState: running`. Não é necessariamente uma fuga — o browser estrangula
o render quando a tab está oculta — mas **não foi medido** se há trabalho real a
acontecer, e por isso não é afirmado que não há.

**NÃO MEDIDO, dito por extenso em vez de inferido:** tempo até interação (a
sonda falhou e o valor saiu `null`); Conselho, War Room e Oráculo Thinking
sob carga; tier lite; e o comportamento em hardware móvel verdadeiro.

**Nenhuma otimização foi feita**, porque a medição não encontrou nada que a
justificasse. Otimizar sem número é adivinhar.
### Fase 7Z · Validação do Oráculo — parcial, e o que falta está dito (2026-07-30)

**Um defeito real corrigido.** O campo de pergunta tinha só `placeholder` e
nenhum nome acessível. Um placeholder não é um nome: em vários leitores de ecrã
não é anunciado como o nome do campo, e desaparece à primeira letra — quem
estiver a rever o que escreveu deixa de saber onde está. Passou a ter
`aria-label`.

E resolveu-se o que estava mais estranho à volta dele: sem sessão, o botão está
corretamente `disabled` (verificado: `disabled: true`, opacidade 0,4, cursor
`not-allowed`) mas o **campo aceitava texto**. Escrevia-se uma pergunta inteira
num sítio de onde ela nunca ia sair, e a explicação vivia noutro bloco da
página. Agora está presa ao campo por `aria-describedby`, e diz o que importa:
*"o que escreveres aqui não é enviado nem guardado"*.

**Dois falsos positivos meus, registados porque o método interessa.** A primeira
sonda deu "o botão aceita clique e não faz nada" — era um botão `disabled`, que
não dispara, e eu tinha assumido em vez de verificar o atributo. E deu "o sigilo
não anima" — o seletor apanhou um `<svg>` filho em vez do `<span>`; há **quinze**
elementos com `sigil` no nome e três é que são o sigilo. É o mesmo erro de
seletor que já tinha cometido nesta missão.

**Validado offline:** AMBIENT (sigilo presente, `sys-sigil-breath` a correr nos
três), foco de teclado a percorrer a zona, Escape sem deixar foco preso, live
region `polite` presente, zero erros de consola, 115 elementos sem falhas de
contraste AA.

**NÃO VALIDADO, e é a parte que precisa da conta real:** LISTENING, THINKING
(início, fim em sucesso, fim em erro, não ficar preso, não reaparecer),
RESEARCHING, INSIGHT, WARNING, CONSELHO com contexto, e o WAR ROOM — que offline
nem sequer aparece, por estar atrás da sessão. Duas perguntas consecutivas,
cancelamento e erro de rede também ficam por validar: sem sessão não há pedido
para cancelar nem para falhar.

Zoom 200% e mobile: as sondas correram, mas os estados que interessava ver a
200% são os que precisam de sessão. Fica por fazer.
### Fase 7Z · Auditoria à conta real — executada, read-only (2026-07-30)

Corrida no Chrome do Daniel, com a sessão real (`sync: ok`), em `localhost:5173`.
**Zero escritas.** As zonas ficam todas montadas por desenho, e isso permitiu ler
o Universo, o Núcleo e o Oráculo **sem um único clique** — nem sequer navegação.

**A conta real é quase nova, e é isso que a torna valiosa:** os seis domínios a
nível 1, 19 XP total, 11 objetivos, zero sombras, zero sessões de treino, zero
títulos, `worldArc: null`. A minha semente tinha 12/19/8/14/5/11 e 48 210 XP. O
estado inicial nunca tinha sido visto por nenhuma vista da Missão 26.

#### O defeito da primeira lei

**O céu afirmava "ESTRELAS: 6" numa conta onde nada foi provado.**

`fresh.js` cria os seis domínios a nível 1 com 0 XP: o nível 1 é **dado**, não
conquistado. Com `count = max(0, level)`, cada domínio gerava uma estrela
consolidada de origem — seis provas que ninguém deu, contra a lei "nada nasce do
nada: uma estrela tem de ter trigger, origem, data e evidência".

**Contra a minha semente isto era invisível.** 69 níveis contra 63 ganhos não
salta à vista. Numa conta nova, 6 contra 0 é a diferença entre "provaste seis
coisas" e "ainda não provaste nada".

Corrigido: `count = max(0, level − 1)`. A primeira estrela nasce ao chegar ao
nível 2. Verificado na conta real: o HUD passou a dizer **0 estrelas**.

**E a conta do Núcleo ficou melhor do que estava.** `overallLevel` é
soma(níveis) − 5, que com seis domínios é exatamente soma(nível − 1) + 1: cada
domínio entrega o que **ganhou** acima do ponto de partida, mais um de base. Os
veios passaram a desenhar o ganho. Verificado com a semente rica: os seis ganhos
somam 63, mais um dá 64, que é o nível global — a conta fecha, e a
proporcionalidade das espessuras é exata.

#### Dois defeitos de texto, só visíveis com dados reais

- **"Maior streak: 1 dias"** — plural errado. Com a semente o streak nunca era 1.
- **"Já começasteaberta há 24 dias"** — dois `<span>` inline sem separador.
  Passou a "Já começaste · aberta há 24 dias".

#### Três falsos positivos meus, registados porque o padrão importa

1. "O botão Enviar aceita clique e não faz nada" — era um botão `disabled`, e eu
   não tinha lido o atributo.
2. "O sigilo do Oráculo não anima" — o seletor apanhou um `<svg>` filho. Há
   quinze elementos com `sigil` no nome; três é que são o sigilo.
3. "O War Room não está montado" — está, mas vive no painel lateral do Oráculo
   (`OraclePresence`) e não numa zona. A minha sonda procurou nas zonas.

O padrão é o mesmo nos três: **assumi onde a coisa estava em vez de verificar**.

#### Confirmações

- `logComDominio: 0` nas 14 entradas do registo real — exatamente o que a escala
  3 prevê e declara por extenso. A forma é `{text, gain, d}`, que o read model lê.
- `live: "false"` no Universo com a zona inativa: a pausa funciona com dados reais.
- O campo do Oráculo tem `aria-label` e o botão está ativo **com** sessão
  (`disabled: false`) — a correção de acessibilidade funciona nos dois estados.
- Contador do Oráculo: 12/12 disponíveis hoje.

#### O que a auditoria NÃO cobriu

As **duas perguntas ao Oráculo autorizadas não foram gastas.** O valor delas é
visual — ver THINKING começar, terminar e não ficar preso — e isso tem de ser
visto pelo Daniel no ecrã dele, não medido por mim numa sonda. Ficam autorizadas
e por usar.

Por consequência continuam por validar: LISTENING, THINKING, RESEARCHING,
INSIGHT, WARNING, CONSELHO com resposta real, e o War Room com o painel aberto.
### Fase 7Z · Referências — biblioteca fechada, 50 de 50 (CONCLUÍDA 2026-07-30)

**Zero pendentes.** 30 animadas (R01–R30) + 20 estáticas (S01–S20).

Correção de uma contagem minha: "30 abertas · 18 por abrir · 2 inválidas" era
dupla contagem — as duas inválidas já estavam dentro das 30, e as estáticas
eram 20. O total sempre foi 50.

Os IDs das estáticas foram determinados por **resolução + categoria**, com um
leitor de cabeçalho JPEG/PNG. Zero duplicados por hash em toda a biblioteca.

Estáticas: 6 analisadas · 5 parcialmente úteis · 7 anti-referências · 2
rejeitadas. Duas das analisadas são **paletas** (S13, S20) e ficam classificadas
como tal em vez de serem contadas como direção visual.

**De 50 referências, 11 são anti-referências e 3 são rejeitadas** — quase 30%
da biblioteca é material a evitar, e isso é o valor dela e não um defeito.

Duas gramáticas novas: **15** (um estado distingue-se pela forma antes da cor ou
do ritmo — de S05, e é o argumento mais forte contra o Oráculo distinguir
estados só por ritmo) e **16** (uma maqueta com dados falsos não é referência, é
aviso — de S08 com todos os rótulos a dizer "Thema", S16 com WISDOM repetido, e
S09 com agentes inventados).

Zero alterações a código.
### Fase 7Z · Oráculo com sessão real — três defeitos (CONCLUÍDA 2026-07-30)

Uma das duas perguntas autorizadas foi enviada, marcada como teste para não
poluir o histórico do Daniel com uma pergunta que não é dele. **A segunda não
foi gasta**, e a razão está abaixo.

#### 1 · A resposta ficava PRESA com a tab em segundo plano

`OrcBubble` escreve a resposta letra a letra com `setTimeout`. Com a tab oculta,
**a escrita parou de vez**: medido, o texto ficou em `"O Oráculo "` e não cresceu
um único carácter em quatro segundos. Não é atraso — é parada.

Consequência real: quem mudasse de tab a meio de uma resposta voltava e
encontrava uma frase cortada, **sem forma de saber que faltava texto**. A
resposta completa tinha 254 caracteres; ele veria 10.

Corrigido: a tab esconder-se passa a valer "mostra tudo já". A animação é
enfeite; a resposta é informação, e informação não pode ficar presa pelo
enfeite. Verificado na conta real com a tab ainda oculta: 254 caracteres,
completos.

#### 2 · O `setTimeout` não era cancelado no cleanup

Só o listener saía. Se `content` ou `live` mudassem a meio, ficavam duas
máquinas de escrever no mesmo nó. Corrigido, e o desmonte deixa o texto
completo em vez de um pedaço.

#### 3 · A conversa não era anunciada

Verificado: **a zona Oráculo não tinha nenhuma live region.** A resposta
aparecia sem nada avisar quem usa leitor de ecrã. O `#oc-log` passou a
`aria-live="polite"` com `aria-atomic="false"` — uma resposta é para ler quando
der, não para interromper.

#### O que a pergunta revelou, e não era técnico

**O Oráculo está sem saldo de API.** A resposta foi:

> O Oráculo não respondeu (Error: {"type":"invalid_request_error","message":"Your
> credit balance is too low to access the Anthropic API…"}). A mensagem não contou
> para o limite — tenta outra vez.

**O caminho de erro está estruturalmente CERTO** e isso é a boa notícia: a quota
não foi consumida (`oracleChat.count: 0` e o contador ficou em 12/12), a pergunta
saiu do histórico da API, e o Sistema disse que falhou em vez de fingir.

**A redação estava errada, em dois pontos.** Despejava JSON cru com texto de
faturação de terceiros — não é o Sistema a falar, é a API a falar por ele. E
"tenta outra vez" era um **conselho errado**: repetir não resolve falta de saldo,
e mandar alguém repetir o que não pode funcionar é o Sistema a fingir que sabe o
que se passa.

Corrigido: distingue-se agora o que o Operador **pode** resolver (falha
momentânea) do que **não pode** (saldo, credencial), e a causa técnica vai para
a consola em vez do ecrã.

**A segunda pergunta não foi gasta** porque ia dar o mesmo erro. Gastar uma
mensagem para reproduzir um erro já reproduzido não valida nada.

#### O que continua por validar, e agora depende de saldo

LISTENING, THINKING até ao fim com resposta real, RESEARCHING, INSIGHT e
CONSELHO com contexto **não podem ser validados sem saldo de API**. O caminho de
erro está validado; o caminho de sucesso não.
### Fase 7Z · Oráculo — o ciclo até ao erro, validado de graça (2026-07-30)

**Correção de um fecho meu prematuro.** Escrevi que o gate do Oráculo precisava
de saldo. Precisa **só para o INSIGHT**: uma chamada que falha **não consome
créditos nem quota** — verificado, `oracleChat.count` ficou em 0 e o contador em
12/12 após cinco tentativas. Todo o ciclo até ao erro é testável sem custo, e eu
tinha-o testado uma vez e mal.

#### A cronologia, amostrada a 120 ms

| t | o que acontece |
|---|---|
| 0 ms | repouso: três sigilos `busy:false`, botão ativo, zero mensagens |
| **127 ms** | THINKING entra — bolha do utilizador, sigilo a `busy:true`, `.oc-think` com "A consultar memórias…", botão `disabled`, moldura com `.oc-thinking` |
| **2004 ms** | erro chega — THINKING sai, botão reativa, sigilo a `false`, `.oc-thinking` sai |

THINKING entra em 127 ms e **não fica preso**. O botão fica `disabled` durante a
espera, e uma segunda tentativa nesse intervalo **não passa** — verificado: duas
perguntas enviadas, a terceira ficou no campo sem se perder. O campo continua
editável durante a espera, e isso é deliberado: escrever a pergunta seguinte
enquanto se espera é bom.

#### Um defeito meu, e nasceu de um erro meu

Testei o Escape e concluí "não cancela". Estava a testar **na zona errada** — o
`data-active` estava no Universo, não no Oráculo, e o campo recusou foco porque
a zona estava `inert`, que é o comportamento correto.

Mas verificar isso destapou uma coisa real: **o `UniverseScene` registava o
listener de Escape em `window` sem depender de `live`.** O Universo consumia
Escape em todas as zonas. Premir Escape no Oráculo recuava a câmara do Universo
em silêncio, e o Operador só descobria ao lá voltar e encontrar-se noutro sítio
sem saber porquê. Pior: Escape é a tecla de fechar, e uma zona que não está no
ecrã não pode ficar com ela.

Corrigido com `if (!live) return`. Verificado: Escape no Oráculo deixa o Universo
intacto (`OVERVIEW/system` antes e depois), e o Escape que centra a câmara
continua a funcionar dentro do Universo.

#### Com a zona ativa, o que está certo

Foco vai para o campo e **mantém-se durante o THINKING** — não há roubo de foco.
A ordem de tabulação põe o campo antes do botão. Dez elementos focáveis na zona.
A quota fica em 0 depois de cinco falhas.

#### O que NÃO existe, e é ausência e não avaria

**Não há cancelamento.** Escape durante o THINKING não interrompe, e não há
botão de cancelar em lado nenhum — procurado, zero. Com uma espera de 2 s isso é
defensável; com uma resposta real e longa deixa de o ser. Fica registado como
funcionalidade ausente.

#### Este é o quarto falso positivo meu nesta série

Botão `disabled` tomado por inerte; seletor a apanhar um `<svg>` filho; War Room
julgado não montado quando vive no painel lateral; e agora uma zona `inert`
tomada por ativa. **Nos quatro assumi o contexto em vez de o verificar** — e nos
quatro a verificação encontrou algo real que a suposição teria escondido.
### Fase 7Z · Gramática 15 aplicada ao Oráculo (CONCLUÍDA 2026-07-30)

A regra que a análise das referências produziu, aplicada ao sítio que mais
precisava dela: **a forma antes da cor e do ritmo**. Origem S05.

**O que estava errado.** Os quatro estados do sigilo diferiam em amplitude,
ritmo e cor. Cada um desses canais falha sozinho: o ritmo desaparece inteiro em
`prefers-reduced-motion`; a cor falha para quem não distingue violeta de
magenta — e era essa exatamente a diferença entre "tenho algo" e "há um prazo
vencido"; e a amplitude é um eixo só a carregar dois significados.

**Cada estado passou a ter silhueta própria:**

| estado | forma | como se lê parado |
|---|---|---|
| repouso | três ondas contínuas, amplitude mínima | linha quase plana |
| atento | as ondas ganham um **nó** vertical onde se cruzam | onda com marca ao centro |
| alerta | os três filamentos **partem-se** ao meio | linha interrompida |
| a processar | os filamentos **retraem-se** para o centro | traço curto |

A cor e o ritmo continuam lá. Deixaram é de ser o único canal.

**A prova, e é o ponto todo:** renderizados lado a lado em
`prefers-reduced-motion` **e** em escala de cinzentos — sem ritmo e sem cor — os
quatro continuam inconfundíveis. Se aqui falhasse, a gramática 15 não valia nada.

**Uma correção a meio, encontrada por olhar para a folha.** Na primeira versão
só o filamento portador se partia no alerta; os outros dois passavam-lhe por
cima e o intervalo **não se via**. A quebra existia no DOM e não na imagem — e
uma descontinuidade que não se vê não é uma descontinuidade. Passaram a partir-se
os três, com desfasamentos diferentes para o intervalo parecer a linha a falhar
e não a linha cortada com tesoura.

O nó e as barras de quebra **não existem** nos outros estados — não são elementos
com opacidade zero. Um elemento invisível continua a custar layout, e a lei diz
que nada se mostra sem estado real por trás.

Verificado: 115 elementos sem falhas de contraste AA, três sigilos reais na
aplicação com as animações a correr, zero erros de consola.
### Fase 7Z · Marcas de domínio no Núcleo (CONCLUÍDA 2026-07-30)

O extrato do **S12** aplicado. Aquela referência é um infográfico de HUD de
ficção científica para rejeitar inteiro — menos uma coisa: mostra N componentes,
cada um com **ícone próprio**, ligados por linha-guia ao objeto central que
compõem. É a estrutura do interior do Núcleo, e apontava a peça que lá faltava.

**O ícone de um domínio é a assinatura dele, parada.** Não é vocabulário novo:
cada domínio já tem uma assinatura de movimento que diz o que ele é, e a marca é
o estado final dessa assinatura em 24×24. Ofício alinha, Saber ramifica, Corpo
pulsa em anéis, Mente converge num foco, Vínculos une dois corpos, Disciplina
repete o mesmo traço à mesma altura.

A vantagem não é poupar trabalho — é **coerência**. Quem vir a assinatura no céu
e a marca no Núcleo reconhece a mesma ideia nos dois sítios, e a segunda ensina
a primeira. Seis ícones inventados dariam seis símbolos a decorar em vez de seis
formas já aprendidas.

É a **gramática 15 aplicada à identidade** e não ao estado: nenhuma das seis
depende da cor do domínio para se ler.

**Duas correções durante a implementação:**

- `<foreignObject>` trocado por **`<svg>` aninhado**, que é o mecanismo próprio
  do formato. Misturar HTML dentro de SVG traz problemas de escala e recorte que
  não valia a pena herdar por um ícone de 24px.
- A primeira montagem punha a marca **ao lado** do número, deslocada pelo
  `anchor` — e as marcas ficaram **por cima** dos números: visto num screenshot,
  o "11" de Ofício tinha três traços atravessados. Empilhar a marca acima do par
  número/nome resolve sem depender de saber a largura do texto, que em SVG não
  se sabe sem medir.

Verificado: 494×494 no desktop e 305×305 no mobile, ambos dentro do
enquadramento; a conta continua a fechar (63 ganhos + 1 = 64); 115 elementos sem
falhas de contraste AA; zero erros de consola.
### Fase 7Z · A matéria da estação (CONCLUÍDA 2026-07-30)

Era a maior distância entre o que a biblioteca guardava e o que o produto
usava: a análise das 50 referências fechou com **cinco tipos de matéria** e
**duas paletas com hex reais** documentados, e uma estação no Sistema continuava
a ser duas cores e uma direção de gradiente.

#### O que mudou

`ArcMotif` ganhou um campo — `materia` — e o Arc Engine ganhou uma camada. A
disciplina da Fase 7 mantém-se intacta: **não existe `<BloomLayer/>`, não existe
`if (arc.id === ...)` em componente nenhum.** É uma camada só; o que muda é o
`data-arc-materia`, que o CSS lê.

| arco | matéria | origem | o que a referência mostra |
|---|---|---|---|
| summer | cintilação | R28 | luz partida em fragmentos que ainda se lê como coluna |
| harvest | queda | R20 | três profundidades distinguidas só pela nitidez |
| winter | assentamento | R29 | duas populações — poucos francos, muitos difusos |
| bloom | abertura | R22 | a floração acontece em sequência, e a ordem lê-se |

As cores de outono e inverno passaram a vir de fonte. O `#60a5fa` do inverno era
o azul-cliché que a direção visual proíbe; **S20** dá `#8EA1AE` (MIST) e
`#BEB3AC` (FROSTYSILVER), e o que distingue essa paleta é precisamente a
dessaturação. O outono trocou o âmbar escolhido pelos terrosos de **S13**
(`#B3682D`, `#D1B27B`).

#### Quatro defeitos meus, e três só apareceram por medir

**1 · A dispersão colapsava em silêncio.** A primeira folha fabricava um módulo
em `calc()` com `x*37 - (x*37/22)*22`. O CSS não faz divisão inteira: aquilo é
zero para qualquer `x`, e as 12 partículas ficavam todas na mesma linha com a
mesma largura. Não dava erro nenhum. A conta que precisa de resto passou para o
React, com o `hashStr` do projeto — o gerador determinístico que já existia.

**2 · A camada não se via.** Diff de pixéis com e sem ela: **0.06% do ecrã** no
inverno, delta médio 3.7 no outono. Existia no DOM e não existia para o olho —
que é a pior das duas hipóteses, porque custa código e mente sobre o que o
produto faz. Doze partículas passaram a 24, a opacidade da camada de 0.5 a 0.9.

**3 · Estava por CIMA do texto, e isso parte a lei da camada.** Usei
`z-index: 0` por analogia com `--sys-z-atmosphere`. A analogia era falsa:
`.sys-stage-wrap` é uma área de grelha sem `position`, e na ordem de pintura do
CSS um elemento posicionado a `z-index: 0` fica acima de conteúdo em fluxo. O
screenshot mostrou pontos verdes em cima do "gap analysis ISO 27001" e do nível
"64". A atmosfera safava-se por ser um gradiente a 4% de opacidade; um ponto
sólido de 7px não se safa. Corrigido para `z-index: -1` — acima do fundo da
shell, abaixo de todo o conteúdo.

**4 · O modo `calm` não desligava a matéria.** O `motion-regime.css` desliga o
ambiente com um seletor que **não desce** (`[data-ambient]`, `::before`,
`::after`). A marca estava no contentor e a animação vive nas partículas: em
poupança de bateria, 24 animações continuavam a correr. Medido antes e depois.

#### A prova de legibilidade, e um método novo

O auditor de contraste do projeto sobe a árvore de fundos — e é **cego a esta
camada**, porque a matéria é um irmão atrás e não um antepassado. Passar nele
não provava nada.

Método usado: dois screenshots por estação, com e sem a camada; luminância
**mediana** de cada caixa de linha de texto como fundo (os glifos cobrem menos
de um terço de uma linha, por isso a mediana cai no fundo); rácio WCAG da cor do
texto contra esse fundo, nos dois.

| estação | caixas que caem abaixo de AA | pior perda de rácio |
|---|---|---|
| bloom | 0 | 0.278 (13.93 → 13.65) |
| summer | 0 | 0.565, numa caixa de 2 caracteres já abaixo do limiar sem a camada |
| harvest | 0 | 0.099 |
| winter | 0 | 0.051 |

**Zero caixas passam de conforme a não conforme.** A lei — a camada pode mudar
atmosfera, acento e partículas, e não pode tocar em legibilidade — fica provada
e não afirmada.

Uma nota de honestidade sobre o método: numa caixa de dois caracteres a mediana
já não é o fundo, é a tinta. O valor de 0.565 do verão não é fiável, e nessa
caixa o rácio já estava abaixo do mínimo **antes** de a camada existir.

#### Reduced motion: a camada SAI

A primeira versão congelava as partículas e mantinha-as visíveis, para não tirar
a estação a quem pede menos movimento. Visto em folha, estava errado: pontos
parados não são queda, cintilação nem floração — são pontos. **Uma animação que,
parada, deixa de comunicar era decoração**, e a lei do Sistema diz que nenhuma
animação é decorativa. A regra corta nos dois sentidos.

Não se perde informação: a estação continua a dizer-se pelo acento, pela
atmosfera e pelo painel do arco, que a nomeia por extenso.

#### Verificado

Custo por frame com GPU real: **8.3 ms com a camada, 8.4 ms sem** — 24 elementos
a animar `transform` e `opacity` não são mensuráveis. Quatro regimes de movimento
corretos (normal corre, `calm` sem animação, `paused` congelado, reduced motion
ausente). Mobile 390×844: 12 das 24 partículas, pela mesma regra que a fase já
tinha para a atmosfera. Auditoria AA da zona: 64 elementos, zero falhas. Zero
erros de consola nas quatro estações.
### Fase 7Z · A constelação forma-se por ordem (CONCLUÍDA 2026-07-30)

A última dívida nomeada da família das estações. R22 estava analisada desde o
fecho da biblioteca com uma aplicação por fazer registada por escrito: *"a
formação de uma constelação de domínio — hoje as estrelas aparecem todas de uma
vez"*.

#### O que a sequência diz, e por que não é um efeito de entrada

Cada estrela é **um nível que foi provado**. Acendê-las por ordem — nível 1
primeiro, depois o 2, e a protoestrela por último porque é a única que ainda não
aconteceu — repõe a **história do domínio**. É a leitura literal de R22: o ramo
não aparece florido, floresce, e a ordem é legível.

Um céu que aparece inteiro de uma vez diz que estava sempre ali. Um céu que se
acumula diz que foi construído, e essa é a diferença entre progressão por
acumulação e progressão por preenchimento.

#### Dispara na entrada na zona, e só aí

`live` também cai quando a tab se esconde. Repor a formação ao voltar de outro
separador mentiria duas vezes: dizia que aquilo tinha acabado de acontecer, e
obrigava a ver a mesma cerimónia por se ter ido buscar café. O guarda é um
`useRef` e o sinal é o `data-active` da zona, não o `live`.

#### A colisão que teve de ser resolvida

`.us-star[data-tw="true"]` já corria `us-twinkle` **infinita** sobre `opacity`.
Duas animações a disputar a mesma propriedade e ganha a última da lista — a
estrela cintilava para dentro em vez de nascer. A regra da formação vence por
especificidade (dois atributos e duas classes contra uma classe e um atributo), e
o resultado é também o correto: **uma estrela a nascer não cintila**, porque
ainda não é estável, e é isso que o estado tem de dizer.

#### Medido, e a medição é que distingue sequência de fade

Opacidade média por faixa de nível, amostrada por `requestAnimationFrame` a
partir do frame do clique:

| t | níveis ≤4 (24 estrelas) | níveis 5–12 (35) | níveis >12 (10) |
|---|---|---|---|
| 185 ms | 0 | 0 | 0 |
| 307 ms | 0.177 | 0.057 | 0 |
| 626 ms | 0.784 | 0.072 | 0 |
| 1033 ms | 0.999 | 0.895 | 0.189 |
| 1507 ms | 1 | 0.967 | 0.899 |
| 2107 ms | 1 | 0.967 | 0.914 — `feito` |

A ordem é monótona nas três faixas. Se fosse um fade global, as três colunas
subiam juntas — e não subiriam a 0.177 / 0.057 / 0 no mesmo instante.

Depois de `feito`: 22 estrelas voltam a `us-twinkle`, as outras 47 ficam sem
animação, exatamente como antes. Voltar à zona **não repete** (verificado:
`feito` a 250 ms da segunda entrada). Zero erros de consola. 69 estrelas.

#### Reduced motion mantém a constelação, ao contrário da matéria sazonal

Decisão inversa à da camada da estação, tomada no mesmo dia, e a diferença é o
que sobra **parado**. Partículas imóveis não são queda nenhuma — o significado
estava todo no movimento, e por isso a camada sai. Uma constelação imóvel **é a
constelação**: o estado final carrega a informação toda, e só se perde a
encenação de como lá chegou. Verificado: com `prefers-reduced-motion`, o estado
fica em `feito` e as estrelas estão à opacidade plena desde o primeiro frame.
### Fase 7Z · O Oráculo passa a ter cancelamento (CONCLUÍDA 2026-07-30)

**Não é funcionalidade nova.** É um requisito documentado que faltava, e está
escrito em três sítios da autoridade do Oráculo:

- `SYSTEM-ORACLE-CONSTITUTION`, §24 — a lista do que a automação **não pode
  remover** inclui *"possibilidade de cancelamento"*;
- `docs/oracle-governance/14_UI_UX_AND_PRESENCE` — *"Quando pensa: ... permitir
  cancelar"*;
- `docs/oracle-governance/18_ACCEPTANCE_GATES` — *"cancelamento"* é gate.

A auditoria de hoje tinha registado a ausência: Escape durante o THINKING não
interrompia e não havia botão em lado nenhum.

#### O que faz, e o que NÃO faz

Aborta o `fetch` do browser com um `AbortController`. **Não pára a chamada do
lado do servidor** — a Edge Function continua e a API pode continuar a ser
cobrada. A mensagem no log diz isso por extenso:

> *Cancelaste a pergunta. A espera parou aqui — mas a chamada pode ter continuado
> do lado do Oráculo e ter tido custo na mesma. A mensagem não contou para o
> limite.*

Esconder isso seria dar a entender que cancelar desfaz o pedido. A quota local
volta atrás porque mede **respostas recebidas**, e quem cancela não recebeu
nenhuma — a mesma regra que já valia para a falha, e honesta desde que o custo
não fique escondido.

`AbortError` distingue-se de falha de rede. Confundi-las diria que houve avaria
quando houve uma decisão.

#### Dois defeitos meus, e o primeiro só apareceu por testar com o rato a sério

**1 · O foco caía no vazio, no caminho mais comum de todos.** Quem envia com o
rato deixa o foco no botão Enviar. Esse botão fica `disabled` durante a espera —
e um elemento desativado **perde o foco, que cai para o `<body>`**. Medido:
`document.activeElement` a `BODY`, e a partir daí o Escape não chegava ao painel.
O cancelamento por teclado não existia exactamente onde mais faria falta.

A primeira versão do teste usava `botão.click()` por script — que **não move o
foco** — e dava verde. Só um `Input.dispatchMouseEvent` real reproduziu o
defeito. Um teste que não mexe no foco não pode encontrar um defeito de foco.

Corrigido: ao entrar na espera, o foco só se move **se já se tiver perdido**, e
nesse caso vai para o Cancelar — a única ação disponível. Quem envia com Enter
fica no campo, e aí não se toca: a auditoria anterior verificou de propósito que
não há roubo de foco durante o THINKING.

**2 · `opacity: .72` punha o botão abaixo de AA.** Pu-la para o botão ser
discreto. O violeta `#a78bfa` a 72% sobre o painel dá **4.0:1**, abaixo dos 4.5
exigidos. E a escolha estava errada antes de ser um número: este é o único
caminho para fora de um estado que bloqueia, e esbater a saída é decoração. A
contenção vem de o botão ser pequeno e só existir durante a espera.

#### Verificado, e como

Sessão **falsa** no `localStorage` de um perfil isolado (o token não autentica
nada; serve só para o guarda `if (!user)` deixar passar) e o pedido **retido pelo
CDP**, que nunca sai do browser — não chega ao Supabase nem à Anthropic e não
custa nada. Correu a sério: a ação `sendConselho`, o `AbortController`, o `signal`
no fetch, o ramo `AbortError`, a devolução da quota e a mensagem.

| o que | resultado |
|---|---|
| envio com rato real → foco | `BUTTON.oc-cancel` (era `BODY`) |
| envio por script/teclado → foco | `TEXTAREA#oc-in`, sem roubo |
| cancelar pelo botão | `busy:false`, quota 11→12, foco volta ao campo |
| Escape com foco FORA do painel | cancela; foco volta ao campo |
| `cancelConselho()` fora da espera | `false` — a tecla não é nossa |
| pergunta no histórico da API | `role` a `null`, como na falha |
| alvo de toque | 74×26 no rato, 74×36 em ponteiro grosso |
| pedidos que saíram do browser | zero |
| erros de consola | zero |

Contraste: o perfil computado do `.oc-cancel` — cor, opacidade, fundo, tamanho e
peso — é **idêntico ao de 4 dos 5 outros `.mini`** do produto (o quinto é a
variante `warm`). Não introduz par de cor novo, e por isso herda a auditoria AA
que já correu. O painel do Conselho não fica visível na montagem headless sem
sessão real, por isso **não há recorte de ecrã deste botão** — o que se afirma
aqui é o que foi medido, não o que foi visto.
### Fase 7Z · TypeScript incremental — o passo 4, e o que ele encontrou (2026-07-31)

A estratégia estava escrita no `tsconfig.json` desde a Fase 1, em quatro passos.
Os três primeiros estavam feitos — 57 ficheiros `.ts`/`.tsx` contra 59 `.js`. O
quarto dizia: *"módulos críticos migrados um a um, com `checkJs` a ser ligado
por ficheiro via `// @ts-check` antes de qualquer migração global"*.

**Não houve migração nenhuma.** Nenhum ficheiro mudou de extensão, nenhuma
dependência entrou, o `checkJs` global continua a `false`. O que houve foi ligar
a verificação em dois ficheiros do núcleo e tratar o que ela disse.

#### Sondagem primeiro, com números em vez de intuição

| ficheiro | avisos | não-implicit-any |
|---|---|---|
| `state/engine.js` | 20 | 2 |
| `state/world.js` | 26 | 9 |
| `state/recall.js` | 23 | 0 |
| `state/memory.js` | 16 | 0 |
| `state/config.js` | 18 | 0 |
| `lib/fx.js` | 70 | 29 |
| `lib/motion.js` | 46 | 17 |

A separação é a que importa: `TS7xxx` é *"não sei o tipo deste parâmetro"* —
ruído que se resolve a anotar. Tudo o resto é o verificador a dizer que a coisa
pode não estar lá.

#### A ponte de globais, declarada · `src/types/bridge.d.ts`

Metade dos avisos de `lib/fx.js` eram `window.dustBurst`, `window.Bus`,
`window.Motion`, `window.AM` — a ponte para o palco WebGL que o `CLAUDE.md`
manda preservar. Existia só como chamadas espalhadas por dez ficheiros: a
instrução de a preservar era verdadeira e **não verificável**.

O ficheiro novo não é código — é o contrato. E ao escrevê-lo apareceram duas
coisas que só se veem por escrito:

- as primitivas de FX são instaladas por **`Object.assign(window, {...})`**, não
  por `window.x = ...`. Procurar a origem de `window.rankCeremony` com uma
  pesquisa por `window.rankCeremony =` não encontra nada;
- **tudo na ponte é opcional**, e isso é política e não descuido: o padrão do
  projeto é chamar guardado por `if (window.x)`, porque o palco pode não ter
  montado. Marcá-las como obrigatórias ficava mais bonito e mentia.

Verificado ao mesmo tempo: **nenhum global é lido sem quem o escreva**. As
primitivas sem escritor aparente ou estão guardadas por `if`, ou eram só
menções em comentários. Zero chamadas mortas.

#### TRÊS DEFEITOS REAIS, e um deles rebentava a aplicação

**1 · `arcState()` tinha um caminho de crash em estado persistido.**

```js
const b = seasonBounds(SEASON_ARCS.find((a) => a.id === arcId));
```

O `find` devolve `undefined` quando o id não existe, e o `seasonBounds` lê
`a.id` na primeira linha. **Provado no browser, não deduzido:**
`seasonBounds(undefined)` → `Cannot read properties of undefined (reading
'id')`.

E o `arcId` vem de `S.worldArc.id`, que é **estado persistido**. Bastava um arco
ser renomeado, ou um estado antigo sobreviver a uma migração, para a aplicação
deixar de abrir — sem nada no ecrã a dizer porquê.

A resposta honesta a *"não conheço este arco"* não é rebentar nem inventar uma
data de fim: é `proposed`, que é o que o resto da função já devolve para tudo o
que não se confirma. Verificado: id desconhecido → `proposed`; `summer` →
`active`.

Este defeito estava lá desde a Fase 7 e **nenhuma verificação visual o podia ter
encontrado** — só se vê com um estado que ninguém tem hoje.

**2 · `LogEntry` em `types/domain.ts` mentia nos dois campos.** Dizia
`{ d, t, x }`. O único escritor é o `plog` e escreve `{ text, gain }`. Nem sequer
era a forma antiga — essa é `t`/`v`, e o `x` não existiu nunca em lado nenhum.

Passou despercebido porque nenhum leitor o importava: os leitores são JS e leem a
forma verdadeira. Bastava alguém tipar um leitor contra isto para escrever `e.t`
e receber `undefined` sem um único aviso. **Um tipo que descreve algo que o
código não faz é uma mentira com a autoridade de documentação.** Corrigido, com
a forma antiga declarada à parte como `LegacyLogEntry` — apagá-la não apagava os
dados, só escondia que existem.

**3 · `whisperToday(S)` recebia um estado que não lia.** A assinatura prometia
que o sussurro depende do estado; ele depende do dia e da estação, que é o que o
torna determinístico. Parâmetro fora, dois sítios de chamada atualizados.

#### Duas anotações minhas que estavam erradas, e o verificador apanhou-as

Escrevi `@returns {void}` no `addXp` — devolve `string[]`. E `@returns {string}`
no `whisperToday` — devolve `{ t, attr, xp }`, que é uma **micro-missão** e não
uma frase. Quem lesse a segunda assinatura ficava a pensar que aquilo era texto
quando é uma coisa que se pode cumprir. É o argumento inteiro a favor do passo 4:
a anotação errada dura segundos.

#### Melhorias sem defeito por trás

- `addXp` capturava `window.sysEvent` dentro de um `forEach` guardado por um `if`
  fora dele. Não é bug hoje, mas `sysEvent` é um global que outro módulo instala
  e desinstala, e entre a verificação e a última iteração corre código nosso. A
  referência passou a capturar-se antes do ciclo.
- `plog` colava `e.attr = attr` a um literal já fechado. Passou a construir com
  `...(attr ? { attr } : {})` — mesmo comportamento exacto: sem `attr`, a chave
  **não existe**, e não fica um `undefined` a fingir-se de dono.
- `isoWeekKey` fazia aritmética com `Date` cru; passou a `getTime()`.
- Import morto (`fmt`) removido.
- Os quatro arcos cobrem os 12 meses, e agora isso é **verificado no arranque em
  desenvolvimento**. Um mês descoberto é erro de config, que se apanha a
  programar — não algo que deva rebentar à frente do Operador a meio da sessão.
  Em produção o fallback segura o Sistema de pé.

#### Estado final

`// @ts-check` **ligado permanentemente** em `state/engine.js` e `state/world.js`
— os dois módulos onde vive *"o Sistema nunca mente"*. Ambos a zero.

`lib/motion.js` fica de fora e a razão é estrutural: é o ficheiro que **constrói**
`window.Motion`, e o definidor de um global luta sempre com a declaração dele.
Ligar a verificação lá subiu os avisos de 46 para 58 — sinal de que o custo é
maior do que o retorno. `lib/fx.js` fica para uma passagem própria: 29 avisos
não-triviais é trabalho a sério, não um remate.

Verificado no browser: sussurro do dia determinístico e com a forma certa;
`xpMult` a dar 1.2 no Ofício com o Summer Arc ativo e 1 num domínio inventado;
`plog` com e sem `attr`; as seis zonas visitadas com **zero erros de consola**.
Nenhuma dependência nova, nenhum ficheiro convertido, `checkJs` global ainda a
`false`.
### Fase 7Z · @ts-check na camada de efeitos (2026-08-01)

Continuação do passo 4. O `lib/fx.js` era o ficheiro com mais avisos e o que
toca em todos os momentos visíveis do produto: toast, XP a flutuar, celebração,
momento cinematográfico, cerimónia de rank, contador animado, varrimento de
painel e máquina de escrever.

**70 avisos → 0.** Metade tinha desaparecido com a declaração da ponte de
globais no dia anterior; a outra metade exigiu trabalho.

#### O defeito principal: a guarda estava a 350 ms da chamada

Em dois sítios — `cineArise` e `rankCeremony`:

```js
if (window.dustBurst) setTimeout(() => window.dustBurst(cor), 350);
```

O `if` corre **agora**; a chamada corre **um terço de segundo depois**. No meio
cabe o palco a desmontar, a página a navegar, o WebGL a perder o contexto. Um
`if` só garante o instante em que corre.

E há uma segunda camada, pior: o `rankCeremony` tem `try/catch` à volta de tudo
— **e não protege isto.** O callback do `setTimeout` corre fora da pilha do
`try`, numa volta seguinte do event loop. O código parecia protegido e não
estava. O `cineArise` nem `try` tinha.

**Provado no browser, com o padrão antigo reconstruído:** apagar
`window.dustBurst` 80 ms depois da cerimónia começar produz
`Uncaught TypeError: window.dustBurst is not a function` — apanhado pelo
`window.onerror`, ou seja, **escapou ao `try`**.

Corrigido com uma função só, `poeiraDaqui(ms, cor)`, que captura a referência
antes de agendar. Verificado: com o global apagado a meio do intervalo, a poeira
corre à mesma, com a cor certa, e não há exceção.

#### Três defeitos menores, todos da mesma família

**O `toast` verificava o pai e escrevia nos filhos sem os verificar.** Os quatro
elementos vêm do mesmo componente e na prática aparecem juntos — mas "na
prática" é uma suposição sobre markup que outra pessoa pode mudar, e o preço de
estar errado é um TypeError dentro do `toast`, que é chamado **pelo motor de
XP**. Um brinde a falhar não pode derrubar uma subida de nível. Verificado com
o `#tt` removido do DOM: já não rebenta.

**O `celebrate()` sem cor dava duas cores.** O clarão usava
`color || '#a78bfa'` e a poeira recebia o `color` cru — logo `undefined`, e o
palco caía no fallback dele. Dois efeitos do mesmo momento com cores diferentes
é o tipo de incoerência que ninguém reporta e toda a gente vê. A cor resolve-se
uma vez. Verificado: flash `#a78bfa55`, poeira `#a78bfa`.

**O `floatXP` lia `window.event` sem saber que tipo de evento era.** É o global
legado e existe durante o despacho de **qualquer** evento, não só de rato. Um
ganho vindo do teclado não tem coordenadas — o centro do ecrã não é defensiva
decorativa, é o caso normal. Agora está explícito com `instanceof MouseEvent`.

#### O refluxo forçado, que falharia em silêncio

`void w.offsetWidth` entre remover e repor uma classe é o truque que força o
refluxo — sem ele o browser junta as duas operações e a animação não recomeça.
`offsetWidth` só existe em `HTMLElement`: num SVG é `undefined`, o refluxo não
acontece e a animação falha **sem erro nenhum**. O `instanceof` transforma isso
num caso tratado em vez de um mistério.

#### Verificado no browser, primitiva a primitiva

| primitiva | resultado |
|---|---|
| `toast` | aparece, escreve nos três filhos, borda com a cor, esconde |
| `toast` em modo aviso | classe `pen` + rótulo "Aviso" |
| `toast` com um filho removido | não rebenta |
| `celebrate()` sem cor | flash e poeira coerentes |
| poeira com o global apagado a meio | corre à mesma, sem exceção |
| padrão antigo, reconstruído | `Uncaught TypeError`, fora do `try` |
| `setNum` | conta e assenta em 1234 |
| `floatXP` sem evento | aparece ao centro |
| `cineMoment` | overlay entra; o segundo é recusado |
| `panelScan`/`cardWave`/`barBurst`/`sysType` com alvo nulo | sobrevivem |
| erros de consola | zero |

#### Estado do passo 4

`// @ts-check` ligado permanentemente em **`state/engine.js`**,
**`state/world.js`** e **`lib/fx.js`**. Todos a zero.

`lib/motion.js` continua de fora, e a razão é estrutural e não preguiça: é o
ficheiro que **constrói** `window.Motion`, e o definidor de um global luta
sempre com a declaração dele — ligar a verificação lá subiu os avisos de 46 para
58. Fica registado como decisão, não como pendência.

Os restantes `.js` são componentes e o store. Nenhum é núcleo de estado nem
camada de efeitos; ficam para quando houver uma razão melhor do que a
arrumação.
### Fase 7Z · Bundle e arranque, medidos (2026-08-01)

O último item da lista "Por fazer" que era de medição e não de decisão. O SPEC
dizia *"performance nunca medida: bundle em 996 KB"* — meio desatualizado: o FPS
mobile foi medido na Fase 7Z (8,3 ms), o bundle e o arranque não.

#### Bundle

| ficheiro | cru | gzip |
|---|---|---|
| `state.js` | 498,4 KB | 129,5 KB |
| `index.js` | 466,1 KB | 138,0 KB |
| `react-vendor.js` | 138,5 KB | 44,4 KB |
| `main.js` | 16,8 KB | 6,4 KB |
| `index.css` | 187,3 KB | 32,3 KB |
| **total** | **1307 KB** | **350,6 KB** |

**O JS cru cresceu de 996 KB para 1120 KB — 12%.** Mas o número que interessa é
o outro: o Pages serve com gzip, e o que atravessa a rede são **351 KB**. A
entrada de 996 KB no SPEC comparava crus com uma intuição sobre gzipados, e por
isso soava pior do que é.

Os dois maiores são `state.js` (o domínio inteiro: config, motor, normalização,
store) e `index.js` (a shell e as seis zonas). Nenhum é obviamente cortável sem
code splitting por zona, que é uma missão e não um ajuste.

#### Arranque

Contra o **build**, não contra o dev server; servidor estático local, cache
desligada, perfil Chrome isolado, três perfis de CPU e rede.

| perfil | primeiro pixel | primeiro conteúdo | load |
|---|---|---|---|
| desktop, sem limite | 360 ms | 392 ms | 351 ms |
| mobile 4G, CPU 4x | 288 ms | 312 ms | 285 ms |
| mobile 3G lento, CPU 6x | 528 ms | 552 ms | 523 ms |

**Ressalva que impede estes números de mentir:** os ativos são servidos de
`localhost`. A limitação de rede aplica-se à latência mas não a uma ligação
real, e é por isso que o mobile aparece por vezes melhor do que o desktop — a
diferença entre perfis está dentro do ruído. O que isto estabelece é a **ordem
de grandeza** (meio segundo até haver conteúdo, no pior caso) e o tamanho do
bundle. Não é uma comparação realista entre redes e não deve ser lida como tal.

#### O achado que não era o objetivo da medição

**Sem sessão iniciada, a shell não monta.** Fica no ecrã de entrada à espera de
um clique — e só depois aparece o Sistema. Medido: o clique aconteceu a 1577 ms
no desktop e a **3059 ms** em 3G lento com CPU a 6x.

Isto não é defeito: é o comportamento correto de uma app que precisa de saber se
há conta. Mas significa que **o "tempo até ao Sistema" real não é o FCP** — é o
FCP mais o tempo até alguém decidir e carregar. Nenhuma métrica anterior dizia
isso, e as três primeiras versões deste harness mediram um ecrã vazio a achar
que mediam o Sistema.

#### Três erros meus no harness, e todos davam números publicáveis

Ficam registados porque cada um produziu uma medição plausível e falsa:

1. **faltava `?shell=1`** — media o arranque de um ecrã de entrada e chamava-lhe
   arranque do Sistema;
2. **`Network.clearBrowserCache` limpa o disco e deixa a memória** — a segunda
   corrida dava 2,4 KB transferidos, e eu ia registar isso como o custo de quem
   chega pela primeira vez. Só `setCacheDisabled` garante rede a sério;
3. **sondar com `Runtime.evaluate` logo a seguir a `Page.navigate`** cai no
   contexto de execução velho: a sonda nunca via a shell, devolvia `null` para
   sempre, e a versão seguinte ficou pendurada 400 s.

A medição final usa um `MutationObserver` injetado antes de qualquer script da
app correr. Mesmo assim a marca de montagem não ficou fiável e **não está na
tabela** — o que está são os valores que a API de performance dá diretamente e
que não dependem do meu código.

#### Estado

O item "performance nunca medida" fecha. Fica aberto o que é decisão e não
medição: **se 1307 KB crus justificam code splitting por zona.** A resposta
honesta, com os números na mão, é que a 351 KB gzipados ainda não justifica.
### Fase 7Z · Estado de aceitação da Missão 26 (2026-07-30)

╔══════════════════════════════════════════════════════════════════════════╗
║  **A · IMPLEMENTAÇÃO CONCLUÍDA — ACEITAÇÃO PENDENTE**                    ║
╚══════════════════════════════════════════════════════════════════════════╝

A formulação oficial, fixada pelo Daniel: *"Universo — implementação concluída
e documentada; aceitação global da Missão 26 ainda pendente."*

**Não declarar o Universo nem as Fases 6–7 como aceites em produção** enquanto
faltar qualquer um destes:

| Gate | Estado |
|---|---|
| Decisões de domínio + `arcCapabilities` | **FECHADO** |
| Pavimento Pélvico / Kegel | **FECHADO** |
| Referências (50: 30 animadas + 20 estáticas) | **FECHADO** — zero pendentes |
| Performance mobile | **FECHADO** com ressalvas medidas |
| Validação do Oráculo | **PARCIAL** — o que precisa de sessão fica por fazer |
| Auditoria com dados reais | **FECHADA** — executada read-only; 3 defeitos, 1 da primeira lei |
| Oráculo · ciclo até ao erro | **FECHADO** — cronologia medida; 4 defeitos corrigidos |
| Oráculo · INSIGHT (resposta real) | **BLOQUEADO** — só isto precisa de saldo |
| Oráculo · cancelamento | **FECHADO** — implementado; era requisito da Constituição §24 e gate do doc 18 |

O plano da auditoria está em
`docs/design-references/mission-26/AUDITORIA-CONTA-REAL.md` e inclui as páginas
a abrir, o que observar, as ações proibidas, os riscos, a política de
screenshots e a lista do que precisa de sanitização.

**Sobra um gate, e não é de implementação:** LISTENING, THINKING até ao fim,
RESEARCHING, INSIGHT e CONSELHO com resposta real **não são validáveis sem saldo
de API**. O caminho de erro está validado e correto; o de sucesso está bloqueado
por uma condição externa ao código.

**Enquanto esse gate não fechar, a classificação é A e não B** — e fechá-lo
depende de repor saldo na conta que serve o Oráculo, não de escrever código.
### Fase 6E · Radar — campo de sinais (CONCLUÍDA 2026-07-30)

Quatro estados operacionais: `scanning` (lido do `sync` real), `signal`,
`no signal` (diz o que vigia, quando olhou e quando volta) e `error` (com botão
de recuperação — nunca se disfarça de vazio). O eixo passa a ser o **tempo**:
os dias descem como marcas de varrimento.

Não inventei métricas: não há barra de confiança porque o domínio não guarda
confiança. A hora da próxima passagem é apresentada como **previsão**, com a
ressalva escrita.

### Fase 6D · Escada de Ascensão (CONCLUÍDA 2026-07-30)

A letra de rank no topo era decoração; passa a porta. Escada **vertical**, lida
de baixo para cima — gramática 9 (origem R11): a direção é o significado.

**Não inventa requisitos.** O domínio tem um só critério de rank e é
aritmético. A escada mostra degraus, níveis em falta e títulos por nível, e tem
uma secção com cabeçalho a dizer por extenso o que **não está definido**
(requisitos de evidência, benefícios, histórico de promoções). "O que puxa para
cima" é derivado: `overallLevel` é a soma dos seis domínios, logo o que tem
menos XP em falta é o mais barato de subir.

Verificado a rank C e a rank S; Escape fecha e o foco **volta ao Núcleo**.

### Fase 6F · Calendário — seis estados (CONCLUÍDA 2026-07-30)

A célula passa de `<div onClick>` a `<button>` com `aria-pressed` e
`aria-label` descritivo. Seis estados, cada um numa **linguagem diferente**
para poderem coexistir: hoje é luz interna, selecionado é contorno, evento é
marca inferior, prazo é filete lateral, urgente é o mesmo filete mais grosso e
em alarme, passado cumprido é filete em baixo. Nenhum depende só de cor.

### Fase 6G · Entrada e transições (CONCLUÍDA 2026-07-30)

O fade de 180 ms — proibido por nome pela fase — passa a deslocamento com
**direção**, tirada da posição relativa das duas zonas na órbita. 24 px, e não
60: medi os dois e 60 dava sensação de carrossel. Assinatura curta por zona,
sempre sobre a luz de palco e nunca sobre o conteúdo.

**Sem remount, verificado e não assumido:** scroll de Operações em 240 antes e
240 depois de ir ao Universo e voltar, com o canvas das Constelações intacto.

A entrada **não é um splash**: `pointer-events: none` desde o primeiro frame, o
conteúdo real já montado por baixo, e uma vez por sessão. Bug apanhado: a marca
de sessão era escrita no início do efeito e o StrictMode consumia-a no segundo
mount — a sequência nunca chegava a ver-se.

### War Room e presença do Oráculo (CONCLUÍDOS 2026-07-30)

**War Room.** A correção mais importante foi um rótulo. A maqueta dizia "DADOS
AINDA NÃO LIGADOS" nos quatro blocos; para Agentes e Money Machine isso era
**falso** — não há registry, não há pipeline, não há nada por ligar. Dizer
"ainda não ligado" sobre o que não existe é mentir por implicatura.

Passam a existir dois estados estruturais: **ligado** (Operações, Sinais de
risco, Mundo — cada número com a origem declarada) e **não existe** (Agentes,
Money Machine — com a regra da Constituição que impede improvisá-los).

Não inventei um registo de riscos: o bloco chama-se "Sinais de risco" porque é
o que é — dois factos duros e um estimado. Chamar-lhe "Riscos · abertos /
aceites / em escalada" seria inventar uma taxonomia que ninguém escreveu.

**Presença do Oráculo · a processar.** Pedir um conselho deixava a faixa igual.
Agora a onda deixa de respirar e passa a **contrair** (R17), com `ocBusy` real
— e para quando a resposta chega. Sob `reduced-motion` fica contraída, para o
estado continuar a distinguir-se.

### Fases 6 e 7 — o que fica em aberto

A lista de implementação está fechada. O que resta são **duas decisões do
Daniel**, não trabalho por fazer:

1. **Estados de arco por implementar no domínio** — `milestone`, `climax` e
   `archived` estão declarados e inalcançáveis. Precisam de onde guardar um
   marco atingido, e isso é decisão de domínio;
2. **Sobreposição entre o pilar `kegel` do Treino e a rotina guiada de
   Pavimento Pélvico** — são dois registos para a mesma atividade: o primeiro
   move a progressão do domínio, o segundo escreve em `bodyRoutines` com XP
   zero. Não os fundi porque fundi-los muda o que "sessão de treino" significa,
   e isso é decisão do Daniel.

### Por fazer

- ~~**performance** nunca medida~~ **FECHADO 2026-08-01**: FPS mobile medido na
  Fase 7Z (8,3 ms); bundle e arranque medidos hoje — 1307 KB crus, **351 KB
  gzipados**, primeiro conteúdo em 392 ms no desktop e 552 ms em 3G lento com CPU
  a 6x. Ver a secção própria. Fica em aberto uma DECISÃO, não uma medição: se
  justifica code splitting por zona;
- ~~contraste~~ **REABERTO e fechado outra vez a 2026-07-29**: a auditoria da
  Fase J dava "396 elementos, zero falhas" mas não compunha opacidades sobre o
  fundo. Com a composição, `--sys-ink-far` sobre o vazio a 13px dá 3,23:1. A
  zona Núcleo está a **zero falhas em 58 elementos**; as outras cinco zonas
  **precisam de nova passagem com o método corrigido**;
- ~~resoluções 1280×800 e 768×1024 por testar~~ **testadas** (Núcleo);
- 41 referências por analisar;
- resíduos de 6px (Universo) e 3px (Operações), sem barra de scroll;
- células do calendário em mobile por confirmar;
- **atribuição do Oráculo na coluna da ação** — decisão do Daniel, não minha.

### Bloqueado no Daniel

- **teste com dados reais** — a maior lacuna. Sem ele não fecham densidade,
  contraste nem equilíbrio entre camadas; enganou duas vezes nesta sessão;
- **Modo Estação**: renascer / absorver / reformar;
- **matriz de tecnologia**: TypeScript, Motion, R3F, Drei, pós-processamento,
  Vercel;
- **gate de produção**: o Pages continua a servir o Vanilla a partir de `main`.

## Missão 27 — World Engine II · Estações, Calendário e Eventos de Prova
(PLANEADA; extensão das M12, M23 — não reconstrução)

Objetivo: transformar hora, clima, estação, calendário e contexto pessoal num
motor composto, configurável e narrativo. O Solar Engine, Open-Meteo e os
modificadores de comportamento já existentes são fundações; esta missão não os
duplica.

### Arquitetura

Criar um registo central e modular:

`Time → Weather → Season → Calendar → Behaviour → Special Event → Visual Map`

Cada evento define: id, trigger, prova, prioridade, duração, cooldown,
modificadores visuais, copy, ações sugeridas, dados persistidos, mobile e
reduced-motion. Eventos compostos resultam de regras, não de `if` espalhados.

### Arcos sazonais

- **Bloom Arc / Primavera** — renascimento, limpeza e novas fundações;
  sementes de luz, crescimento orgânico, vault cleanup, início de cursos,
  mapas mentais e hábitos.
- **Solar Arc / Verão** — energia, corpo, exposição e execução; luz mais
  aberta, heat shimmer subtil, hidratação/protetor configuráveis, treino cedo,
  deep work antes do calor, networking, estágio, labs, case studies e
  consolidação prática de NIS2/RGPD/ISO 27001/AI.
- **Harvest Arc / Outono** — recolha, análise e maturação; dados que se
  agregam, arquivo, revisão trimestral, gap analysis, relatórios, portfólio e
  auditorias simuladas.
- **Winter Forge / Inverno** — disciplina, aulas e construção silenciosa;
  azul frio, névoa, partículas de gelo abstratas, treino, sono, perfume de
  inverno como protocolo pessoal opcional, estudo profundo, ISO 19011,
  ISO 27001, NIS2, RGPD e AI Governance.

As recomendações pessoais são editáveis; o motor não apresenta conselhos de
saúde como diagnóstico.

### Calendário simbólico

New Cycle, Shadow Audit, Easter Light, Exam Siege/Career Gate, Summer Arc,
Return Protocol, Eclipse Month, Deep Work Descent e Winter Archive. Datas
móveis, como Páscoa, são calculadas/fornecidas por configuração; nunca
hardcodar uma data eterna.

### Eventos especiais e mistos

Starbirth, Supernova Rare, Boss Gate, Rain Sanctuary, Solar Push, Midnight
Archive, Mentor Signal, Oracle Prophecy e Eclipse Protocol.

Compostos prioritários:

- Winter Rain Sanctuary;
- Summer Solar Push;
- Autumn Vault Resonance;
- Spring Skill Bloom;
- Exam Siege + Rain Sanctuary;
- Mentor Signal + Boss Gate;
- Summer AI Lab;
- Winter Governance Forge;
- Rainy Prompt Forge;
- Governance Eclipse.

Critério de honestidade: um evento só se apresenta como facto quando possui
prova. Um arco sazonal pode sugerir ações; um marco pessoal só celebra com data
e evidência reais.

### Fase 1 — o registo declarativo (CONCLUÍDA 2026-08-01)

A frase do SPEC que decide o desenho desta missão:

> *"Eventos compostos resultam de REGRAS, não de `if` espalhados."*

O mundo já reagia — chuva dá bónus ao Saber (M12), o domingo acalma o céu e a
ausência de progresso apaga-o (M23). Mas cada reação vivia no seu sítio, escrita
à mão, e não havia forma de perguntar ao Sistema **o que está a acontecer agora
e porquê**. Um evento composto seria um `if` dentro de outro `if`.

**Três ficheiros, zero pixéis alterados.** É deliberado: o motor tem de estar
certo antes de ter cara, e um motor que nasce ligado ao ambiente nunca mais se
consegue testar sozinho.

| ficheiro | o que é |
|---|---|
| `app/world/worldModel.ts` | o contrato de um evento |
| `app/world/worldEvents.ts` | o catálogo |
| `app/world/worldRead.ts` | o resolvedor — uma função, um resultado |

#### A prova é obrigatória, e é um campo e não uma intenção

O critério de honestidade da própria missão diz: *"um evento só se apresenta
como facto quando possui prova"*. Por isso `evidence` **não é opcional** — tem
origem, facto e data, e um evento que não consegue dizer de onde veio **não
nasce**. Não é filtrado depois: não entra.

Uma prova incompleta é recusada como se não existisse. Dar autoridade a um facto
que não se consegue verificar é pior do que não o mostrar.

#### Sete eventos, e não os vinte que o SPEC nomeia

A diferença não é preguiça — é o mesmo critério. Prova significa **um dado
datado que o Sistema já tem**. Os sete implementados apoiam-se em `S.weather`,
`S.history`, no relógio e no arco sazonal:

| evento | camada | prioridade | prova |
|---|---|---|---|
| Arquivo da Meia-Noite | tempo | ambiente | relógio |
| Santuário de Chuva | clima | notável | `S.weather` (Open-Meteo) |
| Impulso Solar | clima | notável | `S.weather` (Open-Meteo) |
| Viragem de Arco | estação | maior | `SEASON_ARCS` + calendário |
| Domingo | calendário | ambiente | calendário |
| Novo Ciclo | calendário | maior | calendário |
| Silêncio | comportamento | notável | `S.history` |

Os outros **doze ficam listados em `POR_IMPLEMENTAR`, cada um com o que lhe
falta** — e o que falta é sempre **dados**, não código. Boss Gate precisa de
marcos de arco guardados, que é o mesmo buraco que deixa `milestone` e `climax`
inalcançáveis na M26. Mentor Signal precisa de registo datado de contacto.
Eclipse Protocol precisa de configuração, porque o SPEC proíbe hardcodar datas
eternas. Escrever um `trigger` que devolve sempre `null` daria a impressão de um
motor completo com metade dos eventos mortos.

#### A lista de recusados é funcionalidade, não depuração

`readWorld` devolve também o que **não** aconteceu e porquê. Passa a haver
resposta para *"porque é que hoje não houve Santuário de Chuva?"* — a regra
correu e devolveu nada, porque `S.weather` é de ontem.

Sem isto, um mundo que não reage é indistinguível de um mundo avariado.

#### Verificado no browser, contra o módulo real

- as **sete regras acendem**, cada uma com o estado e o instante construídos
  para ela, e cada uma com prova completa;
- **prioridade**: com cinco eventos ativos ao mesmo tempo (novo ciclo + silêncio
  + chuva + domingo + meia-noite), a ordem sai
  `major → notable → notable → ambient → ambient` e o dominante é o Novo Ciclo;
- **`S` nulo não derruba nada**: 2 ativos, 5 recusados, **zero regras
  rebentadas**;
- **determinismo**: o mesmo estado no mesmo instante dá a mesma lista;
- `explainWorld` devolve a frase por extenso — a Constituição exige que o
  Oráculo explique porquê, e um mundo que muda sem saber dizer porquê não é
  explicável, é só bonito;
- zero erros de consola.

#### O que a Fase 2 vai precisar de decidir

- que eventos **encenam** e que eventos só informam;
- como o `WorldVisual` compõe com `--arc-accent` da camada de arcos da M26 —
  duas fontes de acento a discutir a mesma variável é o próximo defeito óbvio;
- se `dominant` alimenta a fila de SYSTEM EVENTS ou se é um canal à parte;
- `durationMin` e `cooldownH` estão declarados e **ainda não são respeitados**:
  precisam de onde guardar a última ocorrência, e isso é decisão de domínio.
### Fase 1b — contexto, cooldown a sério, e a M29 a usar o registo (2026-08-01)

#### A assinatura trocou uma hora depois de ser escrita

Era `trigger(S, now)`. Bateu na primeira parede real: os eventos **AI Radar** e
**Governance Radar** da Missão 29 precisam dos itens do **Radar**, que vivem no
store e **não** no estado do Operador.

As alternativas eram piores. Passar o radar por uma segunda via daria regras que
leem de sítios diferentes conforme quem as escreveu; copiá-lo para `S` misturaria
dados de servidor com o estado guardado.

Passou a `trigger(ctx, now)` com `WorldContext = { S, radar?, seen? }`. **Trocar
com sete eventos custa minutos; com vinte custa uma tarde e um risco.** É por
isso que se troca agora e não depois.

`readWorld` continua a aceitar só o estado — obrigar toda a gente a construir um
objeto seria atrito sem benefício. Verificado: a forma antiga funciona.

#### O cooldown deixou de ser decorativo

A Fase 1 declarava `cooldownH` e **não o respeitava**. Um campo declarado que não
faz nada é a definição de um estado exibido que contradiz o estado real.

Agora é aplicado contra `ctx.seen` — e quando esse mapa não chega, o resolvedor
**declara-o** em `cooldownIgnorado` em vez de deixar a proteção parecer ativa.
É a distinção entre "protegido" e "ninguém verificou".

| cenário | resultado |
|---|---|
| sem mapa de ocorrências | acende, e declara `cooldownIgnorado` |
| entrou há 2 h, cooldown 20 h | recusado: *"tem prova, mas entrou há 2.0 h"* |
| entrou há 30 h | acende |

A razão diz **há quanto tempo**, para não se confundir com falta de prova. Um
evento com prova recusado por cooldown é um caso diferente de um evento sem
prova, e a lista de recusados tem de os separar.

#### Missão 29 · Fase 2 — três eventos, no mesmo registo

Vivem em `worldEvents.ts` e **não** num motor paralelo: dois motores de eventos
no mesmo produto seriam duas opiniões sobre o que é importante.

| evento | camada | prioridade | prova |
|---|---|---|---|
| AI Radar | especial | notável | `radar_items` com `area: ai`, do próprio dia |
| Governance Radar | especial | **maior** | `radar_items` com `area: aigov` |
| Risco de IA por rever | comportamento | notável | o inventário |

**Governance Radar é maior do que AI Radar, e é deliberado:** uma alteração
regulatória tem prazo e consequência; uma notícia de modelo novo não tem.

O terceiro está no catálogo e **não** em `POR_IMPLEMENTAR`, e a diferença é real:
os outros catorze eventos da M29 precisam de dados que ninguém sabe ainda como
recolher; este precisa de dados que o Daniel **pode escrever hoje**. A regra está
pronta e à espera do inventário.

#### Verificado

- itens de **ontem não contam**, e `area: nis2` também não;
- com um item `aigov` e dois `ai`, o dominante é o Governance Radar;
- as provas concordam em número: *"1 sinal novo"*, *"2 sinais novos"*;
- **sem radar nenhum, zero regras rebentam** — só não acendem;
- `ai-risk-overdue` só acende com dívida real, e o facto compõe-se:
  *"1 a tocar dados pessoais sem avaliação e 1 com revisão em atraso"*;
- determinismo aguenta com o catálogo maior;
- zero erros de consola.

O catálogo passou de **7 para 10 eventos**.
### Fase 2 — o mundo ganha cara (CONCLUÍDA 2026-08-01)

#### A decisão que esta fase tinha de tomar

O `WorldVisual` traz `accent`. A camada de arcos da Missão 26 já governa
`--arc-accent`. Duas fontes a discutir a mesma variável era o próximo defeito
óbvio.

> **O arco é a estação. O evento é o momento. Um momento não reescreve uma
> estação — modula-a.**

O arco dura meses e é a verdade de fundo; um evento dura horas. Deixar um
Santuário de Chuva pintar o mundo de azul durante uma tarde apagaria o Summer
Arc que dura desde junho — e no dia seguinte o Operador não saberia dizer em que
estação está.

`--arc-accent` fica **intocado**. O mundo contribui `--world-accent` e
`--world-intensity`, que compõem por cima.

#### Duas regras que limitam o estrago

1. **Só o DOMINANTE pinta.** O `motion-regime.css` já declara "um ambiente
   dominante por zona" desde a Fase 6A. Cinco eventos a contribuir cada um a sua
   cor dariam lama, e a lama não comunica nada.
2. **Eventos `ambient` não trazem cor — só intensidade.** É domingo todas as
   semanas e é de noite todos os dias. Se o Domingo pintasse, o mundo mudava de
   cor um dia em cada sete por uma razão que não é notícia. Só `major` e
   `critical` ganham acento, e são precisamente os raros.

O resultado: na maior parte dos dias **o mundo não muda de cor**, e quando muda é
porque aconteceu alguma coisa que merece.

#### Onde o mundo pinta, e porque não é onde o arco pinta

O arco vive no **rodapé** (`::after`, 56vh a partir do fundo). O mundo vive no
**topo** (`::before`, 38vh). Não é arrumação: são duas informações diferentes e
não podem partilhar o mesmo sítio, senão a mais recente esconde a mais antiga e o
Operador perde a estação.

#### O DEFEITO, e é o mesmo que a Missão 26 já tinha encontrado

A intensidade começou por ser uma regra própria:

```css
.sys-shell::after { opacity: calc(var(--arc-presence) * var(--world-intensity)); }
```

**Nunca funcionou.** As keyframes `arc-out`/`arc-in`/`arc-up` animam `opacity`, e
uma **animação vence qualquer declaração normal** — a regra existia e não fazia
nada.

Medido: com intensidade a 1 e a 0.45, a opacidade lia **0.619 e 0.625** — que são
o mesmo ciclo apanhado em dois sítios diferentes, não duas intensidades.

É exatamente o defeito que a Fase 7Z já tinha encontrado na matéria sazonal —
*uma keyframe que anima uma propriedade substitui o valor base* — e voltei a cair
nele por escrever a regra sem verificar quem já mandava naquela propriedade.

A intensidade passou para **dentro das keyframes**, a multiplicar os dois
extremos do ciclo. Sem evento vale 1 e as keyframes ficam idênticas ao que sempre
foram.

#### Verificado

| medida | resultado |
|---|---|
| o motor está vivo na shell | `data-world="newcycle"` no dia 1 |
| `--arc-accent` intocado | `#fb923c`, o Summer Arc |
| sem acento, a camada é invisível | alfas `[0, 0]` — medido no alfa, não na palavra |
| com acento, pinta | alfas `[0.22, 0.09]` |
| intensidade no horizonte | 0.615 → **0.280** |
| intensidade na matéria | 0.900 → **0.405** |
| **contraste AA** | **61 elementos, zero falhas — com e sem a camada** |
| erros de consola | zero |

O contraste é o gate que decidia se isto entrava. Uma camada nova por cima do
ecrã tem de provar que não baixa a legibilidade, e não bastava argumentar que é
fraca.

#### Três medições minhas que estavam erradas

Nenhuma era defeito do produto, e todas dariam um resultado publicável:

1. procurei `rgb(` no gradiente — o `color-mix(in oklab, ...)` devolve `oklab()`,
   e o teste dava falso negativo sobre a cor não pintar;
2. medi a intensidade **sem arco ativo**: a opacidade era zero dos dois lados e o
   teste não media nada;
3. li a opacidade **durante a transição**, e depois durante a animação. Esperar
   não chegou — foi preciso desligar a transição para ler o valor resolvido, e é
   isso que revelou que o problema era a animação e não o tempo de espera.

#### Reversível

Apagar a linha do `Shell.tsx` que passa `worldVars` desliga a camada inteira: os
valores por omissão (`--world-accent: transparent`, `--world-intensity: 1`) fazem
tudo colapsar para o que era antes.
### Fase 2b — onde o mundo fala (CONCLUÍDA 2026-08-01)

Cada evento tem um `copy` escrito e nenhum aparecia em lado nenhum. A pergunta
não era "mostrar ou não" — era **onde**, e essa escolha tem consequência sobre
quantas vezes o Sistema fala.

#### O que foi recusado, e porquê

**A fila de SYSTEM EVENTS.** Um evento do mundo é um **estado** que dura horas,
não um acontecimento discreto. A fila existe para "subiste de nível" — coisas que
acontecem uma vez. Um estado numa fila de acontecimentos ou faz spam ou precisa
de truques de dedupe para não fazer.

**Entre os sinais da faixa.** O `copy` é uma frase; os sinais são contagens.
Juntá-los dava *"3 sinais no Radar · 1 prazo vencido · Mês novo. O que ficou por
fazer..."* — a faixa vira parágrafo, e **contexto passa a competir com um
alerta**. Um alerta é sempre mais urgente do que contexto.

#### O que ficou

O mundo fala **onde antes estava um texto de reserva**. Sem sinais, a faixa dizia
*"O Oráculo observa."* — uma frase a ocupar espaço com nada. Passa a dizer o que
o mundo tem para dizer, quando tem.

O custo é **zero**: o sítio já estava vazio. E a Constituição fica servida — o
Oráculo continua a não falar por cima de nada que importe.

#### O limiar é o mesmo do acento, e isso não é coincidência

Só `major` e `critical` falam — **o mesmo limiar que decide se o mundo pinta**.

Se o evento não mereceu cor, também não merece palavras. Dois limiares diferentes
para a mesma pergunta seriam duas opiniões sobre o que é importante — que é
exatamente o argumento que já tinha impedido um segundo motor de eventos na
Missão 29.

Na prática: duas ou três vezes por mês.

#### Verificado

| caso | resultado |
|---|---|
| com sinais na faixa | o mundo **não fala** — "2 prazos vencidos" |
| sem sinais nenhuns | *"Mês novo. O que ficou por fazer não desaparece — passa a ser visível."* |
| dia 15, sem evento maior | zero maiores → volta o texto de reserva |
| domingo | o dominante é `silence:notable` — abaixo do limiar, não fala |
| erros de consola | zero |

O caso do domingo mostra a resolução a funcionar por outra razão: o dominante não
é o Domingo, é o **Silêncio**, que tem prioridade maior. O mundo escolheu bem e
mesmo assim calou-se, porque `notable` não chega para falar.
### Fase 3 — a memória do mundo (CONCLUÍDA 2026-08-01)

`cooldownH` e `durationMin` deixam de depender de quem chama.

#### Onde vive, e porque não vive no `app_state`

O `app_state` é **evidência de uma vida** — XP, hábitos, títulos, datas de
nascimento de estrelas — sincronizada com o Supabase e protegida por RLS.

A memória do mundo é **quando a shell mostrou o quê**: um detalhe de
apresentação. Metê-lo no `app_state` fazia-o viajar com evidência de vida,
obrigava a uma migração de schema por um mapa que pode ser perdido sem
consequência, e aumentava o que atravessa a rede em cada gravação, para sempre.

Fica em `localStorage`, chave própria, validade de 72 h.

**O custo, dito e não escondido:** a memória é por dispositivo. Ver um
Governance Radar no telemóvel e depois no computador mostra-o duas vezes. É
aceitável porque **falar duas vezes não é mentir** — é redundância. Se um dia
incomodar, a decisão inverte-se com o custo à frente.

#### O defeito que só apareceu ao ligar as peças

O cooldown estava a ser lido como *"quanto tempo fica escondido depois de
aparecer"*. Com o resolvedor a correr de 5 em 5 minutos, isso significava que um
evento verdadeiro o dia inteiro **aparecia, era gravado, e desaparecia na
resolução seguinte** — porque a memória dizia que já tinha entrado há 5 minutos.

Um estado verdadeiro passava a piscar uma vez por dia.

> **Continuar não é repetir.** Um evento que continua verdadeiro está a decorrer,
> não a repetir-se. O cooldown só se aplica a quem **sai e tenta voltar**.

Concretizado com uma janela de continuidade de 15 minutos — três vezes a cadência
de resolução, folga deliberada para um separador em segundo plano poder falhar
uma ou duas voltas sem que um evento contínuo passe a "novo".

| visto há | resultado |
|---|---|
| 5 min | acende — é o mesmo episódio |
| 3 h | recusado: *"saiu há 3.0 h e só pode voltar ao fim de 20 h"* |
| 25 h | acende — o cooldown passou |

#### A duração reapresenta a prova com que entrou

Um evento dentro da janela fica de pé mesmo quando a regra já devolve `null`, e
**reapresenta a prova original** — não uma nova. Um facto que continua no ecrã
sem origem seria um facto sem prova.

A gravação só regista quem entrou **por prova nova**. Um evento sustentado pela
janela não renova a sua própria data: se renovasse, uma janela de 30 minutos
ficava de pé para sempre, porque cada resolução a empurrava para a frente.

#### `resolveWorld` é público, e a razão importa

**Nenhum evento do catálogo usa `durationMin`** — todos declaram `0`. Um caminho
de código sem utilizador é um caminho por testar, e num motor de regras é onde o
primeiro defeito vai nascer.

A alternativa era dar uma duração a um evento só para o exercitar — mudar o
produto para servir o teste. Em vez disso o resolvedor aceita o catálogo como
argumento, e o comportamento verifica-se com um catálogo próprio.

| caso | ativo | prova |
|---|---|---|
| dentro da janela (10 de 30 min) | **sim** | *"facto de quando entrou"* |
| fora da janela (40 min) | não | — |
| memória sem prova completa | não | — |
| `durationMin: 0` | não | — |
| sem memória nenhuma | não | — |

#### Verificado

A shell grava mesmo: `sistema_world_v1` com `new-cycle` e prova completa. A
memória caduca aos 100 h, sobrevive a JSON inválido sem rebentar, e a gravação
falha em silêncio sem impedir ninguém de usar o Sistema. Zero erros de consola.

#### Um erro meu no método, não no produto

Verifiquei a gravação da shell **depois** dos testes que apagam a chave, e li
*"não gravou"* — era o meu próprio teste a ter apagado o ficheiro. E o ficheiro
de teste, remendado quatro vezes, chegou a um ponto em que as substituições
deixaram de pegar **sem dar erro**: dizia que corria e media a versão anterior.
Reescrito de raiz.
## Missão 28 — Vault Resonance e Core View em Tempo Real
(PLANEADA; extensão das M8, M17 e M22)

Visão: enquanto o Daniel toma notas no Obsidian, fragmentos reais de
conhecimento atravessam o Sistema e convergem para o Núcleo. Não é uma
notificação; é a manifestação visual de alterações comprovadas no Vault.

### Restrições reais

GitHub Pages não consegue observar diretamente o filesystem local. Um watcher
Node (`chokidar`) não corre dentro do browser publicado. A arquitetura deve
separar:

- prova oficial via Obsidian Git/GitHub;
- eventos persistidos via Supabase/Edge Function;
- bridge local opcional para latência de segundos;
- visualização cliente no bus/WebGL.

### Fases

1. **Contrato de evento + mock** — `vault:changed` com ficheiros, domínio,
   dimensão e timestamp; botão/debug dispara fragmentos pré-alocados até ao
   Núcleo.
2. **Prova Git** — webhook/compare API identifica ficheiros realmente
   alterados pelo push do Vault; ignora `.git`, `.obsidian` e conteúdo fora da
   whitelist.
3. **Fila e Realtime** — evento datado em Supabase; cliente consome uma vez,
   confirma processamento e não duplica animação.
4. **Knowledge mapping** — título, tags, pasta, linhas/bytes alterados e
   domínio determinam cor, massa e trajetória; conteúdo sensível não precisa
   de ser enviado para a animação.
5. **Core View** — modo dedicado fullscreen (`core.html`, query mode ou rota a
   decidir após auditoria) com Núcleo, clima/hora, eventos e fluxo do Vault;
   ideal para segundo monitor ou wallpaper futuro.
6. **Bridge local opcional** — watcher local assinado envia evento imediato
   para endpoint autenticado; o push Git continua a ser prova/histórico.

O Núcleo pulsa proporcionalmente, a rede responde e o Oráculo pode comentar
mais tarde; sem alterações reais, não existe espetáculo falso.

### Fase 1 — o contrato do pulso, e o achado que a define (CONCLUÍDA 2026-08-01)

#### O achado

A Edge Function do Oráculo **já lê o vault e já calcula exatamente o que esta
missão precisa**: `vaultChanges()` devolve os ficheiros alterados e os commits
com data e mensagem. Depois **deita tudo fora** — converte-os em prosa para o
modelo ler, e o cliente recebe uma só string (`r.estudo`) dentro do relatório
semanal.

A prova existe, é datada, é por ficheiro, e **morre no servidor**.

Desenhar fragmentos a convergir para o Núcleo a partir de um parágrafo seria
inventar origem, data e peso — a fabricação que a lei *"nada nasce do nada"*
proíbe. Um fragmento sem ficheiro e sem data é uma partícula decorativa com nome
bonito.

#### O que a fase entrega

`app/vault/vaultModel.ts` e `app/vault/vault-read.ts`. Zero pixéis alterados,
pela mesma razão da Fase 1 da M27: o modelo tem de estar certo antes de ter cara.

O read model devolve hoje, honestamente, **nada** — e diz porquê:

> *O Vault ainda não envia pulsos. A ponte lê as notas para o Oráculo, mas não
> guarda quando cada uma mudou — por isso não há nada datado para o Núcleo
> receber. **Não é falta de estudo.***

A última frase é o ponto. Um Núcleo parado sem explicação lê-se como censura ao
Operador; a ausência tem de dizer de quem é a lacuna.

#### Decisões que ficam fechadas

- **`domain` é opcional.** Derivar o domínio do caminho é heurística, e uma
  heurística generosa acerta mais vezes e erra em silêncio. Só atribui quando o
  id do domínio é um **segmento** do caminho — nada de correspondência parcial.
  Sem domínio, o pulso converge para o Núcleo sem passar por uma constelação, o
  que é verdade e não um erro;
- **contam-se NOTAS, não commits.** Dez commits na mesma nota são uma nota
  trabalhada, não dez conhecimentos. Contar commits inflacionaria o céu
  exatamente onde ele deve ser mais honesto;
- **prova incompleta não entra**, tal como no World Engine II: sem caminho ou
  sem data válida, o registo é descartado e a ausência é declarada.

#### O que falta, e é UMA alteração em produção

Persistir `vaultChanges()` em vez de o descartar — no `app_state` do relatório
ou numa tabela — com caminho, data e mensagem por commit.

**Não foi feito de propósito:** a Edge Function é produção, e alterá-la sem
autorização violaria a regra de ouro do projeto. Fica registado em
`LACUNA_DO_PRODUTOR`, no código, com onde, o que já calcula, o que descarta, o
que precisa e o custo — para a decisão ser tomada com o preço à frente.

#### Verificado no browser, contra o módulo real

| caso | resultado |
|---|---|
| estado real de hoje | 0 pulsos, ausência explicada |
| sem estado | mensagem distinta |
| 4 pulsos em 3 notas | 4 pulsos, **3 notas**, ordenados do mais recente |
| domínio pelo caminho | `saber`, `saber`, `oficio`, `sem dominio` |
| 3 registos sem caminho ou sem data | 0 aceites, ausência declarada |
| 10 commits na mesma nota | 10 pulsos, **1 nota** |
| 90 pulsos | teto a 40 |
| erros de consola | zero |
## Missão 29 — AI Lab e AI Governance como Domínios Vivos
(PLANEADA; integra Radar, Vault, Oráculo, missões e eventos)

Objetivo: AI geral e AI Governance tornam-se áreas operacionais do Sistema,
não feeds de notícias nem compliance seco.

### Eventos normais de AI

- AI Radar;
- Model Watch;
- Tool Discovery;
- Prompt Forge;
- Agent Lab Session.

### Eventos especiais de AI

- Model Epoch;
- Agent Breakthrough;
- Automation Chain Complete;
- Tool Mastery.

### Eventos normais de AI Governance

- Governance Radar;
- AI Risk Review;
- Model Inventory Update;
- Human-in-the-Loop Check.

### Eventos especiais de AI Governance

- Governance Signal;
- AI Council;
- Red Flag Event;
- Trust Seal;
- AI Governance Breakthrough.

Cada evento inclui trigger, frequência, prova, output, risco, fonte, ação,
impacto no Núcleo/Oráculo, dados guardados, cooldown e fallback. Exemplos de
prova: release oficial, teste documentado, workflow versionado, inventário,
risk review, logs ativos, approval gate ou framework interno publicado.

Research: fontes oficiais e atuais através de Context7/Tavily; links usados são
registados. Ações externas permanecem human-in-the-loop. O Oráculo interpreta
impacto no percurso de Daniel e pode converter descoberta em missão, estudo,
experimento ou artefacto de portfólio.

### Fase 1 — o inventário (CONCLUÍDA 2026-08-01)

#### Porque é que a Fase 1 é o inventário e não os eventos

O SPEC nomeia dezoito eventos. Ao olhar para o que cada um precisa como prova,
**catorze apontam para a mesma coisa que não existe**: saber que IA é que o
Daniel usa.

"Model Inventory Update" é um evento sobre um inventário que não existe. "AI
Risk Review" é uma revisão de risco sem objeto. "Human-in-the-Loop Check"
verifica supervisão sobre nada.

Os dois que **não** precisam do inventário — AI Radar e Governance Radar — já
têm prova hoje: o Radar já classifica itens em `ai` e `aigov` (`RAREA`). Ficam
para a Fase 2, e serão ligados ao **World Engine II da Missão 27** em vez de a
um registo paralelo. Dois motores de eventos no mesmo produto seriam duas
opiniões sobre o que é importante.

#### Não é compliance seco, e o SPEC é explícito

O que torna isto operacional: o inventário é sobre a IA que o Daniel **realmente
usa** — este assistente incluído, o Oráculo incluído. **Um inventário de IA que
não se inventaria a si próprio seria a primeira coisa a falhar numa auditoria.**

E é o domínio de carreira dele. Manter o inventário **é** estudar, e o estudo
passa a ter prova datada — a diferença entre ler sobre governação e praticá-la
sobre si mesmo.

#### Decisões fechadas

- **Um registo por USO, não por ferramenta.** O mesmo modelo a escrever código e
  a ler documentos são dois riscos diferentes; juntá-los esconde o pior dos dois;
- **sem data, não há avaliação.** Um `risk: baixo` sem `riskAssessedAt` é uma
  opinião, e aparece em `unassessed` independentemente do que o campo diga;
- **um campo ilegível cai para o estado que ADMITE não saber**, nunca para o mais
  benigno. Tratar um risco ilegível como `baixo` seria o Sistema a inventar
  tranquilidade. Verificado: `risk: "inventado"` passa a `por-avaliar`;
  `oversight: "qualquer-coisa"` passa a `por-definir`; `personalData: "talvez"`
  passa a `null`;
- **um uso descontinuado não sai do inventário.** "Já não usamos" é uma resposta
  de auditoria, e apagá-lo destruiria a única prova de que existiu;
- **o cruzamento é que dá a prioridade real**: toca dados pessoais **e** não tem
  avaliação datada. Começa-se por aí, não pelo risco mais alto;
- **não classifica risco por lei.** Os níveis são de trabalho interno. Dizer
  "isto é alto risco ao abrigo do artigo X" sem ter lido o artigo X seria
  inventar autoridade — mesma disciplina da Missão 31;
- **`explainAi` nunca afirma conformidade.** "Está conforme" é conclusão
  jurídica e o Sistema não a produz.

#### A ausência é declarada, e distingue dois casos

> *Não há inventário de IA. Catorze dos dezoito eventos desta missão dependem
> dele. **Um inventário vazio e um inventário inexistente não são a mesma coisa,
> e isto é o segundo.***

Sem esta frase, um painel vazio lê-se como "está tudo bem".

#### Verificado no browser, contra o módulo real

Inventário de teste com cinco usos, incluindo o Claude Code e o próprio Oráculo:

| medida | resultado |
|---|---|
| 5 registados, 1 descontinuado | 4 ativos |
| sem avaliação datada | `radar`, `traducao` |
| revisão em atraso | `oraculo`, **+110 dias** |
| supervisão por definir | `traducao` |
| dados pessoais sem avaliação | `traducao` — a prioridade real |
| campos ilegíveis | caem para `por-avaliar` / `por-definir` / `null` |
| `risk: baixo` sem data | conta como **não avaliado** |
| registos sem id, nome ou data | 0 aceites, ausência declarada |
| erros de consola | zero |

Um defeito meu apanhado a rever a saída: `explainAi` dizia *"1 tocam dados
pessoais"*. O Sistema já tinha corrigido *"1 dias"* no sigilo do Operador, e
repetir o descuido numa frase escrita para quem audita seria pior do que da
primeira vez.
## Missão 30 — Migração Frontend Next Generation
(SUPERADA / ABSORVIDA PELA MISSÃO 25 — 2026-07-25)

Esta missão foi definida em `docs/frontend-migration/` e no SPEC carregado a
2026-07-24 como trabalho futuro e condicionado. À data em que foi escrita, o
trabalho já estava feito: React 18, Vite 6, Zustand, `@supabase/supabase-js`
por npm, o palco WebGL portado e a camada fx/motion completa existiam e
estavam verificados na branch `react-migration` desde 2026-07-22.

Não reabrir. Não reexecutar. O número 30 fica RESERVADO e não deve ser
reutilizado para outra missão, para que qualquer leitura futura do histórico
encontre aqui a explicação em vez de uma lacuna.

O que da documentação dessa missão permanece por decidir — TypeScript, Motion,
React Three Fiber, Drei, pós-processamento e Vercel Preview — vive na matriz
de lacunas técnicas da Missão 26.

## Oráculo Evoluído (Jarvis) — PLANO, não execução

Documento histórico: `ORACULO-ROADMAP.md` (raiz, 2026-07-22). NÃO é missão
aberta — é o esboço original do agente evoluído. Do conselheiro invocado para
Guardião do Núcleo proativo, com ferramentas (MCP), memória verdadeira
(`oracle_memory`) e workflows autónomos (n8n OU Managed Agents). Fases O1–O5
(O1 = memória, a mais barata/reversível, recomendada como 1º passo). É um
programa multi-missão: envolve custo de API contínuo, infra e postura de
segurança — GATE do Daniel em cada fase. Diferencial: construir o próprio
agente GOVERNADO (EU AI Act / ISO 42001 / NIST AI RMF / RGPD) é dogfooding da
carreira dele. Decisões pendentes do Daniel antes de construir: orçamento
mensal, espinha (n8n self-host vs. CMA vs. Edge Function DIY + MCP/memória),
matriz auto-vs-gated. Até lá, nada de autonomia — só o plano.

SUCEDIDO POR: `SYSTEM-ORACLE-CONSTITUTION.md` e `docs/oracle-governance/`
(2026-07-24), que desenvolvem a mesma visão com muito mais rigor — leis,
autoridade, autonomia por níveis, memória, voz, agentes, moderação e gates. O
`ORACULO-ROADMAP.md` preserva-se pelo valor histórico e pela leitura direta
que faz do estado real do Oráculo em julho de 2026; em caso de conflito,
prevalece a Constituição. O programa técnico está abaixo.

## Programa Oracle Intelligence & Governance

### Estatuto

Programa estratégico de longo prazo.

Não é uma única missão e não deve ser executado num big-bang rewrite.

Fonte de autoridade:

- `SYSTEM-ORACLE-CONSTITUTION.md`
- `docs/oracle-governance/00_READ_ME_FIRST.md`

### Visão

Transformar o Oráculo numa camada de inteligência e governação capaz de:

- compreender o estado global do Sistema;
- conversar por texto e voz;
- funcionar como assistente pessoal;
- coordenar Hermes, OpenClaw e n8n;
- gerir a Money Printing Machine;
- moderar automações;
- proteger atenção;
- pedir aprovação;
- explicar decisões;
- aprender com resultados;
- aumentar autonomia de forma gradual.

### Arquitetura conceptual

```text
Daniel
↓
Oracle Interface
↓
Oracle Intelligence Layer
↓
Governance Layer
↓
Execution Layer
↓
Truth and Audit Layer
```

### Sistemas obrigatórios

#### Oracle Gateway

Entrada unificada para:

- texto;
- voz;
- eventos;
- agentes;
- workflows.

#### Context Engine

Constrói contexto mínimo e relevante.

#### Memory Engine

Gere memória factual, episódica, semântica, operacional e de política.

#### Intent Engine

Distingue pergunta, comando, reflexão, aprovação, rejeição, delegação e alerta.

#### Priority Engine

Avalia impacto, urgência, risco, energia, dependências e alinhamento.

#### Planning Engine

Decompõe objetivos em passos.

#### Policy Engine

Decide permitido, proibido ou sujeito a aprovação.

#### Approval Engine

Cria pedidos de aprovação informados.

#### Agent Registry

Mantém papéis, permissões, custos, métricas e kill switches.

#### Delegation Engine

Escolhe agente com base em competência, custo, risco e privacidade.

#### Attention Engine

Decide quando, como e se o Oráculo deve interromper.

#### Audit Engine

Guarda Decision Records e Action Ledger.

#### Voice Engine

Gere STT, TTS, push-to-talk, barge-in, confiança e sessões.

### Fases

#### Missão O-00 — Constituição e baseline

- consolidar documentos;
- mapear capacidade atual;
- identificar dados e endpoints;
- definir riscos;
- não adicionar autonomia.

#### Missão O-01 — Oracle Core

- gateway textual;
- contexto;
- intent;
- respostas estruturadas;
- explicabilidade;
- estados reais.

#### Missão O-02 — Memory Foundation

- modelos;
- origem;
- confiança;
- correção;
- remoção;
- retenção;
- memória proposta antes de persistência sensível.

#### Missão O-03 — Voice v1

- push-to-talk;
- transcrição;
- TTS;
- comandos internos;
- confirmação;
- fallback textual;
- logs.

#### Missão O-04 — Personal Assistant

- briefing;
- debrief;
- brain dump;
- diário;
- tarefas;
- agenda;
- foco;
- lembretes;
- acompanhamento.

#### Missão O-05 — Governance Core

- policy engine;
- approval engine;
- permission model;
- risk engine;
- kill switch;
- action ledger.

#### Missão O-06 — Agent Registry

- Hermes;
- OpenClaw;
- n8n;
- task contracts;
- reputação;
- custos;
- timeout;
- rollback.

#### Missão O-07 — Proactive Oracle

- attention engine;
- padrões;
- notificações;
- escalada;
- Silent Mode;
- Recovery Mode.

#### Missão O-08 — Money Machine v1

- Opportunity Radar;
- Lead Engine;
- Research Engine;
- scoring;
- drafts;
- aprovação humana.

#### Missão O-09 — Money Machine v2

- CRM;
- follow-ups;
- Offer Engine;
- Delivery Engine;
- métricas;
- aprendizagem.

#### Missão O-10 — Ambient Oracle

- wake word;
- sessões contínuas;
- dispositivos;
- presença ambiente;
- políticas adicionais.

#### Missão O-11 — Advanced Autonomy

- autonomia por domínio;
- orçamentos;
- simulação;
- auto-recovery;
- reputação;
- supervisão.

### Modelos obrigatórios

Toda a ação deve ter:

- ID;
- intenção;
- utilizador;
- agente;
- política;
- risco;
- aprovação;
- estado;
- custo;
- timestamps;
- output;
- erro;
- rollback.

Estados:

```text
draft
pending_approval
approved
queued
running
waiting
verifying
completed
failed
cancelled
rolled_back
```

### Critérios de aceitação

#### Verdade

- não inventa;
- distingue confiança;
- confirma persistência;
- explica origem.

#### Voz

- escuta visível;
- cancelamento;
- transcrição;
- confirmação;
- privacidade.

#### Memória

- auditável;
- corrigível;
- removível;
- finalidade clara.

#### Autonomia

- política;
- aprovação;
- limites;
- kill switch;
- rollback.

#### Agentes

- registry;
- contrato;
- retorno estruturado;
- métricas;
- sem autoelevação.

#### Money Machine

- legítima;
- sem spam;
- entrega possível;
- custos visíveis;
- aprovação.

#### UI

- não parece chatbot genérico;
- mostra estados reais;
- permite interromper;
- integra-se no Sistema.

### Não objetivos iniciais

- autonomia total;
- wake word always-on;
- envio automático em massa;
- pagamentos automáticos;
- alteração automática de objetivos;
- memória ilimitada;
- substituição humana em decisões críticas.

### Gate de produção

Nenhuma fase entra em produção sem:

- testes;
- logs;
- policy check;
- rollback;
- permissões mínimas;
- observabilidade;
- aprovação do Daniel.

## Backlog — fila canónica (reconciliada 2026-07-25)

Fusão das duas filas que existiam em paralelo: a da branch (atualizada
2026-07-19) e a do pacote documental de 2026-07-24.

1. **Missão 26 — Renaissance Visual** (ATIVA). Fase 0 em curso.
2. **Gate de produção da Missão 25** — os três passos manuais do Daniel
   (Pages → GitHub Actions; Supabase Auth URL; merge para `main`) mais o
   teste da branch com a conta real. Não depende da Missão 26 e pode ser
   levantado antes, se o Daniel quiser o React em produção já.
3. **Missão 27 — World Engine II** — estações, calendário simbólico, eventos
   de prova e estados compostos.
4. **Missão 28 — Vault Resonance + Core View** — fluxo real do conhecimento
   para o Núcleo.
5. **Missão 29 — AI Lab + AI Governance** — eventos normais/especiais,
   inventário, risco, experiências e provas.
6. **Programa Oracle Intelligence & Governance** — ver a secção acima e
   `docs/oracle-governance/17_PHASED_ROADMAP.md`. Gate de custo e segurança
   do Daniel em cada etapa.
7. **Sprint 6b permanente** — fricção real de uso, bugs e polimento fino.
   Aberto desde 2026-07-19. Nota: o 2º item registado (bug do `pendingEnter`
   preso no fly-in das Constelações) foi corrigido e verificado.
8. **Modo Estação** — CONCEITO PRESERVADO, decisão visual pendente. Não é um
   item de implementação: a decisão (A renascer / B absorver / C retirar)
   toma-se durante as três direções visuais da Missão 26. Ver a secção "Modo
   Estação" dessa missão.
9. **Sons opt-in** — só com o gosto do Daniel presente e budget próprio.
10. **Recall adaptativo** — gated por histórico de uso suficiente.

Ideias recuperáveis, fora da fila principal: Evidence Locker com Storage nos
Títulos Reais; PWA e notificações push (o `enableNotif`/`checkNotif` do
Vanilla não foi migrado); injeção automática de perguntas pelo Oráculo na
Revisão Ativa (gancho `oracleRefreshQuestions()` criado na Missão 5 — exige
decisão de custo); transformação da Core View em app/wallpaper. Abrem missão
apenas quando existir valor e gate claro.

Já pagas a 2026-07-19 (Missão 20): exportação .ics e limpeza do token `?t=`.
