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
7. Identificar a missão ativa. A Missão 24 deve ser concluída ou colocada em
   pausa de forma explícita antes de abrir uma nova missão.
8. Propor uma única fase, com objetivo, ficheiros, riscos, testes e rollback.
9. Esperar autorização antes de aplicar alterações.

O ficheiro gigante de recuperação não deve ser executado como um prompt único.
As ideias foram consolidadas nas Missões 25–29 e na Camada III do ROADMAP.

## Estado atual documentado (julho de 2026)

- Baseline de produção: aplicação estática em GitHub Pages, sem build step
  obrigatório; scripts clássicos globais e ilha WebGL de ES modules em
  `js/stage/` com Three.js r170 vendorizado.
- `index.html` contém a shell e carrega a ordem de scripts documentada;
  `css/hud.css` concentra o estilo. O Modo Estação adicionou
  `js/estacao.js` entre memória e navegação.
- Supabase: auth, `app_state` JSONB com RLS, `radar_items`, `oracle_reports` e
  Edge Function `oraculo`.
- Oráculo: Radar, relatório semanal, Conselho, Sussurro, contexto do Vault,
  profecias e voz de Guardião do Núcleo.
- Vault: Obsidian Git → repo privado `vault-sistema`; apenas conteúdo
  whitelisted; leitura leve/profunda e escrita de relatórios.
- Visual: céu procedural, Solar Engine, meteo, motion físico, constelações de
  evidência, Vista de Universo, Celestial Core multicamada, câmera em idle,
  World Engine reativo e Modo Estação.
- Sistemas funcionais: missões, hábitos, treino, sono, revisão ativa, títulos,
  memória, Radar, Oráculo, calendário e navegação.
- Missão ativa: **Missão 24 — Estação Espacial**. Fases A e B estão concluídas;
  gestos globais, profundidade/foco e calibração real permanecem planeados.
- Qualquer branch experimental React/Vite deve ser tratada como experiência
  separada. Não assumir que substituiu esta baseline sem reconciliação,
  testes, plano de rollback e decisão explícita.


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

## Missão 25 — Ambiente Autónomo do Claude Code e Inteligência Visual
(PLANEADA; gate: concluir ou pausar formalmente a Missão 24)

Objetivo: dar ao Claude Code olhos, pesquisa atual, testes e memória de design,
sem tocar na lógica funcional do Sistema. Esta missão consolida a preparação
que estava dispersa no chat perdido.

### Fase A — segurança e baseline

- Revogar/regenerar qualquer API key que tenha sido colada em chats ou
  documentos. Nunca copiar segredos para o repo.
- Confirmar `.gitignore` para `.env`, `.env.local`, chaves, certificados e
  ficheiros privados.
- Guardar screenshots e vídeo curto da baseline desktop/mobile.
- Registar branch, commit e estado de produção antes de instalar ferramentas.

### Fase B — ferramentas obrigatórias

Verificar, instalar e provar funcionamento; não presumir:

- Claude Code CLI/IDE funcional na raiz do repo;
- Claude in Chrome com acesso limitado a localhost;
- Context7 para documentação técnica atual;
- Tavily MCP ou alternativa aprovada para pesquisa web geral;
- Playwright MCP para screenshots, fluxos e comparação desktop/mobile;
- Chrome DevTools MCP para DOM, consola, network e performance;
- plugin/skill `frontend-design`;
- `claude-code-setup`;
- `skill-creator`;
- `superpowers`;
- `ui-ux-pro-max`;
- 21st.dev Magic.

`superpowers`, `ui-ux-pro-max` e 21st.dev Magic são requisitos formais desta
missão, não extras opcionais. A Missão 25 não pode ser considerada concluída
sem:

1. instalação concluída ou método oficial equivalente documentado;
2. confirmação de que cada ferramenta aparece disponível na sessão;
3. uma tarefa curta de prova executada com sucesso;
4. registo de versão, origem e limitações;
5. confirmação de que nenhuma ferramenta expôs segredos, alterou produção ou
   substituiu silenciosamente a arquitetura do projeto.

Se alguma destas três ferramentas estiver temporariamente indisponível,
incompatível ou tiver mudado de nome/comando, o Claude Code deve:

- pesquisar a documentação/origem atual;
- apresentar o bloqueio exato;
- propor a forma correta de instalação;
- não marcar a fase como concluída;
- não a substituir por outra ferramenta sem aprovação explícita do Daniel.

Estas ferramentas complementam-se:

- `superpowers` disciplina planeamento, decomposição, debugging e execução;
- `ui-ux-pro-max` estrutura a direção visual, sistema de design e auditoria UX;
- 21st.dev Magic acelera geração e exploração de componentes premium e
  variações visuais, sempre sujeitas à identidade do Sistema e a revisão
  humana.

Nenhuma delas pode gerar ou impor um redesign genérico. Todo o output deve ser
filtrado pelas regras do `CLAUDE.md`, pela skill
`sistema-visual-director` e pelos critérios de aceitação do ROADMAP.

TypeScript LSP é obrigatório se a nova frontend branch usar TypeScript e
continua útil para a Edge Function. Na baseline atual, o frontend permanece
JavaScript clássico até existir uma missão explícita de migração. Não instalar
ferramentas adicionais só porque foram mencionadas fora deste conjunto.

### Fase C — skills locais versionadas

Criar em `.claude/skills/`, sem duplicar regras contraditórias:

- `sistema-visual-director`;
- `sistema-world-engine`;
- `sistema-motion-director`;
- `sistema-performance-guardian`;
- `sistema-deploy-gatekeeper`;
- `sistema-ai-lab`;
- `sistema-governance-engine`.

As skills devem referenciar `CLAUDE.md` e o ROADMAP, não copiar centenas de
linhas entre si.

### Fase D — prova de funcionamento

- `/skills` mostra as skills locais.
- `/mcp` mostra os servidores ligados.
- Claude in Chrome descreve corretamente URL e elementos visíveis sem receber
  screenshot no prompt.
- Context7 confirma uma API atual do Three.js usado no projeto.
- Tavily pesquisa uma fonte oficial e lista a origem.
- Playwright captura desktop e mobile.
- DevTools lê consola e network.
- `superpowers` produz um plano faseado para uma alteração real sem editar
  código.
- `ui-ux-pro-max` cria ou atualiza uma peça concreta da bíblia visual do
  Sistema e audita a shell atual.
- 21st.dev Magic gera pelo menos uma variação de componente em ambiente de
  teste, que é avaliada contra a pergunta: “parece Sistema ou dashboard AI?”.
- Relatório final: capacidade, estado, versões, limitações e custo de contexto.

Critério de conclusão: o Claude pode investigar, observar, testar e propor sem
trabalhar às cegas; zero segredos no git e zero alteração funcional.

## Missão 26 — O Verdadeiro Sistema · Shell sem aspeto de AI Dashboard
(PLANEADA; gate: Missão 25 concluída e M24 fechada/pausada)

Objetivo: segunda passagem de direção artística sobre a shell global. Não
reconstruir Constelações, Núcleo ou World Engine já implementados; fazer com
que o resto do HUD pertença ao mesmo universo e deixe de parecer uma grelha de
cartões gerada por AI.

### Fase A — auditoria visual real

- Claude in Chrome + screenshots desktop/mobile.
- Inventário de componentes, CSS, estados e ficheiros que controlam: topbar,
  saudação, Operator Identity, World Shift, missões, Radar, Oráculo,
  calendário, treino e revisão.
- Matriz: manter / refinar / fundir / retirar.
- Medir densidade, hierarquia, contraste, largura de texto, repetição de
  borders e custo de motion.

### Fase B — design system compatível com a stack atual

- Tokens de luz, superfície, profundidade, tipografia, spacing, estados e
  motion em CSS/JS existentes.
- Uppercase espaçado apenas em micro-labels.
- Painéis operacionais com borda seletiva, materiais e profundidade; nunca
  glassmorphism uniforme em tudo.
- Referências usadas por função: Linear (hierarquia), Raycast (command
  center), Stripe (luz), VisionOS (camadas), Framer (motion), Lusion/Active
  Theory (atmosfera). Sem cópia literal.

### Fase C — herói e shell

- Reescrever a hierarquia do topo: identidade do Sistema, estado do Operador,
  fase temporal/climática e prioridade atual.
- Operator Identity deixa de ser um card RPG genérico.
- World Shift torna-se acontecimento do mundo, não banner.
- O background, painéis e topbar partilham a iluminação do Solar/World Engine.

### Fase D — Radar e Oráculo

- Radar = feed técnico compacto, temporal e operacional.
- Oráculo = presença nobre, silenciosa e contextual, não um card equivalente
  aos restantes.
- Tipografia e largura de leitura adequadas a relatórios longos.

### Fase E — motion e validação

- Motion comunica estado; sem hover gratuito ou pulso em todos os painéis.
- Desktop/mobile/reduced-motion, build inexistente preservado, consola limpa.
- Comparação visual antes/depois pelo browser real.

Critério de conclusão: um screenshot novo já não parece um dashboard AI; a
shell integra-se no mundo existente sem quebrar lógica, touch ou performance.

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
(PLANEADA; depende da conclusão da Missão 25 e da decisão formal sobre a Missão 24)

Fonte de autoridade:

`docs/frontend-migration/00_READ_ME_FIRST.md`

### Objetivo

Criar a frontend de próxima geração do Sistema em TypeScript + React + Vite,
com design system próprio, Motion, Three.js e React Three Fiber seletivo,
preservando Supabase, os dados, a lógica, o Oráculo, o Vault e a produção
estável.

Esta missão não é uma modernização tecnológica isolada. Existe para permitir:

- uma shell visual verdadeiramente renovada;
- hierarquia e composição premium;
- componentes reutilizáveis e testáveis;
- motion físico e consistente;
- universo e World Engine integrados;
- melhor desktop e mobile;
- previews seguros;
- crescimento sustentável durante anos;
- eliminação da aparência de dashboard AI.

### Dependências obrigatórias

A missão só pode começar quando:

1. a Missão 25 estiver concluída;
2. Superpowers, ui-ux-pro-max e 21st.dev Magic estiverem instalados e testados;
3. Claude in Chrome, Context7, Tavily, Playwright e DevTools estiverem ativos;
4. existir baseline visual;
5. existir branch de migração aprovada;
6. a produção atual estiver identificada e preservada;
7. o Daniel aprovar o plano da Fase 0 e Fase 1.

### Arquitetura-alvo

- TypeScript;
- React;
- Vite;
- CSS moderno e design tokens;
- Motion / Framer Motion para UI;
- Three.js;
- React Three Fiber apenas quando trouxer valor real;
- Drei;
- `@react-three/postprocessing`;
- Supabase preservado;
- Vercel usado primeiro para Preview;
- n8n, Hermes e OpenClaw apenas em missão posterior.

### Estratégia

Usar migração incremental paralela:

```text
main
└── versão estável atual

migration/react-shell
└── nova frontend TypeScript + React + Vite
```

A nova frontend começa em modo read-only, lendo o mesmo `app_state` por uma
camada de adaptação tipada. A escrita entra módulo a módulo depois de testes de
paridade.

### Fases

0. preparação, branch, baseline, ferramentas e Vercel Preview;
1. fundação React/Vite/TypeScript;
2. shell visual;
3. design system;
4. World Engine;
5. universo, constelações e Celestial Core;
6. migração funcional gradual;
7. testes reais e paridade;
8. decisão explícita de produção.

### Regras invioláveis

- não fazer big-bang rewrite;
- não apagar a frontend estável;
- não alterar auth, backend e frontend ao mesmo tempo;
- não ativar escrita antes de paridade;
- não aceitar componentes gerados por AI sem direção artística;
- não migrar produção só porque o build funciona;
- não permitir que WebGL substitua a UI DOM operacional.

### Gates

A missão só avança quando os gates definidos em
`docs/frontend-migration/09_ACCEPTANCE_GATES.md` forem cumpridos:

- fundação;
- visual;
- motion;
- performance;
- dados;
- produção.

### Relação com Vercel

Vercel entra cedo como Preview Deployment e não como justificação visual. A
qualidade vem da direção artística, design system, implementação e validação.

A produção só migra quando:

- paridade funcional estiver comprovada;
- Supabase/Auth/RLS funcionarem;
- mobile e desktop estiverem aprovados;
- performance estiver aprovada;
- rollback estiver documentado;
- houver aprovação explícita do Daniel.

### Ordem posterior

n8n, Hermes, OpenClaw, autonomous workflows e Money Print entram apenas depois
de a frontend estabilizar. O primeiro objetivo é construir a casa visual e
arquitetural correta antes de acrescentar agentes autónomos.

## Backlog — fila canónica (atualizada com a recuperação do chat)

0. **Reconciliação obrigatória da branch** — se existir uma migração
   React/Vite ou trabalho não documentado, comparar com esta baseline antes de
   qualquer deploy. Não apagar nem fundir por impulso.
1. **Missão 24 — Estação Espacial** — concluir ou pausar formalmente:
   gestos globais, profundidade/foco e calibração do dolly em hardware real.
2. **Missão 25 — Ambiente Autónomo do Claude Code** — olhos, pesquisa,
   testes, skills e segurança de segredos.
3. **Missão 26 — Shell sem aspeto de AI Dashboard** — auditoria e direção
   artística da interface global.
4. **Missão 27 — World Engine II** — estações, calendário, eventos de prova e
   estados compostos.
5. **Missão 28 — Vault Resonance + Core View** — fluxo real do conhecimento
   para o Núcleo.
6. **Missão 29 — AI Lab + AI Governance** — eventos normais/especiais,
   inventário, risco, experiências e provas.
7. **Missão 30 — Migração Frontend Next Generation** — TypeScript, React, Vite, Vercel Preview e migração incremental com paridade.
8. **Sprint 6b permanente** — fricção real, bugs e polimento fino.
9. **Sons opt-in** — só com gosto do Daniel presente e budget próprio.
10. **Recall adaptativo** — gated por histórico suficiente.

Ideias recuperáveis que continuam fora da fila principal: Evidence Locker com
Storage, PWA/push, injeção automática de perguntas pelo Oráculo e transformação
da Core View em app/wallpaper. Abrem missão apenas quando existir valor e gate
claro.

# Missão 31 — Agenda Viva: Horário, Cadeiras, Notificações, Diário e Oráculo de Aulas

Estado: planeada. Antes de começar, seguir o protocolo do `CLAUDE.md` e declarar como
esta missão se ordena face às Missões 24, 25, 30 e 32. A Missão 30 migra o frontend
para React: toda a lógica nova vive no Supabase (tabelas, RPC e Edge Functions), e o
frontend vanilla só consome. Assim a migração herda tudo sem reescrever regras.
O perfil do Oráculo e as missões propostas NÃO fazem parte desta missão: estão na
Missão 32.

## Ordem proposta (Missões 31 a 34)

1. **Missão 34 — Sessões de Estudo** (cronómetro). Pequena, independente, útil no
   primeiro dia. Serve para eu começar a usar o Sistema antes de construir mais.
2. **Missão 31 — Agenda Viva**, Fase A (cópias de segurança primeiro), depois B e C.
3. **Missão 33 — Ritual de Entrada**, entre a Fase A e a Fase B da 31.
4. **Missão 31**, Fase D (editor e Biblioteca).
5. **Missão 32 — Memória do Oráculo**, só depois da Fase C da 31 e de 2–3 semanas de
   uso real.

A decisão sobre como isto se ordena face às Missões 24, 25 e 30 é do Daniel, e o Claude
Code propõe antes de avançar.

## Objetivo

O Sistema passa a conhecer o meu horário real (aulas do IPCA e turnos da Worten), as
minhas cadeiras e os seus programas, e os meus exames. Mostra tudo num calendário com
horas e salas, guarda o histórico de cada dia, avisa-me no PC e no iPhone, e o Oráculo
usa esta informação para resumir aulas, responder a pedidos e planear exames. Nunca
inventa matéria, datas ou horários.

## Princípios invioláveis

1. **Uma única verdade.**
   - Horário, turnos, exceções, cadeiras, programas e exames vivem no Supabase e
     editam-se no Sistema.
   - O texto (notas de aula) vive no vault (`kamappa/vault-sistema`).
   - O Obsidian recebe espelhos só de leitura em `Oraculo/`.
   - As linhas de `Sistema/Horario/alteracoes.md` entram sempre como PENDENTES.
2. **O código preenche o calendário, não o modelo.**
   - O modelo só é usado para:
     - extrair informação de PDFs e imagens (horários, programas);
     - interpretar pedidos de agendamento em linguagem natural.
   - O resultado é sempre JSON estrito, validado por código, e só entra no calendário
     através das mesmas funções que os botões usam.
   - A extração de ficheiros é sempre uma proposta que eu confirmo. O agendamento segue
     as regras da secção "Agendamento pelo Oráculo".
3. **Sem fonte, sem afirmação.**
   - O Oráculo só fala de matéria que exista no programa confirmado de uma cadeira ou
     nas minhas notas.
   - Sem programa confirmado, diz isso e não teoriza.
   - O progresso ("tema dado") só conta depois de eu o confirmar.
