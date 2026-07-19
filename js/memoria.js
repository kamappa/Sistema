/* ===== LIVING MEMORY (Missão 15 · Fase 1) =====
   "Aqui o sistema começa a lembrar-se" (roadmap). Uma linha na saudação,
   derivada SÓ de evidência datada que já vive no estado — S.history (a
   primeira centelha), S.titleUnlocked (datas reais), objectives.doneDate,
   training.sessions. Nada é gravado, nada é inventado; sem memória digna
   do dia, silêncio (a mesma regra do sussurro). Determinístico por dia.
   Prioridade: aniversários anuais > marcos redondos do Sistema > ecos dos
   primeiros passos (100/180 dias) > "neste dia, há 30 dias". */

const MEM_MARCOS=[30,50,100,150,200,250,300,500,730,1000,1461,1826];

function memFirst(arr){let m=null;arr.forEach(d=>{if(d&&(!m||d<m))m=d;});return m;}
function memPastDate(n){const d=new Date();d.setDate(d.getDate()-n);return fmt(d);}
function memData(d){return d.slice(8,10)+'/'+d.slice(5,7)+'/'+d.slice(0,4);}
function memAnos(n){return n===365?'um ano':(n/365)+' anos';}

function memoriaDoDia(){
  try{
    if(typeof S==='undefined'||!S)return null;
    const t=today(),cands=[];
    const nasc=(S.history&&S.history.length)?S.history[0].d:null;
    const dones=(S.objectives||[]).filter(o=>o.status==='done'&&o.doneDate);
    const firstMissao=memFirst(dones.map(o=>o.doneDate));
    const firstTreino=memFirst(((S.training&&S.training.sessions)||[]).map(s=>s.d));
    const titulos=Object.entries(S.titleUnlocked||{});
    const firstTitulo=memFirst(titulos.map(e=>e[1]));
    /* 1 — aniversários anuais: títulos provados e o nascimento do Sistema */
    titulos.forEach(([id,d])=>{
      const n=diffDays(d,t);
      if(n>0&&n%365===0){
        const tt=(typeof TITLES_REAL!=='undefined')&&TITLES_REAL.find(x=>x.id===id);
        cands.push({p:1,txt:'Há '+memAnos(n)+' provaste: 👑 '+(tt?tt.name:id)+'.'});
      }
    });
    if(nasc){
      const n=diffDays(nasc,t);
      if(n>0&&n%365===0)cands.push({p:1,txt:'Há '+memAnos(n)+', o Sistema acendeu-se pela primeira vez.'});
      else if(MEM_MARCOS.indexOf(n)>-1)cands.push({p:2,txt:'O Sistema existe há '+n+' dias. A primeira centelha: '+memData(nasc)+'.'});
    }
    /* 3 — ecos dos primeiros passos */
    [[firstMissao,'concluíste a tua primeira missão'],
     [firstTitulo,'provaste o teu primeiro Título Real'],
     [firstTreino,'fizeste a tua primeira sessão de treino']].forEach(([d,what])=>{
      if(!d)return;
      const n=diffDays(d,t);
      if(n===100||n===180)cands.push({p:3,txt:'Há '+n+' dias '+what+'.'});
    });
    /* 4 — neste dia, há 30 dias (missões concluídas nesse dia exato) */
    const d30=memPastDate(30);
    const done30=dones.filter(o=>o.doneDate===d30);
    if(done30.length===1)cands.push({p:4,txt:'Neste dia, há 30 dias: «'+done30[0].title+'» ficou concluída.'});
    else if(done30.length>1)cands.push({p:4,txt:'Neste dia, há 30 dias, fechaste '+done30.length+' missões.'});
    if(!cands.length)return null;
    cands.sort((a,b)=>a.p-b.p);
    const top=cands.filter(c=>c.p===cands[0].p);
    return top[hashStr('mem'+t)%top.length].txt;
  }catch(e){return null;}
}

function renderMemoria(){
  const eq=document.getElementById('greet-q');if(!eq)return;
  const old=document.getElementById('memoria-line');
  const line=memoriaDoDia();
  if(!line){if(old)old.remove();return;}
  if(old){old.textContent='🕯 '+line;return;}
  const d=document.createElement('div');d.id='memoria-line';d.className='memoria';
  d.textContent='🕯 '+line;
  const su=document.getElementById('sussurro-line');
  (su||eq).insertAdjacentElement('afterend',d);
}
