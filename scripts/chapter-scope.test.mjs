// Portable regression for the chapter-one correction. Only Node built-ins are
// required; the two old canonical cards are read from the migration's archive.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createEngine, BANK_KEY, SAVE_KEY as LEGACY_KEY} from '../docs/world/engine.mjs';
import {createWorkEvidence} from '../docs/demo3/work-evidence.mjs';
import {historicalQuestion, reportIdsAllowed, CURRENT_MASTER_ID, RETIRED_MASTER_ID,
  RETIRED_FACT_ID, normalizeChapterScopeBank} from '../docs/demo3/chapter-scope.mjs';

const copy = value => JSON.parse(JSON.stringify(value));
const OWN_KEY = 'uppdrag1700.living-story.v1';
const PREVIOUS_KEY = 'uppdrag1700.living-story.previous.v1';
const KNOWN_KEY = 'uppdrag1700-known-people-v1';
const context = vm.createContext({window: {}, Date});
for (const file of ['classroom-curriculum.js', 'practice.js']) {
  vm.runInContext(fs.readFileSync(new URL('../docs/' + file, import.meta.url), 'utf8'), context, {filename: file});
}
const currentBank = copy(context.window.CLASSROOM_CURRICULUM);
const practice = context.window.UPPDRAG_PRACTICE;
function precedingBank() {
  const bank = copy(currentBank);
  for (const mission of bank.missions) mission.cards = mission.cards.filter(q => q.id !== CURRENT_MASTER_ID);
  for (const id of [RETIRED_FACT_ID, RETIRED_MASTER_ID]) {
    const question = historicalQuestion(id);
    bank.missions.find(mission => mission.id === question.missionId).cards.push(question);
  }
  const levels = bank.chapters.find(chapter => chapter.id === 1).levels;
  const facts = levels.find(level => level.level === 1).ids;
  facts.splice(facts.length - 1, 0, RETIRED_FACT_ID);
  levels.find(level => level.level === 3).ids = [RETIRED_MASTER_ID];
  return bank;
}
const oldBank = precedingBank();
function oldEngine() {
  let time = 1_760_000_000_000;
  const engine = createEngine({bank: copy(oldBank), practice, rng: () => .37, now: () => time++});
  return {engine, evidence: createWorkEvidence(engine)};
}
function beginLevel(engine, evidence) {
  const level = engine.level();
  assert(engine.arrive(level.giver).ok); assert(engine.accept(level.giver).ok);
  while (engine.active().phase === 'pickup') {
    const target = engine.target(); assert(engine.arrive(target).ok); assert(engine.pickup(target).ok);
  }
  assert(engine.arrive(level.work).ok); assert(engine.beginWork(level.work).ok); evidence.start();
}
function answerCurrent(engine, evidence, {wrong = false, options = false} = {}) {
  const question = engine.question(), quiz = engine.currentQuiz();
  assert(question, 'an actual current question exists');
  const response = question.type === 'short' ? question.answer : question.steps.map(step => step.answer);
  if (options) assert(engine.showOptions().ok);
  if (wrong) {
    const incorrect = question.type === 'short' ? 'ett felaktigt svar' : question.steps.map(step => step.options.find(value => value !== step.answer));
    assert.equal(engine.answer(incorrect).correct, false);
    if (quiz.kind === 'story') evidence.record(question.id, false, options || question.type === 'chain');
    assert(engine.retry());
  }
  const supported = options || !!quiz.hint || !!quiz.failed || question.type === 'chain';
  assert(engine.answer(response).correct);
  if (quiz.kind === 'story') evidence.record(question.id, true, supported);
}
function next(engine, evidence) {
  const quiz = engine.currentQuiz();
  const captured = quiz.kind === 'story' && quiz.index === quiz.ids.length - 1 ? evidence.capture() : null;
  const result = engine.nextQuestion(); assert(result.ok);
  if (captured && result.finished) evidence.finish(captured);
  return result;
}
function finishWork(engine, evidence, {mixed = false} = {}) {
  let count = 0;
  while (engine.currentQuiz()) {
    answerCurrent(engine, evidence, {wrong: mixed && count === 0, options: mixed && count === 1});
    next(engine, evidence); count++;
  }
}
function deliverLevel(engine, evidence) {
  while (engine.active().phase !== 'deliver') {
    const active = engine.active(), target = engine.target(); assert(engine.arrive(target).ok);
    if (active.phase === 'materials') {
      for (const material of ['ink', 'paper', 'type']) if (!engine.world().placed.includes(material)) assert(engine.placeMaterial(material));
      assert(engine.print());
    } else if (active.phase === 'handoff') assert(engine.handoff(target));
    else if (active.phase === 'puzzle') assert(engine.puzzle(engine.level().puzzle === 'finland' ? 'russia' : 'joined').correct);
    else assert.fail('unexpected delivery phase: ' + active.phase);
  }
  const chapter = engine.current().id, level = engine.active().level, target = engine.target();
  assert(engine.arrive(target).ok); assert(engine.deliver(target).ok); evidence.markDelivered(chapter, level);
}
function completedLevels(count) {
  const value = oldEngine();
  for (let level = 1; level <= count; level++) {
    beginLevel(value.engine, value.evidence); finishWork(value.engine, value.evidence, {mixed: level === 1});
    deliverLevel(value.engine, value.evidence);
  }
  return value;
}
function placeRetiredFact(engine, evidence, at) {
  const quiz = engine.currentQuiz(), ids = quiz.ids.filter(id => id !== RETIRED_FACT_ID);
  ids.splice(at === 'last' ? ids.length : at, 0, RETIRED_FACT_ID);
  quiz.ids = ids;
  engine.state.livingWorkLedger.sessions['1:1'].ids = [...ids];
}
function learning(snapshot) {
  return copy(Object.fromEntries(['answers', 'practice', 'history', 'coins', 'inventory', 'workSessions',
    'reviewHistory', 'completed', 'studied', 'gaps', 'careers', 'workshop', 'day', 'time'].map(key => [key, snapshot[key]])));
}
function progress(snapshot) {
  const world = snapshot.paperWorld;
  return {...learning(snapshot), chapter: world.chapter, unlocked: world.unlocked, jobs: copy(world.jobs),
    known: [...world.known], placed: [...world.placed], review: copy(world.review), effects: [...world.effects],
    livingWorkLedger: copy(snapshot.livingWorkLedger), livingQuestionScope: copy(snapshot.livingQuestionScope || null)};
}
let moduleNumber = 0;
async function loadAdapter({initial, imported = oldBank, legacy = initial, storage: existing} = {}) {
  const values = existing || new Map();
  if (!existing) {
    if (initial) values.set(OWN_KEY, JSON.stringify(initial));
    if (legacy) values.set(LEGACY_KEY, JSON.stringify(legacy));
    values.set(BANK_KEY, JSON.stringify(imported));
    values.set(KNOWN_KEY, ' {"print":true,"archive":true} ');
    values.set('uppdrag1700.account.fixture', 'leave account data unchanged');
  }
  const protectedValues = new Map([BANK_KEY, LEGACY_KEY, 'uppdrag1700.account.fixture'].map(key => [key, values.get(key)]));
  let physical = 'town', failKey = null;
  const savedGlobals = Object.fromEntries(['window', 'document', 'localStorage', 'CustomEvent'].map(key => [key, globalThis[key]]));
  globalThis.window = {CLASSROOM_CURRICULUM: copy(currentBank), UPPDRAG_PRACTICE: practice,
    dispatchEvent() {}, UPPDRAG_STORY_WORLD: {currentPlace: () => physical}};
  globalThis.document = {documentElement: {dataset: {}}};
  globalThis.CustomEvent = class { constructor(type, options) { this.type = type; this.detail = options?.detail; } };
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem(key, value) { if (key === failKey) throw new Error('test storage failure'); values.set(key, String(value)); },
    removeItem(key) { if (key === failKey) throw new Error('test storage failure'); values.delete(key); }
  };
  const {story} = await import(new URL('../docs/demo3/chapter-state.mjs?scope-test=' + ++moduleNumber, import.meta.url));
  return {story, storage: values,
    at(place) { physical = place; story.syncPlace(); },
    fail(key) { failKey = key; },
    close() {
      for (const [key, value] of protectedValues) assert.equal(values.get(key), value, key + ' must stay byte-identical');
      for (const [key, value] of Object.entries(savedGlobals)) {
        if (value === undefined) delete globalThis[key]; else globalThis[key] = value;
      }
    }};
}
function newPassIds(story) {
  const ids = story.engine.content.chapters.flatMap(chapter => chapter.levels.flatMap(level => level.ids));
  assert.equal(ids.length, 138); assert.equal(new Set(ids).size, 138);
  assert(!ids.includes(RETIRED_FACT_ID)); assert(!ids.includes(RETIRED_MASTER_ID));
  assert(!story.engine.content.cards.has(RETIRED_FACT_ID)); assert(!story.engine.content.cards.has(RETIRED_MASTER_ID));
  assert.deepEqual(story.engine.content.chapters[0].levels[2].ids, [CURRENT_MASTER_ID]);
}

