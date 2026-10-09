// Espera pela corrida do «Deploy React to Pages» de um commit num ramo e mostra os jobs e os passos.
// Só a API pública do GitHub, sem token (60 pedidos/hora): no máximo 31 pedidos.
// Uso: node esperar-corrida.mjs <sha-curto> <ramo>
const [sha, ramo] = process.argv.slice(2);
if (!sha || !ramo) { process.stdout.write('uso: node esperar-corrida.mjs <sha-curto> <ramo>\n'); process.exit(1); }
const base = 'https://api.github.com/repos/kamappa/Sistema/actions';
const h = { accept: 'application/vnd.github+json', 'user-agent': 'sistema-verificacao' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const escrever = (s) => process.stdout.write(s + '\n');

let corrida;
for (let i = 0; i < 30; i++) {
  const r = await fetch(`${base}/runs?branch=${encodeURIComponent(ramo)}&per_page=10`, { headers: h });
  if (!r.ok) { escrever(`API ${r.status} (restam ${r.headers.get('x-ratelimit-remaining')})`); process.exit(2); }
  const doCommit = (await r.json()).workflow_runs
    .filter((x) => x.head_sha.startsWith(sha) && x.name === 'Deploy React to Pages');
  if (doCommit.length > 1) escrever(`ATENÇÃO: ${doCommit.length} corridas para ${sha}`);
  corrida = doCommit[0];
  escrever(`${new Date().toISOString()} ${corrida ? `${corrida.id} ${corrida.status} ${corrida.conclusion}` : 'ainda sem corrida'}`
    + ` (restam ${r.headers.get('x-ratelimit-remaining')} pedidos)`);
  if (corrida && corrida.status === 'completed') break;
  await sleep(30000);
}
if (!corrida || corrida.status !== 'completed') { escrever('NÃO TERMINOU no tempo da espera (15 min)'); process.exit(3); }

const rj = await fetch(`${base}/runs/${corrida.id}/jobs`, { headers: h });
if (!rj.ok) { escrever(`API dos jobs ${rj.status}`); process.exit(2); }
for (const job of (await rj.json()).jobs) {
  escrever(`job ${job.name} (${job.id}): ${job.status} ${job.conclusion}`);
  for (const s of job.steps || []) escrever(`   ${s.number}. ${s.name}: ${s.conclusion}`);
}
escrever(`corrida ${corrida.id} (${corrida.head_sha.slice(0, 7)}): ${corrida.conclusion} — ${corrida.html_url}`);
