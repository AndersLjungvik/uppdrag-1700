// The living world uses the original book, jobs and assessment rules. Only this
// adapter may execute them: a requested route is not an arrival at a work place.
import {createEngine, validBank, SAVE_KEY as ORIGINAL_SAVE_KEY, BANK_KEY} from '../world/engine.mjs?v=0.6.17-enter';
import {PLACES, LEVEL_NAMES} from '../world/content.mjs?v=0.6.17-enter';
import {choicesFor} from '../world/learning.mjs?v=0.6.17-enter';
import {applyChapterJobs} from './chapter-jobs.mjs?v=3.20.0';
import {createWorkEvidence} from './work-evidence.mjs?v=3.20.0';

export const SAVE_KEY = 'uppdrag1700.living-story.v1';
export const PREVIOUS_GAME_KEY = 'uppdrag1700.living-story.previous.v1';
const KNOWN_PEOPLE_KEY = 'uppdrag1700-known-people-v1';
const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
const copy = value => JSON.parse(JSON.stringify(value));
const base = window.CLASSROOM_CURRICULUM;
if (!base || !window.UPPDRAG_PRACTICE) throw new Error('Bokens underlag kunde inte läsas in.');
const imported = read(BANK_KEY);
const bank = imported?.bankId === base.bankId && validBank(imported, base) ? imported : base;
// An older saved official bank may lack the subsequently reviewed choices.
// Refresh only identical official questions; never write to the bank's save key.
if (bank !== base && bank.sourcePolicy === base.sourcePolicy) {
  const official = new Map(base.missions.flatMap(m => m.cards.map(q => [q.id, q])));
  for (const mission of bank.missions) for (const question of mission.cards) {
    const source = official.get(question.id);
    if (!source || question.answer !== source.answer || question.question !== source.question) continue;
    if (question.type === 'short') {
      if (source.distractors) question.distractors = [...source.distractors];
      else delete question.distractors;
    } else if (question.type === 'chain' && question.steps?.length === source.steps?.length && question.steps.every((step, i) => step.answer === source.steps[i].answer)) {
      question.steps = source.steps.map(step => ({...step, options: [...step.options]}));
    }
  }
}

let revision = 0, saveError = false, quizContext = null, physicalPlace = null, awaitingReload = false;
function changed() {
  revision++;
  window.dispatchEvent(new CustomEvent('uppdrag-story-change', {detail: {revision, saveError}}));
}
function persist(value) {
  // A successful game switch is committed before the page reloads. Late UI
  // callbacks from the old room must not overwrite that committed save.
  if (awaitingReload) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(value)); saveError = false; }
  catch { saveError = true; }
  changed();
}
const saved = read(SAVE_KEY);
const initial = saved?.version === 2 ? saved : read(ORIGINAL_SAVE_KEY);
const engine = createEngine({bank, practice: window.UPPDRAG_PRACTICE, initial, onSave: persist});
applyChapterJobs(engine.content);
// Make later reads, including invitations, entirely free of state mutations.
for (const chapter of engine.content.chapters) engine.world().jobs[chapter.id] ||= {done: 0, active: null};
preserveWorkSessionTime(engine, initial);
let evidence = createWorkEvidence(engine);

