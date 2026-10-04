import { fmt, today } from '../state/dates.js';

// Exportações client-side (nada sai do browser).
// exportStateFile — porto de exportState (hud.js:61-65): estado completo em JSON.
export function exportStateFile(S) {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sistema-estado-' + today() + '.json'; a.click();
}

// exportICS — porto de exportICS (hud.js:134-157, Missão 20): eventos do
// calendário + prazos de missões pendentes, all-day, RFC 5545 (CRLF, escaping).
// Devolve null se não houver nada (o toast é fx). Nada sai do browser.
export function exportICS(S) {
  const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const day = (d) => d.replace(/-/g, '');
  const nextDay = (d) => { const x = new Date(d); x.setDate(x.getDate() + 1); return fmt(x); };
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sistema//Operador//PT', 'CALSCALE:GREGORIAN'];
  const ev = (uid, d, titulo) => { L.push('BEGIN:VEVENT', 'UID:sistema-' + uid + '@kamappa.github.io', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + day(d), 'DTEND;VALUE=DATE:' + day(nextDay(d)), 'SUMMARY:' + esc(titulo), 'END:VEVENT'); };
  let n = 0;
  (S.events || []).filter((e) => e && e.date).forEach((e) => { ev(e.id, e.date, e.title); n++; });
  (S.objectives || []).filter((o) => o && o.deadline && o.status !== 'done').forEach((o) => { ev('m-' + o.id, o.deadline, '⚔ ' + o.title); n++; });
  L.push('END:VCALENDAR');
  if (!n) return null;
  const ics = L.join('\r\n') + '\r\n';
  const blob = new Blob([ics], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'sistema-' + today() + '.ics';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  return ics;
}
