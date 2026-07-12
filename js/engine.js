/* ===== ENGINE — núcleo do Sistema =====
   Estado S, datas, XP/níveis, ranks, hábitos, fecho do dia, render.
   Extraído do index.html — Missão 2 fase 4a. */

function rankOf(level){for(const r of RANKS){if(level>=r.min&&level<=r.max)return r;}return RANKS[RANKS.length-1];}

function titleOf(l){let t=TITLES[0][1];for(const[m,n]of TITLES)if(l>=m)t=n;return t;}
/* ===== ESTADO ===== */
let S=null;
function fresh(){
  const attrs={};ATTRS.forEach(a=>attrs[a.id]={level:1,xp:0});
  return {attrs, oblig:OBLIG.map(h=>({...h,streak:0,lastDone:null,lastGain:0})),
    extras:EXTRAS.map(h=>({...h,streak:0,lastDone:null,lastGain:0})),
    history:[{d:today(),v:0}], totalXP:0, log:[], lastDayCheck:today(), seenAch:[], debuffs:{}, events:[], notifOn:false, notified:{},
    worldArc:null, whisper:{}, titleEv:{}, titleUnlocked:{}, recovery:null, weather:null,
    training:{prog:{push:0,pull:0,legs:0,core:0},sessions:[]}, sleep:{bedT:'23:30',wakeT:'07:30',logs:[]}, objectives:[], shadows:[], oracle:{reports:[]}, radarAccepted:{}, recall:{}, recallToday:null, customQ:[], studyStreak:{count:0,lastDay:null}, oracleChat:{d:null,count:0}, v:3};
}

/* ===== DATAS ===== */
const fmt=d=>d.toISOString().slice(0,10);
const today=()=>fmt(new Date());
const yday=()=>{const d=new Date();d.setDate(d.getDate()-1);return fmt(d)};
const diffDays=(a,b)=>Math.round((new Date(b)-new Date(a))/86400000);

/* ===== XP / NÍVEIS ===== */
const need=l=>40+l*20;
function addXp(attr,amt,silent){
  const a=S.attrs[attr];a.xp+=amt;const ups=[];
  if(amt>=0){while(a.xp>=need(a.level)){a.xp-=need(a.level);a.level++;ups.push(attr)}}
  else{while(a.xp<0){if(a.level<=1){a.xp=0;break}a.level--;a.xp+=need(a.level)}}
  S.totalXP=Math.max(0,S.totalXP+amt);
  // história (agrega por dia)
  const t=today();const last=S.history[S.history.length-1];
  if(last&&last.d===t)last.v+=amt;else S.history.push({d:t,v:amt});
  if(!silent&&ups.length){ups.forEach(u=>toast('Nível aumentado',AM[u].name+' subiu para nível '+S.attrs[u].level,AM[u].color));celebrate(AM[ups[0]].color);}
  if(amt>0&&!silent&&window.barBurst)barBurst(attr); // mini-burst na ponta da barra (F3 v3)
  return ups;
}
const overallLevel=()=>ATTRS.reduce((s,a)=>s+S.attrs[a.id].level,0)-(ATTRS.length-1);

/* ===== LOG ===== */
function plog(text,gain){S.log.unshift({text,gain,d:today()});S.log=S.log.slice(0,14)}
function unlog(text,d){const i=S.log.findIndex(e=>e.text===text&&(!d||e.d===d));if(i>-1)S.log.splice(i,1)}

/* ===== FECHO DO DIA (penalização) ===== */
function processDayClose(){
  const t=today();if(S.lastDayCheck===t)return;
  if(S.recovery){if(t<=S.recovery.until){S.lastDayCheck=t;return;}S.recovery=null;}
  const passed=Math.max(1,diffDays(S.lastDayCheck,t));
  let totalPen=0;
  S.oblig.forEach(h=>{
    const doneLast=(h.lastDone===S.lastDayCheck);
    let missed=passed-(doneLast?1:0);
    missed=Math.min(missed,3); // teto para não ser esmagador
    if(missed>0){const p=h.pen*missed;addXp(h.attr,-p,true);plog('⚠ Falhou: '+h.name+(missed>1?' ('+missed+'d)':''),-p);totalPen+=p;}
  });
  S.lastDayCheck=t;
  if(totalPen>0)pendingPenalty=totalPen;
}
let pendingPenalty=0;

