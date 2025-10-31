# Liquidity - Interactive Animation Experiments

Experimental Next.js project exploring advanced animation techniques for creating liquid text effects.

**Live Site**: [https://liquidity-ten.vercel.app/](https://liquidity-ten.vercel.app/)

<img width="1708" height="980" alt="Screenshot 2025-10-31 at 13 51 56" src="https://github.com/user-attachments/assets/d853e47d-31a0-40e5-83ca-27efd7b63bea" />

## Tech Stack

- **Framework**: Next.js 15.1.7 (App Router) with React 19
- **Animation Libraries**: 
  - [GSAP 3.12.7](https://greensock.com/gsap/) - SVG path animation
  - [Rapier2D 0.14.0](https://rapier.rs/) - 2D physics engine (WebAssembly)

## Animation Experiments

### GSAP Wave Animation (`/gsap`)

SVG-based liquid text using GSAP timelines with mathematical wave generation.

**Implementation:**
- SVG path morphing with interactive mouse tracking
- Timeline management with `useCallback` hooks to prevent re-renders
- Wave formula: `amplitude * sin((x - mouseX) * frequency + phaseShift)`
- SVG clip-path masking to constrain effects within text

**Resources:** [GSAP Timeline](https://greensock.com/docs/v3/GSAP/gsap.timeline()) | [Attr Plugin](https://greensock.com/docs/v3/Plugins/AttrPlugin)

---

### Rapier Physics Simulation (`/canvas`)

Canvas-based liquid simulation with 2500 particles using a real physics engine.

**Performance Optimizations:**
- Cached text mask (single `getImageData()` call)
- Batch canvas rendering (single `beginPath()` + `fill()`)
- Squared distance calculations to avoid `sqrt()`
- Single physics step per frame

**Physics Configuration:**
- Gravity: 2500, Linear damping: 8.0
- Density: 0.5, Restitution: 0.001, Friction: 0.02

**Interaction Model:**
- Mouse move/click: Distance-based forces with inverse square law
- Touch: Same model with passive event prevention
- Multi-tier containment to keep particles within text bounds

**Resources:** [Rapier2D Docs](https://rapier.rs/docs/user_guides/javascript/getting_started_js/) | [Compat Package](https://www.npmjs.com/package/@dimforge/rapier2d-compat)

## Technical Decisions

**GSAP Approach:**
- Lightweight, predictable animations
- Better for simple decorative effects
- Easy to fine-tune timing and easing

**Rapier Approach:**
- Realistic physics-based behavior
- Natural particle interactions
- Higher computational cost but acceptable performance (~60fps)

## Development

```bash
yarn install
yarn dev

# Navigate to:
# / - Home page with navigation
# /gsap - GSAP SVG animation
# /canvas - Rapier physics simulation
```

## Architecture

- Client components (`'use client'`) required for DOM/Canvas access
- React refs for direct DOM manipulation and timeline management
- Effect cleanup via timeline kills and event listener removal
- TypeScript strict mode with explicit physics object types

## Future Considerations

- WebGL rendering for Rapier particles (better performance at scale)
- React Three Fiber integration for 3D liquid effects
- Custom easing functions for GSAP waves
- Particle system optimization via spatial partitioning
