# Verificações W60–W61 — o 0.2a: o versao.json no Sistema e o vigia

> Extrato das linhas 224–389 de `verificacoes-09-10.md` (scratchpad da sessão 1febbc97, 10/10/2026); as linhas 1–222
> estão em `../2026-10-09-fase0-portoes-entrada/verificacoes-09-10.md` (a 223 está vazia).
> **Cópia pública editada**, pela regra do Daniel de 2026-10-12 (os detalhes de operação das cópias ficam só nos
> repositórios privados): as linhas 282 e 287, o plano de credencial das cópias, estão trocadas pela nota
> «[retirado: …]»; e um caminho local com o nome da conta do Windows está trocado por `<conta>` (linha 367). Nada
> mais foi alterado abaixo da linha. **O original completo** destas linhas está no `sistema-backups`, que é privado,
> em `docs/evidencias/verificacoes-2026-10-10-a-11.md` (lá, só o nome da conta vai trocado). Recuperado a 2026-10-12.

---

## W60 — 0.2a, fatia 1: o Pages serve o build publicado (PLANO, escrito antes de código; 10/10)
Factos lidos: sw.js só põe em cache .js/.css/fontes/imagens (o versao.json vai sempre à rede); o Pages manda
Cache-Control: max-age=600 (a CDN pode servir o versao.json anterior até 10 min depois de um deploy); notificações
(doc GitHub): agendadas → quem criou o workflow ou alterou o cron por último; manuais → quem as lançou.
Decisões do Daniel: sistema-vigia privado, criado vazio; email «only failed workflows» ligado; versao.json com formato
fixo (commit + somas), de uma lista fechada, nunca do ambiente, e um teste que falha com um campo a mais; controlo do
caminho do aviso com o email confirmado na caixa de entrada.

## No Sistema (workflow → processo completo)
1. `scripts/versao.mjs`, sem dependências, com duas funções partilhadas:
   - `gerar(dist)`: o commit vem de `git rev-parse HEAD` na cópia (nunca de variáveis de ambiente);
     as somas são SHA-256 de todos os ficheiros do `dist`, exceto o próprio `versao.json`, por ordem.
     Escreve `{ "commit": …, "somas": { "caminho": "soma" } }` e mais nada.
   - `validar(obj)`: exatamente as chaves `commit` e `somas`; commit com 40 hex; somas não vazias;
     caminhos relativos sem `..` nem `/` inicial; somas com 64 hex. Tudo o resto é recusado.
     O `gerar` valida antes de escrever e recusa-se a escrever um objeto inválido.
2. Build: um passo «versao.json» logo a seguir ao Vite. A lista de somas e o fumo passam a incluí-lo.
3. verificar-destino: um passo novo, `node scripts/versao.mjs --verificar <site>`. Lê o `versao.json`
   servido, valida-o, exige o commit igual ao `git rev-parse HEAD` da corrida e descarrega cada
   ficheiro listado, que tem de ter a mesma soma. É a fatia 3. Por causa da CDN, tenta de 60 em 60 s
   enquanto o commit servido for o anterior, até 12 min; depois disso, vermelho.
4. Teste `testes/seguranca/versao.test.mjs` (o mínimo sobe), com os controlos plantados:
   campo a mais, campo em falta, commit curto, soma com 63 caracteres, caminho com `..`
   → recusados; 1 byte trocado num ficheiro servido localmente → a verificação falha e nomeia-o;
   um `versao.json` de outro commit → falha.

## No sistema-vigia (repositório privado, novo)
5. `.github/workflows/vigia.yml`:
   - agendado `0 14 * * *` e manual;
   - `permissions: contents: read`, sem segredos;
   - ações por SHA, e a opção do GitHub ligada por ti depois do primeiro commit;
   - uma entrada manual `falhar_de_proposito`.
6. `vigia.mjs`, com a sua própria cópia do validador (quem vigia não depende do que vigia):
   - lê o main do Sistema com `git ls-remote`, que é público, sem token e sem limite da API;
   - lê o `versao.json` servido, valida-o e confere as somas;
   - se o commit servido for diferente do main: amarelo durante 1 h depois do último push, vermelho
     a partir daí;
   - escreve um resumo da corrida.

