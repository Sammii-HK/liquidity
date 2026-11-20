# Liquidity local product review, 20 November 2026

Based on clean source `ce2d908` in an isolated worktree. The owner's untracked main shell file was preserved and not read. No environment, private state, backend, provider or release action is involved. This is a local candidate.

## Actual changes

The two original routes remain: GSAP/SVG wave and Rapier/Canvas particles. Their interface now distinguishes the geometric wave from constrained rigid bodies filtered through cached text pixels; neither is described as a fluid solver. Shared navigation shows the same three sections, current-page state and visible focus. Controls, layout and method explanations are designed for desktop and phone widths. All UI icons are Lucide; the text masks and numerical labels remain artwork/data.

The particle scene validates Canvas before awaiting the local WASM engine and checks disposal before allocating a world. It owns RAF, resize/visibility observers/listeners and frees the world exactly once. Fixed steps use bounded catch-up. Pause cancels owned frames, hidden tabs stop the scene, and a manual centre pulse advances one step while paused. Reset respawns the current count and clears velocity/forces. A labelled 750-body default reduces initial density, with 1,500 and the original 2,500 still selectable. Count changes dispose and rebuild; no measured FPS benefit is claimed.

Coordinates now convert the real Canvas/SVG rectangles into logical scene units, independently of display scale and backing-store DPR. Zero-distance force directions are finite; vertical click impulse uses dy. Pointer/touch and the native centre-pulse button reach the same scene operation. Letter outlines are a guide, not collision walls; the box/containment model remains explicit.

The wave owns its idle timeline, interaction tween and one replaceable resume timer. Pointer updates, leave, pause and disposal clear prior work. Every instance has a unique clip ID. A preference check completes before either engine is created, so reduced motion starts paused; explicit playback remains available. Hidden-state handling does not override a user's manual pause. Height/speed and manual shifts affect the real controller, including static updates while paused.

Copy current SVG serialises the actual current shape with namespace, dimensions, editable text/font declaration and the text clip. It is static, not an exported running timeline or font outlines. Clipboard feedback waits for success; failure exposes selectable source. No model-generated or fabricated output is involved.

## Source verification

Normal test runs 11 unchanged canonical icon regressions and 13 motion/lifecycle/actual-control cases. These check scene scaling, finite centre/vertical impulses, compatible wave paths, one resume timer, paused/manual wave settings, Canvas absence, late init cancellation, bounded steps, idempotent free/listener cleanup, engine failure, count/pause/reset controls, reduced motion and valid current-SVG output plus clipboard rejection. Physics and GSAP lifecycle boundaries are injected mocks; actual browser/engine evidence is recorded separately after checking it.

Normal lint and the full Next production build pass with zero source icon findings. ESLint explicitly ignores generated Next/output/coverage folders, rather than attempting to lint its own compiled bundle. The original unmeasured 60fps README claim is removed. No full no-leak, physical-touch, cross-browser, assistive-technology or performance certification is inferred.

Primary references: [Rapier World ownership](https://rapier.rs/javascript2d/classes/World.html), [Rapier compatibility initialisation](https://rapier.rs/docs/user_guides/javascript/getting_started_js/), [GSAP timeline cleanup](https://gsap.com/docs/v3/GSAP/Timeline/). The compatibility engine is local WASM, not a network simulation provider.
