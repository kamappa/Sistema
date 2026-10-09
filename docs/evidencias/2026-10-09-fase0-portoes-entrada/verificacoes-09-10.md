# Verificações de 2026-10-09 — fecho da fatia 0.1 (portões na publicação)

Sessão 1febbc97. A passagem (`docs/PASSAGEM.md`) não chegou a ser criada; a conversa de 06–07/10 foi limpa.

## Recuperação da evidência de 06–07/10 (só leitura, 13:30–13:44 UTC)
- Registo: scratchpad 9e0dac37 `verificacoes-06-10.md` (605 linhas, W32–W55). Instrumentos do W55 em
  `~/.claude/jobs/9e0dac37/tmp` (esperar-corrida.mjs, publicacoes.mjs, pages-somas.sh, fumo-controlo-404.txt).
  Memória: `roadmap-fase0-decisoes.md` (modificada 07/10 01:40 UTC) e `emulacao-toque-cdp.md` (07/10 01:29).
- Copiado para `docs/evidencias/2026-10-06-fase0-portoes/` (SEM commit): extrato literal das linhas 497–605 (W47–W55),
  5 instrumentos, 4 saídas, as somas de referência de 04/10. Caminhos locais com o nome da conta trocados por
  marcadores em 2 ficheiros (pages-somas.sh, fumo-controlo-404-W53.txt); o resto é cópia exata.
- Dados pessoais: procurar-sensivel.mjs (de 06/10) nos 12 ficheiros copiados → nada; o nome da conta do Windows → 0.
  CONTROLO do instrumento: ficheiro com um email e um JWT plantados → 2 achados, código 1.
- DESLIZE MEU (canal lateral, 13:40 UTC): ao mostrar o procurar-sensivel.mjs mascarei o prefixo do id mas não o padrão
  do nome da mentora — o nome próprio ficou nesta conversa. Já é público no código (item RGPD em aberto, dele).

## Achado: o publicacoes.mjs de 06/10 lia só a 1.ª página (100) — o repositório tem 102 publicações
Hoje: página 1 = 100 (ordem decrescente, a mais antiga github-pages 03/07), página 2 = 2. O instrumento escrevia
«100 publicações lidas» sem dizer que havia mais. As 8 da Vercel e as recentes estão na página 1, por isso as
leituras de 06/10 não ficam erradas, mas o controlo não cobria o limite. Versão nova no scratchpad desta sessão,
segue rel="next"; lida hoje: 102 em 2 páginas = 100 + 2 da leitura à mão (controlo).

## W56 — a entrada do 0.1 no main: linha de base de AGORA e critério (escrito ANTES do push dele)
Substitui a linha de base do W55 (07/10 01:40); o critério é o mesmo, com os números de hoje.

### Linha de base (2026-10-09 13:44 UTC)
- ls-remote: main 158a900; orbita/fase0-portoes 26e9f58; orbita/fase0-portoes-controlo 5f351b3.
  Avanço rápido confirmado (merge-base --is-ancestor); entram 2 ficheiros (deploy-react.yml +65, apoio.mjs +17).
- Publicações (publicacoes.mjs com paginação): 102 no total, 94 github-pages, a mais recente 158a900 06/10
  19:12:18; do 26e9f58: 0; vercel[bot]: 8, a última 04/10 23:33:10; estados do 26e9f58: 0; check-runs do 26e9f58:
  testes success, build success, deploy skipped, verificar-destino skipped (a corrida do ramo, 37523282982).
- Pages: os 16 ficheiros com HTTP 200, os 16 iguais às somas de 04/10 (sha256sum -c), e os 16 com
  Last-Modified Tue, 06 Oct 2026 19:12:27 GMT. CONTROLO: a mesma pasta com 1 byte trocado no sw.js → FAILED.