test('fresh and cached official banks use 138 active questions without rewriting bank or legacy keys', async () => {
  const cached = copy(oldBank);
  cached.coverage.push({material: 'old scope', ids: [RETIRED_FACT_ID, RETIRED_MASTER_ID]});
  cached.assessments.push({id: 'old scope', ids: [RETIRED_FACT_ID, RETIRED_MASTER_ID]});
  const normalized = normalizeChapterScopeBank(cached, currentBank);
  assert.equal(normalized.bankId, oldBank.bankId);
  assert.equal(normalized.missions.flatMap(m => m.cards).length, 138);
  assert.equal(oldBank.missions.flatMap(m => m.cards).length, 139, 'normalization does not mutate its source');
  assert.deepEqual(normalized.coverage, currentBank.coverage);
  assert.deepEqual(normalized.assessments, currentBank.assessments);
  for (const current of currentBank.missions.flatMap(m => m.cards)) {
    const migrated = normalized.missions.flatMap(m => m.cards).find(q => q.id === current.id);
    assert.deepEqual(migrated, current, current.id);
  }
  const fixture = await loadAdapter();
  try {
    newPassIds(fixture.story);
    assert.equal(Object.keys(fixture.story.snapshot().answers).length, 0);
    assert.equal(fixture.story.snapshot().workSessions.length, 0);
    assert.equal(fixture.story.snapshot().reviewHistory.length, 0);
    for (const job of Object.values(fixture.story.engine.world().jobs)) assert.deepEqual(job, {done: 0, active: null});
  } finally { fixture.close(); }
});

