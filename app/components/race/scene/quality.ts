export type Tier = 'high' | 'low' | 'poster';

/** Picks the render tier once at start (PLAN.md section 9). */
export function pickTier(): Tier {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'poster';
  // No WebGL, or a software renderer (no GPU acceleration): the lap would stutter, so show the poster.
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return 'poster';
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (/swiftshader|llvmpipe|softpipe|software/i.test(renderer)) return 'poster';
  } catch {
    return 'poster';
  }
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return window.innerWidth < 860 || cores < 6 || mem < 4 ? 'low' : 'high';
}
