/* ===== WORLD ENGINE =====
   Arcos sazonais, meteo, sussurros, Double XP, multiplicadores,
   sinais vitais, recovery. Extraído do index.html — Missão 2 fase 4b. */

/* ===== WORLD ENGINE ===== */
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const seededPct=s=>hashStr(s)%100;

function seasonArcNow(){const m=new Date().getMonth()+1;return SEASON_ARCS.find(a=>a.months.includes(m))}
function seasonBounds(a){
  const now=new Date();let sy=now.getFullYear();
  if(a.id==='winter'&&(now.getMonth()+1)<=2)sy--;
  const sm=a.months[0],em=a.months[a.months.length-1];
  const ey=(em<sm)?sy+1:sy;
  return{start:sy+'-'+String(sm).padStart(2,'0')+'-01',
    end:ey+'-'+String(em).padStart(2,'0')+'-'+String(new Date(ey,em,0).getDate()).padStart(2,'0')};
}
function isoWeekKey(){const d=new Date();const t=new Date(d.getFullYear(),d.getMonth(),d.getDate());t.setDate(t.getDate()+3-((t.getDay()+6)%7));const w1=new Date(t.getFullYear(),0,4);const wk=1+Math.round(((t-w1)/864e5-3+((w1.getDay()+6)%7))/7);return t.getFullYear()+'W'+wk}
function doubleXPActive(){const dw=new Date().getDay();return(dw===0||dw===6)&&seededPct('dxp'+isoWeekKey())<20}
const rainyActive=()=>S.weather&&S.weather.d===today()&&S.weather.rain>=8;
const heatActive=()=>S.weather&&S.weather.d===today()&&S.weather.tmax>=32;

function xpMult(attr){let m=1;const a=seasonArcNow();
  if(S.worldArc&&S.worldArc.status==='active'&&S.worldArc.id===a.id&&a.bonus[attr])m*=a.bonus[attr];
  if(doubleXPActive())m*=2;
  if(rainyActive()&&attr==='saber')m*=1.15;
  return m}

async function fetchWeather(){
  if(S.weather&&S.weather.d===today())return;
  try{
    const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=41.41&longitude=-8.52&daily=temperature_2m_max,precipitation_sum&forecast_days=1&timezone=auto');
    const j=await r.json();
    S.weather={d:today(),tmax:j.daily.temperature_2m_max[0],rain:j.daily.precipitation_sum[0]};
    localSave();render();if(window.ambientApply)ambientApply();
  }catch(e){}
}

/* sussurros do mundo (Fate Engine — determinístico por dia) */
const whisperToday=()=>{const pool=WHISPERS.concat(WH_SEASON[seasonArcNow().id]||[]);return pool[hashStr('wh'+today())%pool.length]};
function claimWhisper(ev){
  if(S.whisper[today()])return;const w=whisperToday();
  S.whisper[today()]=true;const g=Math.round(w.xp*xpMult(w.attr));
  addXp(w.attr,g);plog('🌬 '+w.t,g);floatXP('+'+g+' XP',AM[w.attr].color,ev);save();
}

/* sinais vitais (estimados a partir dos teus dados reais) */
function vitals(){
  const last7=S.history.filter(h=>diffDays(h.d,today())<7).reduce((s,h)=>s+Math.max(0,h.v),0);
  const momentum=Math.max(0,Math.min(100,Math.round(last7/(7*45)*100)));
  const sono=S.oblig.find(h=>h.id==='o_sono');
  const sonoOk=sono&&(sono.lastDone===today()||sono.lastDone===yday());
  const maxStk=Math.max(0,...S.oblig.map(h=>h.streak),...S.extras.map(h=>h.streak));
  let burn=0;
  if(maxStk>=14)burn+=25;if(maxStk>=25)burn+=15;
  if(!sonoOk)burn+=30;if((sono?sono.streak:0)===0)burn+=10;
  if(last7>7*60)burn+=20;
  burn=Math.min(100,burn);
  return{momentum,burn,recovery:Math.max(0,100-burn)};
}
function startRecovery(){
  const d=new Date();d.setDate(d.getDate()+2);
  S.recovery={until:fmt(d)};
  toast('Recovery ativado','2 dias sem penalizações. Dorme. Recupera. O rank não foge.','#34d399');
  plog('🌙 Recovery ativado (2 dias)',0);save();
}

/* arcos: o mundo propõe, tu decides */
function arcAccept(){const a=seasonArcNow(),b=seasonBounds(a);
  S.worldArc={id:a.id,status:'active',start:b.start,end:b.end};
  let n=0;
  (a.quests||[]).forEach((q,i)=>{
    if(S.objectives.some(o=>o.title===q.t))return;
    const tr=triage(q.t,b.end);
    S.objectives.push({id:'o'+Date.now()+'_'+i,title:q.t,area:q.area||tr.area||'oficio',pri:q.pri||tr.imp,auto:true,deadline:b.end,status:'pend',created:today(),tags:[a.name.split(' ')[0]+' Arco',...(tr.tags||[])],arc:a.id});n++;
  });
  addXp('mente',15);plog('Arco aceite: '+a.name,15);
  if(n)setTimeout(()=>toast('O ARCO TROUXE MISSÕES','⚔️ '+n+' missões especiais entraram na lista-mestra, com prazo no fim do arco','#fb923c'),900);
  save()}