function preserveWorkSessionTime(target, source) {
  if (source?.bankId !== bank.bankId) return;
  // The original engine bounds numeric fields as counters, including this
  // timestamp. Preserve the saved pass ID only for the same validated quiz,
  // so reloading/restoring does not discard its recorded first attempts.
  for (const chapter of target.content.chapters) {
    const active = target.world().jobs[chapter.id]?.active;
    const savedActive = source.paperWorld?.jobs?.[chapter.id]?.active;
    const quiz = active?.quiz, savedQuiz = savedActive?.quiz;
    if (active?.phase !== 'work' || savedActive?.phase !== 'work' ||
        active.level !== savedActive.level || !quiz || !savedQuiz ||
        quiz.index !== savedQuiz.index || !Array.isArray(savedQuiz.ids) ||
        quiz.ids.length !== savedQuiz.ids.length ||
        !quiz.ids.every((id, index) => id === savedQuiz.ids[index]) ||
        !Number.isSafeInteger(savedQuiz.startedAt) || savedQuiz.startedAt < 0) continue;
    quiz.startedAt = savedQuiz.startedAt;
  }
}
function previousGame() {
  const previous = read(PREVIOUS_GAME_KEY);
  return previous?.version === 1 && previous.game?.version === 2 &&
    previous.game.bankId === bank.bankId &&
    (previous.knownPeople === null || typeof previous.knownPeople === 'string') ? previous : null;
}
function preparedGame(initial) {
  const candidate = createEngine({bank, practice: window.UPPDRAG_PRACTICE, initial});
  applyChapterJobs(candidate.content);
  for (const chapter of candidate.content.chapters) candidate.world().jobs[chapter.id] ||= {done: 0, active: null};
  preserveWorkSessionTime(candidate, initial);
  createWorkEvidence(candidate);
  return candidate.snapshot();
}
function switchGame(restorePrevious = false) {
  const previous = restorePrevious ? previousGame() : null;
  if (restorePrevious && !previous) return {ok: false, reason: 'previous'};
  // Prepare and validate the destination without changing the active engine.
  // A valid empty save also prevents the legacy fallback from importing the
  // old answers again on the next load.
  const next = preparedGame(previous?.game || null);
  const writes = [];
  function write(key, value) {
    const before = localStorage.getItem(key);
    if (before === value) return;
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    writes.push({key, before});
  }
  try {
    const backup = {version: 1, savedAt: Date.now(), game: engine.snapshot(),
      knownPeople: localStorage.getItem(KNOWN_PEOPLE_KEY)};
    write(PREVIOUS_GAME_KEY, JSON.stringify(backup));
    write(SAVE_KEY, JSON.stringify(next));
    write(KNOWN_PEOPLE_KEY, previous?.knownPeople ?? null);
  } catch {
    // Each localStorage write is atomic. Undo only writes that succeeded, so
    // a denied/quota-limited save leaves the playable current game in place.
    let rollbackFailed = false;
    for (const {key, before} of writes.reverse()) {
      // If restoring another key is denied too, keep the just-written backup
      // of the active game available for a later recovery.
      if (key === PREVIOUS_GAME_KEY && rollbackFailed) continue;
      try {
        if (before === null) localStorage.removeItem(key);
        else localStorage.setItem(key, before);
      } catch { rollbackFailed = true; }
    }
    saveError = true; changed();
    return {ok: false, reason: 'save'};
  }
  awaitingReload = true;
  engine.replace(next);
  preserveWorkSessionTime(engine, next);
  evidence = createWorkEvidence(engine);
  quizContext = null; physicalPlace = null; saveError = false;
  changed();
  return {ok: true, reload: true};
}

function currentPlace() { return window.UPPDRAG_STORY_WORLD?.currentPlace() || null; }
function syncPlace() {
  if (awaitingReload) return {ok: false, reason: 'reload'};
  const place = currentPlace();
  if (place !== physicalPlace) { quizContext = null; physicalPlace = place; }
  if (!place || !engine.availablePlaces().includes(place)) return {ok: false, reason: 'place'};
  if (engine.world().scene !== place) return engine.arrive(place);
  return {ok: true};
}

