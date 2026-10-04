/* ===== ORÁCULO · CONSELHO =====
   Chat com o conselheiro estratégico (Edge Function ?mode=chat).
   O histórico vive só na sessão da página; o contador diário S.oracleChat
   persiste no estado e é revalidado no servidor. Missão Oráculo·Conselho fase 2. */

const OC_LIMIT=12;
let OC_HIST=[];   /* [{role,content}] — memória da página, não persiste */
let ocBusy=false;

function ocQuotaLeft(){
  const t=today();
  if(!S||!S.oracleChat||S.oracleChat.d!==t)return OC_LIMIT;
  return Math.max(0,OC_LIMIT-(S.oracleChat.count||0));
}

function renderConselho(){
  const q=document.getElementById('oc-quota'),log=document.getElementById('oc-log');
  if(!q||!log)return;
  if(!USER){
    if(!OC_HIST.length){log.dataset.ph='1';
      log.innerHTML='<div class="up-empty">Entra com a tua conta para falares com o Oráculo.</div>';}
    q.textContent='';return;
  }
  if(!OC_HIST.length&&!ocBusy){log.dataset.ph='1';
    log.innerHTML='<div class="up-empty">Pergunta ao Oráculo — decisões de carreira, dúvidas, rumo. Quando a decisão for importante, o Conselho reúne as 5 lentes. 12 mensagens por dia.</div>';}
  const left=ocQuotaLeft();
  q.textContent=left>0?left+'/'+OC_LIMIT+' hoje':'limite de hoje atingido';
  const btn=document.getElementById('oc-send');if(btn)btn.disabled=left<=0||ocBusy;
  showSussurro();fetchSussurro();
}

function ocBubble(cls,text){
  const log=document.getElementById('oc-log');
  if(log.dataset.ph){delete log.dataset.ph;log.innerHTML='';}
  const d=document.createElement('div');d.className='oc-msg '+cls;d.textContent=text;
  log.appendChild(d);log.scrollTop=log.scrollHeight;return d;
}

/* teatro de pensamento — ambiente, não engano: a resposta real chega quando chega */
const OC_THEATER=['A consultar memórias…','A analisar o teu estado…','A reunir o Conselho…','A pesar os trade-offs…'];
function ocTheaterStart(){
  const log=document.getElementById('oc-log');
  /* o Oráculo a pensar (M12·3C) — a moldura do painel ganha um brilho lento e
     o botão pulsa enquanto a resposta não chega; todos os caminhos de saída
     passam pelo stop(), por isso a classe nunca fica presa */
  const panel=log.closest('.panel');
  if(panel)panel.classList.add('oc-thinking');
  const d=document.createElement('div');d.className='oc-think';
  d.innerHTML='<span class="dot"></span><span class="oc-think-t"></span>';
  log.appendChild(d);log.scrollTop=log.scrollHeight;
  const t=d.querySelector('.oc-think-t');let i=0;t.textContent=OC_THEATER[0];
  const iv=setInterval(()=>{i=(i+1)%OC_THEATER.length;t.textContent=OC_THEATER[i];},2200);
  return{stop:()=>{clearInterval(iv);d.remove();if(panel)panel.classList.remove('oc-thinking');}};
}

/* máquina de escrever do Oráculo — texto simples, saltável com clique,
   direta com prefers-reduced-motion (mesmo contrato do sysType da M3v2) */
function ocType(el,txt){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=txt;return;}
  let i=0,fast=false;const skip=()=>fast=true;
  document.addEventListener('click',skip,{once:true});
  const ms=Math.max(6,Math.min(18,2600/Math.max(1,txt.length)));
  const log=document.getElementById('oc-log');
  (function step(){
    if(fast||i>=txt.length){el.textContent=txt;if(log)log.scrollTop=log.scrollHeight;return;}
    el.textContent=txt.slice(0,++i);
    if(i%12===0&&log)log.scrollTop=log.scrollHeight;
    setTimeout(step,ms);
  })();
}

