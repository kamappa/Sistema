/* CORPO E RECUPERAÇÃO — conteúdo das rotinas.
 * Missão 26 · Fase 7. Revisto a 2026-07-29.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  NADA AQUI FOI INVENTADO. Cada série, cada segundo de contração e    ║
 * ║  cada aviso vem de uma fonte oficial de saúde, identificada e        ║
 * ║  datada. Onde as fontes divergem, escolhe-se o valor CONSERVADOR e   ║
 * ║  a divergência fica escrita.                                         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * ISTO É CONTEÚDO EDUCATIVO, NÃO ACONSELHAMENTO CLÍNICO. O Sistema não
 * diagnostica, não promete resultados e não adapta protocolos a sintomas. Onde
 * há sintomas, a única resposta correta é parar e procurar avaliação — e é
 * isso que os avisos dizem, sem rodeios.
 *
 * O QUE FOI DELIBERADAMENTE EXCLUÍDO, e porquê:
 *   - "treino de jawline", mastigação excessiva, dispositivos de resistência
 *     e neck bridges: nenhuma fonte oficial os recomenda, e a fonte do TMJ diz
 *     literalmente o contrário — evitar mastigar mais do que o necessário;
 *   - parar o jato de urina como exercício habitual: a fonte de Cambridge
 *     desaconselha-o por nome;
 *   - qualquer promessa de resultado sexual ou estético.
 */

export interface Source {
  id: string;
  /** Instituição. É o que dá autoridade, não o URL. */
  org: string;
  title: string;
  url: string;
  /** Data em que ESTA revisão foi feita, não a data do documento. */
  reviewed: string;
}

export const SOURCES: Source[] = [
  {
    id: 'cuh-pelvic',
    org: 'Cambridge University Hospitals NHS Foundation Trust',
    title: 'Pelvic floor exercises in men: frequently asked questions',
    url: 'https://www.cuh.nhs.uk/patient-information/pelvic-floor-exercises-in-men-frequently-asked-questions/',
    reviewed: '2026-07-29',
  },
  {
    id: 'nhs-bladder',
    org: 'NHS',
    title: 'Urinary incontinence — 10 ways to stop leaks',
    url: 'https://www.nhs.uk/conditions/urinary-incontinence/10-ways-to-stop-leaks/',
    reviewed: '2026-07-29',
  },
  {
    id: 'nth-pelvic',
    org: 'North Tees and Hartlepool NHS Foundation Trust',
    title: 'Pelvic floor exercises for men',
    url: 'https://www.nth.nhs.uk/resources/pelvic-floor-exercises-for-men/',
    reviewed: '2026-07-29',
  },
  {
    id: 'worcs-tmj',
    org: 'Worcestershire Acute Hospitals NHS Trust',
    title: 'Temporomandibular joint (TMJ) pain — physiotherapy management',
    url: 'https://www.worcsacute.nhs.uk/leaflets/temporomandibular-joint-tmj-pain-physiotherapy-management/',
    reviewed: '2026-07-29',
  },
  {
    id: 'dh-neck',
    org: 'Dynamic Health (NHS)',
    title: 'Neck pain — help and advice',
    url: 'https://www.dynamichealth.nhs.uk/help-and-advice/neck-pain/',
    reviewed: '2026-07-29',
  },
];

export const sourceById = (id: string) => SOURCES.find((s) => s.id === id);

/** Uma fase da demonstração. A animação é gerada destes valores — não há
 *  ficheiro de vídeo, não há GIF de terceiros, não há asset externo. */
export interface Phase {
  /** O que fazer nesta fase. */
  label: string;
  /** Segundos. */
  secs: number;
  /** Instrução de respiração. Nunca "prende a respiração". */
  breath: 'inspira' | 'expira' | 'normal';
  /** 0–1: quanto do movimento está feito no fim desta fase. Alimenta o SVG. */
  amount: number;
}

