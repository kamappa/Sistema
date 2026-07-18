import * as THREE from '../vendor/three.module.min.js';

/* céu procedural — triângulo fullscreen com gradiente vertical de 3 cores +
   nebulosidade fbm muito lenta + glow de horizonte + dithering anti-banding.
   Todo o movimento vive no fragment shader; o CPU só atualiza uniforms.
   Estado "casa" = noite violeta (na 1B o Solar Engine passa a comandar as
   cores ao longo do dia). Sem postprocessing: o "bloom leve" é blending
   aditivo das camadas + halo no próprio shader — bloom real rebentava o
   budget de 60fps em GPUs integradas. */
const VERT=`
varying vec2 vUv;
void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}
`;
const FRAG=`
varying vec2 vUv;
uniform float uTime;uniform vec2 uRes;uniform float uDetail;
uniform vec3 cTop;uniform vec3 cMid;uniform vec3 cBot;uniform vec3 cNeb;uniform vec3 cNeb2;uniform vec3 cHor;
uniform float uNebAmp;uniform float uNeb2Amp;uniform float uHorAmp;uniform float uPulse;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
  float h=vUv.y;
  vec3 col=mix(cBot,cMid,smoothstep(0.,.55,h));
  col=mix(col,cTop,smoothstep(.5,1.,h));
  /* nebulosa em camadas (2A) — a 1ª é larga e difusa; a 2ª, mais fina, faz
     domain warp sobre a 1ª (aspeto de gás) e concentra-se em manchas (pow) */
  vec2 p=vec2(vUv.x*uRes.x/max(uRes.y,1.),vUv.y)*2.6;
  float n=noise(p+vec2(uTime*.006,uTime*.004));
  if(uDetail>1.5)n=n*.68+.32*noise(p*2.3-vec2(uTime*.004,uTime*.007));
  col+=cNeb*n*uNebAmp*(1.+uPulse*.8)*(1.-h*.55);
  float n2=noise(p*1.7+vec2(n*.8,-n*.5)+vec2(-uTime*.003,uTime*.005));
  col+=cNeb2*n2*n2*uNeb2Amp*(1.+uPulse*.8)*(1.-h*.35);
  col+=cHor*pow(1.-h,3.)*uHorAmp;
  float vg=smoothstep(1.25,.35,length(vUv-vec2(.5,.42)));
  col*=mix(.9,1.,vg);
  col*=1.+uPulse*.04; /* pulso (2B) — o céu inteiro respira com o XP */
  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)/255.;
  gl_FragColor=vec4(col,1.);
}
`;
export function createSky(tier){
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));
  const mat=new THREE.ShaderMaterial({vertexShader:VERT,fragmentShader:FRAG,
    depthTest:false,depthWrite:false,
    uniforms:{
      uTime:{value:0},uRes:{value:new THREE.Vector2(1,1)},
      uDetail:{value:tier==='full'?2:1},
      cTop:{value:new THREE.Color('#050310')},cMid:{value:new THREE.Color('#0a0618')},
      cBot:{value:new THREE.Color('#150b28')},cNeb:{value:new THREE.Color('#8b5cf6')},
      cNeb2:{value:new THREE.Color('#f0abfc')},cHor:{value:new THREE.Color('#d946ef')},
      /* cNeb2/uNeb2Amp: em 2B passam a ser a tinta do arco sazonal ativo */
      uNebAmp:{value:.05},uNeb2Amp:{value:.035},uHorAmp:{value:.045},uPulse:{value:0}}});
  const mesh=new THREE.Mesh(geo,mat);
  mesh.frustumCulled=false;mesh.renderOrder=0;
  return{mesh,
    uniforms:mat.uniforms, /* o Solar Engine escreve as cores/amplitudes aqui */
    resize(W,H){mat.uniforms.uRes.value.set(W,H);},
    update(t,dt,ctx){
      mat.uniforms.uTime.value=t;
      mat.uniforms.uPulse.value=(ctx.world.energy||0)*.5;
    },
    degrade(){mat.uniforms.uDetail.value=1;}};
}