## Critério (tudo verde) e controlos (cada um tem de ficar vermelho)
| # | Verde | Controlo plantado → vermelho |
|---|---|---|
| a | `versao.test.mjs` passa; o build gera um `versao.json` válido | campo a mais / em falta / formato errado → o teste falha; o `gerar` recusa-se a escrever |
| b | No main, o verificar-destino dá o commit igual e todas as somas iguais | no PC, contra o site real com um commit esperado errado → código 1; contra um `dist` local com 1 byte trocado → código 1, com o ficheiro nomeado |
| c | No ramo, o portão continua verde (testes, build e fumo) | ramo de controlo com um campo a mais plantado no `gerar` → o job testes falha só nesse teste, e o build fica saltado |
| d | A corrida manual do vigia contra o site dá verde | `vigia.mjs` no PC contra um endereço que dá 404 → vermelho; com uma soma trocada numa cópia do `versao.json` → vermelho |
| e | **Aviso, caminho manual:** corrida com `falhar_de_proposito` → vermelha | tu confirmas o email na **caixa de entrada** (não no spam) |
| f | **Aviso, caminho agendado:** um commit temporário que põe a corrida agendada a falhar (o `cron` passa para dali a 30 min) | tu confirmas o email na caixa de entrada; depois um commit repõe o `cron` das 14:00, e a corrida seguinte fica verde |

O passo **f** existe porque a corrida agendada avisa quem alterou o `cron` por último e não quem a
lançou. O GitHub pode atrasar ou saltar uma corrida agendada; se não correr em 2 h, repetimos.

## Ordem dos commits e pushes (os pushes são teus)
- Sistema, ramo `orbita/0.2a-versao`: 1 → 4, provados no PC; depois o controlo c num ramo à parte.
- Entrada no main com o critério do W59, mais o ponto b.
- sistema-vigia: o primeiro commit (5 e 6); ligas a opção dos SHA; seguem-se d, e e f.

## Fora desta fatia
- [retirado: plano de credencial das cópias — ver sistema-backups]
- Os sinais de vida entre o vigia e o workflow das cópias, e o «vigia sem notícias» no Sistema.

Custo: 0 $; cerca de 1 min de Actions por dia. Estimativa: 2 sessões.

[retirado: plano de credencial das cópias — ver sistema-backups]

### W60 — aprovado com 3 ajustes (10/10)
1. Vigia às 14:17 UTC (doc: o início de cada hora é período de carga; corridas atrasadas ou descartadas).
2. Doc lida a 10/10 (events-that-trigger-workflows, schedule): «In a public repository, scheduled workflows are
   automatically disabled when no repository activity has occurred in 60 days.» — dos privados não diz nada (não é prova
   de que não aconteça). Vigia do vigia: camada 1 na fatia 2 do 0.2a; camada 2 no 0.2b. Até lá, o silêncio do vigia NÃO é
   detetado.
3. A cópia do validador no sistema-vigia é deliberada e as duas não se juntam (SPEC).

### W60 ponto 1 — no PC (10/10), ramo orbita/0.2a-versao, SEM commit
TDD: versao.test.mjs vermelho (módulo inexistente) → scripts/versao.mjs → 3/3. Controlos do teste (mutações temporárias,
repostas e conferidas com cmp): validador a aceitar campos a mais → «devia recusar: campo a mais»; comparação das somas
desligada → o 3.º teste falha. Bateria 132/132 (TAP 132); TESTES_MINIMO 129 → 132; build + gerar: 16 ficheiros; fumo
21/21 sobre o dist com o versao.json; actionlint 0; 0 CR. CLI verificar: dist local servido → 16/16, código 0; 1 byte
trocado no sw.js → código 1 com o ficheiro nomeado; o site real (sem versao.json) → HTTP 404, código 1; sem argumentos → 2.
TROPEÇOS DO INSTRUMENTO, apanhados: (1) o meu servir-e-verificar com execFileSync bloqueava o próprio servidor (pendurou;
refeito com spawn); (2) process.exit() no Windows com o fetch aberto saía com 127 por uma asserção do libuv — trocado
por process.exitCode, 3/3 corridas com código 1 e 0 asserções.

### Commits do ponto 1 (OK dele): 78e2b3d (ci: versao.json) e d3f6b35 (docs: SPEC 0.2a fatia 1); blobs = ficheiros.
Privados e inatividade: «não confirmado» — já no SPEC (d3f6b35).

