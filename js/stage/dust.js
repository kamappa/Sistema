import * as THREE from '../vendor/three.module.min.js';

/* poeira próxima + bursts — Points aditivos. A deriva ambiente vive no vertex
   shader (o CPU só atualiza uniforms); os bursts (dustBurst/dustSpark) usam um
   pool pré-alocado de 128 partículas animadas na GPU a partir do instante de
   nascimento — zero alocações em runtime. Porta da camada 3 do fundo 2D. */
const A_VERT=`
attribute float aR;attribute float aVy;attribute float aVx;
attribute float aPhase;attribute float aTint;
uniform float uTime;uniform float uWarp;uniform vec2 uRes;uniform float uFall;uniform float uPix;uniform float uBreath;
varying float vA;varying float vTint;
void main(){
  /* uWarp = tempo elástico (2B): acelera com a energia do mundo, abranda em
     Recovery e à noite — o movimento usa-o; a cintilação fica no uTime */
  float wrap=uRes.y+8.;
  float vy=mix(-aVy,aVy*.7,uFall); /* sobe por defeito; à chuva desce devagar */
  float y=mod(position.y+vy*uWarp+4.,wrap)-4.;
  float x=mod(position.x+aVx*uWarp+sin(uWarp*.42+aPhase)*3.6*position.z+4.,uRes.x+8.)-4.;
  gl_Position=vec4(vec2(x/uRes.x*2.-1.,1.-y/uRes.y*2.)*uBreath,0.,1.);
  gl_PointSize=aR*uPix;
  vA=(.12+.12*sin(uTime*3.9+aPhase))*(.5+.5*position.z);
  vTint=aTint;
}`;
const A_FRAG=`
varying float vA;varying float vTint;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.08,d)*vA;
  vec3 col=mix(vec3(.655,.545,.98),vec3(.941,.671,.988),vTint);
  gl_FragColor=vec4(col*a,a);
}`;
const P_VERT=`
attribute vec2 aVel;attribute float aBirth;attribute float aLife;
attribute float aSize;attribute vec3 aColor;
uniform float uTime;uniform vec2 uRes;uniform float uPix;
varying float vA;varying vec3 vCol;
void main(){
  float age=uTime-aBirth;
  float alive=step(0.,age)*step(age,aLife);
  vec2 p=position.xy+aVel*age;
  p.y+=36.*age*age; /* gravidade ~72px/s² (herdada do 2D: vy+=.02/frame) */
  gl_Position=vec4(p.x/uRes.x*2.-1.,1.-p.y/uRes.y*2.,mix(2.,0.,alive),1.);
  gl_PointSize=aSize*uPix*alive;
  vA=min(.85,(aLife-age)*1.2)*alive;
  vCol=aColor;
}`;
const P_FRAG=`
varying float vA;varying vec3 vCol;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.08,d)*vA;
  gl_FragColor=vec4(vCol*a,a);
}`;
const POOL=128;

