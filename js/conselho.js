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
  const d=document.createElement('div');d.className='oc-think';
  d.innerHTML='<span class="dot"></span><span class="oc-think-t"></span>';
  log.appendChild(d);log.scrollTop=log.scrollHeight;
  const t=d.querySelector('.oc-think-t');let i=0;t.textContent=OC_THEATER[0];
  const iv=setInterval(()=>{i=(i+1)%OC_THEATER.length;t.textContent=OC_THEATER[i];},2200);
  return{stop:()=>{clearInterval(iv);d.remove();}};
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
      ocType(ocBubble('oc-orc',''),j.reply);
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
