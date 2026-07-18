/* ===== CAMADA VISUAL (FX) =====
   Toast, XP flutuante, celebrações, contadores animados, fundo vivo
   (partículas + reveal ao scroll). Sem estado do Sistema — puramente
   visual. Extraído do index.html — Missão 2 fase 3. */

/* ===== TOAST =====
   Duração: base 5s + 60ms/carácter (teto 12s); eventos importantes
   (penalizações, rank up, títulos) ficam 15s ou até dispensar. Hover/toque
   pausa o temporizador; o ✕ dispensa. */
let tmr,tRemain=0,tLast=0,tPaused=false;
function toast(t,s,color,penalty,important){
  const el=document.getElementById('toast');
  document.getElementById('tt').textContent=t;document.getElementById('ts').textContent=s||'';
  el.classList.toggle('pen',!!penalty);
  document.getElementById('tk').textContent=penalty?'Aviso':'Sistema';
  if(color&&!penalty)el.style.borderColor=color;
  el.classList.add('show');
  const n=((t||'')+(s||'')).length;
  tRemain=(important||penalty)?15000:Math.min(12000,5000+60*n);
  tPaused=false;armToast();
}
function armToast(){clearTimeout(tmr);if(tPaused)return;tLast=Date.now();tmr=setTimeout(hideToast,tRemain);}
function hideToast(){clearTimeout(tmr);tPaused=false;const el=document.getElementById('toast');if(el)el.classList.remove('show');}
function pauseToast(){if(tPaused)return;tPaused=true;clearTimeout(tmr);tRemain=Math.max(0,tRemain-(Date.now()-tLast));}
function resumeToast(){if(!tPaused)return;tPaused=false;if(tRemain<800)tRemain=800;armToast();}
(function(){
  const el=document.getElementById('toast');if(!el)return;
  el.addEventListener('mouseenter',pauseToast);
  el.addEventListener('mouseleave',resumeToast);
  el.addEventListener('touchstart',pauseToast,{passive:true});
  el.addEventListener('touchend',resumeToast,{passive:true});
})();
function floatXP(txt,color,ev){try{
  const e=ev||window.event;const x=e&&e.clientX?e.clientX:innerWidth/2,y=e&&e.clientY?e.clientY:130;
  const s=document.createElement('div');s.className='fxp';s.textContent=txt;
  s.style.left=x+'px';s.style.top=y+'px';s.style.color=color||'#a78bfa';
  document.body.appendChild(s);setTimeout(()=>s.remove(),960);
}catch(err){}}
function cinePulse(){ // 200ms de blur — reservado aos momentos altos (M3v2 fase 4)
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const w=document.querySelector('.wrap');if(!w)return;
  w.classList.remove('cine');void w.offsetWidth;w.classList.add('cine');
}
function celebrate(color){try{
  const f=document.createElement('div');f.className='lvlflash';
  f.style.setProperty('--fc',(color||'#a78bfa')+'55');
  document.body.appendChild(f);setTimeout(()=>f.remove(),950);
  if(window.dustBurst)dustBurst(color);
  cinePulse();
}catch(err){}}
/* momento cinematográfico genérico (F5 v3) — escurece, luz cresce, texto entra
   devagar, dissolve; sem som. Devolve false com reduced-motion ou se já há um
   momento no ecrã (o chamador usa o toast como fallback). */