export function createDust(tier){
  const N=tier==='full'?70:35;
  const group=new THREE.Group();
  /* ambiente */
  const ag=new THREE.BufferGeometry();
  const apos=new Float32Array(N*3),ar=new Float32Array(N),avy=new Float32Array(N),
    avx=new Float32Array(N),aph=new Float32Array(N),ati=new Float32Array(N);
  ag.setAttribute('position',new THREE.BufferAttribute(apos,3));
  ag.setAttribute('aR',new THREE.BufferAttribute(ar,1));
  ag.setAttribute('aVy',new THREE.BufferAttribute(avy,1));
  ag.setAttribute('aVx',new THREE.BufferAttribute(avx,1));
  ag.setAttribute('aPhase',new THREE.BufferAttribute(aph,1));
  ag.setAttribute('aTint',new THREE.BufferAttribute(ati,1));
  const am=new THREE.ShaderMaterial({vertexShader:A_VERT,fragmentShader:A_FRAG,
    transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uWarp:{value:0},uRes:{value:new THREE.Vector2(1,1)},
      uFall:{value:0},uPix:{value:1},uBreath:{value:1}}});
  const apts=new THREE.Points(ag,am);apts.frustumCulled=false;apts.renderOrder=2;
  /* pool de bursts */
  const pg=new THREE.BufferGeometry();
  const ppos=new Float32Array(POOL*3),pvel=new Float32Array(POOL*2),
    pbirth=new Float32Array(POOL).fill(-1e3),plife=new Float32Array(POOL),
    psize=new Float32Array(POOL),pcol=new Float32Array(POOL*3);
  pg.setAttribute('position',new THREE.BufferAttribute(ppos,3));
  pg.setAttribute('aVel',new THREE.BufferAttribute(pvel,2));
  pg.setAttribute('aBirth',new THREE.BufferAttribute(pbirth,1));
  pg.setAttribute('aLife',new THREE.BufferAttribute(plife,1));
  pg.setAttribute('aSize',new THREE.BufferAttribute(psize,1));
  pg.setAttribute('aColor',new THREE.BufferAttribute(pcol,3));
  const pm=new THREE.ShaderMaterial({vertexShader:P_VERT,fragmentShader:P_FRAG,
    transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uRes:{value:new THREE.Vector2(1,1)},uPix:{value:1}}});
  const ppts=new THREE.Points(pg,pm);ppts.frustumCulled=false;ppts.renderOrder=3;
  group.add(apts,ppts);
  let cursor=0,W=1,H=1,now=0;
  function emit(x,y,vx,vy,size,life,c){
    const i=cursor;cursor=(cursor+1)%POOL;
    ppos[i*3]=x;ppos[i*3+1]=y;ppos[i*3+2]=0;
    pvel[i*2]=vx;pvel[i*2+1]=vy;
    pbirth[i]=now;plife[i]=life;psize[i]=size;
    pcol[i*3]=c[0]/255;pcol[i*3+1]=c[1]/255;pcol[i*3+2]=c[2]/255;
  }
  function dirty(){for(const k in pg.attributes)pg.attributes[k].needsUpdate=true;}
  return{mesh:group,
    resize(w,h,pix){
      W=w;H=h;
      am.uniforms.uRes.value.set(w,h);pm.uniforms.uRes.value.set(w,h);
      am.uniforms.uPix.value=pix;pm.uniforms.uPix.value=pix;
      for(let i=0;i<N;i++){
        const z=.3+Math.random()*.7;
        apos[i*3]=Math.random()*W;apos[i*3+1]=Math.random()*H;apos[i*3+2]=z;
        ar[i]=(1+Math.random()*3.4)*z;
        avy[i]=(3+Math.random()*13)*z;
        avx[i]=(Math.random()-.5)*4.8*z;
        aph[i]=Math.random()*6.283;
        ati[i]=Math.random()<.18?1:0;
      }
      for(const k in ag.attributes)ag.attributes[k].needsUpdate=true;
    },
    update(t,dt,ctx){
      now=t;
      /* tempo elástico: energia acelera (+150% no pico), Recovery acalma,
         o ritmo do dia (world.pace, Solar) comanda a base, e a presença do
         Oráculo (S5) abranda o mundo enquanto ele fala */
      am.uniforms.uWarp.value+=dt*(ctx.world.pace||1)
        *(1+(ctx.world.energy||0)*1.5)*(ctx.world.recovery?.8:1)
        *(1-(ctx.world.presence||0)*.3);
      am.uniforms.uTime.value=t;pm.uniforms.uTime.value=t;
      am.uniforms.uBreath.value=ctx.breath||1;
      am.uniforms.uFall.value+=((ctx.world.rain?1:0)-am.uniforms.uFall.value)*Math.min(1,dt);
    },
    degrade(){ag.setDrawRange(0,Math.ceil(N/2));},
    burst(x,y,c){
      for(let i=0;i<26;i++){
        const an=Math.random()*6.283,sp=48+Math.random()*144;
        emit(x,y,Math.cos(an)*sp,Math.sin(an)*sp-36,2+Math.random()*3.6,1.15+Math.random()*.5,c);
      }dirty();
    },
    spark(x,y,c,n){
      for(let i=0;i<n;i++){
        const an=-Math.PI/2+(Math.random()-.5)*1.6,sp=30+Math.random()*72;
        emit(x+(Math.random()-.5)*4,y+(Math.random()-.5)*4,
          Math.cos(an)*sp,Math.sin(an)*sp,1.6+Math.random()*2.4,.57+Math.random()*.27,c);
      }dirty();
    }};
}
