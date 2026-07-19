/* ===== DOCK CELESTE (Missão 19 · Universe Navigation · Fase 1) =====
   Navegação como viagem, não como salto: um mini-hexágono fixo (só
   desktop/pointer:fine — em ecrã pequeno não nasce) com as zonas
   principais do HUD. Clicar viaja em mola (Motion.Spring, a física do
   sistema) até ao painel; o parallax de scroll do palco WebGL faz o
   dolly do céu de graça. Aditivo e reversível: o scroll normal continua
   intacto e qualquer wheel/touch do Daniel cancela a viagem na hora.
   reduced-motion: salto direto sem animação. */
(function(){
  if(!matchMedia('(pointer:fine)').matches||innerWidth<900)return;
  const rm=matchMedia('(prefers-reduced-motion: reduce)');
  /* zona → âncora real no DOM (ordem de página irrelevante: o ativo é
     calculado pela posição real) */
  const Z=[
    {id:'greet-h',   l:'Núcleo',  c:'#e9d5ff',center:true},
    {id:'oblig',     l:'Diário',  c:'#f59e0b'},
    {id:'objs',      l:'Missões', c:'#a78bfa'},
    {id:'constel-cv',l:'Céu',     c:'#8b5cf6'},
    {id:'training',  l:'Treino',  c:'#f472b6'},
    {id:'recall',    l:'Revisão', c:'#34d399'},
    {id:'oc-log',    l:'Conselho',c:'#d946ef'},
  ];
  const dock=document.createElement('nav');
  dock.className='cdock';dock.setAttribute('aria-label','Navegação celeste');
  const CX=52,CY=52,R=40;
  Z.forEach((z,i)=>{
    const b=document.createElement('button');
    b.type='button';b.className='cdock-dot'+(z.center?' big':'');
    b.dataset.z=z.id;b.dataset.l=z.l;b.title=z.l;
    b.style.background=z.c;b.style.boxShadow='0 0 8px '+z.c;
    let x=CX,y=CY;
    if(!z.center){const a=-Math.PI/2+(i-1)*Math.PI/3;x=CX+R*Math.cos(a);y=CY+R*Math.sin(a);}
    b.style.left=x+'px';b.style.top=y+'px';
    b.onclick=()=>travel(z.id);
    dock.appendChild(b);
  });
  document.body.appendChild(dock);
  setTimeout(()=>dock.classList.add('ready'),1200); /* depois do boot acalmar */

  const sp=(window.Motion&&Motion.Spring)
    ?new Motion.Spring(1,Motion.TOK.gentle,v=>window.scrollTo(0,v[0]))
    :null;
  let traveling=false;
  function anchor(id){
    const a=document.getElementById(id);if(!a)return null;
    return a.closest('.panel')||a.closest('.greet')||a;
  }
  let reT=0;
  function alvoDe(id){
    const el=anchor(id);if(!el)return null;
    const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
    return Math.min(max,Math.max(0,el.getBoundingClientRect().top+scrollY-64));
  }
  function travel(id){
    const y=alvoDe(id);if(y==null)return;
    if(rm.matches||!sp){window.scrollTo(0,y);return;}
    traveling=true;
    sp.snap(scrollY);sp.set(y);
    /* a página pode crescer durante a viagem (conteúdo a materializar-se);
       re-apontar uma vez a meio garante o encaixe no destino real */
    clearTimeout(reT);
    reT=setTimeout(()=>{
      if(!traveling)return;
      const y2=alvoDe(id);
      if(y2!=null&&Math.abs(y2-y)>8)sp.set(y2);
    },650);
  }
  /* a mão do Daniel manda sempre: qualquer scroll dele mata a viagem */
  const cancel=()=>{if(traveling&&sp){sp.snap(scrollY);traveling=false;}};
  addEventListener('wheel',cancel,{passive:true});
  addEventListener('touchstart',cancel,{passive:true});
  addEventListener('keydown',e=>{
    if(['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(e.key))cancel();
  },{passive:true});
  /* ponto ativo = zona mais próxima acima do terço superior do ecrã */
  let tick=false;
  function mark(){
    tick=false;
    /* ativo = a zona mais PRÓXIMA da linha do quarto superior do ecrã —
       robusto mesmo quando o fim da página impede o encaixe exato */
    const y=scrollY+innerHeight*.25;
    let cur=Z[0].id,best=1e9;
    for(const z of Z){
      const el=anchor(z.id);if(!el)continue;
      const d=Math.abs(el.getBoundingClientRect().top+scrollY-y);
      if(d<best){best=d;cur=z.id;}
    }
    [...dock.children].forEach(b=>b.classList.toggle('on',b.dataset.z===cur));
  }
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(mark);}},{passive:true});
  mark();
})();