### Critério depois do push dele (`git push origin 26e9f58:main`)
1. ls-remote main = 26e9f5858a02a36eca07acf35bf3a8777b8effb9.
2. Uma corrida «Deploy React to Pages» no main para o 26e9f58 (esperar-corrida.mjs 26e9f58 main), conclusão
   success, com os 4 jobs success. Os números lidos no REGISTO PÚBLICO de cada job (o «success» da API sozinho não
   conta): testes «testes que passaram: 127 (mínimo: 127)» e «ℹ tests 127 · pass 127 · fail 0»; build com o fumo do
   dist «21 verificações passaram, 0 falharam» e alvo 127.0.0.1; verificar-destino com alvo
   https://kamappa.github.io/Sistema/ e 21/21.
3. Publicações: o 26e9f58 passa a ter exatamente 1, kamappa | github-pages; github-pages 95; vercel[bot] continua 8
   com a última 04/10 23:33:10 (controlo: a leitura vê-as); estados do commit 0.
4. Pages: 16/16 com HTTP 200, 16/16 iguais às somas de 04/10, e os 16 com Last-Modified DEPOIS do fim do passo de
   deploy e diferente de 06/10 19:12:27 (republicado, igual).
Qualquer ponto falhado → parar e dizer; nada se corrige sem o OK dele.

LIMITE (não escondido): o verificar-destino prova que o site publicado é uma Órbita que funciona, não que serve
ESTE build — como a app não muda, o site é igual antes e depois. Comparar as somas servidas com as do build do CI é a
fatia 3 (W54: nunca com um build do PC).

### W56 — resultado (14:48–14:56 UTC): PARADO no ponto 4 (à letra do critério); 1, 2 e 3 PASSARAM
Push dele 158a900..26e9f58 (14:48). Corrida 37946893253, success.
1. ls-remote main = 26e9f58…: PASSOU.
2. PASSOU. Registos lidos no texto bruto de cada job (o «ver registos» do GitHub, no Brave dele; só leitura):
   testes (113875377132) «ℹ tests 127 · pass 127 · fail 0 · cancelled 0 · skipped 0 · todo 0» e «testes que
   passaram: 127 (mínimo: 127)»; build (113876368266) «alvo» http://127.0.0.1:35453/Sistema/, «21 verificações
   passaram, 0 falharam»; verificar-destino (113877084463) «alvo» https://kamappa.github.io/Sistema/, estado 200 nas
   duas vistas, 21/21; deploy (113876695265) success, 14:51:13→14:52:04, passo «Deploy to GitHub Pages» até 14:52:02.
   Extra: as somas do «Hashes do dist» do CI = as de 04/10, 16/16 (controlo: 1 soma alterada acusada).
3. PASSOU. 103 publicações em 2 páginas; github-pages 95, a mais recente 26e9f58 14:51:10; do 26e9f58: 1, kamappa |
   github-pages; vercel[bot] 8, a última 04/10 23:33:10; estados 0; check-runs da corrida do main: os 4 success.
4. 16/16 HTTP 200 e 16/16 iguais às somas de 04/10: PASSOU. Last-Modified dos 16 = Fri, 09 Oct 2026 14:51:41 GMT —
   diferente de 06/10 19:12:27 (republicado), MAS ANTES do fim do passo de deploy (14:52:02), que o critério exigia.
   O critério estava mal escrito por mim: o Pages marca os ficheiros durante o passo (no W46 foi igual: deploy
   17:06:02→17:06:18, Last-Modified 17:06:06), e o W55 dizia só «depois do deploy». À letra, falhou; parei e não
   reescrevi o critério sem o Daniel.

### W56 — ponto 4: o ✘ original, a correção e a justificação (decisão do Daniel, ≈15:10 UTC; nada apagado acima)
- ORIGINAL (escrito antes do push): «os 16 com Last-Modified DEPOIS do fim do passo de deploy e diferente de 06/10
  19:12:27» → ✘ (14:51:41 é antes de 14:52:02).
- CORREÇÃO (texto do Daniel): «Last-Modified dos 16 ficheiros entre o início e o fim do job de deploy, e diferente do
  anterior» → job de deploy 14:51:13→14:52:04; os 16 com 14:51:41; anterior 06/10 19:12:27 → ✔.
- JUSTIFICAÇÃO: o W46 (06/10, anterior a este push) — deploy 17:06:02→17:06:18, Last-Modified 17:06:06: o Pages marca
  os ficheiros durante o deploy, não depois. O erro foi da escrita do critério, não do site.
