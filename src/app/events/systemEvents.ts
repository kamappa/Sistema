/* SYSTEM EVENTS — fila de apresentação.
 * Missão 26 · Fase 6A.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  UM EVENTO DOMINANTE DE CADA VEZ. Os outros esperam na fila; nenhum  ║
 * ║  se perde e nenhum se anuncia duas vezes.                            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O QUE ISTO CORRIGE. O `toast` herdado do HUD é um elemento único no DOM:
 * `toast(a)` seguido de `toast(b)` escreve por cima e o primeiro desaparece
 * sem nunca ter sido lido. Fechar duas missões seguidas — que é o caso normal
 * de quem despacha a fila — anunciava uma. A lei diz que o Sistema mostra
 * provas; uma prova que se sobrescreve não é prova.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O EVENTO NASCE DEPOIS DA ESCRITA, NUNCA ANTES.                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * `emit()` só é chamado pelo store depois de `set()` e de a persistência local
 * confirmar. Celebrar antes de guardar seria o Sistema a afirmar uma coisa que
 * ainda podia falhar — e a lei é que nada visualiza progresso sem evidência
 * real.
 *
 * NOTA HONESTA sobre o que "confirmado" quer dizer aqui: confirmado é o estado
 * COMPROMETIDO E GUARDADO LOCALMENTE. A gravação na nuvem é debounced a 900ms
 * (`useStore.save`) e esperar por ela poria o feedback a um segundo de
 * distância do gesto, o que é pior para o Operador e não mais verdadeiro — o
 * dado já está seguro no dispositivo. Se a nuvem depois falhar, quem o diz é o
 * estado de sincronização, que existe desde a Fase I precisamente para isso.
 *
 * DEDUPLICAÇÃO. Cada evento traz um `dedupe`. O React 18 em StrictMode monta e
 * corre efeitos duas vezes em desenvolvimento, e um clique pode disparar dois
 * caminhos; sem chave, o Operador via o mesmo anúncio a dobrar. A chave é
 * derivada do facto (id + dia), não de um contador.
 */

export type SystemEventKind =
  | 'mission'   // missão erguida
  | 'pillar'    // pilar do dia fechado
  | 'habit'     // extra registado
  | 'levelup'
  | 'rank'
  | 'arc'       // marco ou aceitação de arco
  | 'warning';  // consequência negativa, e é o único que não celebra

export interface SystemEvent {
  /** Único por facto. Repetido = ignorado. */
  dedupe: string;
  kind: SystemEventKind;
  /** Uma linha. É o que se lê de relance. */
  title: string;
  /** O que aconteceu, em concreto. */
  subject: string;
  /** Leituras do evento: XP, streak, consequência. Já formatadas. */
  readings?: { label: string; value: string }[];
  /** Cor do domínio, quando o evento tem um. */
  color?: string;
  /** Id do domínio (ATTRS). O Universo usa-o para saber QUAL território
   *  recebeu a evidência — sem isto, o céu não sabia que algo aconteceu. */
  domain?: string;
  /** Quanto tempo fica. Omisso = calculado do comprimento do texto. */
  holdMs?: number;
}

type Listener = (queue: SystemEvent[]) => void;

const queue: SystemEvent[] = [];
const seen = new Set<string>();
const listeners = new Set<Listener>();

/** Teto da fila. Acima disto o Operador já não lê — descarta-se o mais antigo
 *  por anunciar em vez de acumular um comboio que nunca acaba. */
const MAX_QUEUE = 4;

function notify(): void {
  const snapshot = queue.slice();
  listeners.forEach((l) => l(snapshot));
}

export function emitSystemEvent(ev: SystemEvent): void {
  if (seen.has(ev.dedupe)) return;
  seen.add(ev.dedupe);
  queue.push(ev);
  if (queue.length > MAX_QUEUE) queue.shift();
  notify();
}

/* ── Encenação: a regra "só depois de guardar", tornada estrutural ─────
 *
 * A primeira versão confiava em cada sítio de chamada se lembrar de emitir
 * depois do `save()`. Não sobreviveu ao primeiro caso real: o `addXp` do motor
 * anuncia subidas de nível e é chamado a MEIO da ação, antes de qualquer
 * escrita — dez sítios de chamada, dez oportunidades de alguém se esquecer.
 *
 * Agora quem emite ENCENA, e a persistência é que decide. `commitStaged(true)`
 * publica; `commitStaged(false)` deita fora. Um evento nunca chega ao ecrã sem
 * o dado estar guardado, e isso deixa de depender da disciplina de quem
 * escreve o próximo componente.
 */
const staged: SystemEvent[] = [];

/* A CAUSA ANTES DA CONSEQUÊNCIA.
 *
 * O motor chama `addXp` a meio da ação, por isso a subida de nível fica
 * encenada ANTES da missão que a provocou. Medido: concluir uma missão que
 * fazia subir Ofício anunciava "Nível aumentado" primeiro e "Missão erguida"
 * atrás — o Sistema a dar a consequência antes de dizer o que aconteceu.
 *
 * A ordem é do significado, não da chamada. Baixo = mais cedo. */
const ORDER: Record<SystemEventKind, number> = {
  warning: 0,  // uma consequência negativa vem sempre à frente
  mission: 1,
  pillar: 1,
  habit: 1,
  arc: 2,
  levelup: 3,  // consequência do que está acima
  rank: 4,     // consequência da consequência
};

export function stageSystemEvent(ev: SystemEvent): void {
  staged.push(ev);
}

export function commitStagedEvents(saved: boolean): void {
  const batch = staged.splice(0, staged.length);
  if (!saved) return; // a escrita falhou: não aconteceu nada para anunciar
  // `sort` estável em todos os motores modernos: eventos do mesmo peso mantêm a
  // ordem por que foram encenados, que é a ordem por que aconteceram.
  batch.sort((a, b) => ORDER[a.kind] - ORDER[b.kind]).forEach(emitSystemEvent);
}

/** Marca o da frente como visto e passa ao seguinte. */
export function dismissSystemEvent(): void {
  queue.shift();
  notify();
}

export function subscribeSystemEvents(cb: Listener): () => void {
  listeners.add(cb);
  cb(queue.slice());
  return () => listeners.delete(cb);
}

/** Só para testes e para o arranque: esquece o que já foi anunciado.
 *  NÃO é chamado num reload normal — um evento não se repete por o Operador
 *  ter recarregado a página, porque nada de novo aconteceu. */
export function resetSystemEvents(): void {
  queue.length = 0;
  seen.clear();
  notify();
}

/** Ponte para o store, que é `.js` sem tipos e corre fora do React.
 *  Guardada como as outras primitivas de FX (`if (window.x)`), pelo mesmo
 *  contrato da Missão 25: o motor chama, e nunca depende de a casca existir. */
declare global {
  interface Window {
    /** Encena um evento. Só aparece quando `sysCommit(true)` o publicar. */
    sysEvent?: (ev: SystemEvent) => void;
    /** Chamado pelo `save()` do store com o resultado da escrita local. */
    sysCommit?: (saved: boolean) => void;
  }
}

export function installSystemEventBridge(): void {
  if (typeof window === 'undefined') return;
  window.sysEvent = stageSystemEvent;
  window.sysCommit = commitStagedEvents;
}
