// Chapter-one scope correction. Retired cards are read-only historical sources;
// they never enter a new work sheet, review, choice list or chapter assignment.
const clone = value => JSON.parse(JSON.stringify(value));
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export const SCOPE_BANK_ID = 'sos-classroom-2026-10-16-v1';
export const SCOPE_REVISION = 'chapter-one-2026-10-18';
export const RETIRED_FACT_ID = 'sos-tsar';
export const RETIRED_MASTER_ID = 'sos-frihet-olika';
export const CURRENT_MASTER_ID = 'sos-frihet-maktfordelning';
const RETIRED = new Set([RETIRED_FACT_ID, RETIRED_MASTER_ID]);
// Exact question objects from the preceding official bank, before its correction.
const ORIGINAL_QUESTIONS = {
  "sos-tsar": {
    "id": "sos-tsar",
    "storyChapter": 1,
    "level": 1,
    "chapter": 1,
    "type": "short",
    "question": "Vilken rysk titel motsvarar kejsare?",
    "simpleQuestion": "Vilken rysk titel motsvarar kejsare?",
    "answer": "Tsar",
    "accept": [
      "Tsar"
    ],
    "explanation": "Tsar.",
    "references": [
      {
        "source": "P1",
        "location": "1a"
      }
    ],
    "concept": null,
    "origin": "bearbetning av klassrumsmaterial",
    "missionId": "power",
    "bookReference": "Prov – 1700-talets Sverige del 1 · 1a",
    "distractors": [
      "Sultan",
      "Storfurste"
    ]
  },
  "sos-frihet-olika": {
    "id": "sos-frihet-olika",
    "storyChapter": 1,
    "level": 3,
    "chapter": 1,
    "type": "chain",
    "stage": "master",
    "question": "Pröva påståendet: Under frihetstiden blev alla lika fria.",
    "simpleQuestion": "Pröva påståendet: Under frihetstiden blev alla lika fria.",
    "steps": [
      {
        "connector": "Kungen fick",
        "answer": "mindre makt",
        "options": [
          "mindre makt",
          "större makt över riksdagen",
          "rätt att styra utan riksrådet"
        ]
      },
      {
        "connector": "Men kvinnor fick",
        "answer": "fortfarande inte bestämma fritt över sig själva",
        "options": [
          "fortfarande inte bestämma fritt över sig själva",
          "rösta i riksdagen genom ett eget stånd",
          "välja riksrådets ledamöter"
        ]
      },
      {
        "connector": "Och bönderna fick",
        "answer": "inte välja riksrådets medlemmar",
        "options": [
          "inte välja riksrådets medlemmar",
          "utse riksrådets medlemmar",
          "bestämma över de andra ståndens röster"
        ]
      }
    ],
    "requires": [
      "sos-bonder-inflytande",
      "sos-riksdag"
    ],
    "explanation": "Kungen fick mindre makt. Men kvinnor fick fortfarande inte bestämma fritt över sig själva. Och bönderna fick inte välja riksrådets medlemmar.",
    "references": [
      {
        "source": "F1",
        "location": "1–2"
      },
      {
        "source": "LL",
        "location": "1"
      },
      {
        "source": "L2",
        "location": "Man bestämde över kvinnor och barn"
      },
      {
        "source": "AB",
        "location": "5"
      }
    ],
    "origin": "byggsvar utifrån klassrumsmaterial",
    "missionId": "power",
    "bookReference": "Bedömningsstöd del 1 · 1–2; Bra att veta – 1700-talets Sverige · 1; Lärarguide – Fria och ofria · Man bestämde över kvinnor och barn; Elevernas arbetsbok s. 24–39 · 5"
  }
};
const ORIGINAL_FACT_IDS = ["sos-frihetstid", "sos-riksdag", "sos-riksrad", "sos-grundlag", "sos-stand", "sos-bonder-inflytande", "sos-kompani", "sos-kina", "sos-goteborg", "sos-kompanivaror", "sos-tsar", "sos-grundlag-svarandrad"];

