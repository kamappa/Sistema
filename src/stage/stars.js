import * as THREE from '../vendor/three.module.min.js';

/* estrelas distantes — THREE.Points; cintilação e deriva no vertex shader,
   parallax de scroll por profundidade (position.z), brilho global comandado
   pela hora (world.glow). Porta fiel da camada 1 do antigo fundo 2D. */
const VERT=`
attribute float aSize;attribute float aFreq;attribute float aPhase;
attribute float aDrift;attribute float aAmp;attribute float aTint;
uniform float uTime;uniform vec2 uRes;uniform float uScroll;
uniform float uGlow;uniform float uPix;uniform float uBreath;uniform vec2 uDrift;
varying float vA;varying float vTint;
void main(){
  vec2 p=position.xy;
  p.x=mod(p.x+uTime*aDrift,uRes.x+28.)-14.;
  float wrap=uRes.y+28.;
  p.y=mod(p.y-uScroll*(1.-position.z)*.06+14.,wrap)-14.;
  /* drift de câmara com parallax (Camada II) — o fundo desloca-se menos */
  p+=uDrift*(.25+position.z*.75);
  /* micro-órbita própria (Camada II) — cada estrela anda em círculo lento
     (períodos de 40-70s derivados da frequência de cintilação) */
  float oa=uTime*(.05+aFreq*.045)+aPhase*2.3;
  p+=vec2(cos(oa),sin(oa))*(.8+position.z*1.4);
  /* respiração: zoom quase impercetível sobre o centro (clip space) */
  gl_Position=vec4(vec2(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.)*uBreath,0.,1.);
  gl_PointSize=aSize*uPix;
  vA=aAmp*(.62+.38*sin(uTime*aFreq+aPhase))*uGlow;
  vTint=aTint;
}`;
const FRAG=`
varying float vA;varying float vTint;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.12,d)*vA;
  vec3 col=mix(vec3(.925,.914,.98),vec3(.784,.745,1.),vTint);
  gl_FragColor=vec4(col*a,a);
}`;
export function createStars(tier){
  /* Missão 26: 120 → 420 no tier alto. O campo antigo lia-se como pó disperso;
     um céu real tem centenas de pontos com brilhos muito diferentes, e é a
     densidade que faz a diferença entre "fundo escuro" e "espaço". O tier
     `lite` (mobile, GPU fraca) fica onde estava — é lá que custa. */
  const N=tier==='full'?420:50;
  const geo=new THREE.BufferGeometry();
  const pos=new Float32Array(N*3),size=new Float32Array(N),freq=new Float32Array(N),
    phase=new Float32Array(N),drift=new Float32Array(N),amp=new Float32Array(N),
    tint=new Float32Array(N);
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  geo.setAttribute('aSize',new THREE.BufferAttribute(size,1));
  geo.setAttribute('aFreq',new THREE.BufferAttribute(freq,1));
  geo.setAttribute('aPhase',new THREE.BufferAttribute(phase,1));
  geo.setAttribute('aDrift',new THREE.BufferAttribute(drift,1));
  geo.setAttribute('aAmp',new THREE.BufferAttribute(amp,1));
  geo.setAttribute('aTint',new THREE.BufferAttribute(tint,1));
  const mat=new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:FRAG,
    transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uRes:{value:new THREE.Vector2(1,1)},uScroll:{value:0},
      uGlow:{value:1},uPix:{value:1},uBreath:{value:1},uDrift:{value:new THREE.Vector2(0,0)}}});
  const pts=new THREE.Points(geo,mat);
  pts.frustumCulled=false;pts.renderOrder=1;
  return{mesh:pts,
    resize(W,H,pix){
      mat.uniforms.uRes.value.set(W,H);mat.uniforms.uPix.value=pix;
      for(let i=0;i<N;i++){
        /* Hierarquia de brilho (M26): num céu real a esmagadora maioria das
           estrelas é ténue e um punhado domina. `big` sobe de 8% para 11% e
           ganha mais corpo; as restantes descem, para a densidade nova não
           virar uma parede de pontos iguais. */
        const z=.15+Math.random()*.85,big=Math.random()<.11;
        pos[i*3]=Math.random()*W;pos[i*3+1]=Math.random()*(H+8);pos[i*3+2]=z;
        size[i]=(.55+z*1.6)*(big?2.4:1);
        drift[i]=.18+z*.72;
        /* Magnitude (M26). Era .10–.40 para todas, o que dava um pó cinzento
           uniforme: nenhuma estrela dominava e nenhuma desaparecia. Passa a
           duas populações, como num céu real — um punhado de pontos francos e
           uma maioria no limiar da perceção. É o contraste entre elas que faz
           o olho ler "estrelas" em vez de "ruído". */
        amp[i]=big?(.55+Math.random()*.45):(.06+Math.random()*.22);
        freq[i]=6.283/(2.6+Math.random()*5.4);
        phase[i]=Math.random()*6.283;
        tint[i]=Math.random()<.12?1:0;
      }
      for(const k in geo.attributes)geo.attributes[k].needsUpdate=true;
    },
    update(t,dt,ctx){
      mat.uniforms.uTime.value=t;
      mat.uniforms.uScroll.value=ctx.scroll;
      mat.uniforms.uGlow.value=ctx.world.glow;
      mat.uniforms.uBreath.value=ctx.breath||1;
      mat.uniforms.uDrift.value.set(ctx.driftX||0,ctx.driftY||0);
    },
    degrade(){geo.setDrawRange(0,Math.ceil(N/2));}};
}