/* ── A TAXONOMIA APROVADA — Fase 7Z ────────────────────────────────────
 * Kegel é um TIPO DE EXERCÍCIO dentro de Pavimento Pélvico; não é um módulo,
 * não é uma sessão de calistenia, e não é uma fonte de XP.
 *
 * O campo existe para a estrutura estar nos DADOS e não só num documento: uma
 * decisão de taxonomia que vive num .md volta a perder-se à próxima pessoa que
 * acrescentar um exercício.
 *
 * NOTA HONESTA sobre `respiratoria`: a estrutura aprovada lista "coordenação
 * respiratória" como quinto tipo. Não existe como exercício separado, e não o
 * inventei — as fontes (CUH, NTH) tratam a respiração como TÉCNICA que
 * atravessa todos os exercícios, não como exercício autónomo. Está presente em
 * todas as fases (`breath`) e na primeira ressalva da rotina. Criar um
 * exercício "respiração" sem fonte que o descreva como tal seria conteúdo de
 * saúde inventado — a regra da Fase 7 proíbe-o. */
export type PelvicKind = 'controlada' | 'relaxamento' | 'rapida' | 'sustentada' | 'respiratoria';

export interface Exercise {
  id: string;
  name: string;
  /** Tipo dentro da taxonomia de Pavimento Pélvico. Ausente nas outras
   *  rotinas, que têm taxonomia própria. */
  kind?: PelvicKind;
  /** O que este exercício serve. Sem promessas. */
  goal: string;
  /** Como se faz, em passos curtos. */
  how: string[];
  phases: Phase[];
  /** Quantas repetições por série. */
  reps: number;
  /** Quantas séries. */
  sets: number;
  /** Erro comum — o que faz o exercício deixar de servir. */
  mistake: string;
  /** O sinal para parar. Específico deste exercício. */
  stop: string;
  sourceId: string;
  /** Forma do desenho. Governa qual figura o `BodyDemo` desenha. */
  figure: 'pelvis' | 'jaw' | 'neck' | 'shoulder';
}

export interface Routine {
  id: 'pelvic' | 'jawneck';
  name: string;
  /** Uma linha que diz o que a rotina é. */
  lede: string;
  /** O enquadramento honesto: o que pode ajudar, sem prometer. */
  claim: string;
  exercises: Exercise[];
  /** Avisos que valem para a rotina inteira. */
  cautions: string[];
  /** Sinais que mandam PARAR e procurar avaliação. */
  redFlags: string[];
  sourceIds: string[];
}

/* ── PAVIMENTO PÉLVICO ──────────────────────────────────────────────────
 *
 * DIVERGÊNCIA REGISTADA entre fontes, e como foi resolvida:
 *   · North Tees: contração lenta de 5s × 8, rápidas × 10, ≥3× por dia.
 *   · Cambridge: ≥10 contrações, até 6× por dia, sem duração indicada.
 *   · NHS (bexiga): rápidas de 2s × 10, subindo até 10s com o tempo.
 *
 * O Sistema usa o CONSERVADOR: 5s de contração e 8 repetições, 3× por dia.
 * Não sobe automaticamente para 10s — subir é uma decisão que depende de
 * conseguir manter a técnica, e o Sistema não consegue ver isso.
 */
