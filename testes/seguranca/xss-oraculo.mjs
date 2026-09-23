// O texto do Oráculo nunca é HTML (Lote 2, 2026-09-23).
//
//   node testes/seguranca/xss-oraculo.mjs
//
// O Radar e o relatório semanal são escritos pelo modelo a partir de pesquisa na web.
// Uma página hostil nos resultados pode pôr HTML ou um URL javascript: no que o modelo
// devolve — e o Sistema mostrava esse texto com innerHTML. Este teste semeia itens do
// Radar, um relatório e uma missão hostis, abre a app como o operador (Supabase falso,
// rede fechada — testes/apoio/navegador-falso.mjs) e exige: nenhum script corre, nenhum
// elemento nasce do texto do modelo, nenhum link sai com um esquema que não seja http(s),
// e o texto aparece como texto. Inclui o caminho persistente: aceitar a missão do Radar
// guarda o título nos objetivos, que também têm de o mostrar como texto.
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { servirEstatico, lancarChrome, sleep } from '../fumo/apoio.mjs';
import { abrirComFalso, esperar } from '../apoio/navegador-falso.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SAIDA = fs.mkdtempSync(path.join(os.tmpdir(), 'sistema-seguranca-'));
const UID = '00000000-0000-4000-8000-00000000000a';
const resultados = [];
const verificar = (nome, ok, detalhe) => resultados.push({ nome, ok: !!ok, detalhe });

// Cada carga marca window.__xss com o seu nome se chegar a correr.
const carga = (nome) => `<img src=x onerror="window.__xss=(window.__xss||[]).concat('${nome}')">`;
const hoje = new Date().toISOString().slice(0, 10);
const agora = new Date().toISOString();
const RADAR = [{
  id: 'a0000000-0000-4000-8000-000000000001', user_id: UID, d: hoje, created_at: agora,
  title: 'Notícia ' + carga('radar-titulo'), source: 'Fonte ' + carga('radar-fonte'),
  url: "javascript:window.__xss=(window.__xss||[]).concat('radar-url')",
  summary: '<svg onload="window.__xss=(window.__xss||[]).concat(\'radar-resumo\')"></svg>resumo',
  relevance: carga('radar-relevancia') + 'relevância', area: 'cyber', impact: 'alto',
  missao: { t: 'Missão ' + carga('missao-titulo'), why: 'porque', area: 'saber', pri: 'P2', deadline: null },
}];
const RELATORIO = [{
  id: 'b0000000-0000-4000-8000-000000000001', user_id: UID, created_at: agora,
  report: {
    resumo: 'Resumo ' + carga('rel-resumo'), treino: carga('rel-treino'), sono: carga('rel-sono'),
    estudo: carga('rel-estudo'), alerta: carga('rel-alerta'),
    propostas: [{ t: carga('rel-proposta-t'), why: carga('rel-proposta-why') }],
    missoes_propostas: [{ t: carga('rel-missao-t'), why: carga('rel-missao-why'), area: 'saber', pri: 'P2', deadline: null }],
    recursos: [{ titulo: carga('rel-recurso-titulo'), url: "javascript:window.__xss=(window.__xss||[]).concat('rel-recurso-url')", fonte: carga('rel-recurso-fonte'), porque: carga('rel-recurso-porque') },
      { titulo: 'Recurso legítimo', url: 'https://exemplo.invalid/legitimo', fonte: 'EDPB', porque: 'teste' }],
    efemeride: carga('rel-efemeride'), profecia: carga('rel-profecia'), recompensa: carga('rel-recompensa'),
    titulo: carga('rel-titulo'), legado: carga('rel-legado'),
  },
}];

async function main() {
  const site = await servirEstatico(RAIZ);
  const chrome = await lancarChrome();
  let s;
  try {
    s = await abrirComFalso(chrome, site, 'xss', { semente: { radar_items: RADAR, oracle_reports: RELATORIO } });
    await esperar(s, `!!document.querySelector('#radar-news .rd-item') && !!document.querySelector('#oracle-rep .orc-sec')`, 10000);
    await s.avaliar(`document.body.click();true`); // salta a escrita animada do relatório
    await sleep(1500);

    const zonas = '#radar-news, #oracle-rep';
    verificar('radar e relatório desenharam (o teste não é vazio)',
      await s.avaliar(`!!document.querySelector('#radar-news .rd-item') && document.querySelectorAll('#oracle-rep .orc-sec').length >= 5`));
    verificar('nenhuma carga correu', await s.avaliar(`window.__xss === undefined`), JSON.stringify(await s.avaliar(`window.__xss||null`)));
    const nascidos = await s.avaliar(`[...document.querySelectorAll('${zonas}')].flatMap(z=>[...z.querySelectorAll('img:not(.rd-ico), svg, script, iframe, object, embed')]).map(e=>e.tagName)`);
    verificar('nenhum elemento nasceu do texto do modelo', Array.isArray(nascidos) && nascidos.length === 0, JSON.stringify(nascidos));
    const links = await s.avaliar(`[...document.querySelectorAll('#radar-news a[href], #oracle-rep a[href]')].map(a=>a.getAttribute('href'))`);
    verificar('nenhum link com esquema que não seja http(s)', Array.isArray(links) && links.every((h) => /^https?:\/\//i.test(h)), JSON.stringify(links));
    verificar('o recurso legítimo continua lá, com o seu link', Array.isArray(links) && links.includes('https://exemplo.invalid/legitimo'));
    const visivel = await s.avaliar(`document.getElementById('radar-news').innerText + '\\n' + document.getElementById('oracle-rep').innerText`);
    verificar('o texto hostil aparece como texto (escapado, não apagado)',
      visivel.includes('<img src=x onerror=') && visivel.includes('<svg onload='), visivel.slice(0, 160));

    // O caminho persistente: aceitar a missão do Radar grava o título nos objetivos.
    const aceite = await s.avaliar(`(()=>{const b=[...document.querySelectorAll('#radar-news button')].find(b=>/Aceitar missão do Radar/.test(b.textContent));if(!b)return false;b.click();return true})()`);
    await sleep(1200);
    const obj = await s.avaliar(`[...document.querySelectorAll('.obj-t')].map(e=>e.textContent)`);
    verificar('missão aceite: o título guardado aparece como texto nos objetivos',
      aceite && Array.isArray(obj) && obj.some((t) => t.includes('Missão <img src=x onerror=')), JSON.stringify(obj));
    verificar('missão aceite: nenhuma carga correu, nem nos objetivos', await s.avaliar(`window.__xss === undefined && !document.querySelector('.obj-t img')`),
      JSON.stringify(await s.avaliar(`window.__xss||null`)));
    await s.captura(path.join(SAIDA, 'xss.png'));
    verificar('rede: nenhuma resposta veio de fora do computador', s.respostasDeFora.length === 0, s.respostasDeFora.slice(0, 3).join(' | '));
  } catch (e) {
    verificar('o teste correu até ao fim', false, String((e && e.message) || e).split('\n')[0]);
  } finally {
    if (s) await s.fechar();
    await chrome.fechar();
    site.fechar();
  }
  const falhas = resultados.filter((r) => !r.ok);
  for (const r of resultados) console.log(`${r.ok ? '  ok ' : '  FALHA'} ${r.nome}${!r.ok && r.detalhe ? `  → ${r.detalhe}` : ''}`);
  console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações · capturas em ${SAIDA}`);
  process.exit(falhas.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(2); });