function taskAt(place) {
  const chapter = engine.current(), active = engine.active(), level = engine.level();
  if (!active && engine.progress().done === 3) return null;
  if (engine.target() !== place) return null;
  const phase = active?.phase || 'offer';
  const stop = phase === 'pickup' ? level.pickups[active.pickup] : phase === 'handoff' ? level.handoffs[active.handoff] : null;
  const labels = {
    offer: 'Jag frågar om ' + level.title.toLowerCase() + '.',
    work: (active?.quiz ? 'Jag fortsätter med ' : 'Jag börjar med ') + level.artifact.toLowerCase() + '.',
    materials: 'Nu kan jag göra provtrycket.',
    puzzle: 'Jag vill jämföra kartorna.',
    deliver: 'Jag har med mig ' + level.artifact.toLowerCase() + '.'
  };
  return {
    key: [chapter.id, level.level, phase, active?.pickup || 0, active?.handoff || 0, active?.repeat ? 'repeat' : 'story'].join(':'),
    place, chapter: chapter.id, level: level.level, phase,
    title: level.title, artifact: level.artifact, request: level.request,
    desk: level.job?.desk || '', resuming: !!active?.quiz,
    thought: labels[phase] || (phase === 'pickup' ? 'Jag hämtar underlaget.' : 'Jag visar arbetet.'),
    text: stop?.text || (phase === 'deliver' ? level.result : level.request),
    label: stop?.label || labels[phase] || 'Jag tar med mig underlaget.',
    giver: level.giver, recipient: level.recipient
  };
}

function invitationFor(person) {
  const home = person?.home;
  if (!['cafe', 'print', 'archive', 'quay'].includes(home)) return null;
  const task = taskAt(home);
  if (!task) return null;
  const destination = {cafe: 'kaffehuset', print: 'tryckeriet', archive: 'arkivet', quay: 'kajen'}[home];
  const introductions = {
    cafe: 'Jag har en beställning åt dig.',
    print: 'Jag har ett arbete åt dig.',
    archive: 'Det finns några handlingar jag vill visa dig.',
    quay: 'Jag har ett bud som behöver komma rätt.'
  };
  const first = task.phase === 'offer' ? introductions[home]
    : task.phase === 'pickup' ? 'Jag har underlaget du behöver.'
    : task.phase === 'handoff' ? 'Vi behöver titta på det du har med dig.'
    : task.phase === 'deliver' ? 'Är arbetet klart? Jag vill gärna se det.'
    : task.phase === 'materials' ? 'Nu finns det plats vid pressen.'
    : 'Vi kan sätta oss med arbetet en stund.';
  return {key: task.key, place: home, text: first + ' Följ med till ' + destination + '.'};
}