export function historicalQuestion(id) {
  return Object.hasOwn(ORIGINAL_QUESTIONS, id) ? clone(ORIGINAL_QUESTIONS[id]) : null;
}
const sameIds = (ids, allowed) => Array.isArray(ids) && ids.length === allowed.length &&
  new Set(ids).size === ids.length && ids.every(id => allowed.includes(id));

export function reportIdsAllowed(ids, chapter, level, currentIds, bankId = SCOPE_BANK_ID) {
  if (sameIds(ids, currentIds)) return true;
  if (bankId !== SCOPE_BANK_ID || chapter !== 1) return false;
  return level === 1 ? sameIds(ids, ORIGINAL_FACT_IDS)
    : level === 3 && sameIds(ids, [RETIRED_MASTER_ID]);
}

export function questionForReport(engine, id, report) {
  if (!Array.isArray(report?.ids) || !report.ids.includes(id)) return null;
  const question = historicalQuestion(id) || engine.content.cards.get(id);
  return question ? clone(question) : null;
}

export function normalizeChapterScopeBank(selected, official) {
  const bank = clone(selected);
  if (bank.bankId !== SCOPE_BANK_ID) return bank;
  // Recognize only the previous official wording, so its identical questions
  // still receive reviewed choices through the adapter's policy guard.
  if (bank.sourcePolicy === 'Varje post har egna källhänvisningar. Oklara eller öppna uppgifter rättas inte automatiskt.') {
    bank.sourcePolicy = official.sourcePolicy;
  }
  const sourceMission = official.missions.find(mission => mission.cards.some(q => q.id === CURRENT_MASTER_ID));
  const replacement = sourceMission?.cards.find(q => q.id === CURRENT_MASTER_ID);
  if (!replacement) throw new Error('Det uppdaterade kapitelunderlaget kunde inte läsas in.');
  // Cached official source/assessment indexes must describe the revised active
  // questions too. The stored imported bank itself is left byte-for-byte intact.
  for (const key of ['coverage', 'assessments']) if (Array.isArray(official[key])) bank[key] = clone(official[key]);
  for (const mission of bank.missions) {
    mission.cards = mission.cards.filter(q => !RETIRED.has(q.id) && q.id !== CURRENT_MASTER_ID);
    if (mission.id === sourceMission.id) mission.cards.push(clone(replacement));
  }
  if (!Array.isArray(bank.chapters)) bank.chapters = clone(official.chapters);
  for (const chapter of bank.chapters) for (const level of chapter.levels || []) {
    level.ids = [...new Set((level.ids || []).filter(id => id !== RETIRED_FACT_ID)
      .map(id => id === RETIRED_MASTER_ID ? CURRENT_MASTER_ID : id))];
  }
  // This bank's revised master question belongs only to chapter one. Explicit
  // assignment also prevents the old content builder's unassigned-card fallback.
  for (const chapter of bank.chapters) for (const level of chapter.levels || []) {
    if (chapter.id === 1 && level.level === 3) {
      if (!level.ids.includes(CURRENT_MASTER_ID)) level.ids.push(CURRENT_MASTER_ID);
    } else level.ids = level.ids.filter(id => id !== CURRENT_MASTER_ID);
  }
  return bank;
}

function validQuiz(quiz, allowed) {
  return quiz && Array.isArray(quiz.ids) && quiz.ids.length > 0 && quiz.ids.length <= 100 &&
    new Set(quiz.ids).size === quiz.ids.length && quiz.ids.every(id => allowed.has(id)) &&
    Number.isInteger(quiz.index) && quiz.index >= 0 && quiz.index < quiz.ids.length;
}
function resetQuestion(quiz) {
  quiz.feedback = null; quiz.hint = false; quiz.failed = false;
  quiz.optionsShown = false; quiz.draft = []; delete quiz.clue;
}

