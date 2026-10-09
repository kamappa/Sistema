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
