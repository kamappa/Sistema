/* CONCORDÂNCIA — o utilitário que devia ter existido à terceira vez.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  PORQUE É QUE ISTO É UM FICHEIRO E NÃO UMA LINHA REPETIDA            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Três vezes, com semanas de intervalo:
 *
 *   1. `OperatorSigil` dizia "1 dias" no melhor streak — corrigido na M26;
 *   2. `explainAi` dizia "1 tocam dados pessoais" — corrigido na M29, com um
 *      comentário a dizer que não se devia repetir o descuido;
 *   3. `explainVigia` dizia "1 URLs repetidos", "1 pares", "1 vagas", "1 itens"
 *      — escrito **imediatamente a seguir** a esse comentário.
 *
 * A terceira prova que o problema não é distração: é que o esforço de escrever
 * a ternária certa é maior do que o esforço de não a escrever, e por isso perde
 * sempre no fim de um ficheiro. Um utilitário inverte isso.
 *
 * Isto interessa por uma razão que não é estética. O Sistema fala com um
 * Operador que audita para viver; "1 vagas sem missão" é a frase de um programa
 * que não se releu. E a lei do projeto diz que nenhum estado exibido pode
 * contradizer o estado guardado — uma contagem que não concorda com o número
 * que a acompanha é a forma mais pequena e mais frequente dessa contradição.
 */

/** Escolhe entre singular e plural. `n === 1` é a única condição — zero leva
 *  plural em português ("0 vagas"), e é por isso que não se testa `n > 1`. */
export function pl(n: number, um: string, muitos: string): string {
  return n === 1 ? um : muitos;
}

/** O número e a palavra já concordados: `cont(1, 'vaga', 'vagas')` → "1 vaga". */
export function cont(n: number, um: string, muitos: string): string {
  return `${n} ${pl(n, um, muitos)}`;
}

/** Dias, que é o caso mais frequente de todos. */
export function dias(n: number): string {
  return cont(n, 'dia', 'dias');
}
