# PLAN: Pit Lane Orbit

## 1. Goal

Replace the static hero and project grid opening with a scroll-driven 3D lap. Scrolling drives one race car around a circuit. Seven trackside screens show the seven projects, and the screen for the current sector lights up while a caption panel shows that project's details. After the lap, the camera cranes up into an overhead track map and all screens turn to face the viewer, forming a ring of projects around the circuit.

Everything below the hero keeps the current content (`app/content.ts`) and gains lighter motion: tilt cards, stacked experience cards, a velocity marquee for the stack, and a magnetic contact button.

The approved prototype is `reference/pit-lane-orbit.prototype.html`. When this plan and the prototype disagree on a number, the prototype wins unless the number is listed in section 11 (changes from the prototype).

## 2. Hard rules (from the owner)

- **Real term big, themed term small.** Section headers are the real word ("Projects", "Experience", "Tech stack", "Contact"). Racing terms go in the small label above it ("S1 / Starting grid", "Sector 3 / 7", "Pit lane").
- **No fake system-status UI.** No speedometers, RPM gauges, lap timers, "SYSTEM_ONLINE", kernel versions, blinking status dots or terminal chrome. The track map is allowed because it is real navigation (it shows where the car and each project are).
- **Copy comes from `app/content.ts`.** Do not invent stats or testimonials.
- **Static export must keep working.** `next.config.ts` has `output: 'export'` and the site deploys to GitHub Pages via `.github/workflows/deploy.yml`. No server features, no API routes, no `next/image` optimisation.

## 3. Current repo (as of this plan)

- Next.js 16.1, React 19.2, TypeScript, `lucide-react`. No animation libraries yet.
- `app/page.tsx` renders all sections; `app/Nav.tsx` is the client nav with a mobile menu; `app/content.ts` holds all copy; `app/globals.css` holds tokens and styles; fonts come from `next/font` in `app/layout.tsx` (Saira Condensed, IBM Plex Sans, JetBrains Mono). Keep the fonts.
- Existing scroll reveal uses CSS `animation-timeline: view()` with a reduced-motion guard. Keep that pattern for simple reveals.
- Screenshots in `public/projects/`: `karsayo.webp`, `hris.webp`, `wifi-portal.webp`. The other four projects have no screenshot yet, so their screens use a generated title card (see 6.5).

## 4. Stack decisions

| Need | Choice | Why |
| --- | --- | --- |
| 3D | `three` (vanilla, ES module imports) | The prototype is vanilla Three.js; porting it directly is faster and lighter than rewriting in React Three Fiber, and the scene is one imperative render loop. |
| Smooth scroll | `lenis` | Current standard for smooth scrolling; syncs with GSAP's ticker. |
| Scroll progress and pinning | `gsap` + `ScrollTrigger` | Reliable pinning and a scrubbed `progress` value (0..1) to feed the scene. GSAP is free for all use. |
| Loading the scene | `next/dynamic` with `ssr: false` | Three.js only runs in the browser; the server-rendered HTML shows the text and a poster so first paint and LCP are not blocked by WebGL. |

Do not add React Three Fiber, drei, postprocessing, or a physics engine.

## 5. File layout

```
app/
  components/
    motion/
      SmoothScroll.tsx      Lenis + ScrollTrigger sync, mounted once in layout
      TiltCard.tsx          3D hover tilt + glare (projects, stack)
      StackedCards.tsx      sticky experience cards that scale and dim as the next one covers them
      VelocityMarquee.tsx   two tech-stack rows, speed follows scroll velocity
      MagneticButton.tsx    primary CTA that pulls toward the cursor
      useReducedMotion.ts
      useScrollVelocity.ts
    race/
      RaceHero.tsx          client component: pinned section, DOM overlays, loads the scene
      RaceCaption.tsx       caption panel (sector label, project, tags, link, sector dots)
      RacePoster.tsx        static fallback (no WebGL, reduced motion, before the scene loads)
      scene/
        createRaceScene.ts  builds everything, returns { update(progress, velocity), resize(), setPalette(), dispose() }
        circuit.ts          curve, sampled frames, track and apron ribbons, kerbs, start gantry, floodlights
        car.ts              GT car from primitives, wheels, lights, taillight trails
        boards.ts           seven project screens, highlight, overview turn
        camera.ts           chase camera, look bias, crane to overview
        trackMap.ts         2D canvas mini-map
        textures.ts         asphalt, checker, number roundel, glow sprite, board title cards
        palette.ts          palette objects shared by CSS and the scene
        quality.ts          picks a quality tier
        sample.ts           curve sampling helpers
```