/* ===== SUSSURRO DO CONSELHEIRO (fase 5) =====
   Uma linha contextual do dia, gerada do estado real (1 chamada/dia, cache
   em S.sussurro). Silêncio > ruído: sem linha, a saudação fica como está. */
let ocSussFetched=false;
async function fetchSussurro(){
  if(ocSussFetched||!USER||!sb)return;
  ocSussFetched=true;
  const t=today();
  if(S.sussurro&&S.sussurro.d===t)return; /* já temos o de hoje (linha ou silêncio) */
  try{
    const{data:{session}}=await sb.auth.getSession();
    const r=await fetch(SUPABASE_URL+'/functions/v1/oraculo?mode=sussurro',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'authorization':'Bearer '+session.access_token},
      body:'{}'});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)return; /* em erro, silêncio — nunca inventar uma linha */
    S.sussurro={d:t,line:j.linha||null};save();
  }catch(e){}
}
function showSussurro(){
  const eq=document.getElementById('greet-q');if(!eq)return;
  const old=document.getElementById('sussurro-line');
  const s=S&&S.sussurro;
  if(!s||s.d!==today()||!s.line){if(old)old.remove();return;}
  if(old){old.textContent='🔮 '+s.line;return;}
  const d=document.createElement('div');d.id='sussurro-line';d.className='sussurro';
  d.textContent='🔮 '+s.line;
  eq.insertAdjacentElement('afterend',d);
}

/* ===== ACEITAR COMO MISSÃO (fase 3) =====
   Só quando a resposta traz a linha-marcador "⚔ Ação (48h): ..." — é o
   Oráculo a declarar a ação, não o cliente a adivinhá-la. Prazo = 48h. */
function ocOfferMission(reply){
  const m=reply.match(/^⚔️?\s*A[çc][ãa]o\s*\(48h\)\s*:\s*(.+)$/mi);
  if(!m||!m[1].trim())return;
  const log=document.getElementById('oc-log');
  const btn=document.createElement('button');
  btn.className='mini warm oc-accept';btn.textContent='⚔️ Aceitar como missão';
  btn.dataset.t=m[1].trim().slice(0,140);
  btn.onclick=ev=>acceptConselhoMission(btn,ev);
  log.appendChild(btn);log.scrollTop=log.scrollHeight;
}
function acceptConselhoMission(btn,ev){
  const t=btn.dataset.t;if(!t||btn.disabled)return;
  const dl=addDays(today(),2);
  const tr=triage(t,dl);
  S.objectives.push({id:'o'+Date.now(),title:t,area:tr.area||'oficio',pri:tr.imp,auto:true,deadline:dl,status:'pend',created:today(),tags:['🔮 Do Oráculo',...(tr.tags||[])],oracle:true});
  btn.textContent='✓ Missão aceite';btn.disabled=true;
  toast('Missão aceite','⚔️ '+t+' — Sistema sincronizado','#a78bfa');floatXP('+ missão','#a78bfa',ev);save();
}

/* ===== MAPA DE CONHECIMENTO (fase 4) =====
   100% cliente, 100% dados reais: agrega S.recall por tema via questionPool().
   Tema só aparece com ≥5 perguntas vistas; antes disso não há sinal honesto. */
