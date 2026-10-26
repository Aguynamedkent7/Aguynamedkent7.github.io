# TASKS: Pit Lane Orbit build

Work in order. After every phase: `npm run build` passes (static export), `npm run lint` passes, the acceptance criteria are checked, boxes are ticked here, and the phase is committed as `motion: phase N - <summary>`.

## Phase 0: Setup and tokens

- [ ] Install `three`, `@types/three`, `gsap`, `lenis`.
- [ ] Replace the `:root` tokens in `app/globals.css` with the Gulf night block from `reference/tokens.css`. Map old token names to the new roles (old `--accent` usages: structural ones to `--acc`, meaningful ones to `--hot`, per PLAN.md section 8).
- [ ] Create `app/components/race/scene/palette.ts` with the same values for the scene.
- [ ] Add `useReducedMotion.ts`.

Acceptance: site builds and looks the same as before apart from the new colours; labels and links are blue, the name highlight and primary buttons are orange; contrast spot-checked.

## Phase 1: Motion primitives below the hero

- [ ] `SmoothScroll.tsx`: Lenis synced to GSAP's ticker and ScrollTrigger; disabled with reduced motion; anchor links (`#work` etc.) scroll through Lenis with the nav height as offset.
- [ ] `TiltCard.tsx` and use it for project and stack cards (PLAN.md section 7).
- [ ] Featured Karsayo card spanning the full row.
- [ ] `StackedCards.tsx` for Experience.
- [ ] `useScrollVelocity.ts` + `VelocityMarquee.tsx` for Tech stack, plus a visible text list.
- [ ] `MagneticButton.tsx` for "Email me".
- [ ] Animated checkered footer strip.

Acceptance: each effect works with a mouse, does nothing harmful on touch, and is fully off with reduced motion; no layout shift; mobile menu still works.

## Phase 2: Hero shell (no 3D yet)

- [ ] `RaceHero.tsx`: pinned section (420vh / 360vh), stage `100svh`, ScrollTrigger progress in a ref.
- [ ] Intro overlay with the H1 rise animation; fades out over p 0 to 0.06.
- [ ] `RaceCaption.tsx` driven by a temporary fake sector (`floor(p / 0.8 · 7)`), fades in over p 0.03 to 0.08, switches to the overview text when p > 0.88.
- [ ] Track map panel with an empty canvas; "Skip the lap" link.
- [ ] `RacePoster.tsx` with the SVG circuit outline (from `reference/circuit.json`) and the project list; used for reduced motion.
- [ ] Remove the old hero and driver card from `page.tsx`; keep the highlights row after the hero.

Acceptance: scrolling through the hero pins correctly, the caption cycles through all seven projects with correct copy and links, then shows the overview text; nothing is pinned with reduced motion. **Stop here for review.**

## Phase 3: Scene foundation

- [ ] `next/dynamic` import of the scene with `ssr: false`; poster stays until the first frame renders, then crossfades.
- [ ] `createRaceScene.ts` with renderer settings, resize handling, render loop that pauses off screen and when the tab is hidden, and full `dispose()`.
- [ ] `circuit.ts`: curve, 1400 frames, track and apron ribbons, kerbs, floodlights, start/finish strip and gantry, ground and grid.
- [ ] Lighting, fog, tone mapping as in PLAN.md 6.3.
- [ ] `quality.ts` tiers.

Acceptance: a static camera view of the circuit renders at 60fps on a mid-range laptop; no console errors; unmount and remount (navigate away and back, or hot reload) leaks no WebGL contexts.

## Phase 4: Car and chase camera

- [ ] `car.ts` from the prototype's `buildCar`, including roundels, lights, glow sprites, wheels.
- [ ] Car moves by scroll with the dwell mapping and easing (PLAN.md 6.2); wheel spin, steering, roll, pitch, idle shake.
- [ ] `camera.ts` chase camera with mouse sway, velocity lift and FOV widening.
- [ ] Shadow-casting sun that follows the car; headlight spot; under-car light; taillight trails.

Acceptance: scrolling forward and back moves the car smoothly both ways; no camera snapping; stopping the scroll lets the car settle; trails do not streak when the car is stationary.

## Phase 5: Project screens and sectors

- [ ] `boards.ts`: seven screens at the specified positions, sizes and facing; screenshot textures for Karsayo, HRIS and Wi-Fi portal; generated title cards for the rest (redrawn after fonts load).
- [ ] Real sector from the car position replaces the fake one from Phase 2; `setState` only on change.
- [ ] Active screen highlight and look bias toward the screen ahead.
- [ ] Hover raycast and click to open the project link.

Acceptance: every screenshot is clearly readable for at least a moment as the car passes; the caption always matches the screen being passed.

## Phase 6: Crane to overview and track map

- [ ] Crane phase: camera blend to the overview, fog density easing, screens rising, scaling up and turning to face the camera, slow idle lapping.
- [ ] `trackMap.ts` drawing outline, lap progress, numbered markers and the car each frame.
- [ ] Caption overview state.

Acceptance: at the end of the pin the whole circuit and all seven screens are visible and readable at 1440 × 900 and at 390 × 844; scrolling back up returns smoothly to the chase. **Stop here for review.**

## Phase 7: Quality, accessibility, mobile

- [ ] Low tier verified on a phone (or Chrome device emulation with CPU throttling): steady frame rate, no shadows, camera distance 10, overview height `span · 1.35`, map hidden, caption full width at the bottom.
- [ ] Poster tier verified with reduced motion and with WebGL disabled.
- [ ] Keyboard pass: skip link, nav, caption link, all project links, focus rings visible.
- [ ] Lighthouse mobile: performance 85+, accessibility 95+. Fix what is below target.

Acceptance: targets met; no horizontal scroll at 360px wide.

## Phase 8: Tests and deploy

- [ ] Playwright smoke tests: page loads; hero has either a canvas or the poster; all section ids exist (`work`, `experience`, `stack`, `contact`); all seven project names appear in the DOM; with `reducedMotion: 'reduce'` the poster renders and the hero is not pinned.
- [ ] `npm run build` produces the static export; check the deploy workflow still passes.
- [ ] Update the OG image only if the owner asks.