test('old official source policy still refreshes reviewed choices while unknown policy and the cached bank stay intact', async () => {
  const oldPolicy = 'Varje post har egna källhänvisningar. Oklara eller öppna uppgifter rättas inte automatiskt.';
  const currentCards = currentBank.missions.flatMap(mission => mission.cards);
  const short = currentCards.find(question => question.type === 'short' && question.distractors?.length === 2);
  const chain = currentCards.find(question => question.type === 'chain' && question.id !== CURRENT_MASTER_ID);
  for (const policy of [oldPolicy, 'Lärarens egen källpolicy.']) {
    const cached = copy(oldBank); cached.sourcePolicy = policy;
    const cards = cached.missions.flatMap(mission => mission.cards);
    const oldShort = cards.find(question => question.id === short.id);
    const oldChain = cards.find(question => question.id === chain.id);
    delete oldShort.distractors;
    for (const step of oldChain.steps) step.options = [step.answer, 'Äldre alternativ A', 'Äldre alternativ B'];
    const raw = JSON.stringify(cached), fixture = await loadAdapter({imported: cached});
    try {
      const normalizedCards = fixture.story.bank.missions.flatMap(mission => mission.cards);
      const actualShort = normalizedCards.find(question => question.id === short.id);
      const actualChain = normalizedCards.find(question => question.id === chain.id);
      if (policy === oldPolicy) {
        assert.equal(fixture.story.bank.sourcePolicy, currentBank.sourcePolicy);
        assert.deepEqual(actualShort.distractors, short.distractors, 'missing official choices are restored');
        assert.deepEqual(actualChain.steps, chain.steps, 'older distractors are replaced while correct answers stay the same');
      } else {
        assert.equal(fixture.story.bank.sourcePolicy, policy, 'an unknown user policy is never promoted to official');
        assert.equal(actualShort.distractors, undefined);
        assert.deepEqual(actualChain.steps, oldChain.steps, 'the existing policy guard still protects nonofficial choices');
      }
      assert.equal(actualShort.question, oldShort.question); assert.equal(actualShort.answer, oldShort.answer);
      assert.equal(actualChain.question, oldChain.question);
      assert.deepEqual(actualChain.steps.map(step => step.answer), oldChain.steps.map(step => step.answer));
      assert.equal(fixture.storage.get(BANK_KEY), raw, 'the saved imported bank stays byte-identical');
    } finally { fixture.close(); }
  }
});

