# SKILL-ROUTING — que ferramenta em que etapa

> Missão 26 · criado 2026-07-28. Define a cadeia de ferramentas do trabalho
> visual e, mais importante, os seus limites.

## Leis desta cadeia

Estas vêm antes de qualquer skill e não se negoceiam.

1. **Nenhuma skill é autoridade superior aos documentos do Sistema.** A ordem de
   precedência é a do `CLAUDE.md`. Uma skill vive ao nível de "implementação e
   outputs de ferramentas" — o último. Se uma skill contradisser a Constituição,
   o `CLAUDE.md`, o SPEC ou a direção visual, perde.
2. **Não invocar todas simultaneamente.** Uma etapa, uma skill. Várias vozes ao
   mesmo tempo sobre o mesmo ecrã produzem colagem, não direção.
3. **O Magic (21st.dev) não fornece resultado final.** Produz ponto de partida
   estrutural. Tudo o que sai dele passa pela direção visual antes de entrar.
4. **Referências não se copiam integralmente.** Extrai-se o princípio — a curva,
   a hierarquia, o comportamento da luz. Copiar composição, paleta e tipografia
   de uma referência é plágio e produz um produto que não é o Sistema.
5. **Jarvis é referência funcional, não identidade visual.** O que se aproveita
   é a relação: um interlocutor que antecipa, resume e executa. Não se imita o
   HUD azul-ciano nem os anéis holográficos.
6. **Skills de geração de imagem produzem referências, não código final.** O
   output delas entra em `local/`, nunca em `src/` nem em `public/`.

## A cadeia

```
Referências visuais
      ↓
image-to-code            interpretar a referência
      ↓
design-taste-frontend    direção e anti-slop
      ↓
frontend-design
+ ui-ux-pro-max          composição e hierarquia
      ↓
prototype                provar em pequeno, fora da app
      ↓
emil-design-eng          engenharia da interação
      ↓
animation-vocabulary     nomear o movimento
      ↓
find-animation-opportunities   onde falta movimento (read-only)
      ↓
IMPLEMENTAÇÃO            ← o gate humano é aqui
      ↓
review-animations        auditar o que ficou
      ↓
improve-animations       corrigir o que a auditoria apanhou
```

O único ponto onde código muda é **implementação**. Tudo acima é leitura,
direção e protótipo. Tudo abaixo é auditoria.

## Distribuição por etapa

### Referências e interpretação
`image-to-code` · `design-taste-frontend` · `frontend-design` · `ui-ux-pro-max`

Traduzem uma imagem ou vídeo em propriedades nomeáveis: hierarquia, ritmo,
material, densidade. Nesta etapa não se escreve CSS do produto.

### Prototipagem
`prototype` · `21st.dev Magic`

Provar uma ideia isolada antes de a pôr na shell. Um protótipo que vive fora da
app não arrisca a regressão de nenhuma zona.

### Motion
`emil-design-eng` · `animation-vocabulary` · `find-animation-opportunities`

`animation-vocabulary` serve para dar nome ao que se quer antes de o escrever —
sem vocabulário, "mais fluido" não é um requisito, é um desejo.
`find-animation-opportunities` é read-only por desenho: propõe, não implementa.

### Auditoria
`redesign-existing-projects` · `review-animations` · `improve-animations`

Correm **depois** da implementação. `redesign-existing-projects` audita padrões
genéricos de AI no que já existe — útil, desde que a "correção" proposta passe
pelo filtro abaixo.

### Polimento
`high-end-visual-design` · `apple-design` *(só quando aplicável)*

⚠️ **`high-end-visual-design` exige filtro obrigatório.** Revista a 2026-07-28,
colide de frente com o Sistema em quatro pontos:

| A skill manda | O Sistema é |
|---|---|
| Proíbe o Inter | Inter é a tipografia de corpo (`--sys-type-body`) |
| Tailwind (`w-1/2`, `px-4`, `rounded-full`, `md:`) | CSS puro com custom properties |
| Framer Motion (`whileInView`) | Por decidir na matriz de tecnologia |
| Botões em pilha redonda | Linguagem angular e chanfrada (`clip-path`) |

Aproveitável dela: os princípios de motion (massa e mola, cubic-beziers próprios
em vez de `ease-in-out`) e a proibição de `addEventListener('scroll')`.
Não aproveitável: tipografia, stack, forma dos controlos, "Apple-esque /
Linear-tier design language".

O `CLAUDE.md` já previa isto: *não migrar implicitamente para Tailwind só porque
aparece em referências ou skills*.

## Skills instaladas e não roteadas

Estão em disco mas fora desta cadeia. Não as invocar para a Missão 26 sem
decisão explícita:

- `brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile` — geram
  imagens; o ambiente atual não tem capacidade de geração de imagem, logo o
  custo de contexto não tem retorno.
- `gpt-taste` — impõe GSAP, estrutura AIDA e randomização; incompatível com uma
  aplicação de estado, e o Sistema não usa GSAP.
- `industrial-brutalist-ui`, `minimalist-ui`, `stitch-design-taste` — cada uma
  traz uma identidade fechada. O Sistema já tem a sua (Órbita Instrumental).
- `design-taste-frontend-v1` — mantida só por compatibilidade; usar a v2.
- `full-output-enforcement` — revista e benigna, mas é uma regra de output, não
  uma etapa de design.
- `apple-design` — no polimento, e só quando o problema for mesmo de refinamento
  de detalhe. Não para decidir a identidade.

## Gate final

Nenhuma proposta de skill entra por ter saído de uma skill. Antes de
implementar, responder:

1. Que princípio concreto se extraiu, em palavras próprias?
2. Que parte da referência se rejeita, e porquê?
3. Isto comunica estado, ou é decoração?
4. Sobrevive a `prefers-reduced-motion`?
5. Parece o Sistema, ou parece uma interface gerada por AI?