function renderMapa(){
  const el=document.getElementById('kmap');if(!el)return;
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const themes={};
  questionPool().forEach(q=>{
    const r=S.recall[q.id];if(!r||!r.seen)return;
    const th=themes[q.tema]=themes[q.tema]||{n:0,seen:0,correct:0,qs:[]};
    th.n++;th.seen+=r.seen;th.correct+=r.correct;th.qs.push({q,r});
  });
  const ids=Object.keys(themes);
  if(!ids.length){el.innerHTML='<div class="up-empty">Ainda sem dados de revisão. Responde ao lote diário e o mapa desenha-se sozinho.</div>';return;}
  el.innerHTML=ids.sort((a,b)=>themes[b].n-themes[a].n).map(id=>{
    const t=themes[id];const meta=RECALL_THEMES[id]||{label:id,color:'var(--sky)'};
    if(t.n<5)return `<div class="km-row km-insuf">
      <div class="km-head"><span class="wchip" style="border-color:${meta.color};color:${meta.color}">${meta.label}</span>
      <span class="km-note">dados insuficientes (${t.n}/5 perguntas vistas) — continua a responder</span></div></div>`;
    const pct=Math.round(t.correct/t.seen*100);
    const worst=t.qs.sort((a,b)=>a.r.ease-b.r.ease).slice(0,2);
    return `<div class="km-row">
      <div class="km-head"><span class="wchip" style="border-color:${meta.color};color:${meta.color}">${meta.label}</span>
        <b class="km-pct" style="color:${pct>=75?'var(--em)':pct>=50?'var(--orange)':'var(--red)'}">${pct}%</b>
        <span class="km-note">${t.n} perguntas · ${t.seen} respostas</span></div>
      <div class="km-bar"><div style="width:${pct}%;background:${meta.color}"></div></div>
      ${worst.map(w=>`<div class="km-weak">▾ ${esc(w.q.q.slice(0,90))}${w.q.q.length>90?'…':''} <span class="km-ease">${w.q.id} · ease ${w.r.ease.toFixed(2)}</span></div>`).join('')}
    </div>`;
  }).join('');
}

async function sendConselho(){
  if(ocBusy)return;
  const inp=document.getElementById('oc-in');const qtxt=(inp.value||'').trim();
  if(!qtxt)return;
  if(!USER||!sb){toast('Sem sessão','Entra com a tua conta para falares com o Oráculo.','#fb923c');return;}
  if(ocQuotaLeft()<=0){toast('Limite diário','12 mensagens/dia — guarda a pergunta para amanhã.','#fb923c');return;}
  inp.value='';ocBusy=true;renderConselho();
  ocBubble('oc-user',qtxt);
  OC_HIST.push({role:'user',content:qtxt});
  /* contador no estado — incrementa e grava ANTES da chamada; o servidor revalida */
  const t=today();
  if(!S.oracleChat||S.oracleChat.d!==t)S.oracleChat={d:t,count:0};
  S.oracleChat.count++;save();
  const th=ocTheaterStart();
  let ok=false;
  try{
    const{data:{session}}=await sb.auth.getSession();
    const r=await fetch(SUPABASE_URL+'/functions/v1/oraculo?mode=chat',{
      method:'POST',
      headers:{'content-type':'application/json','apikey':SUPABASE_ANON,'authorization':'Bearer '+session.access_token},
      body:JSON.stringify({messages:OC_HIST.slice(-8)})
    });
    const j=await r.json().catch(()=>({}));
    th.stop();
    if(r.ok&&j.reply){
      ok=true;
      OC_HIST.push({role:'assistant',content:j.reply});
      if(window.Bus)Bus.emit('oracle:spoke'); // o mundo abranda e escuta (M12·S5)
      ocType(ocBubble('oc-orc',''),j.reply);
      ocOfferMission(j.reply);
    }else if(j.error==='limite'){
      ok=true; /* a mensagem contou de facto contra o limite do servidor */
      ocBubble('oc-orc','O Oráculo confirma: as 12 mensagens de hoje esgotaram. Guarda a pergunta — amanhã o Conselho volta a reunir.');
    }else{
      ocBubble('oc-orc','O Oráculo não respondeu ('+(j.error||('HTTP '+r.status))+'). A mensagem não contou para o limite — tenta outra vez.');
    }
  }catch(e){
    th.stop();
    ocBubble('oc-orc','Sem ligação ao Oráculo — verifica a rede. A mensagem não contou para o limite.');
  }
  /* o sistema nunca mente: chamada falhada não consome quota nem fica no histórico */
  if(!ok){
    if(S.oracleChat&&S.oracleChat.d===t)S.oracleChat.count=Math.max(0,S.oracleChat.count-1);
    if(OC_HIST.length&&OC_HIST[OC_HIST.length-1].role==='user')OC_HIST.pop();
  }
  ocBusy=false;save();
}
