# Estratégia de migração

## Método

Usar uma migração incremental paralela, tipo strangler pattern.

A versão atual continua operacional enquanto a nova frontend nasce numa branch
isolada.

```text
main
└── versão estável atual

migration/react-shell
└── nova frontend TypeScript + React + Vite
```

## Ordem de migração

1. Criar projeto React/Vite/TypeScript sem tocar na produção.
2. Ligar o mesmo Supabase.
3. Criar adaptador de leitura do `app_state`.
4. Reproduzir o estado do operador sem escrita.
5. Criar shell visual nova.
6. Migrar Radar e Oráculo em modo leitura.
7. Migrar missões e hábitos com testes de paridade.
8. Migrar treino, sono, calendário e recall.
9. Migrar universo/constelações.
10. Ativar escrita apenas depois da paridade.
11. Validar produção.
12. Trocar hosting apenas por decisão explícita.

## Regra de paridade

Para cada módulo migrado:

- mesmo utilizador;
- mesmos dados de Supabase;
- mesmo resultado lógico;
- nenhuma alteração silenciosa no JSON;
- reversões de XP continuam corretas;
- nenhum estado fabricado;
- UI nova pode mudar, lógica não.

## Adaptador legado

Criar uma camada temporária:

```text
legacy app_state
      ↓
normalizeLegacyState()
      ↓
typed domain models
      ↓
React UI
```

A UI React nunca deve depender diretamente da forma bruta do JSON legado em
todos os componentes.

## Escrita

A nova frontend começa em modo read-only.

A escrita entra módulo a módulo.

Cada escrita deve ter:

- contrato TypeScript;
- validação;
- teste;
- rollback;
- logs;
- comparação com o comportamento legado.

## O que não fazer

- Big bang rewrite.
- Reescrever Supabase ao mesmo tempo.
- Trocar auth, frontend e backend numa só missão.
- Migrar o Oráculo enquanto a shell ainda está instável.
- Remover a versão antiga antes de testes reais.
