// Publicações (deployments), estados e check-runs de um commit, pela API pública do GitHub (sem token).
// Controlo embutido: as 8 publicações antigas do vercel[bot] têm de continuar visíveis — se a leitura não as vê,
// também não veria uma nova, e o «0 da Vercel» não vale nada.
// Uso: node publicacoes.mjs <sha-completo>
const sha = process.argv[2];
if (!sha || sha.length !== 40) { process.stdout.write('uso: node publicacoes.mjs <sha de 40 caracteres>\n'); process.exit(1); }
const api = 'https://api.github.com/repos/kamappa/Sistema';
const h = { accept: 'application/vnd.github+json', 'user-agent': 'sistema-verificacao' };
const ler = async (caminho) => {
  const r = await fetch(api + caminho, { headers: h });
  if (!r.ok) { process.stdout.write(`API ${r.status} em ${caminho}\n`); process.exit(2); }
  return r.json();
};
const escrever = (s) => process.stdout.write(s + '\n');

const todas = await ler('/deployments?per_page=100');
const doCommit = todas.filter((x) => x.sha === sha);
const vercel = todas.filter((x) => x.creator.login === 'vercel[bot]');
escrever(`${todas.length} publicações lidas`);
escrever(`do commit ${sha.slice(0, 7)}: ${doCommit.length}`);
for (const x of doCommit) escrever(`   ${x.creator.login} | ${x.environment} | ${x.created_at}`);
escrever(`vercel[bot] (controlo, eram 8): ${vercel.length}, a última ${vercel.map((x) => x.created_at).sort().pop() || '—'}`);

const estados = await ler(`/commits/${sha}/status`);
escrever(`estados do commit: ${estados.statuses.length}${estados.statuses.map((s) => ` [${s.context}: ${s.state}]`).join('')}`);
const checks = await ler(`/commits/${sha}/check-runs?per_page=50`);
escrever(`check-runs: ${checks.check_runs.map((c) => `${c.name} (${c.app?.slug}) ${c.conclusion}`).join(' · ') || 'nenhum'}`);
