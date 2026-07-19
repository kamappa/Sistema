/* estado do mundo — camadas derivadas de dados reais; o palco nunca escreve S.
   hour/rain alimentam o Solar Engine (solar.js), que por sua vez escreve
   world.glow (brilho das estrelas) a partir da mesma curva de luz.
   window.ambientRain é escrito pelo lado CSS do Solar (weatherNow ← S.weather).
   world.core (M17·F2) = estado do Núcleo (0-5), amostrado a cada 5s do
   coreState() das constelações — derivado de evidência, nunca à mão. */
import {coreState} from './constellation.js';
export const world={hour:0,glow:1,rain:false,arc:null,recovery:false,energy:0,pace:1,presence:0,core:0};
let coreLast=0,coreVal=0;
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
  const now=Date.now();
  if(now-coreLast>5000){
    coreLast=now;
    try{coreVal=coreState().state;}catch(e){coreVal=0;}
  }
  world.core=coreVal;
}
