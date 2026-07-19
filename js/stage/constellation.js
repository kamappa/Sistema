import * as THREE from '../vendor/three.module.min.js';

/* Constelações — o céu do Operador (M12·S4 → M14 → M16).
   Conceito M16 (Fase A): as estrelas NASCEM, não se acendem. O céu só
   contém estrelas cuja evidência (CONSTELLATIONS, data.js) é verdadeira
   AGORA; nada de adormecidas/descobertas visíveis, nenhuma contagem do que
   falta — silêncio total, cada nascimento é surpresa. Se a evidência
   regride, a estrela recolhe; S.constellation.born guarda a data do
   primeiro nascimento (títulos usam a data real de titleUnlocked; a
   migração inicial marca o=1 = "observada", nunca data inventada).
   O vazio nunca é morto: poeira, nebulosa na cor do domínio, respiração
   lenta e grão de céu profundo (textura indistinta, sem pontos legíveis).
   Nascimento em sessão: overshoot + ligações a desenharem-se +
   Bus.emit('star:lit') (mini-supernova chega na Fase C).
   Dolly por câmara (uZoom/uOff nos shaders, nunca escala de bitmap) com
   Motion.Spring — wheel/pinch/arrasto/duplo-clique; reduced-motion assenta
   sem animação; rAF só com o painel visível.
   Vista de Universo (M14): 6 constelações em anel + Núcleo ao centro
   (brilho = fração de estrelas nascidas); clicar mergulha (fly-in com
   continuidade de câmara), zoom-out no limite ou duplo-clique regressa. */

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
/* Conceito M16: as estrelas NASCEM (born-based). O céu só contém estrelas
   cuja regra de evidência é verdadeira AGORA; se a evidência regride, a
   estrela recolhe — o registo S.constellation.born guarda a data do
   primeiro nascimento (facto histórico). Silêncio total sobre o que falta:
   nenhuma estrela adormecida/descoberta é mostrada nem contada. */
export function domainState(attr){
  const c=(typeof CONSTELLATIONS!=='undefined')&&CONSTELLATIONS[attr];
  if(!c)return null;
  const lit={};c.stars.forEach(s=>lit[s.id]=evalReq(attr,s.req));
  /* Estrela de Escolha (4C) — identidade, não evidência; mas o desbloqueio é
     gated por evidência e a escolha é reversível */
  let choice=null;
  if(c.choice){
    const unlocked=evalReq(attr,c.choice.unlock);
    let chosen=null;
    try{chosen=(S&&S.constellation&&S.constellation.choices&&S.constellation.choices[attr])||null;}catch(e){}
    choice={def:c.choice,state:unlocked?(chosen?'chosen':'pending'):'hidden',chosen};
  }
  return{c,lit,choice};
}

/* registo de nascimentos — a única escrita nova no estado. Idempotente:
   só grava a primeira vez que uma regra passa a verdadeira. Datas honestas:
   estrelas de Título usam a data real de S.titleUnlocked; na migração
   inicial (bornInit ausente) o resto fica marcado o=1 — "evidência anterior
   ao registo do céu, observada a <data>" — nunca uma data inventada.
   O save é adiado para fora do ciclo de render (reentrância). */
