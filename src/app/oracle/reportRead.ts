/* RELATÓRIO DO ORÁCULO — leitura por camadas.
 * Missão 26 · Fase 6B.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O RELATÓRIO JÁ CHEGA ESTRUTURADO. Não é preciso parser nenhum.      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Antes de escrever uma linha, inspecionei o formato real: `report.report` é um
 * objeto JSON com campos nomeados (`resumo`, `treino`, `sono`, `estudo`,
 * `alerta`, `propostas`, `missoes_propostas`, `recursos`, `efemeride`,
 * `profecia`, `recompensa`, `titulo`, `legado`). A Edge Function devolve-o
 * assim desde a Missão 6.
 *
 * Consequência, e é a razão de esta fase ser segura: NÃO há parser frágil
 * baseado em emojis, NÃO há `dangerouslySetInnerHTML`, NÃO se interpreta HTML
 * vindo do conteúdo. Tudo entra como texto em nós React, que escapam por
 * construção.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NADA SE PERDE. Campos que este ficheiro não conhece aparecem na     ║
 * ║  "Análise completa" com o nome da chave. Se a Edge Function          ║
 * ║  acrescentar um campo amanhã, ele APARECE em vez de desaparecer.     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * O problema que isto resolve era de apresentação, não de conteúdo: catorze
 * campos renderizados com a mesma largura, a mesma cor e a mesma densidade,
 * um por linha. Análise valiosa com forma de parede.
 */

import { today, diffDays } from '../../state/dates.js';
import { consecTrained, weekSessions } from '../../state/training.js';

export interface Proposal {
  t: string;
  why: string;
}

export interface Resource {
  url: string;
  titulo?: string;
  porque?: string;
  fonte?: string;
}

/** Um sinal de domínio: o que o Oráculo disse + o que o Sistema pode provar. */
export interface Signal {
  key: string;
  domain: string;
  /** A leitura do Oráculo, tal como veio. */
  text: string;
  /** Números locais que sustentam ou contradizem a leitura. Podem faltar. */
  evidence: { label: string; value: string }[];
}

export interface ReportRead {
  /** Data do relatório, formatada. */
  date: string;
  /** Camada 1 — o que se lê primeiro. */
  summary: string | null;
  alert: string | null;
  /** Camada 2 — sinais por domínio, com evidência local emparelhada. */
  signals: Signal[];
  /** Camada 4 — a leitura do Oráculo, separada dos factos. */
  interpretation: { key: string; label: string; text: string }[];
  /** Camada 5 — o que espera resposta. */
  proposals: Proposal[];
  /** Camada 6 — missões, aceitáveis. */
  missions: Proposal[];
  resources: Resource[];
  /** Camada 7 — tudo, incluindo o que este ficheiro não conhece. */
  raw: { key: string; label: string; value: string }[];
}

/** Rótulos dos campos conhecidos. O que não estiver aqui aparece com a própria
 *  chave — feio, mas visível, que é o que importa. */
const LABELS: Record<string, string> = {
  resumo: 'Resumo',
  treino: 'Treino',
  sono: 'Sono',
  estudo: 'Estudo',
  alerta: 'Alerta',
  efemeride: 'Efeméride',
  profecia: 'Profecia',
  recompensa: 'Recompensa sugerida',
  titulo: 'Título da semana',
  legado: 'Legado',
  propostas: 'Propostas',
  missoes_propostas: 'Missões propostas',
  recursos: 'Recursos',
};

/** A Edge Function às vezes devolve a string "null" em campos vazios. Tratá-la
 *  como texto punha a palavra "null" no ecrã — já acontecia no componente
 *  antigo, que a filtrava campo a campo. Aqui filtra-se uma vez. */
const clean = (v: unknown): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  if (!t || t === 'null' || t === 'undefined') return null;
  return t;
};

