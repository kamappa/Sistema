/* VAULT RESONANCE — o read model.
 * Missão 28 · Fase 1.
 *
 * Uma função, um resultado. Recebe o estado, devolve o que ressoa — ou a razão
 * por que nada ressoa.
 *
 * A ausência é um resultado de primeira classe, não um caso de erro. Hoje o
 * caminho normal é não haver pulsos, porque o produtor ainda não os persiste
 * (ver `vaultModel.ts`), e o Sistema tem de conseguir dizer isso por extenso
 * em vez de mostrar um Núcleo parado que parece avariado.
 */

import { VAULT_PULSES_KEY } from './vaultModel';
import type { VaultPulse, VaultResonance } from './vaultModel';
import { ATTRS } from '../../state/config.js';

/** Quantos pulsos se mostram. Acima disto o Núcleo deixa de se ler — é o mesmo
 *  raciocínio do teto de estrelas por domínio no Universo. */
const MAX_PULSES = 40;

/** Heurística de domínio a partir do caminho, e é declarada como heurística.
 *
 *  Só atribui quando o caminho contém o id do domínio como segmento — nada de
 *  correspondências parciais ou por palavra-chave. É deliberadamente pobre:
 *  uma heurística generosa acerta mais vezes e erra em silêncio, e um pulso com
 *  o destino errado no céu é pior do que um pulso sem destino. */
function dominioDoCaminho(path: string): string | undefined {
  const segmentos = path.toLowerCase().split(/[/\\]/);
  /* `ATTRS` é uma lista de OBJETOS, não de strings — o verificador apanhou-o
     antes de eu comparar um objeto com um segmento de caminho e obter sempre
     `undefined` em silêncio. */
  const ids: string[] = Array.isArray(ATTRS) ? ATTRS.map((a: any) => String(a && a.id ? a.id : a)) : [];
  return ids.find((id) => segmentos.includes(id));
}

export function readVault(S: Record<string, any> | null): VaultResonance {
  const vazio = (absence: string): VaultResonance => ({ pulses: [], notes: 0, latest: null, absence });

  if (!S) return vazio('Sem estado carregado.');

  const cru = (S as Record<string, unknown>)[VAULT_PULSES_KEY];
  if (!Array.isArray(cru)) {
    /* A frase mais importante deste ficheiro. Diz que o silêncio é esperado,
       diz de quem depende, e não culpa o Operador por não ter estudado. */
    return vazio(
      'O Vault ainda não envia pulsos. A ponte lê as notas para o Oráculo, mas '
      + 'não guarda quando cada uma mudou — por isso não há nada datado para o '
      + 'Núcleo receber. Não é falta de estudo.',
    );
  }
  if (!cru.length) return vazio('Nenhuma nota alterada no período conhecido.');

  const pulsos: VaultPulse[] = [];
  for (const p of cru as any[]) {
    /* Mesma regra do World Engine II: prova incompleta não entra. Um pulso sem
       caminho ou sem data não se pode mostrar como facto. */
    if (!p || typeof p.path !== 'string' || typeof p.at !== 'string') continue;
    if (!p.path.trim() || Number.isNaN(Date.parse(p.at))) continue;
    const d = dominioDoCaminho(p.path);
    pulsos.push({
      path: p.path,
      at: p.at,
      msg: typeof p.msg === 'string' ? p.msg : '',
      ...(d ? { domain: d as VaultPulse['domain'] } : {}),
    });
  }

  if (!pulsos.length) {
    return vazio('Chegaram registos, mas nenhum tinha caminho e data — sem isso não são prova.');
  }

  pulsos.sort((a, b) => (a.at < b.at ? 1 : -1));
  const cortados = pulsos.slice(0, MAX_PULSES);

  return {
    pulses: cortados,
    /* Notas distintas, não commits: dez commits na mesma nota são uma nota
       trabalhada e não dez conhecimentos. Contar commits inflacionaria o céu
       exatamente onde ele deve ser mais honesto. */
    notes: new Set(cortados.map((p) => p.path)).size,
    latest: cortados[0]?.at ?? null,
    absence: '',
  };
}
