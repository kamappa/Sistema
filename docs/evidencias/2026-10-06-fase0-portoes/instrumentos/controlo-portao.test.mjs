// CONTROLO DO PORTÃO (fase 0.1, 2026-10-06) — este teste FALHA DE PROPÓSITO.
// Só existe no ramo `orbita/fase0-portoes-controlo`, para provar duas coisas numa corrida real do GitHub:
//   1. com o workflow de antes, o build passa mesmo com um teste a falhar (o portão não existia);
//   2. com o workflow novo, o job `testes` falha e o build fica saltado.
// Nunca entra no `main`.
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('controlo do portão: este teste falha de propósito', () => {
  assert.fail('plantado para provar que o portão bloqueia o build');
});
