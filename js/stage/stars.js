import * as THREE from '../vendor/three.module.min.js';

/* estrelas distantes — THREE.Points; cintilação e deriva no vertex shader,
   parallax de scroll por profundidade (position.z), brilho global comandado
   pela hora (world.glow). Porta fiel da camada 1 do antigo fundo 2D. */
const VERT=`
attribute float aSize;attribute float aFreq;attribute float aPhase;
attribute float aDrift;attribute float aAmp;attribute float aTint;
uniform float uTime;uniform vec2 uRes;uniform float uScroll;
uniform float uGlow;uniform float uPix;
varying float vA;varying float vTint;
void main(){
  vec2 p=position.xy;
  p.x=mod(p.x+uTime*aDrift,uRes.x+8.)-4.;
  float wrap=uRes.y+8.;
  p.y=mod(p.y-uScroll*(1.-position.z)*.06+4.,wrap)-4.;
  gl_Position=vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,0.,1.);
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
  const N=tier==='full'?120:50;
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
      uGlow:{value:1},uPix:{value:1}}});
  const pts=new THREE.Points(geo,mat);
  pts.frustumCulled=false;pts.renderOrder=1;
  return{mesh:pts,
    resize(W,H,pix){
      mat.uniforms.uRes.value.set(W,H);mat.uniforms.uPix.value=pix;
      for(let i=0;i<N;i++){
        const z=.15+Math.random()*.85,big=Math.random()<.08;
        pos[i*3]=Math.random()*W;pos[i*3+1]=Math.random()*(H+8);pos[i*3+2]=z;
        size[i]=(.8+z*2.1)*(big?1.5:1);
        drift[i]=.18+z*.72;
        amp[i]=(.08+Math.random()*.28)*(big?1.5:1);
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
    },
    degrade(){geo.setDrawRange(0,Math.ceil(N/2));}};
}
