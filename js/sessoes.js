/* ===== SESSÕES DE ESTUDO — o cronómetro (Missão 34 · Fase A, Lote 1) =====
   O tempo mede-se no servidor: começar é um insert com started_at = now() da base,
   e pausar, retomar e terminar são funções SQL
   (supabase/migrations/20260923120000_courses-e-sessoes-de-estudo.sql). Este
   ficheiro só mostra e pede. As contas de tempo vivem em js/sessoes-logica.js.
   - Sem conta não há sessões: a hora do aparelho não serve de prova.
   - Se a migração ainda não estiver aplicada, o painel não aparece.
   - Uma sessão esquecida fecha-se no servidor (normalizar_sessoes), chamada ao
     arrancar, de minuto a minuto e ao voltar à app — sem cron novo.
   - Sem culpa: não estudar não gera avisos. O único aviso é o das 2 h. */
window.Sessoes=(function(){
  const L=SessoesLogica;
  const DIAS_RECENTES=7;
  const K_ESCOLHA='sistema_sessao_escolha',K_AVISO='sistema_sessao_aviso2h';
  // Função ou tabela que não existe: a migração ainda não foi aplicada.
  const INEXISTENTE=['PGRST202','PGRST205','42883','42P01'];

  let modo='fora';            // 'fora' (painel escondido) | 'sem-conta' | 'pronto'
  let carregado=false,semLigacao=false,ocupado=false,aFechar=false;
  let ativa=null,porConfirmar=[],recentes=[],cadeiras=[];
  let aEditar=null,aConfirmar=null;
  let tick=null,ciclo=null,chaves={};

  const cliente=()=>(typeof sb!=='undefined'&&sb)?sb:null;
  const utilizador=()=>(typeof USER!=='undefined'&&USER)?USER:null;
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  const lerLocal=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
  const gravarLocal=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  const avisar=(t,s,c)=>{if(typeof toast==='function')toast(t,s,c||'#a78bfa');};
  const hojeLisboa=()=>L.instanteParaLisboaInput(new Date()).slice(0,10);
  const nomeCadeira=id=>{const c=cadeiras.find(x=>x.id===id);return c?(c.short_name||c.name):'';};
  // Cada algarismo numa caixa de largura fixa: o relógio não treme quando os números
  // mudam, seja qual for a fonte. O leitor de ecrã lê a hora inteira (aria-label).
  const relogioHtml=seg=>L.formatarRelogio(seg).split('').map(c=>`<span class="${c===':'?'ss-rc':'ss-rd'}">${c}</span>`).join('');
  function pintarRelogio(el,seg){el.innerHTML=relogioHtml(seg);el.setAttribute('aria-label',L.formatarRelogio(seg));}

  /* ---------- ciclo de vida ---------- */
  async function arrancar(){
    parar();
    if(!$('sessoes'))return;
    ativa=null;porConfirmar=[];recentes=[];cadeiras=[];carregado=false;semLigacao=false;aEditar=aConfirmar=null;
    if(!cliente()||!utilizador()){modo='sem-conta';desenhar();return;}
    modo='pronto';
    if(await atualizar()===null)return;   // migração por aplicar: o painel fica escondido
    tick=setInterval(aCadaSegundo,1000);
    ciclo=setInterval(()=>{if(document.visibilityState!=='hidden')atualizar();},60000);
  }
  function parar(){clearInterval(tick);clearInterval(ciclo);tick=ciclo=null;}
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&tick)atualizar();});
  addEventListener('online',()=>{if(tick)atualizar();});

  /* Fecha as esquecidas e relê. true = lido; false = sem ligação; null = por instalar. */
  async function atualizar(){
    const c=cliente();if(!c||!utilizador())return false;
    let n;
    try{n=await c.rpc('normalizar_sessoes');}catch(e){n={error:e};}
    if(n.error){
      if(INEXISTENTE.includes(n.error.code)){modo='fora';parar();desenhar();return null;}
      semLigacao=true;desenhar();return false;
    }
    const desde=new Date(Date.now()-DIAS_RECENTES*864e5).toISOString();
    let r;
    try{
      r=await Promise.all([
        c.from('study_sessions').select('*').in('state',['ativa','por_confirmar']).order('started_at',{ascending:false}),
        c.from('study_sessions').select('*').eq('state','terminada').gte('started_at',desde).order('started_at',{ascending:false}).limit(60),
        c.from('courses').select('id,name,short_name,active').order('name'),
      ]);
    }catch(e){r=[{error:e}];}
    if(r.some(x=>x.error)){semLigacao=true;desenhar();return false;}
    ativa=r[0].data.find(s=>s.state==='ativa')||null;
    porConfirmar=r[0].data.filter(s=>s.state==='por_confirmar');
    recentes=r[1].data;cadeiras=r[2].data;
    carregado=true;semLigacao=false;aFechar=false;desenhar();return true;
  }

  function aCadaSegundo(){
    if(!ativa)return;
    const agora=new Date();
    const rel=$('ss-relogio');if(rel)pintarRelogio(rel,L.segundosEfetivos(ativa,agora));
    // Passou o limite com a app aberta: o servidor fecha-a já, não daqui a um minuto.
    if(!aFechar&&agora>=L.limiteSessao(ativa.started_at)){aFechar=true;atualizar();return;}
    desenharTopo();   // só redesenha se o aviso das 2 h mudou (ver zona())
  }

  /* ---------- desenho ---------- */
  function desenhar(){
    const el=$('sessoes');if(!el)return;
    el.hidden=(modo==='fora');
    const viva=modo==='pronto'&&!!ativa;
    el.classList.toggle('ss-viva',viva&&!ativa.paused_at);
    el.classList.toggle('ss-pausa',viva&&!!ativa.paused_at);
    el.classList.toggle('ss-ocupado',ocupado);
    if(modo==='fora'){el.innerHTML='';chaves={};return;}
    if(!el.querySelector('.ss-esqueleto')){
      el.innerHTML=`<div class="ss-esqueleto"><div class="ptitle"><b>Sessões de Estudo</b> · <span id="ss-sub"></span></div>
        <div id="ss-rede" class="ss-nota" role="status"></div>
        <div id="ss-topo"></div><div id="ss-pendentes"></div><div id="ss-recentes"></div><div id="ss-manual"></div></div>`;
      chaves={};
    }
    $('ss-sub').textContent=viva?(ativa.paused_at?'em pausa':'a decorrer'):'tempo medido';
    $('ss-rede').textContent=(modo==='pronto'&&semLigacao&&carregado)
      ?'Sem ligação à base — o que vês pode estar atrasado. Uma sessão a decorrer continua a contar no servidor.':'';
    desenharTopo();desenharPendentes();desenharRecentes();desenharManual();
  }
  // Uma zona só se redesenha quando o que mostra mudou: o ciclo de 60 s não pode
  // apagar o que estiver a ser escolhido ou escrito.
  function zona(id,chave,html){
    if(chaves[id]===chave)return;
    const z=$(id);if(!z)return;
    chaves[id]=chave;z.innerHTML=html();
  }

  const opcoesCadeira=sel=>`<option value="">Sem cadeira</option>`+cadeiras.filter(c=>c.active||c.id===sel)
    .map(c=>`<option value="${esc(c.id)}"${c.id===sel?' selected':''}>${esc(c.name)}</option>`).join('');
  const opcoesTipo=(sel,vazio)=>(vazio?`<option value="" disabled${sel?'':' selected'}>Tipo de sessão</option>`:'')+
    L.TIPOS.map(t=>`<option value="${t}"${t===sel?' selected':''}>${L.ROTULO_TIPO[t]}</option>`).join('');
  const intervalo=s=>`${L.horaLisboa(new Date(s.started_at))}–${s.ended_at?L.horaLisboa(new Date(s.ended_at)):'…'}`;
  const descricao=s=>[nomeCadeira(s.course_id),L.ROTULO_TIPO[s.kind]].filter(Boolean).map(esc).join(' · ');

  function desenharTopo(){
    const aviso=modo==='pronto'&&!!ativa&&!ativa.paused_at&&L.precisaAviso2h(ativa,new Date())&&lerLocal(K_AVISO)!==ativa.id;
    const chave=JSON.stringify([modo,carregado,ativa&&ativa.id,ativa&&ativa.paused_at,ativa&&ativa.course_id,aviso,
      !ativa&&cadeiras.map(c=>[c.id,c.name,c.active])]);
    zona('ss-topo',chave,()=>{
      if(modo==='sem-conta')return `<div class="ss-nota">As sessões guardam-se na tua conta, com a hora do servidor — a do aparelho não serve de prova.${cliente()?' <button class="mini" onclick="showAuth()">Entrar</button>':''}</div>`;
      if(!carregado)return `<div class="ss-nota">Sem ligação à base. As sessões aparecem quando a ligação voltar.</div>`;
      if(!ativa){
        const e=lerLocal(K_ESCOLHA)||{};
        const cad=cadeiras.some(c=>c.active&&c.id===e.cadeira)?e.cadeira:'';
        return `<div class="ss-arranque">
          <select id="ss-cadeira" aria-label="Cadeira">${opcoesCadeira(cad)}</select>
          <select id="ss-tipo" aria-label="Tipo de sessão">${opcoesTipo(L.TIPOS.includes(e.tipo)?e.tipo:'',true)}</select>
          <button class="btn ss-iniciar" onclick="Sessoes.iniciar()">Iniciar sessão</button>
        </div><div class="ss-erro" id="ss-erro-inicio" role="alert"></div>`;
      }
      const lim=L.limiteSessao(ativa.started_at),seg=L.segundosEfetivos(ativa,new Date());
      const quem=descricao(ativa);
      const desde=ativa.paused_at?`em pausa desde as ${L.horaLisboa(new Date(ativa.paused_at))}`:`desde as ${L.horaLisboa(new Date(ativa.started_at))}`;
      return `<div class="ss-ativa">
        <div class="ss-relogio" id="ss-relogio" role="timer" aria-live="off" aria-label="${L.formatarRelogio(seg)}">${relogioHtml(seg)}</div>
        <div class="ss-meta">${quem?quem+' · ':''}${desde} · <span title="4 h depois de começar ou à meia-noite, o que vier primeiro">fecho automático às ${L.horaLisboa(lim)}</span></div>
        <div class="ss-acoes">
          ${ativa.paused_at?`<button class="btn" onclick="Sessoes.retomar()">Retomar</button>`:`<button class="btn ghost2" onclick="Sessoes.pausar()">Pausar</button>`}
          <button class="btn" onclick="Sessoes.terminar()">Terminar</button>
        </div>
        ${aviso?`<div class="ss-aviso" role="status"><span>Duas horas de estudo. Ainda estás a estudar?</span>
          <button class="mini" onclick="Sessoes.continuo()">Continuo</button><button class="mini warm" onclick="Sessoes.terminar()">Terminar</button></div>`:''}
      </div>`;
    });
  }

  function desenharPendentes(){
    const chave=JSON.stringify([modo,carregado,hojeLisboa(),porConfirmar,aEditar,aConfirmar,cadeiras]);
    zona('ss-pendentes',chave,()=>{
      if(modo!=='pronto'||!porConfirmar.length)return '';
      const agora=new Date();
      return `<div class="sec-lbl">Por confirmar</div>`+porConfirmar.map(s=>{
        if(aEditar===s.id)return formEdicao(s,'Guardar e aceitar');
        const motivo=L.ROTULO_MOTIVO[s.closed_reason];
        return `<div class="ss-linha ss-pend" data-id="${esc(s.id)}">
          <div class="ss-l1"><span class="ss-dia">${L.rotuloDia(new Date(s.started_at),agora)}</span><span class="ss-int">${intervalo(s)}</span>
            <span class="ss-desc">${descricao(s)}</span><span class="ss-dur">${L.formatarDuracao(s.duration_min)}</span></div>
          <div class="ss-l2">${motivo?`O Sistema fechou-a ${motivo}. `:''}Estudaste até lá?</div>
          ${aConfirmar===s.id
            ?`<div class="ss-conf">Descartar esta sessão? Deixa de contar. <button class="mini warm" onclick="Sessoes.descartar('${esc(s.id)}',true)">Descartar</button><button class="mini" onclick="Sessoes.cancelar()">Manter</button></div>`
            :`<div class="ss-acoes"><button class="mini" onclick="Sessoes.aceitar('${esc(s.id)}')">Aceitar</button><button class="mini" onclick="Sessoes.editar('${esc(s.id)}')">Corrigir</button><button class="mini warm" onclick="Sessoes.descartar('${esc(s.id)}')">Descartar</button></div>`}
        </div>`;
      }).join('');
    });
  }

  function desenharRecentes(){
    const chave=JSON.stringify([modo,carregado,hojeLisboa(),recentes,aEditar,aConfirmar,cadeiras]);
    zona('ss-recentes',chave,()=>{
      if(modo!=='pronto'||!carregado)return '';
      const titulo=`<div class="sec-lbl">Últimos ${DIAS_RECENTES} dias</div>`;
      if(!recentes.length)return titulo+`<div class="ss-vazio">Sem sessões terminadas nos últimos ${DIAS_RECENTES} dias.</div>`;
      const agora=new Date();
      return titulo+recentes.map(s=>{
        if(aEditar===s.id)return formEdicao(s,'Guardar');
        const tag=s.source==='manual'?'<span class="ss-tag" title="Declarada à mão, não cronometrada">manual</span>'
          :s.source==='recall_automatico'?'<span class="ss-tag">recall</span>':'';
        return `<div class="ss-linha" data-id="${esc(s.id)}">
          <div class="ss-l1"><span class="ss-dia">${L.rotuloDia(new Date(s.started_at),agora)}</span><span class="ss-int">${intervalo(s)}</span>
            <span class="ss-desc">${descricao(s)}${tag}</span><span class="ss-dur">${L.formatarDuracao(s.duration_min)}</span>
            <span class="ss-ops"><button class="ss-op" onclick="Sessoes.editar('${esc(s.id)}')" title="Editar" aria-label="Editar sessão">✎</button><button class="ss-op ss-op-x" onclick="Sessoes.apagar('${esc(s.id)}')" title="Apagar" aria-label="Apagar sessão">✕</button></span></div>
          ${s.note?`<div class="ss-l2">${esc(s.note)}</div>`:''}
          ${aConfirmar===s.id?`<div class="ss-conf">Apagar esta sessão? Não há volta. <button class="mini warm" onclick="Sessoes.apagar('${esc(s.id)}',true)">Apagar</button><button class="mini" onclick="Sessoes.cancelar()">Manter</button></div>`:''}
        </div>`;
      }).join('');
    });
  }

  function formEdicao(s,rotulo){
    const pausaMin=Math.round((s.paused_seconds||0)/60);
    return `<div class="ss-linha ss-edicao" data-id="${esc(s.id)}">
      <div class="ss-form">
        <label>Início<input type="datetime-local" id="ss-e-ini" value="${L.instanteParaLisboaInput(new Date(s.started_at))}"></label>
        <label>Fim<input type="datetime-local" id="ss-e-fim" value="${L.instanteParaLisboaInput(new Date(s.ended_at))}"></label>
        <label>Cadeira<select id="ss-e-cad">${opcoesCadeira(s.course_id||'')}</select></label>
        <label>Tipo<select id="ss-e-tipo">${opcoesTipo(s.kind,false)}</select></label>
        <label class="ss-larga">Nota<input id="ss-e-nota" maxlength="140" value="${esc(s.note||'')}" placeholder="Opcional — uma linha"></label>
      </div>
      ${pausaMin>0?`<label class="tr-x"><input type="checkbox" id="ss-e-pausa" checked> descontar ${pausaMin} min de pausa medida</label>`:''}
      <div class="ss-dica">Mudar as horas torna a sessão manual — passa a contar o que declarares.</div>
      <div class="ss-erro" id="ss-e-erro" role="alert"></div>
      <div class="ss-acoes"><button class="btn" onclick="Sessoes.guardarEdicao('${esc(s.id)}')">${rotulo}</button><button class="mini" onclick="Sessoes.cancelar()">Cancelar</button></div>
    </div>`;
  }

  function desenharManual(){
    // Desenhado uma vez; só as opções de cadeira acompanham a lista, e só quando muda.
    const z=$('ss-manual');if(!z)return;
    if(modo!=='pronto'||!carregado){if(chaves['ss-manual']!==undefined){z.innerHTML='';delete chaves['ss-manual'];}return;}
    if(chaves['ss-manual']===undefined){
      chaves['ss-manual']='';
      z.innerHTML=`<details class="addq-recall ss-manual"><summary>+ Adicionar uma sessão que não cronometraste</summary>
        <div class="ss-form">
          <label>Início<input type="datetime-local" id="ss-m-ini"></label>
          <label>Fim<input type="datetime-local" id="ss-m-fim"></label>
          <label>Cadeira<select id="ss-m-cad"></select></label>
          <label>Tipo<select id="ss-m-tipo">${opcoesTipo('',true)}</select></label>
          <label class="ss-larga">Nota<input id="ss-m-nota" maxlength="140" placeholder="Opcional — uma linha"></label>
        </div>
        <div class="ss-dica">Fica marcada como manual: conta como facto, porque foste tu que a declaraste, mas distingue-se das cronometradas.</div>
        <div class="ss-erro" id="ss-m-erro" role="alert"></div>
        <div class="ss-acoes"><button class="btn" onclick="Sessoes.guardarManual()">Guardar sessão</button></div>
      </details>`;
    }
    const chave=JSON.stringify(cadeiras.map(c=>[c.id,c.name,c.active]));
    if(chaves['ss-manual']!==chave){
      chaves['ss-manual']=chave;
      const sel=$('ss-m-cad');const v=sel.value;sel.innerHTML=opcoesCadeira(v);
    }
  }

  /* ---------- ações ---------- */
  // Uma ação de cada vez. O painel fica "ocupado" por classe, sem redesenhar: um
  // formulário aberto não perde o que lá foi escrito.
  async function agir(fn){
    if(ocupado)return;
    ocupado=true;$('sessoes').classList.add('ss-ocupado');
    try{await fn();}
    catch(e){ // com código, foi a base que recusou; sem código, o pedido nem lá chegou
      if(e&&e.code)avisar('A base recusou a ação','Nada mudou (código '+e.code+').','#fb923c');
      else avisar('Sem ligação','A ação não chegou à base. Tenta outra vez.','#fb923c');
    }
    finally{ocupado=false;$('sessoes').classList.remove('ss-ocupado');}
  }
  const falhou=r=>{if(r.error)throw r.error;};

  function iniciar(){
    const cad=$('ss-cadeira').value||null,tipo=$('ss-tipo').value;
    if(!tipo){$('ss-erro-inicio').textContent='Escolhe o tipo de sessão.';return;}
    return agir(async()=>{
      gravarLocal(K_ESCOLHA,{cadeira:cad,tipo});
      const r=await cliente().from('study_sessions').insert({course_id:cad,kind:tipo,source:'cronometro',state:'ativa'}).select().single();
      if(r.error&&r.error.code==='23505'){ // uma ativa por pessoa: a base recusou a segunda
        avisar('Já há uma sessão a decorrer','Começou noutro dispositivo — está agora aqui.','#fb923c');
        await atualizar();return;
      }
      falhou(r);
      ativa=r.data;aFechar=false;desenhar();
      avisar('Sessão iniciada','A contar desde as '+L.horaLisboa(new Date(ativa.started_at))+'.');
    });
  }
  // Pausar, retomar e terminar devolvem a linha mudada — ou nada, se a sessão já
  // não estava como o ecrã julgava (fechada noutro dispositivo ou pelo limite).
  function viaServidor(funcao,depois){
    const s=ativa;if(!s)return;
    return agir(async()=>{
      const r=await cliente().rpc(funcao,{sessao:s.id});
      falhou(r);
      if(!r.data||!r.data.length){avisar('A sessão já tinha mudado','O ecrã estava atrasado — foi atualizado.','#fb923c');await atualizar();return;}
      depois(r.data[0]);desenhar();
    });
  }
  const pausar=()=>viaServidor('pausar_sessao',s=>{ativa=s;});
  const retomar=()=>viaServidor('retomar_sessao',s=>{ativa=s;});
  const terminar=()=>viaServidor('terminar_sessao',s=>{
    ativa=null;
    if(s.state==='por_confirmar'){porConfirmar=[s,...porConfirmar];avisar('Sessão fechada no limite','Passou do limite — ficou por confirmar.','#fb923c');}
    else{recentes=[s,...recentes];avisar('Sessão terminada',L.formatarDuracao(s.duration_min)+' de estudo medido.','#34d399');}
  });
  function continuo(){if(ativa)gravarLocal(K_AVISO,ativa.id);desenharTopo();}

  function aceitar(id){
    return agir(async()=>{
      const r=await cliente().from('study_sessions').update({state:'terminada'}).eq('id',id).eq('state','por_confirmar').select();
      falhou(r);await atualizar();
      if(r.data&&r.data.length)avisar('Sessão aceite',L.formatarDuracao(r.data[0].duration_min)+' contam como estudo.','#34d399');
    });
  }
  function descartar(id,confirmado){
    if(!confirmado){aConfirmar=id;aEditar=null;desenhar();return;}
    return agir(async()=>{
      falhou(await cliente().from('study_sessions').update({state:'descartada'}).eq('id',id).eq('state','por_confirmar').select());
      aConfirmar=null;await atualizar();avisar('Sessão descartada','Deixou de contar.');
    });
  }
  function apagar(id,confirmado){
    if(!confirmado){aConfirmar=id;aEditar=null;desenhar();return;}
    return agir(async()=>{
      falhou(await cliente().from('study_sessions').delete().eq('id',id).select());
      aConfirmar=null;await atualizar();avisar('Sessão apagada','');
    });
  }
  function editar(id){aEditar=id;aConfirmar=null;desenhar();const i=$('ss-e-ini');if(i)i.focus();}
  function cancelar(){aEditar=null;aConfirmar=null;desenhar();}

  // Nada de tempo contado duas vezes: recusa a sobreposição com outra sessão que conte.
  async function sobreposta(inicio,fim,excluir){
    if(ativa&&ativa.id!==excluir&&fim>new Date(ativa.started_at))return ativa;
    let q=cliente().from('study_sessions').select('id,started_at,ended_at').neq('state','descartada')
      .lt('started_at',fim.toISOString()).gt('ended_at',inicio.toISOString());
    if(excluir)q=q.neq('id',excluir);
    const r=await q.limit(1);
    falhou(r);
    return r.data[0]||null;
  }
  const msgSobreposta=o=>`Já tens uma sessão das ${intervalo(o)} nesse intervalo — o mesmo tempo não conta duas vezes.`;
  const limparNota=v=>{const t=String(v||'').replace(/[\r\n]+/g,' ').trim();return t?t.slice(0,140):null;};

  function guardarEdicao(id){
    const s=porConfirmar.find(x=>x.id===id)||recentes.find(x=>x.id===id);if(!s)return;
    const erro=t=>{const e=$('ss-e-erro');if(e)e.textContent=t;};
    const iniTxt=$('ss-e-ini').value,fimTxt=$('ss-e-fim').value;
    const iniMudou=iniTxt!==L.instanteParaLisboaInput(new Date(s.started_at));
    const fimMudou=fimTxt!==L.instanteParaLisboaInput(new Date(s.ended_at));
    const cx=$('ss-e-pausa'),tiraPausa=!!cx&&!cx.checked;
    const patch={course_id:$('ss-e-cad').value||null,kind:$('ss-e-tipo').value,note:limparNota($('ss-e-nota').value)};
    let inicio=new Date(s.started_at),fim=new Date(s.ended_at);
    if(iniMudou||fimMudou){
      const v=L.validarManual(iniTxt,fimTxt,new Date());
      if(!v.ok){erro(v.erro);return;}
      // Só se grava o campo que mudou: um campo intacto guarda o instante original
      // (a hora repetida de outubro não pode ser relida como a outra).
      if(iniMudou){inicio=v.inicio;patch.started_at=inicio.toISOString();}
      if(fimMudou){fim=v.fim;patch.ended_at=fim.toISOString();}
      if(fim<=inicio){erro('O fim tem de ser depois do início.');return;}
    }
    if(tiraPausa)patch.paused_seconds=0;
    if((iniMudou||fimMudou||tiraPausa)&&s.source==='cronometro')patch.source='manual';
    if(s.state==='por_confirmar')patch.state='terminada';
    return agir(async()=>{
      if(iniMudou||fimMudou){
        const o=await sobreposta(inicio,fim,id);
        if(o){erro(msgSobreposta(o));return;}
      }
      const r=await cliente().from('study_sessions').update(patch).eq('id',id).select();
      falhou(r);
      aEditar=null;await atualizar();
      avisar(s.state==='por_confirmar'?'Sessão corrigida e aceite':'Sessão atualizada',r.data&&r.data[0]?L.formatarDuracao(r.data[0].duration_min)+'.':'','#34d399');
    });
  }

  function guardarManual(){
    const erro=t=>{$('ss-m-erro').textContent=t;};
    const v=L.validarManual($('ss-m-ini').value,$('ss-m-fim').value,new Date());
    const tipo=$('ss-m-tipo').value;
    if(!v.ok)return erro(v.erro);
    if(!tipo)return erro('Escolhe o tipo de sessão.');
    erro('');
    return agir(async()=>{
      const o=await sobreposta(v.inicio,v.fim,null);
      if(o)return erro(msgSobreposta(o));
      const r=await cliente().from('study_sessions').insert({
        course_id:$('ss-m-cad').value||null,kind:tipo,note:limparNota($('ss-m-nota').value),
        source:'manual',state:'terminada',started_at:v.inicio.toISOString(),ended_at:v.fim.toISOString(),
      }).select().single();
      falhou(r);
      ['ss-m-ini','ss-m-fim','ss-m-nota'].forEach(i=>{$(i).value='';});
      $('ss-manual').querySelector('details').open=false;
      await atualizar();
      avisar('Sessão adicionada',L.formatarDuracao(r.data.duration_min)+', marcada como manual.','#34d399');
    });
  }

  return {arrancar,atualizar,iniciar,pausar,retomar,terminar,continuo,aceitar,descartar,apagar,editar,cancelar,guardarEdicao,guardarManual};
})();
