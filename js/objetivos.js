/* ===== OBJETIVOS-MESTRA + SHADOW ARMY — triagem, filtros, sombras. Missão 2 fase 4c. */

/* ===== FASE 3 · OBJETIVOS-MESTRA + SHADOW ARMY ===== */
let objF={est:'all',area:'all',sort:'prazo',dif:'all'};
function setObjF(k,v){objF[k]=v;render()}
/* triagem automática (regras transparentes; o Oráculo refina depois) */
function triage(title,deadline){
  const t=title.toLowerCase();const why=[];
  const hi=KW_HI.find(k=>t.includes(k)),lo=KW_LO.find(k=>t.includes(k));
  let imp=hi?'P1':lo?'P3':'P2';
  if(hi)why.push('"'+hi+'"');if(lo&&!hi)why.push('tarefa do dia-a-dia');
  if(deadline){const d=daysUntil(deadline);
    why.push(d<0?'já atrasado':d===0?'prazo é hoje':'prazo em '+d+'d');
    if(d<=2&&imp!=='P1'){imp=(imp==='P3')?'P2':'P1';}
    else if(d<=7&&imp==='P3')imp='P2';}
  let area=null;
  for(const pair of KW_AREA){const k=pair[1].find(x=>t.includes(x));if(k){area=pair[0];why.push(AM[pair[0]].name+' ("'+k.trim()+'")');break;}}
  const tags=[diffTag(t)];
  if(hashStr(t)%3===0)tags.push(FUN_TAGS[hashStr('f'+t)%FUN_TAGS.length]);
  return{imp,area,tags,why:why.join(' · ')||'sem sinais fortes — peso médio'};
}
function diffTag(t){
  const quick=['marcar','enviar','comprar','ler ','email','mensagem','rever '];
  const epic=['certifica','projeto','portef','portfolio','implementar','construir','sgsi','dominar'];
  if(epic.some(k=>t.includes(k)))return '🏔 Épica';
  if(quick.some(k=>t.includes(k)))return '⚡ Rápida';
  return '🔨 Média';
}
function addObjective(ev){
  const t=document.getElementById('ob-t').value.trim();if(!t)return;
  const dl=document.getElementById('ob-d').value||null;
  const sel=document.getElementById('ob-p').value,selA=document.getElementById('ob-a').value;
  const tr=triage(t,dl);
  let pri=TIER_KEY[sel],auto=false,area=selA;
  if(sel==='AUTO'){pri=tr.imp;auto=true;}
  if(selA==='AUTO')area=tr.area||'oficio';
  if(auto||selA==='AUTO')toast('Triagem do Sistema',TIER_LABEL[pri]+' · '+AM[area].name+' · '+tr.why,PRI[pri].c);
  S.objectives.push({id:'o'+Date.now(),title:t,area,pri,auto,deadline:dl,status:'pend',created:today(),tags:tr.tags});
  document.getElementById('ob-t').value='';floatXP('+ objetivo','#a78bfa',ev);save();
}
function delObjective(id,ev){ev.stopPropagation();
  const o=S.objectives.find(x=>x.id===id);
  if(o&&o.status==='done')S.shadows=S.shadows.filter(s=>s.ref!==id);
  S.objectives=S.objectives.filter(x=>x.id!==id);save();}
