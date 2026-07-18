/* deteção de capacidade — o tier decide-se antes de criar o renderer.
   off:  prefers-reduced-motion ou sem WebGL (fica o fundo CSS: aurora+horizon).
   lite: mobile / pouca memória / save-data — metade das contagens, dpr 1.
   full: resto. Em runtime a guarda de FPS ainda pode despromover (engine.js). */
export function detect(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return{tier:'off',reason:'rm'};
  let gl=null;
  try{const c=document.createElement('canvas');gl=c.getContext('webgl2')||c.getContext('webgl');}catch(e){}
  if(!gl)return{tier:'off',reason:'nogl'};
  const lc=gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext();
  const lite=matchMedia('(pointer:coarse)').matches||innerWidth<720
    ||(navigator.deviceMemory||8)<=4||!!(navigator.connection&&navigator.connection.saveData);
  return{tier:lite?'lite':'full',reason:''};
}
