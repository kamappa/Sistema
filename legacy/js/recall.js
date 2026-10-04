/* ===== REVISÃO ATIVA =====
   Banco de perguntas, SM-2, seleção diária, painel Revisão do Dia,
   streak de estudo. Extraído do index.html — Missão 2 fase 4c. */

/* ===== BANCO DE PERGUNTAS (Revisão Ativa) ===== */
let QBANK=[];
async function loadQuestionBank(){
  const lotes=[1,2,3,4,5,6];
  const results=await Promise.all(lotes.map(async n=>{
    try{
      const r=await fetch('perguntas/lote'+n+'.json');
      if(!r.ok)return[];
      return await r.json();
    }catch(e){return[];}
  }));
  const seen=new Set();
  QBANK=results.flat().filter(q=>{
    if(seen.has(q.id)){console.warn('Pergunta com id duplicado ignorada:',q.id);return false;}
    seen.add(q.id);return true;
  });
}

/* ===== BANCO — GANCHO ORÁCULO (fase futura) =====
   Ponto de entrada para o Oráculo injetar perguntas novas em S.customQ
   ou atualizar QBANK a partir de um relatório. Ainda sem lógica —
   reservado para quando o Oráculo tiver este modo. */
function oracleRefreshQuestions(){}

/* ===== REVISÃO ATIVA — SELEÇÃO E SM-2 ===== */
let recallRevealed=false;
function addDays(dateStr,n){const d=new Date(dateStr);d.setDate(d.getDate()+n);return fmt(d);}
function failCount(id){const r=S.recall[id];return r?r.seen-r.correct:0;}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function questionPool(){return QBANK.concat(S.customQ||[]);}
function findQuestion(id){return QBANK.find(q=>q.id===id)||(S.customQ||[]).find(q=>q.id===id);}
function addCustomQuestion(ev){
  const tema=document.getElementById('cq-tema').value;
  const dif=document.getElementById('cq-dif').value;
  const ref=document.getElementById('cq-ref').value.trim();
  const q=document.getElementById('cq-q').value.trim();
  const a=document.getElementById('cq-a').value.trim();
  if(!q||!a){toast('Pergunta incompleta','Preenche pelo menos a pergunta e a resposta.','#fb923c');return;}
  S.customQ.push({id:'meu-'+Date.now(),tema,dif,q,a,ref:ref||'—'});
  document.getElementById('cq-ref').value='';
  document.getElementById('cq-q').value='';
  document.getElementById('cq-a').value='';
  floatXP('+ pergunta','#a78bfa',ev);
  save();
}

function reviewQuestion(id,grade){
  const t=today();
  let r=S.recall[id];
  if(!r)r=S.recall[id]={seen:0,correct:0,lastReview:null,interval:0,ease:2.5,due:t};
  r.seen++;
  if(grade==='fail'){
    r.interval=1;
    r.ease=Math.max(1.3,r.ease-0.2);
  }else if(grade==='meh'){
    r.interval=Math.max(1,Math.round(r.interval*1.5));
  }else if(grade==='ok'){
    r.correct++;
    r.interval=r.interval>0?Math.round(r.interval*r.ease):1;
  }
  r.lastReview=t;
  r.due=addDays(t,r.interval);
  return r;
}

function pickDiverse(pool,k,alreadyChosen){
  const picked=[];const remaining=[...pool];
  while(picked.length<k&&remaining.length>0){
    const usedThemes=new Set([...alreadyChosen,...picked].map(q=>q.tema));
    let idx=remaining.findIndex(q=>!usedThemes.has(q.tema));
    if(idx===-1)idx=0;
    picked.push(remaining[idx]);remaining.splice(idx,1);
  }
  return picked;
}

function selectRecallQuestions(n){
  n=n||5;
  const t=today();
  const pool=questionPool();
  const overdue=pool.filter(q=>S.recall[q.id]&&S.recall[q.id].due<=t)
    .sort((a,b)=>{
      const fa=failCount(a.id),fb=failCount(b.id);
      if(fb!==fa)return fb-fa;
      return S.recall[a.id].due<S.recall[b.id].due?-1:1;
    });
  const fresh=shuffle(pool.filter(q=>!S.recall[q.id]));
  const chosen=pickDiverse(overdue,n,[]);
  chosen.push(...pickDiverse(fresh,n-chosen.length,chosen));
  return chosen;
}