let bornSaveT=0;
function bornSchedSave(){
  if(bornSaveT)return;
  bornSaveT=setTimeout(()=>{bornSaveT=0;try{if(typeof save==='function')save();}catch(e){}},50);
}
export function recordBirths(){
  try{
    if(typeof S==='undefined'||!S||typeof CONSTELLATIONS==='undefined')return;
    S.constellation=S.constellation||{choices:{}};
    const reg=S.constellation.born=S.constellation.born||{};
    const first=!S.constellation.bornInit;
    let dirty=false;
    for(const attr in CONSTELLATIONS){
      CONSTELLATIONS[attr].stars.forEach(s=>{
        const k=attr+':'+s.id;
        if(reg[k]||!evalReq(attr,s.req))return;
        const e={d:(typeof today==='function')?today():new Date().toISOString().slice(0,10)};
        if(s.req&&s.req.title&&S.titleUnlocked&&S.titleUnlocked[s.req.title])
          e.d=S.titleUnlocked[s.req.title];
        else if(first)e.o=1;
        reg[k]=e;dirty=true;
      });
    }
    if(first){S.constellation.bornInit=(typeof today==='function')?today():new Date().toISOString().slice(0,10);dirty=true;}
    if(dirty)bornSchedSave();
  }catch(e){}
}
function bornInfo(attr,id){
  try{
    const b=S.constellation&&S.constellation.born&&S.constellation.born[attr+':'+id];
    if(!b||!b.d)return null;
    const dt=b.d.slice(8,10)+'/'+b.d.slice(5,7)+'/'+b.d.slice(0,4);
    return b.o?'Evidência anterior ao registo do céu — observada a '+dt:'★ Nasceu a '+dt;
  }catch(e){return null;}
}

const hxv=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];

const BG_VERT=`varying vec2 vUv;
void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}`;
/* hash sem seno (Hoskins) — o hash sin(dot)*43758 degenera em GPUs ANGLE/D3D
   quando o argumento passa a precisão do float32 (era a causa dos blocos
   quadrados no fundo); este é estável a qualquer magnitude */
