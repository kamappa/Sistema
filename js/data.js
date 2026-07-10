/* ===== DADOS DE CONFIGURAÇÃO DO SISTEMA =====
   Constantes puras (sem lógica) carregadas antes do script principal.
   Extraído do index.html — Missão 2 fase 2. */

/* ===== ATRIBUTOS (a espelhar a tua Stats do Notion) ===== */
const ATTRS=[
  {id:'oficio',   name:'Ofício',    sub:'Carreira · Cyber · GRC', color:'#38bdf8'},
  {id:'saber',    name:'Saber',     sub:'Estudo · Conhecimento',  color:'#34d399'},
  {id:'corpo',    name:'Corpo',     sub:'Saúde · Físico',         color:'#f472b6'},
  {id:'mente',    name:'Mente',     sub:'Foco · Equilíbrio',      color:'#a78bfa'},
  {id:'vinculos', name:'Vínculos',  sub:'Relações · Networking',  color:'#fb923c'},
  {id:'disciplina',name:'Disciplina',sub:'Rotina · Consistência', color:'#ef4444'},
];
const AM=Object.fromEntries(ATTRS.map(a=>[a.id,a]));
/* ===== RANKS ===== */
const RANKS=[
  {l:'E',min:1, max:4,  color:'#94a3b8'},
  {l:'D',min:5, max:9,  color:'#34d399'},
  {l:'C',min:10,max:14, color:'#38bdf8'},
  {l:'B',min:15,max:19, color:'#a78bfa'},
  {l:'A',min:20,max:24, color:'#fb923c'},
  {l:'S',min:25,max:9999,color:'#fbbf24'},
];
const TITLES=[[1,'Novice Auditor'],[3,'Privacy Apprentice'],[5,'Cyber Initiate'],[8,'Compliance Adept'],[12,'Cyber Strategist'],[15,'Lead Auditor Candidate'],[19,'Risk Architect'],[23,'GRC Consultant'],[27,'Master of Governance']];
/* ===== HÁBITOS ===== */
const OBLIG=[
  {id:'o_sono',  name:'Dormir 7,5–9h',            attr:'corpo', xp:18, pen:15},
  {id:'o_estudo',name:'Estudo focado (deep work)',attr:'saber', xp:18, pen:15},
  {id:'o_treino',name:'Treino / mover o corpo',   attr:'corpo', xp:18, pen:15},
];
const EXTRAS=[
  {id:'e_disc', name:'Acordar à hora + plano do dia', attr:'disciplina', xp:12},
  {id:'e_ler',  name:'Leitura + notas',               attr:'saber',      xp:9},
  {id:'e_pro',  name:'Atualização / networking pro',  attr:'oficio',     xp:9},
  {id:'e_vinc', name:'Contacto significativo',        attr:'vinculos',   xp:9},
  {id:'e_rev',  name:'Planeamento / revisão do dia',  attr:'mente',      xp:8},
  {id:'e_agua', name:'Hidratação',                    attr:'corpo',      xp:6},
  {id:'e_pele', name:'Skincare + fio dentário',       attr:'corpo',      xp:6},
];
const RECALL_THEMES={
  rgpd:{label:'RGPD',color:'var(--sky)'},
  iso27001:{label:'ISO 27001',color:'var(--em)'},
  nis2:{label:'NIS2',color:'var(--orange)'},
  iso19011:{label:'ISO 19011',color:'var(--cyan)'},
  aigov:{label:'AI Governance',color:'var(--gold)'},
  ia:{label:'IA geral',color:'var(--pink)'}
};
const ACH=[
  {id:'first',ico:'👣',name:'Primeiro passo',msg:'Começaste. É sempre a parte mais difícil.',cond:s=>s.totalXP>0},
  {id:'streak7',ico:'🔥',name:'Uma semana de fogo',msg:'7 dias seguidos. A constância está a nascer.',cond:s=>Math.max(0,...[...s.oblig,...s.extras].map(h=>h.streak))>=7},
  {id:'streak30',ico:'🌋',name:'Imparável',msg:'30 dias seguidos. Já não é motivação, é identidade.',cond:s=>Math.max(0,...[...s.oblig,...s.extras].map(h=>h.streak))>=30},
  {id:'rankD',ico:'⬆️',name:'Rank D',msg:'Um atributo chegou ao nível 5. A ganhar forma.',cond:s=>Math.max(...ATTRS.map(a=>s.attrs[a.id].level))>=5},
  {id:'oficio10',ico:'🛡️',name:'Especialista em ascensão',msg:'Ofício nível 10. A carreira a solidificar.',cond:s=>s.attrs.oficio.level>=10},
  {id:'xp1k',ico:'💠',name:'1000 XP',msg:'Mil pontos de esforço real acumulado.',cond:s=>s.totalXP>=1000},
  {id:'xp5k',ico:'🌟',name:'5000 XP',msg:'Cinco mil. Poucos chegam aqui. Tu chegaste.',cond:s=>s.totalXP>=5000},
  {id:'q5',ico:'📜',name:'Cumpridor',msg:'5 missões concluídas. Objetivos viram resultados.',cond:s=>s.objectives.filter(o=>o.status==='done').length>=5},
  {id:'boss',ico:'👹',name:'Boss derrotado',msg:'Derrotaste um Boss. Os grandes desafios já não te travam.',cond:s=>s.objectives.some(o=>o.pri==='BOSS'&&o.status==='done')},
  {id:'balance',ico:'⬡',name:'Equilíbrio',msg:'Os 6 atributos no nível 3+. Uma vida inteira, não só uma parte.',cond:s=>ATTRS.every(a=>s.attrs[a.id].level>=3)},
  {id:'disc5',ico:'⚙️',name:'Disciplina forjada',msg:'Disciplina nível 5. A base de tudo o resto.',cond:s=>s.attrs.disciplina.level>=5},
];
const DEBUFFS=[
  {id:'impuls',name:'Impulsividade',ef:'Decides depressa demais e arrependes-te.',an:'Escreve antes de agir. Em decisões grandes, espera 24h.'},
  {id:'burnout',name:'Burnout',ef:'Energia e produtividade em queda.',an:'Dorme bem, reduz projetos ativos, descansa sem culpa.'},
  {id:'sobre',name:'Sobreanálise',ef:'Pensas e repensas, mas não ages.',an:'Define a próxima ação mínima e fá-la agora.'},
  {id:'procr',name:'Procrastinação',ef:'Adias o que mais importa.',an:'Regra dos 5 minutos: começa só 5 minutos.'},
];
const TREES=[
  {attr:'oficio',nodes:[['RGPD',2],['NIS2',4],['ISO 27001',6],['Lead Auditor',8],['GRC',10]]},
  {attr:'saber',nodes:[['Leitura',2],['Notas',4],['Síntese',6],['Ensinar',8]]},
  {attr:'corpo',nodes:[['Sono',2],['Treino',4],['Nutrição',6],['Físico',8]]},
  {attr:'disciplina',nodes:[['Constância',2],['Foco',4],['Sistemas',6],['Mestria',8]]},
  {attr:'vinculos',nodes:[['Comunicação',2],['Networking',4],['Liderança',6]]},
  {attr:'mente',nodes:[['Rotina',2],['Planeamento',4],['Revisão',6],['Estabilidade',8]]},
];
const SEASON_ARCS=[
  {id:'summer',name:'☀️ Summer Arc',months:[6,7,8,9],desc:'Estágio · cursos · eventos · networking · IA',boss:'"Quem sou eu comparado com junho?"',bonus:{oficio:1.2,vinculos:1.2},
   quests:[{t:'Conseguir uma entrevista ou contacto direto para estágio',area:'oficio',pri:'P1'},{t:'Participar num evento ou webinar de cibersegurança durante o arco',area:'vinculos',pri:'P2'},{t:'Concluir um curso (CNCS ou Mastermind) até ao fim do arco',area:'saber',pri:'P2'},{t:'Um dia de praia sem culpa — recarregar é estratégia',area:'corpo',pri:'P3'}]},
  {id:'harvest',name:'🍂 Harvest Arc',months:[10,11],desc:'Consolidar · organizar · rever conhecimento',boss:'"O que ficou realmente meu?"',bonus:{saber:1.25,mente:1.2},
   quests:[{t:'Consolidar os apontamentos do semestre num resumo-mestre',area:'saber',pri:'P2'},{t:'Rever e atualizar o portefólio com o que aprendeste',area:'oficio',pri:'P2'},{t:'Fazer a retrospetiva do Summer Arc por escrito',area:'mente',pri:'P3'}]},
  {id:'winter',name:'❄️ Winter Forge',months:[12,1,2],desc:'Construção profunda · muito estudo · pouca exposição',boss:'"O que forjei no silêncio?"',bonus:{saber:1.4,mente:1.25},
   quests:[{t:'Dominar um domínio técnico a fundo (ISO 27001 ou AI Act)',area:'oficio',pri:'P1'},{t:'Ler um livro técnico completo com notas',area:'saber',pri:'P2'},{t:'Construir um projeto prático em silêncio (Shadow Work)',area:'disciplina',pri:'P2'}]},
  {id:'bloom',name:'🌸 Bloom Arc',months:[3,4,5],desc:'Experimentar · conhecer pessoas · abrir portas',boss:'"Que porta nova abri?"',bonus:{vinculos:1.3,corpo:1.15},
   quests:[{t:'Fazer 10 ligações novas no LinkedIn com mensagem pessoal',area:'vinculos',pri:'P2'},{t:'Tomar um café com alguém da indústria',area:'vinculos',pri:'P2'},{t:'Mostrar publicamente algo que construíste (post, demo)',area:'oficio',pri:'P1'}]},
];
const WHISPERS=[
  {t:'Envia uma mensagem a um contacto (LinkedIn ou colega)',attr:'vinculos',xp:10},
  {t:'Escreve 5 linhas no Codex/OneNote sobre algo que aprendeste',attr:'saber',xp:10},
  {t:'10 min de leitura de uma norma (ISO / RGPD / NIS2)',attr:'oficio',xp:10},
  {t:'Caminhada de 15 minutos sem telemóvel',attr:'corpo',xp:10},
  {t:'Planeia amanhã em 3 linhas antes de dormir',attr:'mente',xp:10},
  {t:'Arruma o espaço de trabalho (5 min)',attr:'disciplina',xp:8},
  {t:'Diz à tua namorada uma coisa que aprecias nela',attr:'vinculos',xp:10},
  {t:'Revê as notas de ontem em 10 min',attr:'saber',xp:10},
  {t:'Lê 1 artigo sobre AI Governance / AI Act',attr:'oficio',xp:10},
  {t:'Alonga 10 minutos',attr:'corpo',xp:8},
  {t:'Escreve 3 linhas: o que correu bem hoje?',attr:'mente',xp:8},
  {t:'Prepara já o que precisas para amanhã (roupa, mochila, treino)',attr:'disciplina',xp:8},
];
const WH_SEASON={
 summer:[{t:'Protetor solar antes de sair — pele também é Corpo',attr:'corpo',xp:6},{t:'Treina de manhã cedo, antes do calor',attr:'disciplina',xp:10},{t:'+1 garrafa de água hoje — o calor cobra',attr:'corpo',xp:6},{t:'20 min de sol com juízo — vitamina D grátis',attr:'corpo',xp:8},{t:'Fruta da época em vez de snack processado',attr:'corpo',xp:6},{t:'Estuda na hora mais quente, treina na fresca',attr:'mente',xp:8}],
 harvest:[{t:'Caminhada de outono — ar fresco, cabeça limpa',attr:'corpo',xp:8},{t:'Chá quente + 20 páginas',attr:'saber',xp:8},{t:'Organiza a semana ao domingo à noite',attr:'mente',xp:8}],
 winter:[{t:'Apanha luz natural de manhã (10 min)',attr:'corpo',xp:8},{t:'Deita-te 30 min mais cedo — o inverno é para forjar',attr:'disciplina',xp:8},{t:'Sopa ou refeição quente a sério hoje',attr:'corpo',xp:6},{t:'Treino indoor, sem desculpas de frio',attr:'corpo',xp:10}],
 bloom:[{t:'Treina ao ar livre hoje',attr:'corpo',xp:10},{t:'Caminhada na natureza sem telemóvel',attr:'mente',xp:8},{t:'Convida alguém para um café esta semana',attr:'vinculos',xp:10}]
};
const TITLES_REAL=[
  {id:'cncs',name:'Cyber Foundations (CNCS)',reqs:[
    {id:'a',t:'Cursos do CNCS concluídos (evidência: certificados)'},
    {id:'b',t:'Resumo/portefólio das aprendizagens no teu Codex ou OneNote'},
    {id:'c',t:'1 exercício ou desafio prático resolvido e documentado'},
  ]},
  {id:'rgpd_appr',name:'Privacy Apprentice (RGPD)',reqs:[
    {id:'a',t:'Princípios (art. 5º) e bases legais (art. 6º) dominados — testado, não só lido'},
    {id:'b',t:'1 caso prático escrito (ex.: análise de um tratamento de dados real)'},
    {id:'c',t:'1 registo de atividades de tratamento (RAT) de exemplo feito por ti'},
  ]},
  {id:'aigov_novice',name:'AI Governance Novice',reqs:[
    {id:'a',t:'EU AI Act — visão geral sólida (abordagem por risco, obrigações principais)'},
    {id:'b',t:'Fundamentos ISO/IEC 42001 estudados'},
    {id:'c',t:'2 cursos de AI Governance concluídos (evidência: certificados)'},
    {id:'d',t:'2 casos práticos escritos (ex.: classificar risco de um sistema de IA real)'},
  ]},
  {id:'aigov_pract',name:'AI Governance Practitioner',reqs:[
    {id:'x',t:'Título AI Governance Novice desbloqueado',auto:'aigov_novice'},
    {id:'a',t:'+3 projetos/casos práticos (total 5)'},
    {id:'b',t:'1 risk assessment completo de um sistema de IA'},
    {id:'c',t:'1 artigo publicado ou apresentação feita sobre AI Governance'},
    {id:'d',t:'NIST AI RMF mapeado contra ISO/IEC 42001 (documento teu)'},
  ]},
  {id:'lead27001',name:'ISO 27001 Lead Auditor',reqs:[
    {id:'a',t:'Fundamentos ISO 27001 (cláusulas 4–10 + Anexo A) dominados'},
    {id:'b',t:'Curso Lead Auditor acreditado (PECB, IRCA ou equivalente)'},
    {id:'c',t:'Exame oficial aprovado — certificado emitido (evidência: PDF/Credly)'},
    {id:'d',t:'ISO 19011 (diretrizes de auditoria) estudada'},
    {id:'e',t:'≥1 auditoria (simulada ou real) com relatório escrito por ti'},
  ]},
];
const EVT={prazo:{l:'Prazo',c:'#ef4444'},exame:{l:'Exame',c:'#fb923c'},evento:{l:'Evento',c:'#38bdf8'},treino:{l:'Treino',c:'#34d399'},outro:{l:'Outro',c:'#a78bfa'}};
const PROG={
 push:[{n:'Flexões inclinadas (mãos numa mesa)',t:12},{n:'Flexões de joelhos',t:12},{n:'Flexões completas',t:10},{n:'Flexões diamante',t:10},{n:'Flexões declinadas (pés elevados)',t:10},{n:'Flexões arqueiro',t:8},{n:'Pseudo-planche push-ups',t:8},{n:'Flexões a um braço (assistidas)',t:5}],
 pull:[{n:'Dead hang (segundos)',t:40},{n:'Remada australiana',t:12},{n:'Remada australiana pés elevados',t:10},{n:'Negativas de pull-up (desce em 5s)',t:6},{n:'Pull-ups',t:8},{n:'Pull-ups peito à barra',t:6},{n:'Pull-ups arqueiro',t:6},{n:'Pull-up a um braço (assistida)',t:3}],
 legs:[{n:'Agachamento assistido',t:15},{n:'Agachamento livre',t:15},{n:'Avanços alternados (lunges)',t:12},{n:'Agachamento búlgaro',t:10},{n:'Step-ups altos',t:10},{n:'Pistol squat assistido',t:6},{n:'Agachamento shrimp',t:6},{n:'Pistol squat',t:5}],
 core:[{n:'Prancha (segundos)',t:45},{n:'Hollow hold (segundos)',t:30},{n:'Elevações de pernas no chão',t:15},{n:'Elevações de joelhos suspenso',t:10},{n:'Elevações de pernas suspenso',t:10},{n:'Windshield wipers deitado',t:10},{n:'Toes-to-bar',t:8},{n:'Dragon flag (negativas)',t:5}]
};
const TLINES=[{id:'push',n:'Empurrar',c:'#f472b6'},{id:'pull',n:'Puxar',c:'#38bdf8'},{id:'legs',n:'Pernas',c:'#34d399'},{id:'core',n:'Core',c:'#fbbf24'}];
const PRI={P1:{xp:150,lvl:10,c:'#ef4444'},P2:{xp:90,lvl:6,c:'#fb923c'},P3:{xp:50,lvl:3,c:'#34d399'},BOSS:{xp:400,lvl:15,c:'#facc15'}};
const OST=['pend','doing','done'];const OSTL={pend:'⭘',doing:'⚔️',done:'✅'};
const TIER_LABEL={P3:'Side',P2:'Main',P1:'Elite',BOSS:'Boss'};
const TIER_RANK={P3:'E',P2:'B',P1:'A',BOSS:'S'};
const TIER_KEY={side:'P3',main:'P2',elite:'P1',boss:'BOSS'};
const KW_HI=['exame','teste','entrega','trabalho','certifica','entrevista','audit','relat','apresenta','projeto','prova','estágio','estagio','urgente','defesa'];
const KW_LO=['comer','comprar','lavar','arrumar','limpar','marcar','encomenda','café','cafe','passear'];
const KW_AREA=[
 ['corpo',['trein','ginásio','ginasio','correr','muscul','dormir','sono','dieta','proteína','proteina','alonga','caminh','skincare']],
 ['saber',['estud','exame','teste','curso','ler ','livro','apontament','revis','aula','frequência','frequencia','trabalho de']],
 ['oficio',['iso','rgpd','nis2','audit','cv','linkedin','entrevista','estágio','estagio','certifica','cyber','seguranç','seguranc','compliance','governance','ai act','portefólio','portfolio','dpo']],
 ['vinculos',['namorada','amig','família','familia','network','café com','cafe com','mensagem a','contacto','mentor','patrícia','patricia']],
 ['mente',['medit','planear','plano da','refle','diário','diario','journal','organizar a semana']],
 ['disciplina',['rotina','acordar cedo','hábito','habito','consistên','consisten']]
];
const FUN_TAGS=['🔥 Hot Quest','🗡 Digna de Sombra','☕ Café e Foco','🧠 XP Mental','👑 Material de Lenda','🌫 Missão Sombria'];
const QUOTES=[["A felicidade da tua vida depende da qualidade dos teus pensamentos.","Marco Aurélio"],["Não é porque as coisas são difíceis que não ousamos; é porque não ousamos que elas são difíceis.","Séneca"],["Não expliques a tua filosofia. Encarna-a.","Epicteto"],["Uma vida não examinada não merece ser vivida.","Sócrates"],["Somos o que fazemos repetidamente. A excelência não é um ato, é um hábito.","Aristóteles"],["Tens poder sobre a tua mente — não sobre os acontecimentos. Percebe isto e encontrarás força.","Marco Aurélio"],["Quem tem um porquê enfrenta quase qualquer como.","Nietzsche"],["Conhece-te a ti mesmo.","Oráculo de Delfos"],["Ninguém se banha duas vezes no mesmo rio.","Heraclito"],["A maior vitória é a vitória sobre ti próprio.","Platão"],["Escolhe um trabalho que ames e não terás de trabalhar um único dia.","Confúcio"],["Uma viagem de mil léguas começa com um único passo.","Lao Tsé"],["Conhece o inimigo e conhece-te a ti mesmo; não temerás o resultado de cem batalhas.","Sun Tzu"],["Penso, logo existo.","Descartes"],["Não estragues o que tens desejando o que não tens.","Epicuro"],["A sorte favorece a mente preparada.","Pasteur"]];
const RAREA={cyber:{l:'Cyber',c:'#ef4444'},nis2:{l:'NIS2',c:'#a78bfa'},rgpd:{l:'RGPD',c:'#34d399'},iso27001:{l:'ISO 27001',c:'#38bdf8'},aigov:{l:'AI Gov',c:'#f472b6'},ai:{l:'IA',c:'#c084fc'},evento:{l:'📅 Evento',c:'#fbbf24'}};
