import * as THREE from '../vendor/three.module.min.js';

/* Constelações (Missão 12 · Sprint 4 · 4A) — o céu do Operador.
   Canvas WebGL próprio dentro do painel, render ON DEMAND: desenha uma frame
   quando o estado muda, o domínio troca, o painel entra no viewport ou a
   janela muda de tamanho — entre isso, custo zero (sem loop rAF nesta fase).
   Estados por estrela: acesa (regra de evidência verdadeira), descoberta
   (ténue — adjacente a uma acesa, ou a raiz da constelação), oculta (nem se
   desenha: o céu esconde o que ainda está longe). Só as acesas têm nome. */

function evalReq(attr,req){
  try{
    if(typeof S==='undefined'||!S)return false;
    if(req.lvl!=null)return S.attrs[attr].level>=req.lvl;
    if(req.title)return !!(S.titleUnlocked&&S.titleUnlocked[req.title]);
    if(req.streak!=null){
      const all=[...(S.oblig||[]),...(S.extras||[])].map(h=>h.streak||0);
      return Math.max(0,...all,0)>=req.streak;
    }
    if(req.done!=null)
      return (S.objectives||[]).filter(o=>o.area===attr&&o.status==='done').length>=req.done;
  }catch(e){}
  return false;
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
  return{c,lit,disc};
}

const hxv=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];

const BG_VERT=`varying vec2 vUv;
void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}`;
const BG_FRAG=`varying vec2 vUv;uniform vec3 uTint;
void main(){
  vec3 col=mix(vec3(.016,.012,.043),vec3(.043,.027,.09),vUv.y*.7);
  col+=uTint*.05*(1.-vUv.y);
  float vg=smoothstep(1.15,.3,length(vUv-vec2(.5,.5)));
  col*=mix(.85,1.,vg);
  gl_FragColor=vec4(col,1.);
}`;
const ST_VERT=`attribute float aSize;attribute float aMode;
uniform vec2 uRes;uniform float uPix;
varying float vMode;
void main(){
  gl_Position=vec4(position.x/uRes.x*2.-1.,1.-position.y/uRes.y*2.,0.,1.);
  gl_PointSize=aSize*uPix;vMode=aMode;
}`;
const ST_FRAG=`uniform vec3 uCol;varying float vMode;
void main(){
  float d=length(gl_PointCoord-.5);
  float core=smoothstep(.3,.06,d);
  float halo=smoothstep(.5,.1,d)*.55;
  float a=mix(core*.4+halo*.1,core+halo,vMode);
  vec3 col=mix(vec3(.6,.56,.76),uCol,vMode);
  gl_FragColor=vec4(col*a,a);
}`;

