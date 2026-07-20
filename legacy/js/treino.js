/* ===== TREINO — Calistenia. Missão 2 fase 4c. */

/* ===== FASE 3 · TREINO — Calistenia (dados prontos para o Oráculo) ===== */
function consecTrained(){const set=new Set(S.training.sessions.map(s=>s.d));let c=0;const d=new Date();while(set.has(fmt(d))){c++;d.setDate(d.getDate()-1)}return c}
function weekSessions(){return new Set(S.training.sessions.filter(s=>diffDays(s.d,today())<7).map(s=>s.d)).size}
function trKeep(){const o={};TLINES.forEach(L=>{const r=document.getElementById('tr-'+L.id+'-reps'),f=document.getElementById('tr-'+L.id+'-feel');o[L.id]={r:r?r.value:'',f:f?f.value:'ok'}});const kd=document.getElementById('tr-kegel-done'),kf=document.getElementById('tr-kegel-feel');o.kegel={d:kd?kd.checked:false,f:kf?kf.value:'ok'};const n=document.getElementById('tr-notes'),x=document.getElementById('tr-extra');o.n=n?n.value:'';o.x=x?x.checked:false;return o}
/* dias distintos no passo atual com feel!=='d' — derivado das sessões gravadas, sem contador paralelo */
function kegelDaysAtStep(idx){return new Set(S.training.sessions.filter(s=>s.lines&&s.lines.kegel&&s.lines.kegel.step===idx&&s.lines.kegel.feel!=='d').map(s=>s.d)).size}
function finishTraining(ev){
  const lines={},adv=[];let logged=0;
  TLINES.forEach(L=>{
    const rv=parseInt(document.getElementById('tr-'+L.id+'-reps').value)||0;
    const fv=document.getElementById('tr-'+L.id+'-feel').value;
    if(rv>0){logged++;const idx=S.training.prog[L.id];const st=PROG[L.id][idx];
      lines[L.id]={step:idx,ex:st.n,reps:rv,feel:fv};
      if(rv>=st.t&&fv!=='d'&&idx<PROG[L.id].length-1){S.training.prog[L.id]++;adv.push(L.n+' → '+PROG[L.id][idx+1].n);}
    }});
  const kg=document.getElementById('tr-kegel-done');
  if(kg&&kg.checked){
    logged++;const idx=S.training.prog.kegel;const st=PROG.kegel[idx];
    const fv=document.getElementById('tr-kegel-feel').value;
    lines.kegel={step:idx,ex:st.n,cyc:st.cyc,feel:fv};
    /* sobe com 3 sessões no alvo em dias distintos (diário vale mais que intenso) */
    if(fv!=='d'&&idx<PROG.kegel.length-1){
      const days=new Set(S.training.sessions.filter(s=>s.lines&&s.lines.kegel&&s.lines.kegel.step===idx&&s.lines.kegel.feel!=='d').map(s=>s.d));
      days.add(today());
      if(days.size>=3){S.training.prog.kegel++;adv.push(KLINE.n+' → '+PROG.kegel[idx+1].n);}
    }
  }
  if(!logged){toast('Sem registo','Regista pelo menos uma linha com repetições.','#fb923c');return;}
  const extra=document.getElementById('tr-extra').checked;
  const notes=document.getElementById('tr-notes').value.trim();
  const consec=consecTrained();
  /* Fuga 2 — teto diário de XP: 1.ª sessão completa, 2.ª a metade, 3.ª+ a zero.
     O registo é sempre guardado (dados honestos); só o pagamento é limitado. */
  const nToday=S.training.sessions.filter(s=>s.d===today()).length;
  const fator=nToday===0?1:nToday===1?0.5:0;
  let xp=Math.round((15+logged*6)*xpMult('corpo')*fator);let extraOk=false;
  if(extra){
    if(consec>=3)toast('Trava do Sistema','4º dia seguido — o músculo cresce no descanso. Extra sem bónus hoje.','#fb923c');
    else{extraOk=true;xp+=Math.round(10*fator);const dg=Math.round(5*fator);if(dg)addXp('disciplina',dg);}
  }
  if(xp)addXp('corpo',xp);
  /* regra Nota B: avanços de progressão também multiplicam (arco/Double XP) */
  const advXp=adv.length?Math.round(30*adv.length*xpMult('corpo')*fator):0;
  if(adv.length){if(advXp)addXp('corpo',advXp);toast('EVOLUÇÃO DE PROGRESSÃO','↑ '+adv.join(' · '),'#34d399');}
  S.training.sessions.push({d:today(),lines,extra:extraOk,notes,adv:adv.length,xp:xp+advXp});
  plog('🏋️ Treino ('+logged+' linhas'+(extraOk?' + extra':'')+(nToday?' · '+(nToday+1)+'ª sessão do dia':'')+')',xp+advXp);
  if(nToday===1)toast('Sessão registada','2.ª sessão de hoje — XP a metade. O músculo cresce no descanso.','#fb923c');
  else if(nToday>=2)toast('Sessão registada','3.ª+ sessão de hoje — registada sem XP. Dados honestos, corpo protegido.','#fb923c');
  floatXP((xp+advXp)>0?'+'+(xp+advXp)+' XP':'registado','#f472b6',ev);save();
}
function trAdvice(){
  const ss=S.training.sessions;
  if(!ss.length)return 'Primeira sessão: aquece 5 min (mobilidade + cardio leve). Técnica primeiro, ego depois. Ritmo alvo: 3 sessões/semana, dias alternados.';
  const consec=consecTrained();
  if(consec>=4)return '⚠ '+consec+' dias seguidos. O corpo constrói-se no descanso — hoje é dia de pausa ou mobilidade leve. (Pavimento Pélvico é a exceção: esse é diário.)';
  for(const L of [...TLINES,KLINE]){const rel=ss.filter(s=>s.lines[L.id]).slice(-2);
    if(rel.length===2&&rel.every(s=>s.lines[L.id].feel==='d'))return '💡 '+L.n+': duas sessões "difícil" seguidas — repete o passo atual até sair limpo, ou regride um passo. Não é derrota, é engenharia.';}
  return 'Ritmo alvo: 3 sessões/semana em dias alternados. Sobe de passo quando 3×alvo sair limpo e fácil.';
}
function renderTraining(){
  const el=document.getElementById('training');if(!el)return;
  const k=trKeep();
  const hist=S.training.sessions.slice(-4).reverse().map(s=>`<div class="li"><span>${s.d.slice(8,10)}/${s.d.slice(5,7)} · ${Object.keys(s.lines).length} linhas${s.adv?' · ↑'+s.adv:''}${s.extra?' · extra':''}</span><span class="g">+${s.xp} XP</span></div>`).join('');
  const consec=consecTrained();
  el.innerHTML=`
   <div class="tr-stats"><span class="wchip">Sessões: ${S.training.sessions.length}</span><span class="wchip">Esta semana: ${weekSessions()}/3</span><span class="wchip ${consec>=4?'':'green'}">${consec} dia(s) seguido(s)</span></div>
   <div class="tr-advice">${trAdvice()}</div>
   <div class="tr-grid">${TLINES.map(L=>{const idx=S.training.prog[L.id],st=PROG[L.id][idx];
     return `<div class="trl" style="border-left:2px solid ${L.c}">
       <div class="trl-h"><span style="color:${L.c}">${L.n}</span><span class="trl-step">Passo ${idx+1}/${PROG[L.id].length}</span></div>
       <div class="trl-ex">${st.n}</div><div class="trl-t">Alvo para evoluir: 3×${st.t}</div>
       <div class="trl-in"><input type="number" id="tr-${L.id}-reps" placeholder="melhor série" min="0" max="500" value="${k[L.id].r}">
       <select id="tr-${L.id}-feel"><option value="f" ${k[L.id].f==='f'?'selected':''}>Fácil</option><option value="ok" ${k[L.id].f==='ok'?'selected':''}>OK</option><option value="d" ${k[L.id].f==='d'?'selected':''}>Difícil</option></select></div>
     </div>`}).join('')}${(()=>{const ki=S.training.prog.kegel,ks=PROG.kegel[ki];
     return `<div class="trl" style="border-left:2px solid ${KLINE.c}">
       <div class="trl-h"><span style="color:${KLINE.c}">${KLINE.n}</span><span class="trl-step">Passo ${ki+1}/${PROG.kegel.length}</span></div>
       <div class="trl-ex">${ks.n} · ${ks.cyc} ciclos</div>
       <div class="trl-t">10–15 min · rápidas = 1s/1s · Evolui com 3 dias no alvo (${Math.min(kegelDaysAtStep(ki),3)}/3)</div>
       <div class="trl-in" style="align-items:center"><label class="tr-x"><input type="checkbox" id="tr-kegel-done" ${k.kegel.d?'checked':''}> Sessão feita</label>
       <select id="tr-kegel-feel"><option value="f" ${k.kegel.f==='f'?'selected':''}>Fácil</option><option value="ok" ${k.kegel.f==='ok'?'selected':''}>OK</option><option value="d" ${k.kegel.f==='d'?'selected':''}>Difícil</option></select></div>
       <div class="trl-t" style="margin-top:6px">Respiração normal — se abdominais, glúteos ou coxas contraem, está errado. Diário vale mais que intenso.</div>
     </div>`})()}</div>
   <div class="addq" style="align-items:center">
     <label class="tr-x"><input type="checkbox" id="tr-extra" ${k.x?'checked':''}> Volume extra (senti facilidade)</label>
     <input id="tr-notes" placeholder="Notas (dores, variações...)" maxlength="90" value="${k.n.replace(/"/g,'&quot;')}">
     <button class="btn" onclick="finishTraining(event)">Concluir treino</button>
   </div>
   ${hist?`<div class="up-lbl" style="margin-top:12px">Últimas sessões</div><div class="log">${hist}</div>`:''}`;
}

