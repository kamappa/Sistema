# Verificações W47–W55 — fase 0, fatia 0.1 (portões na publicação)

> Extrato literal das linhas 497–605 de `verificacoes-06-10.md` (scratchpad da sessão 9e0dac37, 06–07/10/2026).
> Recuperado a 2026-10-09; nada alterado abaixo da linha.

---

## W47 — 0.1, fatia 1: linha de base local ANTES de mexer no workflow (escrito ANTES)
Ramo orbita/fase0-portoes a partir de main 158a900. Corro no PC o que o portão vai correr: npm run typecheck; node --test
nos testes de segurança e de toque; npm run build; node testes/fumo/orbita.mjs (sobre o dist). CRITÉRIO: os quatro
passam. Se algum falhar hoje, o portão bloquearia publicações por uma falha que já existe → PARAR e dizer ao Daniel antes
de ligar o portão. Registo os tempos (o portão acrescenta-os a cada publicação).
### W47 — resultado: VERDE (linha de base sem falhas preexistentes)
typecheck código 0 (9 s); node --test segurança+toque: 127 tests, 127 pass, 0 fail (113 s) — o 1.º grep do resumo não
encontrou nada (o reporter spec escreve «ℹ tests», não «# tests»): não aceitei o código 0 sozinho, li as contagens; build
16 ficheiros (index-B2-hBgsQ.js) em 9 s; fumo orbita.mjs sobre o dist 21/21 em 27 s. Decisão de desenho: o portão exige
um MÍNIMO de 127 testes passados (contados no TAP), porque um node --test sem testes também sai com 0.

## W48 — 0.1, fatia 1: o workflow novo (escrito, sem commit) e o plano de prova no GitHub
deploy-react.yml: job `testes` (ubuntu-24.04; npm ci, typecheck, node --test segurança+toque com reporter spec e TAP,
mínimo TESTES_MINIMO=127 contado no TAP); `build` com `needs: testes` e o fumo orbita.mjs sobre o dist antes do upload;
`deploy` igual; `verificar-destino` (só main, needs deploy; checkout + setup-node, sem npm ci — o fumo só usa módulos do
Node) com orbita.mjs no URL publicado. Instrumento do mínimo provado: todos → 127 aceite; só segurança → 84 recusado;
padrão sem ficheiros → código 0 e 0 testes, recusado. actionlint 1.7.12 sem erros (controlo: needs inexistente → erro).
Fumo no site publicado, como o job: 21/21 em 27 s. 0 CR.
PROVA NO GITHUB (planeada, pushes dele): ramo orbita/fase0-portoes-controlo a partir do main: (1) só o teste plantado com
o workflow ANTIGO → o build tem de PASSAR (o portão não existia — vermelho do TDD); (2) + o workflow novo → `testes`
FALHA e `build` fica SALTADO. Ramo orbita/fase0-portoes: o workflow novo → testes 127 ≥ 127, build e fumo verdes, deploy
saltado (não é main). Riscos a ver na 1.ª corrida: o sandbox do Chrome no Ubuntu 24.04; tempos dos testes de toque.

## W49 — o VERMELHO no GitHub (com o workflow antigo)
Commits LOCAIS com o OK dele: fc34fcf (orbita/fase0-portoes, só o workflow); 2bedb95 (orbita/fase0-portoes-controlo, a
partir do main, só o teste plantado, workflow antigo confirmado); 6b3f1af (cherry-pick do fc34fcf por cima). Controlo do
controlo, no PC: node --test do teste plantado → código 1, 1 fail.
Push dele de 2bedb95 para o ramo de controlo → corrida 37519731209: SUCCESS — build com checkout, setup, npm ci, build,
somas e upload (nenhum passo de teste), deploy saltado (não é main). Com o teste a falhar no repositório, o build
passou: o portão não existia. (Instrumento: 1.ª leitura partida porque o node escreveu o id da corrida com cores do
terminal; refeita com process.stdout.write.)

## W50 — o portão a funcionar, e o que a 1.ª corrida dele revelou
Push dele de 6b3f1af (workflow novo por cima do teste plantado) → corrida 37520282820: FAILURE — job testes falhou no
passo «Testes de segurança e de toque»; build, deploy e verificar-destino SALTADOS. O portão bloqueia. Mas o registo
(lido na página pública do job; a API de registos dá 403 sem token) tinha 4 falhas e não 1: o plantado + 3 do modo rato
(«o modo rato é rato», «com rato num ecrã largo…», «com rato numa janela estreita…»); 128 tests, 124 pass.
CAUSA (provada pelos dois lados): no runner, o teste do instrumento viu {hover:false, semHover:true, fino:false,
grosso:false} = hover:none, pointer:none — o runner não tem dispositivo apontador, e o modo rato dos testes só desligava
a emulação de toque, herdando o apontador do computador. Sonda no PC (sonda-apontador.mjs): --blink-settings com
apontador «nenhum» dá exatamente esses valores; «rato» dá hover+fine; a emulação de toque do CDP continua a dar coarse
por cima das duas. VERMELHO local: SISTEMA_TESTE_APONTADOR=nenhum → os mesmos 3 falham (40/43).
CORREÇÃO (testes/fumo/apoio.mjs, sem commit): o lançador fixa o apontador «rato» por omissão; SISTEMA_TESTE_APONTADOR=
nenhum reproduz a máquina sem rato; valor inválido recusado. VERDE local: 127/127 no TAP; controlo «nenhum» 40/43;
fumo dist 21/21 e site 21/21. Prova decisiva: o runner.

## W51 — o portão VERDE no ramo real (critério escrito antes, no W48)
Commits com o OK dele: 26e9f58 (orbita/fase0-portoes, a correção do apontador) e 5f351b3 (o mesmo, cherry-pick no ramo
de controlo, ainda sem push). Push dele do ramo real → corrida 37523282982 (26e9f58): SUCCESS. Lido a 2026-10-07
01:20–01:29 UTC na página pública dos jobs, pela procura do visualizador (ele só desenha as linhas visíveis: a 1.ª leitura
do texto da página não trouxe o resumo, e não aceitei o «success» da API sozinho):
- `testes` (job 112473811396, 2m18s): typecheck 5 s; passo dos testes 2m02s, registo linhas 142–150: «ℹ tests 127 ·
  pass 127 · fail 0 · cancelled 0 · skipped 0 · todo 0» e «testes que passaram: 127 (mínimo: 127)». Os 3 do modo rato
  passaram no runner: a correção chegou lá (a prova decisiva que o W50 pedia).
- `build` (job 112474819644, 51 s): fumo 36 s, «alvo»: http://127.0.0.1:39249/Sistema/ (o dist servido no runner, não o
  site), «21 verificações passaram, 0 falharam» e «✓ tudo verde»; o Upload artifact vem DEPOIS do fumo.
