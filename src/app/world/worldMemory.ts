/* WORLD ENGINE II — a memória do mundo.
 * Missão 27 · Fase 3.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  ONDE ISTO VIVE, E PORQUE NÃO VIVE NO `app_state`                    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O `app_state` é o estado do Operador: XP, hábitos, missões, títulos, datas de
 * nascimento de estrelas. É **evidência de uma vida**, sincronizada com o
 * Supabase e protegida por RLS.
 *
 * Isto não é isso. Isto é a memória de **quando a shell mostrou o quê** — um
 * detalhe de apresentação. Metê-lo no `app_state` seria:
 *
 *   · fazer um detalhe de apresentação viajar com evidência de vida;
 *   · obrigar a uma migração de schema (o `normalize.js` e o `v`) por causa de
 *     um mapa que pode ser perdido sem consequência nenhuma;
 *   · aumentar o que atravessa a rede em cada gravação, para sempre.
 *
 * Fica em `localStorage`, com chave própria.
 *
 * ── O CUSTO, DITO E NÃO ESCONDIDO ──
 *
 * A memória é **por dispositivo**. Ver um Governance Radar no telemóvel e a
 * seguir no computador mostra-o duas vezes, porque são duas memórias.
 *
 * Isso é aceitável e a razão importa: o mundo a falar duas vezes **não é uma
 * mentira** — é redundância. O cooldown existe para não repetir a mesma
 * cerimónia à mesma pessoa no mesmo sítio, e continua a fazer isso. Se um dia
 * a redundância entre dispositivos incomodar, a decisão inverte-se com o custo
 * à frente, que é o que este comentário serve para preservar.
 */

const CHAVE = 'sistema_world_v1';
/** Entradas mais velhas do que isto são lixo: nenhum cooldown do catálogo passa
 *  de um dia, e guardar memória de eventos que já não existem faz o ficheiro
 *  crescer para sempre sem nunca ser lido. */
const VALIDADE_H = 72;

export interface WorldMemoryEntry {
  /** Quando o evento foi dado como ativo pela última vez, em ISO. */
  at: string;
  /** A prova com que entrou. Guardada porque o `durationMin` precisa de a
   *  reapresentar: um evento que fica de pé depois de a regra deixar de ser
   *  verdade tem de continuar a dizer de onde veio, senão passa a ser um facto
   *  sem origem — que é precisamente o que a missão proíbe. */
  source: string;
  fact: string;
  date: string;
}

export type WorldMemory = Record<string, WorldMemoryEntry>;

/** Lê a memória. Nunca rebenta: um `localStorage` corrompido ou indisponível dá
 *  um mundo sem memória, que funciona — só não protege contra repetição. */
export function loadWorldMemory(agora: Date = new Date()): WorldMemory {
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return {};
    const obj = JSON.parse(cru);
    if (!obj || typeof obj !== 'object') return {};
    const out: WorldMemory = {};
    for (const [id, e] of Object.entries(obj as Record<string, any>)) {
      if (!e || typeof e.at !== 'string') continue;
      const t = Date.parse(e.at);
      if (Number.isNaN(t)) continue;
      if ((agora.getTime() - t) / 3600e3 > VALIDADE_H) continue;
      out[id] = {
        at: e.at,
        source: typeof e.source === 'string' ? e.source : '',
        fact: typeof e.fact === 'string' ? e.fact : '',
        date: typeof e.date === 'string' ? e.date : '',
      };
    }
    return out;
  } catch {
    return {};
  }
}

/** Regista os eventos ativos. Chamado DEPOIS de resolver, nunca durante — o
 *  resolvedor é puro e tem de continuar a ser. */
export function recordWorldMemory(
  ativos: readonly { id: string; source: string; fact: string; date: string }[],
  agora: Date = new Date(),
): void {
  try {
    const mem = loadWorldMemory(agora);
    const at = agora.toISOString();
    for (const a of ativos) mem[a.id] = { at, source: a.source, fact: a.fact, date: a.date };
    localStorage.setItem(CHAVE, JSON.stringify(mem));
  } catch {
    /* Sem espaço, em modo privado, ou sem `localStorage`: o mundo perde a
       memória e continua a funcionar. Falhar a gravar isto não pode impedir
       ninguém de usar o Sistema. */
  }
}

/** Só as datas, que é o que o resolvedor precisa para o cooldown. */
export function seenFrom(mem: WorldMemory): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, e] of Object.entries(mem)) out[id] = e.at;
  return out;
}