test('malformed saved quiz IDs still use the original engine validation and cannot crash migration', async () => {
  const {engine, evidence} = oldEngine(); beginLevel(engine, evidence);
  const before = engine.snapshot(); before.paperWorld.jobs[1].active.quiz.ids = 42;
  before.paperWorld.review = {ids: {invalid: true}, index: 0};
  const fixture = await loadAdapter({initial: before});
  try {
    assert.equal(fixture.story.engine.active().phase, 'work');
    assert.equal(fixture.story.engine.active().quiz, null);
    assert.equal(fixture.story.engine.world().review, null);
    assert.deepEqual(learning(fixture.story.snapshot()), learning(before));
    assert.equal(reportIdsAllowed([RETIRED_MASTER_ID], 1, 3, [CURRENT_MASTER_ID], 'another-bank'), false);
  } finally { fixture.close(); }
});

test('removing a future tsar preserves another question draft, feedback and per-pass first attempts across two reloads', async () => {
  for (const feedback of ['draft', 'wrong', 'correct']) {
    const {engine, evidence} = oldEngine(); beginLevel(engine, evidence); placeRetiredFact(engine, evidence, 'last');
    const id = engine.question().id;
    engine.currentQuiz().draft = ['mitt eget sparade svar'];
    if (feedback === 'wrong') {
      assert.equal(engine.answer('vet inte').correct, false); evidence.record(id, false, false);
    } else if (feedback === 'correct') answerCurrent(engine, evidence);
    const before = engine.snapshot(), oldQuiz = before.paperWorld.jobs[1].active.quiz;
    let fixture = await loadAdapter({initial: before});
    try {
      const quiz = fixture.story.engine.currentQuiz();
      assert.deepEqual(quiz.ids, oldQuiz.ids.filter(value => value !== RETIRED_FACT_ID));
      assert.equal(quiz.startedAt, oldQuiz.startedAt);
      for (const key of ['index', 'correct', 'draft', 'feedback']) assert.deepEqual(quiz[key], oldQuiz[key], feedback + ':' + key);
      assert.equal(quiz.hint, !!oldQuiz.hint); assert.equal(quiz.optionsShown, !!oldQuiz.optionsShown);
      assert.deepEqual(learning(fixture.story.snapshot()), learning(before));
      assert.deepEqual(fixture.story.snapshot().livingWorkLedger.sessions['1:1'].first, before.livingWorkLedger.sessions['1:1'].first);
      const first = progress(fixture.story.snapshot()), storage = fixture.storage; fixture.close(); fixture = null;
      fixture = await loadAdapter({storage});
      assert.deepEqual(progress(fixture.story.snapshot()), first, 'reloading is idempotent');
      newPassIds(fixture.story);
    } finally { fixture?.close(); }
  }
});

test('a current unassessed or wrong tsar is archived and removed without new credit or loss of recorded answers', async () => {
  for (const wrong of [false, true]) {
    const {engine, evidence} = oldEngine(); beginLevel(engine, evidence); placeRetiredFact(engine, evidence, 0);
    engine.currentQuiz().draft = ['sparat tsarutkast'];
    if (wrong) { assert.equal(engine.answer('kung').correct, false); evidence.record(RETIRED_FACT_ID, false, false); }
    const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
    try {
      assert.notEqual(fixture.story.engine.question().id, RETIRED_FACT_ID);
      const quiz = fixture.story.engine.currentQuiz();
      assert.equal(quiz.index, 0); assert.equal(quiz.correct, 0); assert.equal(quiz.ids.length, 11);
      assert.deepEqual(quiz.draft, []); assert.equal(quiz.feedback, null); assert.equal(quiz.hint, false);
      assert.deepEqual(learning(fixture.story.snapshot()), learning(before));
      const archived = Object.values(fixture.story.snapshot().livingQuestionScope.archives);
      assert.equal(archived.length, 1); assert.deepEqual(archived[0].quiz, before.paperWorld.jobs[1].active.quiz);
      assert(!fixture.story.snapshot().livingWorkLedger.sessions['1:1'].ids.includes(RETIRED_FACT_ID));
      assert(!fixture.story.snapshot().answers[CURRENT_MASTER_ID]);
    } finally { fixture.close(); }
  }
});

