# Teste de fumo do Sistema

Criado no Lote 0 (2026-09-23). É a linha de base contra a qual se compara cada lote:
no fim de um lote, corre-se isto; se algo que passava deixar de passar, é isso que
se mostra primeiro.

```bash
node testes/fumo/fumo.mjs                 # tudo, comparado com linha-de-base.json
node testes/fumo/fumo.mjs --so-frontend   # só o browser (~1 min)
node testes/fumo/fumo.mjs --so-oraculo    # só a Edge Function, localmente (~20 s)
```

Código de saída `0` = tudo verde; `1` = alguma verificação falhou ou apareceu um erro
novo na consola. Capturas de ecrã e registos brutos vão para a pasta temporária do
sistema (o caminho é impresso no fim) — nunca para o repositório, que é público.

**Requisitos:** Node ≥ 20 (no Windows: `C:\Program Files\nodejs`, fora do PATH), Google
Chrome, e Deno 2.x em `%USERPROFILE%\.deno\bin\deno.exe` (ou `DENO_PATH`). Sem
dependências npm.

## O que verifica

**Frontend** (o Vanilla servido localmente em `/Sistema/`, como no GitHub Pages):
ecrã de entrada sem sessão; os 7 ecrãs principais (as zonas do Dock) com conteúdo;
nada em fluxo mais largo do que o ecrã; a sequência de arranque; o Mapa da Estação
(abre com 7 planetas, fecha com Esc); mobile 390×844; movimento reduzido (o arranque
não corre); arranque com o Supabase bloqueado; arranque com o CDN bloqueado (a app
entra em modo local); e nenhum erro de consola ou de rede que não esteja na linha de
base. O instrumento é **calibrado em cada corrida**: provoca um `console.error`, um
`console.warn`, uma exceção e um 404, e falha se não os apanhar — um zero só vale se
o contador consegue contar.

**Oráculo** (`supabase/functions/oraculo`, em Deno, no modo de teste): autenticação do
cron (token errado → 403, sem efeitos) e do browser (sem JWT → 401; sem estado → 403);
radar com 2 chamadas ao modelo, dedupe por URL e limpeza dos itens com mais de 30 dias;
relatório gravado e a escrita no vault **bloqueada** com o conteúdo que teria tido;
chat, sussurro, `vault-check` e `report-dry`. Os valores esperados estão escritos à
mão no teste, a partir dos dados fixos.

## Garantias, por construção

- **Nenhuma escrita na conta real.** O Chrome arranca com um perfil temporário e vazio:
  sem sessão Supabase, o frontend só tem o caminho offline (o `cloudSave` exige
  utilizador). O teste falha se encontrar uma sessão.
- **Zero chamadas à Anthropic, zero escrita no vault.** O Deno corre com rede só para
  `127.0.0.1:<porta>`; o teste prova-o em cada corrida (um pedido para fora é recusado
  com `NotCapable`). As variáveis de ambiente são falsas — nenhum segredo real existe
  nesta corrida.
- **O modo de teste não liga em produção.** Exige `ORACLE_TEST_MODE=fixtures` **e** um
  `SUPABASE_URL` local; o teste verifica o guarda com o URL de produção.

## O que NÃO cobre

- Os caminhos com dados reais: sincronização com o Supabase, Oráculo com sessão, radar
  e relatório com itens reais.
- A função **publicada** (continua a v19 até haver um deploy aprovado) e o cron real.
- Regressões visuais finas: as capturas ficam na pasta temporária para quem as quiser
  ver, mas não há comparação de píxeis.

## Duas lições que ficam no código

- `scrollWidth` e `scrollX` não servem para medir overflow em mobile: a aurora
  decorativa (`<i>` absoluto) alarga o `scrollWidth` sem overflow real, e o
  `html{overflow-x:hidden}` esconde o overflow que houver. Mede-se conteúdo em fluxo
  mais largo do que o ecrã (ver `frontend.mjs`).
- Sondas de permissões do Deno correm com `deno run`, nunca com `deno eval`: o `eval`
  tem todas as permissões implícitas e ignora as flags.

## Atualizar a linha de base

`--gravar-linha-de-base` (com `--so-frontend` ou `--so-oraculo` para gravar só uma
secção). Só depois de o Daniel aceitar a mudança: uma linha de base regravada para
fazer um teste passar é um teste desligado.