function arcLater(){S.worldArc={id:seasonArcNow().id,status:'later',snooze:today()};save()}
function arcIgnore(){S.worldArc={id:seasonArcNow().id,status:'dismissed'};save()}

function renderWorld(){
  const el=document.getElementById('world');if(!el)return;
  const a=seasonArcNow(),b=seasonBounds(a),v=vitals();
  const wa=S.worldArc;
  const proposing=!wa||wa.id!==a.id||(wa.status==='later'&&wa.snooze!==today());
  let html='';
  if(wa&&wa.id===a.id&&wa.status==='active'){
    const t=new Date(today()),s=new Date(b.start),e=new Date(b.end);
    const total=Math.round((e-s)/864e5)+1;let day=Math.max(1,Math.min(Math.round((t-s)/864e5)+1,total));
    const bon=Object.entries(a.bonus).map(([k,m])=>`<span class="wchip green">${AM[k].name} ×${m}</span>`).join('');
    html+=`<div class="w-head"><div><div class="at">${a.name} — ativo</div><div class="as">${a.desc}</div></div>
      <div class="boss">👹 Boss final: ${a.boss}</div></div>
      <div class="arc-count"><div class="arc-count-head"><span>Dia ${day} / ${total}</span><span>${Math.max(0,total-day)} dias restantes</span></div>
      <div class="arc-count-bar"><div class="arc-count-fill" style="width:${day/total*100}%"></div></div></div>
      <div class="w-chips">${bon}</div>`;
  }else if(proposing){
    html+=`<div class="w-head"><div><div class="at">🌍 O mundo mudou — ${a.name} disponível</div>
      <div class="as">${a.desc} · Boss final: ${a.boss}</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="mini" onclick="arcAccept()">Aceitar arco (+15 Mente)</button>
        <button class="mini" onclick="arcLater()">Mais tarde</button>
        <button class="mini" onclick="arcIgnore()">Ignorar</button></div></div>`;
  }else{
    html+=`<div class="w-head"><div class="as">Sem arco ativo. O mundo volta a sussurrar na próxima estação — ou aceita este nas definições do destino (recarrega amanhã).</div></div>`;
  }
  // eventos do dia
  let chips='';
  if(doubleXPActive())chips+=`<span class="wchip gold">⚡ Double XP Weekend — hábitos ×2</span>`;
  if(rainyActive())chips+=`<span class="wchip blue">🌧 Rainy Focus — Saber ×1.15 hoje</span>`;
  if(heatActive())chips+=`<span class="wchip">🔥 Heat Wave — treina cedo e hidrata</span>`;
  if(S.recovery&&today()<=S.recovery.until)chips+=`<span class="wchip green">🌙 Recovery ativo até ${S.recovery.until.slice(8,10)}/${S.recovery.until.slice(5,7)} — sem penalizações</span>`;
  if(new Date().getHours()>=21&&S.sleep&&S.sleep.bedT)chips+=`<span class="wchip">🌙 Recolher às ${S.sleep.bedT} — o Corpo constrói-se a dormir</span>`;
  if(chips)html+=`<div class="w-chips">${chips}</div>`;
  // sussurro do dia
  const w=whisperToday(),done=!!S.whisper[today()];
  html+=`<div class="whisper ${done?'done':''}"><span>🌬</span><span class="wt">${w.t}</span>
    <span class="wx">+${Math.round(w.xp*xpMult(w.attr))} ${AM[w.attr].name}</span>
    ${done?'<span class="wx" style="color:var(--em)">✓ feito</span>':`<button class="mini" onclick="claimWhisper(event)">Feito</button>`}</div>`;
  // vitais
  const vc=v.burn>=70?'#ef4444':v.burn>=40?'#fb923c':'#34d399';
  html+=`<div class="vitals">
    <div class="vit"><div class="vl"><span>Momentum</span><span>${v.momentum}%</span></div><div class="vb"><div class="vf" style="width:${v.momentum}%;background:#c084fc"></div></div></div>
    <div class="vit"><div class="vl"><span>Risco de burnout</span><span>${v.burn}%</span></div><div class="vb"><div class="vf" style="width:${v.burn}%;background:${vc}"></div></div></div>
    <div class="vit"><div class="vl"><span>Recuperação</span><span>${v.recovery}%</span></div><div class="vb"><div class="vf" style="width:${v.recovery}%;background:#a78bfa"></div></div></div>
  </div>
  <div class="vit-note">Estimativas calculadas a partir dos teus dados (streaks, sono, volume de XP dos últimos 7 dias) — não são diagnósticos.</div>`;
  if(v.burn>=70&&!(S.recovery&&today()<=S.recovery.until))
    html+=`<div class="w-chips"><button class="mini warm" onclick="startRecovery()">🌙 O mundo sugere: ativa Recovery (2 dias sem penalizações)</button></div>`;
  el.innerHTML=html;
}