`page.tsx` replaces the current hero and highlights block with `<RaceHero />`, then keeps the remaining sections in this order: highlights, Projects (S1), Experience (S2), Tech stack (S3), Contact (Pit lane), footer.

## 6. The hero, in detail

### 6.1 Pinned section and scroll progress

- Section height: `420vh` desktop, `360vh` under 860px wide. Inner stage is pinned with ScrollTrigger (`pin: true`, `scrub: true`), height `100svh`, min 620px.
- `progress` p goes 0 to 1 across the pin. A smoothed scroll velocity `vel` (0 to 1) is also passed to the scene.
- Phases:

| Range of p | What happens |
| --- | --- |
| 0 to 0.06 | Intro text (eyebrow, H1 name, tagline, one line of copy) fades out and slides up 80px. |
| 0.03 to 0.08 | Caption panel fades in. |
| 0 to 0.80 | Chase phase: one lap. `chase = min(1, p / 0.8)`. |
| 0.80 to 0.96 | Crane phase: `q = smoothstep((p - 0.8) / 0.16)`. Camera rises to the overhead view; screens turn to face the camera. |
| q > 0.45 | Caption switches to the overview text; track map stops drawing the lap progress line. |

### 6.2 Car motion

- **Dwell mapping** so the car slows at each screen. With `c0 = 0.62 / 7` and `A = 0.72` (0 with reduced motion):
  `lap = chase - (A / (14π)) · (sin(14π(chase - c0)) + sin(14π·c0))`, clamped to 0..0.985.
- In the overview phase the car keeps lapping slowly: `idle += dt · 0.018 · q`.
- Car position eases toward the target: `cu += (target - cu) · 0.055` per frame.
- Wheels spin by distance travelled (radius 0.37). Front wheels steer into the turn (clamped ±0.35 rad). Body rolls with turn × speed (±0.08 rad) and pitches slightly under speed. Tiny idle shake when nearly stationary.
- Sector = `floor(lapU · 7)` while racing; this drives the caption and the active screen.

### 6.3 Circuit

