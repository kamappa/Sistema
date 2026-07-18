import * as THREE from '../vendor/three.module.min.js';

/* Constelações (Missão 12 · Sprint 4 · 4A+4B) — o céu do Operador.
   4A: canvas WebGL próprio, estados acesa/descoberta/oculta por regras de
   evidência declaradas em CONSTELLATIONS (data.js) — nunca à mão.
   4B: vida — nevoeiro do domínio, fluxo de energia nas ligações acesas,
   paralaxe subtil com o cursor, hover com pulso, clique → cartão de
   evidência (honestidade: mostra a regra e o estado atual; o NOME de uma
   estrela adormecida fica escondido — mistério do roadmap), e o NASCIMENTO:
   quando uma regra passa a verdadeira em sessão, a estrela nasce com
   overshoot e as ligações desenham-se com energia; Bus.emit('star:lit').
   O loop rAF só corre com o painel visível e sem reduced-motion — caso
   contrário o céu é uma frame estática on demand. */

function evalReq(attr,req){
  try{
    if(typeof S==='undefined'||!S)return false;
    if(req.lvl!=null)return S.attrs[attr].level>=req.lvl;
    if(req.title)return !!(S.titleUnlocked&&S.titleUnlocked[req.title]);
    if(req.streak!=null)return maxStreak()>=req.streak;
    if(req.done!=null)return doneCount(attr)>=req.done;
  }catch(e){}
  return false;
}
function maxStreak(){
  try{return Math.max(0,...[...(S.oblig||[]),...(S.extras||[])].map(h=>h.streak||0));}
  catch(e){return 0;}
}
function doneCount(attr){
  try{return (S.objectives||[]).filter(o=>o.area===attr&&o.status==='done').length;}
  catch(e){return 0;}
}
function reqText(attr,req){
  const an=(typeof AM!=='undefined'&&AM[attr])?AM[attr].name:attr;
  try{
    if(req.lvl!=null)return{need:'Nível '+req.lvl+' de '+an,
      now:'nível atual: '+((typeof S!=='undefined'&&S)?S.attrs[attr].level:'—')};
    if(req.title){
      const t=(typeof TITLES_REAL!=='undefined')&&TITLES_REAL.find(x=>x.id===req.title);
      return{need:'Título Real: '+(t?t.name:req.title),
        now:evalReq(attr,req)?'desbloqueado':'por desbloquear (evidência nos Títulos Reais)'};
    }
    if(req.streak!=null)return{need:'Streak de '+req.streak+' dias num hábito',
      now:'melhor streak atual: '+maxStreak()};
    if(req.done!=null)return{need:req.done+' missões de '+an+' concluídas',
      now:'concluídas até hoje: '+doneCount(attr)};
  }catch(e){}
  return{need:'—',now:''};
}
export function domainState(attr){
  const c=(typeof CONSTELLATIONS!=='undefined')&&CONSTELLATIONS[attr];
  if(!c)return null;
  const lit={};c.stars.forEach(s=>lit[s.id]=evalReq(attr,s.req));
  const adj={};c.links.forEach(([a,b])=>{(adj[a]=adj[a]||[]).push(b);(adj[b]=adj[b]||[]).push(a);});
  const disc={};
  c.stars.forEach((s,i)=>{
    disc[s.id]=!lit[s.id]&&((adj[s.id]||[]).some(o=>lit[o])||i===0);
  });
  /* Estrela de Escolha (4C) — identidade, não evidência; mas o desbloqueio é
     gated por evidência e a escolha é reversível */
  let choice=null;
  if(c.choice){
    const unlocked=evalReq(attr,c.choice.unlock);
    let chosen=null;
    try{chosen=(S&&S.constellation&&S.constellation.choices&&S.constellation.choices[attr])||null;}catch(e){}
    choice={def:c.choice,state:unlocked?(chosen?'chosen':'pending'):'hidden',chosen};
  }
  return{c,lit,disc,choice};
}

const hxv=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];

