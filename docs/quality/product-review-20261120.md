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


## Final local dependency and browser receipt

The compatible dependency follow-up uses Next15.5.29 and matching ESLint configuration, preserving React19 and the existing Yarn lock. A scoped Next/PostCSS patch keeps the compatible dependency graph at zero full and zero production audit findings. Frozen installation,13 motion/control cases plus11canonical icon cases, normal lint, standalone types and the complete production build pass. Logs and Yarn audit summaries were checked directly before saving this batch.

Actual Chrome checked the final local build on127.0.0.1:4846: real Rapier WASM loaded; pause, centre pulse, original2500-body count selection and reset worked with one canvas. The wave's keyboard/manual shift and reset changed the real controller. At390px, controls measured at least44px and the page had no horizontal overflow. Viewport was reset and CUA completion recorded before handoff.

Actual captures in.codex-artifacts show the overview, wave and particle studies. The wave desktop view is scrolled and its caption must say so. Copy UI reported success but the browser clipboard read was empty, so actual pasted bytes remain unverified. Mocked XML/current-shape and clipboard-failure contract cases pass; this is not claimed as real clipboard-content proof. The export is a static SVG with editable text, not a running timeline or outlined font. No services, providers, accounts, private data, DB, physical-touch or broad accessibility/performance proof was involved. This source and dependency batch remains local and unreleased.
