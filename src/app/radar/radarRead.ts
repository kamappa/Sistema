/* RADAR — read model.
 * Missão 26 · Fase 6E.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  O ESTADO VAZIO DEIXA DE PARECER UMA PÁGINA POR ACABAR.              ║
 * ║  Um instrumento que não encontrou nada continua a ser um instrumento ║
 * ║  a funcionar — e tem de o mostrar: quando olhou, o que vigia, quando ║
 * ║  volta a olhar.                                                      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * NÃO INVENTA NOTÍCIAS, e não inventa métricas. Tudo o que este ficheiro
 * afirma sai de: os itens carregados, o `created_at` deles, a tabela `RAREA`
 * de categorias, e o estado de sincronização. O que não existe não aparece —
 * a "confiança" de um sinal, por exemplo, não está no domínio, e por isso não
 * há nenhuma barra de confiança inventada. O que existe é `impact`.
 */

import { RAREA as RAREA_ } from '../../state/config.js';

/* Mesmo motivo do `PROG` no TrainingSession: `config.js` não tem tipos e o TS
 * infere `RAREA` com chaves literais, o que impede indexá-lo com o `area` de
 * um item do Radar (que vem da base de dados e é `any`). O alias tipado
 * resolve sem tocar no domínio. */
const RAREA = RAREA_ as Record<string, { l: string; c: string }>;
import { today, yday, diffDays } from '../../state/dates.js';

export interface Signal {
  id: string;
  title: string;
  url?: string;
  summary?: string;
  /** Porque importa ao Daniel — vem do próprio item, escrito pelo Oráculo. */
  relevance?: string;
  source?: string;
  area: string;
  areaLabel: string;
  areaColor: string;
  high: boolean;
  d: string;
  time: string;
  /** < 12h desde que chegou. Mesma janela do componente antigo. */
  fresh: boolean;
  mission?: { t: string };
  accepted: boolean;
}

export interface RadarRead {
  /** Sinais agrupados por dia, do mais recente para o mais antigo. */
  days: { d: string; label: string; signals: Signal[] }[];
  total: number;
  highCount: number;
  /** ISO do item mais recente. `null` = nada nos últimos 7 dias. */
  lastAt: string | null;
  lastLabel: string | null;
  /** Categorias que o Radar vigia. Vem da tabela, não de uma lista à parte. */
  watching: { id: string; label: string; color: string }[];
  /** Quando é esperada a próxima passagem. É uma PREVISÃO, e diz-se. */
  nextPass: string;
}

const label = (d: string) =>
  d === today() ? 'Hoje' : d === yday() ? 'Ontem' : `${d.slice(8, 10)}/${d.slice(5, 7)}`;

/** O Radar corre de manhã (~07:30) — é a cadência documentada desde a Missão
 *  6. A frontend NÃO sabe o cron, por isso isto é apresentado como previsão e
 *  nunca como promessa. */
function nextPassLabel(): string {
  const now = new Date();
  const t = new Date(now);
  t.setHours(7, 30, 0, 0);
  if (t <= now) t.setDate(t.getDate() + 1);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  const amanha = t.getDate() !== now.getDate();
  return `${amanha ? 'amanhã' : 'hoje'} às ${hh}:${mm}`;
}

export function readRadar(radar: any[], S: Record<string, any> | null): RadarRead {
  const items = Array.isArray(radar) ? radar : [];

  const signals: Signal[] = items.map((i) => {
    const a = RAREA[i.area] || RAREA.ai;
    const ct = i.created_at ? new Date(i.created_at) : null;
    return {
      id: String(i.id),
      title: String(i.title ?? ''),
      url: i.url || undefined,
      summary: i.summary || undefined,
      relevance: i.relevance || undefined,
      source: i.source || undefined,
      area: i.area,
      areaLabel: a.l,
      areaColor: a.c,
      high: i.impact === 'alto',
      d: i.d,
      time: ct ? `${String(ct.getHours()).padStart(2, '0')}:${String(ct.getMinutes()).padStart(2, '0')}` : '',
      fresh: !!ct && Date.now() - ct.getTime() < 12 * 3600000,
      mission: i.missao && i.missao.t ? { t: i.missao.t } : undefined,
      accepted: !!S?.radarAccepted?.[i.id],
    };
  });

  const byDay = new Map<string, Signal[]>();
  signals.forEach((s) => {
    if (!byDay.has(s.d)) byDay.set(s.d, []);
    byDay.get(s.d)!.push(s);
  });

  const days = [...byDay.keys()]
    .sort()
    .reverse()
    .map((d) => ({
      d,
      label: label(d),
      // Alto impacto primeiro dentro do dia: é o único critério de ordem que o
      // domínio suporta, e ordenar por relevância inventada seria pior do que
      // não ordenar.
      signals: byDay.get(d)!.sort((a, b) => Number(b.high) - Number(a.high)),
    }));

  const withDate = items.filter((i) => i.created_at);
  const lastAt = withDate.length
    ? withDate.map((i) => i.created_at).sort().reverse()[0]
    : null;

  let lastLabel: string | null = null;
  if (lastAt) {
    const dt = new Date(lastAt);
    const dias = diffDays(String(lastAt).slice(0, 10), today());
    const hh = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
    lastLabel = dias === 0 ? `hoje às ${hh}` : dias === 1 ? `ontem às ${hh}` : `há ${dias} dias, às ${hh}`;
  }

  return {
    days,
    total: signals.length,
    highCount: signals.filter((s) => s.high).length,
    lastAt,
    lastLabel,
    watching: Object.entries(RAREA).map(([id, a]: [string, any]) => ({ id, label: a.l, color: a.c })),
    nextPass: nextPassLabel(),
  };
}