- W56 FINAL: PASSOU nos 4 pontos, com o ponto 4 pelo texto corrigido.

### O site serve ESTE build (para esta publicação)
As somas do «Hashes do dist» da corrida 37946893253 = as de 04/10 (16/16); as somas servidas pelo Pages = as de 04/10
(16/16); logo o que o Pages serve é, byte a byte, a saída do build desta corrida. O Last-Modified dentro do job de deploy
desta corrida prova que foi esta publicação que lá pôs os ficheiros (sem ele, bytes iguais a builds anteriores não
distinguiriam «republicado» de «ficou o antigo»). O limite do W53/W55 fica respondido PARA ESTA PUBLICAÇÃO, à mão; a
fatia 3 continua a ser a forma automática, em cada publicação.

### Decisão do Daniel: ações por SHA = trabalho em falta do 0.1 e a próxima fatia, antes do 0.2a
O workflow tem as ações por etiqueta (actions/checkout@v5 e as outras) e agora tem permissão para publicar o site;
uma etiqueta móvel não pode decidir o código que corre lá.

## Commit 79c4cf7 (≈15:05 UTC, OK dele) — antes: detetor de 3 categorias
detetor-3.mjs (padrões do nome da mentora e do prefixo do id lidos do procurar-sensivel.mjs; conta do Windows lida do
sistema; nenhum valor escrito nem mostrado). CONTROLOS: 4/4 variantes por categoria (texto, maiúsculas, caminho
Windows/Unix, acento) e texto limpo 0; ficheiro plantado com a conta num caminho → 1. Resultado: 16 ficheiros das
evidências + as linhas novas do SPEC → 0 nas 3. Blobs commitados = ficheiros (hash-object --no-filters) 16/16, i/lf w/lf.
Commit feito no ramo orbita/fase0-portoes; main local avançado (ff-only) para 79c4cf7; ramo local apagado (estava no main).

## Passo 4 — pontas de 06/10 (só leitura, 15:09 UTC)
- Crons (supabase db query --linked, transação só leitura: so-leitura=on): job 3 radar-diario e job 4 oraculo-semanal
  ativo=false, comando presente, 2 crons no total. Controlo: a 06/10 o mesmo instrumento mostrou os dois ativos antes da
  pausa. SPEC v2 no main: «desde 2026-10-06 às 19:02 UTC (20:02 em Lisboa)».
- sistema-backups: ls-remote main = b1de265 = local (README: repor com o Oráculo pausado); pasta de trabalho limpa.
- Pasta de reversão da ação B: não existe; o b0c0b1e (o que ela continha) está no origin/main do sistema-backups.

## W57 — ações por SHA (escrito ANTES dos pushes dele)
SHAs: git ls-remote dos repositórios oficiais + API (as 4 etiquetas são leves, apontam para commits, 200) E o registo da
corrida 37946893253 («Download action repository …@v5 (SHA:…)»): checkout fbc6f39 (v5.1.0), setup-node a0853c2 (v5.0.0),
upload-pages-artifact fc324d3 (v5.0.0; por dentro usa upload-artifact já fixado por SHA bbbca2d), deploy-pages 368f825
(v5.0.1) — os mesmos que correram hoje: o comportamento não muda.
Local: acoes-por-sha.test.mjs VERMELHO com o workflow de hoje (8 de 8 listadas), VERDE depois (2/2); bateria 129/129,
TAP 129; TESTES_MINIMO 127 → 129; actionlint 0 (controlo: needs inexistente → erro, código 1).
CRITÉRIO no GitHub: (1) ramo real: testes 129/129 e «mínimo: 129», build e fumo 21/21, deploy saltado; (2) ramo de
controlo com UM @v5 plantado no workflow: testes falha com exatamente 1 falha (o acoes-por-sha), build saltado;
(3) com a definição «Require actions to be pinned to a full-length commit SHA» ligada (ele): o mesmo @v5 plantado faz a
corrida ser recusada; o ramo real continua verde.

