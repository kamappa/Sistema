# Reversão — a Órbita sai, o Vanilla volta

Escrito a 2026-10-04, antes de a Órbita entrar no `main`, e ensaiado nesse dia. Só se usa se a
Órbita publicada no GitHub Pages tiver de sair. Cada passo que mexe no `main` ou nas definições do
repositório precisa do OK explícito do Daniel.

## Porque não basta reverter o `main`

1. **A fonte do Pages.** Com a fonte em «GitHub Actions», o site só muda quando um workflow publica.
   O Vanilla não tem workflow: pôr o Vanilla no `main` não muda nada no site, que continua a servir a
   última publicação da Órbita. É preciso voltar a fonte para «Deploy from a branch».
2. **A ordem.** Se a fonte voltar ao ramo com a Órbita ainda no `main`, o Pages serve o `index.html`
   do Vite sem build, e o site fica partido. Primeiro o Vanilla no `main`, depois a fonte.
3. **O service worker da Órbita** guarda na cache, e serve da cache primeiro, todos os `.js`, `.css`,
   `.png`, `.svg` e `.woff` do sítio. O Vanilla não tem service worker; o da Órbita ficaria registado
   nos aparelhos que a abriram, e os ficheiros do Vanilla ficariam presos na cache. Por isso a
   reversão leva o interruptor desta pasta (`sw.js`) para a raiz do Vanilla: substitui o da Órbita,
   apaga as caches e desregista-se.

Este `sw.js` **nunca** pode ir para `public/` enquanto a Órbita estiver no ar: desligaria o service
worker dela. O fumo da Órbita (`testes/fumo/orbita.mjs`) falha se o `/Sistema/sw.js` publicado for o
interruptor.

## Os passos

```bash
# 1. A árvore da reversão: a etiqueta vanilla-final + o interruptor em sw.js. Índice temporário,
#    para não mexer no da pasta de trabalho.
git fetch origin --tags
export GIT_INDEX_FILE="$(mktemp)"
git read-tree vanilla-final
git update-index --add --cacheinfo "100644,$(git rev-parse origin/main:reversao/sw.js),sw.js"
T=$(git write-tree)
unset GIT_INDEX_FILE

# 2. O commit, por cima do main atual (a história fica inteira).
C=$(git commit-tree "$T" -p origin/main -m "revert: o Vanilla volta - vanilla-final e o interruptor do service worker")

# 3. Verificar antes de publicar: a única diferença face à vanilla-final é o sw.js, e não há workflow.
git diff --name-status vanilla-final "$C"          # tem de dar só: A  sw.js
git ls-tree -r --name-only "$C" | grep '^.github/' # tem de dar nada

# 4. Publicar (OK do Daniel): o site ainda não muda - a fonte está em «GitHub Actions».
git push origin "$C":main

# 5. O Daniel: Settings → Pages → Build and deployment → Source: «Deploy from a branch», main, / (root).
```

6. **Verificar no destino:** `https://kamappa.github.io/Sistema/` serve o Vanilla (o `index.html`
   carrega `js/data.js`) e `https://kamappa.github.io/Sistema/sw.js` é o interruptor. Se o site não se
   reconstruir sozinho depois da troca de fonte, um commit vazio no `main` dispara a publicação a
   partir do ramo. A documentação do GitHub (lida a 2026-10-04) não descreve o que se serve logo a
   seguir a uma troca de fonte: observa-se.
7. **Nos aparelhos:** a primeira visita depois da reversão já mostra o Vanilla (o service worker da
   Órbita vai à rede primeiro na navegação); na visita seguinte o interruptor já correu, e daí em
   diante nada vem da cache.

## O que foi ensaiado a 2026-10-04

- **Os comandos dos passos 1 a 3**, com objetos soltos (sem ramo): a árvore é a `vanilla-final` mais
  um único ficheiro novo, `sw.js`, igual a este; sem `.github/`.
- **O cliente**, num Chrome sem cabeça com perfil temporário e um servidor na mesma origem a trocar
  de conteúdo: sem o interruptor, depois de trocar para o Vanilla o service worker da Órbita
  continuou registado, e um `js/data.js` novo nunca chegou (o servidor nem recebeu o pedido); com o
  interruptor, o registo desapareceu, as caches ficaram vazias e o `js/data.js` novo chegou.
- **O sítio revertido funciona:** o fumo do próprio Vanilla (`testes/fumo/frontend.mjs` da
  `vanilla-final`) deu verde sobre uma exportação da etiqueta.

Não ensaiado: a troca de fonte no GitHub (só documentação, que não a descreve).
