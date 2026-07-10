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
function celebrate(color){try{
  const f=document.createElement('div');f.className='lvlflash';
  f.style.setProperty('--fc',(color||'#a78bfa')+'55');
  document.body.appendChild(f);setTimeout(()=>f.remove(),950);
  if(window.dustBurst)dustBurst(color);
}catch(err){}}
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
/* fundo vivo: partículas — pausa se separador oculto ou reduced-motion (Missão 3 fase A) */
(function(){
  const cv=document.getElementById('dust'); if(!cv) return;
  const cx=cv.getContext('2d');
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  let ps=[],W=0,H=0,raf=0;
  function size(){
    const d=Math.min(devicePixelRatio||1,2);
    W=innerWidth;H=innerHeight;
    cv.width=W*d;cv.height=H*d;
    cv.style.width=W+'px';cv.style.height=H+'px';
    cx.setTransform(d,0,0,d,0,0);
    const n=Math.min(70,Math.round(W*H/22000));
    ps=Array.from({length:n},()=>({
      x:Math.random()*W,y:Math.random()*H,
      r:.6+Math.random()*1.6,
      vy:-(.06+Math.random()*.22),vx:(Math.random()-.5)*.08,
      ph:Math.random()*Math.PI*2,
      c:Math.random()<.18?'240,171,252':'167,139,250'
    }));
  }
  function tick(t){
    cx.clearRect(0,0,W,H);
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i];
      p.y+=p.vy;p.x+=p.vx+(p.life===undefined?Math.sin(t/2400+p.ph)*.06:0);
      if(p.life!==undefined){p.vy+=.02;if(--p.life<=0){ps.splice(i,1);continue}}
      else{
        if(p.y<-4){p.y=H+4;p.x=Math.random()*W}
        if(p.x<-4)p.x=W+4;else if(p.x>W+4)p.x=-4;
      }
      const a=p.life!==undefined?Math.min(.85,p.life/50):.14+.12*Math.sin(t/1600+p.ph);
      cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);
      cx.fillStyle='rgba('+p.c+','+a.toFixed(3)+')';cx.fill();
    }
    raf=requestAnimationFrame(tick);
  }
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
  size();start();
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