4. **A cadeira é a pasta que contém `Aulas/`.**
   - Regra estrutural, não posicional: dado o caminho de uma nota de aula, a cadeira é
     a pasta imediatamente acima de `Aulas/`. Não é "a pasta dentro de `IPCA/`".
   - `IPCA/Base-de-Dados/Aulas/x.md` → cadeira `Base-de-Dados`, semestre corrente.
   - `IPCA/_Arquivo/2025-26-S2/Etica/Aulas/x.md` → cadeira `Etica`,
     semestre `2025-26-S2`.
   - O que estiver entre `IPCA/` e a pasta da cadeira é o semestre; se não houver nada,
     é o semestre corrente. Uma cadeira arquivada continua legível e identificada.
   - Isto vale para qualquer domínio, não só `IPCA/`: a regra é a mesma em
     `Sistema/<Domínio>/<Item>/Aulas/`.
   - **Atribuir e enumerar são duas coisas diferentes.** A regra acima atribui uma nota
     de aula à sua cadeira. Para *enumerar* as cadeiras que existem, o marcador é outro:
     uma pasta é cadeira quando tem um `_index.md` com o campo `cadeira:` no
     frontmatter. Nas cadeiras ativas traz também `ects:`, `semestre:` e `aulas:`; nas
     arquivadas só `cadeira:` e `semestre:` (decisão de 2026-09-23: manda o contrato do
     vault — o ECTS e as aulas de uma cadeira acabada não têm uso, e vazio é honesto).
   - A razão é concreta: uma cadeira que eu faça só por exame não tem `Aulas/` nenhuma,
     e pela regra de atribuição seria invisível. O `_index.md` é declaração explícita,
     não inferência a partir da forma da pasta.
   - **A regra só funciona se os dados a acompanharem.** Toda a pasta de cadeira tem
     `_index.md` com `cadeira:`, incluindo as arquivadas — se faltar numa, essa cadeira
     deixa de existir para o Oráculo, em silêncio. Duas consequências operacionais:
     arquivar uma cadeira nunca lhe tira o `_index.md`, e uma cadeira nova sem
     `_index.md` é um erro que o Sistema assinala em vez de tolerar.
   - Isto também é o que torna a regra utilizável hoje: o Git não guarda pastas vazias,
     por isso uma cadeira recém-criada não tem `Aulas/` no repositório até eu escrever
     a primeira nota. Pela regra de atribuição, o Oráculo veria zero cadeiras. Pelo
     `_index.md`, vê-as todas desde o primeiro dia.
   - Em caso de divergência entre o `_index.md` do vault e a tabela `courses`, manda a
     tabela. O `_index.md` é etiqueta para eu ler; o Sistema é a fonte operacional.
   - **Id da aula.** Cada nota de aula tem um id estável: `AAAA-MM-DD`, com sufixo
     `-2`, `-3`… quando há mais do que uma aula dessa cadeira no mesmo dia. O id está
     no frontmatter (`id:`) e é também o prefixo do nome do ficheiro.
   - O resto do nome é livre e serve para eu ler
     (ex.: `2026-09-22 — Aula 03 — Base-de-Dados.md`). Posso mudá-lo quando quiser.
   - **Tudo o que o Oráculo escreve é nomeado pelo id, nunca pelo nome completo:**
     `<id>-resumo.md`, `<id>-pedido.md`, `<id>-transcricao.md`. Assim, renomear a
     minha nota nunca parte nada.
   - Ordem de leitura do id: frontmatter `id:` primeiro; se faltar, o prefixo
     `AAAA-MM-DD[-n]` do nome do ficheiro.
   - Nenhum outro metadado é obrigatório dentro da nota.
   - **Marcas inline.** Dentro do corpo da nota posso escrever duas marcas, no sítio
     exato a que se referem:
     - `#exame` — o professor disse que isto sai, ou eu percebi que é matéria de
       avaliação;
     - `#duvida` — não percebi isto, ou ficou por esclarecer.
   - São marcas, não categorias, e por isso são planas em vez de seguirem a hierarquia
     `tipo/` e `estudo/` do resto. A consistência perde aqui de propósito: isto é
     escrito enquanto alguém está a falar, e duas sílabas é o máximo de atrito
     aceitável.
   - O Oráculo lê cada marca **com o parágrafo à volta**, não só o facto de existir.
     Um `#exame` sem contexto não vale nada; o que vale é "o parágrafo sobre a cláusula
     6.1.2 está marcado como matéria de exame".
   - O que as marcas alimentam: `#exame` entra nos planos de estudo e na priorização
     (ver `ects` e a relevância na Missão 32); `#duvida` é gatilho de proposta de
     missão e aparece no resumo pós-aula como lacuna por fechar.
   - Uma marca nunca é apagada nem alterada pelo Oráculo. Se eu resolver uma dúvida,
     sou eu que tiro o `#duvida`.
   - **Datas de exame não vivem no vault.** Vivem na tabela do Sistema, e só lá. Uma
     data em dois sítios é uma data que um dia vai divergir, e neste caso a divergência
     custa-me um exame.
   - Várias aulas da mesma cadeira no mesmo dia: nomes diferentes com o mesmo prefixo de data (o modelo Templater numera a aula). Correspondência com as ocorrências
     do calendário:
     1. se o número de notas e o de aulas assistidas (sem `cancelada`/`nao_vou`)
        coincidem, emparelhar por ordem (sem sufixo = 1.ª aula, `-2` = 2.ª, …);
     2. se não coincidem, emparelhar cada nota com a aula cujo horário contém (ou está
        mais perto de) o primeiro commit dessa nota;
     3. se continuar ambíguo, não adivinhar: o resumo é feito na mesma, e o Sistema
        pergunta "esta nota é da aula das 10:30 ou das 14:00?".
   - Aulas de cadeiras diferentes no mesmo dia não colidem: cada uma tem o seu
     `AAAA-MM-DD.md` na sua pasta.
5. **Análise pós-aula só com prova.**
   - Só corre se existir a nota da aula com commit posterior ao início da aula.
   - Sem nota, não faz nada e não envia notificação.
6. **Hora de Lisboa.**
   - As horas guardam-se como hora local com o fuso `Europe/Lisbon`.
   - Conversão para UTC só no momento de agendar.
   - Testar a mudança de hora de 25/10/2026.
7. **Minimização de dados** (RGPD art. 5.º, n.º 1, al. c) e art. 25.º). Ver a secção de
   segurança.
8. **Ligações sempre com caminho.**
   - Várias cadeiras terão ficheiros com o mesmo nome (`2026-09-16.md`).
   - Tudo o que o Oráculo escreve no vault usa ligações com caminho, por exemplo
     `[[Sistema/Estudo/IPCA/Etica/Aulas/2026-09-16]]`, nunca `[[2026-09-16]]`.
   - **O que o Oráculo lê tem de ser estático.** Ele lê markdown em bruto do GitHub, não
     o Obsidian a renderizar. Um bloco Dataview, para ele, é uma cerca de código com uma
     pergunta lá dentro: vê a pergunta, nunca a resposta. Por isso qualquer ficheiro
     cujo trabalho seja dizer "isto é o que existe" — `_MAPA.md`, os `_index.md` de
     cadeira, tudo o que ele use para se orientar — é lista escrita, não consulta.
     Dataview fica para os ficheiros que só eu leio no Obsidian.
   - **`Sistema/Modelos/` são modelos, não conteúdo.** Os ficheiros dessa pasta contêm
     frontmatter de exemplo (`tipo: materia`, `tipo: aula`) como documentação da forma
     que as notas reais seguem. O Obsidian não os indexa, porque começam em `<%*`, mas
     uma leitura em bruto pode confundi-los com notas. O Oráculo exclui a pasta ao
     enumerar conteúdo, e lê-a quando quer saber qual é a forma esperada de uma nota.
   - **`<<ficheiro.pdf>>` significa material que não existe.** São marcadores deixados
     pela exportação do OneNote para anexos que nunca vieram. O Oráculo trata-os como
     lacuna conhecida: pode dizer "esta aula refere um PDF que não tenho", e nunca
     supõe o conteúdo a partir do nome do ficheiro.
9. **O Oráculo nunca escreve nas minhas notas por iniciativa própria.**
   - Única exceção: "Editar com o Oráculo" (Fase C), pedido por etiqueta
     (`oraculo: editar`) ou por botão, e só gravado depois de eu aceitar a alteração
     no Sistema.
   - Só escreve em pastas `Oraculo/`:
     - por cadeira: `Sistema/Estudo/IPCA/<pasta>/Oraculo/` (`Aulas/`, `Pedidos/`,
       `Planos/`, `Programa.md`), que aparece por baixo de `Aulas/` e `Notas/` no
       Obsidian;
     - por tema de estudo autónomo (`Sistema/Estudo/<Tema>/`, ex.: `ISO27001`):
       `Sistema/Estudo/<Tema>/Oraculo/Pedidos/` para pedidos feitos a partir dessas
       notas;
     - geral: `Oraculo/` na raiz (relatórios, `Horario.md`, pedidos sem cadeira).
   - Qualquer caminho que contenha um segmento `Oraculo/` é tratado como output do
     Oráculo: fica excluído da leitura de "estudo", do índice de pesquisa, dos gatilhos
     do webhook, do diário e da contagem de atividade. Isto evita que o Oráculo analise
     os próprios textos e entre em ciclo.
   - O modelo de aula (Templater) incorpora `![[.../Oraculo/Aulas/<data>-resumo]]`,
     para eu ver o resumo dentro da minha nota sem que o Oráculo lhe toque.
   - O estado dos pedidos vive no Supabase, e não no frontmatter das notas. Assim
     evitam-se conflitos com o Obsidian Git quando estou a editar a mesma nota.
10. **Custo controlado.**
   - Ler o repositório (GitHub API) não gasta créditos Anthropic.
   - Só se chama o modelo quando há trabalho real a fazer: extração confirmável,
     pós-aula com nota, pedido, relatório semanal, radar/sussurro existentes.

11. **Sem calendários externos.** O calendário e as notificações vêm só do Sistema.
    Não há sincronização nem subscrições com Google Calendar, Outlook ou o Calendário
    do iPhone. O botão "Exportar .ics" atual fica como está (exportação manual), sem
    ser desenvolvido.

## Modelo de dados (Supabase, RLS por `user_id`)

**Cadeiras e programa**

- `courses`
  - `name`, `short_name`
  - `vault_folder` — o **nome** da pasta da cadeira (ex.: `Base-de-Dados`), não o
    caminho. Único dentro do mesmo `academic_year` + `semester`, não globalmente:
    a mesma cadeira pode repetir-se em anos diferentes.
  - `semester`, `academic_year`
  - `ects` — o peso da cadeira. Não é decoração: é o critério de distribuição de
    tempo nos planos de estudo. Uma cadeira de 6 ECTS pesa o dobro de uma de 3 na
    alocação proposta, e o Oráculo diz o peso quando propõe um plano, para eu poder
    discordar. Não gera avisos nem urgência por si só.
  - `has_classes` (booleano) — falso para cadeiras que faço só por exame ou que não
    têm aulas no horário. Uma cadeira com `has_classes: false` nunca aparece na agenda,
    nunca gera resumo pós-aula, e a ausência de notas nela **não** é assinalada como
    lacuna. Continua a poder ter `Notas/`, plano de exame e recall.
  - `color` (opcional)
  - `active` (booleano) — o único estado guardado da cadeira (decisão de 2026-09-23).
    "A decorrer", "aulas terminadas", "em avaliação" e "concluída" calculam-se de
    `classes_until` e dos exames; não se guardam.
  - Construída no Lote 1 (Missão 34 · Fase A) e em produção desde 2026-09-24, com os
    nomes de coluna da migração `20260923120000`: `name`, `short_name`, `vault_folder`
    (o nome da pasta, nunca o caminho), `academic_year`, `semester`, `ects` e
    `has_classes` (vazios nas arquivadas), `active`, `color`, `classes_from`,
    `classes_until`.
- `syllabus_topics`
  - `course_id`, `position` (numeração automática), `title`
  - `status`: `proposto` | `confirmado`
  - `source`: `manual` | `upload:<id>`
- `topic_progress`
  - `topic_id`
  - `state`: `dado` | `por_dar` | `recuperado`
  - `confirmed_at`
  - `evidence`: data da aula ou do resumo que o sugeriu

**Horário**

- `schedule_rules`
  - `kind`: `ipca` | `worten`
  - `course_id` (quando for IPCA)
  - `weekday`, `start_time`, `end_time`, `room`
  - `valid_from`, `valid_until`
  - `source`
- `schedule_events` — ocorrências avulsas
  - `kind`, cada um com regras próprias:
    - `ipca_reposicao`: obriga a `replaces_occurrence`, que é a aula cancelada que repõe;
    - `ipca_extra`: aula nova que não repõe nada;
    - `worten_turno_extra`;
    - `prazo` e `evento`: migrados de `S.events`;
    - `pessoal`, `tarefa`, `estudo`: criados por mim ou pelo agendamento do Oráculo.
  - `course_id`, `date`, `start_time`, `end_time` (opcionais nos prazos e tarefas),
    `room`/`local`, `note`
  - `priority`: `alta` | `media` | `baixa` (por defeito `media`)
  - `priority_reason`: frase curta, obrigatória quando é o Oráculo a decidir
  - `notify_offsets`: minutos antes do evento; se vazio, usa o perfil da prioridade
  - `recurrence`: opcional (regra simples: dias da semana + data de fim)
  - `created_by`: `manual` | `oraculo` | `upload` | `alteracoes_md`
  - `source_request_id`: ligação ao pedido que o criou
- `schedule_exceptions` — aplicadas a uma ocorrência de uma regra
  - IPCA: `cancelada_por_repor`, `cancelada_sem_reposicao`
  - Worten: `nao_vou_trabalhar`, `horas_ajustadas` (hora real de entrada e saída)
- `attendance`
  - por ocorrência de aula: `vou` | `nao_vou` | `sem_resposta`
  - depois da aula: `fui` | `faltei` (confirmação opcional)

**Calendário escolar e ciclo de vida das cadeiras**

- `academic_calendar`
  - `kind`: `periodo_letivo` | `feriado` | `pausa` | `evento` (ex.: festas e
    atividades do CTESP/IPCA) | `epoca_avaliacao` | `fim_aulas_cadeira` | `outro`
  - `title`, `date_start`, `date_end`, `course_id` (opcional), `priority`, `source`
  - `suppresses_classes`: verdadeiro para feriados e pausas
- `courses` ganha:
  - `classes_from`, `classes_until` (último dia de aulas da cadeira) — já criadas no
    Lote 1, vazias até haver calendário.
  - ~~`state`~~ — retirado (decisão de 2026-09-23): o ciclo de vida da cadeira
    calcula-se de `classes_until` e dos exames; o único estado guardado é `active`.

**Exames e planos**

- `exams`
  - `course_id`, `kind` (teste | exame | recurso | trabalho), `date`, `time`, `room`
  - `scope_mode`: `desconhecido` (valor por defeito) | `tudo` | `ate_tema`
  - `scope_topic_id` (só quando `ate_tema`)
  - `status`: `confirmado` | `pendente`
  - histórico de alterações
- `study_plans`
  - versionados por exame; nunca sobrescrever uma versão
  - `provisional`: verdadeiro quando o âmbito do exame é desconhecido

**Propostas, ficheiros e Oráculo**

- `pending_changes`
  - `origin`: `upload_horario` | `upload_programa` | `alteracoes_md` |
    `progresso_pos_aula` | `agendamento`
  - diff legível
  - `state`: `pendente` | `aceite` | `rejeitada`
- `uploads`
  - ficheiro no bucket privado, tipo, finalidade
  - `delete_after`
- `oracle_requests`
  - origem (sistema | etiqueta), notas envolvidas, pedido, anexos, estado
  - caminho da resposta
- `class_summaries` — uma análise por ocorrência de aula
- `push_subscriptions` — por dispositivo, com preferências por categoria
- `oracle_usage` — chamadas por modo, tokens e data

**Fila de trabalhos**

- `jobs`
  - `type`: `pos_aula` | `pedido` | `extracao` | `agendamento` | `espelho` | `relatorio`
  - `payload`, `status`, `attempts`, `last_error`, `run_after`
  - O webhook e os crons só criam jobs e respondem logo. Um worker (cron de 1 minuto
    com `pg_net`, ou `EdgeRuntime.waitUntil`) processa-os.
  - Máximo de 3 tentativas com espera crescente; depois, notificação "falhou" com o
    motivo.
  - Isto respeita os limites de tempo das Edge Functions e evita perder trabalho.

**Migração**

- Migrar `S.events` do `app_state` para `schedule_events` sem perda de dados.
- Documentar o passo de reversão.

## Pipeline comum de extração (PDF e imagem)

1. Upload no Sistema para o bucket privado (o MESMO bucket B2 da Biblioteca, com
   prefixo `temp/`; não usar o Supabase Storage, para não haver dois armazenamentos).
2. Validar o tipo (PDF, PNG, JPG, WEBP) e o tamanho. Imagens HEIC do iPhone são
   convertidas no browser antes do upload, ou recusadas com uma mensagem clara.
   Nada de conversões no servidor.
