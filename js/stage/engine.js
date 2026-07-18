import * as THREE from '../vendor/three.module.min.js';

/* motor do palco — um WebGLRenderer no canvas #dust, loop único, relógio que
   pausa com o separador oculto, guarda de FPS (degrada densidade/dpr, nunca o
   frame rate; nunca promove de volta na sessão), resize com debounce e
   parallax de scroll suavizado. As camadas registam-se com
   {mesh, resize, update, degrade}. */
export function createEngine(canvas,tier,world,updateWorld){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:false,depth:false,
    stencil:false,alpha:false,powerPreference:'high-performance'});
  renderer.setClearColor(0x050310,1);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const layers=[];
  let raf=0,last=0,t=0,glowT=-9;
  let scroll=scrollY||0;
  let degraded=false,ft=0,fn=0;
  const ctx={world,scroll:scroll,t:0};
  function size(){
    const W=innerWidth,H=innerHeight;
    const pix=degraded?1:Math.min(devicePixelRatio||1,tier==='full'?1.5:1);
    renderer.setPixelRatio(pix);renderer.setSize(W,H);
    layers.forEach(l=>l.resize(W,H,pix));
  }
  function tick(now){
    raf=requestAnimationFrame(tick);
    if(!last)last=now;
    const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;
    /* guarda de FPS — abaixo de ~48fps sustentados degrada uma vez */
    if(dt<.2){ft+=dt;fn++;}
    if(fn>=150){
      if(!degraded&&ft/fn>.021){degraded=true;layers.forEach(l=>l.degrade&&l.degrade());size();}
      ft=0;fn=0;
    }
    if(t-glowT>5){glowT=t;updateWorld();}
    scroll+=((scrollY||0)-scroll)*.1;
    ctx.scroll=scroll;ctx.t=t;
    layers.forEach(l=>l.update(t,dt,ctx));
    renderer.render(scene,camera);
  }
  function start(){if(raf||document.hidden)return;last=0;raf=requestAnimationFrame(tick);}
  function stop(){cancelAnimationFrame(raf);raf=0;}
  let rsT=0;
  addEventListener('resize',()=>{clearTimeout(rsT);rsT=setTimeout(size,150);});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stop();});
  canvas.addEventListener('webglcontextrestored',()=>start());
  return{
    add(l){layers.push(l);if(l.mesh)scene.add(l.mesh);},
    size,start,stop,
    get running(){return !!raf;},
    renderer};
}