function getDailyRecallSet(){
  const t=today();
  if(S.recallToday&&S.recallToday.d===t){
    return S.recallToday.ids.map(findQuestion).filter(Boolean);
  }
  const picked=selectRecallQuestions(5);
  S.recallToday={d:t,ids:picked.map(q=>q.id),results:{}};
  return picked;
}
function recallQuestionHTML(q,idx,total){
  const th=RECALL_THEMES[q.tema]||{label:q.tema,color:'var(--sky)'};
  const difLabel=q.dif?(q.dif[0].toUpperCase()+q.dif.slice(1)):'—';
  return `<div class="rc-meta">
      <span class="wchip" style="border-color:${th.color};color:${th.color}">${th.label}</span>
      <span class="wchip">${difLabel}</span>
      <span class="rc-prog">${idx+1} / ${total}</span>
      ${S.studyStreak.count>0?`<span class="stk">🔥 ${S.studyStreak.count}</span>`:''}
    </div>
    <div class="rc-q">${q.q}</div>
    ${recallRevealed?`<div class="rc-a">${q.a}</div>
      <div class="rc-ref">${q.ref}</div>
      <div class="rc-grades">
        <button class="rc-btn fail" onclick="answerRecall('${q.id}','fail',event)">✕ Falhei</button>
        <button class="rc-btn meh" onclick="answerRecall('${q.id}','meh',event)">≈ Mais ou menos</button>
        <button class="rc-btn ok" onclick="answerRecall('${q.id}','ok',event)">✓ Acertei</button>
      </div>`
      :`<button class="btn" onclick="revealRecall()">Revelar resposta</button>`}`;
}
function recallSummaryHTML(set,results){
  const acertos=set.filter(q=>results[q.id]==='ok').length;
  const totalGain=set.reduce((s,q)=>s+Math.round((8+(results[q.id]==='ok'?4:0))*xpMult('saber')),0);
  const amanha=set.filter(q=>{const r=S.recall[q.id];return r&&r.due===addDays(today(),1);}).length;
  return `<div class="rc-summary">
    <div class="rc-sum-h">📖 Revisão concluída</div>
    <div class="rc-sum-row"><span>Acertos</span><b>${acertos} / ${set.length}</b></div>
    <div class="rc-sum-row"><span>XP de Saber ganho</span><b style="color:${AM.saber.color}">+${totalGain} XP</b></div>
    <div class="rc-sum-row"><span>Voltam amanhã</span><b>${amanha}</b></div>
    <div class="rc-sum-row"><span>Streak de estudo</span><b>🔥 ${S.studyStreak.count} dia${S.studyStreak.count===1?'':'s'}</b></div>
  </div>`;
}
function renderRecall(){
  const el=document.getElementById('recall');if(!el)return;
  if(!QBANK.length){el.innerHTML='<div class="dhint">A carregar o banco de perguntas…</div>';return;}
  if(!S.recallToday||!S.recallToday.ids||!S.recallToday.ids.length){
    el.innerHTML='<div class="dhint">Sem perguntas para rever hoje — já estudaste tudo o que havia disponível. 🎉</div>';return;
  }
  const set=S.recallToday.ids.map(findQuestion).filter(Boolean);
  const results=S.recallToday.results||{};
  const pending=set.filter(q=>!(q.id in results));
  if(!pending.length){el.innerHTML=recallSummaryHTML(set,results);return;}
  const q=pending[0];
  el.innerHTML=recallQuestionHTML(q,set.length-pending.length,set.length);
}
function revealRecall(){recallRevealed=true;renderRecall();}
function answerRecall(id,grade,ev){
  const q=findQuestion(id);if(!q)return;
  reviewQuestion(id,grade);
  S.recallToday.results[id]=grade;
  /* regra Nota B: xpMult aplica-se ao recall (arco/Double XP/Rainy Focus) */
  const gain=Math.round((8+(grade==='ok'?4:0))*xpMult('saber'));
  addXp('saber',gain);
  const th=RECALL_THEMES[q.tema]||{label:q.tema};
  plog('📖 Revisão · '+th.label,gain);
  floatXP('+'+gain+' XP',AM.saber.color,ev);
  if(grade==='ok')toast('Conhecimento assimilado','📖 '+th.label+' · +'+gain+' XP','#34d399');
  recallRevealed=false;
  if(S.recallToday.ids.every(qid=>qid in S.recallToday.results))bumpStudyStreak();
  save();
}
function bumpStudyStreak(){
  const t=today();
  if(S.studyStreak.lastDay===t)return;
  S.studyStreak.count=(S.studyStreak.lastDay===yday())?S.studyStreak.count+1:1;
  S.studyStreak.lastDay=t;
}
