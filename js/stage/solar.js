/* Solar Engine — a luz do mundo (Missão 12 · Sprint 1 · 1B).
   Uma curva contínua de keyframes horários (06h azul fria → 09h lateral →
   13h neutra → 18h30 golden hour → 20h sunset → 22h moonlight → 02h deep
   night) alimenta duas saídas da MESMA amostra:
   (1) uniforms do céu WebGL + brilho das estrelas (por frame, com lerp);
   (2) variáveis CSS --amb1/2/3 e --horizon que iluminam a UI inteira
       (aurora, painéis) — único escritor destas variáveis; absorve o antigo
       motor de ambiente do fx.js, cuja tabela de alfas foi portada.
   O meteo real modula no fim (chuva dessatura e acalma; céu limpo aviva).
   A parte CSS corre mesmo com o palco off — mudar de cor ao longo de minutos
   não é movimento; reduced-motion não a apaga (comportamento herdado).
   Sem JS/meteo os defaults CSS continuam a ser a noite. */

const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
/* [hora, céu topo/meio/base, nebulosa+amp, glow horizonte céu+amp, brilho
   estrelas, amb1, amb2, horizonte CSS, pace] — âncoras 2h e 26h fecham o
   ciclo. pace (2C) = ritmo do mundo: de manhã acorda, à noite desacelera. */
const K=[
  [2  ,hx('#04030b'),hx('#090616'),hx('#110a22'),hx('#8b5cf6'),.045,hx('#d946ef'),.03,1  ,[76,29,149,.10]  ,[30,58,138,.10]  ,[249,115,22,0]  ,.7 ],
  [6  ,hx('#060a18'),hx('#0b1228'),hx('#182342'),hx('#3b82f6'),.05 ,hx('#fb923c'),.06,.9 ,[67,56,202,.12]  ,[30,64,175,.10]  ,[251,146,60,.03],.9 ],
  [9  ,hx('#070713'),hx('#0e0c20'),hx('#221a3a'),hx('#a78bfa'),.06 ,hx('#fbbf24'),.07,.55,[139,92,246,.15] ,[251,191,36,.09] ,[251,146,60,.08],1.1],
  [13 ,hx('#08060f'),hx('#100b1e'),hx('#1d1432'),hx('#936bff'),.07 ,hx('#fbbf24'),.02,.55,[147,107,255,.22],[240,171,252,.13],[251,146,60,0]  ,1  ],
  [16.5,hx('#080611'),hx('#120c20'),hx('#221334'),hx('#a78bfa'),.06 ,hx('#fb923c'),.04,.55,[139,92,246,.18] ,[244,114,182,.10],[251,146,60,.03],1  ],
  [18.5,hx('#0a0612'),hx('#150c20'),hx('#2c1630'),hx('#f59e0b'),.05 ,hx('#fb923c'),.12,.62,[150,95,235,.17] ,[249,164,63,.12] ,[251,146,60,.10],.95],
  [20 ,hx('#070512'),hx('#120a1e'),hx('#2a102e'),hx('#f472b6'),.055,hx('#f97316'),.14,.78,[168,85,247,.16] ,[244,114,182,.12],[249,115,22,.13],.85],
  [22 ,hx('#050410'),hx('#0a0718'),hx('#150d26'),hx('#a78bfa'),.05 ,hx('#d946ef'),.05,1  ,[139,92,246,.16] ,[240,171,252,.10],[217,70,239,.05],.75],
  [26 ,hx('#04030b'),hx('#090616'),hx('#110a22'),hx('#8b5cf6'),.045,hx('#d946ef'),.03,1  ,[76,29,149,.10]  ,[30,58,138,.10]  ,[249,115,22,0]  ,.7 ],
];
const mixN=(a,b,k)=>a+(b-a)*k;
const mixV=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
const RAIN_GRAY=[46,52,66];