const BG_FRAG=`varying vec2 vUv;uniform vec3 uTint;uniform float uTime;uniform float uDetail;
uniform vec2 uRes;uniform float uZoom;uniform vec2 uOff;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973));
  q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
  vec3 col=mix(vec3(.027,.022,.062),vec3(.062,.042,.118),vUv.y*.7);
  /* nevoeiro do domínio — coordenadas de mundo (acompanha o dolly de leve);
     pureza absoluta: sem estrelas de enchimento — só poeira, nebulosa na cor
     do domínio e uma respiração lenta (~22s). O vazio é um céu à espera. */
  vec2 px=vUv*uRes;
  vec2 p=((px-uOff*.25)/(1.+(uZoom-1.)*.25))/uRes*3.1;
  float breathe=1.+.06*sin(uTime*.285); /* a respiração da cena (M12·2C) */
  float n=noise(p+vec2(uTime*.008,-uTime*.005));
  if(uDetail>1.5)n=n*.7+.3*noise(p*2.2+vec2(-uTime*.006,uTime*.009));
  col+=uTint*n*n*.20*breathe*(1.-vUv.y*.35);
  col+=vec3(.05,.045,.09)*n*.11; /* poeira neutra: tira o preto absoluto */
  /* grão fino de céu profundo — textura indistinta, nunca pontos legíveis */
  float g=noise(px*.22+vec2(7.3,2.9));
  col+=vec3(.5,.48,.62)*smoothstep(.82,1.,g)*.05;
  float vg=smoothstep(1.15,.3,length(vUv-vec2(.5,.5)));
  col*=mix(.85,1.,vg);
  col+=(hash(gl_FragCoord.xy)-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;
const ST_VERT=`
attribute float aSize;attribute float aMode;attribute float aHov;attribute float aBirth;attribute float aPulse;attribute float aFade;
uniform vec2 uRes;uniform float uPix;uniform float uTime;uniform vec2 uPan;
uniform float uZoom;uniform vec2 uOff;
varying float vMode;varying float vB;varying float vFade;
float back(float k){k=clamp(k,0.,1.);float s=1.70158;k-=1.;return k*k*((s+1.)*k+s)+1.;}
void main(){
  /* dolly: as posições vivem em px de mundo; a câmara escala e desloca */
  vec2 p=position.xy*uZoom+uOff+uPan*(1.4-aMode*.6); /* as ténues, mais fundas, mexem mais */
  float b=aBirth<0.?1.:back(clamp((uTime-aBirth)/1.2,0.,1.));
  gl_Position=vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,0.,1.);
  float tw=.92+.08*sin(uTime*1.6+position.x*.05);
  float inv=1.+aPulse*.25*sin(uTime*2.6); /* escolha pendente convida ao clique */
  gl_PointSize=aSize*uPix*uZoom*b*(1.+aHov*.4)*tw*inv;
  vMode=aMode;vB=clamp(b,0.,1.);vFade=aFade;
}`;
const ST_FRAG=`uniform vec3 uCol;varying float vMode;varying float vB;varying float vFade;
void main(){
  float d=length(gl_PointCoord-.5);
  float core=smoothstep(.3,.06,d);
  float halo=smoothstep(.5,.1,d)*.55;
  float a=mix(core*.4+halo*.1,core+halo,vMode)*vB*vFade;
  vec3 col=mix(vec3(.6,.56,.76),uCol,vMode);
  gl_FragColor=vec4(col*a,a);
}`;
const LN_VERT=`
attribute float aT;attribute float aPx;attribute float aBirth;
uniform vec2 uRes;uniform float uTime;uniform vec2 uPan;
uniform float uZoom;uniform vec2 uOff;
varying float vT;varying float vPx;varying float vB;
void main(){
  vec2 p=position.xy*uZoom+uOff+uPan;
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
    recordBirths();
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
    /* silêncio total: só estrelas nascidas; nada é contado nem sugerido */
    let html=st.c.stars.filter(s=>st.lit[s.id]).map(s=>
      `<div class="cfb on" style="color:${dcol}">★ ${s.n}</div>`).join('');
    if(!html)html=`<div class="cfb dim">O céu deste domínio ainda espera a primeira estrela.</div>`;
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
  const uRes={value:new THREE.Vector2(1,1)},uZoom={value:1},uOff={value:new THREE.Vector2(0,0)};
  const prevLit={};let baseline=false; /* 1ª avaliação não emite nascimentos */
  const births={}; /* 'attr:id' → instante do nascimento */

  /* ===== câmara (dolly) — zoom por uniform, nunca por escala de bitmap:
     re-renderiza à resolução nativa, logo nítido a qualquer distância.
     A mola é a mesma física do resto do sistema (Motion.Spring · gentle);
     com reduced-motion o zoom assenta de imediato, sem animação. ===== */
  const ZMIN=1;
  const zmax=()=>mode==='universe'?2.2:3;
  let zt=1,oxT=0,oyT=0; /* alvos da mola: zoom + offset da câmara em px */
  const cam={z:1,x:0,y:0}; /* estado presente (o que a mola já percorreu) */
  /* ===== Vista de Universo (Missão 14 · Universe Navigation · Fase 1) =====
     As 6 constelações num só céu, dispostas em anel (a identidade do
     hexágono), com o Núcleo ao centro — brilho derivado da fração de
     estrelas acesas (evidência, nunca à mão). Clicar numa constelação
     mergulha nela (fly-in); zoom-out no limite ou duplo-clique regressa
     ao universo (fly-out). A continuidade é matemática: a câmara do
     destino nasce onde a do modo anterior estava. */
  let mode='universe',pendingEnter=null,uniRegions=[];
  const UNI={s:.30,R:.34}; /* escala de cada domínio · raio do anel */
  function uniAnchor(i,n){
    const a=-Math.PI/2+i*2*Math.PI/n;
    return{x:.5+UNI.R*Math.cos(a)-UNI.s/2,y:.5+UNI.R*Math.sin(a)-UNI.s/2};
  }
  function moveLabels(){
    if(labels)labels.style.transform='translate('+(cam.x+panX).toFixed(1)+'px,'
      +(cam.y+panY).toFixed(1)+'px) scale('+cam.z.toFixed(3)+')';
  }
  function syncCam(){
    uZoom.value=cam.z;uOff.value.set(cam.x,cam.y);
    moveLabels();
    if(pendingEnter&&cam.z>=pendingEnter.zSwitch)enterDomain();
    if(!raf)renderer.render(scene,camera); /* frame estática on demand */
  }
  const camSpring=(window.Motion&&Motion.Spring)
    ?new Motion.Spring(3,Motion.TOK.gentle,v=>{cam.z=v[0];cam.x=v[1];cam.y=v[2];syncCam();})
    :null;
  if(camSpring)camSpring.snap(1,0,0);
  function clampOff(){ /* a janela nunca sai do céu */
    oxT=Math.min(0,Math.max(W*(1-zt),oxT));
    oyT=Math.min(0,Math.max(H*(1-zt),oyT));
  }
  function setCam(snap){
    clampOff();
    if(camSpring&&!rm.matches&&!snap)camSpring.set(zt,oxT,oyT);
    else if(camSpring)camSpring.snap(zt,oxT,oyT);
    else{cam.z=zt;cam.x=oxT;cam.y=oyT;syncCam();}
  }
  function resetCam(){zt=1;oxT=0;oyT=0;setCam(false);}
  /* fly-in: a câmara do universo mergulha até ao encaixe do domínio; no
     limiar troca-se a cena e a câmara do domínio nasce no ponto equivalente */
  function flyIn(attr){
    const i=(typeof ATTRS!=='undefined')?ATTRS.findIndex(a=>a.id===attr):-1;
    if(i<0||mode!=='universe'||pendingEnter)return;
    const an=uniAnchor(i,ATTRS.length);
    const Z=1/UNI.s;
    pendingEnter={attr:attr,an:an,zSwitch:Z*.92};
    zt=Z;oxT=-an.x*W*Z;oyT=-an.y*H*Z;
    setCam(false);
  }
  function enterDomain(){
    const pe=pendingEnter;pendingEnter=null;
    mode='domain';domain=pe.attr;
    const zd=cam.z*UNI.s;
    const ox=pe.an.x*W*cam.z+cam.x,oy=pe.an.y*H*cam.z+cam.y;
    buildChips();hideCard();draw(true);
    if(camSpring)camSpring.snap(zd,ox,oy);else{cam.z=zd;cam.x=ox;cam.y=oy;}
    zt=1;oxT=0;oyT=0;setCam(false);
  }
  function flyOut(){
    if(mode==='universe')return;
    const i=(typeof ATTRS!=='undefined')?ATTRS.findIndex(a=>a.id===domain):-1;
    const an=(i>=0)?uniAnchor(i,ATTRS.length):{x:.35,y:.35};
    const Z=cam.z/UNI.s;
    const ox=cam.x-an.x*W*Z,oy=cam.y-an.y*H*Z;
    mode='universe';pendingEnter=null;hideCard();buildChips();draw(true);
    if(camSpring)camSpring.snap(Z,ox,oy);else{cam.z=Z;cam.x=ox;cam.y=oy;}
    zt=1;oxT=0;oyT=0;setCam(false);
  }

  function buildChips(){
    if(!chips||typeof ATTRS==='undefined')return;
    chips.innerHTML='<div class="const-chip '+(mode==='universe'?'on':'')+'" data-d="__uni">✦ Universo</div>'
      +ATTRS.map(a=>
      `<div class="const-chip ${mode==='domain'&&a.id===domain?'on':''}" data-d="${a.id}">
        <span class="cd" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></span>${a.name}</div>`).join('');
    [...chips.children].forEach(el=>el.onclick=()=>{
      const d=el.dataset.d;
      if(d==='__uni'){if(mode==='domain')flyOut();else resetCam();return;}
      if(mode==='universe'){flyIn(d);return;}
      domain=d;buildChips();hideCard();resetCam();draw(true);
    });
  }
  function size(){
    W=wrap.clientWidth||600;H=wrap.clientHeight||340;
    renderer.setPixelRatio(pix);renderer.setSize(W,H,false);
    uRes.value.set(W,H);
    clampOff(); /* o resize pode encolher a janela válida do offset */
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
    recordBirths();
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
    return domain+'|'+st.c.stars.map(s=>st.lit[s.id]?'1':'0').join('')
      +'|'+(st.choice?st.choice.state+(st.choice.chosen||''):'');
  }
  function addBg(tint){
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
    const bgm=new THREE.ShaderMaterial({vertexShader:BG_VERT,fragmentShader:BG_FRAG,
      depthTest:false,depthWrite:false,
      uniforms:{uTint:{value:new THREE.Vector3(...tint)},uTime:uTime,uDetail:{value:lite?1:2},
        uRes:uRes,uZoom:uZoom,uOff:uOff}});
    const bgMesh=new THREE.Mesh(bg,bgm);bgMesh.frustumCulled=false;bgMesh.renderOrder=0;
    scene.add(bgMesh);
  }
  function mkLinesG(d,op,flow,tint){
    if(!d.pos.length)return;
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(d.pos),3));
    g.setAttribute('aT',new THREE.BufferAttribute(new Float32Array(d.t),1));
    g.setAttribute('aPx',new THREE.BufferAttribute(new Float32Array(d.px),1));
    g.setAttribute('aBirth',new THREE.BufferAttribute(new Float32Array(d.birth),1));
    const m=new THREE.ShaderMaterial({vertexShader:LN_VERT,fragmentShader:LN_FRAG,
      transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{uRes:uRes,uCol:{value:new THREE.Vector3(...tint)},
        uOp:{value:op},uTime:uTime,uPan:uPan,uFlow:{value:flow},uZoom:uZoom,uOff:uOff}});
    const l=new THREE.LineSegments(g,m);l.frustumCulled=false;l.renderOrder=1;
    scene.add(l);
  }
  function starMatG(tint){
    return new THREE.ShaderMaterial({vertexShader:ST_VERT,fragmentShader:ST_FRAG,
      transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
      uniforms:{uRes:uRes,uPix:{value:pix},
        uCol:{value:new THREE.Vector3(...tint)},uTime:uTime,uPan:uPan,uZoom:uZoom,uOff:uOff}});
  }
  /* pontos genéricos: {x,y}=px de mundo, sz, md (0 ténue/1 acesa), bi, pu, fd */
  function mkPoints(list,tint,order){
    const n=list.length;if(!n)return null;
    const pos=new Float32Array(n*3),sz=new Float32Array(n),md=new Float32Array(n),
      hv=new Float32Array(n),bi=new Float32Array(n),pu=new Float32Array(n),fd=new Float32Array(n);
    list.forEach((p,i)=>{pos[i*3]=p.x;pos[i*3+1]=p.y;sz[i]=p.sz;md[i]=p.md||0;
      bi[i]=(p.bi!=null)?p.bi:-1;pu[i]=p.pu||0;fd[i]=(p.fd!=null)?p.fd:1;});
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(pos,3));
    g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
    g.setAttribute('aMode',new THREE.BufferAttribute(md,1));
    g.setAttribute('aHov',new THREE.BufferAttribute(hv,1));
    g.setAttribute('aBirth',new THREE.BufferAttribute(bi,1));
    g.setAttribute('aPulse',new THREE.BufferAttribute(pu,1));
    g.setAttribute('aFade',new THREE.BufferAttribute(fd,1));
    const pts=new THREE.Points(g,starMatG(tint));pts.frustumCulled=false;pts.renderOrder=order;
    scene.add(pts);
    return g;
  }
  function draw(force){
    if(mode==='universe'){drawUniverse(force);return;}
    drawDomain(force);
  }
  function drawDomain(force){
    const st=domainState(domain);if(!st)return;
    curState=st;
    const key=stateKey(st);
    if(!force&&key===lastKey)return;
    lastKey=key;
    size();clear();if(labels)labels.innerHTML='';
    const dcol=(typeof AM!=='undefined'&&AM[domain])?AM[domain].color:'#a78bfa';
    const tint=hxv(dcol);
    addBg(tint);
    /* ligações — apenas entre estrelas nascidas */
    const visSt=s=>st.lit[s.id];
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
    const mkLines=(d,op,flow)=>mkLinesG(d,op,flow,tint);
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
    /* estrelas nascidas + escolha — nada mais existe no céu (silêncio total
       sobre o que falta; o registo born guarda as datas) */
    shown=st.c.stars.filter(visSt);
    if(choiceStar)shown=shown.concat(choiceStar);
    if(shown.length){
      const n=shown.length;
      const pos=new Float32Array(n*3),sz=new Float32Array(n),md=new Float32Array(n),
        hv=new Float32Array(n),bi=new Float32Array(n),pu=new Float32Array(n),fd=new Float32Array(n);
      shown.forEach((s,i)=>{
        pos[i*3]=s.x*W;pos[i*3+1]=s.y*H;fd[i]=1;
        if(s._choice){
          sz[i]=s._state==='chosen'?20:11;md[i]=s._state==='chosen'?1:0;
          pu[i]=s._state==='pending'?1:0;
        }else{sz[i]=20;md[i]=1;} /* nascidas: sempre acesas (calibração M12·6) */
        const b=births[domain+':'+s.id];bi[i]=(b!=null)?b:-1;
      });
      starGeo=new THREE.BufferGeometry();
      starGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
      starGeo.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
      starGeo.setAttribute('aMode',new THREE.BufferAttribute(md,1));
      starGeo.setAttribute('aHov',new THREE.BufferAttribute(hv,1));
      starGeo.setAttribute('aBirth',new THREE.BufferAttribute(bi,1));
      starGeo.setAttribute('aPulse',new THREE.BufferAttribute(pu,1));
      starGeo.setAttribute('aFade',new THREE.BufferAttribute(fd,1));
      starPts=new THREE.Points(starGeo,starMatG(tint));starPts.frustumCulled=false;starPts.renderOrder=3;
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
  /* Vista de Universo — todos os domínios num só céu; a chave de estado
     cobre o universo inteiro para os nascimentos reconstruírem a cena */
  function universeKey(){
    let k='U';
    for(const attr in CONSTELLATIONS){
      const st=domainState(attr);if(!st)continue;
      k+='|'+attr+':'+st.c.stars.map(s=>st.lit[s.id]?'1':'0').join('')
        +(st.choice?st.choice.state+(st.choice.chosen||''):'');
    }
    return k;
  }
  function drawUniverse(force){
    if(typeof ATTRS==='undefined')return;
    const key=universeKey();
    if(!force&&key===lastKey)return; /* early-return NÃO pode limpar uniRegions */
    lastKey=key;
    curState=null;shown=[];hovIdx=-1;uniRegions=[];
    size();clear();if(labels)labels.innerHTML='';
    addBg(hxv('#a78bfa'));
    let total=0,litN=0;
    ATTRS.forEach((a,i)=>{
      const st=domainState(a.id);if(!st)return;
      const an=uniAnchor(i,ATTRS.length);
      const tint=hxv(a.color);
      const P=s=>({x:(an.x+s.x*UNI.s)*W,y:(an.y+s.y*UNI.s)*H});
      const byId={};st.c.stars.forEach(s=>byId[s.id]=s);
      const visSt=s=>st.lit[s.id];
      const mk={lit:{pos:[],t:[],px:[],birth:[]},dim:{pos:[],t:[],px:[],birth:[]}};
      st.c.links.forEach(([x,y])=>{
        const A=byId[x],B=byId[y];
        if(!visSt(A)||!visSt(B))return;
        const g=(st.lit[x]&&st.lit[y])?mk.lit:mk.dim;
        const pa=P(A),pb=P(B);
        const len=Math.hypot(pb.x-pa.x,pb.y-pa.y);
        const bA=births[a.id+':'+x],bB=births[a.id+':'+y];
        const bt=(bA!=null||bB!=null)?Math.max(bA||0,bB||0):-1;
        g.pos.push(pa.x,pa.y,0,pb.x,pb.y,0);
        g.t.push(0,1);g.px.push(0,len);g.birth.push(bt,bt);
      });
      mkLinesG(mk.dim,.07,0,tint);mkLinesG(mk.lit,.3,1,tint);
      const vis=[];
      st.c.stars.forEach(s=>{
        total++;if(st.lit[s.id])litN++;
        if(!visSt(s))return; /* silêncio: o que não nasceu não existe no céu */
        const p=P(s),b=births[a.id+':'+s.id];
        vis.push({x:p.x,y:p.y,sz:9,md:1,bi:(b!=null)?b:-1});
      });
      if(st.choice&&st.choice.state!=='hidden'){
        const d=st.choice.def,p=P(d);
        vis.push({x:p.x,y:p.y,sz:st.choice.state==='chosen'?9:5,
          md:st.choice.state==='chosen'?1:0,pu:st.choice.state==='pending'?1:0});
      }
      mkPoints(vis,tint,3);
      const cx=an.x+UNI.s/2,cy=an.y+UNI.s/2;
      uniRegions.push({attr:a.id,cx:cx*W,cy:cy*H,rx:UNI.s*W*.55,ry:UNI.s*H*.62});
      if(labels){
        const anyLit=st.c.stars.some(s=>st.lit[s.id]);
        const d=document.createElement('div');
        d.className='const-lb'+(anyLit?'':' dim');
        d.style.left=(cx*100)+'%';
        d.style.top=Math.min(93,(an.y+UNI.s)*100+2)+'%'; /* o domínio das 6h não sai do céu */
        if(anyLit)d.style.color=a.color;
        d.textContent=a.name;
        labels.appendChild(d);
      }
    });
    /* o Núcleo — nunca editável; o brilho É a fração de estrelas acesas */
    const frac=total?litN/total:0;
    mkPoints([{x:.5*W,y:.5*H,sz:26,md:1,fd:.3+.7*frac}],hxv('#a78bfa'),3);
    renderer.render(scene,camera);
  }
  /* loop — só com o painel visível e sem reduced-motion */
  function tick(){
    raf=requestAnimationFrame(tick);
    uTime.value=tNow();
    panX+=(panTX-panX)*.06;panY+=(panTY-panY)*.06;
    uPan.value.set(panX,panY);
    moveLabels();
    renderer.render(scene,camera);
  }
  const start=()=>{if(!raf&&vis&&!rm.matches&&!document.hidden)raf=requestAnimationFrame(tick);};
  const stop=()=>{cancelAnimationFrame(raf);raf=0;};
  /* hover + clique — cartão de evidência */
  function domainAt(mx,my){
    for(const rg of uniRegions){
      const sx=rg.cx*cam.z+cam.x+panX,sy=rg.cy*cam.z+cam.y+panY;
      if(Math.abs(mx-sx)<rg.rx*cam.z&&Math.abs(my-sy)<rg.ry*cam.z)return rg.attr;
    }
    return null;
  }
  function starAt(mx,my){
    let best=-1,bd=Math.max(14,18*cam.z);
    shown.forEach((s,i)=>{
      const d=Math.hypot(s.x*W*cam.z+cam.x+panX-mx,s.y*H*cam.z+cam.y+panY-my);
      if(d<bd){bd=d;best=i;}
    });
    return best;
  }
  function hideCard(){if(card){card.remove();card=null;}}
  function place(s){
    /* posição no ecrã = mundo × câmara (o cartão segue o dolly) */
    const sx=s.x*W*cam.z+cam.x,sy=s.y*H*cam.z+cam.y;
    card.style.left=Math.min(W*.8,Math.max(W*.05,sx))+'px';
    card.style.top=Math.min(H*.62,Math.max(H*.05,sy))+'px';
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
    const r=reqText(domain,s.req),bi=bornInfo(domain,s.id);
    card=document.createElement('div');card.className='const-card';
    card.innerHTML=`<span class="cx">✕</span>
      <div class="ck">Estrela nascida</div>
      <b>${s.n}</b>
      <div class="now">Evidência: ${r.need}${bi?'<br>'+bi:''}</div>`;
    place(s);
  }
  /* zoom cinematográfico: wheel ancorado ao cursor, pinch, arrasto quando
     ampliado, duplo-clique repõe. Tudo alvos da mola — a câmara persegue. */
  const ptrs=new Map();let pinch=null,drag=null,clickSquelch=false;
  cv.addEventListener('wheel',e=>{
    e.preventDefault();
    if(pendingEnter)return; /* durante o fly-in a câmara é do sistema */
    /* zoom-out no limite do domínio = regressar ao universo */
    if(mode==='domain'&&e.deltaY>0&&zt<=ZMIN+.001){flyOut();return;}
    const r=cv.getBoundingClientRect();
    const mx=e.clientX-r.left,my=e.clientY-r.top;
    const z0=zt;
    zt=Math.min(zmax(),Math.max(ZMIN,zt*Math.exp(-e.deltaY*.0016)));
    if(zt===z0)return;
    /* o ponto sob o cursor fica no lugar durante o dolly */
    oxT=mx-(mx-oxT)*(zt/z0);oyT=my-(my-oyT)*(zt/z0);
    hideCard();setCam(false);
  },{passive:false});
  cv.addEventListener('dblclick',()=>{hideCard();if(mode==='domain')flyOut();else resetCam();});
  cv.addEventListener('pointerdown',e=>{
    clickSquelch=false;
    ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===2){
      const[a,b]=[...ptrs.values()];
      pinch={d:Math.hypot(a.x-b.x,a.y-b.y)};drag=null;
    }else if(zt>1.001){
      drag={x:e.clientX,y:e.clientY,ox:oxT,oy:oyT,moved:false};
      try{cv.setPointerCapture(e.pointerId);}catch(err){}
    }
  });
  const endPtr=e=>{
    ptrs.delete(e.pointerId);
    if(ptrs.size<2)pinch=null;
    if(drag){drag=null;cv.style.cursor='';}
  };
  cv.addEventListener('pointerup',endPtr);
  cv.addEventListener('pointercancel',endPtr);
  cv.addEventListener('pointermove',e=>{
    const r=cv.getBoundingClientRect();
    if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(pinch&&ptrs.size===2){
      const[a,b]=[...ptrs.values()];
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d>0&&pinch.d>0){
        const mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top;
        const z0=zt;
        zt=Math.min(zmax(),Math.max(ZMIN,zt*d/pinch.d));
        if(zt!==z0){oxT=mx-(mx-oxT)*(zt/z0);oyT=my-(my-oyT)*(zt/z0);hideCard();setCam(false);}
      }
      pinch.d=d;clickSquelch=true;
      return;
    }
    if(drag){
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>3){drag.moved=true;clickSquelch=true;cv.style.cursor='grabbing';}
      if(drag.moved){oxT=drag.ox+dx;oyT=drag.oy+dy;setCam(false);}
      return;
    }
    if(mode==='universe'){
      cv.style.cursor=domainAt(e.clientX-r.left,e.clientY-r.top)?'pointer':'';
    }else{
      const i=starAt(e.clientX-r.left,e.clientY-r.top);
      if(i!==hovIdx){
        hovIdx=i;cv.style.cursor=i>=0?'pointer':'';
        if(starGeo){const hv=starGeo.attributes.aHov;
          hv.array.fill(0);if(i>=0)hv.array[i]=1;hv.needsUpdate=true;
          if(rm.matches||!raf)renderer.render(scene,camera);}
      }
    }
    panTX=((e.clientX-r.left)/W-.5)*10;panTY=((e.clientY-r.top)/H-.5)*7;
  },{passive:true});
  cv.addEventListener('pointerleave',()=>{panTX=0;panTY=0;},{passive:true});
  cv.addEventListener('click',e=>{
    if(clickSquelch){clickSquelch=false;return;}
    if(pendingEnter)return;
    const r=cv.getBoundingClientRect();
    if(mode==='universe'){
      const d=domainAt(e.clientX-r.left,e.clientY-r.top);
      if(d)flyIn(d);
      return;
    }
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