const BG_VERT=`varying vec2 vUv;
void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}`;
const BG_FRAG=`varying vec2 vUv;uniform vec3 uTint;uniform float uTime;uniform float uDetail;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
  vec3 col=mix(vec3(.016,.012,.043),vec3(.043,.027,.09),vUv.y*.7);
  vec2 p=vUv*3.1;
  float n=noise(p+vec2(uTime*.008,-uTime*.005));
  if(uDetail>1.5)n=n*.7+.3*noise(p*2.2+vec2(-uTime*.006,uTime*.009));
  col+=uTint*n*n*.10*(1.-vUv.y*.4);
  float vg=smoothstep(1.15,.3,length(vUv-vec2(.5,.5)));
  col*=mix(.85,1.,vg);
  col+=(hash(gl_FragCoord.xy)-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;
const ST_VERT=`
attribute float aSize;attribute float aMode;attribute float aHov;attribute float aBirth;attribute float aPulse;
uniform vec2 uRes;uniform float uPix;uniform float uTime;uniform vec2 uPan;
varying float vMode;varying float vB;
float back(float k){k=clamp(k,0.,1.);float s=1.70158;k-=1.;return k*k*((s+1.)*k+s)+1.;}
void main(){
  vec2 p=position.xy+uPan*(1.4-aMode*.6); /* as ténues, mais fundas, mexem mais */
  float b=aBirth<0.?1.:back(clamp((uTime-aBirth)/1.2,0.,1.));
  gl_Position=vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,0.,1.);
  float tw=.92+.08*sin(uTime*1.6+position.x*.05);
  float inv=1.+aPulse*.25*sin(uTime*2.6); /* escolha pendente convida ao clique */
  gl_PointSize=aSize*uPix*b*(1.+aHov*.4)*tw*inv;
  vMode=aMode;vB=clamp(b,0.,1.);
}`;
const ST_FRAG=`uniform vec3 uCol;varying float vMode;varying float vB;
void main(){
  float d=length(gl_PointCoord-.5);
  float core=smoothstep(.3,.06,d);
  float halo=smoothstep(.5,.1,d)*.55;
  float a=mix(core*.4+halo*.1,core+halo,vMode)*vB;
  vec3 col=mix(vec3(.6,.56,.76),uCol,vMode);
  gl_FragColor=vec4(col*a,a);
}`;
const LN_VERT=`
attribute float aT;attribute float aPx;attribute float aBirth;
uniform vec2 uRes;uniform float uTime;uniform vec2 uPan;
varying float vT;varying float vPx;varying float vB;
void main(){
  vec2 p=position.xy+uPan;
  gl_Position=vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,0.,1.);
  vT=aT;vPx=aPx;
  vB=aBirth<0.?1.:clamp((uTime-aBirth)/1.4,0.,1.);
}`;
const LN_FRAG=`
uniform vec3 uCol;uniform float uOp;uniform float uTime;uniform float uFlow;
varying float vT;varying float vPx;varying float vB;
void main(){
  float flow=mix(1.,.7+.3*sin(vPx*.11-uTime*2.1),uFlow); /* energia a correr */
  float drawn=step(vT,vB); /* nascimento: a ligação desenha-se de A para B */
  float a=uOp*flow*drawn;
  gl_FragColor=vec4(uCol*a,a);
}`;

/* sem WebGL (4C) — o céu em DOM: a informação nunca se perde. Mantém os
   chips, os três estados e a Estrela de Escolha; sem animação, mas os
   nascimentos emitem na mesma no bus. */
function initDomFallback(){
  const labels=document.getElementById('const-labels');
  const chips=document.getElementById('const-chips');
  const cv=document.getElementById('constel-cv');
  if(!labels||!chips)return;
  if(cv)cv.style.display='none';
  labels.parentElement.classList.add('const-dom');
  let domain='oficio';
  const prevLit={};let baseline=false;
  function evaluateAll(){
    for(const attr in CONSTELLATIONS){
      const st=domainState(attr);if(!st)continue;
      const prev=prevLit[attr]||{};
      st.c.stars.forEach(s=>{
        if(st.lit[s.id]&&!prev[s.id]&&baseline&&window.Bus)Bus.emit('star:lit',{attr:attr,id:s.id});
      });
      prevLit[attr]=st.lit;
    }
    baseline=true;
  }
  function buildChips(){
    chips.innerHTML=ATTRS.map(a=>
      `<div class="const-chip ${a.id===domain?'on':''}" data-d="${a.id}">
        <span class="cd" style="background:${a.color}"></span>${a.name}</div>`).join('');
    [...chips.children].forEach(el=>el.onclick=()=>{domain=el.dataset.d;buildChips();drawDom();});
  }
  function drawDom(){
    const st=domainState(domain);if(!st)return;
    const dcol=(typeof AM!=='undefined'&&AM[domain])?AM[domain].color:'#a78bfa';
    const hid=st.c.stars.filter(s=>!st.lit[s.id]&&!st.disc[s.id]).length;
    let html=st.c.stars.filter(s=>st.lit[s.id]).map(s=>
      `<div class="cfb on" style="color:${dcol}">★ ${s.n}</div>`).join('');
    html+=st.c.stars.filter(s=>st.disc[s.id]).map(()=>`<div class="cfb">✦ ─────</div>`).join('');
    if(hid)html+=`<div class="cfb dim">… e ${hid} estrelas escondidas</div>`;
    if(st.choice&&st.choice.state==='chosen')
      html+=`<div class="cfb on" style="color:${dcol}">◈ Caminho: ${st.choice.chosen}</div>`;
    else if(st.choice&&st.choice.state==='pending')
      html+=`<div class="cfb">◈ Caminho por escolher: ${st.choice.def.options.map(o=>
        `<button class="mini" data-o="${o}">${o}</button>`).join(' ')}</div>`;
    labels.innerHTML=html;
    labels.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{
      try{
        S.constellation=S.constellation||{};S.constellation.choices=S.constellation.choices||{};
        S.constellation.choices[domain]=b.dataset.o;
      }catch(e){return;}
      if(window.Bus)Bus.emit('star:choice',{attr:domain,opt:b.dataset.o});
      if(typeof save==='function')save();else drawDom();
    });
  }
  window.renderConstellation=()=>{evaluateAll();drawDom();};
  buildChips();evaluateAll();drawDom();
}

export function initConstellation(){
  const cv=document.getElementById('constel-cv');
  if(!cv||typeof CONSTELLATIONS==='undefined')return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,depth:false,stencil:false});}
  catch(e){initDomFallback();return;}
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const labels=document.getElementById('const-labels');
  const chips=document.getElementById('const-chips');
  const wrap=cv.parentElement;
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const pix=Math.min(devicePixelRatio||1,1.5);
  const lite=matchMedia('(pointer:coarse)').matches||innerWidth<720;
  const t0=performance.now();
  const tNow=()=>(performance.now()-t0)/1000;
  let domain='oficio',W=1,H=1,vis=false,raf=0,lastKey='';
  let panX=0,panY=0,panTX=0,panTY=0;
  let starGeo=null,starPts=null,hovIdx=-1,shown=[],curState=null,card=null;
  const uTime={value:0},uPan={value:new THREE.Vector2(0,0)};
  const prevLit={};let baseline=false; /* 1ª avaliação não emite nascimentos */
  const births={}; /* 'attr:id' → instante do nascimento */

  function buildChips(){
    if(!chips||typeof ATTRS==='undefined')return;
    chips.innerHTML=ATTRS.map(a=>
      `<div class="const-chip ${a.id===domain?'on':''}" data-d="${a.id}">
        <span class="cd" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></span>${a.name}</div>`).join('');
    [...chips.children].forEach(el=>el.onclick=()=>{domain=el.dataset.d;buildChips();hideCard();draw(true);});
  }
  function size(){
    W=wrap.clientWidth||600;H=wrap.clientHeight||340;
    renderer.setPixelRatio(pix);renderer.setSize(W,H,false);
  }
  function clear(){
    while(scene.children.length){
      const o=scene.children.pop();
      if(o.geometry)o.geometry.dispose();
      if(o.material)o.material.dispose();
    }
    starGeo=null;starPts=null;shown=[];hovIdx=-1;
  }
  /* avalia TODOS os domínios: detecta nascimentos mesmo fora do domínio à vista */
  function evaluateAll(){
    if(typeof CONSTELLATIONS==='undefined')return;
    for(const attr in CONSTELLATIONS){
      const st=domainState(attr);if(!st)continue;
      const prev=prevLit[attr]||{};
      st.c.stars.forEach(s=>{
        if(st.lit[s.id]&&!prev[s.id]&&baseline){
          births[attr+':'+s.id]=tNow();
          if(window.Bus)Bus.emit('star:lit',{attr:attr,id:s.id});
        }
      });
      prevLit[attr]=st.lit;
    }
    baseline=true;
  }
  function stateKey(st){
    return domain+'|'+st.c.stars.map(s=>st.lit[s.id]?'1':st.disc[s.id]?'d':'0').join('')
      +'|'+(st.choice?st.choice.state+(st.choice.chosen||''):'');
  }
  function draw(force){
    const st=domainState(domain);if(!st)return;
    curState=st;
    const key=stateKey(st);
    if(!force&&key===lastKey)return;
    lastKey=key;
    size();clear();if(labels)labels.innerHTML='';
    const dcol=(typeof AM!=='undefined'&&AM[domain])?AM[domain].color:'#a78bfa';
    const tint=hxv(dcol);
    /* nevoeiro do domínio */
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
    const bgm=new THREE.ShaderMaterial({vertexShader:BG_VERT,fragmentShader:BG_FRAG,
      depthTest:false,depthWrite:false,
      uniforms:{uTint:{value:new THREE.Vector3(...tint)},uTime:uTime,uDetail:{value:lite?1:2}}});
    const bgMesh=new THREE.Mesh(bg,bgm);bgMesh.frustumCulled=false;bgMesh.renderOrder=0;
    scene.add(bgMesh);
    /* ligações */
    const visSt=s=>st.lit[s.id]||st.disc[s.id];
    const byId={};st.c.stars.forEach(s=>byId[s.id]=s);
    const mk={lit:{pos:[],t:[],px:[],birth:[]},dim:{pos:[],t:[],px:[],birth:[]}};
    st.c.links.forEach(([a,b])=>{
      const A=byId[a],B=byId[b];
      if(!visSt(A)||!visSt(B))return;
      const both=st.lit[a]&&st.lit[b];
      const g=both?mk.lit:mk.dim;
      const len=Math.hypot((B.x-A.x)*W,(B.y-A.y)*H);
      /* nascimento da ligação = nascimento mais recente das pontas */
      const bA=births[domain+':'+a],bB=births[domain+':'+b];
      const bt=(bA!=null||bB!=null)?Math.max(bA||0,bB||0):-1;
      g.pos.push(A.x*W,A.y*H,0,B.x*W,B.y*H,0);
      g.t.push(0,1);g.px.push(0,len);g.birth.push(bt,bt);
    });
    const mkLines=(d,op,flow)=>{
      if(!d.pos.length)return;
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(d.pos),3));
      g.setAttribute('aT',new THREE.BufferAttribute(new Float32Array(d.t),1));
      g.setAttribute('aPx',new THREE.BufferAttribute(new Float32Array(d.px),1));
      g.setAttribute('aBirth',new THREE.BufferAttribute(new Float32Array(d.birth),1));
      const m=new THREE.ShaderMaterial({vertexShader:LN_VERT,fragmentShader:LN_FRAG,
        transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
        uniforms:{uRes:{value:new THREE.Vector2(W,H)},uCol:{value:new THREE.Vector3(...tint)},
          uOp:{value:op},uTime:uTime,uPan:uPan,uFlow:{value:flow}}});
      const l=new THREE.LineSegments(g,m);l.frustumCulled=false;l.renderOrder=1;
      scene.add(l);
    };
    /* estrela de escolha — pendente pulsa; escolhida acende com o nome do caminho */
    let choiceStar=null;
    if(st.choice&&st.choice.state!=='hidden'){
      const d=st.choice.def;
      choiceStar={id:d.id,n:st.choice.chosen||'',x:d.x,y:d.y,_choice:true,_state:st.choice.state};
      const L=byId[d.link];
      if(L&&visSt(L)){
        const len=Math.hypot((L.x-d.x)*W,(L.y-d.y)*H);
        const b=births[domain+':'+d.id];const bt=(b!=null)?b:-1;
        const g=st.choice.state==='chosen'?mk.lit:mk.dim;
        g.pos.push(d.x*W,d.y*H,0,L.x*W,L.y*H,0);
        g.t.push(0,1);g.px.push(0,len);g.birth.push(bt,bt);
      }
    }
    mkLines(mk.dim,.09,0);mkLines(mk.lit,.34,1);
    /* estrelas */
    shown=st.c.stars.filter(visSt);
    if(choiceStar)shown=shown.concat(choiceStar);
    if(shown.length){
      const n=shown.length;
      const pos=new Float32Array(n*3),sz=new Float32Array(n),md=new Float32Array(n),
        hv=new Float32Array(n),bi=new Float32Array(n),pu=new Float32Array(n);
      shown.forEach((s,i)=>{
        pos[i*3]=s.x*W;pos[i*3+1]=s.y*H;
        if(s._choice){
          sz[i]=s._state==='chosen'?18:11;md[i]=s._state==='chosen'?1:0;
          pu[i]=s._state==='pending'?1:0;
        }else{sz[i]=st.lit[s.id]?18:6;md[i]=st.lit[s.id]?1:0;}
        const b=births[domain+':'+s.id];bi[i]=(b!=null)?b:-1;
      });
      starGeo=new THREE.BufferGeometry();
      starGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      starGeo.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
      starGeo.setAttribute('aMode',new THREE.BufferAttribute(md,1));
      starGeo.setAttribute('aHov',new THREE.BufferAttribute(hv,1));
      starGeo.setAttribute('aBirth',new THREE.BufferAttribute(bi,1));
      starGeo.setAttribute('aPulse',new THREE.BufferAttribute(pu,1));
      const m=new THREE.ShaderMaterial({vertexShader:ST_VERT,fragmentShader:ST_FRAG,
        transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
        uniforms:{uRes:{value:new THREE.Vector2(W,H)},uPix:{value:pix},
          uCol:{value:new THREE.Vector3(...tint)},uTime:uTime,uPan:uPan}});
      starPts=new THREE.Points(starGeo,m);starPts.frustumCulled=false;starPts.renderOrder=2;
      scene.add(starPts);
      if(labels)shown.forEach(s=>{
        const isLit=s._choice?s._state==='chosen':st.lit[s.id];
        const pend=s._choice&&s._state==='pending';
        if(!isLit&&!pend)return;
        const d=document.createElement('div');
        d.className='const-lb'+(pend?' dim':'');
        d.style.left=(s.x*100)+'%';d.style.top=(s.y*100)+'%';
        if(isLit)d.style.color=dcol;
        d.textContent=pend?'escolher caminho':s.n;
        labels.appendChild(d);
      });
    }
    renderer.render(scene,camera);
  }
  /* loop — só com o painel visível e sem reduced-motion */
  function tick(){
    raf=requestAnimationFrame(tick);
    uTime.value=tNow();
    panX+=(panTX-panX)*.06;panY+=(panTY-panY)*.06;
    uPan.value.set(panX,panY);
    if(labels)labels.style.transform='translate('+panX.toFixed(1)+'px,'+panY.toFixed(1)+'px)';
    renderer.render(scene,camera);
  }
  const start=()=>{if(!raf&&vis&&!rm.matches&&!document.hidden)raf=requestAnimationFrame(tick);};
  const stop=()=>{cancelAnimationFrame(raf);raf=0;};
  /* hover + clique — cartão de evidência */
  function starAt(mx,my){
    let best=-1,bd=18;
    shown.forEach((s,i)=>{
      const d=Math.hypot(s.x*W+panX-mx,s.y*H+panY-my);
      if(d<bd){bd=d;best=i;}
    });
    return best;
  }
  function hideCard(){if(card){card.remove();card=null;}}
  function place(s){
    card.style.left=Math.min(80,Math.max(5,s.x*100))+'%';
    card.style.top=Math.min(62,Math.max(5,s.y*100))+'%';
    card.querySelector('.cx').onclick=hideCard;
    wrap.appendChild(card);
  }
  function showCard(s){
    hideCard();
    const st=curState;if(!st)return;
    if(s._choice){
      const an=(typeof AM!=='undefined'&&AM[domain])?AM[domain].name:domain;
      card=document.createElement('div');card.className='const-card';
      if(s._state==='pending'){
        card.innerHTML=`<span class="cx">✕</span><div class="ck">Estrela de Escolha</div>
          <b>Caminho de ${an}</b>
          <div class="now">Identidade, não evidência: escolhe a tua especialização. Podes reconsiderar mais tarde.</div>
          <div class="const-opts">${st.choice.def.options.map(o=>`<button class="mini" data-o="${o}">${o}</button>`).join('')}</div>`;
      }else{
        card.innerHTML=`<span class="cx">✕</span><div class="ck">Estrela de Escolha</div>
          <b>${st.choice.chosen}</b>
          <div class="now">O teu caminho em ${an}.</div>
          <div class="const-opts"><button class="mini" data-r="1">Reconsiderar</button></div>`;
      }
      place(s);
      card.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{
        try{
          S.constellation=S.constellation||{};S.constellation.choices=S.constellation.choices||{};
          S.constellation.choices[domain]=b.dataset.o;
        }catch(e){return;}
        births[domain+':'+st.choice.def.id]=tNow();
        if(window.Bus)Bus.emit('star:choice',{attr:domain,opt:b.dataset.o});
        hideCard();
        if(typeof save==='function')save();else draw(true);
      });
      const rb=card.querySelector('[data-r]');
      if(rb)rb.onclick=()=>{
        try{delete S.constellation.choices[domain];}catch(e){}
        hideCard();
        if(typeof save==='function')save();else draw(true);
      };
      return;
    }
    const lit=st.lit[s.id],r=reqText(domain,s.req);
    card=document.createElement('div');card.className='const-card';
    card.innerHTML=`<span class="cx">✕</span>
      <div class="ck">${lit?'Estrela acesa':'Estrela adormecida'}</div>
      <b>${lit?s.n:'✦ ─────'}</b>
      <div class="now">${lit?'Evidência cumprida: '+r.need:'Evidência: '+r.need+'<br>'+r.now}</div>`;
    place(s);
  }
  cv.addEventListener('pointermove',e=>{
    const r=cv.getBoundingClientRect();
    const i=starAt(e.clientX-r.left,e.clientY-r.top);
    if(i!==hovIdx){
      hovIdx=i;cv.style.cursor=i>=0?'pointer':'';
      if(starGeo){const hv=starGeo.attributes.aHov;
        hv.array.fill(0);if(i>=0)hv.array[i]=1;hv.needsUpdate=true;
        if(rm.matches||!raf)renderer.render(scene,camera);}
    }
    panTX=((e.clientX-r.left)/W-.5)*10;panTY=((e.clientY-r.top)/H-.5)*7;
  },{passive:true});
  cv.addEventListener('pointerleave',()=>{panTX=0;panTY=0;},{passive:true});
  cv.addEventListener('click',e=>{
    const r=cv.getBoundingClientRect();
    const i=starAt(e.clientX-r.left,e.clientY-r.top);
    if(i>=0)showCard(shown[i]);else hideCard();
  });
  if('IntersectionObserver'in window){
    new IntersectionObserver(es=>{
      vis=es[0].isIntersecting;
      if(vis){draw(false);start();}else stop();
    }).observe(wrap);
  }else{vis=true;start();}
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  rm.addEventListener('change',()=>{rm.matches?stop():start();});
  let rsT=0;
  addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(()=>draw(true),200);});
  /* chamado no fim de cada render() clássico */
  window.renderConstellation=()=>{evaluateAll();draw(false);};
  buildChips();size();evaluateAll();draw(true);
}