const rejected = reason => ({ok: false, reason});
function phaseAt(place, phase) {
  return currentPlace() === place && taskAt(place)?.phase === phase;
}
function quizAllowed() {
  const quiz = engine.currentQuiz(), place = currentPlace();
  if (!quiz || !quizContext || quizContext.place !== place || quizContext.kind !== quiz.kind || engine.world().screen !== 'work') return false;
  return quiz.kind === 'story' ? phaseAt(place, 'work') && engine.level().work === place : true;
}
function act(method, ...args) {
  if (awaitingReload) return rejected('reload');
  if (method === 'newGame') return switchGame();
  if (method === 'restorePreviousGame') return switchGame(true);
  syncPlace();
  const place = currentPlace();
  const placeMethods = {accept: 'offer', pickup: 'pickup', beginWork: 'work', handoff: 'handoff', deliver: 'deliver'};
  if (Object.hasOwn(placeMethods, method)) {
    if (!place || args[0] !== place) return rejected('place');
    if (method === 'accept' && args[1]?.repeatLevel != null) {
      const level = engine.current().levels[args[1].repeatLevel - 1];
      if (!Number.isInteger(args[1].repeatLevel) || !level || level.giver !== place || engine.active()) return rejected('place');
    } else if (!phaseAt(place, placeMethods[method])) return rejected('place');
    const completed = method === 'deliver' ? {chapter: engine.current().id, level: engine.active()?.level} : null;
    const result = engine[method](...args);
    if (method === 'beginWork' && result?.ok) {
      quizContext = {place, kind: 'story'};
      evidence.start(); engine.save();
    }
    if (method === 'deliver' && result?.ok) {
      result.workReport = evidence.markDelivered(completed.chapter, completed.level);
      engine.save();
    }
    return result;
  }
  if (['placeMaterial', 'print', 'puzzle'].includes(method)) {
    const required = method === 'puzzle' ? 'puzzle' : 'materials';
    if (!phaseAt(place, required)) return rejected('place');
    return engine[method](...args);
  }
  if (['answer', 'showOptions', 'setDraft', 'hint', 'retry', 'nextQuestion'].includes(method)) {
    if (!quizAllowed()) return rejected('place');
    if (method === 'setDraft' && engine.question()?.type === 'short') {
      const quiz = engine.currentQuiz();
      if (args[0] !== 0 || quiz.feedback || typeof args[1] !== 'string') return false;
      // The original quiz restore already validates this draft array. Free text
      // now gets the same pause/reload protection as the three-link answers.
      quiz.draft = [args[1].slice(0, 300)]; engine.save(); return true;
    }
    const quiz = engine.currentQuiz(), question = engine.question();
    const ownAttempt = method === 'answer' && quiz?.kind === 'story'
      ? {id: question.id, supported: args[1]?.supported === true || !!quiz.hint || !!quiz.failed || !!quiz.optionsShown || question.type === 'chain'} : null;
    const completed = method === 'nextQuestion' && quiz?.kind === 'story' &&
      quiz.feedback?.correct && quiz.index === quiz.ids.length - 1 ? evidence.capture() : null;
    const result = engine[method](...args);
    if (ownAttempt && result?.ok && evidence.record(ownAttempt.id, result.correct, ownAttempt.supported)) engine.save();
    if (completed && result?.ok && result.finished) {
      result.workReport = evidence.finish(completed); engine.save();
    }
    if (method === 'nextQuestion' && result?.finished) quizContext = null;
    return result;
  }
  if (method === 'beginReview') {
    if (place !== 'archive') return rejected('place');
    if (engine.world().review?.kind === 'gate') return rejected('busy');
    const result = engine.beginReview();
    if (result.ok) quizContext = {place, kind: engine.currentQuiz().kind};
    return result;
  }
  if (method === 'beginGateExam') {
    if (!place || !engine.availablePlaces().includes(place)) return rejected('place');
    const result = engine.world().review?.kind === 'gate' ? engine.beginReview() : engine.beginGateExam();
    if (result.ok && !result.already) quizContext = {place, kind: 'gate'};
    return result;
  }
  if (method === 'pauseWork') { quizContext = null; engine.pauseWork(); return {ok: true}; }
  if (method === 'cancelReview') { quizContext = null; engine.cancelReview(); return {ok: true}; }
  if (method === 'cancelRepeat') {
    quizContext = null;
    const chapter = engine.current().id, level = engine.active()?.level;
    const result = engine.cancelRepeat();
    if (result) { evidence.cancel(chapter, level); engine.save(); }
    return result;
  }
  if (method === 'setChapter') {
    const result = engine.setChapter(...args);
    if (result) { quizContext = null; syncPlace(); }
    return result;
  }
  return rejected('action');
}

export const story = {
  engine, bank, PLACES, LEVEL_NAMES, choicesFor, taskAt, syncPlace, act, invitationFor,
  workReport: (chapter, level) => evidence.report(chapter, level),
  get lastWorkReport() { return evidence.latest; },
  get revision() { return revision; }, get saveError() { return saveError; },
  get saveKey() { return SAVE_KEY; },
  get hasPreviousGame() { return !!previousGame(); },
  snapshot: () => copy(engine.snapshot())
};
story.ready = Promise.resolve(story);
window.UPPDRAG_STORY_STATE = story;
// Copy an eligible local save once. The earlier game's main/account saves and
// question-bank key are never updated. Recognition changes only on an explicit
// new-game or restore action, together with a backup of the current game.
syncPlace();
engine.save();
document.documentElement.dataset.story = 'ready';
window.dispatchEvent(new CustomEvent('uppdrag-story-ready'));
