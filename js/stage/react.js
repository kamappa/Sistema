/* o mundo reage (Missão 12 · 2B) — a "energia" do palco. Ganhar XP dá um
   pulso que decai em ~2 s (a nebulosa respira mais forte, a poeira acelera
   ligeiramente); rank up dá uma vaga maior. Com Recovery ativo o mundo está
   deliberadamente mais calmo — os pulsos chegam amortecidos. A energia vive
   em world.energy e as outras camadas (céu, poeira) leem-na do ctx. */
export function createReact(world){
  let energy=0,presence=0;
  if(window.Bus){
    Bus.on('xp:gain',d=>{if(d&&d.amt>0)energy=Math.min(1.4,energy+(world.recovery?.25:.8));});
    Bus.on('rank:up',()=>{energy=1.6;});
    Bus.on('star:lit',()=>{energy=Math.max(energy,1.2);}); /* uma estrela nasceu (4B) */
    Bus.on('star:choice',()=>{energy=Math.max(energy,1);}); /* um caminho foi escolhido (4C) */
    Bus.on('core:up',()=>{energy=1.6;}); /* o Núcleo subiu de estado (M17) — vaga de rank */
    /* presença do Oráculo (S5) — não é energia: é gravidade. O mundo abranda
       e escuta durante ~6s; decai devagar */
    Bus.on('oracle:spoke',()=>{presence=1;});
  }
  return{
    resize(){},
    update(t,dt,ctx){
      /* M17·F2: o Núcleo cria um chão de energia — quanto mais forte, mais
         vivo o mundo está em repouso (0 a .25); Recovery amortece o chão */
      const floor=(ctx.world.core||0)*(ctx.world.recovery?.02:.05);
      energy=Math.max(energy*Math.exp(-dt*1.8),floor);
      if(energy<.001)energy=0;
      presence*=Math.exp(-dt*.5);
      if(presence<.001)presence=0;
      ctx.world.energy=energy;
      ctx.world.presence=presence;
    },
    fire(v){energy=v==null?1:v;}, /* Stage.debug.pulse() */
    get value(){return energy;},  /* Stage.debug.energy() — verificação */
    get presenceValue(){return presence;},
  };
}
