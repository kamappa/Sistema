/* ===== BUS DE EVENTOS (Missão 12 · 2B) =====
   Pub/sub mínimo para "o mundo reage": o código clássico emite factos
   (xp:gain, rank:up) com ganchos de 1 linha; o palco WebGL ouve. Se o palco
   estiver off, os eventos caem no vazio sem erro — desacoplamento total.
   Um listener que rebente nunca derruba o emissor. */
window.Bus=(function(){
  const m={};
  return{
    on(ev,fn){(m[ev]=m[ev]||[]).push(fn);},
    off(ev,fn){m[ev]=(m[ev]||[]).filter(f=>f!==fn);},
    emit(ev,d){(m[ev]||[]).forEach(f=>{try{f(d)}catch(e){}});},
  };
})();
