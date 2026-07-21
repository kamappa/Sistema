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
(EM CURSO — Fase A concluída 2026-07-20)

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

## Missão 25 — Foundation: migração para React + Vite (EM CURSO)
Branch `react-migration` (o `main` Vanilla fica intacto como ponto de
retorno; merge só no fim, com aceitação toda verde). Fase 1 de um plano de
dois tempos; a Renaissance visual é a Missão 26, prompt separado, só depois
desta base estar estável em produção.

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

## Backlog — fila atual (ordenada; atualizada 2026-07-19)

1. Sprint 6b da M12 — polimento fino com a fricção de uso real do Daniel
   (aberto em permanência; 1º item registado a 2026-07-19).
   2º item (2026-07-19, auditoria própria ao dia de ~20 commits): releitura
   integral do constellation.js apanhou um bug real — dblclick (ou chip
   Universo) DURANTE um fly-in cancelava a viagem mas deixava pendingEnter
   preso, matando wheel e cliques do painel até recarregar; resetCam passa
   a limpá-lo, e o arrasto deixou de poder iniciar durante o fly-in.
   Verificado headless: fly-in interrompido → painel continua vivo e o
   clique seguinte volta a mergulhar.
2. Universe Navigation — fases seguintes ("estação espacial total":
   eliminar o scroll, zonas por câmara — missão multi-sprint com plano
   próprio quando o Daniel quiser). Rege-se pela Camada II do roadmap
   (ver Missão 12): o Sistema é um único organismo sem páginas, a câmara
   desloca-se dentro dele e respira sempre; Motion Hierarchy e Idle
   Motion aplicam-se a todas as zonas
3. Sons opt-in (contexto novo do roadmap — Oráculo/mundo; exige o gosto
   do Daniel presente)
4. Camada adaptativa do recall — gated: exige histórico de uso suficiente
3. Sons opt-in (contexto novo do roadmap — Oráculo/mundo)
4. Camada adaptativa do recall — gated: exige histórico de uso suficiente

Ideias antigas retiradas da fila (recuperáveis se voltarem a ganhar
prioridade): botões Aceitar/Recusar do relatório a escrever no estado;
Evidence Locker (Storage nos Títulos Reais); PWA + notificações push;
injeção de perguntas do Oráculo na Revisão Ativa
(`oracleRefreshQuestions()`, gancho criado na Missão 5 — exige decisão de
custo do Daniel). Já pagas a 2026-07-19 (Missão 20): exportação .ics e
limpeza do token `?t=`.
