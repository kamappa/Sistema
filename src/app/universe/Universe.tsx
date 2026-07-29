/* UNIVERSO — o campo é a experiência; a lista é o instrumento.
 * Missão 26 · Fase 6C.
 *
 * O diagnóstico do Daniel: "a lista de seis atributos domina, o gráfico é
 * pequeno e parece um chart convencional, alguns rótulos estão cortados, pouca
 * relação entre atributos, evidência, títulos e conquistas".
 *
 * A inversão é essa: o campo celeste passa a abrir a zona, e a lista detalhada
 * desce para instrumento secundário. **A lista não foi apagada** — é onde
 * estão os números exatos, e um campo sem números seria bonito e inútil.
 *
 * O radar hexagonal também fica, como leitura secundária de EQUILÍBRIO. É a
 * única forma que mostra desequilíbrio de relance, e o campo — que usa raio
 * fixo de propósito — não mostra isso.
 */

import CelestialField from './CelestialField';

export default function Universe({ S }: { S: Record<string, any> }) {
  return (
    <section className="panel uni-field" aria-label="Campo celeste">
      <CelestialField S={S} />
    </section>
  );
}
