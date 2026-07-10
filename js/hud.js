/* ===== PAINÉIS DO HUD =====
   Conquistas, debuffs, skill trees, Títulos Reais, calendário/eventos,
   notificações, saudação. Extraído do index.html — Missão 2 fase 4b. */

/* ===== CONQUISTAS ===== */
function renderAchievements(){
  document.getElementById('achs').innerHTML=ACH.map(a=>{const on=a.cond(S);
    return `<div class="ach ${on?'on':''}"><div class="ico">${on?a.ico:'🔒'}</div><div><div class="an2">${a.name}</div><div class="ad2">${on?a.msg:'Bloqueada'}</div></div></div>`;}).join('');
  ACH.forEach(a=>{if(a.cond(S)&&!S.seenAch.includes(a.id)){S.seenAch.push(a.id);toast('Conquista desbloqueada',a.ico+' '+a.name,'#fbbf24');}});
}
/* ===== ESTADOS / DEBUFFS ===== */
function toggleDebuff(id){S.debuffs[id]=!S.debuffs[id];save();}
function applyAntidote(id,e){e.stopPropagation();S.debuffs[id]=false;addXp('disciplina',10);plog('Antídoto: '+DEBUFFS.find(d=>d.id===id).name,10);toast('Antídoto aplicado','+10 Disciplina · bem gerido','#34d399');save();}
function renderDebuffs(){
  document.getElementById('dbfs').innerHTML=DEBUFFS.map(d=>{const act=!!S.debuffs[d.id];
    return `<div class="dbf ${act?'act':''}" onclick="toggleDebuff('${d.id}')">
      <div class="dbf-top"><span>${act?'🔴':'⚪'}</span><span class="dbf-nm">${d.name}</span><span class="dbf-tag">${act?'ativo':'inativo'}</span></div>
      <div class="dbf-body"><div class="ef">Efeito: ${d.ef}</div><div class="an3">Antídoto: ${d.an}</div>
        <button class="antbtn" onclick="applyAntidote('${d.id}',event)">✓ Apliquei o antídoto (+10 Disciplina)</button></div></div>`;}).join('');
}
/* ===== SKILL TREES ===== */
function renderTree(){
  document.getElementById('trees').innerHTML=TREES.map(t=>{const a=AM[t.attr],lvl=S.attrs[t.attr].level;let row='';
    t.nodes.forEach((n,i)=>{const un=lvl>=n[1];
      if(i>0){const pu=lvl>=t.nodes[i-1][1];row+=`<div class="tree-link ${pu?'un':''}" style="color:${a.color}"></div>`;}
      row+=`<div class="node ${un?'un':''}" style="color:${a.color}"><div class="nd-dot">${un?'★':n[1]}</div><div class="nd-lbl">${n[0]}</div></div>`;});
    return `<div class="tree"><div class="tree-h"><span class="adot" style="background:${a.color};box-shadow:0 0 8px ${a.color}"></span>${a.name}</div><div class="tree-row">${row}</div></div>`;}).join('');
}
/* ===== REALITY ENGINE — TÍTULOS COM EVIDÊNCIA ===== */
const titleOpenSet=new Set();
function reqMet(t,r){if(r.auto)return isTitleUnlocked(r.auto);return!!(S.titleEv[t.id]&&S.titleEv[t.id][r.id])}
function titleProg(t){const met=t.reqs.filter(r=>reqMet(t,r)).length;return{met,tot:t.reqs.length,pct:Math.round(met/t.reqs.length*100)}}
function isTitleUnlocked(id){const t=TITLES_REAL.find(x=>x.id===id);return!!t&&t.reqs.every(r=>reqMet(t,r))}
function toggleTitleOpen(id){titleOpenSet.has(id)?titleOpenSet.delete(id):titleOpenSet.add(id);render()}
function toggleReq(tid,rid,ev){ev.stopPropagation();
  const t=TITLES_REAL.find(x=>x.id===tid);const r=t.reqs.find(x=>x.id===rid);if(r.auto)return;
  S.titleEv[tid]=S.titleEv[tid]||{};S.titleEv[tid][rid]=!S.titleEv[tid][rid];
  if(S.titleEv[tid][rid])floatXP('\u2713 evid\u00eancia','#fbbf24',ev);
  if(titleProg(t).pct===100&&!S.titleUnlocked[tid]){
    S.titleUnlocked[tid]=today();plog('👑 Título real: '+t.name,0);
    toast('TÍTULO REAL DESBLOQUEADO','👑 '+t.name+' — com evidência. Isto é teu.','#fbbf24');
  }
  if(titleProg(t).pct<100&&S.titleUnlocked[tid])delete S.titleUnlocked[tid];
  save()}