## Etiqueta e ramos (15:15–15:25 UTC)
Pushes dele: main 26e9f58..79c4cf7; etiqueta evidencia/0.1-controlo (leve) → 5f351b3. Confirmado NA API do GitHub:
ref 200, commit 5f351b3…; compare 2bedb95/6b3f1af → etiqueta: ahead, behind_by 0; 5f351b3: identical. CONTROLO: 26e9f58 →
diverged (a leitura sabe dizer «não»). Ramo local -controlo apagado depois da etiqueta (2bedb95 continua presente).

## W58 — a publicação do 79c4cf7 (só docs; critério = o do W56, com o ponto 4 corrigido)
Corrida 37950568055: success, 4 jobs. Registos: testes 127/127, «testes que passaram: 127 (mínimo: 127)»; build fumo
21/21 (alvo 127.0.0.1), somas do CI = as de 04/10 16/16; verificar-destino alvo kamappa.github.io/Sistema/, 200 nas duas
vistas, 21/21. Publicações: 104 em 2 páginas, github-pages 96, o 79c4cf7 com 1 (kamappa | github-pages 15:20:34);
vercel[bot] 8 (última 04/10 23:33:10); estados 0. Pages: 16/16 HTTP 200, 16/16 iguais às de 04/10, Last-Modified 15:20:42
dentro do job de deploy 15:20:37–15:20:56. PASSOU.
TROPEÇO DO INSTRUMENTO (falhou alto, não deu verde): a 1.ª leitura deu «16 FAILED open or read» — o git switch reescreveu
as cópias de trabalho de docs/evidencias com CRLF (core.autocrlf; os blobs continuam LF), e o sha256sum -c leu os nomes
com \r. Refeito com a referência LF original (= blob commitado, hash-object --no-filters): 16 OK.

## W57 (1) — o ramo real: PASSOU (corrida 37952385549, 6fb9f62, lida na página web; a API pública estava a 4 pedidos)
Success em 3m24s; testes 2m24s: «✔ o reconhecedor…», «✔ todas as ações… por SHA», «ℹ tests 129 · pass 129 · fail 0»,
«testes que passaram: 129 (mínimo: 129)»; build 54 s: fumo 21/21 (alvo 127.0.0.1); deploy e verificar-destino saltados.
Downloads nos registos: checkout@fbc6f39…, setup-node@a0853c2…, upload-pages-artifact@fc324d3… (e por dentro
upload-artifact@bbbca2d…) — por SHA, não @v5.
Instrumento: parei o esperar-corrida (gastava 1 pedido/30 s; reset 15:48 UTC) e li a página web.

## .gitattributes (5bc6f22, OK dele) — controlo
Antes (pasta principal, depois do switch de 15:0x): 14/16 cópias ≠ blobs (os 2 iguais são .md, já eol=lf). Com a regra,
repostas do índice: 16/16; ida e volta ao main: 16/16. Numa pasta de trabalho nova a partir de 26e9f58 (sem evidências):
→ 79c4cf7 (sem a regra) 2/16 iguais = VERMELHO; → 5bc6f22 (com a regra) 16/16 = VERDE. A ida a 26e9f58 na pasta principal
foi recusada pelo git (SPEC com alterações por commitar) — por isso a pasta à parte.
MELHORIAS #14: a causa de raiz (autocrlf) com os três casos; NOTA: o registo não mostra problema nas cópias da v23 — o caso
documentado é a exportação da v22 (27/09, 4.ª instância); a v23 já foi exportada LF por causa dele.

## W57 (1) e (2) — com o .gitattributes, os dois ramos (≈22:20 UTC)
Controlo 2f43c3e = 5bc6f22 + só a linha plantada (diff: 1 ficheiro, 1 linha).
(1) ramo real 5bc6f22, corrida 37998399923: success; testes «ℹ tests 129 · pass 129 · fail 0», «mínimo: 129»; build fumo
21/21 (alvo 127.0.0.1); deploy e verificar-destino saltados; downloads por SHA (checkout fbc6f39, setup-node a0853c2,
upload-pages-artifact fc324d3, upload-artifact bbbca2d). PASSOU.
(2) controlo 2f43c3e, corrida 37998419474: failure; testes falhou no passo dos testes: «ℹ tests 129 · pass 128 · fail 1»,
a única falha «✖ todas as ações dos workflows estão fixadas por SHA» com «deploy-react.yml:138 actions/checkout@v5»; sem a
linha «testes que passaram»; «Process completed with exit code 1»; build, deploy e verificar-destino saltados. PASSOU.