export const PELVIC: Routine = {
  id: 'pelvic',
  name: 'Pavimento pélvico',
  lede: 'Contrair, elevar e — tão importante quanto — relaxar por completo.',
  claim:
    'Feito com técnica correta e ao longo de meses, este treino é usado para melhorar o controlo urinário e a consciência muscular da região. O Sistema não promete resultados nem substitui uma avaliação.',
  exercises: [
    {
      id: 'identify',
      name: 'Encontrar o músculo',
      kind: 'controlada',
      goal: 'Saber o que estás a contrair antes de treinar. Um treino no músculo errado não treina nada.',
      how: [
        'Sentado numa cadeira firme, pés no chão, pernas ligeiramente afastadas.',
        'Contrai o anel muscular à volta do ânus, como se travasses gases.',
        'Ao mesmo tempo, eleva para dentro, na direção do umbigo.',
        'A base do pénis move-se ligeiramente para cima — é esse o sinal de que acertaste.',
      ],
      phases: [
        { label: 'Contrai e eleva', secs: 3, breath: 'expira', amount: 1 },
        { label: 'Solta por completo', secs: 3, breath: 'inspira', amount: 0 },
      ],
      reps: 3,
      sets: 1,
      mistake:
        'Contrair glúteos, coxas ou abdómen. Se algo se mexe por fora, não é o pavimento pélvico.',
      stop: 'Se não conseguires identificar o movimento, não insistas com mais força — procura avaliação com um fisioterapeuta.',
      sourceId: 'cuh-pelvic',
      figure: 'pelvis',
    },
    {
      id: 'slow',
      name: 'Contração sustentada',
      kind: 'sustentada',
      goal: 'Resistência. É a contração que sustenta ao longo do tempo.',
      how: [
        'Contrai e eleva com firmeza.',
        'Mantém enquanto contas até cinco, a respirar normalmente.',
        'Solta devagar e relaxa por completo antes da repetição seguinte.',
      ],
      phases: [
        { label: 'Contrai e eleva', secs: 2, breath: 'expira', amount: 1 },
        { label: 'Mantém', secs: 5, breath: 'normal', amount: 1 },
        { label: 'Solta devagar', secs: 2, breath: 'inspira', amount: 0 },
        { label: 'Relaxa por completo', secs: 4, breath: 'normal', amount: 0 },
      ],
      reps: 8,
      sets: 1,
      mistake:
        'Prender a respiração. Se não consegues falar durante a contração, estás a prender — solta e recomeça.',
      stop: 'Dor pélvica, ardor ou dificuldade em urinar depois do treino.',
      sourceId: 'nth-pelvic',
      figure: 'pelvis',
    },
    {
      /* ── RELAXAMENTO, como exercício e não como pausa ──
       * A estrutura aprovada lista o relaxamento como tipo próprio, e tinha
       * razão de ser: o conteúdo já dizia "o relaxamento entre repetições conta
       * tanto como a contração" e "um músculo que nunca solta não fica mais
       * forte — fica tenso", mas isso vivia como RESSALVA dentro de outros
       * exercícios. Uma coisa que só aparece como aviso não se treina.
       *
       * Não é conteúdo novo: é a mesma orientação das mesmas fontes,
       * reorganizada para ser praticável. Nenhuma afirmação nova de saúde foi
       * acrescentada — se fosse preciso uma, tinha de vir com fonte aberta. */
      id: 'relax',
      name: 'Relaxamento completo',
      kind: 'relaxamento',
      goal: 'Soltar por inteiro. Um pavimento pélvico que está sempre meio contraído não é um pavimento forte — é um pavimento tenso, e a tensão dá os mesmos sintomas que a fraqueza.',
      how: [
        'Sem contrair nada, repara na zona entre o ânus e a base do pénis.',
        'Deixa-a descer e alargar, como se cedesse ao peso.',
        'Respira normalmente; a barriga move-se, o pavimento não resiste.',
        'Se sentires que continua a segurar, não forces o relaxamento — dá-lhe tempo.',
      ],
      phases: [
        { label: 'Solta e deixa descer', secs: 6, breath: 'normal', amount: 0 },
        { label: 'Continua sem contrair', secs: 6, breath: 'normal', amount: 0 },
      ],
      reps: 3,
      sets: 1,
      mistake: 'Tratar isto como descanso entre séries. É o exercício, e é o que falta na maioria dos treinos.',
      stop: 'Se a sensação de tensão não passar depois do treino, procura avaliação — pode ser hipertonia e não fraqueza.',
      sourceId: 'nth-pelvic',
      figure: 'pelvis',
    },
    {
      id: 'fast',
      name: 'Contração rápida',
      kind: 'rapida',
      goal: 'Resposta. É a contração que reage a um esforço súbito — tossir, levantar peso.',
      how: [
        'Contrai com força e solta imediatamente.',
        'Cerca de uma contração por segundo.',
        'O relaxamento entre contrações é parte do exercício, não uma pausa.',
      ],
      phases: [
        { label: 'Contrai', secs: 1, breath: 'normal', amount: 1 },
        { label: 'Solta', secs: 1, breath: 'normal', amount: 0 },
      ],
      reps: 10,
      sets: 1,
      mistake: 'Encadear contrações sem relaxar. Um músculo que nunca solta não fica mais forte — fica tenso.',
      stop: 'Sensação de tensão que não passa depois do treino.',
      sourceId: 'nth-pelvic',
      figure: 'pelvis',
    },
  ],
  cautions: [
    'Respira normalmente. Prender a respiração é o erro mais comum e anula o exercício.',
    'Não contraias glúteos, coxas nem abdómen com força.',
    'O relaxamento entre repetições conta tanto como a contração.',
    'NÃO uses parar o jato de urina como exercício habitual — pode interferir com o esvaziamento normal da bexiga.',
    'Resultados, quando aparecem, levam meses de prática regular. Não há atalho e o Sistema não vai fingir que há.',
  ],
  redFlags: [
    'Dor pélvica, perineal ou genital durante ou depois do treino',
    'Dificuldade em urinar ou em esvaziar a bexiga',
    'Sangue na urina',
    'Perdas que pioram em vez de melhorarem',
  ],
  sourceIds: ['cuh-pelvic', 'nth-pelvic', 'nhs-bladder'],
};