function cycleObj(id,ev){ev.stopPropagation();
  const o=S.objectives.find(x=>x.id===id);if(!o)return;
  const next=OST[(OST.indexOf(o.status)+1)%OST.length];
  if(next==='done'){const p=PRI[o.pri];addXp(o.area,p.xp);o.doneDate=today();
    S.shadows.push({id:'s'+Date.now(),ref:o.id,name:o.title,lvl:p.lvl,d:today()});
    plog('🗡 ARISE: '+o.title,p.xp);floatXP('+'+p.xp+' XP',AM[o.area].color,ev);
    toast('A R I S E','🗡 '+o.title+' ergueu-se — Sombra Nv '+p.lvl,'#a78bfa');}
  if(o.status==='done'&&next!=='done'){const p=PRI[o.pri];addXp(o.area,-p.xp);unlog('🗡 ARISE: '+o.title,o.doneDate);S.shadows=S.shadows.filter(s=>s.ref!==o.id);delete o.doneDate;}
  o.status=next;save();
}
function renderObjectives(){
  const el=document.getElementById('objs');if(!el)return;
  const kt=document.getElementById('ob-t');const keep=kt?kt.value:'';
  const curArc=(S.worldArc&&S.worldArc.status==='active')?S.worldArc.id:null;
  const curArcLabel=curArc?(SEASON_ARCS.find(a=>a.id===curArc)||{}).name.split(' ').slice(0,2).join(' '):null;
  let list=S.objectives.filter(o=>(objF.est==='all'||o.status===objF.est)&&(objF.area==='all'||o.area===objF.area)&&(objF.dif==='all'||(o.tags&&o.tags.includes(objF.dif))));
  list.sort((a,b)=>{
    if(objF.sort==='prazo')return(a.deadline||'9999')<(b.deadline||'9999')?-1:1;
    if(objF.sort==='pri')return a.pri<b.pri?-1:1;
    return a.created<b.created?-1:1;});
  const rows=list.map(o=>{const p=PRI[o.pri];let dl='';
    if(o.deadline){const d=daysUntil(o.deadline);const c=d<=3?'#ef4444':d<=7?'#fb923c':'var(--mut)';
      dl=`<span class="up-x" style="color:${c}">${d<0?'atrasado':d===0?'hoje':d+'d'}</span>`;}
    return`<div class="obj-row ${o.status}">
      <span class="obj-st" onclick="cycleObj('${o.id}',event)" title="pendente → em curso → feito">${OSTL[o.status]}</span>
      <span class="obj-t">${o.title}</span>
      <span class="wchip" style="border-color:${AM[o.area].color};color:${AM[o.area].color};padding:2px 8px">${AM[o.area].name}</span>
      <span class="wchip" style="border-color:${p.c};color:${p.c};padding:2px 8px">${TIER_LABEL[o.pri]}</span>
      ${(o.arc&&o.arc===curArc)?`<span class="wchip" style="padding:1px 7px;font-size:9px;border-color:var(--line2);color:var(--mut)">${curArcLabel}</span>`:''}
      ${(o.tags||[]).map(tg=>`<span class="wchip" style="padding:1px 7px;font-size:9px;border-color:var(--line2);color:var(--mut)">${tg}</span>`).join('')}
      ${dl}<span class="up-del" onclick="delObjective('${o.id}',event)">✕</span></div>`}).join('');
  el.innerHTML=`
   <div class="obj-filters">
     <select onchange="setObjF('est',this.value)">${['all','pend','doing','done'].map(v=>`<option value="${v}" ${objF.est===v?'selected':''}>${{all:'Estado: todos',pend:'Pendentes',doing:'Em curso',done:'Feitos'}[v]}</option>`).join('')}</select>
     <select onchange="setObjF('area',this.value)"><option value="all">Área: todas</option>${ATTRS.map(a=>`<option value="${a.id}" ${objF.area===a.id?'selected':''}>${a.name}</option>`).join('')}</select>
     <select onchange="setObjF('sort',this.value)">${[['prazo','Ordenar: prazo'],['pri','Ordenar: prioridade'],['created','Ordenar: criação']].map(x=>`<option value="${x[0]}" ${objF.sort===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select>
     <select onchange="setObjF('dif',this.value)"><option value="all">Dificuldade: todas</option>${['⚡ Rápida','🔨 Média','🏔 Épica'].map(v=>`<option value="${v}" ${objF.dif===v?'selected':''}>${v}</option>`).join('')}</select>
   </div>
   <div>${rows||'<div class="up-empty">Sem missões neste filtro. Adiciona a primeira — Elite vale 150 XP e uma Sombra Nv 10.</div>'}</div>
   <div class="addq"><input id="ob-t" placeholder="Novo objetivo..." maxlength="90" value="${keep.replace(/"/g,'&quot;')}" onkeydown="if(event.key==='Enter')addObjective(event)">
     <select id="ob-a"><option value="AUTO" selected>Auto</option>${ATTRS.map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}</select>
     <select id="ob-p"><option value="AUTO" selected>Auto</option><option value="side">Side</option><option value="main">Main</option><option value="elite">Elite</option><option value="boss">Boss</option></select>
     <input type="date" id="ob-d"><button class="btn" onclick="addObjective(event)">+ Add</button></div>`;
}
function renderShadows(){
  const el=document.getElementById('shadows');if(!el)return;
  const pow=S.shadows.reduce((s,x)=>s+x.lvl,0);
  el.innerHTML=`<div class="tr-stats"><span class="wchip gold">Poder do exército: ${pow}</span><span class="wchip">Sombras: ${S.shadows.length}</span></div>
   <div class="shd-grid">${S.shadows.length?S.shadows.slice().reverse().map(s=>`<div class="shd"><div class="shd-n">🗡 ${s.name}</div><div class="shd-l">Sombra · Nv ${s.lvl} · ${s.d.slice(8,10)}/${s.d.slice(5,7)}</div></div>`).join(''):'<div class="up-empty">O exército aguarda. Conclui objetivos — e eles erguem-se para trabalhar por ti.</div>'}</div>`;
}

