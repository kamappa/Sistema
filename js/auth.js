/* ===== AUTH / PERSISTÊNCIA / BOOT =====
   Supabase (auth de utilizador único), localStorage, cloudSave com
   debounce, bootState e init() — este ficheiro carrega em ÚLTIMO.
   Extraído do index.html — Missão 2 fase 4d. */




/* ===== SUPABASE / STORAGE ===== */
const KEY='sistema_daniel_v1';
const SUPABASE_URL='https://zybrgnhepspledkjbllo.supabase.co';
const SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5YnJnbmhlcHNwbGVka2pibGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NDAyMjksImV4cCI6MjA5ODUxNjIyOX0.J9nKTp38Wff-0MuqS5mVZs5-XZKRlVYxY9BQOQP_cUM';
const sb=(window.supabase&&window.supabase.createClient)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON):null;
let USER=null,syncTimer=null;

function setSync(m){const el=document.getElementById('sync-st');if(!el)return;
  if(m==='ok')el.textContent='☁️ Sincronizado'+(USER?' · '+USER.email:'');
  else if(m==='saving')el.textContent='⏳ A sincronizar…';
  else if(m==='err')el.textContent='⚠️ Sem ligação à nuvem — guardado localmente';
  else el.textContent='💾 Só neste dispositivo (sem conta)';}

function localLoad(){try{return localStorage.getItem(KEY)}catch(e){return null}}
function localSave(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}

async function cloudLoad(){
  const{data,error}=await sb.from('app_state').select('state').eq('user_id',USER.id).maybeSingle();
  if(error)throw error;return data?data.state:null;
}
async function cloudSave(){
  if(!USER||!sb)return;
  try{
    const{error}=await sb.from('app_state').upsert({user_id:USER.id,state:S,updated_at:new Date().toISOString()});
    setSync(error?'err':'ok');
  }catch(e){setSync('err');}
}

/* ===== AUTH ===== */
function authErr(msg,ok){const el=document.getElementById('au-err');el.textContent=msg||'';el.classList.toggle('ok',!!ok);}
function showAuth(){document.getElementById('auth-ov').classList.add('show');}
function hideAuth(){document.getElementById('auth-ov').classList.remove('show');}
async function doLogin(){
  if(!sb){authErr('Sem ligação ao Supabase.');return;}
  const em=document.getElementById('au-email').value.trim(),pw=document.getElementById('au-pass').value;
  if(!em||!pw){authErr('Preenche email e password.');return;}
  authErr('A entrar…',true);
  const{data,error}=await sb.auth.signInWithPassword({email:em,password:pw});
  if(error){authErr(error.message==='Invalid login credentials'?'Credenciais inválidas.':error.message);return;}
  USER=data.user;await enterSystem();
}
async function doSignup(){
  if(!sb){authErr('Sem ligação ao Supabase.');return;}
  const em=document.getElementById('au-email').value.trim(),pw=document.getElementById('au-pass').value;
  if(!em||pw.length<6){authErr('Email válido e password com 6+ caracteres.');return;}
  authErr('A criar conta…',true);
  const{data,error}=await sb.auth.signUp({email:em,password:pw});
  if(error){authErr(error.message);return;}
  if(data.session){USER=data.user;await enterSystem();}
  else authErr('Conta criada. Confirma o email que recebeste e depois clica Entrar.',true);
}
function goOffline(){USER=null;hideAuth();bootState();}
async function doLogout(){if(sb)await sb.auth.signOut();location.reload();}
async function enterSystem(){
  hideAuth();document.getElementById('logout-btn').style.display='';
  await bootState();
  toast('Sistema ligado','Bem-vindo, Operador. Sincronização ativa.','#a78bfa');
}

/* ===== PERSIST ===== */
function save(){render();localSave();
  if(USER){setSync('saving');clearTimeout(syncTimer);syncTimer=setTimeout(cloudSave,900);}}

/* ===== INIT ===== */
async function bootState(){
  let cloud=null;
  if(USER){try{cloud=await cloudLoad()}catch(e){setSync('err');}}
  if(cloud){S=cloud;}
  else{
    const raw=localLoad();
    if(raw){try{S=JSON.parse(raw)}catch(e){S=fresh()}}else S=fresh();
  }
  if(!S.attrs)S=fresh();S.log=S.log||[];S.history=S.history||[{d:today(),v:0}];S.seenAch=S.seenAch||[];S.debuffs=S.debuffs||{};S.events=S.events||[];S.notified=S.notified||{};
  S.whisper=S.whisper||{};S.titleEv=S.titleEv||{};S.titleUnlocked=S.titleUnlocked||{};S.worldArc=S.worldArc||null;S.recovery=S.recovery||null;S.weather=S.weather||null;
  S.training=S.training||{prog:{push:0,pull:0,legs:0,core:0},sessions:[]};S.training.prog=S.training.prog||{push:0,pull:0,legs:0,core:0};S.training.sessions=S.training.sessions||[];
  S.sleep=S.sleep||{bedT:'23:30',wakeT:'07:30',logs:[]};S.sleep.logs=S.sleep.logs||[];
  S.objectives=S.objectives||[];S.shadows=S.shadows||[];S.oracle=S.oracle||{reports:[]};S.radarAccepted=S.radarAccepted||{};
  S.recall=S.recall||{};
  S.recallToday=S.recallToday||null;
  if(S.recallToday&&!S.recallToday.results)S.recallToday.results={};
  S.customQ=S.customQ||[];
  S.studyStreak=S.studyStreak||{count:0,lastDay:null};
  await loadQuestionBank();
  getDailyRecallSet();
  if(!S.migratedQuests){
    (S.quests||[]).forEach((q,i)=>{
      const pri=q.tier==='side'?'P3':q.tier==='main'?'P1':'BOSS';
      S.objectives.push({id:'o'+Date.now()+'_'+i,title:q.title,area:q.attr,pri,auto:false,deadline:null,status:q.done?'done':'pend',created:today(),tags:[diffTag(q.title.toLowerCase())],arc:q.arc||null});
    });
    delete S.quests;S.migratedQuests=true;
  }
  S.v=4;
  calInit();fetchWeather();
  // quebra streaks antigas
  [...S.oblig,...S.extras].forEach(h=>{if(h.lastDone&&h.lastDone!==today()&&h.lastDone!==yday())h.streak=0});
  if(S.studyStreak.lastDay&&S.studyStreak.lastDay!==today()&&S.studyStreak.lastDay!==yday())S.studyStreak.count=0;
  processDayClose();
  render();localSave();
  if(USER){cloudSave();loadOracleData();}else setSync('local');
  if(pendingPenalty>0){setTimeout(()=>toast('Dia fechado','Perdeste '+pendingPenalty+' XP por obrigatórios em falta','#ef4444',true),700);pendingPenalty=0;}
}
async function init(){
  document.getElementById('nh-a').innerHTML=ATTRS.map(a=>`<option value="${a.id}">${a.name}</option>`).join('');
  document.getElementById('cq-tema').innerHTML=Object.entries(RECALL_THEMES).map(([id,t])=>`<option value="${id}">${t.label}</option>`).join('');
  if(sb){
    try{
      const{data:{session}}=await sb.auth.getSession();
      if(session){USER=session.user;document.getElementById('logout-btn').style.display='';await bootState();return;}
    }catch(e){}
    showAuth();
  }else{
    await bootState();
  }
}
init();
