# CLAUDE.md — Sistema (Daniel)

> Carregado automaticamente no início de cada sessão. Lê também
> `SPEC-CLAUDE-CODE.md` para o estado das missões e do backlog — este ficheiro
> é o contexto permanente; o SPEC é o plano de trabalho corrente.

## Quem é o Daniel

Estudante de Segurança e Proteção de Dados para Sistemas de Informação (SPDSI)
no IPCA Braga, a trabalhar em part-time na Worten. Objetivos de carreira:
auditoria ISO 27001, NIS2, RGPD/proteção de dados, AI Governance (EU AI Act,
ISO/IEC 42001, NIST AI RMF), estágio em cibersegurança/GRC, futuro DPO ou
vCISO.

Pontos fortes: aprendizagem rápida, reconhecimento de padrões, pensamento
estratégico, curiosidade.

## Como colaborar

- Português de Portugal sempre.
- Sê intelectualmente exigente e honesto. Se uma proposta for apressada,
  sobrecarregada, ou fugir do plano de fases acordado, diz isso antes de
  executar. Privilegia pensamento estratégico sobre execução imediata.
- Explica o "porquê", não só o "o quê", e dá exemplos práticos. Quando
  relevante ao domínio (auditoria, compliance, dados), indica normas
  concretas: ISO 27001 Anexo A, artigos do RGPD, requisitos NIS2, EU AI Act,
  ISO/IEC 42001, NIST AI RMF.
- Listas só quando ajudam a clareza; pouco negrito.

## Regras de ouro de engenharia

- Propor antes de alterar: mostrar o diff e obter concordância antes de
  aplicar mudanças de código.
- Uma fase de cada vez — não misturar missões ou saltar à frente do plano
  acordado.
- Commits pequenos e descritivos (trilho de evidência — prática A.8.32).
- Tudo o que gera dados fica estruturado e datado, pronto para o Oráculo
  processar.
- "O sistema nunca mente" — nenhum dado fabricado, nenhum estado
  inconsistente entre o que é mostrado e o que está guardado.

## Arquitetura atual (v1.0 — julho 2026)

- Frontend: `index.html` único (~128KB), publicado por GitHub Pages a cada
  push para `main` (repositório `kamappa/Sistema`, sem workflow de build —
  Pages serve diretamente da raiz).
- Backend: Supabase.
  - Auth de utilizador único (Daniel).
  - `app_state`: JSONB com RLS, guarda o estado completo do HUD.
  - `radar_items`: itens do Radar Diário.
  - `oracle_reports`: relatórios semanais do Oráculo.
- Oráculo: Edge Function `oraculo` (fonte versionada em
  `supabase/functions/oraculo/index.ts`; deploy pela CLI com `--no-verify-jwt`).
  - Radar diário — agendado por `pg_cron` às 06:30 UTC (token por header).
  - Relatório semanal — agendado por `pg_cron` aos domingos às 19:00 UTC.
  - Conselho (`?mode=chat`) e Sussurro (`?mode=sussurro`) — JWT da sessão.
  - Segredos (`ANTHROPIC_API_KEY`, `ORACLE_TOKEN`, `VAULT_TOKEN`) vivem em
    Supabase Secrets, nunca no código nem em commits.
- Ponte do Vault: repo privado `kamappa/vault-sistema` liga o vault Obsidian
  (em `C:\Users\shohe\Documents\ObsidianVault`, com Obsidian Git a auto-commitar
  a cada 15 min) ao Oráculo. Privacidade por desenho: só a árvore
  `Sistema/Estudo/` entra no repo (`.gitignore` de whitelist). O Oráculo lê o
  que o Daniel estuda (leve no radar/sussurro, profunda no report/chat) e
  escreve os relatórios de volta em `Oraculo/relatorio-YYYY-MM-DD.md`.
- Sistemas no HUD: atributos+ranks E-S, hexágono, hábitos (3 obrigatórios com
  penalização + extras personalizáveis), missões (quadro antigo), objetivos-
  mestra (triagem automática de prioridade/área/tags, prazos, faixa URGENTE,
  Sombras), treino calistenia (4 linhas de força + pavimento pélvico, 8
  passos, adaptação, teto diário de XP), regulador de sono (backfill,
  anti-farm), calendário, conquistas, debuffs,
  skill trees, Títulos Reais (evidência), World Engine (arcos sazonais,
  meteo, sussurros, Double XP), Radar Diário (notícias + alto impacto +
  missões deriváveis), relatório do Oráculo (com missões propostas,
  recompensa, título da semana, estudo lido do vault e recursos com pesquisa
  web), Conselho interativo, Mapa de Conhecimento, Revisão Ativa (SM-2).

## Ver também

- `SPEC-CLAUDE-CODE.md` — missões ativas (Missão 1: fundir Missões+Objetivos;
  Missão 2: refactor do monólito; Missão 3: visual vivo; Missão 4: este
  ficheiro) e backlog pós-v1.0.
