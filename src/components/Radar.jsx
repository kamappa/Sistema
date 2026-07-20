import { ATTRS, need, rankOf, overallLevel } from '../state/config.js';

// Núcleo · radar hexagonal — Missão 25 · Fase 4. Porta renderRadar de
// engine.js:173-190 (geração idêntica do SVG); usa dangerouslySetInnerHTML para
// preservar a saída byte-a-byte. A escala (axisMax) sobe com o rank atual.
function radarSVG(S, rank) {
  const cx = 160, cy = 160, R = 112, n = ATTRS.length;
  const vals = ATTRS.map((a) => S.attrs[a.id].level + S.attrs[a.id].xp / need(S.attrs[a.id].level));
  let axisMax = (rank.max >= 9999) ? Math.ceil(Math.max(...vals)) + 2 : rank.max + 1;
  axisMax = Math.max(axisMax, Math.ceil(Math.max(...vals))); if (axisMax < 2) axisMax = 2;
  const pt = (i, rr) => { const ang = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]; };
  let svg = '';
  [.25, .5, .75, 1].forEach((g) => { svg += `<polygon points="${ATTRS.map((_, i) => pt(i, R * g).join(',')).join(' ')}" fill="none" stroke="rgba(167,139,250,.12)" stroke-width="1"/>`; });
  ATTRS.forEach((a, i) => {
    const [x, y] = pt(i, R); svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(167,139,250,.1)"/>`;
    const [lx, ly] = pt(i, R + 22); const anc = Math.abs(lx - cx) < 8 ? 'middle' : (lx < cx ? 'end' : 'start');
    svg += `<text x="${lx}" y="${ly + 4}" text-anchor="${anc}" fill="${a.color}" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700">${a.name}</text>`;
  });
  const shape = vals.map((v, i) => pt(i, R * Math.min(1, v / axisMax)).join(',')).join(' ');
  svg += `<polygon points="${shape}" fill="rgba(167,139,250,.15)" stroke="#a78bfa" stroke-width="2" style="filter:drop-shadow(0 0 6px rgba(167,139,250,.55))"/>`;
  vals.forEach((v, i) => { const [x, y] = pt(i, R * Math.min(1, v / axisMax)); svg += `<circle cx="${x}" cy="${y}" r="3.5" fill="${ATTRS[i].color}"/>`; });
  svg += `<text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${rank.color}" font-family="Rajdhani" font-weight="700" font-size="15">${rank.l}</text>`;
  return svg;
}

export default function Radar({ S }) {
  const rank = rankOf(overallLevel(S));
  return (
    <div className="panel reveal" style={{ animationDelay: '.15s' }}>
      <div className="ptitle"><b>Núcleo</b> · Equilíbrio</div>
      <div className="radar-wrap">
        <svg id="radar" width="320" height="320" viewBox="0 0 320 320" dangerouslySetInnerHTML={{ __html: radarSVG(S, rank) }} />
        <div className="radar-note">A escala sobe com o teu rank. Hexágono pequeno = início; cresce à medida que evoluis. Ponta isolada = desequilíbrio.</div>
      </div>
    </div>
  );
}