## W57 (3) — a opção do GitHub (09/10 ≈23:00 UTC e 10/10)
Opção ligada pelo Daniel; CONFIRMADA ativa numa leitura nova de Settings → Actions → General (Brave dele, só leitura):
«[x] Require actions to be pinned to a full-length commit SHA» (as caixas vizinhas lidas como [ ] — a leitura distingue).
Tentativa 2 do ramo real 37998399923: success (testes 22:57, build 22:59; o upload-pages-artifact, que usa por dentro o
upload-artifact por SHA, passou com a opção ligada).
!! Tentativa 2 do CONTROLO 37998419474: failure, mas VERMELHO PELA RAZÃO ERRADA — o job testes correu (início 22:56:20,
2m19s) e falhou pelo nosso teste (1.ª camada), não pela opção. NÃO é prova da 2.ª camada.
Porquê não foi recusada — duas explicações, que um push novo com o mesmo plantado NÃO distingue: (a) voltar a correr não
aplica a opção; (b) a opção é verificada por job, no «Set up job», ao descarregar as ações (artigo de suzuki-shunsuke,
autor do pinact — não é a documentação oficial; a oficial não diz), e o @v5 da linha 138 está no verificar-destino, que só
corre no main: num ramo nunca é descarregado. Proposta: um 2.º plantado no checkout do job testes (o @v5 da linha 138
fica intocado). Critério corrigido: o job testes falha no passo «Set up job» com «…is not allowed because all actions must
be pinned to a full-length commit SHA», sem nenhum passo seguinte a correr (sem «ℹ tests» no registo); build, deploy e
verificar-destino saltados. Se o passo dos testes correr, a prova falhou.

### W57 (3) — correção do critério (decisão do Daniel, 10/10), sem apagar o anterior
- ORIGINAL (dele): «a corrida nova tem de falhar antes de qualquer job correr, com uma mensagem do GitHub sobre a ação
  não fixada». ERRADO: o GitHub verifica as ações job a job, no «Set up job», ao descarregá-las; um plantado num job que
  não corre (o verificar-destino nos ramos) nunca é verificado e não prova nada.
- CORRIGIDO (aprovado): 2.º plantado no checkout do job testes (commit 5a85139; o da linha 138 intocado; diferença para o
  ramo real = só as 2 linhas plantadas). O job testes falha no passo «Set up job» com «…is not allowed because all actions
  must be pinned to a full-length commit SHA»; nenhum passo seguinte corre (sem «ℹ tests» no registo); build, deploy e
  verificar-destino saltados. Se o passo dos testes correr, a prova falhou.

### Acrescento ao critério da entrada no main (W59, a escrever completo antes do push)
A tentativa 2 do ramo real só verificou com a opção ligada os jobs que correm nos ramos (testes, build). deploy e
verificar-destino só correm no main → o critério do main inclui: os dois passam o «Set up job». Lido a 10/10 nos
action.yml dos SHAs fixados: deploy-pages = node24 (sem ações por dentro); verificar-destino usa checkout e setup-node
(node24), já descarregados com a opção ligada no job testes; o upload-pages-artifact é composite e usa
upload-artifact@bbbca2d (por SHA), que passou no build com a opção ligada. Risco baixo, mas não verificado no deploy.
SE O GITHUB RECUSAR UMA AÇÃO NO DEPLOY (plano do Daniel, escrito antes): o site fica como está (o deploy não chega a
publicar); ele desliga a opção, publicamos, e investigamos qual ação falhou antes de a voltar a ligar.

