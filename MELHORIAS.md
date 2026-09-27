# Melhorias — para rever depois de publicar a Órbita

Regra do Daniel (2026-09-27): até a Órbita estar publicada, o que merece melhoria — visual,
técnica ou de arquitetura — **não se faz**. Escreve-se aqui: o que é, onde, porquê e uma
estimativa. A lista revê-se depois da publicação, quando o uso real disser o que incomoda de
facto.

Os problemas de segurança não entram aqui: vão logo ao Daniel, com o risco explicado, e ele
decide se entram já.

Estimativas: **P** até uma hora · **M** uma sessão · **G** mais de uma sessão.

| # | O quê | Onde | Porquê | Estimativa | Visto |
|---|---|---|---|---|---|
| 1 | Decidir o limite do chat do Oráculo (12 mensagens por dia) face às sessões de estudo da regra 7 | `supabase/functions/oraculo/index.ts` (`CHAT_LIMIT`) | Uma sessão pedagógica tem 4 a 5 turnos, e o prompt cresce ~380 palavras com a regra 7. Em aberto desde 2026-08-17. O Daniel decide quando estiver a usar e souber se 12 chega. | P (a mudança); a decisão é dele | 2026-09-27 |
| 2 | Pôr `deno.lock` no `.gitignore` | `.gitignore` | Correr o Deno na raiz sem `DENO_NO_PACKAGE_JSON` cria um `deno.lock` com as dependências do frontend; um `git add .` distraído metia-o no repositório público. | P | 2026-09-27 |
| 3 | O editor marca erros falsos nos ficheiros do Deno | `supabase/functions/`, `testes/oraculo/` | O TypeScript do projeto é o do Vite e não conhece o `Deno` nem os imports `npm:`; o `deno check` passa. Resolver sem mudar o que é publicado com a função (um `deno.json` dentro da pasta da função entra no deploy). | P–M | 2026-09-27 |
| 4 | Um só comando para os testes do backend | `testes/fumo/fumo.mjs` | Hoje são três: `bd.mjs`, `deno test testes/oraculo/` (com a variável de ambiente) e o fumo. O fumo podia correr também os testes do Deno. | P | 2026-09-27 |
| 5 | Resolver a colisão dos números de missão | `SPEC-CLAUDE-CODEv2.md` (M31 a M34), `SPEC-CLAUDE-CODE.md` e `docs/compliance-intelligence/` (M31 Compliance), ramo `mission-32/…` (M32 Analista de Documentos) | O mesmo número quer dizer duas missões diferentes, e isso confunde qualquer sessão que leia os dois registos. Até lá valem as do v2 (decisão do Daniel, 2026-09-23 e 2026-09-27). Custo medido a 2026-09-23: renumerar o v2 é 1 ficheiro (40 ocorrências); renumerar os ramos são 27 ficheiros e commits `feat(m32)` que não mudam. O Daniel trata disto depois da publicação. | P–M, depois da decisão dele | 2026-09-27 |
