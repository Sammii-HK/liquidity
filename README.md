# Liquidity

Two ways to move the same word. A small Next.js site with two interactive studies of liquid-looking type.

**Live site:** [liquidity-ten.vercel.app](https://liquidity-ten.vercel.app/)

<img width="1708" height="980" alt="Liquidity screenshot" src="https://github.com/user-attachments/assets/d853e47d-31a0-40e5-83ca-27efd7b63bea" />

## The studies

- **Wave (`/gsap`)**: a sine-based SVG path animated with GSAP inside a text clip. Adjust height and speed, move it with the pointer or arrow keys, pause it, and copy the current shape as an SVG.
- **Particles (`/canvas`)**: Rapier2D rigid bodies inside a small box, drawn through a cached text mask. Choose 750, 1,500 or 2,500 bodies, scatter them with the pointer or the centre pulse, and pause or reset the scene.

Both studies start paused when reduced motion is requested, and both rest while the tab is hidden.

## Tech stack

- Next.js 15 (App Router) with React 19
- [GSAP](https://gsap.com/docs/v3/GSAP/Timeline/) for the SVG wave
- [Rapier2D](https://rapier.rs/docs/user_guides/javascript/getting_started_js/) (WebAssembly) for the particles
- Lucide icons

## Development

Uses Yarn 1.

```sh
yarn install
yarn dev
```

Other scripts: `yarn test`, `yarn lint`, `yarn build`.