export function sampleSolar(hour,wx){
  let h=hour;if(h<2)h+=24;
  let i=0;while(i<K.length-2&&K[i+1][0]<=h)i++;
  const k=Math.min(1,Math.max(0,(h-K[i][0])/(K[i+1][0]-K[i][0]))),A=K[i],B=K[i+1];
  let top=mixV(A[1],B[1],k),mid=mixV(A[2],B[2],k),bot=mixV(A[3],B[3],k),
    neb=mixV(A[4],B[4],k),nebAmp=mixN(A[5],B[5],k),
    horGl=mixV(A[6],B[6],k),horAmp=mixN(A[7],B[7],k),glow=mixN(A[8],B[8],k),
    pace=mixN(A[12],B[12],k);
  let a1=mixV(A[9],B[9],k),a2=mixV(A[10],B[10],k),hc=mixV(A[11],B[11],k);
  const rain=wx&&wx.rain,clear=wx&&wx.clear;
  if(rain){ /* dessatura e acalma — porta do tune() antigo */
    const wet=c=>c.map((v,i)=>v*.7+RAIN_GRAY[i]*.3);
    top=wet(top);mid=wet(mid);bot=wet(bot);
    nebAmp*=.6;horAmp*=.5;glow*=.85;
    const wetA=c=>[c[0]*.7+34,c[1]*.7+40,c[2]*.7+52,c[3]*.65];
    a1=wetA(a1);a2=wetA(a2);hc=[hc[0],hc[1],hc[2],hc[3]*.4];
  }else if(clear){a1=[a1[0],a1[1],a1[2],a1[3]*1.15];a2=[a2[0],a2[1],a2[2],a2[3]*1.15];}
  const css=c=>'rgba('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+','+c[3].toFixed(3)+')';
  return{top,mid,bot,neb,nebAmp,horGl,horAmp,glow,pace,
    css:{amb1:css(a1),amb2:css(a2),amb3:css([a1[0],a1[1],a1[2],a1[3]*.45]),horizon:css(hc)}};
}

/* meteo de hoje a partir do estado real (S.weather) — mesma regra do antigo
   motor de ambiente; S pode não existir antes do auth */
export function weatherNow(){
  try{
    const w=(typeof S!=='undefined')&&S&&S.weather;
    if(w&&w.d===new Date().toISOString().slice(0,10))return{rain:w.rain>=8,clear:w.rain===0};
  }catch(e){}
  return{rain:false,clear:false};
}

/* lado CSS — ao minuto + imediato via window.ambientApply (fetchWeather chama-o) */
export function createSolarCss(world,updateWorld){
  const st=document.documentElement.style;
  function apply(){
    window.ambientRain=weatherNow().rain;
    updateWorld();
    const s=sampleSolar(world.hour,weatherNow());
    st.setProperty('--amb1',s.css.amb1);st.setProperty('--amb2',s.css.amb2);
    st.setProperty('--amb3',s.css.amb3);st.setProperty('--horizon',s.css.horizon);
  }
  window.ambientApply=apply;
  apply();setInterval(apply,60000);
  return{apply};
}

/* lado WebGL — camada do engine; converge para a amostra ao longo de segundos
   (a fonte já se move ao longo de minutos — transições impercetíveis).
   2B: o arco sazonal ativo tinge a 2ª nebulosa; Recovery acalma o mundo. */
const ARC_TINT={summer:[251,146,60],harvest:[245,158,11],winter:[96,165,250],bloom:[244,114,182]};
const NEB2_BASE=[240,171,252];
export function createSolarLayer(sky,world){
  const lerpC=(c,v,k)=>{c.r+=(v[0]/255-c.r)*k;c.g+=(v[1]/255-c.g)*k;c.b+=(v[2]/255-c.b)*k;};
  return{
    resize(){},
    update(t,dt,ctx){
      const s=sampleSolar(world.hour,{rain:world.rain,clear:false});
      const k=Math.min(1,dt*.5);
      const u=sky.uniforms;
      const calm=(world.recovery?.75:1)*(1+(world.presence||0)*.25); /* o Oráculo presente: a nebulosa encorpa */
      lerpC(u.cTop.value,s.top,k);lerpC(u.cMid.value,s.mid,k);lerpC(u.cBot.value,s.bot,k);
      lerpC(u.cNeb.value,s.neb,k);lerpC(u.cHor.value,s.horGl,k);
      u.uNebAmp.value+=(s.nebAmp*calm-u.uNebAmp.value)*k;
      u.uHorAmp.value+=(s.horAmp-u.uHorAmp.value)*k;
      const tint=world.arc&&ARC_TINT[world.arc];
      lerpC(u.cNeb2.value,tint||NEB2_BASE,k);
      u.uNeb2Amp.value+=((tint?.055:.035)*calm-u.uNeb2Amp.value)*k;
      world.glow+=(s.glow*(world.recovery?.9:1)-world.glow)*k;
      world.pace+=(s.pace-world.pace)*k;
    }};
}
