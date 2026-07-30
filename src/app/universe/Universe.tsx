/* UNIVERSO — o céu é a experiência; a lista é o instrumento.
 * Missão 26 · Fase 6C, segunda passagem.
 *
 * PRIMEIRA PASSAGEM (`CelestialField`, agora removido): um campo 2D com seis
 * discos e um núcleo ao centro. Resolvia o diagnóstico de então — a lista
 * dominava, o gráfico era pequeno — mas o veredicto seguinte foi mais duro e
 * correto: demasiado seguro, demasiado contido, pouco transformador. Era uma
 * ilustração do estado, não um sítio onde se entra.
 *
 * O QUE MUDA, e não é aparência:
 *   · deixa de haver vistas. Há UMA cena e uma câmara que se aproxima. O macro
 *     e o micro são a mesma realidade a aprofundar-se, não dois ecrãs;
 *   · o Núcleo está ao FUNDO, atrás do plano dos domínios. Chegar lá é
 *     atravessar o céu — por isso é um destino, e não um logótipo ao centro;
 *   · o Universo passa a saber que algo aconteceu: assina a fila de eventos e
 *     reage à evidência acabada de provar, no território certo.
 *
 * A lista detalhada, o radar e a evidência continuam na zona, abaixo. Um céu
 * sem números seria bonito e inútil, e a lei do projeto é mostrar provas.
 */

import UniverseScene from './UniverseScene';

export default function Universe({ S }: { S: Record<string, any> }) {
  return (
    <section className="panel uni-field" aria-label="Universo">
      <UniverseScene S={S} />
    </section>
  );
}
