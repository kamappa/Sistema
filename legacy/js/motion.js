/* ===== MOTION (Missão 12 · Sprint 1 · 1C) =====
   Tokens de motion + springs físicas para a UI DOM. Regra: nada de easing
   linear — o cursor/estado define o alvo, a mola persegue-o com inércia.
   Um único loop rAF partilhado que DORME quando todas as molas assentam
   (custo zero em idle). Só desktop (pointer:fine); reduced-motion desliga
   em runtime e repõe os transforms. Script clássico, como o resto da UI. */

window.Motion=(function(){
  /* tokens — rigidez k / amortecimento c (crítico: c=2√k).
     snappy: presses e botões magnéticos (leve overshoot vivo)
     gentle: tilt de painéis e glow do cursor (crítico, sem oscilar)
     slow:   massas grandes (aurora) */
  const TOK={snappy:{k:260,c:30},gentle:{k:120,c:22},slow:{k:50,c:14},
    fill:{k:60,c:15}}; /* barras: ligeiramente sub-amortecida — passa um fio além do alvo e assenta */
  const springs=new Set();let raf=0,last=0;
  function loop(now){
    raf=0;
    const dt=Math.min(.05,(now-last)/1000)||.016;last=now;
    let live=false;
    for(const s of[...springs]){if(s.step(dt))live=true;else springs.delete(s);}
    if(live)raf=requestAnimationFrame(loop);
  }
  const wake=s=>{springs.add(s);if(!raf){last=performance.now();raf=requestAnimationFrame(loop);}};
  class Spring{ // n dimensões; apply(x) recebe o vetor atual a cada passo
    constructor(n,tok,apply){
      this.x=new Array(n).fill(0);this.v=new Array(n).fill(0);this.t=new Array(n).fill(0);
      this.k=tok.k;this.c=tok.c;this.apply=apply;
    }
    set(...t){this.t=t;wake(this);}
    snap(...t){this.t=t;this.x=[...t];this.v.fill(0);this.apply(this.x);}
    step(dt){
      let live=false;
      for(let i=0;i<this.x.length;i++){
        const a=(this.t[i]-this.x[i])*this.k-this.v[i]*this.c;
        this.v[i]+=a*dt;this.x[i]+=this.v[i]*dt;
        if(Math.abs(this.v[i])>.005||Math.abs(this.t[i]-this.x[i])>.005)live=true;
        else{this.x[i]=this.t[i];this.v[i]=0;}
      }
      this.apply(this.x);
      return live;
    }
  }
  return{TOK,Spring};
})();

/* barras com física (Missão 12 · 3A) — a largura enche por mola. O registo é
   por CHAVE, não por elemento: sobrevive aos re-renders por innerHTML (o
   elemento novo nasce onde a mola ia e a mola continua). Reduced-motion ou
   primeiro render: valor direto, sem animação. */
window.Motion.fillBar=(function(){
  const reg={},rm=matchMedia('(prefers-reduced-motion: reduce)');
  return function(key,el,pct){
    if(!el)return;
    if(rm.matches){el.style.width=pct+'%';if(reg[key])reg[key].sp.snap(pct);return;}
    let b=reg[key];
    if(!b){
      b=reg[key]={el:el,sp:null};
      b.sp=new Motion.Spring(1,Motion.TOK.fill,
        x=>{if(b.el)b.el.style.width=Math.max(0,x[0]).toFixed(2)+'%';});
      b.sp.snap(pct);el.style.width=pct+'%';
      return;
    }
    b.el=el;
    el.style.width=Math.max(0,b.sp.x[0]).toFixed(2)+'%';
    b.sp.set(pct);
  };
})();

/* presença com física — tilt 3D, botões magnéticos, aurora e glow que segue o
   cursor (substitui o transform direto por pointermove que vivia no fx.js) */
(function(){
  if(!matchMedia('(pointer:fine)').matches)return;
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const M=window.Motion,aurora=document.querySelector('.aurora');
  let panel=null,btn=null;
  const sTilt=new M.Spring(2,M.TOK.gentle,x=>{
    if(!panel)return;
    panel.style.transform=(Math.abs(x[0])+Math.abs(x[1])>.01)
      ?'perspective(900px) rotateX('+x[0].toFixed(2)+'deg) rotateY('+x[1].toFixed(2)+'deg)':'';
  });
  const sGlow=new M.Spring(2,M.TOK.gentle,x=>{
    if(!panel)return;
    panel.style.setProperty('--mx',x[0].toFixed(1)+'%');
    panel.style.setProperty('--my',x[1].toFixed(1)+'%');
  });
  const sBtn=new M.Spring(2,M.TOK.snappy,x=>{
    if(!btn)return;
    btn.style.transform=(Math.abs(x[0])+Math.abs(x[1])>.05)
      ?'translate('+x[0].toFixed(1)+'px,'+x[1].toFixed(1)+'px)':'';
  });
  const sAur=new M.Spring(2,M.TOK.slow,x=>{
    if(aurora)aurora.style.transform='translate('+x[0].toFixed(0)+'px,'+x[1].toFixed(0)+'px)';
  });
  function reset(){
    if(panel){panel.style.transform='';panel=null;}
    if(btn){btn.style.transform='';btn=null;}
    if(aurora)aurora.style.transform='';
    sTilt.snap(0,0);sBtn.snap(0,0);sAur.snap(0,0);
  }
  document.addEventListener('pointermove',e=>{
    if(rm.matches)return;
    const p=e.target.closest?e.target.closest('.panel'):null;
    if(panel!==p){
      if(panel)panel.style.transform=''; // o painel que fica para trás solta-se já
      panel=p;sTilt.snap(0,0);
      if(p){const r=p.getBoundingClientRect(); // o glow nasce onde o cursor entra
        sGlow.snap((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);}
    }
    if(p){const r=p.getBoundingClientRect();
      sTilt.set(-((e.clientY-r.top)/r.height-.5)*3,((e.clientX-r.left)/r.width-.5)*3);
      sGlow.set((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);
    }
    const b=e.target.closest?e.target.closest('.btn,.mini,.rc-btn,.notif-btn,.cal-nav,.antbtn'):null;
    if(btn!==b){if(btn)btn.style.transform='';btn=b;sBtn.snap(0,0);}
    if(b){const r=b.getBoundingClientRect();
      sBtn.set(((e.clientX-r.left)/r.width-.5)*5,((e.clientY-r.top)/r.height-.5)*5);
    }
    sAur.set((e.clientX/innerWidth-.5)*36,(e.clientY/innerHeight-.5)*24);
  },{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget)reset()});
  rm.addEventListener('change',()=>{if(rm.matches)reset()});
})();
