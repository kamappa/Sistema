# Preservação de dados e lógica

## Invariantes

A migração não pode quebrar:

- Supabase Auth;
- RLS;
- `app_state`;
- `radar_items`;
- `oracle_reports`;
- Oráculo;
- Vault;
- XP;
- reversões;
- anti-farm;
- streaks;
- missões;
- constelações;
- títulos;
- relatórios.

## Estratégia

Criar modelos TypeScript para dados de domínio.

Exemplo conceptual:

```ts
type OperatorState = {
  level: number;
  totalXp: number;
  attributes: Record<DomainId, AttributeState>;
  missions: Mission[];
  world: WorldState;
};
```

## Normalização

Nunca espalhar leitura de JSON bruto.

Usar:

- schemas;
- defaults explícitos;
- migrations;
- `normalizeState`;
- versionamento;
- validação de runtime.

## Escrita segura

Cada ação de escrita deve:

1. validar estado anterior;
2. calcular novo estado;
3. preservar log;
4. persistir;
5. confirmar;
6. reverter em erro;
7. nunca mostrar sucesso antes de confirmação quando a operação é crítica.

## Compatibilidade

Durante a migração, a versão antiga e a nova devem poder ler o mesmo estado.

Não alterar schema sem:

- plano;
- migração;
- compatibilidade;
- rollback;
- aprovação.

## “O Sistema nunca mente”

A UI não deve:

- mostrar XP ainda não persistido;
- acender estrelas sem evidência;
- apresentar weather como real se for fallback;
- afirmar que uma automação ocorreu sem prova;
- criar progresso visual só para ficar bonito.