// Work on a copy before the original engine validates its ordinary state. The
// old answers/practice/history, completed work, stamps and rewards are untouched.
export function migrateChapterScopeSave(source, bank) {
  const completions = [];
  if (source?.version !== 2 || source.bankId !== SCOPE_BANK_ID || bank.bankId !== SCOPE_BANK_ID) {
    return {initial: source, completions};
  }
  const initial = clone(source), previous = object(initial.livingQuestionScope);
  const scope = previous.version === 1 && previous.bankId === bank.bankId
    ? clone(previous) : {version: 1, bankId: bank.bankId, archives: {}, notices: {}};
  scope.archives = object(scope.archives); scope.notices = object(scope.notices);
  scope.revision = SCOPE_REVISION;
  initial.livingQuestionScope = scope;
  const cards = new Set(bank.missions.flatMap(m => m.cards.map(q => q.id)));
  const compatibleCards = new Set([...cards, ...RETIRED]);
  const ledger = object(initial.livingWorkLedger);
  const sessions = object(ledger.sessions);
  const world = object(initial.paperWorld);

  function archive(quiz, context, reason, session) {
    const key = [context.kind, context.chapter || 0, context.level || 0, quiz.startedAt || 0, reason].join(':');
    if (!Object.hasOwn(scope.archives, key)) {
      scope.archives[key] = {...context, reason, quiz: clone(quiz), session: session ? clone(session) : null};
    }
    scope.notices[context.kind === 'story' ? context.chapter + ':' + context.level : 'review'] = reason;
  }
  function migrateQuiz(quiz, context, allowed, session) {
    if (!validQuiz(quiz, allowed) || !quiz.ids.some(id => RETIRED.has(id))) return quiz;
    const currentId = quiz.ids[quiz.index];
    // A changed assessment is never answered with the previous middle choice.
    // The complete old pass and its first-attempt evidence stay in the archive.
    if (context.kind === 'story' && context.chapter === 1 && context.level === 3 &&
        quiz.ids.includes(RETIRED_MASTER_ID)) {
      archive(quiz, context, 'master-replaced', session);
      delete sessions['1:3'];
      return null;
    }
    const answeredCurrent = RETIRED.has(currentId) && quiz.feedback?.question === currentId && quiz.feedback.correct === true;
    const kept = quiz.ids.filter((id, index) => !RETIRED.has(id) || index < quiz.index || index === quiz.index && answeredCurrent);
    const removed = kept.length !== quiz.ids.length;
    if (!removed && !answeredCurrent) return quiz; // Completed historical prefix only.
    archive(quiz, context, 'retired-question', session);
    if (!kept.length) return null; // No assessment remains: no result or reward is manufactured.
    const next = clone(quiz);
    next.ids = kept;
    if (session && Array.isArray(session.ids) && session.ids.length === quiz.ids.length &&
        session.ids.every((id, index) => id === quiz.ids[index])) {
      session.ids = [...kept];
      session.first = Object.fromEntries(Object.entries(object(session.first)).filter(([id]) => kept.includes(id)));
    }
    if (RETIRED.has(currentId) && !answeredCurrent) {
      next.index = quiz.ids.slice(0, quiz.index).filter(id => kept.includes(id)).length;
      resetQuestion(next);
      if (next.index === kept.length) {
        // Reaching index N proves the preceding N questions were already
        // answered correctly: only nextQuestion can advance the original quiz.
        // Acknowledge that already completed prefix internally, then let the
        // original nextQuestion/finishReview compute the unchanged grading rule.
        // This is never shown, never passed to answer(), and records no answer.
        next.index = kept.length - 1;
        next.feedback = {question: kept[next.index], correct: true, explanation: ''};
        completions.push({...context, ids: [...kept], index: next.index});
      }
    } else if (answeredCurrent) {
      // This feedback is a real saved correct answer. Advance it before any UI
      // can show the retired prompt again, preserving its original score.
      completions.push({...context, ids: [...kept], index: next.index});
    }
    return next;
  }

  for (const [chapterKey, job] of Object.entries(object(world.jobs))) {
    const chapter = Number(chapterKey), active = job?.active;
    if (!active || active.phase !== 'work' || ![1, 3].includes(active.level) || chapter !== 1) continue;
    const level = active.level;
    const allowed = new Set(level === 1 ? ORIGINAL_FACT_IDS : [RETIRED_MASTER_ID, CURRENT_MASTER_ID]);
    const key = chapter + ':' + level;
    active.quiz = migrateQuiz(active.quiz, {kind: 'story', chapter, level}, allowed, sessions[key]);
    if (!active.quiz) delete sessions[key];
  }
  if (world.review) {
    world.review = migrateQuiz(world.review, {kind: 'review', chapter: world.chapter || 1}, compatibleCards);
    if (!world.review && world.workMode !== 'story') { world.workMode = 'story'; world.screen = 'place'; }
  }
  // The original engine also accepts these older pre-paper-world save fields.
  if (!initial.paperWorld) for (const name of ['rehearsal', 'working']) {
    if (initial[name]) initial[name] = migrateQuiz(initial[name], {kind: 'review', chapter: 1}, compatibleCards);
  }
  return {initial, completions};
}

