# Liquidity

Two local motion studies built with Next.js, React, GSAP and Rapier2D. The latest product pass is a local candidate, not a published deployment.

## The studies

- `/gsap`: a sampled sine path inside an SVG word mask. Height and speed controls affect the actual GSAP animation. Pointer, Enter/Space and arrow keys provide interaction; pause holds the shape. Copy current SVG exports the rendered static path and editable text, with explicit clipboard failure/manual-copy feedback. It does not export the running animation or outline/embed the font.
- `/canvas`: Rapier circles inside a box, filtered through cached text pixels. Gravity, damping and strong containment are retained. The default is 750 bodies, with 1,500 and 2,500 selectable. Centre pulse is a native keyboard alternative; when paused it advances one physics step. Reset respawns the selected count. These are rigid bodies and a text mask, not a fluid solver.

Both have visible navigation, native controls, explicit playback and a reduced-motion initial pause. The browser's hidden state also pauses the owned animation work. Physical touch, every browser/assistive technology and frame-rate performance are not certified.

## Lifecycle and input boundary

The particle scene checks Canvas before awaiting the local engine, suppresses late initialisation after disposal, owns/cancels its RAF, disconnects resize/visibility listeners and frees its world. A fixed timestep has bounded catch-up; display coordinates convert into the simulation's scene coordinates independently of CSS scale and DPR. Zero-distance impulses remain finite, and vertical splash uses its Y displacement.

The wave owns its idle timeline, interaction tween and one replaceable resume timer. Navigation/disposal clears all three. Each instance has a unique clip ID, and current-SVG export includes namespace, dimensions and font declarations. The font remains editable/system dependent.

## Local checks

Use Node 24. No environment files or external services are needed.

```sh
yarn install --ignore-scripts --frozen-lockfile
yarn lint
yarn test
yarn build
yarn start --hostname 127.0.0.1 --port 4846
```

Normal lint/build run the canonical icon source gate. Normal test runs all eleven shared icon regressions plus the motion, ownership and actual-control checks. Dependency and browser receipts are in `docs/quality/` once saved. All artwork, text masks and numerical notation remain domain content; UI icons use Lucide.

Primary API references: [Rapier JavaScript guide](https://rapier.rs/docs/user_guides/javascript/getting_started_js/), [Rapier World ownership](https://rapier.rs/javascript2d/classes/World.html), [GSAP timelines](https://gsap.com/docs/v3/GSAP/Timeline/).

The earlier README's approximate 60fps claim was not measured and has been removed. No new FPS, byte-size or broad no-leak guarantee is claimed from local checks.

## Earlier published screenshot

<img width="1708" height="980" alt="Screenshot 2025-10-31 at 13 51 56" src="https://github.com/user-attachments/assets/d853e47d-31a0-40e5-83ca-27efd7b63bea" />

The screenshot predates this local controls and lifecycle review. See the verification receipt above for the checked candidate.
