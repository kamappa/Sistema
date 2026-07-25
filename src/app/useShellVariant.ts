/* Interruptor da shell experimental — Missão 26 · Fase 2.
 *
 * Contrato imposto pelo Daniel:
 *   - sem parâmetro           → HUD atual, pixel-idêntico à baseline;
 *   - ?shell=b1               → B1 · Consola;
 *   - ?shell=b2               → B2 · Órbita;
 *   - qualquer outro valor    → HUD atual, SEM ERRO.
 *
 * O parâmetro é estado de PREVIEW VISUAL e mais nada. Não toca no Supabase, no
 * app_state nem no store de domínio, e não persiste em lado nenhum: fecha-se o
 * separador e desaparece. É lido uma vez, no arranque — a shell não muda de
 * variação a meio da sessão, o que evitaria comparar coisas diferentes.
 */

/**
 * `instrumental` é a B2.1 — a direção oficial escolhida pelo Daniel a
 * 2026-07-25. B1 e B2 sobrevivem como referências de regressão visual e serão
 * removidas quando a instrumental passar todos os testes.
 */
export type ShellVariant = 'b1' | 'b2' | 'instrumental';

const VALID: readonly string[] = ['b1', 'b2', 'instrumental'];

export function readShellVariant(search: string = window.location.search): ShellVariant | null {
  let raw: string | null = null;
  try {
    raw = new URLSearchParams(search).get('shell');
  } catch {
    return null; // querystring malformada → HUD atual, sem erro
  }
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return VALID.includes(v) ? (v as ShellVariant) : null;
}

/** Lido uma vez no módulo: a variação é fixa durante a sessão. */
export const SHELL_VARIANT: ShellVariant | null = readShellVariant();