window.cineMoment=function(kicker,title,glow){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
  if(document.querySelector('.cine-ov'))return false;
  const ov=document.createElement('div');ov.className='cine-ov';
  if(glow){ov.style.setProperty('--cc',glow);ov.style.setProperty('--ct',glow.replace(/[\d.]+\)$/,'.85)'));}
  const k=document.createElement('div');k.className='ck';k.textContent=kicker;
  const b=document.createElement('b');b.textContent=title;
  ov.append(k,b);document.body.appendChild(ov);
  setTimeout(()=>ov.remove(),2650);
  return true;
};
window.cineArise=function(){ // A R I S E cinematográfico + pulse + dupla vaga
  if(!cineMoment('Sistema','A R I S E','rgba(139,92,246,.22)'))return;
  celebrate('#a78bfa');
  if(window.dustBurst)setTimeout(()=>dustBurst('#a78bfa'),350);
};
let lastRankL=null;
function rankCeremony(r){try{
  toast('RANK UP','⬆ Alcançaste o Rank '+r.l,r.color,false,true);
  celebrate(r.color);
  const rb=document.getElementById('rankbadge');
  if(rb){rb.classList.remove('rankpop');void rb.offsetWidth;rb.classList.add('rankpop');}
  if(window.dustBurst)setTimeout(()=>dustBurst(r.color),350);
}catch(err){}}
/* contador animado — retoma do valor visível; direto com reduced-motion/página oculta */
const numAnim={};
function setNum(id,val,fmt){
  fmt=fmt||(v=>String(Math.round(v)));
  const el=document.getElementById(id);if(!el)return;
  const prev=numAnim[id]?numAnim[id].val:(parseFloat((el.textContent||'').replace(/[^\d.-]/g,''))||0);
  if(numAnim[id]&&numAnim[id].raf)cancelAnimationFrame(numAnim[id].raf);
  if(Math.abs(val-prev)<1||document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent=fmt(val);numAnim[id]={val:val};return;
  }
  const t0=performance.now(),dur=600;
  function step(now){
    const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3),v=prev+(val-prev)*e;
    el.textContent=fmt(v);numAnim[id].val=v;
    if(k<1)numAnim[id].raf=requestAnimationFrame(step);
    else numAnim[id]={val:val};
  }
  numAnim[id]={val:prev,raf:requestAnimationFrame(step)};
}
/* fundo vivo — desde a Missão 12 (Sprint 1, fase 1A) o palco é WebGL e vive
   em js/stage/ (ilha de ES modules, Three.js vendorizado em js/vendor/). A
   façade clássica (dustStart, dustBurst, dustSpark) é exposta lá com os
   mesmos nomes e semântica — por isso celebrate/rankCeremony/barBurst e o
   boot sequence continuam intactos. */

/* mini-burst na ponta da barra de um atributo que ganhou XP (F3 v3) —
   espera pelo render para ler a largura nova; só se a barra estiver no viewport */
window.barBurst=function(attr){
  setTimeout(()=>{try{
    const f=document.querySelector('#attrs .afill[data-a="'+attr+'"]');if(!f)return;
    const r=f.getBoundingClientRect();
    if(!r.width||r.bottom<0||r.top>innerHeight)return;
    const c=(window.AM&&AM[attr])?AM[attr].color:'#a78bfa';
    if(window.dustSpark)dustSpark(r.right,r.top+r.height/2,c,3+Math.floor(Math.random()*3));
  }catch(e){}},180);
};

/* topbar glass (F3 v3) — aparece depois do herói, encolhe em scroll fundo */
(function(){
  const tb=document.getElementById('topbar');if(!tb)return;
  let tick=false;
  function upd(){tick=false;
    tb.classList.toggle('on',scrollY>430);
    tb.classList.toggle('mini',scrollY>1100);}
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
  upd();
})();

/* scanline única — varre um painel de cima a baixo quando chega conteúdo novo (F2 v3) */
window.panelScan=function(el){
  if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const p=el.closest('.panel')||el;
  if(p.querySelector(':scope>.scanline'))return;
  const s=document.createElement('div');s.className='scanline';p.appendChild(s);
  const a=s.animate(
    [{transform:'translateY(0)',opacity:0},{opacity:.9,offset:.1},{opacity:.6,offset:.85},
     {transform:'translateY('+Math.max(0,p.clientHeight-2)+'px)',opacity:0}],
    {duration:1500,easing:'cubic-bezier(.4,0,.2,1)'});
  a.onfinish=a.oncancel=()=>s.remove();
};

