/* estado do mundo — camadas derivadas de dados reais; o palco nunca escreve S.
   Na 1A só a hora (brilho das estrelas) e a chuva (via window.ambientRain, que
   continua a ser escrito pelo motor de ambiente do fx.js até a 1B o absorver).
   A 1B acrescenta aqui o Solar Engine completo. */
export const world={hour:0,glow:1,rain:false};
let hourOverride=null;
export function setHourOverride(h){hourOverride=h;} // Stage.debug — verificação da 1D
export function updateWorld(){
  const d=new Date();
  world.hour=(hourOverride!=null)?hourOverride:d.getHours()+d.getMinutes()/60;
  world.glow=dayGlow(world.hour);
  world.rain=!!window.ambientRain;
}
/* estrelas plenas de noite, tímidas de dia — curva herdada do fundo 2D */
function dayGlow(h){
  if(h>=21.5||h<5.5)return 1;
  if(h<8.5)return 1-(h-5.5)/3*.45;
  if(h<17.5)return .55;
  return .55+(h-17.5)/4*.45;
}