3. Uma Edge Function envia o ficheiro ao Claude como `document` (PDF) ou `image`, com um
   pedido de JSON estrito e um esquema por finalidade:
   - `horario_ipca`: cadeiras, dia, horas, sala, período de validade.
   - `horario_worten`: APENAS a linha do nome configurado nas definições (o nome tal como
     aparece no documento), com datas e horas. Ignorar os colegas.
   - `calendario_escolar`: períodos letivos, feriados, pausas, épocas de avaliação,
     eventos e datas de fim de aulas por cadeira, cada um com o texto de origem.
     Não inventar datas.
   - `programa`: lista ordenada de temas da cadeira escolhida. Não inventar temas.
     Incluir o nível de confiança e o texto de origem de cada tema.
4. Validar o JSON (datas válidas, horas coerentes, duplicados). Se falhar, repetir uma
   vez; se voltar a falhar, mostrar o erro e não adivinhar.
5. Comparar com o estado atual e criar `pending_changes` com um diff legível, por exemplo:
   - "Sáb 26/09: 14:00–22:00 → 10:00–18:00";
   - "+ Tema 4: Normalização".
6. Eu aceito ou rejeito cada linha, ou tudo de uma vez. Só depois é aplicado.
7. Retenção do ficheiro original (o conteúdo útil já está nas tabelas):
   - horário da Worten: apagar logo após a confirmação (tem dados de colegas);
   - horário do IPCA, calendário escolar e FUC: guardar até ao fim do ano letivo
     (prova para comparar se a extração falhar), com o botão "guardar para sempre";
   - anexos de pedidos: 30 dias;
   - o painel de espaço mostra o que ocupa cada tipo e deixa descarregar ou apagar.
8. Mostrar sempre, lado a lado, a pré-visualização do ficheiro e a proposta extraída.

## Fase A — Cadeiras, horário, calendário e diário

**Cadeiras**

- Criadas a partir do horário do IPCA ou à mão.
- `active` (booleano): verdadeiro nas ativas, falso nas arquivadas, com `semester` e
  `academic_year` (decisão de 2026-09-23: um só campo de estado; o antigo `status`
  saiu).
- Só as cadeiras ativas entram em resumos pós-aula, planos e relatórios. As
  arquivadas continuam pesquisáveis e disponíveis em pedidos.

**Sincronizar a estrutura do vault (com aprovação)**

- Ao criar uma cadeira nova, o Sistema propõe criar
  `Sistema/Estudo/IPCA/<pasta>/Aulas/` e `.../Notas/` no repositório (com um
  `_index.md` mínimo, para o Git guardar a pasta). Só cria depois de eu aceitar.
- No fim do semestre (ou quando marco "Esta cadeira terminou"), propõe arquivar:
  mover `IPCA/<Cadeira>/` para `IPCA/_Arquivo/<ano-letivo>-S<semestre>/<Cadeira>/`.
  - Mostra a lista de ficheiros a mover e as ligações afetadas.
  - Só executa depois de eu aceitar, e nunca move ficheiros alterados nas últimas
    24 horas.
  - Corrige as ligações com caminho e regista tudo em `system_events`.
  - `_Arquivo/` não é apanhado pelo padrão do Templater nem tratado como cadeira ativa,
    mas continua **legível**: pela regra do princípio 4, o Oráculo identifica a cadeira
    e o semestre de qualquer nota arquivada. Arquivar esconde da agenda, não da memória.
- Nunca apaga notas minhas.
- **O grau de prova exigido cresce com a irreversibilidade.** Mostrar, propor e escrever
  num ficheiro do Oráculo desfazem-se; apagar, mover e reescrever notas minhas não.
  Antes de propor qualquer coisa do segundo grupo, o Oráculo verifica a premissa em vez
  de a herdar — conta o que diz que contou, e diz o que contou.
  - Uma afirmação feita num relatório anterior, dele ou meu, não é prova. É uma
    afirmação, e pode estar errada.
  - Se a premissa não for verificável no momento, a ação não é proposta: é assinalada
    como "isto talvez devesse ser apagado, mas não confirmei que X".
  - Aplica-se também quando sou eu a dar a ordem. Uma ordem minha fundada numa premissa
    falsa continua a ser uma ação errada, e o Oráculo diz-mo antes de executar.
- O campo `vault_folder` sugere as pastas com `_index.md` que tenha `cadeira:` no
  frontmatter, dentro de `Sistema/Estudo/IPCA/`, a qualquer profundidade. Avisar se uma
  pasta não tiver cadeira no Sistema, se uma cadeira ativa não tiver pasta, ou se os
  `ects` divergirem entre o `_index.md` e a tabela.

**Programa**

- Na página da cadeira há duas formas de o preencher:
  - colar texto (uma linha por tema, numeração automática);
  - upload de PDF ou imagem (FUC, slide do professor), pelo pipeline.
- Os temas podem ser reordenados, editados e apagados.
- Espelho em `Sistema/Estudo/IPCA/<pasta>/Oraculo/Programa.md`, com o estado de cada tema.

**Calendário**

- Vista dupla no desktop:
  - mês à esquerda;
  - grelha semanal ou diária por horas à direita, com clique no mês para saltar.
- No mobile: seletor Hoje / Semana / Mês, com "Hoje" em lista por defeito.
- Cores:
  - Worten = vermelho;
  - IPCA = verde;
  - as restantes à escolha, coerentes com a identidade visual.
- A cor nunca é o único sinal: cada tipo tem uma letra ou ícone.
- Estilos por estado:
  - reposição: contorno tracejado, com a indicação "repõe dd/mm";
  - aula extra: rótulo "extra";
  - cancelada: cinzento e riscado;
  - cancelada por repor: com badge.

**Ações nos blocos**

- Aula do IPCA:
  - "cancelada, vai haver reposição";
  - "cancelada, sem reposição";
  - "não vou";
  - "pedir ao Oráculo" (só aulas passadas).
- Criar "reposição": obriga a escolher a aula cancelada que repõe, sugerida a partir das
  aulas `cancelada_por_repor` dessa cadeira. A aula original passa a "reposta", e os temas
  dessa aula passam a `recuperado` quando confirmados.
- Criar "aula extra": cadeira, data, horas e sala.
- Botão "Começou uma aula agora": cadeira, duração por defeito da cadeira e botão
  "terminar".
- Turno da Worten:
  - "não vou trabalhar";
  - "ajustar horas" (entrei ou saí a outra hora);
  - "turno extra".
- Definições da Worten:
  - "data de saída" (`valid_until`): os turnos futuros desaparecem, o histórico mantém-se.

**Diário do dia (histórico)**

- Nada é apagado: os dias passados ficam navegáveis sem limite.
- Ao abrir um dia passado, a vista mostra:
  - aulas: fui, faltei, cancelada, reposta, extra;
  - turnos, com as horas previstas e as reais;
  - notas escritas nesse dia (commits do vault com essa data, com ligação para o editor
    ou para o GitHub);
  - resumos e respostas do Oráculo desse dia;
  - sessões de recall, missões e hábitos concluídos, se o `app_state` tiver datas.
- Não apresentar "horas de estudo" como facto: commits não medem tempo, e com o
  Obsidian Sync a nota pode chegar ao repositório dias depois de escrita. A data da
  nota vem do id; a hora do commit é apresentada apenas como
  "chegou ao repositório às HH:MM", nunca como "estudaste às HH:MM".
- A medição real de tempo é a Missão 34. Enquanto ela não existir, o diário não mostra
  horas de estudo; depois, mostra as sessões medidas e as estimadas em separado.
- Totais por semana e por mês:
  - horas trabalhadas (reais, se ajustadas; previstas, caso contrário, com essa
    indicação);
  - aulas previstas, assistidas, canceladas e repostas.
- O histórico só existe a partir do arranque desta missão (e dos eventos migrados).
  Não reconstruir o passado.

**Calendário escolar, feriados e fim das cadeiras**

- Upload do calendário escolar (PDF ou imagem: ano letivo, semestres, feriados,
  pausas, épocas de avaliação, eventos do CTESP/IPCA) pelo pipeline comum, com o
  esquema `calendario_escolar`. Resultado: propostas em `pending_changes`, que eu
  confirmo linha a linha.
- O mesmo vale para horários mensais ou atualizados (IPCA ou Worten) enviados a meio do
  mês: o diff mostra só o que muda.
- Dias com `suppresses_classes`: as aulas desse dia aparecem como "sem aulas —
  <motivo>", sem avisos de início nem pedido de presença. Os turnos da Worten não são
  afetados.
- Eventos do calendário escolar entram no calendário com prioridade (definida por
  mim ou sugerida pelo Oráculo, com a mesma lógica do agendamento) e seguem os perfis
  de notificação.
- Fim de uma cadeira:
  - por data (`classes_until`, vinda do calendário escolar ou definida por mim) ou
    pelo botão "As aulas desta cadeira acabaram" (com data);
  - a partir daí, as aulas dessa cadeira deixam de aparecer e de gerar avisos; o
    histórico fica;
  - a cadeira passa a `aulas_terminadas`, depois a `em_avaliacao` enquanto houver
    exames futuros, e a `concluida` quando eu o confirmar (por defeito, proposta no dia
    a seguir ao último exame);
  - uma cadeira `concluida` fica arquivada: as notas e os resumos continuam
    acessíveis, e o Oráculo deixa de a incluir em planos e missões, exceto se eu criar
    um exame de recurso.
- Fim do semestre: proposta para fechar todas as regras de aulas com `valid_until` e,
  quando houver novo horário, criar as novas cadeiras.
- Avisos: "Última aula de <cadeira> amanhã" no briefing, e "Próxima semana sem aulas
  (<motivo>)" no briefing de domingo.

**Calendário escolar e fim de aulas**

- Tabela `academic_periods`:
  - `kind`: `semestre` | `aulas` | `epoca_normal` | `epoca_recurso` | `epoca_especial` |
    `ferias` | `feriado` | `sem_aulas` | `evento` (ex.: dias especiais do CTESP)
  - `date_from`, `date_to`, `title`, `course_id` (opcional), `source`
- Upload do calendário escolar (PDF ou imagem, ano inteiro ou só um mês) pelo pipeline
  de extração, com a finalidade `calendario_escolar`. Tudo entra como proposta.
- Feriados nacionais calculados por código (fixos e móveis, incluindo os que dependem
  da Páscoa). Feriados municipais e dias sem aulas só vêm do calendário escolar ou de
  mim.
- Efeitos no calendário:
  - num `feriado` ou `sem_aulas`, as aulas desse dia não aparecem, não geram avisos
    nem análise pós-aula, e ficam marcadas "sem aulas (motivo)", sem contar como
    canceladas;
  - `schedule_rules` do IPCA terminam em `valid_until` = fim do período `aulas` do
    semestre;
  - épocas de exames aparecem como faixa no mês e alimentam os planos.
- Cadeira que acaba mais cedo:
  - botão "Esta cadeira terminou" (com data), que fecha as regras dessa cadeira sem
    apagar o histórico;
  - o Oráculo também o pode propor quando o calendário escolar ou uma nota minha o
    indicar, sempre como proposta.
- Fim de semestre:
  - 7 dias antes do fim do período de aulas, o briefing pergunta pelo horário do
    semestre seguinte;
  - sem horário novo, o calendário mostra só exames, trabalho e eventos, e não inventa
    aulas.
- Notificações: seguem o calendário resultante, e as alterações vindas do calendário
  escolar aparecem no briefing das 22:30 da véspera.

**A fronteira do repositório: garantia estrutural, não padrão**

O `.gitignore` é lista branca: só `Sistema/`, `Oraculo/`, `README.md` e o próprio
`.gitignore` entram. Tudo o que esteja fora dessas pastas de topo — `Anexos/`,
`Diario/`, `Vida/`, `Pessoal/` — **não consegue** chegar ao GitHub. Não é uma regra a
funcionar bem: é uma impossibilidade estrutural.

Regra: nada que seja criado automaticamente pelo Obsidian entra em `Sistema/`.

A distinção que esta regra protege é entre uma garantia e uma convenção. Os `Quadros/`
são exceção admissível porque sou eu que crio a pasta, deliberadamente, quando decido
desenhar. Uma pasta de anexos criada sozinha a cada imagem colada é outra coisa: o dia
em que eu colar uma fotografia, um documento ou uma captura com algo pessoal, hoje isso
cai fora por construção; se os anexos vivessem dentro de `Sistema/`, passaria a cair
dentro, protegido por um padrão que tem de continuar a funcionar — e que depende de
definições (o nome da subpasta no Obsidian, o `core.ignorecase` do Git) que se mudam
sem pensar no `.gitignore`.

Trocar uma garantia por uma convenção é aceitável às vezes. Nunca é aceitável fazê-lo
sem dar por isso, como efeito secundário de uma decisão de arrumação.

Verificação periódica, barata, que confirma que a fronteira se mantém: nada além de
markdown rastreado dentro de `Sistema/` (`git ls-files`).

**Quadros à mão (Excalidraw) e transcrição**

- Os desenhos vivem em `Sistema/<Domínio>/<Item>/Quadros/<id>.excalidraw.md`, ao lado
  de `Aulas/` e `Notas/`, mas FORA do repositório. Duas linhas no `.gitignore`, depois
  da que inclui `Sistema/`:
  - `Sistema/**/Quadros/`
  - `*.excalidraw.md` (segunda barreira, caso um desenho apareça noutro sítio)
  Razões para ficarem fora do Git:
  - o Excalidraw guarda os traços como coordenadas, não como texto: o Oráculo não os
    consegue ler;
  - cada gravação reescreve o ficheiro inteiro, e o Git guarda todas as versões —
    com commits de 15 em 15 minutos, o repositório crescia sem limite;
  - imagens coladas vão para `Anexos/`, que também está fora do repositório.
- O desenho é protegido pelo Obsidian Sync e pelo backup Kopia, como o resto do vault.
- A nota de aula (essa sim, no repositório) incorpora o desenho:
  `![[<raiz do item>/Quadros/<id>.excalidraw]]`. Vejo tudo junto no Obsidian; para o
  Oráculo é apenas uma linha de texto.
- O Claude Code verifica, na Fase A, que nenhum `.excalidraw.md` chegou ao repositório,
  e avisa se algum aparecer.
- **Transcrição (é o que dá o conteúdo ao Oráculo):**
  - exporto o quadro como PNG (o Excalidraw tem exportação automática ao gravar) e
    carrego-o na Biblioteca, ou uso o botão "Transcrever quadro" na aula;
  - o Oráculo lê a imagem e escreve
    `Sistema/Estudo/IPCA/<pasta>/Oraculo/Transcricoes/<id>.md`, que a nota de aula
    também incorpora;
  - a transcrição é marcada como `origem: transcricao_manuscrita`, com as palavras
    duvidosas entre `[?]`. NUNCA é tratada como facto verificado: reconhecimento de
    manuscrito erra, e o princípio 3 aplica-se na íntegra;
  - a partir daí, tudo o que existe (resumo pós-aula, pedidos, recall, planos,
    relatório) usa a transcrição como se fosse texto meu.
- Sem transcrição, o Oráculo diz que a aula só tem quadro e não inventa conteúdo.
- Nunca converter todas as notas para Excalidraw: perderia pesquisa, ligações e
  leitura pelo Oráculo. Manuscrito para compreender e diagramas; texto para recuperar.

**Espelho e alterações**

- Após qualquer alteração confirmada, reescrever `Oraculo/Horario.md` com a semana atual
  e a seguinte.
- Ler `Sistema/Horario/alteracoes.md` quando um push o altera e converter cada linha
  nova em `pending_changes`.
- Linhas mal formatadas geram um aviso e não são adivinhadas.

**Critérios de aceitação**

- Um PDF da FUC gera uma proposta de temas, e nada fica confirmado sem mim.
- Um horário da Worten com vários colegas só cria entradas para mim.
- A reposição fica ligada à aula cancelada.
- O diário de uma data passada mostra aulas, turnos e atividade no vault.
- A mudança de hora de outubro não desloca nada.
- Um calendário escolar com um feriado numa quarta suprime as aulas desse dia,
  depois de eu confirmar.
- Uma cadeira com `classes_until` no passado não gera aulas nem avisos, e aparece
  como arquivada quando `concluida`.

## Fase B — Notificações (PWA, PC e iPhone)

**Infraestrutura**

- Service worker, chaves VAPID nos Secrets e `push_subscriptions`.
- Definições com a lista de dispositivos e interruptores por categoria:
  - aula a começar;
  - briefing da noite;
  - presença;
  - resumo pós-aula pronto;
  - pedido pronto;
  - propostas pendentes;
  - exame a aproximar-se;
  - âmbito do exame por definir;
  - relatório semanal.
- iPhone:
  - o push web só funciona com a PWA no ecrã principal (iOS 16.4+);
  - confirmar se o iOS mostra botões de ação; se não mostrar, tocar na notificação abre
    o cartão de confirmação.

**Envios**

- **Briefing às 22:30 (Lisboa)**
  - Mostra amanhã: aulas, reposições, aulas extra, turnos, exames e prazos, e o que mudou
    desde o último briefing.
  - Pede a presença (VOU / NÃO VOU) para cada aula de amanhã.
  - Um evento para amanhã criado depois das 22:30 é notificado logo.