/* máquina de escrever do Sistema — sysType (texto simples) e sysTypeHTML (tags intactas) */
const typers=[];
window.sysTypeFlush=()=>typers.splice(0).forEach(f=>f());
window.sysType=function(el,ms){
  if(!el||!el.textContent||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const txt=el.textContent;let i=0,fast=false;typers.push(()=>fast=true);
  el.textContent='';el.classList.add('typing');
  (function step(){
    if(fast||i>=txt.length){el.textContent=txt;el.classList.remove('typing');return}
    el.textContent=txt.slice(0,++i);setTimeout(step,ms||20);
  })();
};
window.sysTypeHTML=function(els,budget){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const nodes=[];els.forEach(el=>(function walk(n){[...n.childNodes].forEach(c=>{
    if(c.nodeType===3&&c.nodeValue.trim()){nodes.push([c,c.nodeValue]);c.nodeValue='';}
    else if(c.nodeType===1)walk(c)})})(el));
  const total=nodes.reduce((s,x)=>s+x[1].length,0);if(!total)return;
  const ms=Math.max(5,Math.min(20,(budget||2500)/total));
  let ni=0,ci=0,fast=false;typers.push(()=>fast=true);
  document.addEventListener('click',sysTypeFlush,{once:true});
  (function step(){
    if(fast){for(let j=ni;j<nodes.length;j++)nodes[j][0].nodeValue=nodes[j][1];return}
    const nt=nodes[ni];nt[0].nodeValue=nt[1].slice(0,++ci);
    if(ci>=nt[1].length){ni++;ci=0}
    if(ni<nodes.length)setTimeout(step,ms);
  })();
};

/* boot sequence — fundo (400ms) → partículas → saudação escrita → painéis em stagger.
   Total ~2.1s, saltável com clique, só na 1ª abertura da sessão (flag no <head>). */
(function(){
  const R=document.documentElement;
  if(!R.classList.contains('boot'))return;
  try{sessionStorage.setItem('sysboot','1')}catch(e){}
  const timers=[];let live=true;
  const at=(ms,fn)=>timers.push(setTimeout(fn,ms));
  function typeGreet(){const el=document.getElementById('greet-h');
    if(!el||!el.textContent){if(live)at(120,typeGreet);return}sysType(el,20);}
  function finish(){if(!live)return;live=false;timers.forEach(clearTimeout);
    R.classList.add('boot-on','boot-greet');R.classList.remove('boot');
    sysTypeFlush();if(window.dustStart)dustStart();}
  document.addEventListener('click',finish,{once:true});
  at(60,()=>R.classList.add('boot-on'));
  at(420,()=>{if(window.dustStart)dustStart()});
  at(620,()=>{R.classList.add('boot-greet');typeGreet()});
  at(1150,()=>{live=false;R.classList.remove('boot')});
})();

/* reveal ao entrar no viewport — painéis abaixo da dobra erguem-se ao scroll */
(function(){
  if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll('.reveal')].filter(el=>el.getBoundingClientRect().top>innerHeight);
  if(!els.length)return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }),{rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>{el.classList.add('io');io.observe(el)});
})();

/* presença — tilt 3D, botões magnéticos, aurora segue o rato (Missão 3v2 fase 3)
   Só desktop (pointer:fine); reduced-motion desliga em runtime. */
