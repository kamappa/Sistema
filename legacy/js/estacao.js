/* ===== MODO ESTAÇÃO (Missão 24 · Universe Navigation · Camada II) =====
   A viagem entre zonas do HUD deixa de ser scroll linear e passa a ser um
   voo de câmara: a cena AFASTA-SE (dolly-out por transform sobre o .wrap),
   DESLOCA-SE (o scroll real desliza para o destino, por baixo do zoom) e
   APROXIMA-SE (dolly-in), assentando com transform limpo. "A câmara
   desloca-se dentro do organismo" — sem eliminar o scroll (repouso = scroll
   normal, transform nenhum), por isso é aditivo, reversível e vale em mobile.

   Fase A: o voo com dolly (Estacao.flyTo) — o Dock Celeste delega-lhe a
   viagem. Fase B: o Mapa da Estação — um overlay navegável (planetas em
   anel à volta do Núcleo, a linguagem do hexágono/Vista de Universo) que
   funciona igual em desktop e toque; é a entrada de navegação em mobile,
   onde o Dock não nasce. Tocar num planeta fecha o mapa e voa lá.

   reduced-motion ou sem Motion: salto direto (scrollTo), sem câmara.
   Script clássico, como o resto da UI. */
window.Estacao=(function(){
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  const wrap=document.querySelector('.wrap');
  const AMP=.11; /* profundidade do dolly — afasta ~11% a meio da viagem */

  /* zonas do HUD = planetas da estação (mesmo conjunto do Dock Celeste;
     âncora real no DOM, cor própria). A ordem no anel é a de página. */
  const Z=[
    {id:'greet-h',   l:'Núcleo',  c:'#e9d5ff',center:true},
    {id:'oblig',     l:'Diário',  c:'#f59e0b'},
    {id:'objs',      l:'Missões', c:'#a78bfa'},
    {id:'constel-cv',l:'Céu',     c:'#8b5cf6'},
    {id:'training',  l:'Treino',  c:'#f472b6'},
    {id:'recall',    l:'Revisão', c:'#34d399'},
    {id:'oc-log',    l:'Conselho',c:'#d946ef'},
  ];
  function anchor(id){
    const a=document.getElementById(id);if(!a)return null;
    return a.closest('.panel')||a.closest('.greet')||a;
  }
  function alvoDe(id){
    const el=anchor(id);if(!el)return null;
    const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    return Math.min(max,Math.max(0,el.getBoundingClientRect().top+scrollY-64));
  }

  /* ===== Fase A — voo com dolly ===== */
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
  function flyTo(targetFn){
    const y=(typeof targetFn==='function')?targetFn():targetFn;
    if(y==null)return;
    getY=(typeof targetFn==='function')?targetFn:()=>y;
    if(rm.matches||!sp||!wrap){window.scrollTo(0,y);return;}
    y0=scrollY;flying=true;
    if(wrap)wrap.style.willChange='transform';
    sp.snap(0);sp.set(1);
    clearTimeout(reT);
    reT=setTimeout(()=>{if(flying)sp.set(1);},650);
  }
  function cancel(){if(flying)clean();}
  addEventListener('wheel',cancel,{passive:true});
  addEventListener('touchstart',cancel,{passive:true});
  addEventListener('keydown',e=>{
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))cancel();
  },{passive:true});
  rm.addEventListener('change',()=>{if(rm.matches)cancel();});

  /* ===== Fase B — o Mapa da Estação (overlay navegável) ===== */
  let fab=null,map=null,mapOpen=false;
  function zonaAtiva(){
    /* a zona mais próxima da linha do quarto superior do ecrã (robusto no fim
       da página) — o mesmo critério do Dock, para os dois concordarem */
    const y=scrollY+innerHeight*.25;let cur=Z[0].id,best=1e9;
    for(const z of Z){const el=anchor(z.id);if(!el)continue;
      const d=Math.abs(el.getBoundingClientRect().top+scrollY-y);
      if(d<best){best=d;cur=z.id;}}
    return cur;
  }
  function buildMap(){
    map=document.createElement('div');
    map.className='station-map';map.setAttribute('role','dialog');
    map.setAttribute('aria-label','Mapa da Estação');map.setAttribute('aria-modal','true');
    const stage=document.createElement('div');stage.className='station-stage';
    map.innerHTML='<button class="station-x" aria-label="Fechar mapa">✕</button>'
      +'<div class="station-hint">Estação · escolhe um destino</div>';
    Z.forEach((z,i)=>{
      const b=document.createElement('button');
      b.type='button';b.className='station-planet'+(z.center?' big':'');
      b.dataset.z=z.id;
      let x=50,y=50;
      if(!z.center){const a=-Math.PI/2+(i-1)*Math.PI/3;x=50+42*Math.cos(a);y=50+42*Math.sin(a);}
      b.style.left=x+'%';b.style.top=y+'%';
      b.innerHTML='<span class="pdot" style="background:'+z.c+';box-shadow:0 0 12px '+z.c+'"></span>'
        +'<span class="plabel">'+z.l+'</span>';
      b.onclick=()=>{closeMap();flyTo(()=>alvoDe(z.id));};
      stage.appendChild(b);
    });
    map.appendChild(stage);
    map.querySelector('.station-x').onclick=closeMap;
    map.onclick=e=>{if(e.target===map)closeMap();}; /* tocar fora fecha */
    document.body.appendChild(map);
  }
  function openMap(){
    if(!map)buildMap();
    const cur=zonaAtiva();
    [...map.querySelectorAll('.station-planet')].forEach(b=>
      b.classList.toggle('on',b.dataset.z===cur));
    mapOpen=true;map.classList.add('on');
    if(fab)fab.classList.add('open');
  }
  function closeMap(){
    mapOpen=false;if(map)map.classList.remove('on');
    if(fab)fab.classList.remove('open');
  }
  function toggleMap(){mapOpen?closeMap():openMap();}
  addEventListener('keydown',e=>{if(e.key==='Escape'&&mapOpen)closeMap();});

  /* o gatilho da estação — nasce em desktop E mobile (resolve a entrada em
     toque, onde o Dock não existe); aparece depois do boot acalmar */
  function initFab(){
    fab=document.createElement('button');
    fab.type='button';fab.className='station-fab';
    fab.setAttribute('aria-label','Abrir Mapa da Estação');fab.title='Mapa da Estação';
    fab.textContent='✦';
    fab.onclick=toggleMap;
    document.body.appendChild(fab);
    setTimeout(()=>fab.classList.add('ready'),1200);
  }
  if(document.body)initFab();
  else addEventListener('DOMContentLoaded',initFab);

  return{flyTo,cancel,openMap,closeMap,toggleMap,get flying(){return flying;},get mapOpen(){return mapOpen;}};
})();
