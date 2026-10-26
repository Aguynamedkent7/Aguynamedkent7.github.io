export type Tier = 'high' | 'low' | 'poster';

/** Picks the render tier once at start (PLAN.md section 9). */
export function pickTier(): Tier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'poster';
  try {
    if (!document.createElement('canvas').getContext('webgl2')) return 'poster';
  } catch {
    return 'poster';
  }
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return window.innerWidth < 860 || cores < 6 || mem < 4 ? 'low' : 'high';
}
