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
  treino calistenia (4 linhas de progressão, 8 passos, adaptação), regulador de
  sono (backfill, anti-farm), calendário, conquistas, debuffs, skill trees,
  Títulos Reais (evidência), World Engine (arcos sazonais, meteo, sussurros,
  Double XP), Radar Diário (notícias + alto impacto + missões deriváveis),
  relatório do Oráculo (com missões propostas, recompensa, título da semana)

## Missão 1 — FUNDIR Missões + Objetivos (prioridade máxima)

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

## Missão 2 — Refactor do monólito

Partir `index.html` em módulos (css/, js/ por domínio: engine, world, treino,
sono, objetivos, radar, auth) mantendo GitHub Pages a funcionar. Commits
pequenos e descritivos (trilho de evidência — prática A.8.32).

## Missão 3 — Visual vivo

Animações avançadas e fundo dinâmico (partículas/aurora subtil), micro-
interações, sensação de sistema moderno que respira. Manter: identidade
preto+roxo, cores semânticas de áreas/eventos/ranks, prefers-reduced-motion.

## Missão 4 — CLAUDE.md

Criar `CLAUDE.md` na raiz a partir do PROMPT.md (contexto do Daniel, regras
do Sistema, estas regras de engenharia) para carregamento automático.

## Backlog (depois da v1.0)

- Chat flutuante do Oráculo (modo chat na mesma Edge Function)
- Botões Aceitar/Recusar para propostas do relatório escreverem no estado
- Evidence Locker (Supabase Storage nos requisitos dos Títulos Reais)
- PWA (manifest + service worker) e notificações push
- Exportação .ics de prazos para o calendário do telemóvel
