# Estratégia Vercel

## Função

Vercel entra primeiro como ambiente de preview.

Não substitui imediatamente a produção.

## Configuração inicial

```text
GitHub Pages
└── versão estável

Vercel
└── branch React/Vite em preview
```

## Benefícios

- URL por branch;
- preview por pull request;
- build automático;
- logs;
- rollback;
- environment variables;
- comparação visual;
- testes fora do localhost.

## Fluxo

```text
branch
↓
push
↓
Vercel preview
↓
Playwright + Chrome
↓
Daniel aprova
↓
merge
```

## Produção

Só migrar produção depois de:

- paridade funcional;
- auth testado;
- Supabase testado;
- mobile aprovado;
- performance aprovada;
- rollback documentado;
- domínio preparado;
- aprovação explícita.

## Variáveis

Não colocar secrets no frontend.

A Vercel só deve receber variáveis adequadas ao browser, como a URL e anon key
do Supabase.

Segredos do Oráculo permanecem no Supabase Secrets.

## Resultado esperado

A Vercel melhora o processo de entrega.

Não é responsável pela qualidade visual.

A qualidade visual vem do design system, direção artística, implementação e
gates.
