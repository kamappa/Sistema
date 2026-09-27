// urlSegura: o único caminho por onde um endereço vindo de dados vira link no frontend.
//
// O Radar e o relatório do Oráculo trazem URLs escritos por um modelo a partir da web. Um
// `javascript:` num href corre script na página do Sistema — com a sessão do Supabase — ao
// primeiro clique, e o React 18 não o bloqueia (só avisa em desenvolvimento). O servidor já
// filtra o que grava (supabase/functions/oraculo/url-segura.ts), mas o frontend não pode
// confiar só nisso: os itens antigos já estão na base sem filtro, e qualquer interface nova
// herdaria o problema. Mesmo contrato do servidor: o endereço normalizado se for http(s)
// absoluto, null em tudo o resto — `javascript:` disfarçado (maiúsculas, espaços, tabulação
// e caracteres de controlo à frente, que o parser de URL remove), `data:`, `vbscript:`,
// relativos e o que nem é texto.
export function urlSegura(u: unknown): string | null {
  if (typeof u !== 'string') return null;
  let x: URL;
  try {
    x = new URL(u.trim());
  } catch {
    return null;
  }
  return x.protocol === 'http:' || x.protocol === 'https:' ? x.href : null;
}