test('an already answered tsar remains historical evidence and is never displayed or selected again', async () => {
  const {engine, evidence} = oldEngine(); beginLevel(engine, evidence); placeRetiredFact(engine, evidence, 0);
  answerCurrent(engine, evidence);
  const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
  try {
    const story = fixture.story, migrated = story.snapshot();
    assert.equal(story.engine.currentQuiz().ids[0], RETIRED_FACT_ID);
    assert.equal(story.engine.currentQuiz().index, 1);
    assert.equal(story.engine.currentQuiz().correct, 1);
    assert.notEqual(story.engine.question().id, RETIRED_FACT_ID);
    assert.deepEqual(learning(migrated), learning(before));
    assert.deepEqual(migrated.livingWorkLedger.sessions['1:1'].first[RETIRED_FACT_ID], {correct: true, supported: false});
    newPassIds(story);
    assert(!story.engine.reviewIds().includes(RETIRED_FACT_ID));
  } finally { fixture.close(); }
});

test('retiring the final outstanding fact completes only the answered prefix using the original phase transition', async () => {
  for (const answeredTsar of [false, true]) {
    const {engine, evidence} = oldEngine(); beginLevel(engine, evidence); placeRetiredFact(engine, evidence, 'last');
    while (engine.question().id !== RETIRED_FACT_ID) { answerCurrent(engine, evidence); next(engine, evidence); }
    if (answeredTsar) answerCurrent(engine, evidence);
    const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
    try {
      const story = fixture.story;
      assert.equal(story.engine.active().phase, 'deliver'); assert.equal(story.engine.currentQuiz(), null);
      assert.deepEqual(learning(story.snapshot()), learning(before), 'no answer, money, stamp or learning score is added');
      const report = story.workReport(1, 1);
      assert.equal(report.total, answeredTsar ? 12 : 11);
      assert.equal(report.independent, report.total); assert.equal(report.unknown, 0); assert.equal(report.supported, 0);
      assert.equal(report.ids.includes(RETIRED_FACT_ID), answeredTsar);
      assert.equal(story.engine.progress().done, 0, 'the work still needs a real delivery');
      const recipient = story.engine.target();
      fixture.at(recipient); assert(story.act('deliver', recipient).ok); assert.equal(story.engine.progress().done, 1);
      assert.equal(story.workReport(1, 1).delivered, true);
      fixture.at('archive'); assert(story.act('beginGateExam').ok);
      assert(!story.engine.currentQuiz().ids.includes(RETIRED_FACT_ID));
    } finally { fixture.close(); }
  }
});

test('old review prefix, denominator, wrong-first score and chapter unlock remain intact', async () => {
  const {engine, evidence} = completedLevels(1);
  assert(engine.beginGateExam().ok);
  const remaining = engine.current().levels[0].ids.filter(id => id !== RETIRED_FACT_ID).slice(0, 4);
  engine.currentQuiz().ids = [RETIRED_FACT_ID, ...remaining];
  answerCurrent(engine, evidence); next(engine, evidence);
  answerCurrent(engine, evidence, {wrong: true}); next(engine, evidence);
  engine.currentQuiz().draft = ['mitt nästa svar'];
  const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
  try {
    const story = fixture.story, quiz = story.engine.world().review;
    assert.deepEqual(quiz.ids, before.paperWorld.review.ids); assert.equal(quiz.index, 2);
    assert.equal(quiz.correct, 1); assert.deepEqual(quiz.draft, ['mitt nästa svar']);
    assert.deepEqual(learning(story.snapshot()), learning(before));
    fixture.at('cafe'); assert.equal(story.act('beginGateExam').ok, false);
    fixture.at('archive'); assert(story.act('beginGateExam').ok);
    let result;
    while (story.engine.currentQuiz()) {
      const question = story.engine.question(); assert.notEqual(question.id, RETIRED_FACT_ID);
      assert(story.act('answer', question.answer).correct); result = story.act('nextQuestion'); assert(result.ok);
    }
    assert.equal(result.correct, 4); assert.equal(result.total, 5); assert.equal(result.passed, true);
    assert.equal(story.engine.world().unlocked, 2);
    assert.equal(story.snapshot().reviewHistory.at(-1).total, 5);
    assert(!story.engine.reviewIds().includes(RETIRED_FACT_ID));
  } finally { fixture.close(); }
});

