/* estado do mundo — camadas derivadas de dados reais; o palco nunca escreve S.
   hour/rain alimentam o Solar Engine (solar.js), que por sua vez escreve
   world.glow (brilho das estrelas) a partir da mesma curva de luz.
   window.ambientRain é escrito pelo lado CSS do Solar (weatherNow ← S.weather). */
export const world={hour:0,glow:1,rain:false};
let hourOverride=null;
export function setHourOverride(h){hourOverride=h;} // Stage.debug — verificação da 1D
export function updateWorld(){
  const d=new Date();
  world.hour=(hourOverride!=null)?hourOverride:d.getHours()+d.getMinutes()/60;
  world.rain=!!window.ambientRain;
}
