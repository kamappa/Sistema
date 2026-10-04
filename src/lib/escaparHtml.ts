// escaparHtml: torna texto seguro para interpolar em innerHTML.
//
// O céu (src/stage/constellation.js) escreve rótulos e cartões com innerHTML e mete lá dois
// valores que vêm do estado guardado (app_state), não de constantes: o caminho escolhido
// (S.constellation.choices[domínio]) e a data de nascimento de uma estrela. O app_state é
// gravado pelos dois frontends e chega da nuvem; se for adulterado, esse texto corria como
// HTML. É o mesmo defeito do filtro de links — dados guardados tratados como código. Escapa
// os cinco caracteres que abrem HTML, com o `&` primeiro para não duplicar entidades; o
// mesmo conjunto que o escHTML do Vanilla (js/engine.js).
export function escaparHtml(v: unknown): string {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