test('a last removed review question preserves earned correct count and an empty retired-only review earns nothing', async () => {
  for (const onlyRetired of [false, true]) {
    const {engine, evidence} = completedLevels(1); assert(engine.beginReview().ok);
    const other = engine.current().levels[0].ids.filter(id => id !== RETIRED_FACT_ID).slice(0, 4);
    engine.currentQuiz().ids = onlyRetired ? [RETIRED_FACT_ID] : [...other, RETIRED_FACT_ID];
    if (!onlyRetired) {
      for (let index = 0; index < other.length; index++) {
        answerCurrent(engine, evidence, {wrong: index === 0}); next(engine, evidence);
      }
    }
    const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
    try {
      const raw = fixture.story.snapshot(); assert.equal(raw.paperWorld.review, null);
      assert.deepEqual(raw.answers, before.answers); assert.deepEqual(raw.practice, before.practice); assert.deepEqual(raw.history, before.history);
      if (onlyRetired) {
        assert.deepEqual(learning(raw), learning(before));
        assert.equal(raw.paperWorld.unlocked, before.paperWorld.unlocked);
      } else {
        assert.equal(raw.reviewHistory.length, before.reviewHistory.length + 1);
        assert.deepEqual({correct: raw.reviewHistory.at(-1).correct, total: raw.reviewHistory.at(-1).total}, {correct: 3, total: 4});
        assert.equal(raw.coins, before.coins + 1, 'the original 70-percent review rule awards exactly one coin');
        assert.equal(raw.inventory.apple, before.inventory.apple + 1);
      }
    } finally { fixture.close(); }
  }
});

test('paused old master drafts and feedback are archived before a new explicitly started assessment', async () => {
  for (const feedback of [false, true]) {
    const {engine, evidence} = completedLevels(2); beginLevel(engine, evidence);
    const old = engine.question(); assert.equal(old.id, RETIRED_MASTER_ID); assert(engine.showOptions().ok);
    assert(engine.setDraft(0, old.steps[0].answer)); assert(engine.setDraft(1, old.steps[1].answer));
    if (feedback) { assert(engine.setDraft(2, old.steps[2].answer)); answerCurrent(engine, evidence); }
    const before = engine.snapshot(), fixture = await loadAdapter({initial: before});
    try {
      const story = fixture.story;
      assert.equal(story.engine.active().phase, 'work'); assert.equal(story.engine.currentQuiz(), null);
      assert(story.curriculumNotice?.includes('Ditt tidigare svar och utkast finns sparade'));
      assert.deepEqual(learning(story.snapshot()), learning(before));
      assert(!story.snapshot().answers[CURRENT_MASTER_ID]);
      const archive = Object.values(story.snapshot().livingQuestionScope.archives).find(value => value.reason === 'master-replaced');
      assert.deepEqual(archive.quiz, before.paperWorld.jobs[1].active.quiz);
      assert.deepEqual(archive.session, before.livingWorkLedger.sessions['1:3']);
      assert.equal(story.snapshot().livingWorkLedger.sessions['1:3'], undefined);
      fixture.at('cafe'); assert.equal(story.act('beginWork', 'cafe').ok, false);
      assert.equal(story.engine.currentQuiz(), null, 'arrival and the wrong place cannot begin the new assessment');
      fixture.at(story.engine.level().work); assert(story.act('beginWork', story.engine.level().work).ok);
      assert.deepEqual(story.engine.currentQuiz().ids, [CURRENT_MASTER_ID]); assert.deepEqual(story.engine.currentQuiz().draft, []);
      assert.equal(story.engine.question().steps[1].answer, 'på särskilda möten utan bönderna');
      assert.deepEqual(story.snapshot().livingWorkLedger.sessions['1:3'].first, {});
      assert(!story.snapshot().answers[CURRENT_MASTER_ID]);
      assert.equal(story.curriculumNotice, null);
    } finally { fixture.close(); }
  }
});

