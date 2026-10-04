/* Oráculo · sigilo de presença.
 * Missão 26 · Fase D.
 *
 * ORIGEM (REFERENCE-MAP.md): R01 — onda horizontal de luz violeta, com
 * filamentos internos, que respira sem nunca fechar em forma.
 *
 * PORQUE NÃO UMA ESFERA: a R19 é uma esfera de fitas e é a mais bonita das
 * duas — mas "esfera violeta a pulsar" é o retrato-robô do assistente de AI
 * genérico, e a missão proíbe exatamente isso. A R01 dá a mesma presença sem o
 * cliché: horizontal, sem centro, sem contorno. E encaixa numa faixa, que é
 * onde a presença ambiente já vive.
 *
 * O QUE O TORNA VERDADEIRO, e não decoração: a amplitude e o ritmo são função
 * do número de sinais REAIS. Zero sinais → linha quase plana a respirar a
 * 7,2 s. Vários sinais → mais amplitude e ciclo de 3,4 s. Não existe um estado
 * "bonito por defeito": o repouso é o mínimo de movimento que ainda se vê.
 *
 * REDUCED MOTION: o ciclo pára, a forma fica. É informação — quem não pode ver
 * movimento continua a distinguir os quatro estados.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  GRAMÁTICA 15 — A FORMA ANTES DA COR E DO RITMO. Fase 7Z.            ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ORIGEM: S05, aberta na análise das referências. Mostra três estados
 * cognitivos distinguidos por FORMA — ramificação, dois núcleos a puxar,
 * dispersão — todos brancos sobre preto, sem cor e sem ritmo a ajudar.
 *
 * O QUE ISTO CORRIGE. Até aqui os quatro estados deste sigilo diferiam em
 * amplitude, ritmo e cor. Cada um desses canais falha sozinho:
 *   · o RITMO desaparece inteiro em `prefers-reduced-motion`;
 *   · a COR falha para quem não distingue violeta de magenta — e era essa
 *     exatamente a diferença entre "tenho algo" e "há um prazo vencido";
 *   · a AMPLITUDE é um eixo só, e estava a carregar dois significados.
 *
 * Agora cada estado tem uma SILHUETA própria, legível parada e em cinzento:
 *
 *   repouso     ─  três ondas contínuas, amplitude mínima
 *   atento      ┼  as ondas ganham um NÓ: um traço vertical onde se cruzam
 *   alerta      ╌  o filamento portador PARTE-SE ao meio; fica um intervalo
 *   a processar ▪  os filamentos RETRAEM-SE para o centro; as pontas esvaziam
 *
 * A cor e o ritmo continuam lá. Deixaram é de ser o único canal.
 */

import './oracle-sigil.css';

export default function OracleSigil({
  signals,
  alert = false,
  busy = false,
}: {
  /** número de sinais reais. 0 = o Oráculo não tem nada a dizer. */
  signals: number;
  /** algum dos sinais é um alerta (prazo vencido). */
  alert?: boolean;
  /** O Oráculo está mesmo a processar (`ocBusy` do store). Missão 26 · 6B.
   *
   *  ORIGEM: R17 — anéis a CONTRAIR, e a passagem de difuso a discreto como
   *  sinal de conclusão. É o indicador de progresso que não é barra nem
   *  spinner, e a fase proíbe o spinner genérico por nome.
   *
   *  O que o distingue de "tenho algo para dizer": a onda deixa de respirar
   *  (que é um ciclo simétrico, presença) e passa a contrair de fora para
   *  dentro (que é assimétrico, e por isso lê-se como processo em curso). */
  busy?: boolean;
}) {
  // A amplitude satura aos 4. A diferença entre 4 e 9 sinais não é legível numa
  // faixa de 20px de altura, e fingir que é seria precisão falsa.
  const amp = Math.min(signals, 4) / 4;

  /* A precedência é a da urgência, e um estado de cada vez: processar tapa
     tudo porque é o que está a acontecer AGORA; o alerta vem antes de "tenho
     algo" porque um prazo vencido não espera. */
  const forma = busy ? 'processar' : alert ? 'alerta' : signals > 0 ? 'atento' : 'repouso';

  return (
    <span
      className="sys-oracle-sigil"
      data-forma={forma}
      data-attending={signals > 0 ? 'true' : 'false'}
      data-alert={alert ? 'true' : 'false'}
      data-busy={busy ? 'true' : 'false'}
      style={{ ['--sig-amp' as string]: amp.toFixed(3) }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 20" preserveAspectRatio="none" focusable="false">
        {/* Três filamentos com ondas DIFERENTES — não o mesmo path repetido.
            É a sobreposição de fases distintas que dá matéria a uma forma sem
            contorno, que é o que se lê na R01 por transparência.

            Cada path tem curvatura real: uma reta escalada em Y continua reta,
            e a amplitude não se veria. A onda vive na geometria; o transform só
            a amplifica. */}
        <path className="fil f1" d="M0 10 Q 8 5 16 10 T 32 10 T 48 10 T 64 10" />
        <path className="fil f2" d="M0 10 Q 10 15 21 10 T 43 10 T 64 10" />
        <path className="fil f3" d="M0 10 Q 6 7 13 10 T 26 10 T 39 10 T 52 10 T 64 10" />

        {/* O NÓ de "atento". Um traço vertical curto onde os filamentos se
            cruzam — a marca mais barata que se lê a 64×20 sem cor nenhuma.
            Só existe neste estado; não é um elemento escondido com opacidade
            zero, porque um elemento invisível continua a custar layout. */}
        {forma === 'atento' && <path className="sig-no" d="M32 4 L32 16" />}

        {/* O SINAL DE ALERTA é uma DESCONTINUIDADE, não uma cor. Duas barras
            curtas de cada lado do intervalo: a linha portadora parte-se, e uma
            linha partida lê-se como interrupção em qualquer paleta e sem
            movimento nenhum. */}
        {forma === 'alerta' && (
          <>
            <path className="sig-quebra" d="M26 10 L28 10" />
            <path className="sig-quebra" d="M36 10 L38 10" />
          </>
        )}
      </svg>
    </span>
  );
}
