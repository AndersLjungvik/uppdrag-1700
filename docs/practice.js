'use strict';
(() => {
  const DAY = 86400000;
  const intervals = [1, 3, 7, 14, 30];
  window.UPPDRAG_PRACTICE = {
    visit(value, now = Date.now()) {
      return {...value, firstVisitAt: value?.firstVisitAt ?? now, lastVisitAt: now,
        previousVisitAt: value?.lastVisitAt ?? null};
    },
    review(previous, correct, supported, now = Date.now()) {
      const old = previous || {};
      // Same-session repeats do not advance the spacing level.
      const advances = correct && !supported && (old.lastReviewedAt == null || now - old.lastReviewedAt >= DAY);
      const level = !correct ? 0 : advances ? Math.min((old.level || 0) + 1, intervals.length) : old.level || 0;
      const days = intervals[Math.max(0, level - 1)];
      return {...old, level, lastReviewedAt: now, lastCorrect: correct, supported,
        nextDueAt: !correct ? now + DAY : advances || !old.nextDueAt ? now + days * DAY : old.nextDueAt};
    },
    due(practice, allowedIds, now = Date.now()) {
      const allowed = new Set(allowedIds);
      return Object.entries(practice || {}).filter(([id, p]) => allowed.has(id) && p.nextDueAt <= now)
        .sort((a, b) => a[1].nextDueAt - b[1].nextDueAt).map(([id]) => id);
    }
  };
})();
