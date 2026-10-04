/* estado do mundo — camadas derivadas de dados reais; o palco nunca escreve S.
   hour/rain alimentam o Solar Engine (solar.js), que por sua vez escreve
   world.glow (brilho das estrelas) a partir da mesma curva de luz.
   window.ambientRain é escrito pelo lado CSS do Solar (weatherNow ← S.weather).
   world.core (M17·F2) = estado do Núcleo (0-5), amostrado a cada 5s do
   coreState() das constelações — derivado de evidência, nunca à mão. */
import {coreState} from './constellation.js';
export const world={hour:0,glow:1,rain:false,arc:null,recovery:false,energy:0,pace:1,presence:0,core:0,neglect:0,sunday:false};
let coreLast=0,coreVal=0;
/* negligência (M23 · Camada II): dias sem progresso real, medidos ao registo
   de XP (S.history agrega por dia; a última entrada é o último dia com
   ação registada). 0 até 2 dias; cresce linearmente até 1 aos 14. Recovery
   é descanso deliberado — nunca conta como negligência. Sistema sem
   histórico não é julgado. */
function neglectNow(){
  try{
    if(world.recovery)return 0;
    const h=(typeof S!=='undefined')&&S&&S.history;
    if(!h||!h.length)return 0;
    const last=h[h.length-1].d;
    const days=(Date.now()-new Date(last+'T12:00:00').getTime())/864e5;
    return Math.max(0,Math.min(1,(days-2)/12));
  }catch(e){return 0;}
}
let hourOverride=null;
export function setHourOverride(h){hourOverride=h;} // Stage.debug — verificação da 1D
export function updateWorld(){
  const d=new Date();
  world.hour=(hourOverride!=null)?hourOverride:d.getHours()+d.getMinutes()/60;
  world.rain=!!window.ambientRain;
  /* camadas do World Engine real (2B): arco sazonal ativo tinge a nebulosa;
     Recovery acalma o mundo. Globais clássicos podem não existir pré-auth. */
  try{
    const a=(typeof seasonArcNow==='function')&&seasonArcNow();
    const wa=(typeof S!=='undefined')&&S&&S.worldArc;
    world.arc=(a&&wa&&wa.id===a.id&&wa.status==='active')?a.id:null;
  }catch(e){world.arc=null;}
  try{
    world.recovery=!!((typeof S!=='undefined')&&S&&S.recovery
      &&typeof today==='function'&&today()<=S.recovery.until);
  }catch(e){world.recovery=false;}
  world.neglect=neglectNow();
  world.sunday=d.getDay()===0; /* ao domingo o universo está mais calmo */
  const now=Date.now();
  if(now-coreLast>5000){
    coreLast=now;
    try{coreVal=coreState().state;}catch(e){coreVal=0;}
  }
  world.core=coreVal;
}
