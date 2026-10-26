import * as THREE from 'three';
import type { Project } from '../../../content';
import circuit from './circuit.json';
import { N, W, outside, type Circuit } from './circuit';
import type { Palette } from './palette';
import { boardTex } from './textures';

const B = circuit.boards;
const [SW, SH] = B.screenSize;
const CY = B.screenCenterHeight;

export type Board = {
  g: THREE.Group; screen: THREE.Mesh; frame: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  tag: THREE.Sprite; base: THREE.Vector3; baseQ: THREE.Quaternion; center: THREE.Vector3;
  u: number; i: number; s: number; hov: number;
};

/** Seven trackside screens, one per project, facing the approaching car. */
export function buildBoards(scene: THREE.Scene, projects: Project[], C: Circuit, c: Palette,
  glow: THREE.Texture, anisotropy: number) {
  const loader = new THREE.TextureLoader();
  const titleCards: [THREE.MeshBasicMaterial, Project][] = [];
  const backMat = new THREE.MeshStandardMaterial({ color: 0x15171B, roughness: 0.6 });

  const boards: Board[] = projects.map((p, i) => {
    const u = (i + 0.62) / projects.length;
    const fi = Math.floor(u * N) % N;
    const f = C.F[fi], o = (W / 2 + B.offsetFromEdge) * outside(f, C.centroid);
    const base = new THREE.Vector3(f.p.x + f.s.x * o, f.p.y, f.p.z + f.s.z * o);
    const g = new THREE.Group();
    g.position.copy(base);

    // Unlit, untoned, unfogged so screenshots stay bright and sharp. The polygon offset keeps
    // the screen in front of its frame and back box from the far overview camera.
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    if (p.image) {
      mat.color.set(0x30333A);
      loader.load(p.image, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = anisotropy;
        mat.map = tex;
        mat.color.set(0xffffff);
        mat.needsUpdate = true;
      });
    } else {
      mat.map = boardTex(p, c);
      titleCards.push([mat, p]);
    }
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), mat);
    screen.position.y = CY;
    const back = new THREE.Mesh(new THREE.BoxGeometry(SW + 0.6, SH + 0.6, 0.4), backMat);
    back.position.set(0, CY, -0.24);
    back.castShadow = true;
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(SW + 0.9, SH + 0.9), new THREE.MeshBasicMaterial({
      color: c.hot, transparent: true, opacity: 0, toneMapped: false, fog: false }));
    frame.position.set(0, CY, -0.02);
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: c.hot,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
    tag.scale.set(34, 24, 1);
    tag.position.set(0, CY, -1.2);
    g.add(screen, back, frame, tag);
    for (const sx of [-5, 5]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8.6, 0.4), C.steel);
      post.position.set(sx, 2.5, -0.3);
      post.castShadow = true;
      g.add(post);
    }
    const look = C.F[(fi - B.facesSamplesBehind + N) % N].p;
    g.lookAt(look.x, base.y, look.z);
    scene.add(g);
    return { g, screen, frame, tag, base, baseQ: g.quaternion.clone(),
      center: new THREE.Vector3(base.x, base.y + CY, base.z), u, i, s: 1, hov: 0 };
  });

  /** Redraw title cards (after web fonts load). */
  const redraw = (pal: Palette) => titleCards.forEach(([m, p]) => {
    m.map?.dispose();
    m.map = boardTex(p, pal);
    m.needsUpdate = true;
  });

  return { boards, redraw };
}

const tmp = new THREE.Object3D();
const tq = new THREE.Quaternion();

/**
 * Per-frame screen state: glow for the active/hovered screen, and in the overview
 * (q -> 1) screens rise, scale up and turn to face the camera.
 */
export function updateBoards(boards: Board[], o: {
  front: number; race: boolean; hover: number; q: number; t: number;
  cam: THREE.Vector3; hot: THREE.Color; acc: THREE.Color;
}) {
  const { lift, extraScale } = B.overview;
  for (const b of boards) {
    const act = o.race && b.i === o.front;
    b.hov += ((b.i === o.hover ? 1 : 0) - b.hov) * 0.15;
    const m = b.frame.material;
    m.opacity += (Math.max(act ? 1 : 0, b.hov, o.q * 0.35) - m.opacity) * 0.12;
    m.color.copy(act || b.hov > 0.3 ? o.hot : o.acc);
    b.tag.material.color.copy(m.color);
    b.tag.material.opacity = m.opacity * 0.35;
    tmp.position.copy(b.base);
    tmp.position.y += o.q * lift;
    tmp.lookAt(o.cam);
    b.g.quaternion.copy(tq.copy(b.baseQ).slerp(tmp.quaternion, o.q));
    b.s += (1 + o.q * extraScale + b.hov * 0.12 + (act ? 0.05 : 0) - b.s) * 0.12;
    b.g.scale.setScalar(b.s);
    b.g.position.set(b.base.x, b.base.y + o.q * lift + Math.sin(o.t * 0.0012 + b.i) * 0.4 * o.q, b.base.z);
  }
}
