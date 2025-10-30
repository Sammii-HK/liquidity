# Liquidity - Interactive Animation Experiments

Experimental Next.js project exploring advanced animation techniques for creating liquid text effects through multiple approaches.

**Live Site**: [https://liquidity-ten.vercel.app/](https://liquidity-ten.vercel.app/)

## Technical Stack

- **Framework**: Next.js 15.1.7 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation Libraries**: 
  - [GSAP 3.12.7](https://greensock.com/gsap/) - SVG path animation
  - [Rapier2D 0.14.0](https://rapier.rs/) - 2D physics engine via WebAssembly

## Animation Experiments

### 1. GSAP SVG Wave Animation (`/gsap`)

SVG-based liquid text effect using GSAP timelines for smooth wave animations.

**Implementation Details:**
- SVG path morphing with mathematical wave generation
- GSAP timeline management with infinite repeat and yoyo
- Interactive mouse tracking that influences wave amplitude and frequency
- SVG clip-path masking to constrain waves within text boundaries

**Key Technical Decisions:**
- `useCallback` hooks to prevent unnecessary re-renders of animation functions
- Timeline refs to enable cleanup and prevent memory leaks
- Mathematical wave generation: `amplitude * sin((x - mouseX) * frequency + phaseShift)`
- Graceful fallback to idle animation when interaction stops

**Resources:**
- [GSAP Timeline Documentation](https://greensock.com/docs/v3/GSAP/gsap.timeline())
- [GSAP attr Plugin](https://greensock.com/docs/v3/Plugins/AttrPlugin)

---

### 2. Rapier Physics Particle System (`/canvas`)

Canvas-based liquid simulation using a real physics engine with 2500 particles.

**Implementation Details:**
- WebAssembly-powered physics via Rapier2D compat library
- 2500 dynamic rigid bodies with collision detection
- Real-time mouse/touch interaction affecting particle forces
- Pixel-perfect text masking using cached ImageData

**Performance Optimizations:**
- Cached text mask data (single `getImageData()` call)
- Batch canvas rendering (single `beginPath()` + `fill()` for all particles)
- Squared distance calculations to avoid expensive `sqrt()` operations
- Pre-calculated constants and efficient bounds checking
- Single physics step per frame for consistent performance

**Physics Configuration:**
- Gravity: 2500 (high for quick settling)
- Linear damping: 8.0 (prevents oscillation)
- Particle density: 0.5, restitution: 0.001 (low bounce, water-like)
- Friction: 0.02 (minimal for smooth flow)

**Interaction Model:**
- Mouse move: Distance-based force with inverse square law
- Click: Explosive radial force (500 max impulse)
- Touch: Same interaction model with passive event prevention

**Containment Strategy:**
- Multi-tier containment forces based on distance from text center
- Hard boundary teleportation for escaped particles
- Tight spawn area (180x25px) centered on text

**Resources:**
- [Rapier2D Documentation](https://rapier.rs/docs/user_guides/javascript/getting_started_js/)
- [Rapier2D Compat Package](https://www.npmjs.com/package/@dimforge/rapier2d-compat)

## Technical Decisions

### Why Two Approaches?

**GSAP Approach:**
- Lightweight, predictable animations
- Better for simple, decorative effects
- Easier to fine-tune timing and easing
- No external dependencies beyond GSAP

**Rapier Approach:**
- Realistic physics-based behavior
- Natural particle interactions and collisions
- More engaging user interaction model
- Higher computational cost but acceptable performance

### Performance Trade-offs

The Rapier implementation prioritizes:
1. **Visual density** (2500 particles) over pure FPS
2. **Batch operations** over individual draw calls
3. **Cached computations** over repeated calculations
4. **Single physics step** per frame for stability

Typical performance: 60fps on modern hardware with all optimizations enabled.

## Architecture Notes

- Client components (`'use client'`) required for both animation approaches due to DOM/Canvas access
- React refs used for direct DOM manipulation and timeline management
- Effect cleanup handled via timeline kills and event listener removal
- TypeScript strict mode with explicit type annotations for physics objects

## Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Navigate to experiments
# / - Home page with tab navigation
# /gsap - GSAP SVG animation
# /canvas - Rapier physics simulation
```

## Future Considerations

- WebGL rendering for Rapier particles (better performance at scale)
- React Three Fiber integration for 3D liquid effects
- Custom easing functions for GSAP waves
- Particle system optimization via spatial partitioning
