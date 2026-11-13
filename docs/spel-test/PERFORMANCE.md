# Rendering optimisation · 2.30.0

The released classroom game keeps its existing questions, movement, encounters,
chapter limits and storage keys. Rendering changes apply to mastery chapters 1–5.

- Room conversations keep their measured paper bubble while the line, people,
  replies and viewport stay in place. This removes repeated width changes and
  forced browser layouts during a stationary conversation. New text, any room
  actor's pose, replies, resize and loaded fonts invalidate the placement.
- Do not repaint room figures while the question workspace hides the room.
  Keep the room pending for a fresh paint when the pupil returns.
- Reuse exact rendered pixels for room close-ups behind study/status screens.
  The cache holds at most two scenes and 24 MiB; size, pixel density and loaded
  paper/room materials invalidate it. Question and answer text is never cached.
- Do not paint people, crowds, hens or the paddock outside the visible canvas.
  Margins include silhouettes, followers, weapons and animal movement. Dog path
  updates and collision reactions still run before their drawing is culled.
- Reuse the existing paper NPC drawings in a bounded 256-sprite cache. Sprites
  retain the original painter, double resolution, continuous positions/headings
  and sixteen walking poses. All poses share one material painter. Loading new
  paper material invalidates the cache. Player headwear keeps its original path.
- Copy only the visible part of the already cached town background. Regression
  tests compare the visible pixels at different zoom levels and map boundaries.
- Pause the world loop while the tab is hidden or the chapter/settings menu is
  open, keeping one animation loop and resetting the elapsed-time anchor.
- Saved answers/resources remain synchronous. A storage write no longer
  rebuilds the closed chapter menu; opening it still refreshes its contents.

## Validation

On 13 November 2026, the same chapter-3 quay scene in the cloud Chromium test
environment took **215.8 ms before** and **28.0 ms after** for a warmed batch of
60 map draws. The reference renderer was read from commit
`c23b06c9cf20af33dffc7521ac0c4959add4e2f3`. This is a drawing CPU-cost comparison,
not an end-to-end FPS benchmark or a measurement of the pupils' Chromebooks.
The temporary profiling panel and baseline files are not published.

In the chapter-3 print shop, a warmed batch of 20 question-background canvases
took 138.6 ms with the prior renderer and 104.0 ms with the pixel cache. That
comparison includes creating/removing the canvases. It does not measure text
entry or pupil-device FPS. More significantly, the room speech regression
executes 1,000 stationary ticks without remeasuring the bubble; changing text,
speaker or bystander poses, replies or explicit layout invalidation remeasures.

`room-performance.cjs` executes the real room drawing guards in chapters 1–5,
checks resume after an obscuring question/menu, exact cached pixels, resize and
material invalidation, the two-scene and 24 MiB limits, and live speech placement.
`render-performance.cjs` checks real paper-painter pixels/silhouettes, cache
invalidation and memory bounds, 600 moving draws using 16 original paints,
off-screen and edge-of-screen cases, pixel-identical background crops and
hidden/menu pause scheduling. Existing scene, speaker, conversation, polearm,
class-link/save, mastery, orchard, apple-threat, fishing and hat checks cover
the interactions sharing this pipeline.

Run `python docs/spel-test/decode_sources.py` before source-based tests. Set
`NODE_PATH` to the installed runtime's Node modules for the canvas checks.
