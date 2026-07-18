# SPEC — Sessão Claude Code · Sistema (Daniel)

> Este ficheiro é a memória de engenharia do projeto. O Claude Code deve lê-lo
> antes de qualquer alteração. Regras de ouro: propor antes de alterar (mostrar
> diff), uma fase de cada vez, tudo o que gera dados fica estruturado e datado
> (pronto para o Oráculo), e "o sistema nunca mente".

## Estado atual (v1.0 — julho 2026)

- Frontend: `index.html` único (~128KB) em GitHub Pages (kamappa/Sistema)
- Backend: Supabase — auth, `app_state` (JSONB, RLS), `radar_items`, `oracle_reports`
- Oráculo: Edge Function `oraculo` (modos radar diário / report semanal),
  agendada por pg_cron; chaves em Secrets (ANTHROPIC_API_KEY, ORACLE_TOKEN)
- Sistemas no HUD: atributos+ranks E-S, hexágono, hábitos (3 obrigatórios com
  penalização + extras personalizáveis), missões (quadro antigo), objetivos-mestra
  (triagem automática de prioridade/área/tags, prazos, faixa URGENTE, Sombras),
  treino calistenia (4 linhas de força + pavimento pélvico, 8 passos,
  adaptação, teto diário de XP), regulador de sono (backfill, anti-farm),
  calendário, conquistas, debuffs, skill trees,
  Títulos Reais (evidência), World Engine (arcos sazonais, meteo, sussurros,
  Double XP), Radar Diário (notícias + alto impacto + missões deriváveis),
  relatório do Oráculo (com missões propostas, recompensa, título da semana),
  Revisão Ativa (banco de perguntas, seleção diária + repetição espaçada SM-2,
  painel "Revisão do Dia", streak de estudo, perguntas próprias, gancho para
  o Oráculo injetar perguntas)

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

## Missão 12 — Living Operating System (EM CURSO)

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
- 1D (parte automatizável CONCLUÍDA 2026-07-18; aguarda medição em hardware
  real): reduced-motion emulado por CDP → tier off, engine ausente, tilt
  morto; consola limpa em todas as corridas; overlay `?fps=1`
  (tier · ms · fps · ↓ se degradado · pausado). Falta: 60fps confirmados
  pelo Daniel no desktop e no Brave do telemóvel (após push), teste de
  reduced-motion e de separador oculto em aparelho real.

Sprints seguintes (roadmap): 2 World Engine · 3 Motion · 4 Constellation
System · 5 Oráculo vivo · 6 Polimento.

## Backlog — fila atual (ordenada; atualizada 2026-07-18)

1. Missão 12 — Living Operating System (EM CURSO, Sprint 1)
2. Vigia de Estágios
3. Sons opt-in (o roadmap da Missão 12 dá-lhes contexto novo — Oráculo/mundo)
4. Camada adaptativa do recall — gated: exige histórico de uso suficiente

Ideias antigas retiradas da fila nesta revisão (recuperáveis se voltarem a
ganhar prioridade): botões Aceitar/Recusar do relatório a escrever no estado;
Evidence Locker (Storage nos Títulos Reais); PWA + notificações push;
exportação .ics; injeção de perguntas do Oráculo na Revisão Ativa
(`oracleRefreshQuestions()`, gancho criado na Missão 5); limpeza do token
`?t=` em query param no radar/report.
