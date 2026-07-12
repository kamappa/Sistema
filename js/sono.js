/* ===== SONO — Regulador. Missão 2 fase 4c. */

/* ===== FASE 3 · SONO — Regulador ===== */
function calcHours(bed,wake){const[bh,bm]=bed.split(':').map(Number),[wh,wm]=wake.split(':').map(Number);let m=(wh*60+wm)-(bh*60+bm);if(m<=0)m+=1440;return Math.round(m/6)/10}
function setSleepT(k,v){S.sleep[k]=v;save()}
function sleepStreak(){let c=0;const d=new Date();for(;;){const L=S.sleep.logs.find(l=>l.d===fmt(d));if(L&&L.h>=7.5&&L.h<=9.5){c++;d.setDate(d.getDate()-1)}else break}return c}
function logSleep(ev){
  const bed=document.getElementById('sl-bed').value,wake=document.getElementById('sl-wake').value,q=document.getElementById('sl-q').value;
  const dEl=document.getElementById('sl-date');const dt=(dEl&&dEl.value)?dEl.value:today();
  if(!bed||!wake){toast('Falta info','Preenche hora de deitar e de acordar.','#fb923c');return;}
  if(dt>today()){toast('Data inválida','O Sistema não regista o futuro.','#fb923c');return;}
  const h=calcHours(bed,wake);
  let L=S.sleep.logs.find(l=>l.d===dt);
  if(L)Object.assign(L,{bed,wake,h,q});else{L={d:dt,bed,wake,h,q,rw:false};S.sleep.logs.push(L);S.sleep.logs.sort((a,b)=>a.d<b.d?-1:1);}
  const recent=(dt===today()||dt===yday());
  if(h>=7.5&&h<=9.5&&!L.rw&&recent){
    L.rw=true;addXp('corpo',12);addXp('disciplina',5);
    plog('😴 Noite no alvo ('+h+'h)',17);floatXP('+17 XP','#34d399',ev);
    const so=S.oblig.find(x=>x.id==='o_sono');
    /* marca o pilar com undo (Nota A) e lastGain=0 — esta marca não paga XP,
       o prémio da noite (+17) vive no registo do sono e não é revertível daqui */
    if(dt===today()&&so&&so.lastDone!==today()){so.undo={streak:so.streak,lastDone:so.lastDone};so.streak=(so.lastDone===yday())?so.streak+1:1;so.lastDone=today();so.lastGain=0;}
  }else if(!recent){plog('😴 Registo retroativo '+dt+' ('+h+'h)',0);toast('Registo retroativo','Guardado para análise. XP só em registos do próprio dia — anti-farm.','#a78bfa');}
  else if(h<7.5){plog('😴 Noite curta ('+h+'h)',0);toast('Registado','Noite curta ('+h+'h). Sem drama — o alvo de hoje é recuperar.','#fb923c');}
  save();
}
function renderSleep(){
  const el=document.getElementById('sleep');if(!el)return;
  const _b=document.getElementById('sl-bed'),_w=document.getElementById('sl-wake'),_q=document.getElementById('sl-q'),_d2=document.getElementById('sl-date');
  const kb=_b?_b.value:'',kw=_w?_w.value:'',kq=_q?_q.value:'boa',kd=_d2?_d2.value:today();
  const logs=S.sleep.logs;const lastL=logs[logs.length-1];
  const l7=logs.filter(l=>diffDays(l.d,today())<7);
  const avg=l7.length?Math.round(l7.reduce((s,l)=>s+l.h,0)/l7.length*10)/10:0;
  let bars='';for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const L=logs.find(x=>x.d===fmt(d));
    const h=L?L.h:0;const col=!L?'rgba(255,255,255,.06)':(h>=7.5&&h<=9.5)?'#34d399':(h<6.5?'#ef4444':'#fb923c');
    bars+=`<div class="slb" style="height:${L?Math.min(100,h/10*100):4}%;background:${col}" title="${fmt(d)}: ${L?h+'h':'—'}"></div>`}
  el.innerHTML=`
   <div class="tr-stats"><span class="wchip">${lastL?('Última: '+lastL.h+'h'):'Sem registos'}</span><span class="wchip">Média 7d: ${avg||'—'}h</span><span class="wchip green">Streak no alvo: ${sleepStreak()}</span></div>
   <div class="sl-bars">${bars}</div>
   <div class="addq" style="align-items:center">
     <label class="tr-x">Noite de <input type="date" id="sl-date" value="${kd}"></label>
     <label class="tr-x">Deitar <input type="time" id="sl-bed" value="${kb}"></label>
     <label class="tr-x">Acordar <input type="time" id="sl-wake" value="${kw}"></label>
     <select id="sl-q"><option value="boa" ${kq==='boa'?'selected':''}>Boa</option><option value="media" ${kq==='media'?'selected':''}>Média</option><option value="ma" ${kq==='ma'?'selected':''}>Má</option></select>
     <button class="btn" onclick="logSleep(event)">Registar noite</button>
   </div>
   <div class="vit-note">Alvo: 7,5–9h e consistência de horário (o cérebro premeia regularidade mais do que maratonas de fim de semana). Hora-alvo de recolher <input type="time" style="width:auto;padding:3px 6px" value="${S.sleep.bedT}" onchange="setSleepT('bedT',this.value)"> — o mundo lembra-te à noite. Noite no alvo marca o pilar do sono sozinha.</div>`;
}

