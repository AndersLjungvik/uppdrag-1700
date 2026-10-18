// A completed work sheet records this pass, independently of lifetime totals.
// This ledger never grades answers, awards money or changes chapter progression.
const clone = value => JSON.parse(JSON.stringify(value));
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const keyOf = (chapter, level) => `${chapter}:${level}`;
const timestamp = value => Number.isFinite(value) && value >= 0;

export function createWorkEvidence(engine) {
  const bankId = engine.content.bank.bankId;
  const previous = object(engine.state.livingWorkLedger);
  const ledger = {version: 1, bankId, sessions: {}, reports: {}, lastKey: null};
  const compatible = previous.version === 1 && previous.bankId === bankId;
  const validIds = (ids, level) => Array.isArray(ids) && ids.length === level.ids.length &&
    new Set(ids).size === ids.length && ids.every(id => level.ids.includes(id));
  const firstAnswers = (raw, ids) => {
    const source = object(raw), clean = {};
    for (const id of ids) {
      const answer = object(source[id]);
      if (typeof answer.correct === 'boolean' && typeof answer.supported === 'boolean') {
        // Building from visible parts always provides recognition support.
        clean[id] = {correct: answer.correct, supported: answer.supported || engine.content.cards.get(id)?.type === 'chain'};
      }
    }
    return clean;
  };
  const totals = (ids, first) => {
    let independent = 0, supported = 0, unknown = 0;
    for (const id of ids) {
      const answer = first[id];
      if (!answer) unknown++;
      else if (answer.correct && !answer.supported) independent++;
      else supported++;
    }
    return {total: ids.length, independent, supported, unknown};
  };

  if (compatible) for (const chapter of engine.content.chapters) for (const level of chapter.levels) {
    const key = keyOf(chapter.id, level.level);
    const active = engine.world().jobs[chapter.id]?.active;
    const rawSession = object(object(previous.sessions)[key]);
    if (active?.level === level.level && active.phase === 'work' && active.quiz &&
        rawSession.startedAt === active.quiz.startedAt && validIds(rawSession.ids, level) &&
        rawSession.ids.every((id, index) => id === active.quiz.ids[index])) {
      ledger.sessions[key] = {chapter: chapter.id, level: level.level, startedAt: rawSession.startedAt,
        ids: [...rawSession.ids], first: firstAnswers(rawSession.first, rawSession.ids), repeat: active.repeat === true};
    }
    const rawReport = object(object(previous.reports)[key]);
    const done = engine.world().jobs[chapter.id]?.done || 0;
    const eligible = done >= level.level || (active?.level === level.level && !['pickup', 'work'].includes(active.phase));
    if (eligible && validIds(rawReport.ids, level) && timestamp(rawReport.startedAt) &&
        timestamp(rawReport.finishedAt) && rawReport.finishedAt >= rawReport.startedAt) {
      const first = firstAnswers(rawReport.first, rawReport.ids);
      ledger.reports[key] = {chapter: chapter.id, level: level.level, ids: [...rawReport.ids], first,
        ...totals(rawReport.ids, first), startedAt: rawReport.startedAt, finishedAt: rawReport.finishedAt,
        delivered: rawReport.delivered === true, repeat: rawReport.repeat === true};
    }
  }
  ledger.lastKey = Object.entries(ledger.reports).sort((a, b) => b[1].finishedAt - a[1].finishedAt)[0]?.[0] || null;
  engine.state.livingWorkLedger = ledger;

  function start() {
    const quiz = engine.currentQuiz(), active = engine.active();
    if (quiz?.kind !== 'story' || !active || active.phase !== 'work') return null;
    const chapter = engine.current().id, level = active.level, key = keyOf(chapter, level);
    let session = ledger.sessions[key];
    if (!session || session.startedAt !== quiz.startedAt || session.ids.length !== quiz.ids.length ||
        session.ids.some((id, index) => id !== quiz.ids[index])) {
      // An older in-progress save has no reliable per-pass first attempts.
      // Keep those entries unknown; do not infer them from lifetime scores.
      session = {chapter, level, ids: [...quiz.ids], first: {}, startedAt: quiz.startedAt, repeat: active.repeat === true};
      ledger.sessions[key] = session;
    }
    return session;
  }
  function record(id, correct, supported) {
    const session = start();
    if (!session || !session.ids.includes(id) || session.first[id]) return false;
    session.first[id] = {correct: correct === true, supported: supported === true || engine.content.cards.get(id)?.type === 'chain'};
    return true;
  }
  function capture() {
    const session = start();
    return session ? clone(session) : null;
  }
  function finish(session) {
    if (!session) return null;
    const key = keyOf(session.chapter, session.level);
    const report = {...session, ...totals(session.ids, session.first),
      finishedAt: Math.max(Date.now(), session.startedAt), delivered: false};
    ledger.reports[key] = report;
    ledger.lastKey = key;
    delete ledger.sessions[key];
    return clone(report);
  }
  function markDelivered(chapter, level) {
    const report = ledger.reports[keyOf(chapter, level)];
    if (!report) return null;
    report.delivered = true;
    return clone(report);
  }
  function cancel(chapter, level) { delete ledger.sessions[keyOf(chapter, level)]; }
  function report(chapter, level) {
    const value = ledger.reports[keyOf(chapter, level)];
    return value ? clone(value) : null;
  }
  return {start, record, capture, finish, markDelivered, cancel, report,
    get latest() { return ledger.lastKey ? clone(ledger.reports[ledger.lastKey]) : null; }};
}
