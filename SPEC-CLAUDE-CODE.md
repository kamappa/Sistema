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

### Por fazer da Fase 6/7 — NÃO COMEÇADO

Por ordem de dependência, não de valor:

1. **Relatório do Oráculo por camadas** (6B) — resumo executivo, sinais,
   evidência, interpretação, análise completa recolhida. É a maior queixa de
   legibilidade em aberto;
2. **Preview e cerimónia do Summer Arc** (7) — o motor está feito, a
   experiência não;
3. **Treino em fluxo guiado** (7) — o espaço existe e o painel de Treino entra
   nele **inteiro, sem redesenho**. A sessão guiada de calistenia, os modos
   guiado/rápido para o treino e as demonstrações por exercício ficam por
   fazer; o que está feito é o padrão, provado nas duas rotinas novas;
4. **Universo** (6C) — campo celeste navegável, assinaturas por atributo,
   conquistas e sigilos paramétricos;
5. **Radar** (6E) — estado vazio operacional, scanning, sinais;
6. **Escada de Ascensão** (6D);
7. **Calendário** (6F) — today vs selected, e os restantes estados;
8. **Entrada e transições de zona** (6G).

### Por fazer

- **War Room** ligado a dados;
- **performance** nunca medida: bundle em 996 KB de JS, FPS em mobile e tempo de
  arranque por medir;
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