### W60 c — controlo no GitHub: critério CORRIGIDO antes do push (o plano dizia «falha só esse teste»)
Ramo orbita/0.2a-versao-controlo, e0d44bf = d3f6b35 + 1 linha: o gerar escreve o versao.json com um campo a mais DEPOIS de
validar (a regressão realista: alguém acrescenta um campo à saída). Um campo a mais no gerar faz falhar os DOIS testes que
usam o gerar (2: o formato escrito; 3: o verificar lê o versao.json servido e recusa-o) — o 1 (validar) passa. No PC:
ok 1, not ok 2, not ok 3. Uma primeira tentativa de plantar com sed não se aplicou (diff vazio, teste verde): refeita com
um script que exige exatamente 1 ocorrência.
CRITÉRIO c: corrida failure; job testes falha no passo dos testes com «ℹ tests 132 · pass 130 · fail 2», as duas falhas
são os testes 2 e 3 do versao.test.mjs e mais nenhuma; sem «testes que passaram»; build, deploy, verificar-destino saltados.
(O plano dizia «falha só nesse teste» — com o campo plantado no gerar são 2, ambos do versao.test.mjs.)

## W61 — a entrada no main do versao.json (escrito ANTES do push; ajuste do Daniel: 17 ficheiros, a referência passa a
## ser o versao.json de cada publicação)
Avanço rápido 15a6025..d3f6b35 (3 ficheiros de código + SPEC). CRITÉRIO:
1. ls-remote main = d3f6b35…
2. Corrida do main: os 4 jobs success, «Set up job» success em todos; testes «ℹ tests 132 · pass 132», «mínimo: 132»; build:
   o passo «versao.json» diz «commit d3f6b35…, 16 ficheiros», «Hashes do dist» com 17 linhas, fumo 21/21; verificar-destino:
   fumo 21/21 no site E o passo novo «✓ o site serve este build» com «ficheiros conferidos: 16» e commit esperado d3f6b35.
3. Publicações: d3f6b35 com 1 (github-pages); vercel 8; estados 0.
4. Site, lido por mim, à parte do workflow: (a) https://kamappa.github.io/Sistema/versao.json existe (200), tem EXATAMENTE
   as chaves commit e somas, commit = d3f6b35…, 16 somas; (b) as 16 somas que lista = sha256 dos 16 ficheiros servidos;
   (c) a soma do versao.json servido = a da linha «./versao.json» do «Hashes do dist» do CI; (d) Last-Modified dos 17 dentro
   do job de deploy. A referência deixa de ser «as somas de 04/10»; como a app não mudou, as 16 somas devem ainda coincidir
   com as de 04/10 — se não coincidirem, é informação a reportar, não falha deste critério.
CONTROLO (ponto b do W60, depois do deploy): no PC, verificar contra o site real com um commit esperado errado → código 1.
SE O PASSO NOVO DO VERIFICAR-DESTINO FALHAR: o site já está publicado (o deploy vem antes); não é rollback automático —
paro, leio o registo e digo-te; a reversão (main para 15a6025 e republicar) é decisão tua.

### W60 c e o ramo real — resultado (00:03 UTC de 10/10): PASSOU
Ramo real d3f6b35, corrida 38007096952: success; testes «ℹ tests 132 · pass 132 · fail 0», «mínimo: 132»; build: «versao.json:
commit d3f6b35…, 16 ficheiros», 17 linhas de soma (./versao.json 9255feb6…), fumo 21/21; deploy/verificar-destino saltados.
Controlo e0d44bf, corrida 38007107057: failure; testes «ℹ tests 132 · pass 130 · fail 2», as duas falhas = «gerar escreve só
commit e somas…» e «verificar dá certo…» (os testes 2 e 3), nenhuma outra; «Process completed with exit code 1», sem
«testes que passaram»; build, deploy, verificar-destino saltados.
SPEC: 12.ª instância (o plantado que não se plantou) escrita, sem commit.

### W61 — regra do Daniel para falhas depois do deploy (escrita ANTES do resultado)
- CDN a demorar além dos 12 min: voltar a correr a verificação mais tarde, sem reverter.
- Somas que não batem: investigar antes de qualquer reversão (a app não mudou).
- Reverter o main para 15a6025 SÓ se o fumo falhar no site.
Decisão (10/10): o «vigia do vigia» passa a ser a fatia seguinte do 0.2a, logo depois desta (os 60 dias em privados
ficam «não confirmados»). Ordem no SPEC no commit do fecho.