/* ── MANDÍBULA E PESCOÇO ────────────────────────────────────────────────
 *
 * O que esta rotina NÃO é, e fica dito no produto e não só aqui: não é treino
 * de "jawline". A fonte do TMJ desaconselha explicitamente mastigar mais do
 * que o necessário, e nenhuma fonte oficial recomenda dispositivos de
 * resistência, neck bridges ou amplitudes forçadas. Isto é mobilidade suave,
 * postura e isometria controlada.
 */
export const JAWNECK: Routine = {
  id: 'jawneck',
  name: 'Mandíbula e pescoço',
  lede: 'Mobilidade suave, postura e controlo. Nunca força.',
  claim:
    'Estes exercícios são usados para conforto, mobilidade e postura da mandíbula e do pescoço. Não alteram a forma do rosto e o Sistema não promete que o façam.',
  exercises: [
    {
      id: 'restjaw',
      name: 'Posição de repouso da mandíbula',
      goal: 'A posição neutra a partir da qual tudo o resto se faz. Também é o antídoto do apertar de dentes.',
      how: [
        'Pousa a língua levemente no céu da boca.',
        'Relaxa os músculos da mandíbula e deixa os dentes afastarem-se ligeiramente.',
        'Lábios fechados, dentes sem se tocarem.',
      ],
      phases: [
        { label: 'Língua ao céu da boca', secs: 3, breath: 'inspira', amount: 0.4 },
        { label: 'Deixa os dentes afastarem-se', secs: 6, breath: 'expira', amount: 0 },
      ],
      reps: 3,
      sets: 1,
      mistake: 'Manter os dentes em contacto. Em repouso, os dentes não se tocam.',
      stop: 'Se a mandíbula bloquear ou não voltar à posição.',
      sourceId: 'worcs-tmj',
      figure: 'jaw',
    },
    {
      id: 'chintuck',
      name: 'Recolher do queixo',
      goal: 'Postura da cabeça sobre os ombros e ativação dos flexores profundos do pescoço.',
      how: [
        'Sentado ou de pé, com o tronco direito.',
        'Recua o queixo para trás, como se fizesses um queixo duplo.',
        'A cabeça fica direita — não olhes para baixo.',
      ],
      phases: [
        { label: 'Recua o queixo', secs: 2, breath: 'expira', amount: 1 },
        { label: 'Mantém', secs: 4, breath: 'normal', amount: 1 },
        { label: 'Solta', secs: 2, breath: 'inspira', amount: 0 },
      ],
      reps: 8,
      sets: 1,
      mistake: 'Baixar o queixo em direção ao peito. É recuar, não é acenar que sim.',
      stop: 'Tonturas, formigueiro nos braços ou dor que aumenta.',
      sourceId: 'worcs-tmj',
      figure: 'neck',
    },
    {
      id: 'goldfish',
      name: 'Abertura controlada',
      goal: 'Ensinar a mandíbula a abrir a direito, sem desviar para um lado.',
      how: [
        'Língua no céu da boca.',
        'Um dedo indicador sobre a articulação, à frente do ouvido; o outro no queixo.',
        'Desce a mandíbula e volta a subir, com o dedo do queixo a guiar o movimento.',
        'Faz em frente a um espelho para veres se o movimento é a direito.',
      ],
      phases: [
        { label: 'Desce a mandíbula', secs: 3, breath: 'normal', amount: 1 },
        { label: 'Sobe e fecha', secs: 3, breath: 'normal', amount: 0 },
      ],
      reps: 8,
      sets: 1,
      mistake: 'Abrir o máximo possível. A amplitude aqui é confortável, não máxima.',
      stop: 'Estalido doloroso, bloqueio, ou dor que aumenta durante o movimento.',
      sourceId: 'worcs-tmj',
      figure: 'jaw',
    },
    {
      id: 'neckrot',
      name: 'Rotação do pescoço',
      goal: 'Mobilidade cervical dentro da amplitude confortável.',
      how: [
        'Sentado, ombros relaxados.',
        'Roda a cabeça para um lado até sentires um alongamento suave.',
        'Mantém, volta ao centro e repete para o outro lado.',
      ],
      phases: [
        { label: 'Roda para a direita', secs: 2, breath: 'expira', amount: 1 },
        { label: 'Mantém', secs: 5, breath: 'normal', amount: 1 },
        { label: 'Volta ao centro', secs: 2, breath: 'inspira', amount: 0 },
      ],
      reps: 5,
      sets: 1,
      mistake: 'Forçar até ao limite. Alongamento suave — se dói, passaste do ponto.',
      stop: 'Tonturas, visão dupla, dificuldade em falar ou engolir.',
      sourceId: 'dh-neck',
      figure: 'neck',
    },
    {
      id: 'scapula',
      name: 'Retração das omoplatas',
      goal: 'Postura do tronco. O pescoço não se corrige sozinho se os ombros estiverem à frente.',
      how: [
        'Sentado, braços descontraídos.',
        'Junta as omoplatas atrás, sem levantar os ombros.',
        'Mantém e solta.',
      ],
      phases: [
        { label: 'Junta as omoplatas', secs: 2, breath: 'expira', amount: 1 },
        { label: 'Mantém', secs: 5, breath: 'normal', amount: 1 },
        { label: 'Solta', secs: 2, breath: 'inspira', amount: 0 },
      ],
      reps: 8,
      sets: 1,
      mistake: 'Encolher os ombros para cima. O movimento é para trás, não para cima.',
      stop: 'Dor entre as omoplatas que irradia para o braço.',
      sourceId: 'dh-neck',
      figure: 'shoulder',
    },
  ],
  cautions: [
    'Isto não é treino de "jawline". Nenhuma fonte oficial recomenda mastigação excessiva, pastilha elástica como treino ou dispositivos de resistência.',
    'Evita abrir a boca em demasia, incluindo ao bocejar.',
    'Corta alimentos duros e mastigadores em pedaços mais pequenos enquanto tiveres sintomas.',
    'Evita segurar o telemóvel entre o ombro e a orelha.',
    'A melhoria, quando acontece, leva semanas. Seis a doze semanas é o intervalo que as fontes indicam para o pescoço.',
  ],
  redFlags: [
    'Tonturas, desmaios, visão dupla ou fala arrastada',
    'Dificuldade em engolir',
    'Fraqueza progressiva ou perda de coordenação nos braços ou pernas',
    'Perda de equilíbrio a andar',
    'Bloqueio da mandíbula ou estalido com dor',
    'Dormência ou formigueiro que não passa',
  ],
  sourceIds: ['worcs-tmj', 'dh-neck'],
};

export const ROUTINES: Routine[] = [PELVIC, JAWNECK];

/** Duração estimada de uma rotina, em segundos. Só das fases — sem descanso
 *  entre exercícios, que depende do Operador e não se finge que se sabe. */
export function routineSeconds(r: Routine): number {
  return r.exercises.reduce(
    (s, e) => s + e.sets * e.reps * e.phases.reduce((p, ph) => p + ph.secs, 0),
    0
  );
}
