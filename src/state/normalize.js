import { fresh } from './fresh.js';
import { diffTag } from './config.js';
import { today, yday } from './dates.js';

// normalize(S) — o bloco de saneamento do antigo bootState (legacy/js/auth.js:
// 88-112), portado SEM alteração: preenche defaults de campos, migra
// quests→objectives (uma vez) e quebra streaks de ontem. Recebe o estado
// carregado (nuvem/local/fresh) e devolve-o normalizado.
//
// Fica DELIBERADAMENTE de fora nesta fase (não é "casca de estado" — entra com
// o motor/painéis respetivos): loadQuestionBank()/getDailyRecallSet() (Revisão),
// calInit()/fetchWeather() (Calendário/Mundo), processDayClose() (motor de XP —
// penalização), e render()/localSave()/cloudSave() (a cola de persistência vive
// agora no store). A casca carrega e persiste estado fiel; não corre o motor.
export function normalize(S) {
  if (!S.attrs) S = fresh();
  S.log = S.log || []; S.history = S.history || [{ d: today(), v: 0 }]; S.seenAch = S.seenAch || []; S.debuffs = S.debuffs || {}; S.events = S.events || []; S.notified = S.notified || {};
  S.whisper = S.whisper || {}; S.titleEv = S.titleEv || {}; S.titleUnlocked = S.titleUnlocked || {}; S.worldArc = S.worldArc || null; S.recovery = S.recovery || null; S.weather = S.weather || null; S.constellation = S.constellation || { choices: {} };
  S.training = S.training || { prog: { push: 0, pull: 0, legs: 0, core: 0, kegel: 0 }, sessions: [] }; S.training.prog = S.training.prog || { push: 0, pull: 0, legs: 0, core: 0 }; S.training.prog.kegel = S.training.prog.kegel || 0; S.training.sessions = S.training.sessions || [];
  S.sleep = S.sleep || { bedT: '23:30', wakeT: '07:30', logs: [] }; S.sleep.logs = S.sleep.logs || [];
  S.objectives = S.objectives || []; S.shadows = S.shadows || []; S.oracle = S.oracle || { reports: [] }; S.radarAccepted = S.radarAccepted || {};
  S.oracleChat = S.oracleChat || { d: null, count: 0 }; S.sussurro = S.sussurro || null; S.antidote = S.antidote || {};
  S.recall = S.recall || {};
  S.recallToday = S.recallToday || null;
  if (S.recallToday && !S.recallToday.results) S.recallToday.results = {};
  S.customQ = S.customQ || [];
  S.studyStreak = S.studyStreak || { count: 0, lastDay: null };
  if (!S.migratedQuests) {
    (S.quests || []).forEach((q, i) => {
      const pri = q.tier === 'side' ? 'P3' : q.tier === 'main' ? 'P1' : 'BOSS';
      S.objectives.push({ id: 'o' + Date.now() + '_' + i, title: q.title, area: q.attr, pri, auto: false, deadline: null, status: q.done ? 'done' : 'pend', created: today(), tags: [diffTag(q.title.toLowerCase())], arc: q.arc || null });
    });
    delete S.quests; S.migratedQuests = true;
  }
  S.v = 4;
  // quebra streaks antigas (auth.js:111-112)
  [...S.oblig, ...S.extras].forEach((h) => { if (h.lastDone && h.lastDone !== today() && h.lastDone !== yday()) h.streak = 0; });
  if (S.studyStreak.lastDay && S.studyStreak.lastDay !== today() && S.studyStreak.lastDay !== yday()) S.studyStreak.count = 0;
  return S;
}