function renderTitles(){
  const el=document.getElementById('titles');if(!el)return;
  el.innerHTML=TITLES_REAL.map(t=>{
    const p=titleProg(t),un=p.pct===100,open=titleOpenSet.has(t.id);
    return`<div class="tit ${un?'un':''} ${open?'open':''}" onclick="toggleTitleOpen('${t.id}')">
      <div class="tit-nm">${un?'👑':'🔒'} ${t.name}</div>
      <div class="tit-gap">${un?'Desbloqueado — credencial real':'Gap: '+(100-p.pct)+'% · '+p.met+'/'+p.tot+' requisitos'}</div>
      <div class="tit-bar"><div class="tit-fill" style="width:${p.pct}%"></div></div>
      <div class="tit-reqs">${t.reqs.map(r=>{const on=reqMet(t,r);
        return`<div class="req ${on?'on':''}" onclick="toggleReq('${t.id}','${r.id}',event)">
          <div class="rchk">${on?chkI:''}</div><div>${r.t}${r.auto?' <span class="rauto">· automático</span>':''}</div></div>`}).join('')}</div>
    </div>`}).join('');
}
function exportState(){
  const blob=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download='sistema-estado-'+today()+'.json';a.click();
}

/* ===== CALENDÁRIO & EVENTOS ===== */
let calY,calM;
function calInit(){const d=new Date();calY=d.getFullYear();calM=d.getMonth();}
function navMonth(n){calM+=n;if(calM<0){calM=11;calY--}if(calM>11){calM=0;calY++}renderCalendar();}
function daysUntil(ds){return Math.round((new Date(ds)-new Date(today()))/86400000);}
function guessEvType(t){t=t.toLowerCase();
 if(['exame','teste','prova','frequência','frequencia'].some(k=>t.includes(k)))return'exame';
 if(['trein','gin','corrida'].some(k=>t.includes(k)))return'treino';
 if(['confer','summit','meetup','palestra','workshop','evento','webinar'].some(k=>t.includes(k)))return'evento';
 if(['entrega','prazo','submeter','deadline','candidatura'].some(k=>t.includes(k)))return'prazo';
 return'outro';}
