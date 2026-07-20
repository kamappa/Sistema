/* ===== MODO ESTAÇÃO (Missão 24 · Universe Navigation · Camada II) =====
   A viagem entre zonas do HUD deixa de ser scroll linear e passa a ser um
   voo de câmara: a cena AFASTA-SE (dolly-out por transform sobre o .wrap),
   DESLOCA-SE (o scroll real desliza para o destino, por baixo do zoom) e
   APROXIMA-SE (dolly-in), assentando com transform limpo. "A câmara
   desloca-se dentro do organismo" — sem eliminar o scroll (repouso = scroll
   normal, transform nenhum), por isso é aditivo, reversível e vale em mobile.

   O dolly vive só durante a viagem: o transform-origin é ancorado ao centro
   do que está no ecrã (scrollY+innerH/2), logo o afastamento é centrado no
   olhar e o scroll real por baixo nunca briga com um transform permanente.
   O parallax do palco WebGL lê scrollY — acompanha o voo de graça.

   reduced-motion ou sem Motion: salto direto (scrollTo), sem câmara.
   Expõe window.Estacao.flyTo — o Dock Celeste (nav.js) delega-lhe a viagem;
   qualquer wheel/touch/tecla do Operador cancela o voo na hora (a mão manda).
   Script clássico, como o resto da UI. */
window.Estacao=(function(){
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const wrap=document.querySelector('.wrap');
  const AMP=.085; /* profundidade do dolly — afasta ~8.5% a meio da viagem */
  let flying=false,getY=null,y0=0,reT=0;

  function clean(){
    flying=false;clearTimeout(reT);
    if(wrap){wrap.style.transform='';wrap.style.transformOrigin='';wrap.style.willChange='';}
  }
  const sp=(window.Motion&&Motion.Spring)
    ?new Motion.Spring(1,Motion.TOK.gentle,x=>{
        if(!flying)return;
        const p=Math.max(0,Math.min(1,x[0]));
        const y=y0+((getY?getY():y0)-y0)*p;
        window.scrollTo(0,y);
        /* zoom em sino: 1 nas pontas, afasta a meio — "afasta → desloca → aproxima" */
        const z=1-AMP*Math.sin(Math.PI*p);
        if(wrap){
          wrap.style.transformOrigin='50% '+(y+innerHeight/2).toFixed(0)+'px';
          wrap.style.transform='scale('+z.toFixed(4)+')';
        }
        if(p>=.999)clean(); /* assenta: scroll real no destino, transform limpo */
      })
    :null;

  /* voa até targetFn() (função para reapontar se a página crescer durante o
     voo); com rm/sem mola, salto direto */
  function flyTo(targetFn){
    const y=(typeof targetFn==='function')?targetFn():targetFn;
    if(y==null)return;
    getY=(typeof targetFn==='function')?targetFn:()=>y;
    if(rm.matches||!sp||!wrap){window.scrollTo(0,y);return;}
    y0=scrollY;flying=true;
    if(wrap)wrap.style.willChange='transform';
    sp.snap(0);sp.set(1);
    /* a página pode materializar conteúdo durante o voo — reaponta a meio */
    clearTimeout(reT);
    reT=setTimeout(()=>{if(flying)sp.set(1);},650);
  }
  /* a mão do Operador manda sempre: qualquer gesto dele corta o voo e assenta
     no scroll onde estiver (sem deixar o wrap encolhido — evita painel morto) */
  function cancel(){if(flying)clean();}
  addEventListener('wheel',cancel,{passive:true});
  addEventListener('touchstart',cancel,{passive:true});
  addEventListener('keydown',e=>{
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))cancel();
  },{passive:true});
  rm.addEventListener('change',()=>{if(rm.matches)cancel();});

  return{flyTo,cancel,get flying(){return flying;}};
})();
