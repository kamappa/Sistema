/* ===== CAMADA VISUAL (FX) =====
   Toast, XP flutuante, celebrações, contadores animados, fundo vivo
   (partículas + reveal ao scroll). Sem estado do Sistema — puramente
   visual. Extraído do index.html — Missão 2 fase 3. */

/* ===== TOAST ===== */
let tmr;
function toast(t,s,color,penalty){
  const el=document.getElementById('toast');
  document.getElementById('tt').textContent=t;document.getElementById('ts').textContent=s||'';
  el.classList.toggle('pen',!!penalty);
  document.getElementById('tk').textContent=penalty?'Aviso':'Sistema';
  if(color&&!penalty)el.style.borderColor=color;
  el.classList.add('show');clearTimeout(tmr);tmr=setTimeout(()=>el.classList.remove('show'),2800);
}
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
window.cineArise=function(){ // flash violeta + A R I S E + pulse + dupla vaga
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ov=document.createElement('div');ov.className='arise-ov';
  ov.innerHTML='<b>A R I S E</b>';document.body.appendChild(ov);
  setTimeout(()=>ov.remove(),1450);
  celebrate('#a78bfa');
  if(window.dustBurst)setTimeout(()=>dustBurst('#a78bfa'),300);
};
let lastRankL=null;
function rankCeremony(r){try{
  toast('RANK UP','⬆ Alcançaste o Rank '+r.l,r.color);
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
/* fundo vivo — palco em 3 camadas (Missão 3 v3 fase 1): estrelas ténues com
   parallax de scroll e brilho comandado pela hora, partículas com profundidade
   (70 desktop / 35 mobile), estrela cadente rara (60–120s) e rasto do rato
   (só pointer:fine). Guarda de FPS: se a frame média cair, corta densidade e
   desliga o rasto — nunca corta fps. Pausa com separador oculto; reduced-motion
   desliga tudo. */
(function(){
  const cv=document.getElementById('dust'); if(!cv) return;
  const cx=cv.getContext('2d');
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer:fine)').matches;
  let ps=[],stars=[],meteor=null,W=0,H=0,raf=0;
  let mobile=false,degraded=false,trailOn=fine,trailLive=0,lastTrail=0;
  let nextMeteor=performance.now()+60000+Math.random()*60000;
  let starGlow=1,glowT=0,ft=0,fn=0,lastT=0;
  function dayGlow(){ // estrelas plenas de noite, tímidas de dia (ciclo da F1)
    const d=new Date(),h=d.getHours()+d.getMinutes()/60;
    if(h>=21.5||h<5.5)return 1;
    if(h<8.5)return 1-(h-5.5)/3*.45;          // amanhecer 1 → .55
    if(h<17.5)return .55;
    return .55+(h-17.5)/4*.45;                // entardecer .55 → 1
  }
  function size(){
    const d=Math.min(devicePixelRatio||1,2);
    W=innerWidth;H=innerHeight;
    mobile=W<720||matchMedia('(pointer:coarse)').matches;
    cv.width=W*d;cv.height=H*d;
    cv.style.width=W+'px';cv.style.height=H+'px';
    cx.setTransform(d,0,0,d,0,0);
    const n=Math.round((mobile?35:70)*(degraded?.5:1));
    ps=Array.from({length:n},()=>{
      const z=.3+Math.random()*.7; // profundidade: 1 = perto (maior, mais rápido)
      return{x:Math.random()*W,y:Math.random()*H,z:z,
        r:(.5+Math.random()*1.7)*z,
        vy:-(.05+Math.random()*.22)*z,vx:(Math.random()-.5)*.08*z,
        ph:Math.random()*Math.PI*2,
        c:Math.random()<.18?'240,171,252':'167,139,250'};
    });
    const sn=Math.round((mobile?50:120)*(degraded?.5:1));
    stars=Array.from({length:sn},()=>{
      const z=.15+Math.random()*.85,big=Math.random()<.08;
      return{x:Math.random()*W,y:Math.random()*(H+8),z:z,
        r:(.4+z*1.05)*(big?1.5:1),vx:.003+z*.012,
        a:(.08+Math.random()*.28)*(big?1.5:1),
        tw:2600+Math.random()*5400,ph:Math.random()*Math.PI*2,
        c:Math.random()<.12?'200,190,255':'236,233,250'};
    });
  }
  function tick(t){
    /* guarda de FPS — mede a frame média; abaixo de ~48fps degrada uma vez */
    if(lastT){const dt=t-lastT;if(dt<200){ft+=dt;fn++;}
      if(fn>=150){if(!degraded&&ft/fn>21){degraded=true;trailOn=false;
        stars=stars.filter((_,i)=>i%2===0);
        let cut=Math.ceil(ps.filter(p=>p.life===undefined).length/2);
        ps=ps.filter(p=>p.life!==undefined||--cut>=0);}
        ft=0;fn=0;}}
    lastT=t;
    cx.clearRect(0,0,W,H);
    /* camada 1 — estrelas: cintilação lenta, deriva quase nula, parallax de scroll */
    const sc=scrollY||0,wrap=H+8;
    for(const s of stars){
      s.x+=s.vx;if(s.x>W+4)s.x=-4;
      let sy=(s.y-sc*(1-s.z)*.06)%wrap;if(sy<-4)sy+=wrap;
      const a=s.a*(.62+.38*Math.sin(t/s.tw+s.ph))*starGlow;
      cx.beginPath();cx.arc(s.x,sy,s.r,0,7);
      cx.fillStyle='rgba('+s.c+','+a.toFixed(3)+')';cx.fill();
    }
    if(t-glowT>5000){glowT=t;starGlow=dayGlow();}
    /* camada 3 — partículas com profundidade + bursts + rasto do rato */
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i];
      if(p.tr){ // rasto do rato: dissolve depressa, sem gravidade
        p.x+=p.vx;p.y+=p.vy;p.vx*=.92;p.vy*=.92;
        if(--p.life<=0){ps.splice(i,1);trailLive--;continue}
        cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);
        cx.fillStyle='rgba('+p.c+','+(.16*p.life/24).toFixed(3)+')';cx.fill();
        continue;
      }
      /* à chuva as partículas ambiente descem devagar; bursts não mudam */
      const vy=(p.life===undefined&&window.ambientRain)?Math.abs(p.vy)*.7:p.vy;
      p.y+=vy;p.x+=p.vx+(p.life===undefined?Math.sin(t/2400+p.ph)*.06*(p.z||1):0);
      if(p.life!==undefined){p.vy+=.02;if(--p.life<=0){ps.splice(i,1);continue}}
      else{
        if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
        if(p.y>H+4){p.y=-4;p.x=Math.random()*W}
        if(p.x<-4)p.x=W+4;else if(p.x>W+4)p.x=-4;
      }
      const a=p.life!==undefined?Math.min(.85,p.life/50):(.12+.12*Math.sin(t/1600+p.ph))*(.5+.5*(p.z||1));
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);
      cx.fillStyle='rgba('+p.c+','+a.toFixed(3)+')';cx.fill();
    }
    /* estrela cadente — rara, atravessa em ~1s com rasto em gradiente */
    if(!meteor&&t>nextMeteor){
      const ltr=Math.random()<.5,sp=(6+Math.random()*4)*(mobile?.7:1);
      meteor={x:ltr?-40:W+40,y:20+Math.random()*H*.35,
        vx:ltr?sp:-sp,vy:sp*(.25+Math.random()*.2),age:0,dur:60+Math.random()*25};
      nextMeteor=t+60000+Math.random()*60000;
    }
    if(meteor){
      const m=meteor;m.x+=m.vx;m.y+=m.vy;m.age++;
      const k=m.age/m.dur,env=Math.sin(Math.PI*Math.min(1,k));
      const tl=(mobile?60:100),tx=m.x-m.vx*tl/Math.abs(m.vx),ty=m.y-m.vy*tl/Math.abs(m.vx);
      const g=cx.createLinearGradient(m.x,m.y,tx,ty);
      g.addColorStop(0,'rgba(226,220,255,'+(.75*env).toFixed(3)+')');
      g.addColorStop(1,'rgba(167,139,250,0)');
      cx.strokeStyle=g;cx.lineWidth=1.4;cx.lineCap='round';
      cx.beginPath();cx.moveTo(m.x,m.y);cx.lineTo(tx,ty);cx.stroke();
      cx.beginPath();cx.arc(m.x,m.y,1.6,0,7);
      cx.fillStyle='rgba(240,238,255,'+(.9*env).toFixed(3)+')';cx.fill();
      if(k>=1||m.x<-120||m.x>W+120||m.y>H+40)meteor=null;
    }
    raf=requestAnimationFrame(tick);
  }
  /* rasto do rato — só desktop; imperceptível quando o cursor está parado */
  if(fine)addEventListener('pointermove',e=>{
    if(!trailOn||!raf||rm.matches)return;
    const n=performance.now();
    if(n-lastTrail<26||trailLive>=8)return;
    lastTrail=n;trailLive++;
    ps.push({x:e.clientX+(Math.random()-.5)*6,y:e.clientY+(Math.random()-.5)*6,
      vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6-.15,
      r:.6+Math.random()*1.1,life:24,tr:true,c:'196,178,255'});
  },{passive:true});
  /* rebentamento efémero (level-up); gancho reutilizável pela fase C */
  window.dustBurst=function(hex){
    if(rm.matches)return;
    let c='167,139,250';
    if(/^#[0-9a-f]{6}$/i.test(hex||''))c=parseInt(hex.slice(1,3),16)+','+parseInt(hex.slice(3,5),16)+','+parseInt(hex.slice(5,7),16);
    const b=document.getElementById('rankbadge'),r=b?b.getBoundingClientRect():null;
    const bx=(r&&r.top>0&&r.top<H)?r.left+r.width/2:W/2;
    const by=(r&&r.top>0&&r.top<H)?r.top+r.height/2:Math.min(140,H/3);
    for(let i=0;i<26;i++){
      const an=Math.random()*Math.PI*2,sp=.8+Math.random()*2.4;
      ps.push({x:bx,y:by,r:1+Math.random()*1.8,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-.6,ph:0,c:c,life:70+Math.random()*30});
    }
    start();
  };
  const start=()=>{if(!raf&&!rm.matches&&!document.hidden)raf=requestAnimationFrame(tick)};
  const stop=()=>{cancelAnimationFrame(raf);raf=0;cx.clearRect(0,0,W,H)};
  addEventListener('resize',size);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  rm.addEventListener('change',()=>rm.matches?stop():start());
  window.dustStart=start;
  size();if(!document.documentElement.classList.contains('boot'))start();
})();

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