document.addEventListener('animationend',e=>{ // liberta o transform após o rise
  if(e.animationName==='rise'&&e.target.classList.contains('reveal'))
    e.target.classList.remove('reveal','io','in');
});
(function(){
  if(!matchMedia('(pointer:fine)').matches)return;
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const aurora=document.querySelector('.aurora');
  let curP=null,curB=null,lastA=0;
  const reset=()=>{if(curP){curP.style.transform='';curP=null}
    if(curB){curB.style.transform='';curB=null}
    if(aurora)aurora.style.transform='';};
  document.addEventListener('pointermove',e=>{
    if(rm.matches)return;
    const p=e.target.closest?e.target.closest('.panel'):null;
    if(curP&&curP!==p){curP.style.transform='';}
    curP=p;
    if(p){const r=p.getBoundingClientRect();
      const kx=(e.clientY-r.top)/r.height-.5,ky=(e.clientX-r.left)/r.width-.5;
      p.style.transform='perspective(900px) rotateX('+(-kx*3).toFixed(2)+'deg) rotateY('+(ky*3).toFixed(2)+'deg)';}
    const b=e.target.closest?e.target.closest('.btn,.mini,.rc-btn,.notif-btn,.cal-nav,.antbtn'):null;
    if(curB&&curB!==b){curB.style.transform='';}
    curB=b;
    if(b){const r=b.getBoundingClientRect();
      b.style.transform='translate('+(((e.clientX-r.left)/r.width-.5)*5).toFixed(1)+'px,'
                                    +(((e.clientY-r.top)/r.height-.5)*5).toFixed(1)+'px)';}
    if(aurora&&e.timeStamp-lastA>200){lastA=e.timeStamp;
      aurora.style.transform='translate('+((e.clientX/innerWidth-.5)*36).toFixed(0)+'px,'
                                         +((e.clientY/innerHeight-.5)*24).toFixed(0)+'px)';}
  },{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget)reset()});
  rm.addEventListener('change',()=>{if(rm.matches)reset()});
})();

/* motor de ambiente — ciclo do dia com meteo (Missão 3v2 fase 1)
   Interpola --amb1/2/3 e --horizon entre âncoras horárias, ao minuto.
   Meteo (S.weather): chuva dessatura e abranda; céu limpo aviva.
   Sem JS os defaults CSS são o estado noturno. */
(function(){
  const A=[ // [hora, amb1, amb2, horizonte] — rgba em arrays
    [0,  [139,92,246,.14],[240,171,252,.09],[217,70,239,0]],
    [2,  [76,29,149,.10], [30,58,138,.10],  [249,115,22,0]],
    [5,  [67,56,202,.12], [30,64,175,.10],  [251,146,60,.02]],
    [7.5,[139,92,246,.14],[251,191,36,.09], [251,146,60,.10]],
    [10, [139,92,246,.19],[240,171,252,.12],[251,146,60,0]],
    [13, [147,107,255,.22],[240,171,252,.13],[251,146,60,0]],
    [17, [139,92,246,.18],[244,114,182,.11],[251,146,60,.04]],
    [19.5,[168,85,247,.16],[244,114,182,.12],[249,115,22,.13]],
    [21.5,[139,92,246,.16],[240,171,252,.10],[217,70,239,.05]],
    [24, [139,92,246,.14],[240,171,252,.09],[217,70,239,0]],
  ];
  const mix=(c1,c2,k)=>c1.map((v,i)=>v+(c2[i]-v)*k);
  const css=c=>'rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+c[3].toFixed(3)+')';
  window.ambientRain=false;
  function apply(){
    const d=new Date(),h=d.getHours()+d.getMinutes()/60,st=document.documentElement.style;
    let i=0;while(i<A.length-2&&A[i+1][0]<=h)i++;
    const k=(h-A[i][0])/(A[i+1][0]-A[i][0]);
    let rain=false,clear=false;
    try{const w=S&&S.weather;
      if(w&&w.d===new Date().toISOString().slice(0,10)){rain=w.rain>=8;clear=w.rain===0;}}catch(e){}
    window.ambientRain=rain;
    const tune=c=>{let a=c[3];if(rain)a*=.65;if(clear)a*=1.15;
      return rain?[c[0]*.7+34,c[1]*.7+40,c[2]*.7+52,a]:[c[0],c[1],c[2],a]};
    const a1=tune(mix(A[i][1],A[i+1][1],k)),a2=tune(mix(A[i][2],A[i+1][2],k));
    st.setProperty('--amb1',css(a1));st.setProperty('--amb2',css(a2));
    st.setProperty('--amb3',css([a1[0],a1[1],a1[2],a1[3]*.45]));
    const hz=mix(A[i][3],A[i+1][3],k);hz[3]*=rain?.4:1;
    st.setProperty('--horizon',css(hz));
  }
  window.ambientApply=apply; // exposto para verificação e para o fetchWeather refrescar
  apply();setInterval(apply,60000);
})();