function addEvent(){const d=document.getElementById('ev-date').value,t=document.getElementById('ev-title').value.trim();let ty=document.getElementById('ev-type').value;if(!d||!t)return;if(ty==='AUTO')ty=guessEvType(t);S.events.push({id:'e'+Date.now(),date:d,title:t,type:ty});document.getElementById('ev-title').value='';save();}
function pickDay(ds){const d=document.getElementById('ev-date'),t=document.getElementById('ev-title');if(!d)return;d.value=ds;if(t)t.focus();}
function delEvent(id){S.events=S.events.filter(e=>e.id!==id);save();}
function renderCalendar(){
  if(calY===undefined)calInit();
  const _d=document.getElementById('ev-date'),_t=document.getElementById('ev-title'),_s=document.getElementById('ev-type');
  const keepD=_d?_d.value:'',keepT=_t?_t.value:'',keepS=_s?_s.value:'';
  const startDay=(new Date(calY,calM,1).getDay()+6)%7;
  const ndays=new Date(calY,calM+1,0).getDate();
  const MO=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const tT=today();let cells='';
  ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].forEach(w=>cells+=`<div class="cal-wd">${w}</div>`);
  for(let i=0;i<startDay;i++)cells+='<div class="cal-cell empty"></div>';
  for(let d=1;d<=ndays;d++){const ds=calY+'-'+String(calM+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const evs=S.events.filter(e=>e.date===ds);
    const dots=evs.slice(0,4).map(e=>`<span class="cal-dot" style="background:${(EVT[e.type]||EVT.outro).c}"></span>`).join('');
    cells+=`<div class="cal-cell ${ds===tT?'today':''}" onclick="pickDay('${ds}')" title="${evs.map(e=>e.title).join(', ')}"><div class="cal-num">${d}</div><div class="cal-dots">${dots}</div>${evs.length?`<div class="cal-ev">${evs[0].title}</div>`:''}</div>`;}
  const up=S.events.filter(e=>daysUntil(e.date)>=0).sort((a,b)=>a.date<b.date?-1:1).slice(0,6);
  const upH=up.length?up.map(e=>{const t=EVT[e.type]||EVT.outro,dd=daysUntil(e.date);
    return `<div class="up-item"><span class="up-dot" style="background:${t.c}"></span><span class="up-d">${e.date.slice(8,10)}/${e.date.slice(5,7)}</span><span class="up-t">${e.title}</span><span class="up-x" style="color:${t.c}">${dd===0?'hoje':dd===1?'amanhã':'em '+dd+'d'}</span><span class="up-del" onclick="delEvent('${e.id}')">✕</span></div>`;}).join(''):'<div class="up-empty">Sem prazos próximos.</div>';
  document.getElementById('cal').innerHTML=`
    <div class="cal-head"><button class="cal-nav" onclick="navMonth(-1)">‹</button><div class="cal-title">${MO[calM]} ${calY}</div><button class="cal-nav" onclick="navMonth(1)">›</button></div>
    <div class="cal-grid">${cells}</div>
    <div class="cal-add"><input type="date" id="ev-date"><input id="ev-title" placeholder="Prazo, exame, evento..." maxlength="60" onkeydown="if(event.key==='Enter')addEvent()"><select id="ev-type"><option value="AUTO" selected>Auto</option>${Object.entries(EVT).map(([k,v])=>`<option value="${k}">${v.l}</option>`).join('')}</select><button class="btn" onclick="addEvent()">+ Add</button></div>
    <div class="up-lbl">📌 Próximos prazos</div>${upH}`;
  if(keepD)document.getElementById('ev-date').value=keepD;
  if(keepT)document.getElementById('ev-title').value=keepT;
  if(keepS)document.getElementById('ev-type').value=keepS;
}
function renderDeadlineBanner(){
  const el=document.getElementById('deadline-banner');if(!el)return;
  const evs=S.events.filter(e=>{const d=daysUntil(e.date);return d>=0&&d<=7;}).map(e=>({t:e.title,d:daysUntil(e.date),k:'ev'}));
  const objs=(S.objectives||[]).filter(o=>o.status!=='done'&&o.deadline&&daysUntil(o.deadline)<=2).map(o=>({t:o.title,d:daysUntil(o.deadline),k:'obj'}));
  const all=[...objs,...evs].sort((a,b)=>a.d-b.d);
  if(!all.length){el.style.display='none';return;}
  el.style.display='flex';
  const lbl=x=>x.d<0?('atrasado '+Math.abs(x.d)+'d'):x.d===0?'hoje':x.d===1?'amanhã':x.d+'d';
  const it=all.slice(0,3).map(x=>(x.k==='obj'?'🎯 ':'')+x.t+' ('+lbl(x)+')').join(' · ');
  el.innerHTML=`<span class="db-ic">⚠️</span><span>${objs.length?'<b style="color:#fca5a5">URGENTE — </b>':''}${it}${all.length>3?' +'+(all.length-3):''}</span>`;
}
/* ===== NOTIFICAÇÕES (só com o HUD aberto) ===== */
function enableNotif(){
  try{
    if(!('Notification'in window)){toast('Sem suporte','Esta vista não permite notificações','#ef4444');return;}
    Notification.requestPermission().then(p=>{S.notifOn=(p==='granted');save();
      if(S.notifOn){toast('Alertas ativados','Avisos de prazos enquanto o HUD estiver aberto','#34d399');checkNotif();}
      else toast('Bloqueado','Permite notificações no navegador para ativar','#fb923c');});
  }catch(e){toast('Indisponível','Abre o HUD numa aba própria para ativar','#fb923c');}
}
function checkNotif(){
  if(!S.notifOn||!('Notification'in window)||Notification.permission!=='granted')return;
  const t=today();S.notified=S.notified||{};
  S.events.forEach(e=>{const d=daysUntil(e.date);if(d>=0&&d<=2){const k=e.id+'|'+t;if(!S.notified[k]){try{new Notification('⚔️ Sistema — prazo a chegar',{body:e.title+(d===0?' é hoje':d===1?' é amanhã':' em '+d+' dias')});S.notified[k]=true;}catch(err){}}}});
}

/* ===== SAUDAÇÃO & CITAÇÃO DO DIA ===== */
function renderGreet(){
  const eh=document.getElementById('greet-h'),eq=document.getElementById('greet-q');if(!eh)return;
  const hr=new Date().getHours();
  const G={m:['Bom dia — pronto para começar bem?','Bom dia. O dia é teu antes de ser de mais alguém.','Bom dia — primeiro um pilar, depois o mundo.'],
           t:['Boa tarde — ritmo, não pressa.','Boa tarde. Metade do dia, foco inteiro.','Boa tarde — o que fica feito hoje não pesa amanhã.'],
           n:['Boa noite — fecha o dia com intenção.','Boa noite. O descanso também é treino.','Boa noite — o Corpo constrói-se a dormir.']};
  const per=(hr>=5&&hr<13)?'m':(hr<20)?'t':'n';
  eh.textContent=G[per][hashStr(per+today())%G[per].length];
  const q=QUOTES[hashStr('q'+today())%QUOTES.length];
  eq.innerHTML='“'+q[0]+'” — <b>'+q[1]+'</b>';
}