### W61 — resultado (00:13–00:20 UTC de 10/10): PASSOU nos 4 pontos
Push dele 15a6025..d3f6b35. (1) main = d3f6b35. (2) corrida 38007772908 success; «Set up job» success nos 4; testes «ℹ tests 132 ·
pass 132», «mínimo: 132»; build «versao.json: commit d3f6b35…, 16 ficheiros», 17 linhas de soma (./versao.json 9255feb6…),
fumo 21/21 (127.0.0.1); deploy 00:12:38→00:12:46; verificar-destino: fumo 21/21 no site e «alvo https://kamappa.github.io/
Sistema/; commit esperado d3f6b35…; ficheiros conferidos: 16» + «✓ o site serve este build» — à primeira, sem esperar pela CDN.
(3) 107 publicações em 2 páginas; github-pages 99; d3f6b35 com 1; vercel 8; estados 0.
(4) w61-site.mjs (independente do versao.mjs): versao.json HTTP 200, chaves exatamente ["commit","somas"], commit = d3f6b35,
16 somas, 16/16 batem com o servido; sha256 do versao.json servido 9255feb6… = a linha ./versao.json do CI (4c);
Last-Modified dos 17 = 00:12:41, dentro do job de deploy. As 16 somas = as de 04/10 (a app não mudou).
CONTROLO b: verificar contra o site real com commit esperado b×40 → ok false, «commit servido d3f6b35…, esperado bbbb…»;
com o certo → ok, 16. Controlo do w61-site.mjs, antes do deploy: o site sem versao.json → HTTP 404, código 1 (e o mesmo
tropeço do process.exit no Windows — 127 — corrigido no meu script).
Duas leituras de registos no Brave deram «URL interna» (a página ainda não tinha redirecionado) — não contadas; repetidas.

### W60 — o sistema-vigia no PC (10/10), SEM commit
Clonado (vazio) para C:\Users\<conta>\Documents\sistema-vigia (local, fora do OneDrive). Desvio ao plano, anunciado antes:
em vez de «amarelo 1 h depois do push» (precisava da API ou da data do commit, que não é a do push), o vigia espera pelo
deploy de 2 em 2 min até 16 min e só depois dá vermelho.
TESTES: o 1.º vermelho foi PELA RAZÃO ERRADA — «node --test testes/» no Node 24 tenta carregar a pasta como módulo (nem
correu o teste); refeito com «testes/*.test.mjs» e o vigia.mjs fora do lugar → ERR_MODULE_NOT_FOUND do vigia.mjs (razão
certa); depois 4/4. Mutações com mutar.mjs (exige 1 ocorrência): validador a aceitar campos a mais → 2 falhas; somas por
comparar → 1 falha; commit por comparar → «outro commit: estado verde» acusado; reposto (cmp) → 4/4.
actionlint 0; 0 CR; .gitattributes «* text=auto eol=lf» desde o 1.º commit. Contra o site real: verde, main = servido =
d3f6b35, 16 ficheiros, código 0. CONTROLO d (PC): destino /nao-existe/ → vermelho, «versao.json: HTTP 404», código 1.
Dados pessoais nos 5 ficheiros: 0 (detetor de 3 categorias e procurar-sensivel).

### sistema-vigia no GitHub (10/10 ≈00:40 UTC)
Commit 9a2d3d0 (identidade igual à do Sistema, copiada sem ser mostrada; 5 blobs = ficheiros, i/lf w/lf); push dele; ls-remote
main = 9a2d3d0. Opção dos SHA ligada por ele; CONFIRMADA na página de definições (leitura nova; vizinhas desmarcadas).
Sistema 7e338fe publicado (corrida 38009369814, 4 jobs success); o vigia no PC a seguir: verde, main = servido = 7e338fe, 16.

### W60 e — o aviso, caminho manual (00:43 UTC)
Corrida 38010293477 lançada por mim no Brave dele (sessão dele: o ator é kamappa), com «Controlo do aviso» marcado, ramo main
(confirmado num zoom antes de lançar). Resultado: Failure, 12 s. Registo do job 114088491317: ações descarregadas por SHA
(a opção ligada não as recusou); «ℹ tests 4 · pass 4 · fail 0»; «Vigia — 🟢 verde», 16 ficheiros; a seguir
«##[error]corrida a falhar de propósito — controlo do caminho do aviso (W60 e)» e «Process completed with exit code 1».
O vermelho é o do passo plantado (o vigia em si deu verde). FALTA: o Daniel confirmar o email na CAIXA DE ENTRADA.