export function readReport(
  report: Record<string, any> | null,
  S: Record<string, any> | null
): ReportRead | null {
  if (!report) return null;
  const r = (report.report ?? {}) as Record<string, any>;
  const iso = String(report.created_at ?? '').slice(0, 10);
  const date = iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '';

  /* ── Camada 2 · sinais com evidência local ────────────────────────
   * O Oráculo diz; o Sistema prova. Emparelhar a frase com os números que já
   * existem é o que transforma uma afirmação numa leitura auditável — e é
   * também como se vê quando o modelo escreveu algo que os dados não suportam.
   */
  const signals: Signal[] = [];

  const treino = clean(r.treino);
  if (treino) {
    const ev: { label: string; value: string }[] = [];
    try {
      ev.push({ label: 'Sessões esta semana', value: String(weekSessions(S as any)) });
      ev.push({ label: 'Dias seguidos', value: String(consecTrained(S as any)) });
    } catch { /* sem histórico, o sinal fica sem prova e isso vê-se */ }
    signals.push({ key: 'treino', domain: 'Treino', text: treino, evidence: ev });
  }

  const sono = clean(r.sono);
  if (sono) {
    const ev: { label: string; value: string }[] = [];
    const logs = (S?.sleep?.logs ?? []) as { d: string; h: number }[];
    const last7 = logs.filter((l) => { const n = diffDays(l.d, today()); return n >= 0 && n < 7; });
    if (last7.length) {
      const avg = last7.reduce((s, l) => s + (l.h || 0), 0) / last7.length;
      ev.push({ label: 'Média 7d', value: Math.round(avg * 10) / 10 + 'h' });
      ev.push({ label: 'Noites registadas', value: `${last7.length} de 7` });
    }
    signals.push({ key: 'sono', domain: 'Sono', text: sono, evidence: ev });
  }

  const estudo = clean(r.estudo);
  if (estudo) {
    const ev: { label: string; value: string }[] = [];
    if (S?.studyStreak?.count) ev.push({ label: 'Streak de estudo', value: `${S.studyStreak.count} dias` });
    const answered = Object.keys(S?.recall ?? {}).length;
    if (answered) ev.push({ label: 'Perguntas em revisão', value: String(answered) });
    signals.push({ key: 'estudo', domain: 'Estudo', text: estudo, evidence: ev });
  }

  /* ── Camada 4 · interpretação, separada dos factos ─────────────────
   * Profecia e efeméride são a VOZ do Oráculo, não medições. Ficam num bloco
   * próprio para que ninguém as leia com o mesmo peso de "média 7,5h".
   */
  const interpretation: { key: string; label: string; text: string }[] = [];
  (['efemeride', 'profecia', 'recompensa', 'titulo', 'legado'] as const).forEach((k) => {
    const v = clean(r[k]);
    if (v) interpretation.push({ key: k, label: LABELS[k] ?? k, text: v });
  });

  const asProposals = (v: unknown): Proposal[] =>
    Array.isArray(v)
      ? v
          .map((p: any) => ({ t: clean(p?.t) ?? '', why: clean(p?.why) ?? '' }))
          .filter((p) => p.t)
      : [];

  const resources: Resource[] = Array.isArray(r.recursos)
    ? r.recursos
        .filter((x: any) => x && typeof x.url === 'string' && x.url)
        .map((x: any) => ({
          url: x.url,
          titulo: clean(x.titulo) ?? undefined,
          porque: clean(x.porque) ?? undefined,
          fonte: clean(x.fonte) ?? undefined,
        }))
    : [];

  /* ── Camada 7 · tudo, incluindo o desconhecido ─────────────────────
   * Percorre o objeto INTEIRO. Um campo novo da Edge Function aparece aqui com
   * a própria chave em vez de desaparecer sem ninguém dar por isso — que é o
   * que acontecia com o componente antigo, que listava campos à mão.
   */
  const raw: { key: string; label: string; value: string }[] = [];
  Object.keys(r).forEach((k) => {
    const v = r[k];
    if (v == null) return;
    if (typeof v === 'string') {
      const t = clean(v);
      if (t) raw.push({ key: k, label: LABELS[k] ?? k, value: t });
      return;
    }
    if (Array.isArray(v)) {
      if (!v.length) return;
      const lines = v
        .map((item: any) =>
          typeof item === 'string'
            ? item
            : [clean(item?.t), clean(item?.titulo), clean(item?.why), clean(item?.porque), clean(item?.url)]
                .filter(Boolean)
                .join(' — ')
        )
        .filter(Boolean);
      if (lines.length) raw.push({ key: k, label: LABELS[k] ?? k, value: lines.join('\n') });
      return;
    }
    if (typeof v === 'object') {
      raw.push({ key: k, label: LABELS[k] ?? k, value: JSON.stringify(v, null, 2) });
    }
  });

  return {
    date,
    summary: clean(r.resumo),
    alert: clean(r.alerta),
    signals,
    interpretation,
    proposals: asProposals(r.propostas),
    missions: asProposals(r.missoes_propostas),
    resources,
    raw,
  };
}