### W57 (3) — resultado (23:04 UTC): PASSOU — a 2.ª camada (a opção do GitHub) recusa
Push dele 2f43c3e..5a85139 → corrida 38002537999: failure. API: job testes (114063767175) failure com UM só passo,
«1. Set up job: failure»; build, deploy, verificar-destino skipped. Registo do job (texto bruto, 32 linhas, com as linhas
do runner — é um registo real): «##[error]The action actions/checkout@v5 is not allowed in kamappa/Sistema because all
actions must be pinned to a full-length commit SHA.»; 0 linhas «ℹ tests», 0 «npm ci» — nenhum passo seguinte correu.
TROPEÇO MEU, apanhado antes de virar afirmação: a 1.ª leitura usou o SHA curto no endereço e a página era «Server Error»
— os zeros dessa leitura não valiam nada; refeita com o SHA completo (e uma 2.ª tentativa com um SHA que eu escrevi de
cabeça, errado, antes de o ler do git).
W57 FECHADO: (1) ramo real verde por SHA; (2) controlo apanhado pelo nosso teste; (3) controlo recusado pelo GitHub no
«Set up job». Tentativa 2 do controlo 37998419474: vermelha pela razão errada (registado acima), não conta.

## W59 — a entrada da fatia SHA no main (escrito ANTES do push dele)
Avanço rápido 79c4cf7..5bc6f22 (FF confirmado; entram 3 ficheiros: .gitattributes, deploy-react.yml, acoes-por-sha.test.mjs;
o código da app não muda). Linha de base (23:05 UTC): ls-remote main 79c4cf7; publicações 104 em 2 páginas, github-pages 96
(a mais recente 79c4cf7 15:20:34), do 5bc6f22 0, vercel 8 (última 04/10 23:33:10), estados 0; Pages 16/16 HTTP 200,
16/16 iguais às de 04/10, Last-Modified 09/10 15:20:42. Opção dos SHA LIGADA.
CRITÉRIO:
1. ls-remote main = 5bc6f22091f24e31b1c3796dba9e57bff0c1d5fb.
2. Corrida do main para 5bc6f22: success nos 4 jobs; em cada job, o «Set up job» success (a 1.ª vez que o deploy e o
   verificar-destino correm com a opção ligada); nos registos: testes «ℹ tests 129 · pass 129 · fail 0» e «mínimo: 129»;
   build fumo 21/21 (alvo 127.0.0.1) e somas do CI = 04/10 (16/16); verificar-destino alvo kamappa.github.io/Sistema/,
   21/21; deploy-pages descarregado por SHA (368f825).
3. Publicações: 5bc6f22 com 1, kamappa | github-pages; github-pages 97; vercel 8; estados 0.
4. Pages: 16/16 HTTP 200, iguais às de 04/10, Last-Modified dos 16 entre o início e o fim do job de deploy e ≠ 15:20:42.
SE O GITHUB RECUSAR UMA AÇÃO (deploy ou verificar-destino no «Set up job»): o site fica como está; o Daniel desliga a opção,
publicamos, e investigamos qual ação falhou antes de a voltar a ligar.

### W59 — resultado (23:13–23:20 UTC): PASSOU nos 4 pontos
Push dele 79c4cf7..5bc6f22. (1) ls-remote main = 5bc6f22. (2) corrida 38002913087 success; «Set up job» success nos 4 jobs
(deploy e verificar-destino pela 1.ª vez com a opção ligada); testes «ℹ tests 129 · pass 129 · fail 0», «mínimo: 129»;
build fumo 21/21 (alvo 127.0.0.1), somas do CI = 04/10 16/16 (controlo no mesmo instrumento: 1.º carácter trocado → 0);
deploy 23:11:36→23:11:48, «Download action repository 'actions/deploy-pages@368f825…'»; verificar-destino com
checkout@fbc6f39 e setup-node@a0853c2, alvo kamappa.github.io/Sistema/, 200 nas duas vistas, 21/21; nenhum «not allowed».
(3) 105 publicações em 2 páginas; github-pages 97; 5bc6f22 com 1 (kamappa | github-pages 23:11:33); vercel 8; estados 0.
(4) Pages 16/16 HTTP 200, 16/16 iguais às de 04/10 (a referência na pasta, agora LF pelo .gitattributes), Last-Modified
23:11:41 nos 16, dentro do job de deploy e ≠ 15:20:42.
