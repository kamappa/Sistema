/* URLs QUE O ORÁCULO GUARDA — só http(s), no servidor (2026-09-27).
 *
 * O Radar e os recursos do relatório trazem URLs escritos pelo modelo a partir de
 * pesquisa na web. Uma página hostil nos resultados pode pôr lá `javascript:` ou
 * `data:`, e um frontend que os mostre como link executa-os ao clique. O filtro do
 * frontend existe (o Vanilla desde 23/09; a Órbita na etapa 2 da publicação), mas se
 * fosse a única barreira cada interface nova voltava a herdar o problema — e o
 * legacy/ continua lá. Por isso o servidor guarda só o que for http(s): o que chega à
 * base, e à nota do vault, já é seguro para qualquer cliente. Decisão do Daniel.
 *
 * O mesmo contrato do filtro do frontend: o endereço normalizado se for http(s)
 * absoluto; null em tudo o resto — `javascript:` disfarçado (maiúsculas, espaços,
 * tabulação e caracteres de controlo à frente, que o próprio parser de URL remove),
 * `data:`, `vbscript:`, relativos e o que nem é texto.
 */

export function urlSegura(u: unknown): string | null {
  if (typeof u !== "string") return null;
  let x: URL;
  try {
    x = new URL(u.trim());
  } catch {
    return null;
  }
  return x.protocol === "http:" || x.protocol === "https:" ? x.href : null;
}

/** Um recurso do relatório é um link: sem link seguro não há nada a seguir, e a nota do
 *  vault ficaria com um `[título]()` partido — por isso sai, em vez de ficar sem URL.
 *  Devolve quantos saíram, para o registo da função o dizer: nunca em silêncio. */
export function recursosSeguros(recursos: unknown): { recursos: Record<string, unknown>[]; recusados: number } {
  if (!Array.isArray(recursos)) return { recursos: [], recusados: 0 };
  const seguros: Record<string, unknown>[] = [];
  let recusados = 0;
  for (const r of recursos) {
    const url = r !== null && typeof r === "object" ? urlSegura((r as Record<string, unknown>).url) : null;
    if (url) seguros.push({ ...(r as Record<string, unknown>), url });
    else recusados++;
  }
  return { recursos: seguros, recusados };
}