// The original restore rejects a whole quiz if any historical prefix ID is
// absent. Add trusted originals for that validation only, then strip them from
// all runtime cards and assignments before the engine reaches the interface.
export function chapterScopeRestoreBank(bank, initial) {
  const retired = new Set();
  function inspect(quiz) {
    for (const id of Array.isArray(quiz?.ids) ? quiz.ids : []) if (RETIRED.has(id)) retired.add(id);
  }
  for (const job of Object.values(object(initial?.paperWorld?.jobs))) inspect(job?.active?.quiz);
  inspect(initial?.paperWorld?.review); inspect(initial?.rehearsal); inspect(initial?.working);
  if (!retired.size || initial?.bankId !== bank.bankId) return bank;
  const compatible = clone(bank);
  for (const id of retired) {
    const card = historicalQuestion(id);
    const mission = compatible.missions.find(m => m.id === card.missionId);
    const level = compatible.chapters.find(c => c.id === 1)?.levels.find(l => l.level === card.level);
    if (mission && level) { mission.cards.push(card); level.ids.push(id); }
  }
  return compatible;
}

export function removeRetiredRuntimeQuestions(engine, activeBank) {
  for (const id of RETIRED) engine.content.cards.delete(id);
  for (const chapter of engine.content.chapters) for (const level of chapter.levels) {
    level.ids = level.ids.filter(id => !RETIRED.has(id));
  }
  engine.content.bank = activeBank;
}

export function completeMigratedQuizzes(engine, evidence, completions) {
  const world = engine.world();
  for (const completion of completions) {
    const quiz = completion.kind === 'story' ? world.jobs[completion.chapter]?.active?.quiz : world.review;
    if (!quiz?.feedback?.correct || quiz.index !== completion.index ||
        quiz.ids.length !== completion.ids.length || quiz.ids.some((id, index) => id !== completion.ids[index])) continue;
    const context = {chapter: world.chapter, workMode: world.workMode, screen: world.screen};
    const wasCurrent = completion.kind === 'story'
      ? context.chapter === completion.chapter && context.workMode === 'story' : context.workMode !== 'story';
    if (completion.kind === 'story') { world.chapter = completion.chapter; world.workMode = 'story'; }
    else world.workMode = quiz.kind;
    const captured = completion.kind === 'story' && quiz.index === quiz.ids.length - 1 ? evidence.capture() : null;
    const result = engine.nextQuestion();
    if (captured && result?.finished) evidence.finish(captured);
    world.chapter = context.chapter;
    if (!wasCurrent) { world.workMode = context.workMode; world.screen = context.screen; }
  }
}

export function curriculumNotice(engine) {
  const scope = object(engine.state.livingQuestionScope), active = engine.active();
  if (scope.version !== 1 || scope.bankId !== engine.content.bank.bankId) return null;
  const reason = object(scope.notices)[engine.current().id + ':' + active?.level];
  if (active?.phase === 'work' && reason === 'master-replaced' && !active.quiz) {
    return 'Frågan har anpassats till det här kapitlet. Ditt tidigare svar och utkast finns sparade. Pröva den nya frågan när du är redo.';
  }
  if (active?.phase === 'work' && reason === 'retired-question' || engine.world().review && object(scope.notices).review) {
    return 'En fråga som hörde till annat underlag har tagits bort. Dina tidigare svar och din spelresa finns kvar.';
  }
  return null;
}
