# Biblioteca visual da Missão 26 — ler primeiro

> Criada a 2026-07-28. Esta pasta serve a **Missão 26 — Renaissance Visual**.
> Não é autoridade documental: fica no nível 9 da ordem de precedência do
> `CLAUDE.md` (documentação de missão). Qualquer coisa aqui cede perante a
> Constituição, o `CLAUDE.md` e o `SPEC-CLAUDE-CODE.md`.

## Para que serve

Guardar referências visuais, extrair delas **princípios** e registar o que foi
decidido — para que uma decisão visual não dependa de alguém se lembrar de um
vídeo que viu numa tarde.

## Para que NÃO serve

- Não é uma pasta de assets do produto. Nada daqui é servido ao utilizador.
- Não é um moodboard para copiar. Ver `VISUAL-GRAMMAR.md`, secção "riscos de
  imitação".
- Não substitui o julgamento. A pergunta obrigatória do `CLAUDE.md` continua a
  valer no fim de cada alteração: *isto parece um produto único chamado
  Sistema, ou parece uma interface gerada por AI?*

## Ordem de leitura

1. `00_READ_ME_FIRST.md` — este ficheiro.
2. `SKILL-ROUTING.md` — que skill se usa em que etapa, e as proibições.
3. `REFERENCE-MAP.md` — inventário do que está em disco, medido.
4. `VISUAL-GRAMMAR.md` — os princípios extraídos das referências.
5. `DESIGN-DECISIONS.md` — o que foi decidido, quando e porquê.

## Estrutura

```
docs/design-references/mission-26/
├── 00_READ_ME_FIRST.md     ← este
├── REFERENCE-MAP.md         ← inventário medido
├── VISUAL-GRAMMAR.md        ← princípios extraídos
├── DESIGN-DECISIONS.md      ← registo de decisões
├── SKILL-ROUTING.md         ← cadeia de ferramentas
└── local/                   ← GITIGNORED, fica só no disco
    ├── 00-inbox/            ← entrada; material por triar
    ├── 01-shell-navigation/
    ├── 02-oracle-presence/
    ├── 03-universe-materials/
    ├── 04-panels-instruments/
    ├── 05-operator-identity/
    ├── 06-motion-transitions/
    ├── 07-core-level-events/
    ├── 90-anti-references/   ← o que NÃO fazer, com o motivo
    └── 98-extracted-frames/  ← frames e contact sheets derivadas
```

### Porque é que `local/` está fora do Git

Três motivos, por ordem de peso:

1. **Direitos de autor.** O material é de terceiros. Referência privada para
   estudo é uma coisa; redistribuir num repositório é outra.
2. **Peso.** ~120 MB de mp4/gif/jpg. O Git guarda binários para sempre — nem um
   `git rm` os tira do histórico.
3. **Não são fonte de verdade.** O que tem de sobreviver é o princípio extraído,
   que vive nos `.md` versionados. Se um ficheiro se perder, a decisão que ele
   originou continua registada.

A pasta original `docs/design references/` (com espaço, sem hífen) também está
gitignored, pelo mesmo motivo.

## Estado atual — 2026-07-28

- **50 ficheiros** em `docs/design references/`: 21 mp4, 9 gif, 20 jpg.
- **30 ficheiros com movimento** processados: 338 frames extraídas e 30 contact
  sheets em `local/98-extracted-frames/`.
- **3 referências analisadas a fundo** (R15, R17, R19). As restantes estão
  inventariadas com dados medidos, mas **por interpretar** — e estão marcadas
  como tal no `REFERENCE-MAP.md`. Inventário não é análise.

## Ferramenta

O ffmpeg **não está instalado neste sistema**. Foi usado um binário portátil
(`ffmpeg-static` 6.1.1 + `ffprobe-static` 4.0.2) instalado numa pasta temporária
fora do projeto. Não foi alterado o PATH, nem o `package.json`, nem instalado
nada à escala do sistema.

Consequência prática: **este passo não é reprodutível sem refazer essa
instalação**. Se a extração de frames passar a ser rotina, vale a pena decidir
entre instalar ffmpeg como ferramenta de sistema (`winget install
Gyan.FFmpeg`) ou assumir a dependência portátil de forma documentada.

Nota sobre este build: não suporta `-pattern_type glob`. As contact sheets são
montadas a partir de sequências numeradas (`f%02d.jpg`).
