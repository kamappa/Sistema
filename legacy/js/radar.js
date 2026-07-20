/* ===== RADAR & ORÁCULO =====
   Dados do servidor (radar_items, oracle_reports), notícias, relatório,
   aceitar missões propostas. Extraído do index.html — Missão 2 fase 4d. */

/* ===== RADAR & ORÁCULO (dados do servidor) ===== */
let RADAR=[],REPORT=null;
async function loadOracleData(){
  if(!USER||!sb)return;
  try{
    const since=new Date();since.setDate(since.getDate()-7);
    const{data:r}=await sb.from('radar_items').select('*').gte('d',fmt(since)).order('created_at',{ascending:false}).limit(48);
    RADAR=r||[];
    const{data:rep}=await sb.from('oracle_reports').select('report,created_at').order('created_at',{ascending:false}).limit(1);
    REPORT=(rep&&rep[0])||null;
    renderNews();renderOracleRep();
  }catch(e){}
}
function favicon(u){try{return 'https://www.google.com/s2/favicons?sz=64&domain='+new URL(u).hostname}catch(e){return ''}}
function renderNews(){
  const el=document.getElementById('radar-news');if(!el)return;
  if(!USER){el.innerHTML='<div class="up-empty">Entra com a tua conta para o Radar sincronizar.</div>';return;}
  if(!RADAR.length){el.innerHTML='<div class="up-empty">Sem notícias ainda. O Radar corre todas as manhãs (~7h30) e escreve aqui.</div>';return;}
  const byD={};RADAR.forEach(i=>{(byD[i.d]=byD[i.d]||[]).push(i)});
  el.innerHTML=Object.keys(byD).sort().reverse().map(d=>{
    const lbl=d===today()?'Hoje':d===yday()?'Ontem':d.slice(8,10)+'/'+d.slice(5,7);
    return `<div class="up-lbl">${lbl}</div>`+byD[d].map(i=>{const a=RAREA[i.area]||RAREA.ai;const ic=favicon(i.url);
      const ct=i.created_at?new Date(i.created_at):null;
      const tm=ct?String(ct.getHours()).padStart(2,'0')+':'+String(ct.getMinutes()).padStart(2,'0'):'';
      const isNew=ct&&(Date.now()-ct.getTime())<12*3600000;
      return `<div class="rd-item ${i.impact==='alto'?'rd-hot':''} ${i.area==='vaga'?'rd-vaga':''}">
        ${ic?`<img class="rd-ico" src="${ic}" alt="" loading="lazy" onerror="this.style.display='none'">`:''}
        <div class="rd-b">
          ${i.impact==='alto'?'<div class="rd-hotlbl">⚡ ALTO IMPACTO</div>':''}
          ${i.url?`<a class="rd-t" href="${i.url}" target="_blank" rel="noopener">${i.title}</a>`:`<span class="rd-t">${i.title}</span>`}${isNew?'<span class="rd-new">NOVA</span>':''}
          ${i.summary?`<div class="rd-s">${i.summary}</div>`:''}
          ${i.relevance?`<div class="rd-r">→ ${i.relevance}</div>`:''}
          <div class="rd-src">${i.source||''} <span class="wchip" style="border-color:${a.c};color:${a.c};padding:1px 7px;font-size:9px;margin-left:6px">${a.l}</span>${tm?` <span class="rd-time">· ${tm}</span>`:''}</div>
          ${(i.missao&&i.missao.t)?`<button class="mini warm" style="margin-top:7px" onclick="acceptRadarMission('${i.id}',event)">${S.radarAccepted[i.id]?'✓ Missão aceite':'＋ Aceitar missão do Radar'}</button>`:''}
        </div></div>`}).join('')}).join('');
  /* scanline 1x/sessão quando o Radar traz itens novos (<12h) */
  try{if(window.panelScan&&!sessionStorage.getItem('scanRadar')
    &&RADAR.some(i=>i.created_at&&Date.now()-new Date(i.created_at).getTime()<12*3600000)){
    sessionStorage.setItem('scanRadar','1');panelScan(el);}}catch(e){}
}
function renderOracleRep(){
  const el=document.getElementById('oracle-rep');if(!el)return;
  if(!USER){el.innerHTML='<div class="up-empty">Entra com a tua conta para veres os relatórios.</div>';return;}
  if(!REPORT){el.innerHTML='<div class="up-empty">O primeiro relatório chega no domingo à noite — o Oráculo lê a tua semana e escreve aqui.</div>';return;}
  const r=REPORT.report||{};const dt=(REPORT.created_at||'').slice(0,10);
  const prop=(r.propostas||[]).map(p=>`<div class="rd-item"><span style="flex:none">🜂</span><div class="rd-b"><div class="rd-t">${p.t||''}</div><div class="rd-s">${p.why||''}</div></div></div>`).join('');
  const mp=(r.missoes_propostas||[]).map((m,i)=>`<div class="rd-item"><span style="flex:none">⚔️</span><div class="rd-b"><div class="rd-t">${m.t||''}</div><div class="rd-s">${m.why||''}</div></div><button class="mini" onclick="acceptOracleMission(${i},event)">＋ Aceitar</button></div>`).join('');
  const rec=(r.recursos||[]).filter(x=>x&&x.url).map(x=>`<div class="rd-item"><span style="flex:none">📖</span><div class="rd-b"><a class="rd-t" href="${x.url}" target="_blank" rel="noopener">${x.titulo||x.url}</a><div class="rd-s">${x.porque||''}</div><div class="rd-src">${x.fonte||''}</div></div></div>`).join('');
  el.innerHTML=`
    <div class="tr-stats"><span class="wchip gold">📜 Relatório de ${dt.slice(8,10)}/${dt.slice(5,7)}</span></div>
    ${r.resumo?`<div class="orc-sec">${r.resumo}</div>`:''}
    ${r.treino?`<div class="orc-sec"><b>🏋️ Treino:</b> ${r.treino}</div>`:''}
    ${r.sono?`<div class="orc-sec"><b>😴 Sono:</b> ${r.sono}</div>`:''}
    ${r.estudo?`<div class="orc-sec"><b>📚 Estudo (vault):</b> ${r.estudo}</div>`:''}
    ${r.alerta&&r.alerta!=='null'?`<div class="orc-sec" style="color:#fca5a5"><b>⚠ Alerta:</b> ${r.alerta}</div>`:''}
    ${prop?`<div class="up-lbl">Propostas do Oráculo</div>${prop}`:''}
    ${mp?`<div class="up-lbl">Missões propostas</div>${mp}`:''}
    ${rec?`<div class="up-lbl">Para complementar o estudo</div>${rec}`:''}
    ${r.efemeride&&r.efemeride!=='null'?`<div class="orc-sec"><b>🕯 Efeméride:</b> ${r.efemeride}</div>`:''}
    ${r.profecia&&r.profecia!=='null'?`<div class="orc-sec orc-prof"><b>🔮 Profecia:</b> ${r.profecia}</div>`:''}
    ${r.recompensa?`<div class="orc-sec"><b>🎁 Recompensa sugerida:</b> ${r.recompensa}</div>`:''}
    ${r.titulo?`<div class="orc-sec"><b>🎖 Título da semana:</b> ${r.titulo}</div>`:''}
    ${r.legado?`<div class="orc-leg">👑 ${r.legado}</div>`:''}`;
  /* o Oráculo escreve — só na 1ª visualização de cada relatório, saltável com clique */
  const k='orcSeen:'+(REPORT.created_at||'');
  try{if(!sessionStorage.getItem(k)&&window.sysTypeHTML){sessionStorage.setItem(k,'1');
    sysTypeHTML([...el.querySelectorAll('.orc-sec,.orc-leg')],2500);
    if(window.panelScan)panelScan(el);}}catch(e){}
}
function acceptOracleMission(i,ev){
  const r=REPORT&&REPORT.report;if(!r||!r.missoes_propostas||!r.missoes_propostas[i])return;
  const m=r.missoes_propostas[i];
  const tr=triage(m.t||'Missão do Oráculo',m.deadline||null);
  S.objectives.push({id:'o'+Date.now(),title:m.t||'Missão do Oráculo',area:(m.area&&AM[m.area])?m.area:(tr.area||'oficio'),pri:(m.pri&&PRI[m.pri])?m.pri:tr.imp,auto:true,deadline:m.deadline||null,status:'pend',created:today(),tags:['🔮 Do Oráculo',...(tr.tags||[])],oracle:true});
  toast('Missão aceite','⚔️ Sistema sincronizado','#a78bfa');floatXP('+ missão','#a78bfa',ev);save();
}
function acceptRadarMission(id,ev){
  const it=RADAR.find(x=>x.id===id);if(!it||!it.missao||!it.missao.t)return;
  if(S.radarAccepted[id]){toast('Já aceite','Esta missão já está na tua lista.','#fb923c');return;}
  const m=it.missao;const tr=triage(m.t,m.deadline||null);
  S.objectives.push({id:'o'+Date.now(),title:m.t,area:(m.area&&AM[m.area])?m.area:(tr.area||'oficio'),pri:(m.pri&&PRI[m.pri])?m.pri:tr.imp,auto:true,deadline:m.deadline||null,status:'pend',created:today(),tags:['📡 Do Radar',...(tr.tags||[])],oracle:true});
  S.radarAccepted[id]=true;
  toast('Missão aceite','⚔️ '+m.t+' — Sistema sincronizado','#fbbf24');floatXP('+ missão','#fbbf24',ev);save();
}
