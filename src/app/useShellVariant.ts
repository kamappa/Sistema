/* Interruptor da interface — Missão 26.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A TROCA, 2026-08-02                                                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Decisão do Daniel, por palavras dele: *"não quero que shell seja a
 * condição"*. A Órbita Instrumental **passa a ser o Sistema**.
 *
 * O contrato anterior — HUD por omissão, Órbita atrás de `?shell=1` — cumpriu o
 * que tinha a cumprir: manteve a baseline intacta enquanto a shell era
 * construída, e permitiu comparar as duas lado a lado sem risco. Deixa de fazer
 * sentido quando a shell **é** a interface.
 *
 * Contrato novo:
 *
 *   - sem parâmetro    → **Órbita Instrumental**;
 *   - ?hud=1           → HUD anterior, como retorno;
 *   - ?shell=1         → Órbita, para não partir links guardados;
 *   - qualquer outro   → Órbita, SEM ERRO.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE O HUD NÃO FOI APAGADO                                  ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * "Preservar reversibilidade, fallbacks e rollback" é regra de ouro do projeto,
 * e é a mesma razão pela qual o Vanilla continua em `legacy/`.
 *
 * Isto **não é uma junção das duas interfaces** — nunca se vê as duas ao mesmo
 * tempo, e nada foi misturado. É um retorno. Um retorno que não se usa é
 * barato; um retorno que falta no dia em que é preciso custa a sessão inteira.
 *
 * Se o HUD passar meses sem ser aberto, apaga-se — mas isso decide-se com essa
 * evidência à frente, não hoje.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O QUE ESTA TROCA ARRASTA CONSIGO                                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O `start_url` do manifesto é `/Sistema/`, sem parâmetro. Não muda **nem tem
 * de mudar**: com a inversão, essa mesma URL passa a abrir a Órbita. A app
 * instalada acompanha a decisão sem se lhe tocar — que era exactamente a
 * objeção do Daniel quando recusou que eu lhe mexesse.
 *
 * O parâmetro continua a ser estado de PREVIEW VISUAL: não toca no Supabase, no
 * `app_state` nem no store de domínio, e não persiste. É lido uma vez, no
 * arranque, e a interface é fixa durante a sessão.
 */

/** Valores que ligam a Órbita explicitamente. Mantidos para não partir links
 *  guardados das fases de comparação — `b1` e `b2` deixaram de existir quando a
 *  instrumental passou os gates. */
const SHELL_VALID: readonly string[] = ['1', 'instrumental'];
/** O que devolve ao HUD anterior. */
const HUD_VALID: readonly string[] = ['1', 'legacy', 'antigo'];

function param(nome: string, search: string): string | null {
  try {
    return new URLSearchParams(search).get(nome);
  } catch {
    return null; // querystring malformada → comportamento por omissão, sem erro
  }
}

/** O HUD anterior, pedido explicitamente. */
export function hudEnabled(search: string = window.location.search): boolean {
  const raw = param('hud', search);
  if (!raw) return false;
  return HUD_VALID.includes(raw.trim().toLowerCase());
}

/**
 * A Órbita — agora por omissão.
 *
 * Devolve `false` **apenas** quando o HUD é pedido por nome. Um `?shell=0` não
 * desliga a Órbita: desligar a interface principal com um valor falsy de um
 * parâmetro que já não a governa seria uma armadilha para quem tivesse esse
 * link guardado de uma fase antiga.
 */
export function shellEnabled(search: string = window.location.search): boolean {
  return !hudEnabled(search);
}

/** Só confirma o pedido explícito da Órbita — que já é o comportamento por
 *  omissão. Existe para os testes poderem distinguir "veio por omissão" de
 *  "veio pedida", que são coisas diferentes de verificar. */
export function shellPedidaExplicitamente(search: string = window.location.search): boolean {
  const raw = param('shell', search);
  if (!raw) return false;
  return SHELL_VALID.includes(raw.trim().toLowerCase());
}

/** Lidos uma vez no módulo: a interface é fixa durante a sessão. */
export const SHELL_ON: boolean = shellEnabled();
export const HUD_ON: boolean = hudEnabled();
