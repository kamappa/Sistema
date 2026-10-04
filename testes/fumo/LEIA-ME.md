# Teste de fumo do Sistema

Criado no Lote 0 (2026-09-23). É a linha de base contra a qual se compara cada lote:
no fim de um lote, corre-se isto; se algo que passava deixar de passar, é isso que
se mostra primeiro.

```bash
node testes/fumo/fumo.mjs                 # o Oráculo, localmente (~20 s)
node testes/fumo/fumo.mjs --so-oraculo    # o mesmo, aceite por compatibilidade
```

Código de saída `0` = tudo verde; `1` = alguma verificação falhou.

**Requisitos:** Node ≥ 20 e Deno 2.x em `%USERPROFILE%\.deno\bin\deno.exe` (ou
`DENO_PATH`). Sem dependências npm.

**Os testes unitários do Oráculo** (`testes/oraculo/`, em Deno) correm na Órbita com a
descoberta do `package.json` desligada. A raiz tem o `package.json` do Vite, e sem isto
o Deno procura os tipos no `node_modules` do frontend e falha antes de correr um único
teste. O `fumo.mjs` já a desliga sozinho.

```bash
DENO_NO_PACKAGE_JSON=1 deno test --no-prompt testes/oraculo/
```

No PowerShell: `$env:DENO_NO_PACKAGE_JSON='1'; deno test --no-prompt testes/oraculo/`.

## No ramo da Órbita, só o Oráculo

Este teste chegou ao ramo da Órbita a 2026-09-27, trazido do `main` por caminho, e
chegou **sem a parte do frontend**. Essa parte verificava o Vanilla — os 7 ecrãs do
HUD, o Mapa da Estação, o painel das sessões — servido a partir da raiz do
repositório. Na Órbita a raiz é o `index.html` do Vite, que só funciona depois do
build: o teste abriria outra aplicação e diria que verificou o frontend. Um teste que
diz verificar o frontend e verifica outro é pior do que não ter teste (decisão do
Daniel, 2026-09-27).

- A parte do Vanilla (`frontend.mjs`) ficou no `main`, com a secção `frontend` da
  linha de base.
- O fumo da Órbita — build de produção, computador e 390×844 — é o `orbita.mjs`
  (2026-10-04): `npm run build` e depois `node testes/fumo/orbita.mjs`, ou
  `node testes/fumo/orbita.mjs https://kamappa.github.io/Sistema/` no destino. Calibra-se
  primeiro (um erro na consola, uma exceção, um 404 e um elemento de 2000 px plantados têm
  de ser apanhados) e falha se o `sw.js` publicado for o interruptor da reversão.
  `--so-frontend` aqui continua a recusar correr e aponta para ele.

## O que verifica

**Oráculo** (`supabase/functions/oraculo`, em Deno, no modo de teste): autenticação do
cron (token errado → 403, sem efeitos) e do browser (sem JWT → 401; sem estado → 403);
radar com 2 chamadas ao modelo, dedupe por URL e limpeza dos itens com mais de 30 dias;
relatório gravado e a escrita no vault **bloqueada** com o conteúdo que teria tido;
chat, sussurro, `vault-check` e `report-dry`. Os valores esperados estão escritos à
mão no teste, a partir dos dados fixos.

## Garantias, por construção

- **Zero chamadas à Anthropic, zero escrita no vault.** O Deno corre com rede só para
  `127.0.0.1:<porta>`; o teste prova-o em cada corrida (um pedido para fora é recusado
  com `NotCapable`). As variáveis de ambiente são falsas — nenhum segredo real existe
  nesta corrida.
- **O modo de teste não liga em produção.** Exige `ORACLE_TEST_MODE=fixtures` **e** um
  `SUPABASE_URL` local; o teste verifica o guarda com o URL de produção.

## O que NÃO cobre

- O frontend da Órbita (ver acima).
- Os caminhos com dados reais: sincronização com o Supabase, Oráculo com sessão, radar
  e relatório com itens reais.
- A função **publicada** e o cron real: o teste corre a função do repositório, no modo
  de teste.

## Duas lições que ficam

- (Para o fumo do frontend, quando voltar.) `scrollWidth` e `scrollX` não servem para
  medir overflow em mobile: a aurora decorativa (`<i>` absoluto) alarga o
  `scrollWidth` sem overflow real, e o `html{overflow-x:hidden}` esconde o overflow que
  houver. Mede-se conteúdo em fluxo mais largo do que o ecrã (ver `frontend.mjs` no
  `main`).
- Sondas de permissões do Deno correm com `deno run`, nunca com `deno eval`: o `eval`
  tem todas as permissões implícitas e ignora as flags.

## Atualizar a linha de base

`--gravar-linha-de-base`. Só depois de o Daniel aceitar a mudança: uma linha de base
regravada para fazer um teste passar é um teste desligado.
