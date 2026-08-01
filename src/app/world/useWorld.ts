/* WORLD ENGINE II — a ponte para a shell.
 * Missão 27 · Fase 2.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  A DECISÃO QUE ESTA FASE TINHA DE TOMAR                              ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O `WorldVisual` traz `accent`. A camada de arcos da Missão 26 já governa
 * `--arc-accent`. Duas fontes a discutir a mesma variável era o próximo defeito
 * óbvio, e a resposta muda o que o mundo parece.
 *
 * A resposta, e a razão:
 *
 *   **O arco é a estação. O evento é o momento. Um momento não reescreve uma
 *   estação — modula-a.**
 *
 * O arco dura meses e é a verdade de fundo. Um evento dura horas. Deixar um
 * Santuário de Chuva pintar o mundo de azul durante uma tarde apagaria o Summer
 * Arc que dura desde junho — e no dia seguinte o Operador não saberia dizer em
 * que estação está.
 *
 * Por isso: `--arc-accent` continua a ser do arco, intocado. O evento contribui
 * `--world-accent` e `--world-intensity`, que compõem POR CIMA.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  DUAS REGRAS QUE LIMITAM O ESTRAGO                                   ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * 1 · **Só o DOMINANTE pinta.** O `motion-regime.css` já declara "um ambiente
 *     dominante por zona" desde a Fase 6A. Cinco eventos ativos a contribuir
 *     cada um a sua cor dariam lama, e a lama não comunica nada.
 *
 * 2 · **Eventos `ambient` NÃO trazem cor — só intensidade.** É domingo todas as
 *     semanas e é de noite todos os dias; se o Domingo pintasse, o mundo mudava
 *     de cor um dia em cada sete por uma razão que não é notícia. Só `major` e
 *     `critical` ganham acento, e são precisamente os raros.
 *
 * O resultado é que, na maior parte dos dias, o mundo **não muda de cor** — e
 * quando muda, é porque aconteceu alguma coisa que merece.
 */

import { useEffect, useMemo, useState } from 'react';
import { readWorld } from './worldRead';
import { loadWorldMemory, recordWorldMemory, seenFrom } from './worldMemory';
import { PRIORITY_RANK } from './worldModel';
import type { WorldState } from './worldModel';

/** De quanto em quanto tempo o mundo se volta a resolver.
 *
 *  Cinco minutos: o evento mais rápido do catálogo é o Arquivo da Meia-Noite,
 *  que muda de estado à hora certa. Resolver a cada segundo seria gastar CPU
 *  para descobrir que nada mudou; resolver de hora a hora deixaria o Operador a
 *  ver a meia-noite chegar 40 minutos atrasada. */
const RESOLVE_MS = 5 * 60 * 1000;

export interface WorldBridge {
  world: WorldState;
  /** O que vai para o `style` da shell. Vazio quando não há nada a dizer — e
   *  vazio é o caso normal. */
  vars: Record<string, string | number>;
  /** O que vai para `data-world`. `undefined` quando não há dominante. */
  flag: string | undefined;
}

export function useWorld(
  S: Record<string, any> | null,
  radar?: readonly Record<string, any>[],
): WorldBridge {
  /* O relógio é estado: sem isto o mundo resolvia-se uma vez ao montar e ficava
     preso nesse instante até a shell voltar a renderizar por outra razão. */
  const [agora, setAgora] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setAgora(new Date()), RESOLVE_MS);
    /* Ao voltar de outro separador, o intervalo pode ter perdido horas. Resolver
       na visibilidade é o que impede o mundo de estar atrasado precisamente no
       momento em que alguém olha para ele. */
    const aoVoltar = () => { if (!document.hidden) setAgora(new Date()); };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => { window.clearInterval(t); document.removeEventListener('visibilitychange', aoVoltar); };
  }, []);

  /* A memória lê-se a cada resolução, não uma vez: outra aba pode ter escrito
     nela entretanto, e ler uma vez daria um cooldown que se esquece de si
     mesmo assim que a página fica aberta muito tempo. */
  const bridge = useMemo(() => {
    const memory = loadWorldMemory(agora);
    const world = readWorld({ S: S ?? {}, radar, seen: seenFrom(memory), memory }, agora);
    const dom = world.dominant;
    if (!dom) return { world, vars: {}, flag: undefined };

    const vars: Record<string, string | number> = {};
    /* A intensidade vem sempre — é o canal barato e reversível. */
    if (typeof dom.def.visual?.intensity === 'number') {
      vars['--world-intensity'] = dom.def.visual.intensity;
    }
    /* A cor só de `major` para cima. Ver a regra 2 no cabeçalho. */
    if (dom.def.visual?.accent && PRIORITY_RANK[dom.def.priority] >= PRIORITY_RANK.major) {
      vars['--world-accent'] = dom.def.visual.accent;
    }
    return { world, vars, flag: dom.def.visual?.flag };
  }, [S, radar, agora]);

  /* A GRAVAÇÃO É UM EFEITO, e nunca dentro do `useMemo`. Um `useMemo` com
     efeito colateral corre duas vezes em StrictMode e deixa de ser previsível
     — e aqui isso significaria gravar uma ocorrência que ninguém viu.

     Só se registam os eventos que ENTRARAM POR PROVA NOVA. Um evento a ser
     sustentado pela janela não renova a sua própria data: se renovasse, uma
     janela de 30 minutos ficava de pé para sempre, porque cada resolução a
     empurrava para a frente. */
  useEffect(() => {
    const novos = bridge.world.events
      .filter((e) => !bridge.world.aSustentar.includes(e.def.id))
      .map((e) => ({ id: e.def.id, ...e.evidence }));
    if (novos.length) recordWorldMemory(novos, new Date(bridge.world.at));
  }, [bridge.world]);

  return bridge;
}
