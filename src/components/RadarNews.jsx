import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore.js';
import { RAREA } from '../state/config.js';
import { today, yday } from '../state/dates.js';
import { urlSegura } from '../lib/urlSegura';

// Radar Diário — Missão 25 · Fase 14. Porta renderNews (radar.js:19-44). Lê
// window.radar do store (radar_items do Supabase). Sem sessão → convite a
// entrar. Aceitar missão do Radar via triage. Scanline (panelScan) = fx.
//
// O ícone de cada item era um favicon pedido a google.com/s2/favicons — o que dava ao
// Google os domínios que o Radar mostra ao Daniel (incluindo as vagas da Vigia), sem
// necessidade nenhuma. Saiu (etapa 2 da publicação, 2026-09-27): a área passa a um ponto
// na cor local (RAREA), que mantém a informação sem pedir nada a terceiros. Um ponto de
// 8 px dentro da caixa escura do ícone antigo, escolhido pelo Daniel entre duas imagens;
// um disco cheio de 30 px repetia o chip da área e destoava da Órbita.

export default function RadarNews({ S }) {
  const { user, radar, acceptRadarMission } = useStore();
  const ref = useRef(null);
  // scanline 1×/sessão quando o Radar traz itens novos (<12h) — radar.js:40-43
  useEffect(() => {
    try {
      if (window.panelScan && !sessionStorage.getItem('scanRadar') &&
          radar.some((i) => i.created_at && Date.now() - new Date(i.created_at).getTime() < 12 * 3600000)) {
        sessionStorage.setItem('scanRadar', '1'); window.panelScan(ref.current);
      }
    } catch (e) {}
  }, [radar]);

  let body;
  if (!user) body = <div className="up-empty">Entra com a tua conta para o Radar sincronizar.</div>;
  else if (!radar.length) body = <div className="up-empty">Sem notícias ainda. O Radar corre todas as manhãs (~7h30) e escreve aqui.</div>;
  else {
    const byD = {}; radar.forEach((i) => { (byD[i.d] = byD[i.d] || []).push(i); });
    body = Object.keys(byD).sort().reverse().map((d) => {
      const lbl = d === today() ? 'Hoje' : d === yday() ? 'Ontem' : d.slice(8, 10) + '/' + d.slice(5, 7);
      return (
        <div key={d}>
          <div className="up-lbl">{lbl}</div>
          {byD[d].map((i) => {
            const a = RAREA[i.area] || RAREA.ai;
            const ct = i.created_at ? new Date(i.created_at) : null;
            const tm = ct ? String(ct.getHours()).padStart(2, '0') + ':' + String(ct.getMinutes()).padStart(2, '0') : '';
            const isNew = ct && (Date.now() - ct.getTime()) < 12 * 3600000;
            return (
              <div className={`rd-item ${i.impact === 'alto' ? 'rd-hot' : ''} ${i.area === 'vaga' ? 'rd-vaga' : ''}`} key={i.id}>
                <span className="rd-ico" style={{ display: 'grid', placeItems: 'center' }} title={a.l} aria-hidden="true">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.c, boxShadow: `0 0 6px ${a.c}` }} />
                </span>
                <div className="rd-b">
                  {i.impact === 'alto' && <div className="rd-hotlbl">⚡ ALTO IMPACTO</div>}
                  {urlSegura(i.url) ? <a className="rd-t" href={urlSegura(i.url)} target="_blank" rel="noopener">{i.title}</a> : <span className="rd-t">{i.title}</span>}{isNew && <span className="rd-new">NOVA</span>}
                  {i.summary && <div className="rd-s">{i.summary}</div>}
                  {i.relevance && <div className="rd-r">→ {i.relevance}</div>}
                  <div className="rd-src">{i.source || ''} <span className="wchip" style={{ borderColor: a.c, color: a.c, padding: '1px 7px', fontSize: 9, marginLeft: 6 }}>{a.l}</span>{tm ? <span className="rd-time"> · {tm}</span> : null}</div>
                  {(i.missao && i.missao.t) && <button className="mini warm" style={{ marginTop: 7 }} onClick={() => acceptRadarMission(i.id)}>{S.radarAccepted[i.id] ? '✓ Missão aceite' : '＋ Aceitar missão do Radar'}</button>}
                </div>
              </div>
            );
          })}
        </div>
      );
    });
  }

  return (
    <div className="panel reveal" style={{ animationDelay: '.07s' }} ref={ref}>
      <div className="ptitle"><b>Radar Diário</b> · o mundo, filtrado para ti</div>
      <div id="radar-news">{body}</div>
    </div>
  );
}
