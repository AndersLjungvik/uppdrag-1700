# Independent classroom practice · 2.31.1

The existing 6A/6B links (versions 2.7.1 and 2.9.0) and `only=4` default to
independent practice. Chapters 1–4 remain freely selectable; 5–10 stay closed.
Objective answers retain the existing automatic checks. An unmatched open
answer shows the pupil's answer, criteria and example, then lets the pupil edit
for free or choose “Jag har jämfört – fortsätt”. No teacher code is required.

Comparisons are recorded as `assessment: self-checked-practice`, `ok: false`,
`practised: true`, `support: true`, `independent: false`. They count towards
progress in the practice copy, without being represented as teacher approval
or independently verified knowledge. Supported correct master answers no longer
create a teacher-review block in this mode. Genuine saved pending reviews also
offer comparison and continuation, retaining the answer and its history.

The shared 3.2 language layer covers familiar spelling errors from all four
chapters, including subject terms in the chapter-4 book additions. It also
recognises bounded object-first clauses about power and scientists. It keeps
all actors, numbers and negations, rather than matching an unordered word set.
The outer language pass is installed after chapter-specific assessment modules,
so those modules receive the same support. Original answer text is unchanged.
Unknown wording still takes the explicit comparison route without a teacher.

Practice uses the existing storage contract under the separate
`uppdrag1700.integrated.20261023.v1.self-practice.` prefix. On first entry the
matching original round's values are copied exactly, including draft answers,
reviews, stamps, resources, side adventures and last chapter. A seed marker
prevents reloads from overwriting newer practice. The original round is never
rewritten. `practice=0` explicitly opens the original assessed round; ordinary
unrestricted and teacher views keep their previous behavior unless `practice=1`
is supplied. Exports identify their mode, and a practice export cannot be
imported as an assessed save.

`tests/self-practice.cjs` executes the actual question bank, assessment,
transformed recall flow, alignment/language pass and chapter engines. It covers
all areas and all three levels, saved pending reviews, free revision, repeated
clicks, legacy-link seeding, reload, unchanged original saves and the chapter
limit. Assessed-mode regressions run explicitly with `practice=0`.
`tests/language-consistency.cjs` covers 35 real-task spelling variants across
chapters 1–4, reordered clauses, reversed power, swapped scientists, negation,
dates and preservation of original drafts.

The parent readiness handshake accepts assessment 3.2.0. Its actual callback
is executed against all four chapter engines by the language regression.
