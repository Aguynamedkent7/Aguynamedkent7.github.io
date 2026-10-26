import * as THREE from 'three';
import type { Project } from '../../../content';
import { buildBoards, updateBoards } from './boards';
import { buildCar } from './car';
import { buildCircuit, sample } from './circuit';
import { gulf, type Palette } from './palette';
import type { Tier } from './quality';
import { glowTex, numberTex } from './textures';
import { drawMap, MAP_H, MAP_W } from './trackMap';

export type Mode = 'race' | 'map';

type Options = {
  canvas: HTMLCanvasElement;
  map: HTMLCanvasElement | null;
  /** Element whose visibility gates the render loop (the hero section). */
  host: HTMLElement;
  projects: Project[];
  tier: Exclude<Tier, 'poster'>;
  getProgress: () => number;
  getVelocity: () => number;
  onState: (front: number, mode: Mode) => void;
  onReady: () => void;
  onLost: () => void;
};

const CHASE_END = 0.8; // p where the lap ends and the crane starts
const CRANE_LEN = 0.16;
const TRAIL = 70;
const TAN_OV = Math.tan((38 / 2) * Math.PI / 180); // overview FOV 38
const UP = new THREE.Vector3(0, 1, 0);

/** Builds the Pit Lane Orbit scene and runs its loop. Numbers follow the prototype's frame(). */
export function createRaceScene(o: Options) {
  const { canvas, tier, projects } = o;
  let pal: Palette = gulf;
  const high = tier === 'high';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: high, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, high ? 2 : 1.5);
  renderer.setPixelRatio(dpr);
  renderer.shadowMap.enabled = high;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(pal.bg);
  const fog = new THREE.FogExp2(pal.bg, 0.011);
  scene.fog = fog;
  const camera = new THREE.PerspectiveCamera(52, 1, 0.5, 1400);

  const glow = glowTex();
  const C = buildCircuit(scene, pal, tier, glow);
  const { boards, redraw } = buildBoards(scene, projects, C, pal, glow, anisotropy);
  const { car, body, wheels, paint, num } = buildCar(pal, glow);
  scene.add(car);

  // Lights: hemisphere fill, a sun that follows the car, headlights, a warm glow underneath.
  scene.add(new THREE.HemisphereLight(0xB9C2D3, 0x15171B, 0.9));
  const sun = new THREE.DirectionalLight(0xFFFFFF, 1.5);
  sun.castShadow = high;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 120 });
  sun.shadow.bias = -0.0005;
  scene.add(sun, sun.target);
  const head = high ? new THREE.SpotLight(0xFFF4E0, 140, 55, 0.42, 0.6, 1.6) : null;
  if (head) scene.add(head, head.target);
  const under = new THREE.PointLight(pal.hot, 12, 8, 2);
  scene.add(under);

  // Taillight trails: 70-point fading additive lines.
  const trails = [-0.62, 0.62].map((off) => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(TRAIL * 3), col = new Float32Array(TRAIL * 3);
    for (let i = 0; i < TRAIL; i++) {
      const k = 1 - i / TRAIL;
      col.set([k, 0.23 * k, 0.12 * k], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const line = new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false }));
    line.frustumCulled = false;
    scene.add(line);
    return { g, pos, off, filled: false };
  });

  const cHot = new THREE.Color(pal.hot), cAcc = new THREE.Color(pal.acc);

  // Sizing.
  let narrow = false, mapDpr = 1;
  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    narrow = w < 860;
    if (o.map) {
      mapDpr = Math.min(window.devicePixelRatio || 1, 2);
      o.map.width = MAP_W * mapDpr;
      o.map.height = MAP_H * mapDpr;
    }
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Pointer: camera sway (window) and screen hover/click (canvas).
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  const ndc = new THREE.Vector2();
  const ray = new THREE.Raycaster();
  let probe = false, hover = -1;
  const onWinPtr = (e: PointerEvent) => {
    ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
    ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onPtr = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    probe = true;
  };
  const onLeave = () => { probe = false; hover = -1; canvas.style.cursor = ''; };
  const onClick = () => {
    const p = projects[hover];
    const href = p && (p.url || p.github);
    if (href) window.open(href, '_blank', 'noopener');
  };
  window.addEventListener('pointermove', onWinPtr);
  canvas.addEventListener('pointermove', onPtr);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('click', onClick);

  const onLost = (e: Event) => { e.preventDefault(); o.onLost(); };
  canvas.addEventListener('webglcontextlost', onLost);

  // Title cards and number roundels use web fonts; redraw once they load.
  let disposed = false;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    redraw(pal);
    num.map?.dispose();
    num.map = numberTex();
    num.needsUpdate = true;
  });

  // Frame state.
  let cu = 0, idle = 0, spin = 0, first = true, last = 0;
  let front = -1, mode: Mode | null = null;
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  const pos = new THREE.Vector3(), tan = new THREE.Vector3(), side = new THREE.Vector3();
  const ahead = new THREE.Vector3(), aheadT = new THREE.Vector3();
  const chasePos = new THREE.Vector3(), chaseLook = new THREE.Vector3();
  const ovPos = new THREE.Vector3(), ovLook = new THREE.Vector3();
  const screens = boards.map((b) => b.screen);

  const frame = (t: number) => {
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 1 / 60;
    last = t;
    const p = o.getProgress();
    const vel = o.getVelocity();

    // Phases: one lap 0..0.8, then the crane to the overview.
    const chase = Math.min(1, p / CHASE_END);
    const qRaw = Math.min(1, Math.max(0, (p - CHASE_END) / CRANE_LEN));
    const q = qRaw * qRaw * (3 - 2 * qRaw);
    if (q > 0.01) idle += dt * 0.018 * q;

    // Dwell mapping: the car slows at each of the seven screens.
    const c0 = 0.62 / 7, A = 0.72;
    const dwell = chase - (A / (14 * Math.PI)) * (Math.sin(14 * Math.PI * (chase - c0)) + Math.sin(14 * Math.PI * c0));
    const prev = cu;
    cu += (Math.min(0.985, Math.max(0, dwell)) + idle - cu) * 0.055;
    const du = cu - prev;

    // Car pose: steer, roll and pitch from the turn ahead and speed.
    sample(C.F, cu, pos, tan);
    side.crossVectors(tan, UP).normalize();
    car.position.copy(pos);
    car.lookAt(pos.x + tan.x, pos.y + tan.y, pos.z + tan.z);
    sample(C.F, cu + 0.006, ahead, aheadT);
    const turn = tan.x * aheadT.z - tan.z * aheadT.x;
    const speed = Math.abs(du) * C.len / Math.max(dt, 0.001);
    spin += du * C.len / 0.37;
    wheels.forEach((w, i) => {
      w.rotation.x = spin;
      if (i < 2) w.rotation.y = Math.max(-0.35, Math.min(0.35, -turn * 6));
    });
    const roll = Math.max(-0.08, Math.min(0.08, turn * speed * 0.06));
    body.rotation.z += (roll - body.rotation.z) * 0.1;
    body.rotation.x += (Math.min(0.03, speed * 0.0008) - body.rotation.x) * 0.1;
    body.position.y = speed < 0.5 ? Math.sin(t * 0.06) * 0.008 : 0;

    sun.position.set(pos.x + 18, pos.y + 36, pos.z + 12);
    sun.target.position.copy(pos);
    sun.target.updateMatrixWorld();
    if (head) {
      head.position.set(pos.x + tan.x * 2.2, pos.y + 0.7, pos.z + tan.z * 2.2);
      head.target.position.set(pos.x + tan.x * 22, pos.y - 0.5, pos.z + tan.z * 22);
      head.target.updateMatrixWorld();
    }
    under.position.set(pos.x, pos.y + 0.25, pos.z);

    // Trails shift only while moving, and pull in when the car stops.
    const moving = Math.abs(du) > 0.00001;
    for (const tr of trails) {
      const P = tr.pos;
      const hx = pos.x - tan.x * 2.45 + side.x * tr.off, hy = pos.y + 0.66, hz = pos.z - tan.z * 2.45 + side.z * tr.off;
      if (!tr.filled) { for (let i = 0; i < TRAIL; i++) P.set([hx, hy, hz], i * 3); tr.filled = true; }
      if (moving) P.copyWithin(3, 0, (TRAIL - 1) * 3);
      P[0] = hx; P[1] = hy; P[2] = hz;
      if (!moving) for (let i = 3; i < TRAIL * 3; i += 3) {
        P[i] += (hx - P[i]) * 0.08; P[i + 1] += (hy - P[i + 1]) * 0.08; P[i + 2] += (hz - P[i + 2]) * 0.08;
      }
      tr.g.attributes.position.needsUpdate = true;
    }

    // Sector and caption mode; tell React only on change.
    const nextMode: Mode = q > 0.45 ? 'map' : 'race';
    const lapU = ((cu % 1) + 1) % 1;
    const nextFront = Math.min(6, Math.floor(lapU * 7));
    if (nextMode !== mode || (nextMode === 'race' && nextFront !== front)) {
      mode = nextMode;
      if (mode === 'race') front = nextFront;
      o.onState(front, mode);
    }

    // Chase camera with mouse sway and a velocity lift.
    ptr.sx += (ptr.x - ptr.sx) * 0.05;
    ptr.sy += (ptr.y - ptr.sy) * 0.05;
    const back = narrow ? 10 : 8.2;
    chasePos.set(pos.x - tan.x * back + side.x * ptr.sx * 2.2, pos.y + 2.5 - ptr.sy * 0.8 + vel * 0.6,
      pos.z - tan.z * back + side.z * ptr.sx * 2.2);
    chaseLook.set(pos.x + tan.x * 6, pos.y + 0.9, pos.z + tan.z * 6);

    // Look bias: lean toward the screen just ahead so each screenshot gets a clear moment.
    let bias = 0, bb = boards[0];
    for (const b of boards) {
      let d = b.u - lapU;
      if (d < -0.5) d += 1;
      if (d > 0.5) d -= 1;
      const w = Math.exp(-(((d - 0.012) / 0.022) ** 2));
      if (w > bias) { bias = w; bb = b; }
    }
    if (q < 0.5) {
      chaseLook.lerp(bb.center, bias * 0.42 * (1 - q * 2));
      chasePos.y += bias * 0.9;
    }

    // Crane to the overhead track map. The prototype used a fixed height (span * 0.72), which
    // crops the outer screens; instead fit the circuit plus its raised screens to the frame.
    // Portrait screens view from the side so the long axis runs down the screen. The frame
    // is offset so the caption panel (bottom right, or bottom on phones) does not cover it.
    const portrait = camera.aspect < 1;
    const ex = C.bounds.maxX - C.bounds.minX + 60, ez = C.bounds.maxZ - C.bounds.minZ + 60;
    const across = portrait ? ez : ex, deep = portrait ? ex : ez;
    const dist = Math.max(across / 2 / (TAN_OV * camera.aspect * (portrait ? 0.92 : 0.74)),
      (deep * 0.85 + 16) / 2 / (TAN_OV * (portrait ? 0.7 : 0.85)));
    const ovH = dist / 1.177;
    const cx = C.centroid.x, cz = C.centroid.z;
    if (portrait) {
      const sh = dist * TAN_OV * 0.26; // nudge the circuit up, clear of the caption
      ovPos.set(cx + ovH * 0.62 + sh, ovH, cz + ptr.sx * 8);
      ovLook.set(cx + sh, 0, cz);
    } else {
      const sh = dist * TAN_OV * camera.aspect * 0.1; // nudge the circuit left of the caption
      ovPos.set(cx + sh + ptr.sx * 8, ovH, cz + ovH * 0.62 + ptr.sy * 6);
      ovLook.set(cx + sh, 0, cz);
    }
    chasePos.lerp(ovPos, q);
    chaseLook.lerp(ovLook, q);
    if (first) { camPos.copy(chasePos); camLook.copy(chaseLook); first = false; }
    camPos.lerp(chasePos, 0.09);
    camLook.lerp(chaseLook, 0.09);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    // 0.0016 at the prototype's overview distance; scaled so a farther fitted camera is not fogged out.
    fog.density = 0.011 * (1 - q) + Math.min(0.0016, 0.45 / dist) * q;
    const fov = (52 + Math.min(1, vel * 1.4) * 16) * (1 - q) + 38 * q;
    camera.fov += (fov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    if (probe) {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(screens, false)[0];
      hover = hit ? screens.indexOf(hit.object as THREE.Mesh) : -1;
      const p = projects[hover];
      canvas.style.cursor = p && (p.url || p.github) ? 'pointer' : '';
    }
    updateBoards(boards, { front, race: mode === 'race', hover, q, t, cam: camera.position, hot: cHot, acc: cAcc });

    renderer.render(scene, camera);
    if (o.map) drawMap(o.map, C, boards, { cu, race: mode === 'race', front, car: car.position, pal, dpr: mapDpr });
  };

  // Loop runs only while the hero is on screen and the tab is visible.
  let raf = 0, onScreen = true, ready = false;
  const loop = (t: number) => {
    raf = requestAnimationFrame(loop);
    frame(t);
    if (!ready) { ready = true; o.onReady(); }
  };
  const sync = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    if (onScreen && document.visibilityState === 'visible') raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); });
  io.observe(o.host);
  document.addEventListener('visibilitychange', sync);
  sync();

  return {
    /** Recolour the scene (kept so a palette switch can be added later). */
    setPalette(next: Palette) {
      pal = next;
      (scene.background as THREE.Color).set(pal.bg);
      fog.color.set(pal.bg);
      (C.ground.material as THREE.MeshStandardMaterial).color.set(pal.ground);
      (C.apron.material as THREE.MeshStandardMaterial).color.set(pal.apron);
      const ka = new THREE.Color(pal.kerbA), kb = new THREE.Color(pal.kerbB);
      for (let i = 0; i < C.kerbs.count; i++) C.kerbs.setColorAt(i, Math.floor(i / 2) % 2 ? ka : kb);
      if (C.kerbs.instanceColor) C.kerbs.instanceColor.needsUpdate = true;
      paint.color.set(pal.paint);
      under.color.set(pal.hot);
      cHot.set(pal.hot);
      cAcc.set(pal.acc);
      C.lamps.forEach((l) => l.material.color.set(pal.lamp));
      redraw(pal);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pointermove', onWinPtr);
      canvas.removeEventListener('pointermove', onPtr);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('webglcontextlost', onLost);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        for (const mat of mats) {
          for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
