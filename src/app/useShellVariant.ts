/* Interruptor da shell — Missão 26.
 *
 * Contrato imposto pelo Daniel e ainda em vigor:
 *   - sem parâmetro    → HUD atual, pixel-idêntico à baseline;
 *   - ?shell=1         → Órbita Instrumental (a shell da Missão 26);
 *   - qualquer outro   → HUD atual, SEM ERRO.
 *
 * `b1` e `b2` foram as variações comparadas na Fase 2 e deixaram de existir
 * quando a instrumental passou os gates; `instrumental` mantém-se aceite para
 * não partir links guardados dessa fase. O HUD continua a ser o comportamento
 * por omissão até à validação final — essa troca é um gate à parte.
 *
 * O parâmetro é estado de PREVIEW VISUAL e mais nada: não toca no Supabase, no
 * app_state nem no store de domínio, e não persiste. É lido uma vez, no
 * arranque.
 */

const VALID: readonly string[] = ['1', 'instrumental'];

export function shellEnabled(search: string = window.location.search): boolean {
  let raw: string | null = null;
  try {
    raw = new URLSearchParams(search).get('shell');
  } catch {
    return false; // querystring malformada → HUD atual, sem erro
  }
  if (!raw) return false;
  return VALID.includes(raw.trim().toLowerCase());
}

/** Lido uma vez no módulo: a shell é fixa durante a sessão. */
export const SHELL_ON: boolean = shellEnabled();