test('completed old work reports keep their original question texts, real outcomes and delivered stamps', async () => {
  const {engine, evidence} = completedLevels(3), before = engine.snapshot();
  const fixture = await loadAdapter({initial: before});
  try {
    const story = fixture.story; assert.equal(story.engine.progress().done, 3);
    assert.deepEqual(learning(story.snapshot()), learning(before));
    assert.deepEqual(story.engine.world().effects, before.paperWorld.effects);
    for (const level of [1, 2, 3]) assert.deepEqual(story.workReport(1, level), before.livingWorkLedger.reports['1:' + level]);
    const facts = story.workReport(1, 1), master = story.workReport(1, 3);
    assert.equal(facts.total, 12); assert.equal(facts.supported, 2); assert.equal(facts.independent, 10);
    assert.deepEqual(master.ids, [RETIRED_MASTER_ID]); assert.equal(master.supported, 1); assert(master.delivered);
    assert.equal(story.questionForReport(RETIRED_FACT_ID, facts).answer, 'Tsar');
    const old = story.questionForReport(RETIRED_MASTER_ID, master);
    assert.equal(old.steps[1].connector, 'Men kvinnor fick');
    assert.equal(old.steps[1].answer, 'fortfarande inte bestämma fritt över sig själva');
    old.steps[1].answer = 'mutated by reader';
    assert.notEqual(story.questionForReport(RETIRED_MASTER_ID, master).steps[1].answer, old.steps[1].answer);
    assert.equal(story.questionForReport(CURRENT_MASTER_ID, master), null, 'a new question is not substituted into an old report');
    assert(!story.snapshot().answers[CURRENT_MASTER_ID]);
    assert.equal(reportIdsAllowed([RETIRED_MASTER_ID, CURRENT_MASTER_ID], 1, 3, [CURRENT_MASTER_ID]), false);
    assert.equal(reportIdsAllowed(facts.ids, 2, 1, story.engine.content.chapters[1].levels[0].ids), false);
    newPassIds(story);
  } finally { fixture.close(); }
});

test('backup, reset, restore and denied writes preserve the migrated journey and never reimport the legacy game', async () => {
  const {engine, evidence} = completedLevels(2); beginLevel(engine, evidence);
  assert(engine.showOptions().ok); assert(engine.setDraft(0, engine.question().steps[0].answer));
  let fixture = await loadAdapter({initial: engine.snapshot()});
  try {
    const before = progress(fixture.story.snapshot()), bankBefore = fixture.storage.get(BANK_KEY), legacyBefore = fixture.storage.get(LEGACY_KEY);
    fixture.fail(OWN_KEY);
    assert.deepEqual(fixture.story.act('newGame'), {ok: false, reason: 'save'});
    assert.deepEqual(progress(fixture.story.snapshot()), before);
    assert.equal(fixture.storage.has(PREVIOUS_KEY), false, 'the successful backup write is rolled back after a denied current-save write');
    fixture.fail(null);
    assert.deepEqual(fixture.story.act('newGame'), {ok: true, reload: true});
    assert.equal(Object.keys(fixture.story.snapshot().answers).length, 0); assert.equal(fixture.story.engine.progress().done, 0);
    assert.deepEqual(progress(JSON.parse(fixture.storage.get(PREVIOUS_KEY)).game), before);
    assert.equal(JSON.parse(fixture.storage.get(OWN_KEY)).version, 2);
    assert.equal(fixture.story.act('newGame').reason, 'reload');
    const current = fixture.storage.get(OWN_KEY); fixture.story.engine.save(); assert.equal(fixture.storage.get(OWN_KEY), current);
    const storage = fixture.storage; fixture.close(); fixture = null;
    fixture = await loadAdapter({storage});
    assert.equal(fixture.story.engine.progress().done, 0); assert.equal(Object.keys(fixture.story.snapshot().answers).length, 0);
    assert.deepEqual(fixture.story.act('restorePreviousGame'), {ok: true, reload: true});
    assert.deepEqual(progress(fixture.story.snapshot()), before);
    assert.equal(fixture.storage.get(BANK_KEY), bankBefore); assert.equal(fixture.storage.get(LEGACY_KEY), legacyBefore);
    const restoredStorage = fixture.storage; fixture.close(); fixture = null;
    fixture = await loadAdapter({storage: restoredStorage});
    assert.deepEqual(progress(fixture.story.snapshot()), before);
    assert.equal(Object.keys(fixture.story.snapshot().livingQuestionScope.archives).length, 1, 'restores do not duplicate or discard the original draft archive');
  } finally { fixture?.close(); }
});