/* ===== AÇÕES ===== */
function toggleHabit(list,id,ev){
  const h=S[list].find(x=>x.id===id);if(!h)return;
  const done=h.lastDone===today();
  if(!done){
    /* memória para o toggle (Nota A): desmarcar repõe exatamente este estado */
    h.undo={streak:h.streak,lastDone:h.lastDone};
    h.streak=(h.lastDone===yday())?h.streak+1:1;h.lastDone=today();
    const bonus=Math.min(h.streak,10);const g=Math.round((h.xp+bonus)*xpMult(h.attr));h.lastGain=g;
    addXp(h.attr,g);plog(h.name,g);floatXP('+'+g+' XP',AM[h.attr].color,ev);
    if(list==='oblig')toast('Pilar confirmado',h.name+' · +'+g+' XP',AM[h.attr].color);
  }else{const back=h.lastGain||h.xp;addXp(h.attr,-back);unlog(h.name,today());floatXP('\u2212'+back+' XP','#ef4444',ev);if(h.undo){h.streak=h.undo.streak;h.lastDone=h.undo.lastDone;delete h.undo;}else{h.lastDone=null;h.streak=Math.max(0,h.streak-1);}}
  save();
}
function resetAll(){if(confirm('Reiniciar todo o progresso? Não há volta atrás.')){S=fresh();save();}}