export function initConstellation(){
  const cv=document.getElementById('constel-cv');
  if(!cv||typeof CONSTELLATIONS==='undefined')return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:false,depth:false,stencil:false});}
  catch(e){return;} /* sem WebGL: o painel fica quieto; fallback DOM chega na 4C */
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const labels=document.getElementById('const-labels');
  const chips=document.getElementById('const-chips');
  const wrap=cv.parentElement;
  const pix=Math.min(devicePixelRatio||1,1.5);
  let domain='oficio',W=1,H=1,vis=false,dirty=true,lastKey='';

  function buildChips(){
    if(!chips||typeof ATTRS==='undefined')return;
    chips.innerHTML=ATTRS.map(a=>
      `<div class="const-chip ${a.id===domain?'on':''}" data-d="${a.id}">
        <span class="cd" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></span>${a.name}</div>`).join('');
    [...chips.children].forEach(el=>el.onclick=()=>{domain=el.dataset.d;buildChips();draw(true);});
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
  }
  function stateKey(st){
    return domain+'|'+st.c.stars.map(s=>st.lit[s.id]?'1':st.disc[s.id]?'d':'0').join('');
  }
  function draw(force){
    if(!vis&&!force){dirty=true;return;}
    const st=domainState(domain);if(!st)return;
    const key=stateKey(st);
    if(!force&&key===lastKey)return;
    lastKey=key;dirty=false;
    size();clear();if(labels)labels.innerHTML='';
    const dcol=(typeof AM!=='undefined'&&AM[domain])?AM[domain].color:'#a78bfa';
    const tint=hxv(dcol);
    /* fundo */
    const bg=new THREE.BufferGeometry();
    bg.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
    const bgm=new THREE.ShaderMaterial({vertexShader:BG_VERT,fragmentShader:BG_FRAG,
      depthTest:false,depthWrite:false,
      uniforms:{uTint:{value:new THREE.Vector3(...tint)}}});
    const bgMesh=new THREE.Mesh(bg,bgm);bgMesh.frustumCulled=false;bgMesh.renderOrder=0;
    scene.add(bgMesh);
    /* ligações: entre estrelas visíveis; par aceso-aceso brilha mais */
    const visSt=s=>st.lit[s.id]||st.disc[s.id];
    const byId={};st.c.stars.forEach(s=>byId[s.id]=s);
    const litSeg=[],dimSeg=[];
    st.c.links.forEach(([a,b])=>{
      const A=byId[a],B=byId[b];
      if(!visSt(A)||!visSt(B))return;
      const seg=[A.x*W,A.y*H,0,B.x*W,B.y*H,0];
      (st.lit[a]&&st.lit[b]?litSeg:dimSeg).push(...seg);
    });
    const mkLines=(arr,op)=>{
      if(!arr.length)return;
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(arr),3));
      const m=new THREE.ShaderMaterial({
        vertexShader:`uniform vec2 uRes;void main(){gl_Position=vec4(position.x/uRes.x*2.-1.,1.-position.y/uRes.y*2.,0.,1.);}`,
        fragmentShader:`uniform vec3 uCol;uniform float uOp;void main(){gl_FragColor=vec4(uCol*uOp,uOp);}`,
        transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
        uniforms:{uRes:{value:new THREE.Vector2(W,H)},uCol:{value:new THREE.Vector3(...tint)},uOp:{value:op}}});
      const l=new THREE.LineSegments(g,m);l.frustumCulled=false;l.renderOrder=1;
      scene.add(l);
    };
    mkLines(dimSeg,.09);mkLines(litSeg,.32);
    /* estrelas */
    const shown=st.c.stars.filter(visSt);
    if(shown.length){
      const pos=new Float32Array(shown.length*3),sz=new Float32Array(shown.length),md=new Float32Array(shown.length);
      shown.forEach((s,i)=>{
        pos[i*3]=s.x*W;pos[i*3+1]=s.y*H;
        sz[i]=st.lit[s.id]?16:6;md[i]=st.lit[s.id]?1:0;
      });
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.BufferAttribute(pos,3));
      g.setAttribute('aSize',new THREE.BufferAttribute(sz,1));
      g.setAttribute('aMode',new THREE.BufferAttribute(md,1));
      const m=new THREE.ShaderMaterial({vertexShader:ST_VERT,fragmentShader:ST_FRAG,
        transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
        uniforms:{uRes:{value:new THREE.Vector2(W,H)},uPix:{value:pix},
          uCol:{value:new THREE.Vector3(...tint)}}});
      const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=2;
      scene.add(pts);
      /* nomes — só as acesas (a descoberta é mistério até acender) */
      if(labels)shown.forEach(s=>{
        if(!st.lit[s.id])return;
        const d=document.createElement('div');d.className='const-lb';
        d.style.left=(s.x*100)+'%';d.style.top=(s.y*100)+'%';d.style.color=dcol;
        d.textContent=s.n;labels.appendChild(d);
      });
    }
    renderer.render(scene,camera);
  }
  if('IntersectionObserver'in window){
    new IntersectionObserver(es=>{
      vis=es[0].isIntersecting;
      if(vis&&dirty)draw(true);
    }).observe(wrap);
  }else vis=true;
  let rsT=0;
  addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(()=>draw(true),200);});
  /* chamado no fim de cada render() clássico — só redesenha se o estado mudou */
  window.renderConstellation=()=>draw(false);
  buildChips();size();draw(true);
}