- Closed `CatmullRomCurve3`, centripetal, control points in `reference/circuit.json`, scale 1.7, small vertical undulation `y = sin(i · 0.8) · 1.4`.
- Precompute 1400 frames (point, tangent, side). Track width 7. Asphalt ribbon with a canvas texture (noise plus white edge lines), UV repeat every 10 units. Darker apron ribbon 9 units wider underneath.
- Kerbs only where the tangent turns more than 0.075 rad over 10 samples, alternating two kerb colours from the palette, both sides.
- Floodlight poles every 70 samples on the outside of the track (outside = away from the circuit's centroid), with an additive glow sprite at the top.
- Start/finish: checkered strip on the track at u = 0 and a gantry with checkered faces.
- Ground plane plus a faint grid. Fog: `FogExp2`, density 0.011 while racing, easing to 0.0016 in the overview (otherwise the overview is fogged out).
- Renderer: ACES filmic tone mapping, exposure 1.1, PCF soft shadows. Directional "sun" follows the car with a 28-unit shadow box; spotlight headlights point 22 units ahead; small warm point light under the car.

### 6.4 Car

Built from primitives (no model file to load). Orange clearcoat body from an extruded side profile, dark glass cabin, roof and bonnet stripe, splitter, diffuser, rear wing on struts with endplates, `07` roundels on both doors and the bonnet, emissive headlights and taillights with glow sprites, four wheels with rims. Two taillight trail lines (70 points, fading, additive). Exact profile points and positions are in the prototype's `buildCar`.

### 6.5 Project screens

- Seven screens, one per project in `content.ts` order. Screen i sits at `u = (i + 0.62) / 7`, offset `W/2 + 6.5` to the outside of the track.
- Screen 14.4 × 9 units, centre 9.4 above the track, on two posts, with a dark back box. The screen faces a point 90 samples behind it on the track, so it faces the approaching car.
- Screen material: `MeshBasicMaterial`, `toneMapped: false`, `fog: false`, so screenshots stay bright and sharp.
- Projects with a screenshot load it as a texture (sRGB, anisotropy 8). The other four get a generated title card (1280 × 800 canvas: surface colour, hot-colour edge bar, category in the accent colour, project name in Saira Condensed 800, tags in mono, faint position number). Redraw title cards after `document.fonts.ready`.
- Active screen (current sector): frame glow in the hot colour, scale 1.05. Hovered screen: frame glow, scale 1.12. In the overview all frames glow faintly in the accent colour.
- **Look bias:** while racing, the camera's look target leans toward the screen just ahead, weight `exp(-((d - 0.012) / 0.022)²) · 0.42`, and the camera lifts up to 0.9 units, so each screenshot gets a clear moment on screen.
- Raycast on pointer move; clicking a screen opens the project's live URL, or its GitHub link if there is no live URL.

### 6.6 Camera

- Chase position: `car - tangent · 8.2 + up · 2.5`, plus mouse sway (side ±2.2, height ±0.8) and up to +0.6 height from scroll velocity. Use 10 instead of 8.2 on narrow screens.
- Look target: 6 units ahead of the car at height 0.9, plus the look bias above.
- FOV 52, widening up to +16 with scroll velocity; 38 in the overview.
- Overview: above the circuit at height `span · 0.72` (`span · 1.35` on narrow screens), pulled back `height · 0.62` on z and shifted left `span · 0.12` on desktop so the caption panel does not cover the circuit.
- Position and target ease toward their goals at 0.09 per frame.

### 6.7 DOM overlays (pinned with the canvas)

- **Intro** (top left): eyebrow "Full-stack developer / Cagayan de Oro, PH" in the accent colour, H1 "Kent / Vincent / Butaya" with the last line in the hot colour and a line-by-line rise animation on load, tagline "Built for the fast lane.", one line explaining that scrolling drives the lap.
- **Caption panel** (bottom right, 420px, translucent panel with blur): small label "Sector N / 7", seven sector dots (active one wider, hot colour), then the project's position badge (P1 to P7), category, name (large, Saira Condensed), body, tags, and its link. Content swaps with a short rise-and-fade keyed on the project. In the overview it shows "Projects" with one line of copy and a "See all projects" link to `#work`. Use `aria-live="polite"`.
- **Track map** (bottom left, 240 × 150 canvas inside a small panel labelled "Track map"): circuit outline, the lap driven so far in the hot colour, numbered screen markers (active and hovered in the hot colour), and the car as a dot with a soft halo. Hidden under 860px.
- **Skip link:** a visually subtle "Skip the lap" link that jumps to `#work`, visible on keyboard focus.

## 7. Below the hero

| Section | Label / Header | Motion |
| --- | --- | --- |
| Highlights | (none) | Four highlight cells from `content.ts`, simple reveal. |
| Projects `#work` | S1 / Starting grid · Projects | Grid of all projects. Karsayo is featured (spans the full row, image beside text). Cards roll up on scroll (`translateY(80px) rotateX(22deg)` to rest, CSS view timeline) and tilt toward the cursor (max 9 deg, 5 for the featured card), with a soft accent glare and layered depth (image and badge on `translateZ`). |
| Experience `#experience` | S2 / Race history · Experience | Sticky stacked cards (top offset 110px + 22px per card). Each card scales to 0.94 and dims as the next one covers it. Large outlined lap number (L1 to L4) on each card. |
| Tech stack `#stack` | S3 / Setup sheet · Tech stack | Two marquee rows in Saira Condensed, moving in opposite directions, base speed plus scroll velocity. Mix solid, outlined and hot-coloured words. Include a real visible text list of the stack for screen readers and search. |
| Contact `#contact` | Pit lane · Contact | Subhead "Need a driver for your team?". Magnetic "Email me" button, GitHub link, résumé download (`/resume.pdf`). |
| Footer | | Animated checkered flag strip. |

## 8. Palette

Defined in `reference/tokens.css`. Use **Gulf night** as the site palette. Keep the token names so the palette can be swapped by changing one block.

| Role | Token | Gulf night |
| --- | --- | --- |
| Page background | `--bg` | `#0A0F16` |
| Surfaces | `--s1`, `--s2` | `#111923`, `#17212D` |
| Lines | `--line`, `--line2`, `--line3` | `#1E2935`, `#26323F`, `#34414F` |
| Text | `--t1` to `--t4` | `#EAF0F5`, `#C3CDD7`, `#9DAAB7`, `#8593A1` |
| Accent (structure: labels, links, kerbs, focus, hover borders, overview glow) | `--acc` | `#8FD0F0` |
| Hot (meaning: the car, active screen, your name, primary buttons, position badges) | `--hot` | `#FF6B2C` |
| Text on hot | `--onHot` | `#0A0F16` |

Rule of thumb: orange only appears where it means "this one, now". Everything structural is blue or neutral. `palette.ts` exports the same values for the scene (background, fog, ground, apron, grid, kerb colours, car paint, frame colours, lamp colour, map colours).

## 9. Quality tiers, performance and fallbacks

`quality.ts` picks one tier at start:

| Tier | When | Settings |
| --- | --- | --- |
| high | Desktop, `hardwareConcurrency >= 6`, no reduced motion | DPR up to 2, antialias, shadows 1024, headlight spot, all floodlights, trails. |
| low | Width < 860, or `hardwareConcurrency < 6`, or `deviceMemory < 4` | DPR up to 1.5, no shadows, no headlight spot, every other floodlight, trails on. |
| poster | No WebGL, WebGL context lost, or `prefers-reduced-motion: reduce` | No canvas. `RacePoster` shows the intro text, a static circuit illustration (SVG of the track outline with numbered markers), and the seven projects as a simple list. The section is not pinned. |

Performance rules:
- Load the scene chunk with `next/dynamic` after first paint; show `RacePoster` until it is ready, then crossfade.
- Pause the render loop when the hero is off screen (IntersectionObserver) and when the tab is hidden.
- Only call React `setState` when the sector or mode changes, never per frame. Drive per-frame DOM changes (intro fade, caption opacity) through refs.
- Dispose geometries, materials, textures and the renderer on unmount.
- Targets: Lighthouse mobile performance 85+, accessibility 95+. Three.js plus the scene should be one lazy chunk.

## 10. Accessibility

- Canvas is `aria-hidden`; the caption panel and the Projects section carry the real content.
- Every project is reachable as a normal link in the Projects section.
- `prefers-reduced-motion`: poster tier, no Lenis smoothing, no tilt, no marquee movement, no magnetic pull, CSS reveals off.
- Text contrast 4.5:1 or better on all tokens above (they were chosen to pass). Focus rings use `--acc`.
- Touch targets 44px minimum.

## 11. Changes from the prototype

- The prototype reads scroll position every frame from `getBoundingClientRect`; the real build uses ScrollTrigger `progress` and Lenis velocity instead.
- The prototype's pin height is fixed in px; the real build uses `svh` units (section 6.1).
- The prototype has a palette switch for review. The real build ships Gulf night only, but keeps `setPalette()` on the scene and token blocks in CSS so a switch could be added later.
- The prototype uses Three.js r158 as a global script; the real build imports `three` from npm (latest). Check for API changes: `colorSpace` and physically based light intensities are already used, so few changes should be needed.
- The prototype runs inside a design tool's component runtime (`DCLogic`, `renderVals`, `sc-for`, `{{holes}}`). Ignore that layer; port the logic in `initScene`, `buildCar`, the texture functions, `frame`, `sample` and `drawMap`.

## 12. Using the prototype

Open `reference/pit-lane-orbit.prototype.html` as a text reference. Most useful parts:
- `buildCar()`: every car part's size and position.
- `initScene()`: circuit, kerbs, poles, gantry, boards, lights, trails, bounds.
- `frame()`: phase maths, dwell mapping, car physics, camera, look bias, board overview turn, fog easing.
- `drawMap()`: the mini-map.
- `boardTex()`, `asphaltTex()`, `checkerTex()`, `numberTex()`, `glowTex()`: canvas textures.
- `pal()`: palette objects for the scene.
