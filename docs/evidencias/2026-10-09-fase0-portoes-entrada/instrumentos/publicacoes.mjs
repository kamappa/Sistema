// Publicações (deployments), estados e check-runs de um commit, pela API pública do GitHub (sem token).
// Versão de 09/10: segue a paginação (rel="next") — a de 06/10 lia só a 1.ª página de 100 e o repositório já tem mais.
// Controlo embutido: as 8 publicações antigas do vercel[bot] têm de continuar visíveis.
// Uso: node publicacoes.mjs <sha-completo>
const sha = process.argv[2];
if (!sha || sha.length !== 40) { process.stdout.write('uso: node publicacoes.mjs <sha de 40 caracteres>\n'); process.exit(1); }
const api = 'https://api.github.com/repos/kamappa/Sistema';
const h = { accept: 'application/vnd.github+json', 'user-agent': 'sistema-verificacao' };
const escrever = (s) => process.stdout.write(s + '\n');
const pedir = async (url) => {
  const r = await fetch(url, { headers: h });
  if (!r.ok) { escrever(`API ${r.status} em ${url}`); process.exit(2); }
  return r;
};
let url = `${api}/deployments?per_page=100`, todas = [], paginas = 0;
while (url) {
  const r = await pedir(url);
  todas = todas.concat(await r.json()); paginas++;
  url = (r.headers.get('link') || '').match(/<([^>]+)>;\s*rel="next"/)?.[1];
  if (paginas > 10) { escrever('mais de 10 páginas: parar'); process.exit(2); }
}
const doCommit = todas.filter((x) => x.sha === sha);
const vercel = todas.filter((x) => x.creator.login === 'vercel[bot]');
const pages = todas.filter((x) => x.environment === 'github-pages');
escrever(`${todas.length} publicações lidas em ${paginas} página(s); github-pages ${pages.length}, a mais recente ${pages[0]?.sha.slice(0, 7)} ${pages[0]?.created_at}`);
escrever(`do commit ${sha.slice(0, 7)}: ${doCommit.length}`);
for (const x of doCommit) escrever(`   ${x.creator.login} | ${x.environment} | ${x.created_at}`);
escrever(`vercel[bot] (controlo, eram 8): ${vercel.length}, a última ${vercel.map((x) => x.created_at).sort().pop() || '—'}`);
const estados = await (await pedir(`${api}/commits/${sha}/status`)).json();
escrever(`estados do commit: ${estados.statuses.length}${estados.statuses.map((s) => ` [${s.context}: ${s.state}]`).join('')}`);
const checks = await (await pedir(`${api}/commits/${sha}/check-runs?per_page=50`)).json();
escrever(`check-runs: ${checks.check_runs.map((c) => `${c.name} (${c.app?.slug}) ${c.conclusion}`).join(' · ') || 'nenhum'}`);
