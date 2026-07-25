# Auditoria, explicabilidade e confiança

## Regra

Toda a ação relevante deve ser explicável.

## Pergunta universal

> Porque fizeste isto?

O Oráculo deve conseguir responder com:

- intenção;
- regra;
- dados;
- agente;
- decisão;
- confiança;
- custo;
- resultado.

## Decision Record

Cada decisão relevante deve guardar:

- ID;
- timestamp;
- contexto;
- objetivo;
- alternativas;
- escolha;
- razão;
- risco;
- aprovação;
- resultado.

## Action Ledger

Cada execução deve guardar:

- ação;
- executor;
- alvo;
- permissões;
- inputs;
- outputs;
- duração;
- custo;
- estado;
- erro;
- rollback.

## Explicabilidade por camadas

### Curta

> “Pausei o workflow porque excedeu o limite de custo.”

### Detalhada

Mostra:

- limite;
- custo;
- tendência;
- política;
- logs.

## Confiança

O Oráculo deve expressar confiança quando relevante.

Exemplo:

- alta;
- média;
- baixa;
- desconhecida.

## Reparação de confiança

Quando erra:

1. admite;
2. explica;
3. corrige;
4. reverte quando possível;
5. atualiza proteção;
6. regista aprendizagem.

## Não utilizar

- justificações inventadas;
- explicações vagas;
- “a IA decidiu”;
- ocultação de incerteza.
