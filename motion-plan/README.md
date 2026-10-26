# Motion redesign plan: Pit Lane Orbit

Plan for rebuilding the portfolio hero as a scroll-driven 3D lap: one car, one circuit, seven project screens, ending in an overhead track map where the screens form a ring.

## Files

| File | What it is |
| --- | --- |
| `PLAN.md` | The full spec: architecture, scroll choreography, scene parameters, palette, quality tiers, accessibility. |
| `TASKS.md` | Phased build checklist with acceptance criteria. Work through it in order. |
| `reference/pit-lane-orbit.prototype.html` | The approved design prototype. Port its logic and numbers, not its markup (see PLAN.md, "Using the prototype"). |
| `reference/tokens.css` | Palette tokens. "Gulf night" is the chosen default. |
| `reference/circuit.json` | Circuit control points, scale and board placement. |

## Prompt for Claude Code

Paste this after pulling:

```
Read motion-plan/README.md, motion-plan/PLAN.md and motion-plan/TASKS.md.
Implement TASKS.md one phase at a time, starting with Phase 0.
After each phase: run `npm run build` and `npm run lint`, check every acceptance
criterion for that phase, tick the boxes in TASKS.md, and commit with a message
like "motion: phase N - <summary>". Stop and show me after Phase 2 and Phase 6
so I can review in the browser before you continue.
Use motion-plan/reference/pit-lane-orbit.prototype.html as the source of truth
for scene numbers and behaviour.
```
