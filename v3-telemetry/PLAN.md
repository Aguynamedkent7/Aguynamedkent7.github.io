# PLAN.md — v3 Telemetry Portfolio (Assetto Corsa Replay Background)

Branch: `v3` · Folder: `v3-telemetry` · Status: **PLANNED (not implemented)**
Date: 2026-09-08

## 1. Overview

Evolve the `v3-telemetry` portfolio (Next.js 16, React 19, Tailwind v4, Framer
Motion, Three.js/R3F) into a broadcast-telemetry experience. The background
becomes a scrubbed **Assetto Corsa replay video** whose POV changes per section.
Replace placeholder project content with the user's real GitHub projects.

## 2. Current State & Known Bug

### Bug: permanent "big cross" on every section
`app/components/RevealLines.tsx`:
- Horizontal line animates `scaleX 0→1`, vertical line `scaleY 0→1` — then **stays**.
- The `motion.div` fade-out (line 25) is an empty overlay that fades **itself**,
  not the lines. Result: a full-screen glowing cross persists on all sections.

### Fix plan
- Replace the full-width/height crosshair with **four corner brackets**.
- Timeline: expand in (~200ms) → hold (~350ms) → retract + fade out (~250ms).
- Never persist: remove from layout after completion.
- `SectionTransition` remains keyed on `activeSection` so the flash replays on
  every section switch.

## 3. Design System (already implemented in v3)

- Colors: `void #000`, `slate #0A0A0F`, accent Electric Blue `#00D4FF`,
  `muted #9CA3AF`, hairline `white/10` borders.
- Fonts: Titillium Web (display), Inter (body), JetBrains Mono (data).
- Glass: `.glass` / `.glass-accent` (bg-white/3 + backdrop-blur + border-white/10
  rounded-xl).
- Components: BroadcastHeader, DriverCard, TrackMap, TelemetryPanel,
  ContactSection, GlassPanel, CountUp, RevealLines, SectionTransition.

## 4. Feature: Assetto Corsa Replay Background with POV Scrubbing

### Concept
A single recorded AC replay (screen capture with camera changes baked in). Each
portfolio section maps to a POV stage of the replay. Switching sections visibly
**fast-forwards** the video to the next POV window, which then plays & loops.

Decision log (from user):
| Topic | Decision |
|---|---|
| Video asset status | **Not recorded yet** — build for a dropped-in file |
| File location | User drops MP4 into `v3-telemetry/public/` |
| Segment timestamps | **Dev capture helper** (press `K` to log `currentTime`) |
| POV-switch look | **Visible speed-up** — `playbackRate` ramp (~6×) across the gap |
| Audio | **Muted always**, no toggle |
| 3D Showroom | **Keep as poster/loading fallback** |

### `app/components/ReplayBackground.tsx` (new)
- `<video muted playsInline preload="auto">`, `src` from a constant
  (e.g. `VIDEO_SRC = '/replay.mp4'`).
- States: `loading → ready`, `scrubbing`, `error` (video missing).
- Load: on `loadedmetadata`, seek to the active section's `start`, play.
- Scrub on section change:
  1. set `video.playbackRate = 6`, `video.play()`
  2. poll via `timeupdate` / `requestVideoFrameCallback`
  3. when `currentTime` reaches target window (−~0.5 s) → snap
     `video.currentTime = start`, `playbackRate = 1`
- Loop: when `currentTime >= end` → `currentTime = start`.
- Fallback: when video is absent/error/loading, render the existing
  `<Showroom>` (Carrera GT R3F scene) as poster layer; cross-fade to video
  on `canplay`.
- Header callback so `BroadcastHeader` can show `REPLAY: {POV}` +
  "SYNCING SATELLITE" while scrubbing.

### Segment model — extend `app/data.ts`
```ts
export const replaySegments: Record<SectionId, {
  start: number; end: number; pov: string;
}> = {
  home:      { start: 0,   end: 28,  pov: 'ONBOARD' },  // TODO: calibrate
  career:    { start: 45,  end: 90,  pov: 'CHASE' },    // TODO: calibrate
  telemetry: { start: 120, end: 175, pov: 'HOOD' },     // TODO: calibrate
  contact:   { start: 200, end: 245, pov: 'FREE CAM' }, // TODO: calibrate
};
```
Placeholders replaced using the capture helper below.

### Dev capture helper (in ReplayBackground, NODE_ENV === 'development')
- Press `K`: `console.log(video.currentTime)` + transient HUD readout
  `T+ 01:23.4` on screen.
- Purpose: find exact POV-switch timestamps in the browser, paste into
  `replaySegments`.

## 5. Content: Real GitHub Projects

Replace placeholder `resumeData.projects` with:

| # | Project | Repo | Stack / Hook |
|---|---|---|---|
| 1 | Veent WiFi Portal | `HyuseCS/Veent_WifiPortal` | SvelteKit monorepo — customer captive portal + radius admin + AP locator; shared Postgres/Drizzle; Maya payments; bun workspace |
| 2 | Veent HRIS | `Aguynamedkent7/Veent_HRIS` | SvelteKit + Prisma HRIS platform |
| 3 | Deezcord | `seodowa/Deezcord` | Real-time chat (discord-like); WebSockets, multi-channel; TypeScript client/server; CS323 PDC PIT |
| 4 | ByaHero | `Aguynamedkent7/ByaHero` | Kotlin/Android jeepney tracker — drivers see commuters, commuters see live tracking |
| 5 | SleepIN | `Aguynamedkent7/SleepIN` | Kotlin/Android auto class joiner (+ `SleepIN_PC` Python) |
| 6 | JRJC Booking | `seodowa/JRJC` (keep) | Next.js / Supabase rental system |

- **Excluded:** Jojo Potato (not found / skipped).
- **Skills refresh:** SvelteKit, Prisma, Drizzle, Postgres, Kotlin, Java,
  Next.js, TypeScript.
- Update `milestones` to reflect real roles/education as needed.

## 6. File-by-File Change List

1. `app/components/RevealLines.tsx` — rewrite corner-bracket reveal (fix cross).
2. `app/components/ReplayBackground.tsx` — **new** video scrubber + Showroom fallback + capture helper.
3. `app/data.ts` — `replaySegments`, real projects, skills, milestones.
4. `app/page.tsx` — use `<ReplayBackground activeSection={...}>` in place of direct `<Showroom>`; pass POV/state to header.
5. `app/components/BroadcastHeader.tsx` — `REPLAY: {POV}` badge + scrubbing indicator.
6. `app/components/TelemetryPanel.tsx` — render new project cards; optional POV tag per card.
7. (config) — none required; `public/` is exported automatically.

## 7. Constraints — GitHub Pages video

- Output is `output: 'export'` (static), deployed to GitHub Pages.
- Video file: **H.264 MP4, `-movflags +faststart`** (`ffmpeg -i in -c:v libx264 -crf 23 -movflags +faststart replay.mp4`), **≤ 100 MB** (Pages hard limit), ~1080p recommended.
- File to add (user): `v3-telemetry/public/replay.mp4`.

## 8. Verification

- `cd v3-telemetry`
- `bun run lint` → clean
- `bun run build` → static export succeeds
- Manual dev test:
  - No video present → 3D Showroom fallback renders, no errors.
  - `replay.mp4` present → sections autoplay segment, switch shows 6× scrub,
    loops within `[start, end]`.
  - Dev: press `K` logs timestamps for calibration.

## 9. Open Follow-ups

- Record + compress the AC replay (user).
- Calibrate `replaySegments` timestamps with the capture helper (user + dev).
- Confirm final "POV per section" mapping while calibrating.