- **Presença**
  - NÃO VOU equivale a `nao_vou`: não há aviso de início nem análise pós-aula dessa aula.
- **Aula a começar**
  - 15 minutos antes (configurável).
  - Cron a cada 5 minutos: uma consulta SQL encontra os avisos devidos. Só se houver
    algum é que chama a Edge Function de envio (o push web precisa de cifragem, que
    não se faz em SQL). Sem IA.
  - Guardar cada envio numa tabela `notifications_sent` para nunca enviar o mesmo
    aviso duas vezes.
- **Âmbito por definir**
  - Se faltarem 21 dias ou menos para um exame com âmbito `desconhecido`, lembrar uma
    vez por semana, dentro do briefing e nunca em notificação própria.
- **Eventos com prioridade** (pessoais, tarefas, prazos, estudo)
  - As notificações dependem da data e hora marcadas no calendário e da prioridade.
    Perfis por defeito, editáveis nas definições:
    - alta: no briefing da véspera, 60 minutos antes e 15 minutos antes; um prazo de
      alta prioridade também aparece no briefing 3 dias antes;
    - média: no briefing da véspera e 15 minutos antes;
    - baixa: só no briefing da véspera.
  - Eventos sem hora: notificação às 09:00 do próprio dia (hora configurável), além do
    briefing.
  - `notify_offsets` de um evento sobrepõe-se ao perfil.
  - Silêncio noturno configurável (por defeito 23:30–07:30): nada é enviado nesse
    período, exceto eventos de alta prioridade marcados para essas horas.
- **Ecrã bloqueado**
  - Conteúdo curto, por exemplo "Base de Dados 14:00, B2". Nunca incluir conteúdo de
    notas.

- **Saúde do sistema**
  - Se um job falhar 3 vezes, se o `VAULT_TOKEN` expirar, ou se o webhook deixar de
    receber pushes durante 48 horas num período de aulas, enviar uma notificação.
  - Mostrar a data de expiração do `VAULT_TOKEN` nas definições e avisar 14 dias antes.
