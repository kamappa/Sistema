import * as THREE from '../vendor/three.module.min.js';

/* estrela cadente (2A — de volta, agora no palco WebGL). Rara: 60–120 s entre
   aparições, atravessa em ~1–1.4 s com envelope sin(π·k). Um único objeto
   (linha com gradiente + cabeça em Points), invisível entre voos — custo zero
   quando não há meteoro. Usa o relógio do engine, que pausa com o separador
   oculto: nunca "gasta" meteoros em background. Porta da versão 2D da M3. */
const L_VERT=`
attribute float aT;
uniform vec2 uRes;
varying float vT;
void main(){
  vT=aT;
  gl_Position=vec4(position.x/uRes.x*2.-1.,1.-position.y/uRes.y*2.,0.,1.);
}`;
const L_FRAG=`
uniform float uEnv;
varying float vT;
void main(){
  float a=(1.-vT)*.75*uEnv;
  vec3 col=mix(vec3(.886,.863,1.),vec3(.655,.545,.98),vT);
  gl_FragColor=vec4(col*a,a);
}`;
const H_VERT=`
uniform vec2 uRes;uniform float uPix;
void main(){
  gl_Position=vec4(position.x/uRes.x*2.-1.,1.-position.y/uRes.y*2.,0.,1.);
  gl_PointSize=3.2*uPix;
}`;
const H_FRAG=`
uniform float uEnv;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.1,d)*.9*uEnv;
  gl_FragColor=vec4(vec3(.94,.93,1.)*a,a);
}`;

export function createMeteor(tier){
  const mob=tier!=='full';
  const group=new THREE.Group();
  const uRes=new THREE.Vector2(1,1),uEnv={value:0};
  const lg=new THREE.BufferGeometry();
  const lpos=new Float32Array(6);
  lg.setAttribute('position',new THREE.BufferAttribute(lpos,3));
  lg.setAttribute('aT',new THREE.BufferAttribute(new Float32Array([0,1]),1));
  const lm=new THREE.ShaderMaterial({vertexShader:L_VERT,fragmentShader:L_FRAG,
    transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uRes:{value:uRes},uEnv:uEnv}});
  const line=new THREE.Line(lg,lm);line.frustumCulled=false;line.renderOrder=1.5;
  const hg=new THREE.BufferGeometry();
  const hpos=new Float32Array(3);
  hg.setAttribute('position',new THREE.BufferAttribute(hpos,3));
  const hm=new THREE.ShaderMaterial({vertexShader:H_VERT,fragmentShader:H_FRAG,
    transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending,
    uniforms:{uRes:{value:uRes},uEnv:uEnv,uPix:{value:1}}});
  const head=new THREE.Points(hg,hm);head.frustumCulled=false;head.renderOrder=1.5;
  group.add(line,head);group.visible=false;
  let W=1,H=1,m=null,next=null;
  return{mesh:group,
    resize(w,h,pix){W=w;H=h;uRes.set(w,h);hm.uniforms.uPix.value=pix;},
    fire(){next=-1;}, /* Stage.debug — força o próximo frame a ter meteoro */
    update(t,dt){
      if(next===null)next=t+60+Math.random()*60;
      if(!m&&t>next){
        const ltr=Math.random()<.5,sp=(360+Math.random()*240)*(mob?.7:1);
        m={x:ltr?-40:W+40,y:20+Math.random()*H*.35,
          vx:ltr?sp:-sp,vy:sp*(.25+Math.random()*.2),
          age:0,dur:1+Math.random()*.4};
        group.visible=true;
      }
      if(!m)return;
      m.x+=m.vx*dt;m.y+=m.vy*dt;m.age+=dt;
      const k=m.age/m.dur,env=Math.sin(Math.PI*Math.min(1,k));
      const tl=(mob?60:100)/Math.hypot(m.vx,m.vy);
      lpos[0]=m.x;lpos[1]=m.y;
      lpos[3]=m.x-m.vx*tl;lpos[4]=m.y-m.vy*tl;
      hpos[0]=m.x;hpos[1]=m.y;
      lg.attributes.position.needsUpdate=true;
      hg.attributes.position.needsUpdate=true;
      uEnv.value=env;
      if(k>=1||m.x<-120||m.x>W+120||m.y>H+40){
        m=null;group.visible=false;next=t+60+Math.random()*60;
      }
    }};
}