- `deploy` e `verificar-destino`: saltados (não é main).
Controlo de que este verde podia ser vermelho: o W50 (o mesmo portão, com o plantado → failure, build saltado).

## W52 — o controlo com a correção (escrito ANTES do push dele)
O ramo de controlo difere do real SÓ no teste plantado (git diff --stat: 1 ficheiro, controlo-portao.test.mjs). Push dele
de 5f351b3 (6b3f1af..5f351b3) → nova corrida. CRITÉRIO: conclusão failure; no job `testes`, o passo dos testes falha com
EXATAMENTE 1 falha, «controlo do portão: este teste falha de propósito» — 128 tests, 127 pass, 1 fail; a linha «testes
que passaram» NÃO aparece (o bash -e sai no node --test); `build`, `deploy` e `verificar-destino` SALTADOS. Mais falhas
do que 1 → parar e investigar (o ambiente ainda manda). O build a correr → o portão está partido.

## W53 — controlo do modo remoto do fumo (o que o `verificar-destino` corre), no PC (escrito ANTES)
O `verificar-destino` só corre no main, logo o controlo dele faz-se aqui: orbita.mjs com um URL do Pages que NÃO é a
Órbita (https://kamappa.github.io/Sistema/nao-existe/ — o Pages responde 404). CRITÉRIO: código de saída 1 (não 0 nem 2)
e a verificação «a página responde 200» a falhar. Se sair 0, o modo remoto não lê o estado real → parar.
### W53 — resultado: PASSOU (o modo remoto falha quando o destino não é a Órbita)
Código de saída 1; «estadoDoDocumento»: 404 nas duas vistas; 10 passaram, 11 falharam, entre elas «a página responde
200 — 404», o ecrã de entrada, a app desenhada, o service worker e o manifesto. Saída em jobs/9e0dac37/tmp.
LIMITE (dito, não escondido): no 1.º deploy pelo portão o site publicado fica IGUAL ao de agora (só mudam o workflow e
os testes), logo o verde do `verificar-destino` prova «o site serve uma Órbita que funciona», não «serve ESTE build» —
isso é a fatia 3 (comparar as somas servidas com as do build).

### W52 — resultado (01:37 UTC): PASSOU — o portão bloqueia por UMA falha, a plantada
Push dele 6b3f1af..5f351b3 → corrida 37557745880: failure. API pública: job testes (112587775063) failure no passo
«Testes de segurança e de toque»; build, deploy e verificar-destino skipped. Registo (página pública do job, linhas
143–169): «ℹ tests 128 · pass 127 · fail 1 · cancelled 0 · skipped 0 · todo 0»; «failing tests»: só «controlo do portão:
este teste falha de propósito» (testes/seguranca/controlo-portao.test.mjs:9:1, AssertionError «plantado para provar que
o portão bloqueia o build»); a seguir «Process completed with exit code 1», sem a linha «testes que passaram». Os 3 do
modo rato passaram no runner também aqui.

## W54 — achado lateral: o dist construído no PC NÃO é byte-igual ao publicado (CRLF)
Ao comparar o dist local (de 26e9f58) com as somas do site de 04/10 (w45/pages-antes.sha256): 16 ficheiros; 7 iguais
(os 5 bundles e os 2 PNG), 9 diferentes (index.html, manifest, sw.js, perguntas/lote1–6.json). CAUSA provada: o git do PC
tem core.autocrlf=true (índice i/lf, cópia de trabalho w/crlf); o Vite copia o public/ tal como está → CR no dist local
(index.html 30 CR, sw.js 54 CR, lote1 202 CR; bundles 0). Tirando os CR, os 9 dão as somas de referência (9 de 9). O CI
(Linux, LF) constrói igual ao publicado (W46 e 158a900: 16/16). CONSEQUÊNCIA para a fatia 3: as somas servidas comparam-se
com as do build DO CI (o passo «Hashes do dist»), nunca com um build do PC.

## W55 — a entrada do 0.1 no main (escrito ANTES; só com a decisão do Daniel)
Avanço rápido 158a900..26e9f58 (ls-remote main = 158a900 = main local; entram 2 ficheiros: deploy-react.yml e
testes/fumo/apoio.mjs; o código da app não muda → o site publicado deve ficar IGUAL). Linha de base (01:40 UTC):
publicações do 26e9f58 = 0; do 158a900 = 1 (github-pages 19:12:18); vercel[bot] = 8 (a última 04/10 23:33); estados 0;
Pages 16/16 iguais aos de 04/10, Last-Modified 06/10 19:12:27. CRITÉRIO depois do push dele:
(1) ls-remote main = 26e9f58;
(2) a corrida do main para 26e9f58 (esperar-corrida.mjs 26e9f58 main): testes success com «testes que passaram: 127
    (mínimo: 127)»; build success com o fumo do dist 21/21; deploy success; verificar-destino success com «alvo»
    https://kamappa.github.io/Sistema/ e 21/21;
(3) publicacoes.mjs: o 26e9f58 passa a ter 1 publicação, kamappa | github-pages; vercel[bot] continua 8 (controlo);
    estados 0;
(4) pages-somas.sh: 16/16 iguais aos de 04/10 e Last-Modified DEPOIS do deploy (republicado, igual).
Instrumentos com controlo: W50/W52 (o portão falha e bloqueia), W53 (o fumo remoto falha num destino errado), W54 (o
sha256sum -c acusa diferenças), a Vercel antiga visível. LIMITE: o verde do verificar-destino prova «uma Órbita que
funciona», não «este build» — fatia 3.