- **Uso real**
  - Registar se cada notificação foi aberta.
  - No relatório mensal, indicar categorias ignoradas (por exemplo, "abriste 2 de 30
    avisos de aula") e sugerir desligá-las.

**Critérios de aceitação**

- Uma notificação real chega ao Windows e ao iPhone.
- As preferências são independentes por dispositivo.
- Uma aula cancelada ou marcada NÃO VOU não gera aviso.

## Fase C — Oráculo de aulas, pedidos e exames

**Pós-aula automática**

- Cada ocorrência de aula tem o seu resumo, nomeado pelo id (`<id>-resumo.md`).
- Tenta 30 minutos depois do fim de cada aula (normal, reposição ou extra), exceto se
  estiver cancelada ou marcada `nao_vou`.
- Se a nota ainda não existir, o webhook de push volta a tentar sempre que chegar um
  commit em `Aulas/` dessa cadeira, até 7 dias depois da aula. Este prazo largo é
  necessário porque, com o Obsidian Sync, posso escrever no telemóvel e o commit só
  acontecer quando ligar o PC. Máximo de uma análise por ocorrência de aula (a menos
  que eu peça "refazer resumo").
- Condição única: existe a nota cujo id corresponde à aula. Não exigir que o commit
  seja posterior ao início da aula: a hora do commit não prova quando escrevi.
- Escreve `Sistema/Estudo/IPCA/<pasta>/Oraculo/Aulas/AAAA-MM-DD-resumo.md` (com a ligação, com caminho,
  para a nota original) com:
  - resumo fiel do que escrevi;
  - lacunas ou dúvidas visíveis nas notas;
  - 3 perguntas de recall, também enviadas como propostas para o módulo existente
    "Revisão do Dia · Active Recall" (`recall.js`, `customQ`). Só entram na repetição
    espaçada depois de eu as aceitar, e ficam com o tema da cadeira;
  - se houver programa confirmado: "temas que parecem ter sido dados", criados como
    `pending_changes` do tipo `progresso_pos_aula`.
- Nunca editar a minha nota.
- Notificar, com a opção de confirmar os temas.
- Botão "refazer resumo" no Sistema, para quando continuei a escrever depois.

**Pedidos ao Oráculo**

- Pontos de entrada:
  - Sistema, a partir do calendário: bloco de aula passada → "Pedir ao Oráculo". Resolve
    a nota pela convenção pasta + data; se não existir, diz isso.
  - Sistema, a partir da cadeira: lista das notas por data, com seleção múltipla, e temas
    do programa como contexto opcional.
  - Sistema, por pesquisa: nome ou texto das notas em `Sistema/`. Índice simples mantido
    a partir dos pushes: caminho, título, data e excerto.
  - Obsidian: frontmatter `oraculo: pedido` e `pedido: "..."`, detetado pelo webhook.
- O pedido pode levar anexos (PDF ou imagem) carregados no Sistema. Os anexos do
  Obsidian em `Anexos/` não chegam ao Oráculo, e isso deve ser explicado na interface.
- Aplicam-se as mesmas regras em todos os pontos de entrada:
  - fonte de matéria só do programa confirmado e das notas;
  - URLs só da pesquisa web dessa chamada;
  - fontes oficiais primeiro (EUR-Lex, DRE, CNPD, CNCS, ENISA, EDPB, documentação
    oficial).
- Onde fica a resposta — duas arrumações, escolhidas por regra e não por intuição:
  - **Por aula** (`.../Oraculo/Pedidos/<id>-pedido.md`): quando o pedido parte de uma
    nota de aula ou do bloco dessa aula no calendário. É o ficheiro que a nota de aula
    incorpora, por isso o nome é fixo (o id).
  - **Por tema** (`.../Oraculo/Temas/<slug-do-tema>.md`): quando o pedido parte da
    página da cadeira, da pesquisa, ou nomeia um tema do programa. Um ficheiro por
    tema, para o assunto não ficar espalhado por dez aulas.
  - Um pedido sem cadeira vai para `Oraculo/Temas/` na raiz.
  - Em qualquer dos casos, a entrada nova é acrescentada ao FICHEIRO QUE JÁ EXISTE, no
    topo, com data, hora, a pergunta em texto integral, a resposta e as fontes. Nunca
    se cria um ficheiro novo para o mesmo tema ou para a mesma aula.
  - Ligações cruzadas obrigatórias: a entrada por tema liga às aulas envolvidas, e a
    entrada por aula liga ao ficheiro do tema.
- Continuidade (antes de responder, o Oráculo procura):
  1. pesquisa nas respostas anteriores da mesma cadeira e do mesmo tema
     (`oracle_requests` + índice de texto);
  2. se encontrar uma resposta muito semelhante, começa por dizer "já tinha respondido
     a isto em <ligação>" e continua a partir daí, em vez de repetir;
  3. o que for novo entra como `## Atualização — AAAA-MM-DD` no MESMO ficheiro;
  4. se a resposta antiga passou a estar errada (lei alterada, programa mudado, eu
     corrigi), a entrada antiga é marcada `[desatualizada → ver AAAA-MM-DD]` e fica
     lá. Nunca se apaga nem se reescreve uma resposta antiga em silêncio.
  - Isto não é memória do modelo: é a pesquisa feita antes de cada chamada. Sem esse
    passo, o Oráculo responderia do zero e criaria ficheiros repetidos.
- Índice: `.../Oraculo/_indice.md` por cadeira, com data, tema, tipo (aula ou tema) e
  ligação, gerado a cada escrita. É por aqui que encontro tudo.
- Em todos os casos: visível no Sistema e com notificação "Resposta pronta".
- Pedidos pela etiqueta: o estado fica em `oracle_requests`, identificado pelo caminho
  da nota e por um hash do campo `pedido`.
  - O mesmo pedido nunca é processado duas vezes.
  - Para voltar a pedir, altero o texto do `pedido`.
  - A nota original nunca é editada por um `pedido`. A ligação para a resposta aparece
    no Sistema e no `_indice.md` da cadeira.
  - Para ele escrever DENTRO da minha nota existe só um caminho: `oraculo: editar` ou o
    botão "Editar com o Oráculo", que produz uma proposta que eu aceito. Funciona em
    qualquer ficheiro meu dentro de `Sistema/` (aula, nota, ficha, programa), nunca
    fora, e nunca sem eu aceitar.
- Webhook do GitHub:
  - verificar `X-Hub-Signature-256`;
  - responder em menos de 10 s e processar em segundo plano;
  - ignorar commits que só tocam `Oraculo/`;
  - processar cada pedido uma única vez.

**Editar com o Oráculo (a meu pedido)**

Nesta fase há uma vista de diferenças simples; o editor completo fica para a Fase D.

- Pontos de entrada:
  - Obsidian: frontmatter `oraculo: editar` e `pedido: "o que quero mudar"`, detetado
    pelo webhook;
  - Sistema: botão "Editar com o Oráculo" em qualquer nota minha (a partir do
    calendário, da página da cadeira ou da pesquisa) e, na Fase D, no editor.
- O Oráculo prepara uma NOVA versão da nota. Não grava nada: cria uma proposta em
  `oracle_requests` e envia a notificação "Proposta de edição pronta".
- No Sistema vejo as diferenças lado a lado (linhas removidas e acrescentadas) e escolho
  Aceitar tudo / Aceitar partes / Rejeitar. A aprovação é sempre no Sistema (também
  no iPhone), nunca por etiqueta.
- Regras de conteúdo:
  - não apagar informação sem o dizer no resumo da alteração;
  - texto acrescentado com fontes vai num bloco `> [!oraculo]`, com os URLs da
    pesquisa;
  - manter as ligações e o resto do frontmatter;
  - na versão aceite, limpar `oraculo` e `pedido`, para o pedido não voltar a disparar.
- Gravar só depois de aceitar, via GitHub Contents API com o `sha` lido quando a
  proposta foi feita.
  - Se a nota mudou entretanto, recusar e oferecer "refazer a proposta sobre a versão
    nova".
  - Antes de aceitar, o Sistema avisa: "fecha esta nota no Obsidian" e mostra a hora
    do último commit dela.
- Mensagem de commit identificável (`oraculo: edição pedida — <nota>`). Guardar a
  versão anterior em `oracle_requests`, com o botão "Repor versão anterior" durante
  30 dias.
- Uma nota por pedido, nunca em lote. O mesmo pedido (caminho + hash do `pedido`) só é
  processado uma vez.
- Propostas não respondidas expiram ao fim de 7 dias.

**Exames e planos**

- Mudar a data de um exame deixa-o `pendente` até eu confirmar. A confirmação gera uma
  nova versão do plano.
- Âmbito do exame:
  - `ate_tema`: temas até esse;
  - `tudo`: todo o programa;
  - `desconhecido`: plano provisório com os temas já dados até hoje e os próximos
    previstos, marcado "PROVISÓRIO — âmbito por confirmar" e refeito quando eu definir
    o âmbito.
- Aula `cancelada_sem_reposicao`:
  - com programa: "confirma que temas ficaram por dar";
  - sem programa: "sem programa registado, não sei que matéria ficou por dar".
  - Nunca deduzir.
- O plano cruza a data, o âmbito, os temas por dar ou por recuperar e as horas livres do
  calendário.
  - Nunca durante aulas ou turnos.
  - Respeita os objetivos de sono já existentes (`S.sleep`): nada de blocos de estudo
    depois da hora de deitar.
- Cada bloco de estudo proposto entra no calendário como evento `estudo`, pelo fluxo de
  agendamento (cartão de confirmação).
- No relatório semanal, comparar o planeado com o feito: blocos cumpridos segundo a
  atividade no vault e recall feito. Mostrar os números, sem julgamentos.
- O plano é escrito em `Sistema/Estudo/IPCA/<pasta>/Oraculo/Planos/<exame>.md`, com uma secção de perguntas de exame e fontes oficiais e mostrado no Sistema.
- Sem programa, o plano é apenas de revisão das notas existentes, e diz porquê.

**Agendamento pelo Oráculo**

- Pontos de entrada:
  - Sistema: campo "Pedir ao Oráculo para agendar" no calendário (texto livre), e o chat
    do Oráculo quando a mensagem é um pedido de agendamento;
  - Obsidian: linha `AAAA-MM-DD | AGENDAR | texto livre` em `alteracoes.md` (a data é a
    do dia em que escrevi, para interpretar "amanhã", "sexta", etc.).
- Exemplos de pedidos:
  - "marca-me dentista quinta às 15h";
  - "tenho de entregar o trabalho de Ética até dia 20";
  - "quero estudar SQL 1 hora amanhã à noite";
  - "ginásio às terças e quintas às 19h até ao fim do semestre".
- A Edge Function envia ao modelo:
  - o pedido;
  - a data e hora atuais em Lisboa;
  - os eventos, aulas, turnos e exames dos próximos 30 dias;
  - a lista de cadeiras.
- O modelo devolve JSON estrito:
  - `kind`, `title`, `date`, `start_time`, `end_time`, `course_id`, `recurrence`;
  - `priority` e `priority_reason`;
  - `notify_offsets` (só se o pedido o disser, por exemplo "avisa-me 1 hora antes");
  - `confidence` (`alta` | `baixa`);
  - `questions`: o que não conseguiu decidir.
- Critérios para a prioridade, que o modelo tem de aplicar e justificar:
  - alta: prazos de avaliação, exames, compromissos com terceiros (médico, entrevista,
    reunião), consequências se falhar, ou palavras como "urgente", "não posso falhar";
  - média: compromissos pessoais com hora marcada sem consequência grave, blocos de
    estudo perto de um exame;
  - baixa: lembretes, ideias, tarefas sem prazo nem consequência;
  - quando o pedido diz a prioridade, vence o pedido.
- O código valida o resultado e verifica:
  - datas no passado → pergunta;
  - conflitos com aulas, turnos ou exames → aviso com o nome do conflito;
  - blocos de estudo nunca sobre aulas ou turnos → propõe a hora livre mais próxima;
  - pedidos que são exames → encaminhados para `exams`, que exige confirmação;
  - pedidos que alteram aulas ou turnos → encaminhados para exceções/reposições, que
    exigem confirmação.
- Aplicação:
  - Por defeito, o Sistema mostra um cartão: "Quinta 24/09, 15:00–16:00 · Dentista ·
    prioridade ALTA (compromisso com terceiros) · avisos: véspera, 60 e 15 min" com os
    botões Confirmar / Editar / Cancelar.
  - Nas definições há a opção "Agendar automaticamente". Com ela ligada, o evento entra
    logo no calendário quando se cumprem todas as condições:
    - `confidence` alta;
    - sem `questions`;
    - sem conflitos;
    - não é exame nem alteração a aulas ou turnos.
  - Com agendamento automático, recebo uma notificação "Agendado: … · Anular", e a
    anulação fica disponível durante 24 horas.
  - Quando há `questions`, o Oráculo pergunta antes de criar qualquer coisa.
- A prioridade e os avisos podem ser editados no bloco do evento em qualquer momento.
- Cada pedido fica registado em `oracle_requests`, com o evento criado ou a razão por
  que não foi criado.

**Relatório semanal (manter)**

- Acrescentar:
  - aulas assistidas, canceladas, por repor e repostas;
  - progresso por cadeira;
  - exames próximos e âmbitos por definir;
  - horas trabalhadas;
  - ideias, temas e notícias ligados ao que estudei, com URLs da pesquisa.

**Critérios de aceitação**

- Uma aula sem nota resulta em zero chamadas à Anthropic.
- Uma nota com o mesmo `pedido` gravada 10 vezes (commits sucessivos) gera uma única
  resposta.
- Nenhuma nota minha é alterada pelo Oráculo sem um pedido "Editar com o Oráculo"
  aceite por mim.
- Um commit do Oráculo numa pasta `Oraculo/` não dispara nenhuma análise.
- Cada pedido é processado uma única vez, venha do Sistema ou da etiqueta.
- Com o programa vazio, nenhuma resposta menciona temas.
- Um exame com âmbito desconhecido mostra o plano como provisório.
- "Marca-me dentista sexta às 15h" cria (ou propõe) o evento na sexta certa, com
  prioridade alta e justificação, e as notificações chegam nas horas do perfil.
- Um pedido que colide com uma aula mostra o conflito e não é agendado
  automaticamente.
- "Tenho teste de Ética dia 20" vai para `exams` como pendente, e não para eventos.

## Fase D — Editor de notas no Sistema

- Lê e escreve os mesmos ficheiros Markdown de `Sistema/` (e só lê `Oraculo/`) através
  da Edge Function e da GitHub Contents API com `sha`. Não criar uma segunda base de
  notas.
- Árvore por cadeira, pré-visualização de Markdown e "nova nota de aula" (cria
  `Aulas/<data de hoje>.md` na cadeira da aula atual ou da última aula).
- Botões "Pedir ao Oráculo" e "Editar com o Oráculo" no próprio editor.
- Conflito de `sha`: recusar gravar, mostrar "a nota mudou noutro sítio" e oferecer
  recarregar.
- Só online. O Obsidian continua a ser o editor offline no PC e no iPhone.

**Biblioteca de documentos (PDF e imagens)**

- Página "Biblioteca" com todos os documentos que carreguei: horários, calendários
  escolares, FUC, slides, PDFs de estudo e anexos de pedidos.
- Organização:
  - por cadeira ou área da árvore de conhecimento;
  - por etiquetas, data e origem;
  - pesquisa pelo título e pelo texto extraído.
- Armazenamento:
  - ficheiros num bucket privado do Backblaze B2, acedidos por URLs assinados de curta
    duração (10 GB grátis, em vez do 1 GB do Supabase Free);
  - metadados, texto extraído e anotações no Postgres;
  - qualquer alternativa tem de ser justificada.
- Retenção: os documentos da Biblioteca ficam até eu os apagar. As regras de apagamento
  automático só se aplicam a uploads temporários (horário da Worten, anexos de pedidos
  não guardados).
- Trabalhar com um documento:
  - leitor de PDF no Sistema (PDF.js carregado de cdnjs);
  - anotações e destaques guardados na base de dados, sem alterar o ficheiro original;
  - "Perguntar ao Oráculo sobre este documento";
  - "Criar nota a partir deste documento": o Oráculo propõe uma nota em Markdown para
    `Sistema/Estudo/.../Notas/`, que só é criada depois de eu aceitar;
  - "Alimentar o Oráculo" (Missão 32), respeitando direitos de autor: documentos
    oficiais e meus são indexados; livros pagos e normas ISO ficam guardados como meu
    ficheiro privado, mas só entram na base de conhecimento como resumo e referências;
  - substituir por uma nova versão, guardando a anterior;
  - descarregar.
- Editar o conteúdo de um PDF (texto dentro do PDF) fica fora do âmbito. A edição faz-se
  através das anotações ou da nota em Markdown.
- Painel de espaço: total por tipo e por cadeira, com aviso a 70% dos 10 GB.


## Cópias de segurança (Fase A, antes de qualquer dado novo)

O plano gratuito do Supabase não tem backups. Esta missão cria dados que não existem
em mais lado nenhum (horário, exceções, exames, histórico), por isso o backup vem
primeiro.

- **Nível 0 — vault completo (configurado por mim, fora do código):**
  - O `vault-sistema` só contém `Sistema/` e `Oraculo/`. `Pessoal/`, `Anexos/` e
    `Diario/` só existem no PC.
  - Backup cifrado do lado do cliente (Kopia ou restic) de toda a pasta
    `ObsidianVault` para armazenamento cloud pessoal (por exemplo, Backblaze B2 ou
    Cloudflare R2), com snapshots diários.
  - Nunca usar o OneDrive institucional do IPCA.
  - O Claude Code documenta os passos no SPEC, mas não guarda credenciais.
- **Nível 1 — diário, automático, grátis:**
  - Um workflow do GitHub Actions (cron diário, de madrugada) num repositório privado,
    `kamappa/sistema-backups`, que só guarda o CÓDIGO do workflow e do restauro.
  - Faz `pg_dump` (ou `supabase db dump`), com a ligação guardada nos Secrets do GitHub.
  - Cifra o dump com `age`, usando uma chave pública. A chave privada NUNCA vai para o
    GitHub; fica no gestor de palavras-passe e numa cópia offline.
  - Envia o ficheiro cifrado para o Backblaze B2 (região UE, bucket privado, chave de
    aplicação limitada a esse bucket, que escreve e lista mas não lê nem apaga).
  - NÃO guarda dumps dentro do Git: o histórico do Git nunca encolhe, e dumps diários
    fariam o repositório crescer sem limite.
  - Retenção por regras de ciclo de vida do B2: 14 diários e 12 mensais.
  - Inclui também os ficheiros da Biblioteca e os documentos marcados "guardar" (ver
    Fase D).
  - Efeito secundário útil: a atividade diária evita a pausa do projeto gratuito por
    inatividade. Confirmar que conta.
  - Se o backup falhar, envia uma notificação ("Saúde do sistema").
- **Nível 2 — cópia fora da cloud (opcional, recomendado):**
  - Script para o computador de casa (Windows, Agendador de Tarefas) que descarrega
    semanalmente o último backup para um disco local.
  - Cumpre a regra 3-2-1: 3 cópias, 2 suportes, 1 fora do sítio.
- **Restauro:**
  - Procedimento escrito no SPEC: criar projeto novo, decifrar, `psql`/restore,
    reconfigurar Secrets e Edge Functions.
  - Testar o restauro num projeto de teste no fim da Fase A e depois a cada 3 meses.
    Um backup nunca testado não conta como backup.
- **Custos:** o GitHub Actions em repositórios privados tem minutos gratuitos
  limitados. Medir a duração do job e confirmar que fica muito abaixo do limite.

**Estado (2026-09-26): nível 1 em produção, provado por leitura de volta; falta o teste
de restauro num projeto descartável, que fecha a Fase A.** O código vive no privado
`kamappa/sistema-backups` (`main` bf1913d; cópia local em
`%USERPROFILE%\Documents\sistema-backups`); o README desse repositório é o manual de
configurar, verificar, descarregar, repor e testar.

- O dump usa os filtros do `supabase db dump` (CLI v2.109.1) copiados para um script e
  corridos com o `pg_dump` 17 do repositório oficial do PostgreSQL: o mesmo caminho nos
  testes e no GitHub Actions (o CLI precisa de Docker).
- Os dados deixam de fora o `cron.job` (tem o token do Oráculo), o histórico do cron,
  as sessões, os refresh tokens, a auditoria e o pg_net; uma guarda recusa a cópia se
  algum aparecer. Numa reposição, os crons recriam-se com um token novo.
- `acls.sql`: as permissões exatas da API. Sem ele, repor num projeto novo devolvia
  EXECUTE ao `anon` nas funções das sessões — o teste apanhou-o.
- `age` 1.3.2 com o hash fixado; `actions/checkout` fixado por commit. B2: `diario/`
  todos os dias e `mensal/` no dia 1; a retenção são regras do bucket.
- Testes: `node testes/testar.mjs` nesse repositório — dois PostgreSQL locais, a
  estrutura real com dados sintéticos, 44 verificações (com um `aws` falso que imita o B2
  com Object Lock), workflow validado pelo `actionlint` e o bit de execução dos scripts
  verificado (o runner é Linux).
- 2026-09-24: primeira corrida do `dump.sh` e da guarda contra a base real — um dump
  manual antes da migração do Lote 1, feito no portátil com o `pg_dump` 18 pelo Session
  pooler (porta 5432) e guardado fora do repositório: guarda ok, sem `cron.job` nem
  token. Não substitui a corrida no GitHub Actions.
- Configurado (24–26/09): chave age com cópia offline; B2 na UE (`eu-central-003`),
  bucket privado com SSE-B2, ciclo de vida de 14 diárias e 12 mensais, **Object Lock em
  compliance, 14 dias** (o site só oferece esse modo: ninguém apaga nem encurta uma cópia
  trancada, nem o dono da conta nem o suporte), e tectos com alerta por email (10 GB,
  1 GB/dia de descarregamento, 2 500 transações Class B e C por dia).
- Chaves: a do workflow (`writeFiles`, `listFiles`, `listAllBucketNames`, só o bucket)
  nas Secrets do GitHub; uma só de leitura, que nunca vai para o GitHub, em DPAPI no PC,
  para verificar e descarregar. Os métodos dos segredos estão no README e em
  `ferramentas/`.
- **Incidente de 24 a 26/09:** depois de ligado o Object Lock, três corridas verdes (#2 a
  #4) não guardaram cópia nenhuma. O envio antigo ia sem soma (`when_required`); com
  retenção por omissão, o B2 exige-a e respondeu logo; o aws-cli 2.36.49 leu mal a
  resposta, repetiu três vezes, e um erro interno dele engoliu a falha — código 0.
  Correção: envio com `Content-MD5` e prova depois do envio (a versão criada tem de estar
  na lista, com o tamanho e o md5; senão a corrida falha). Enquanto durou, a única cópia
  no B2 foi a de 24/09. Regra que fica: **só a leitura de volta prova uma cópia**.
- Prova em produção (26/09, corrida #5): `enviado e confirmado`; as duas vistas do bucket
  (nativa e S3) iguais ao registo; a cópia descarregada com as somas do runner; e
  `repor.sh --so-verificar` com a chave privada — decifrou, somas certas, contagens iguais
  às da produção (app_state 1, courses 14, oracle_reports 5, radar_items 85, auth.users 1).
- Por fazer: o teste de restauro num projeto descartável (fecha a Fase A); o nível 2
  (opcional); confirmar se a ligação diária evita a pausa por inatividade do plano
  gratuito; e os pendentes do README (guarda anti-OneDrive dos dumps manuais, mudar para
  `C:\sistema`, defesa técnica contra cópias forjadas, tecto de descarregamento antes de
  uma reposição a sério).

## Correções ao código existente

- `VPATH` está fixo em `Sistema/Estudo`, por isso `Sistema/Horario/` NÃO é lido hoje,
  apesar de esta missão depender dele. Passar `VPATH` para `Sistema` e filtrar por uma
  lista de pastas permitidas, escrita como decisão e não deduzida do que existe, com
  limites de tamanho por pasta.
  - **Permitidas na Missão 31:** `Estudo/` (com `IPCA/`, `Temas/` e `Cursos/`),
    `Horario/`, `_MAPA.md`, e `Modelos/` só para conhecer a forma esperada das notas —
    nunca enumerado como conteúdo.
  - **Fora até à Missão 32:** `Eu/` e `Alimentar/`. São dela, não desta.
  - **`Eu/` tem uma condição a mais.** Hoje a Ficha do Jogador está fora do alcance do
    Oráculo por construção: o `VPATH` não chega lá. Alargar o `VPATH` troca essa
    garantia por uma lista, e é a lista que passa a decidir. A Ficha tem montantes de
    rendimento e orçamento que decidi tirar antes de o Oráculo a ler; `Eu/` só entra na
    lista depois de eu confirmar que saíram. Não é obrigação legal — é tratamento meu,
    em atividade pessoal (RGPD, art. 2.º, n.º 2, al. c)) —, é minimização que decidi
    aplicar a mim próprio, e a ordem de execução não a pode ultrapassar em silêncio.
  - Código que leia `Sistema/` inteiro sem lista é um defeito, não uma simplificação.
- `soEstudo` passa a excluir caminhos com um segmento `Oraculo/` (os outputs do
  Oráculo nunca entram como "estudo meu"), e a aceitar `.excalidraw.md` nunca.
- `vaultChanges` pede `commits?path=Sistema/Estudo&per_page=100` sem paginação. Com
  commits de 15 em 15 minutos e várias cadeiras, uma semana pode passar os 100 commits,
  e o relatório semanal perderia atividade. Paginar até cobrir o intervalo pedido.
- O filtro de leitura passa a incluir também `Sistema/Horario/alteracoes.md`, sem
  alargar o resto do acesso.
- O relatório e o radar devem agrupar a atividade por cadeira (pasta), e não só listar
  caminhos.

**Estado (Lote 2, 2026-09-23; publicado a 2026-09-24 — `main` `bc0cbb0` e Oráculo v20):**
as cinco correções estão feitas e testadas, junto com o achado prioritário da auditoria
(commits apresentados como estudo em 8 sítios do Oráculo).

- Lista de leitura em `supabase/functions/oraculo/vault-lista.ts`, aplicada em cada
  leitura (`vaultFile` recusa o que estiver fora) e não só nas listagens. Conteúdo:
  `Estudo/`, `Horario/alteracoes.md`, `_MAPA.md`; `Modelos/` só a pedido da forma; fora
  `Eu/`, `Alimentar/`, qualquer segmento `Oraculo/` e `*.excalidraw.md`. Do `Horario/`
  entra só `alteracoes.md` — o quarto ponto pede "sem alargar o resto do acesso", e é o
  único ficheiro que lá existe.
- Commits não são estudo: o modelo recebe quantas sincronizações houve, as notas com
  texto novo por cadeira e a reorganização à parte, com o aviso de que commits não medem
  tempo, dias nem frequência de estudo; os instantes de cada commit deixaram de ir.
- Paginação dos commits até 10 páginas por caminho, com a truncagem declarada; o
  limite de 300 ficheiros da comparação do GitHub também é declarado.
- O repositório `vault-sistema` tem `Sistema/Eu/Ficha-do-Jogador.md` desde 17/09 (o
  `.gitignore` do vault deixa entrar todo o `Sistema/`). O Oráculo não o lê — nem antes
  nem depois deste lote —, mas o `VAULT_TOKEN` tem acesso: é a lista que o separa.
- Achado de segurança, corrigido no mesmo lote: o Radar e o relatório (texto do
  modelo, escrito a partir da web) iam para o `innerHTML` sem escape, e uma missão
  aceite levava o título para objetivos, sombras, registo e prazos. `escHTML` e
  `urlSegura` em `js/engine.js`; prova em `node testes/seguranca/xss-oraculo.mjs`.
- Testes: `deno test --no-prompt testes/oraculo/vault-lista.test.ts` (lógica pura) e
  `node testes/fumo/fumo.mjs --so-oraculo` (a função inteira, em modo de teste).
- Publicado a 2026-09-24: o Oráculo v20 (era a v19, de 2026-07-19) saiu de um export do
  commit `bc0cbb0`, e os ficheiros publicados são byte a byte os do commit.
- **O Oráculo não completa nenhuma corrida desde 2026-08-15** (último radar a
  2026-08-14, último relatório a 2026-08-09) — causa o saldo da Anthropic, confirmada a
  2026-09-24 nos logs da corrida das 06:30 UTC (v20; a invocação `POST` devolveu 500):

  ```
  Error: {"type":"invalid_request_error","message":"Your credit balance is too low to access the Anthropic API. Please go to Plans & Billing to upgrade or purchase credits."}
  ```

  Até o saldo ser reposto, cada corrida falha assim: é o esperado, não uma regressão. A
  prova de que voltou: itens novos em `radar_items` minutos depois das 06:30 UTC
  (`radar-diario`) e um relatório novo ao domingo depois das 19:00 UTC
  (`oraculo-semanal`). O `Timeout of 5000 ms` que o `pg_net` regista não é a avaria: é o
  limite do próprio `pg_net`; até 14/08 os itens nasciam 1–2 min depois do disparo, com
  a função a continuar depois de o `pg_net` desligar. A 24/09 a função falhou às
  06:30:06, cerca de um segundo depois de o `pg_net` desistir — por isso o 500 só
  aparece nos logs da função, nunca no `net._http_response`.

## Escalabilidade (atividades novas no futuro)

Para acrescentar uma atividade nova (uma certificação, um bootcamp, um projeto, um
estágio) sem reescrever nada, vale sempre a mesma forma:

```
Sistema/<Domínio>/<Item>/
  Aulas/     ← sessões datadas (id no nome), com o modelo Templater
  Notas/     ← o resto
  Oraculo/   ← só o Oráculo escreve
  _index.md
```

- `<Domínio>` é `Estudo/IPCA`, `Estudo/Cursos`, `Carreira`, `Projetos`, … e cria-se
  à vontade.
- O padrão do Templater é genérico: `^Sistema/.*/Aulas/[^/]+\.md$`. Qualquer domínio
  novo funciona no dia em que a pasta `Aulas/` existe.
- No Sistema, `courses` ganha `dominio` e passa a representar qualquer item com
  sessões (cadeira, curso, certificação). Nada no código deve assumir "IPCA".
- Os `_index.md` são gerados por uma consulta Dataview única (lista as notas da pasta),
  e não por contagens escritas à mão, que ficam desatualizadas. Instalar o Dataview.

## Pré-requisitos no Obsidian (verificar comigo antes da Fase C)

- Obsidian Git com pull automático ativo e pull antes de cada push, para os ficheiros
  que o Oráculo escreve em `Oraculo/` chegarem ao vault sem conflitos.
- Notas diárias (Daily Notes), se existirem, numa pasta fora de `Sistema/`.

## Segurança e privacidade

- Todos os segredos ficam nos Secrets do Supabase: `VAULT_TOKEN`, VAPID, segredo do
  webhook e chave Anthropic. Nada no frontend (o GitHub Pages é público).
- Todos os modos novos exigem operador (JWT) ou segredo (cron/webhook).
- Uploads:
  - bucket privado;
  - URLs assinados de curta duração;
  - apagados conforme o pipeline.
- Worten: só a minha linha.
- Notificações sem conteúdo das notas.
- Webhook do GitHub configurado só no `vault-sistema`, só para o evento `push`, com
  segredo próprio.
- `VAULT_TOKEN` fine-grained, só com permissão `contents` no `vault-sistema`, e com
  data de expiração.
- Não expor caminhos locais nem nomes de utilizador no repositório público. Corrigir
  `C:\Users\...` no SPEC para `%USERPROFILE%`.
- Custos:
  - `oracle_usage` por modo;
  - limite diário configurável para pós-aula, pedidos e extrações;
  - painel simples de consumo mensal nas definições.

## Ordem e método

A → B → C → D. Em cada fase:

1. apresentar um plano curto para eu aprovar;
2. implementar;
3. fazer deploy;
4. testar os critérios de aceitação;
5. atualizar o SPEC;
6. usar durante uma semana real antes de passar à fase seguinte.

As cópias de segurança são feitas no início da Fase A, antes de qualquer dado novo.
A Missão 32 começa depois da Fase C, com 2–3 semanas de uso real, para haver dados.
O editor (D) pode avançar em paralelo com a Missão 32, se eu decidir.

# Missão 32 — Memória do Oráculo e Missões Propostas

(Depende da Missão 31 até à Fase C. Seguir o protocolo do `CLAUDE.md` e a
`SYSTEM-ORACLE-CONSTITUTION.md`, em especial:

- §4 "O Sistema nunca mente";
- §5 facto / inferência / hipótese / previsão / recomendação;
- §11 autonomia por níveis;
- §12 ações que exigem aprovação.)

## Ordem proposta (Missões 31 a 34)

1. **Missão 34 — Sessões de Estudo** (cronómetro). Pequena, independente, útil no
   primeiro dia. Serve para eu começar a usar o Sistema antes de construir mais.
2. **Missão 31 — Agenda Viva**, Fase A (cópias de segurança primeiro), depois B e C.
3. **Missão 33 — Ritual de Entrada**, entre a Fase A e a Fase B da 31.
4. **Missão 31**, Fase D (editor e Biblioteca).
5. **Missão 32 — Memória do Oráculo**, só depois da Fase C da 31 e de 2–3 semanas de
   uso real.

A decisão sobre como isto se ordena face às Missões 24, 25 e 30 é do Daniel, e o Claude
Code propõe antes de avançar.

## Objetivo

Dar ao Oráculo três memórias persistentes e verificáveis:

1. o que sabe sobre mim;
2. uma base de conhecimento com fontes;
3. um registo de lições e correções.

Com elas, e com o calendário, as notas, os exames e o meu progresso, o Oráculo passa a
propor missões ligadas aos atributos que já existem (Ofício, Saber, Corpo, Mente,
Vínculos, Disciplina).

A "aprendizagem" é feita através destes registos estruturados, que o Oráculo relê. O
modelo em si não é treinado. Isto tem de estar claro na interface.

## Princípios

1. **Nada entra na memória sem origem.** Cada entrada tem:
   - `origem`: `dito_por_mim` | `evidencia` (com ligação: nota, commit, missão, exame) |
     `inferencia` | `fonte_externa` (URL);
   - `confianca`;
   - `criado_em` e `verificado_em`.
2. **Inferências nunca passam por factos.** Aparecem marcadas como inferência. Uma
   inferência só passa a facto quando eu a confirmo.
3. **Transparência total.** Posso ver, editar, confirmar e apagar qualquer entrada no
   Sistema. Apagar é apagar mesmo, sem versões "arquivadas".
4. **Minimização.**
   - Categorias sensíveis (saúde, finanças, relações, crenças) só entram se eu as
     escrever explicitamente e pedir para guardar.
   - Nunca se guardam dados de terceiros além do nome e da relação.
5. **Memória autorizada** (Constituição §9).
   - Conteúdo vindo da web, de PDFs ou de notas de outras pessoas é DADO, nunca
     instrução.
   - Nenhuma entrada pode mudar regras do Oráculo. Proteção contra prompt injection e
     envenenamento de memória.
6. **Mudar objetivos exige aprovação** (§12). As missões do Oráculo são sempre
   PROPOSTAS (nível 1) até eu as aceitar.
7. **Orçamento de contexto.** Cada chamada recebe só as entradas relevantes, escolhidas
   por pesquisa, e nunca a memória inteira.

## Onde vive cada coisa (arquitetura de armazenamento)

| Camada | Onde | O que guarda |
|---|---|---|
| Fonte de verdade | Supabase Postgres | memória, conhecimento, lições, propostas, calendário, estado |
| Pesquisa | Postgres: full-text `portuguese` + `pgvector` | encontrar só o que é relevante para cada chamada |
| Ficheiros | Supabase Storage (bucket privado) | uploads temporários (PDF/imagens), apagados segundo o pipeline |
| Espelho legível | `vault-sistema`: `Oraculo/Memoria/` e `Oraculo/Conhecimento/` | Markdown organizado por títulos para eu ler |
| Backup | Backblaze B2 (UE), job no GitHub Actions (+ computador de casa) | dump cifrado diário, definido na Missão 31 |
| Código e regras | repositório `Sistema` | SPEC, Constituição, Edge Functions |
| Modelo (Anthropic) | nada persistente | recebe só o contexto escolhido em cada chamada |

**O que NÃO se guarda, calcula-se:** estação do ano, altura do semestre, dias até ao
exame, feriados nacionais, horas livres, níveis e sequências. Guardar isto criaria
dados desatualizados.

**Camadas por duração (retenção automática):**

- Permanente, até eu apagar: memória sobre mim confirmada, conhecimento oficial (com
  versões), lições ativas, histórico do calendário, missões.
- Revalidável (60 dias): inferências sobre mim.
- Efémera, com TTL:
  - `oracle_signals`: notícias, tendências e eventos externos. Campos: `titulo`,
    `resumo` (≤3 frases), `fonte_url`, `dominio`, `relevancia`, `expira_em`
    (30 dias por defeito; 90 se estiver ligado a uma missão ou nota).
  - Nunca guardar artigos inteiros.
  - Um job diário apaga os sinais expirados.
- Registos técnicos (`jobs`, `oracle_usage`, `notifications_sent`): 90 dias; depois,
  só totais mensais.

**Sinais externos (notícias e tendências):**

- Fontes permitidas por defeito: ENISA, CNCS, CNPD, EDPB, Comissão Europeia, NIST,
  ISO (páginas públicas), Diário da República, EUR-Lex.
- Outras fontes só depois de eu as aprovar numa lista editável.
- "O que está em alta" = temas repetidos em várias fontes permitidas na última
  semana. Não usar redes sociais nem rankings de SEO.
- Máximo de 5 sinais por semana no relatório. Um sinal só gera proposta de missão se
  estiver ligado a algo meu (cadeira, exame, objetivo, certificação).

**Pesquisa (embeddings):**

- A Anthropic não disponibiliza modelo de embeddings.
- Fase A/B: começar com full-text search do Postgres em português (sem custo e sem
  serviço extra). Acrescentar embeddings só se a pesquisa falhar em testes reais.
- Nesse caso, preferir o modelo de embeddings integrado nas Edge Functions do
  Supabase (verificar disponibilidade), para não acrescentar um fornecedor novo.
  Justificar qualquer alternativa externa (custo, privacidade, subcontratante).

**Orçamento de espaço (Supabase Free: 500 MB de base de dados, 1 GB de ficheiros, sem
backups, pausa por inatividade — confirmar o plano atual):**

- Texto ocupa pouco: legislação completa e anos de notas ficam em dezenas de MB.
- Embeddings: cerca de 6 KB por fragmento (1536 dimensões), ou menos com modelos mais
  pequenos.
- Painel de espaço nas definições, com alerta aos 70% do limite.
- Limpeza pela retenção acima antes de pensar em mudar de plano.

**Backup:** as tabelas desta missão entram no backup cifrado diário da Missão 31
(dumps cifrados no Backblaze B2). Nada de exportações em claro para o vault. Pedidos de apagamento
aplicam-se também aos backups: não se editam backups antigos, mas a retenção
(14 diários, 12 mensais) garante que o dado desaparece dentro desse prazo, e isso é
explicado na interface.

**Quando passar ao plano Pro (25 USD/mês) — critérios objetivos:**

- a base de dados passa de 70% do limite DEPOIS de aplicar a retenção e o arquivo;
- são precisos mais de 1 GB de ficheiros que não podem sair para o disco local;
- o backup próprio falha repetidamente ou o restauro de teste não funciona;
- a pausa por inatividade causa problemas apesar do job diário;
- o Sistema passa a tratar dados de outras pessoas (por exemplo, clientes do projeto
  Money Print). Nesse caso, o plano gratuito deixa de ser adequado.

Enquanto nenhum destes se verificar, fica no plano gratuito.

**Servidor próprio (avaliado, não adotado agora):** correr o Supabase em Docker num
computador antigo é possível, mas:

- a eletricidade de uma máquina ligada 24/7 pode custar vários euros por mês;
- exige atualizações de segurança, monitorização e um túnel seguro (nunca abrir
  portas no router);
- falhas de luz ou de disco tiram o Sistema do ar;
- o iPhone deixa de ter acesso quando o servidor está desligado.

Decisão: usar o computador de casa como destino de backup (Nível 2) e rever esta
decisão se o custo do Pro se tornar um problema real.

**Como a memória muda (sem se tornar um caos):**

- Adicionar: cria uma entrada nova com origem.
- Atualizar: cria uma nova versão; a anterior fica em `*_history` durante 90 dias,
  para auditoria e para desfazer.
- Substituir: marca a antiga como `desatualizado` com ligação para a nova.
- Apagar a meu pedido: apagamento real, também no histórico e no próximo backup.
- Consolidação mensal: fundir duplicados e resumir entradas antigas, mostrando-me as
  alterações.

## Modelo de dados (Supabase, RLS; pesquisa full-text, `pgvector` opcional)

**`oracle_memory_user`** — memória sobre mim

- `categoria`: identidade, objetivos, preferências, hábitos, forças, dificuldades,
  contexto (curso, trabalho), marcos.
- `tipo`:
  - `facto`: algo que eu disse ou escrevi (ex.: "quer ser ISO 27001 Lead Auditor");
  - `objetivo`: meta declarada por mim, com prazo se existir;
  - `padrao`: algo medido nos dados, sempre com período e números (ex.: "nas últimas
    4 semanas, 70% da atividade no vault foi entre as 21h e as 23h"); recalculado
    periodicamente, desaparece quando deixa de ser verdade;
  - `preferencia`: aprendida com as minhas respostas (ex.: "rejeitou 3 missões de
    estudo ao sábado");
  - `hipotese`: suposição do Oráculo; expira ao fim de 30 dias se eu não a confirmar,
    e nunca é usada como facto.
- Proibido: rótulos de personalidade e inferências sobre saúde, psicologia ou outras
  categorias sensíveis. Nessas áreas só entra o que eu escrever como `facto`.
- Entradas que eu marcar como "privadas" não são espelhadas no vault.
- Não duplicar a Living Memory (Missão 15): a Living Memory trata efemérides; esta
  memória trata factos, objetivos, padrões e preferências.
- Comparações: o relatório semanal e as missões usam linhas de base (média das últimas
  4 semanas) e dizem com que entradas estão a comparar.
- `texto`, `origem`, `evidencia_ref`, `confianca`, `estado`, `embedding`.
- `estado`: `ativo` | `por_confirmar` | `desatualizado`.
- Revalidação: entradas `inferencia` com mais de 60 dias sem evidência nova passam a
  `por_confirmar`, e o Oráculo pergunta no relatório semanal (máximo 3 por semana).

**`oracle_knowledge`** — base de conhecimento, organizada por títulos

- Estrutura em árvore, com títulos fixos: `area` → `dominio` → `tema` → `subtema` →
  entrada. Tabela `knowledge_tree` (id, pai, título, ordem, descrição) e cada entrada
  aponta para um nó.
- Áreas iniciais (editáveis por mim):
  - **Conformidade e privacidade:** RGPD, lei portuguesa de execução, CNPD, EDPB.
  - **Cibersegurança:** NIS2 e regime jurídico português, CNCS, ENISA, controlos.
  - **Normas ISO:** 27001, 27002, 27005, 27007, 42001 (só estrutura, títulos e notas).
  - **Governação de IA:** AI Act, ISO/IEC 42001, NIST AI RMF.
  - **Auditoria:** técnicas, amostragem, evidências, relatórios.
  - **Tecnologia:** cloud (Azure…), bases de dados, redes.
  - **Carreira:** certificações, mercado em Portugal.
  - **Cultura geral:** história, geografia, ciência, economia, atualidade, língua
    portuguesa.
- Formato de cada entrada:
  - título;
  - resumo (2–3 frases);
  - pontos-chave;
  - "porque importa" (ligação ao meu estudo ou carreira, quando existir);
  - referências (artigo, cláusula, URL);
  - relações com outras entradas;
  - `tipo`: `texto_oficial` | `orientacao_oficial` | `nota_minha` | `resumo_oraculo` |
    `cultura_geral`;
  - `versao_ou_data`, `obtido_em`, `confianca`, `embedding` (opcional).
- Fontes:
  - técnicas e legais: só oficiais (EUR-Lex, Diário da República, CNPD, CNCS, EDPB,
    ENISA, NIST, páginas públicas ISO);
  - cultura geral: obras de referência reputadas, sempre com URL e confiança
    `media`, confirmadas em pelo menos duas fontes quando for um facto preciso (datas,
    números). Nunca usadas como base para matéria técnica ou legal.
- Normas ISO: direitos de autor. Guardar apenas número e título de cláusulas e
  controlos, as minhas notas e resumos do Oráculo marcados como tal. Nunca texto
  integral, mesmo que eu o carregue.
- Ingestão:
  - fontes que eu indico, ou que o Oráculo propõe e eu aprovo;
  - fragmentação por artigo ou cláusula;
  - verificação de duplicados;
  - legislação alterada cria uma nova versão e marca a anterior como substituída.
- Cultura geral cresce devagar: no máximo 10 entradas novas por semana, escolhidas
  pelo que estudo, pelo calendário (datas históricas, estação) e pelos sinais
  externos. Opcional: um "sabias que" por dia no radar, sempre com fonte.
- Espelho legível no vault: `Oraculo/Conhecimento/<Área>/<Domínio>/<Tema>.md`, com
  títulos `#`/`##`/`###` pela árvore, um `_indice.md` por área e ligações com caminho.
  Só leitura, reescrito quando a entrada muda.
- Regra de citação: qualquer referência a artigo, cláusula ou controlo nas respostas
  tem de vir de uma entrada recuperada nesta chamada (ou de um URL da pesquisa). Sem
  isso, o Oráculo diz "não confirmado".

**`oracle_lessons`** — memória operacional do agente

- `gatilho`:
  - correção minha ("isto está errado");
  - proposta rejeitada;
  - extração corrigida;
  - URL inválido;
  - job falhado;
  - notificação ignorada.
- Campos:
  - `o_que_falhou`: o que aconteceu;
  - `como_falhou`: sequência concreta;
  - `causa`: provável, marcada como inferência se não for certa;
  - `impacto`;
  - `regra_aprendida`: frase curta e acionável;
  - `evitar`: o que não voltar a fazer;
  - `como_verificar`: sinal de que a lição está a funcionar;
  - `ambito`: modo ou domínio;
  - `estado`, `aplicada_vezes`, `ultima_aplicacao`.
- `estado`: `proposta` | `ativa` | `retirada`.
- Lições que só afinam formato ou extração podem ficar ativas logo. Lições que mudam
  comportamento (prioridades, frequência, tom, o que conta como evidência) ficam
  `proposta` até eu aprovar.
- Consolidação mensal: juntar lições duplicadas, retirar as que nunca são aplicadas e
  mostrar-me um resumo do que mudou.

**`oracle_corrections`**

- Botão "Isto está errado" em qualquer resposta, resumo, plano ou entrada de memória.
- Frase no chat: "corrige: …".
- Campos: `alvo`, `o_que_estava`, `correcao`, `fonte` (opcional).
- Efeito: corrige a entrada visada (memória ou conhecimento) e cria uma lição.

**`mission_proposals`**

- `titulo`, `atributo` (ATTRS existentes), `area`, `prioridade`, `prazo`, `xp_sugerido`,
  `porque` (1–2 frases), `evidencias` (ligações), `tipo`, `estado`.
- `tipo`: `facto` (há evidência de necessidade) | `hipotese` (pode vir a ser útil),
  sempre visível.
- `estado`: `proposta` | `aceite` | `editada` | `rejeitada` (com motivo opcional).

## O Oráculo como mestre de jogo pessoal

**Papel.** O Oráculo age como mestre de jogo e treinador do "jogador" (eu): conhece a
personagem, o mapa (calendário), as quests (missões) e o histórico, e desenha a
progressão para eu evoluir. Segue a Constituição: honestidade, autonomia, aprovação
para mudar objetivos.

Regras de progressão:

- Dificuldade ajustada ao que as evidências mostram. Nem demasiado fácil, nem
  impossível.
- Respeita o sono, o trabalho e o descanso.
- Sem punições nem culpa por sequências quebradas.
- Sem padrões manipuladores (urgência falsa, recompensas aleatórias para prender a
  atenção).
- Incentiva a relação com pessoas reais e não se apresenta como substituto delas.
- Desafia-me quando estou errado e aponta quando estou a "construir em vez de usar".

**Leitura das minhas notas pessoais (com consentimento explícito)**

- Pasta nova `Sistema/Eu/`. Só o que eu puser lá é lido pelo Oráculo. `Pessoal/`,
  `Vida/` e `Diario/` continuam privados e fora do GitHub.
- Sugestão de conteúdo: reflexões, objetivos pessoais, balanços mensais, o que me
  motiva ou bloqueia.
- Antes de escrever lá, lembrar:
  - evitar dados de terceiros (nomes de outras pessoas, colegas, família);
  - categorias sensíveis (saúde, finanças) só se eu quiser que o Oráculo as use;
  - tudo o que está nesta pasta vai para o GitHub (privado) e é enviado à API da
    Anthropic quando for relevante (confirmar nos termos comerciais em vigor se os
    dados da API são usados para treino).
- O Oráculo nunca cita as notas de `Sistema/Eu/` em notificações nem no ecrã
  bloqueado.

**Ficha do Jogador (`Sistema/Eu/Ficha-do-Jogador.md`, escrita e mantida por mim)**

Secções:

- quem sou;
- visão a 1, 3 e 5 anos;
- valores;
- o que me motiva;
- o que me desmotiva;
- como quero ser desafiado;
- tom que prefiro;
- limites (o que o Oráculo não deve fazer);
- padrões que conheço em mim;
- temporada atual (objetivos dos próximos 3 meses);
- recursos e restrições (tempo, dinheiro, trabalho).

O Oráculo pode propor alterações à ficha, mas nunca a edita sozinho (usa o fluxo
"Editar com o Oráculo").

**Arquitetura de contexto** (não é um "contexto gigante", é o contexto certo em cada
chamada). Cada chamada é montada por camadas, com um orçamento de tokens por camada:

1. **Identidade (fixa):** a Constituição resumida para o modelo, o papel de mestre de
   jogo e as regras acima. Com prompt caching da API, para reduzir custo e latência.
2. **Retrato do jogador (compacto, cerca de 1–2 páginas):** gerado a partir da Ficha
   do Jogador e da memória confirmada; regenerado uma vez por semana e quando a ficha
   muda. Versionado e visível para mim.
3. **Estado atual (calculado na hora):** atributos e níveis, missões ativas, hábitos,
   sono, calendário dos próximos 7–14 dias, exames, temporada.
4. **Memória recuperada:** apenas as entradas relevantes para o pedido (memória sobre
   mim, conhecimento, notas de `Sistema/Eu/` e de estudo), com fonte.
5. **Lições ativas** do âmbito da chamada.
6. **Pedido ou gatilho.**

- Se o orçamento for ultrapassado, cortar de baixo para cima nas camadas 4 e 5, nunca
  a 1.
- Registar em `oracle_usage` os tokens por camada.

## Alimentar o Oráculo

**Entradas (tudo passa por uma fila `knowledge_inbox`):**

- Sistema: página "Alimentar", onde colo texto, um URL ou um PDF e escolho, se quiser,
  a área da árvore.
- Biblioteca (Missão 31, Fase D): qualquer documento sobre NIS2, RGPD, governação de
  IA, ISO 27001, auditoria, etc., arquivado por área da árvore (não só por cadeira),
  com o botão "Alimentar o Oráculo".
- Obsidian: pasta `Sistema/Alimentar/`. Qualquer nota lá colocada entra na fila no
  próximo push. O Oráculo nunca edita nem apaga essas notas.
- Chat: "guarda isto: …".

**Processamento:**

1. Classificar na árvore.
2. Dividir em entradas.
3. Verificar duplicados e contradições com o que já existe.
4. Verificar a fonte.
5. Resultado:
   - fontes oficiais e as minhas notas: entram diretamente, e aparecem no resumo
     semanal;
   - cultura geral e fontes não oficiais: entram como `proposta` até eu aprovar em
     lote (revisão semanal de cerca de 15 minutos).
   - Material protegido por direitos de autor (livros pagos, normas ISO, cursos): só
     resumo e referências, nunca texto integral.

**Registo de mudanças do Sistema (`system_events`):**

- Registo auditável do que mudou: horário, exames, missões, memória, lições,
  definições e deploys (versão/commit).
- Campos: data, origem (eu, Oráculo, job, deploy), resumo e ligação.
- O Oráculo usa este registo para comparar o antes e o depois.

**Reflexão mensal (`improvement_proposals`):**

- O Oráculo lê `system_events`, `oracle_lessons`, `oracle_usage` e o uso das
  notificações, e propõe melhorias:
  - de processo ("o resumo pós-aula é aberto 20% das vezes: reduzir para 3 linhas?");
  - de código.
- Propostas de código não são aplicadas pelo Oráculo. Ficam num texto pronto a colar
  no Claude Code, como candidata a missão, que eu aprovo.
- O Oráculo não tem permissões de escrita no repositório `Sistema`.

**Volatilidade e reverificação nas fontes**

Cada entrada de conhecimento e cada entrada crítica tem `volatilidade`, que define se
e quando o Oráculo volta à fonte para confirmar:

| Volatilidade | Exemplos | Reverificação |
|---|---|---|
| `estavel` | factos históricos, definições consolidadas, cultura geral antiga | nunca automática; só se eu a marcar como errada |
| `baixa` | texto de leis e regulamentos em vigor, estrutura de normas | trimestral, e sempre que um sinal externo indicar alteração |
| `media` | orientações (EDPB, CNPD, ENISA), requisitos de certificações, programas | mensal |
| `alta` | preços, datas, formatos de exame, prazos, estado de propostas legislativas, notícias | semanal, e sempre antes de ser usada numa resposta, plano ou missão |

- A volatilidade é proposta pelo Oráculo na ingestão e editável por mim. Tudo o que
  eu marcar "vou seguir isto" fica pelo menos `media`.
- A reverificação volta ao URL guardado (ou pesquisa a fonte oficial, se o URL
  morreu), compara com o que está guardado e regista `verificado_em`, o resultado
  (`igual` | `alterado` | `fonte_indisponivel`) e as diferenças.
- `alterado`: cria uma proposta de correção e marca a entrada `por_confirmar`. Até eu
  confirmar, as respostas usam-na com aviso.
- `fonte_indisponivel` duas vezes seguidas: procura uma fonte oficial alternativa e
  avisa.
- Custos: reverificações agrupadas num job semanal, com limite em `oracle_usage`. As
  de volatilidade `alta` usadas numa resposta contam para o limite desse modo.

**Revisão semanal (15–20 min, página "Revisão")** — tudo num só ecrã, por esta
ordem:

0. **Classe de volatilidade** (campo `volatilidade` em cada entrada, proposto pelo
   Oráculo e ajustável por mim). Decide quando o Oráculo volta à fonte:
   - `volatil` — muda com frequência ou sem aviso: preços, formatos e requisitos de
     certificações, datas, orientações em revisão, legislação em transposição,
     programas. Verificação semanal, ou antes de cada uso num plano ou missão.
   - `periodica` — muda em ciclos conhecidos: normas ISO (revisões), regulamentos com
     atos delegados, guias anuais. Verificação trimestral e sempre que um sinal externo
     indicar alteração.
   - `estavel` — não muda: factos históricos, conceitos consolidados, textos revogados
     guardados como histórico. Sem verificação periódica; só volta a ser verificada se
     surgir uma contradição ou se eu pedir.
   - A verificação faz pesquisa real (web fetch da fonte guardada e, se falhar, uma
     pesquisa pela fonte oficial atual). Nunca "confirma" a partir da própria memória.
   - Registo de cada verificação: data, URL consultado, resultado (`confirmado` |
     `alterado` | `fonte_indisponivel` | `contradicao`).
   - Limite de custo: número máximo de verificações por semana, começando pelas
     entradas críticas e voláteis.
1. **Verificação de informação crítica.** Entradas marcadas `critica: true`:
   - os meus objetivos e percurso (certificações-alvo, requisitos, pré-requisitos,
     preços, formatos de exame, validade);
   - as datas dos meus exames e o âmbito;
   - os programas das cadeiras;
   - os artigos e controlos usados em planos ou missões ativas;
   - a memória sobre mim que influencia recomendações.

   Para cada uma, o Oráculo:
   - volta a abrir a fonte oficial (URL guardado) e compara com a versão guardada
     (hash e resumo das diferenças);
   - assinala as desatualizadas (mais de 90 dias sem verificação), as sem fonte, as
     contraditórias e as alteradas na origem;
   - propõe a correção, que eu confirmo ou corrijo. Nada crítico é alterado sem mim.
   - O que eu marcar como "vou seguir isto" passa automaticamente a crítico.
2. **Propostas de conhecimento** (cultura geral e fontes não oficiais), aprovadas em
   lote.
3. **Lições propostas.**
4. **Inferências sobre mim por confirmar** (máximo 3).
5. **Resumo:** o que entrou, o que mudou e o que foi fundido.

Se eu não fizer a revisão, nada crítico fica "verificado" por omissão: o estado passa
a `por_verificar`, e as respostas que dependam disso avisam.

**Qualidade acima de quantidade:**

- Painel com o total de entradas por área, as propostas pendentes, os duplicados
  fundidos e as contradições por resolver.
- Contradição entre entradas: nenhuma é apagada automaticamente; a mais recente com
  fonte oficial prevalece, e eu sou avisado.

## Geração de missões

**Gatilhos**

- Novo exame ou alteração de âmbito.
- Tema confirmado como dado.
- Aula `cancelada_sem_reposicao`.
- Calendário escolar novo (épocas, férias).
- Resumo pós-aula com lacunas.
- Relatório semanal.
- Atributo sem atividade há 14 dias.
- Prazo a aproximar-se.
- Evento pessoal que exige preparação.
- **Acontecimento externo**, só de uma lista de fontes que eu aprovei (CNPD, EDPB,
  Diário da República, ISO, ENISA, CNCS, e o que eu acrescentar). Exemplos: uma coima
  publicada, uma norma revista, um diploma de transposição.
  - Sem ligação à fonte, não existe. Se o Oráculo não puder citar onde leu, não propõe.
  - O acontecimento é facto (tem fonte); a missão que dele decorre é proposta dele, e é
    apresentada como tal.
  - Fontes acrescentam-se e retiram-se por mim, e a lista vive em
    `oracle_memory_user` como `preferencia`.

**Entradas da chamada**

- Estado atual: atributos e níveis, missões ativas e concluídas, hábitos e sequências,
  sono.
- Calendário dos próximos 30 dias e horas livres.
- Exames e âmbitos.
- Memória relevante sobre mim.
- Lições ativas.

**Relevância**

A relevância não é uma nota que o Oráculo inventa. É composta de três coisas que eu
consigo ver e contestar uma a uma, e todas as três aparecem na proposta:

1. **Peso** — os ECTS da cadeira (`courses.ects`). Uma cadeira de 6 pesa o dobro de uma
   de 3. Fora do IPCA, o peso é o que eu tiver declarado para esse tema.
2. **Proximidade** — dias até à avaliação ou ao prazo. Facto, vem do calendário.
3. **Distância ao alvo** — a que objetivo de carreira isto serve (ISO 27001 Lead
   Auditor, DPO, governação de IA). Vem da Ficha do Jogador, não de suposição.

Na proposta, isto lê-se assim: "6 ECTS, exame daqui a 18 dias, liga-se a ISO 27001 Lead
Auditor". Se eu discordar de um dos três, digo qual, e isso gera uma lição.

Sem os três, a proposta não é feita. Uma missão sem peso conhecido, sem prazo e sem
ligação a um alvo é uma missão que o Oráculo quer propor por querer propor.

**Regras**

- Máximo de **3 propostas por semana**, e só uma por gatilho. Missões são escassas, não
  são um caudal: se forem cinco por dia porque aconteceram cinco coisas no mundo do GRC,
  eu deixo de as ler ao fim de uma semana. O limite obriga-o a escolher, e a escolha
  dele diz-me o que ele considera importante — isso é informação que eu quero ver.
- Não duplicar missões ativas.
- Não propor nada que não caiba nas horas livres.
- Cada proposta indica o atributo e o porquê.
- Mostrar sempre a diferença entre "precisas disto" (facto, com evidência) e "isto
  pode ser útil" (hipótese).
- XP sugerido dentro das regras atuais do motor. Nunca XP concedido antes de conclusão
  com evidência (§4).
- Aceitar cria o objetivo em `S.objectives` no cliente, pela função que já existe. O
  servidor nunca escreve diretamente no `app_state`.
- Rejeições com motivo geram lições e uma `preferencia`, e bloqueiam propostas iguais
  durante 60 dias.
- Propostas não respondidas expiram ao fim de 7 dias. No máximo 5 pendentes ao mesmo
  tempo.
- Equilíbrio entre atributos só com evidência: nada de missões genéricas para "encher"
  um atributo, nem metas de saúde, dieta ou treino que eu não tenha declarado.
- Relatório mensal: propostas aceites, rejeitadas e concluídas. Se a taxa de aceitação
  for baixa, o Oráculo propõe menos e pergunta porquê.

## Interface

**Página "Memória do Oráculo"**

- Separadores: Sobre mim / Conhecimento (navegação pela árvore de títulos, com pesquisa) /
  Lições / Correções.
- Filtros por origem e estado.
- Ações: confirmar, editar, apagar, ver evidência.
- Contadores: entradas por confirmar, lições propostas.

**Outros pontos**

- Missões propostas: cartões em Operações com Aceitar / Editar / Rejeitar.
- Espelho só de leitura no vault:
  - `Oraculo/Memoria/Sobre-mim.md`;
  - `Oraculo/Memoria/Licoes.md`;
  - `Oraculo/Conhecimento/…` (árvore por títulos, descrita acima).
- "Esquece isto" no chat apaga a entrada visada e confirma o que foi apagado.

## Segurança e custos

- Embeddings e extrações contam em `oracle_usage`, com limites diários.
- As entradas da memória nunca vão para notificações nem para o `.ics`.
- Exportação completa da memória em JSON, a meu pedido (portabilidade, RGPD art. 20.º),
  e botão "apagar toda a memória sobre mim" com dupla confirmação.
- Auditoria: registo de quem criou ou alterou cada entrada (utilizador, modo do
  Oráculo, job).

## Fases

- **A.** Tabelas, página de Memória (ver, editar, apagar), correções e lições (sem
  geração automática).
- **B.** Base de conhecimento com ingestão de fontes oficiais, pesquisa e regra de
  citação em todos os modos.
- **C.** Memória sobre mim alimentada pelo chat, pelos relatórios e por evidências, com
  revalidação.
- **D.** Missões propostas com gatilhos e limites.

**Critérios de aceitação**

- Uma inferência nunca aparece como facto.
- Uma entrada apagada deixa de influenciar respostas na chamada seguinte.
- Uma resposta que cite um artigo sem entrada recuperada nem URL é bloqueada ou marcada
  "não confirmado".
- Nenhum texto integral de norma ISO é guardado.
- Uma rejeição com motivo gera uma lição proposta.
- Missões aceites aparecem em `S.objectives` sem XP antecipado.

**Método**

Em cada fase:

1. plano para eu aprovar;
2. uma semana de uso real;
3. revisão das lições e da memória antes da fase seguinte.



# Missão 33 — Ritual de Entrada

Estado: planeada. Missão pequena (1–2 sessões). Seguir o protocolo do `CLAUDE.md` e
declarar onde se encaixa face às Missões 24, 25, 30, 31 e 32. Proposta de ordem: depois
da Fase A da Missão 31 (backups e calendário já feitos), antes da Fase B.

## Ordem proposta (Missões 31 a 34)

1. **Missão 34 — Sessões de Estudo** (cronómetro). Pequena, independente, útil no
   primeiro dia. Serve para eu começar a usar o Sistema antes de construir mais.
2. **Missão 31 — Agenda Viva**, Fase A (cópias de segurança primeiro), depois B e C.
3. **Missão 33 — Ritual de Entrada**, entre a Fase A e a Fase B da 31.
4. **Missão 31**, Fase D (editor e Biblioteca).
5. **Missão 32 — Memória do Oráculo**, só depois da Fase C da 31 e de 2–3 semanas de
   uso real.

A decisão sobre como isto se ordena face às Missões 24, 25 e 30 é do Daniel, e o Claude
Code propõe antes de avançar.

## Objetivo

Sempre que abro o Sistema, aparece uma introdução curta e bonita: animação, saudação,
data de hoje, hora e uma citação filosófica ou motivacional. Depois dá lugar à app sem
atrasar nada.

## O que já existe (reutilizar, não duplicar)

- `js/hud.js`: saudações por altura do dia (ex.: "Boa tarde — ritmo, não pressa.") e
  citação do dia escolhida por `hashStr('q'+today())`.
- `js/data.js`: `QUOTES` com 16 citações `[texto, autor]`.
- Orbe/logótipo "E" e efeitos em `js/fx.js` e no palco Three.js (Missão 12).
- Padrão de `prefers-reduced-motion` já usado em `conselho.js` e `fx.js`.

A introdução usa estas mesmas fontes. A saudação e a citação mostradas na introdução
são as mesmas que depois aparecem no HUD, sem dois sorteios diferentes.

## Comportamento

**Quando aparece** (definição "Introdução", com valor por defeito "sempre"):

- `sempre`: em cada abertura da app (arranque a frio da PWA ou novo separador);
- `ao voltar`: também quando a app volta ao primeiro plano depois de X minutos
  ausente (por defeito 30);
- `1x por dia`: só na primeira abertura do dia;
- `desligada`.

**Sequência** (total ≤ 3,5 s, com saltar a qualquer momento por toque, clique ou
tecla):

1. 0,0–0,8 s: o orbe "E" acende-se (brilho e respiração), com fundo do céu atual
   (paleta da hora do dia do Solar Engine, se já estiver disponível; senão, gradiente
   estático equivalente).
2. 0,6–1,6 s: saudação com o nome, por exemplo "Boa tarde, Daniel — ritmo, não pressa."
3. 1,0–2,0 s: data por extenso e hora ao vivo, em `Europe/Lisbon`, por exemplo
   "quinta-feira, 17 de setembro de 2026 · 15:42".
4. 1,6–3,0 s: citação do dia com o autor (efeito de escrita, como o `sysType`).
5. Opcional, se a Missão 31 já existir: uma linha "Hoje: …" com o primeiro compromisso
   (ex.: "Base de Dados às 14:00, B2"). Nunca conteúdo de notas nem memória do Oráculo.
6. 3,0–3,5 s: transição suave (dissolver e subir) para a app.

**Regras:**

- Não bloqueia o arranque: a app carrega em paralelo por trás. Se o carregamento
  demorar mais do que a introdução, a introdução fica em "respiração" até estar
  pronta (máximo 6 s; depois mostra a app na mesma).
- Funciona offline (PWA): tudo local, sem chamadas de rede nem à Anthropic.
- `prefers-reduced-motion`: sem movimento; só aparecer e desaparecer, com o mesmo
  conteúdo.
- Acessibilidade: texto com contraste suficiente, `aria-live="polite"` para a
  saudação e a citação, botão "Saltar" focável, e `Esc` para saltar.
- Som: desligado por defeito (opção nas definições).
- Não aparece em ecrãs abertos por notificação que apontem para um cartão concreto
  (ex.: confirmar VOU/NÃO VOU): nesses casos entra diretamente no destino.
- Duração da última introdução registada localmente, para confirmar que não passa dos
  limites.

## Citações (rigor: "o Sistema nunca mente")

- Alargar `QUOTES` para pelo menos 120 citações em português de Portugal, organizadas
  por categoria: estoicismo, filosofia clássica, filosofia moderna, disciplina e
  hábito, aprendizagem, coragem, trabalho, serenidade.
- Novo formato de cada citação: texto, autor, obra ou fonte, categoria e `atribuicao`:
  - `verificada`: existe fonte primária identificável (obra, carta, capítulo);
  - `popular`: é frequentemente atribuída ao autor, mas sem fonte primária clara.
    Mostrar como "— atribuída a Confúcio".
- Rever as 16 citações atuais. Algumas atribuições conhecidas são duvidosas. Exemplos:
  - "Somos o que fazemos repetidamente…" é uma paráfrase de Will Durant sobre
    Aristóteles, e não uma frase de Aristóteles;
  - "Escolhe um trabalho que ames…" não tem fonte conhecida em Confúcio.

  Corrigir o autor ou marcar como `popular`. Não inventar fontes: na dúvida,
  `popular`.
- Seleção: determinística por dia (como hoje), sem repetir nenhuma citação nos
  últimos 60 dias.
- Frequência "sempre": a citação é a do dia (a mesma durante o dia inteiro). A
  saudação pode variar entre as opções da hora do dia.
- Opção nas definições: categorias preferidas.
- Integração futura (Missão 32): o Oráculo pode PROPOR novas citações para a lista, com
  fonte. Só entram depois de eu aprovar.

## Definições

- Introdução: sempre / ao voltar (minutos) / 1x por dia / desligada.
- Duração: curta (~2 s) / normal (~3,5 s).
- Mostrar a linha "Hoje".
- Som.
- Categorias de citações.

As definições são guardadas no estado local, por dispositivo (o PC e o iPhone podem ser
diferentes).

## Implementação

- Módulo isolado `js/intro.js`, sem dependências novas, que consome `QUOTES` e as
  saudações. Deve ser fácil de portar para a Missão 30 (React).
- CSS no ficheiro de estilos existente, com as variáveis de cor do tema atual.
- Não carregar Three.js só para a introdução. Se o palco ainda não estiver pronto, usar
  CSS/Canvas 2D leve.
- Atualizar o service worker/cache da PWA, se existir, para a introdução funcionar
  offline.

## Critérios de aceitação

- Ao abrir o Sistema no PC e no iPhone, a introdução aparece com saudação, data por
  extenso, hora certa de Lisboa e citação do dia.
- Um toque salta de imediato. `Esc` também.
- Com "reduzir movimento" ativo, não há animações.
- O tempo até a app ficar utilizável não aumenta mais do que a duração da introdução,
  e é zero quando salto.
- A mesma citação aparece na introdução e no HUD no mesmo dia, e não se repete em 60
  dias.
- Todas as citações têm autor e `atribuicao`. As 16 antigas foram revistas.
- Sem pedidos de rede durante a introdução.
- Abrir a partir de uma notificação com destino não mostra a introdução.

# Missão 34 — Sessões de Estudo (tempo real, medido)

Estado: **Fase A em produção desde 2026-09-24** (construída no Lote 1 a 2026-09-23; em
`main` desde `bc0cbb0`). A migração `20260923120000` foi aplicada por ordem do Daniel,
depois de um dump guardado fora do repositório; o seed pôs as 14 cadeiras do vault (8
ativas, 6 arquivadas). Falta a prova de uso: o painel com a conta real. O que foi
aplicado e verificado, e as decisões do lote, estão no fim desta secção.

Missão pequena e independente. Pode ser feita ANTES da Missão 31,
porque dá valor no primeiro dia e não depende de nada: é a forma de eu começar a usar o
Sistema já, em vez de esperar pelas missões grandes.

## Ordem proposta (Missões 31 a 34)

1. **Missão 34 — Sessões de Estudo** (cronómetro). Pequena, independente, útil no
   primeiro dia. Serve para eu começar a usar o Sistema antes de construir mais.
2. **Missão 31 — Agenda Viva**, Fase A (cópias de segurança primeiro), depois B e C.
3. **Missão 33 — Ritual de Entrada**, entre a Fase A e a Fase B da 31.
4. **Missão 31**, Fase D (editor e Biblioteca).
5. **Missão 32 — Memória do Oráculo**, só depois da Fase C da 31 e de 2–3 semanas de
   uso real.

A decisão sobre como isto se ordena face às Missões 24, 25 e 30 é do Daniel, e o Claude
Code propõe antes de avançar.

## Problema

Hoje o Sistema não sabe quanto tempo estudo. Os commits do vault dizem que um ficheiro
mudou, não quanto tempo estive a trabalhar nele, e com o Obsidian Sync a nota pode
chegar ao repositório dias depois. Qualquer número de "horas de estudo" tirado daí
seria inventado, o que a Constituição proíbe (§4, §5).

## Objetivo

Passar a ter tempo de estudo medido, separando claramente:

- **facto**: sessões que eu iniciei e terminei;
- **inferência**: atividade deduzida dos commits, sempre marcada como tal.

## Princípios

1. Nada de tempo inventado. Uma sessão só é facto se eu a tiver iniciado.
2. Uma sessão esquecida não pode poluir os dados: há limites e confirmação.
3. Sem culpa. Não estudar não gera avisos nem penalizações automáticas.
4. XP só de sessões confirmadas, nunca de inferências.

## Modelo de dados

- `study_sessions`
  - `started_at`, `ended_at` (hora de Lisboa), `duration_min` (calculado);
  - `course_id` (opcional), `topic_id` (opcional), `class_id` (o id da aula, opcional);
  - `kind`: `aula` | `revisao` | `exercicios` | `recall` | `leitura` | `projeto`;
  - `source`: `cronometro` | `manual` | `recall_automatico`;
  - `note` (uma linha, opcional);
  - `state`: `ativa` | `terminada` | `por_confirmar` | `descartada`.
- `inferred_activity` (só leitura, recalculada)
  - janelas deduzidas dos commits: início, fim, ficheiros tocados, cadeira;
  - `confianca`: `alta` quando há vários commits espaçados; `baixa` quando tudo chegou
    num só commit (típico de sincronização atrasada).

## Fase A — Cronómetro

- Botão grande no Núcleo: **Iniciar sessão**. Escolho a cadeira (pré-preenchida a
  partir do calendário: se agora houver aula ou um bloco de estudo, sugere essa) e o
  tipo.
- Enquanto corre: contador visível, botões Pausar e Terminar, e o estado sobrevive a
  fechar a app (fica no servidor, não só no browser).
- Funciona no PC e no iPhone, porque o Sistema é PWA.
- Regras anti-lixo:
  - aviso às 2 h ("ainda estás a estudar?");
  - fecho automático às 4 h, com a sessão marcada `por_confirmar`;
  - fecho automático à meia-noite;
  - uma sessão `por_confirmar` aparece no dia seguinte para eu aceitar, corrigir a
    duração ou descartar;
  - só pode haver uma sessão ativa de cada vez.
- Registo manual: "adicionar sessão" com início, fim e cadeira, para quando me esqueço
  de ligar o cronómetro. Fica `source: manual`, e conta como facto (fui eu que a
  declarei), mas é distinguível nos relatórios.
- Editar e apagar sessões passadas, sempre.

**Critérios de aceitação**

- Fecho a app a meio de uma sessão e ela continua ao voltar.
- Uma sessão esquecida durante a noite não produz 9 horas de estudo.
- Nenhuma sessão é criada sem eu carregar em iniciar ou em adicionar.

## Fase B — Ligar ao resto

- **Diário do dia**: as sessões aparecem na linha do tempo, ao lado das aulas e dos
  turnos, com a duração real.
- **Aulas**: se a sessão decorre dentro do horário de uma aula, fica ligada a essa aula
  (`class_id`) e é sugerida como presença.
- **Planos de estudo**: um bloco de estudo planeado passa a ter estado `cumprido`
  quando existe uma sessão sobreposta dessa cadeira. O relatório semanal compara
  planeado com feito em minutos, com números e sem julgamentos.
- **Recall**: uma sessão de repetição espaçada no Sistema cria automaticamente uma
  sessão `recall_automatico`, com a duração real do exercício.
- **XP**: regra simples e resistente a batota — XP por sessão confirmada, com um teto
  diário (por exemplo, 4 h contabilizáveis) e nada de XP retroativo em massa. As regras
  atuais do motor não mudam; acrescenta-se uma fonte.
- **Atributos**: Saber para estudo, Ofício para trabalho de carreira, Disciplina pela
  consistência (dias com sessão, não minutos).

## Fase C — Inferência a partir dos commits

- Uma janela inferida nasce de commits consecutivos que tocam os mesmos ficheiros com
  intervalos de até 30 minutos. Início = primeiro commit; fim = último.
- Granularidade mínima de 15 minutos, porque é essa a cadência do Obsidian Git.
- Se tudo chegou num só commit, não se infere sessão nenhuma: `confianca: baixa` e não
  entra nos totais.
- Apresentação: sempre separada do tempo medido, com a palavra "estimado", e nunca
  somada às horas reais sem dizer que são duas coisas.
- Serve para uma pergunta útil: "houve atividade em Base de Dados na quinta à noite que
  não registaste — queres adicionar uma sessão?". Proposta, nunca criação automática.

**Critérios de aceitação**

- Nenhum número de horas mistura facto e inferência sem o dizer.
- Uma sincronização atrasada não gera sessões falsas.

## Fase D — Ver os números

- Totais por semana, mês e cadeira: minutos medidos, minutos estimados, dias com
  sessão.
- Distribuição por hora do dia, para eu perceber quando rendo mais (facto, a partir das
  sessões).
- No relatório semanal: tempo por cadeira, comparação com a semana anterior e com o
  plano, e nada mais. Sem elogios nem repreensões.

## O que fica de fora

- Deteção automática de "estou a estudar" a partir da aplicação aberta: exigiria um
  agente a correr no PC a vigiar janelas. Não compensa, e é vigilância de mim próprio.
- Contar tempo a partir de plugins de terceiros do Obsidian: mais uma dependência, com
  dados presos no PC.

## Método

A → B → C → D, com uma semana de uso real entre fases. A Fase A sozinha já é útil e
pode ficar assim durante muito tempo.

## Lote 1 — o que foi construído e as decisões dentro do âmbito (2026-09-23)

Ramo `lote-1/m34-sessoes-e-courses`, empilhado sobre o Lote 0; em `main` desde
2026-09-24 (`bc0cbb0`, com os lotes 0, 2 e 3) e aplicado em produção no mesmo dia —
ver "Aplicado em produção" no fim desta secção.

- Migração `supabase/migrations/20260923120000_courses-e-sessoes-de-estudo.sql`, com o
  rollback em `supabase/rollback/` e RLS com política na mesma migração. Testada num
  PostgreSQL local e descartável: `node testes/bd/bd.mjs`.
- Painel "Sessões de Estudo" no HUD, logo a seguir à saudação (`js/sessoes.js`, contas
  de tempo em `js/sessoes-logica.js`): iniciar, pausar, retomar e terminar; aviso das
  2 h; por confirmar (aceitar, corrigir, descartar); últimos 7 dias (editar, apagar);
  sessão manual.
- Testes: `node testes/sessoes/logica.test.mjs` (lógica pura) e
  `node testes/sessoes/ui.mjs` (Chrome real, Supabase falso, rede fechada).

Lacunas da missão resolvidas dentro do âmbito:

1. **Pausas.** A Fase A pede o botão Pausar e o modelo não tinha onde o guardar:
   `paused_at` e `paused_seconds`. A `duration_min` desconta as pausas.
2. **A hora é a do servidor.** `started_at` por omissão `now()`; pausar, retomar e
   terminar são funções SQL. O relógio no ecrã usa a hora do aparelho só para mostrar;
   a duração guardada é a do servidor.
3. **Fecho automático sem cron novo.** A app chama `normalizar_sessoes()` ao abrir, de
   minuto a minuto e ao voltar ao separador. Uma sessão esquecida fecha **no limite**
   (4 h ou meia-noite de Lisboa, o que vier primeiro), não na hora em que a app
   reabriu; terminar depois do limite dá o mesmo resultado. `closed_reason`
   (`limite_4h` | `meia_noite`) diz porque o Sistema a fechou.
4. `topic_id` sem chave estrangeira até existir `syllabus_topics` (Missão 31).
5. **Corrigir as horas torna a sessão `manual`**: passa a contar o que foi declarado.
   Só se envia o campo que mudou.
6. **O mesmo tempo não conta duas vezes.** Uma sessão manual ou editada que se sobreponha
   a outra é recusada (verificado contra a base antes de gravar). Uma restrição de
   exclusão na própria base fica como proposta: exigiria a extensão `btree_gist`.
7. **Descartar** mantém a linha, marcada `descartada` e fora das contas; **apagar**
   apaga. Os dois pedem confirmação no próprio painel.
8. O aviso das 2 h é só dentro da app ("Continuo" fica guardado neste aparelho). A
   notificação push chega com a Missão 31 B.
9. Até haver calendário (Missão 31 A) para sugerir a aula em curso, vem pré-escolhida a
   última cadeira e o último tipo usados neste aparelho.
10. Sem conta, o painel explica que as sessões vivem na conta e não mede. Sem a migração
    aplicada, não aparece.
11. O seed das cadeiras gera-se do vault no momento de aplicar e fica fora do
    repositório (público). As arquivadas entram com o nome tal como está no vault
    (`cadeira:` = nome da pasta) — não se inventa o nome por extenso.

### Aplicado em produção (2026-09-24)

Cada passo foi corrido pelo Daniel e verificado só com leituras antes do seguinte.

1. **Dump** da base real antes de tocar em nada, com os scripts das cópias (`dump.sh` e
   a guarda), guardado fora do repositório: somas SHA-256 e guarda ok, sem `cron.job`
   nem token.
2. **Migração** `20260923120000` com `supabase db push` — a primeira entrada do
   histórico `supabase_migrations` (antes, tudo tinha entrado pelo painel). `courses` e
   `study_sessions` com RLS ligada e a política de dono (`for all to authenticated`,
   `user_id = (select auth.uid())`); as 7 funções com `SECURITY INVOKER` e
   `search_path` vazio, sem EXECUTE para o `anon`; `study_sessions_tocar` só como
   gatilho. As tabelas que já existiam ficaram com as mesmas contagens.
3. **Seed** das cadeiras, gerado do vault e fora do repositório: 14 (8 ativas de 2026-27
   S1, 6 arquivadas de 2025-26 S2), iguais ao seed campo a campo, acentos incluídos.
4. **Frontend**: `main` = `bc0cbb0`, publicado pelo GitHub Pages; os ficheiros servidos
   são byte a byte os do commit, e um Chrome com perfil vazio arranca sem erros de
   consola, em desktop e mobile.
5. **Oráculo v20**, publicado de um export do commit — ver o estado do Lote 2.

Antes do push, os testes correram sobre a junção: fumo completo verde (sem erros novos
face à linha de base), `bd.mjs` 49/49, `sessoes/ui.mjs` 67/67, `sessoes/logica.test.mjs`
41/41, `xss-oraculo.mjs` 9/9 e `vault-lista.test.ts` 8/8.

A mesma verificação encontrou **11 tabelas** no `public` de produção, não as 3 que o
README das migrações descrevia — corrigido lá.
