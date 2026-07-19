/* palco WebGL — entry point da ilha de ES modules (Missão 12 · Sprint 1 · 1A).
   Substitui o antigo fundo canvas 2D no mesmo canvas #dust e expõe a façade
   clássica (dustStart, dustBurst, dustSpark) com os mesmos nomes, para que
   fx.js, engine.js e o boot sequence continuem intactos. Tier off = não cria
   renderer nenhum; fica o fundo CSS (aurora + horizon). */
import {detect} from './caps.js';
import {world,updateWorld,setHourOverride} from './state.js';
import {createEngine} from './engine.js';
import {createSky} from './sky.js';
import {createStars} from './stars.js';
import {createDust} from './dust.js';
import {createMeteor} from './meteor.js';
import {createReact} from './react.js';
import {createSolarCss,createSolarLayer} from './solar.js';
import {initConstellation} from './constellation.js';

const rm=matchMedia('(prefers-reduced-motion: reduce)');
window.Stage={tier:'off'};
/* o lado CSS do Solar corre sempre — mesmo com o palco off, a UI é iluminada
   pelo mundo (cores ao longo de minutos não são movimento) */
createSolarCss(world,updateWorld);
/* constelações (Sprint 4): independentes do tier do palco — o render é
   estático/on-demand (sem movimento), por isso reduced-motion não as apaga;
   sem WebGL o init desiste sozinho */
initConstellation();
const cap=detect();
if(cap.tier!=='off')init(cap.tier);
else if(cap.reason==='rm'){
  /* reduced-motion pode ser desligado em runtime — só aí o palco nasce */
  const re=()=>{if(!rm.matches){const c=detect();if(c.tier!=='off'){rm.removeEventListener('change',re);init(c.tier);}}};
  rm.addEventListener('change',re);
}

function hexTo(hex,fb){
  if(/^#[0-9a-f]{6}$/i.test(hex||''))
    return[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];
  return fb;
}

function init(tier){
  const canvas=document.getElementById('dust');if(!canvas)return;
  updateWorld();
  const engine=createEngine(canvas,tier,world,updateWorld);
  const sky=createSky(tier),dust=createDust(tier),meteor=createMeteor(tier);
  const react=createReact(world);
  /* ordem das camadas: Solar (cores/glow) → React (energia) escrevem;
     céu, estrelas, meteoro e poeira leem depois */
  engine.add(createSolarLayer(sky,world));engine.add(react);
  engine.add(sky);engine.add(createStars(tier));engine.add(meteor);engine.add(dust);
  engine.size();
  window.Stage={tier,engine,debug:{
    setHour(h){
      setHourOverride(h);updateWorld();
      if(window.ambientApply)ambientApply();
    },
    meteor(){meteor.fire();},
    pulse(v){react.fire(v);},
    energy(){return react.value;},
    world(){return{hour:world.hour,pace:world.pace,glow:world.glow,arc:world.arc,recovery:world.recovery,presence:world.presence,core:world.core};},
  }};
  /* façade clássica — mesmos nomes e semântica do fundo 2D removido */
  window.dustStart=()=>{if(!rm.matches)engine.start();};
  window.dustBurst=hex=>{
    if(rm.matches)return;
    const c=hexTo(hex,[167,139,250]),H=innerHeight;
    const b=document.getElementById('rankbadge'),r=b?b.getBoundingClientRect():null;
    const vis=r&&r.top>0&&r.top<H;
    dust.burst(vis?r.left+r.width/2:innerWidth/2,vis?r.top+r.height/2:Math.min(140,H/3),c);
    engine.start();
  };
  window.dustSpark=(x,y,hex,n)=>{
    if(rm.matches)return;
    dust.spark(x,y,hexTo(hex,[167,139,250]),n||4);
    engine.start();
  };
  rm.addEventListener('change',()=>rm.matches?engine.stop():engine.start());
  if(!document.documentElement.classList.contains('boot'))engine.start();
  else setTimeout(()=>engine.start(),1500); /* rede de segurança se o boot não chamar dustStart */
  /* overlay de frame time (?fps=1) — verificação da 1D em hardware real */
  if(new URLSearchParams(location.search).get('fps')){
    const el=document.createElement('div');
    el.style.cssText='position:fixed;top:8px;right:8px;z-index:99;padding:4px 8px;'
      +'font:11px/1.4 monospace;color:#a7f3d0;background:rgba(4,2,10,.7);'
      +'border:1px solid rgba(167,139,250,.3);pointer-events:none';
    document.body.appendChild(el);
    setInterval(()=>{
      const ms=engine.stats.dt;
      el.textContent=tier+(engine.stats.degraded?'↓':'')+' · '
        +ms.toFixed(1)+' ms · '+Math.round(1000/ms)+' fps'
        +(engine.running?'':' · pausado');
    },500);
  }
}
