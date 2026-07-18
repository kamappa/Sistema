/* o mundo reage (Missão 12 · 2B) — a "energia" do palco. Ganhar XP dá um
   pulso que decai em ~2 s (a nebulosa respira mais forte, a poeira acelera
   ligeiramente); rank up dá uma vaga maior. Com Recovery ativo o mundo está
   deliberadamente mais calmo — os pulsos chegam amortecidos. A energia vive
   em world.energy e as outras camadas (céu, poeira) leem-na do ctx. */
export function createReact(world){
  let energy=0;
  if(window.Bus){
    Bus.on('xp:gain',d=>{if(d&&d.amt>0)energy=Math.min(1.4,energy+(world.recovery?.25:.8));});
    Bus.on('rank:up',()=>{energy=1.6;});
  }
  return{
    resize(){},
    update(t,dt,ctx){
      energy*=Math.exp(-dt*1.8);
      if(energy<.001)energy=0;
      ctx.world.energy=energy;
    },
    fire(v){energy=v==null?1:v;}, /* Stage.debug.pulse() */
    get value(){return energy;},  /* Stage.debug.energy() — verificação */
  };
}