/* ===== RENDER ===== */
const chkI='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#04121f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
function habHTML(h,list,oblig){
  const done=h.lastDone===today();
  return `<div class="hab ${done?'done':''} ${oblig?'oblig':''}" onclick="toggleHabit('${list}','${h.id}',event)">
    <div class="chk">${chkI}</div>
    <div class="hb"><div class="hn">${h.name}</div>
      <div class="hm">${AM[h.attr].name} · +${h.xp} XP${oblig?' · <span class="pen">falha −'+h.pen+'</span>':''}</div></div>
    <div class="stk ${h.streak>0?'':'off'}">🔥 ${h.streak}</div>
    ${h.id.startsWith('c')?`<span class="up-del" onclick="delHabit('${h.id}',event)">✕</span>`:''}
  </div>`;
}
function addHabit(ev){
  const t=document.getElementById('nh-t').value.trim();if(!t)return;
  if(S.extras.length>=14){toast('Trava do Sistema','Hábitos a mais = nenhum feito. Conclui ou apaga antes de adicionar.','#fb923c');return;}
  S.extras.push({id:'c'+Date.now(),name:t,attr:document.getElementById('nh-a').value,xp:8,streak:0,lastDone:null,lastGain:0});
  document.getElementById('nh-t').value='';floatXP('+ hábito','#a78bfa',ev);save();
}
function delHabit(id,ev){ev.stopPropagation();S.extras=S.extras.filter(h=>h.id!==id);save();}
function render(){
  const lvl=overallLevel();const r=rankOf(lvl);
  if(lastRankL&&r.l!==lastRankL&&RANKS.findIndex(x=>x.l===r.l)>RANKS.findIndex(x=>x.l===lastRankL))rankCeremony(r);
  lastRankL=r.l;
  setNum('lvl',lvl);
  setNum('txp',Math.round(S.totalXP),v=>Math.round(v).toLocaleString('pt-PT'));
  const realUn=Object.entries(S.titleUnlocked||{}).sort((a,b)=>a[1]<b[1]?-1:1);
  const lastReal=realUn.length?TITLES_REAL.find(t=>t.id===realUn[realUn.length-1][0]):null;
  document.getElementById('title').textContent=lastReal?('👑 '+lastReal.name):titleOf(lvl);
  setNum('qd',S.objectives.filter(o=>o.status==='done').length);
  const allH=[...S.oblig,...S.extras];setNum('bstk',Math.max(0,...allH.map(h=>h.streak)));

  // rank badge
  const rb=document.getElementById('rankbadge');rb.style.borderColor=r.color;rb.style.color=r.color;
  rb.style.background='radial-gradient(circle,'+hexA(r.color,.14)+',transparent 70%)';
  document.getElementById('rankl').textContent=r.l;

  // rank progress (overall level position within rank)
  const span=(r.max>=9999?(lvl+5):r.max)-r.min+1;const into=lvl-r.min;
  const frac=ATTRS.reduce((s,a)=>s+S.attrs[a.id].xp/need(S.attrs[a.id].level),0)/ATTRS.length;
  document.getElementById('oring').style.strokeDashoffset=289*(1-frac);
  const rankFrac=Math.min(1,(into+frac)/span);
  document.getElementById('oxp-fill').style.width=(rankFrac*100)+'%';
  document.getElementById('rank-prog-lbl').textContent='Rank '+r.l+(r.l!=='S'?' → '+RANKS[RANKS.indexOf(r)+1].l:'');
  document.getElementById('oxp-txt').textContent='Nível '+lvl;

  // topbar glass (F3 v3) — espelho do essencial, sem estado próprio
  const tbr=document.getElementById('tb-rank');
  if(tbr){tbr.textContent=r.l;tbr.style.color=r.color;
    document.getElementById('tb-lvln').textContent=lvl;
    document.getElementById('tb-fill').style.width=(rankFrac*100)+'%';}

  // attrs
  document.getElementById('attrs').innerHTML=ATTRS.map(a=>{
    const s=S.attrs[a.id],nd=need(s.level),pct=Math.round(s.xp/nd*100),ar=rankOf(s.level);
    return `<div class="attr dom-${a.id}">
      <div class="ah"><div class="an"><span class="adot" style="background:${a.color};box-shadow:0 0 8px ${a.color}"></span>${a.name}
        <span class="ar" style="color:${ar.color};border-color:${ar.color}">${ar.l}</span></div>
        <div class="alv">Nv <b>${s.level}</b></div></div>
      <div class="abar"><div class="afill" data-a="${a.id}" style="width:${pct}%;background:linear-gradient(90deg,${a.color},${a.color}88 45%,${a.color} 75%,${a.color}cc)"></div></div>
      <div class="axp">${s.xp} / ${nd} XP</div></div>`;
  }).join('');
  /* easing visual entre renders — o innerHTML novo nasceria já na largura final */
  const pv=window.__barPv||(window.__barPv={});
  document.querySelectorAll('#attrs .afill').forEach(f=>{const k=f.dataset.a,w=f.style.width;
    if(pv[k]!==undefined&&pv[k]!==w){f.style.width=pv[k];f.getBoundingClientRect();f.style.width=w;}
    pv[k]=w;});

  renderRadar(r,lvl);

  document.getElementById('oblig').innerHTML=S.oblig.map(h=>habHTML(h,'oblig',true)).join('');
  document.getElementById('extras').innerHTML=S.extras.map(h=>habHTML(h,'extras',false)).join('');

  renderXpLine();

  renderGreet();renderAchievements();renderDebuffs();renderTree();renderWorld();renderNews();renderOracleRep();renderConselho();renderMapa();renderTitles();renderTraining();renderSleep();renderRecall();renderObjectives();renderShadows();renderCalendar();renderDeadlineBanner();checkNotif();

  const log=document.getElementById('log');
  log.innerHTML=S.log.length?S.log.map(l=>`<div class="li"><span>${l.text}</span><span class="${l.gain<0?'b':'g'}">${l.gain<0?'':'+'}${l.gain} XP</span></div>`).join(''):'<div class="log-empty">Sem atividade ainda. Marca um obrigatório para começares.</div>';
}
function hexA(hex,a){const n=parseInt(hex.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}

function renderRadar(rank,lvl){
  const cx=160,cy=160,R=112,n=ATTRS.length;
  const vals=ATTRS.map(a=>S.attrs[a.id].level+S.attrs[a.id].xp/need(S.attrs[a.id].level));
  // escala = teto do rank atual (cresce com o rank)
  let axisMax=(rank.max>=9999)?Math.ceil(Math.max(...vals))+2:rank.max+1;
  axisMax=Math.max(axisMax,Math.ceil(Math.max(...vals)));if(axisMax<2)axisMax=2;
  const pt=(i,rr)=>{const ang=-Math.PI/2+i*2*Math.PI/n;return[cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr]};
  let svg='';
  [.25,.5,.75,1].forEach(g=>{svg+=`<polygon points="${ATTRS.map((_,i)=>pt(i,R*g).join(',')).join(' ')}" fill="none" stroke="rgba(167,139,250,.12)" stroke-width="1"/>`});
  ATTRS.forEach((a,i)=>{const[x,y]=pt(i,R);svg+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(167,139,250,.1)"/>`;
    const[lx,ly]=pt(i,R+22);const anc=Math.abs(lx-cx)<8?'middle':(lx<cx?'end':'start');
    svg+=`<text x="${lx}" y="${ly+4}" text-anchor="${anc}" fill="${a.color}" font-family="JetBrains Mono,monospace" font-size="11" font-weight="700">${a.name}</text>`;});
  const shape=vals.map((v,i)=>pt(i,R*Math.min(1,v/axisMax)).join(',')).join(' ');
  svg+=`<polygon points="${shape}" fill="rgba(167,139,250,.15)" stroke="#a78bfa" stroke-width="2" style="filter:drop-shadow(0 0 6px rgba(167,139,250,.55))"/>`;
  vals.forEach((v,i)=>{const[x,y]=pt(i,R*Math.min(1,v/axisMax));svg+=`<circle cx="${x}" cy="${y}" r="3.5" fill="${ATTRS[i].color}"/>`});
  svg+=`<text x="${cx}" y="${cy+4}" text-anchor="middle" fill="${rank.color}" font-family="Rajdhani" font-weight="700" font-size="15">${rank.l}</text>`;
  document.getElementById('radar').innerHTML=svg;
}

function renderXpLine(){
  // cumulativo por dia
  const byDay={};S.history.forEach(h=>{byDay[h.d]=(byDay[h.d]||0)+h.v});
  const days=Object.keys(byDay).sort();
  const el=document.getElementById('xpline');
  if(days.length<2){el.innerHTML='<div class="xpline-empty">O gráfico desenha-se à medida que ganhas (e perdes) XP ao longo dos dias.</div>';return;}
  let cum=0;const pts=days.map(d=>{cum+=byDay[d];return{d,v:cum}});
  const W=1000,H=220,pad=34;const maxV=Math.max(...pts.map(p=>p.v),10);
  const x=i=>pad+(W-2*pad)*(pts.length===1?0:i/(pts.length-1));
  const y=v=>H-pad-(H-2*pad)*(v/maxV);
  let path='',area='';pts.forEach((p,i)=>{const X=x(i),Y=y(p.v);path+=(i?'L':'M')+X+' '+Y+' ';});
  area=path+`L${x(pts.length-1)} ${H-pad} L${x(0)} ${H-pad} Z`;
  let g='';[0,.5,1].forEach(f=>{const Y=H-pad-(H-2*pad)*f;g+=`<line x1="${pad}" y1="${Y}" x2="${W-pad}" y2="${Y}" stroke="rgba(167,139,250,.1)"/><text x="8" y="${Y+4}" fill="#4a5568" font-family="JetBrains Mono,monospace" font-size="11">${Math.round(maxV*f)}</text>`});
  const dots=pts.map((p,i)=>`<circle cx="${x(i)}" cy="${y(p.v)}" r="3" fill="#a78bfa"/>`).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="xg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa" stop-opacity=".35"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient></defs>
    ${g}<path d="${area}" fill="url(#xg)"/><path d="${path}" fill="none" stroke="#a78bfa" stroke-width="2.5" style="filter:drop-shadow(0 0 5px rgba(167,139,250,.5))"/>${dots}
    <text x="${pad}" y="${H-10}" fill="#4a5568" font-family="JetBrains Mono,monospace" font-size="11">${days[0]}</text>
    <text x="${W-pad}" y="${H-10}" text-anchor="end" fill="#4a5568" font-family="JetBrains Mono,monospace" font-size="11">${days[days.length-1]}</text>
  </svg>`;
}

