import * as THREE from 'three';
import type { Palette } from './palette';
import { numberTex } from './textures';

/** GT car from primitives (prototype buildCar). Faces +z; wheels radius 0.37. */
export function buildCar(c: Palette, glow: THREE.Texture) {
  const car = new THREE.Group();
  const body = new THREE.Group();
  car.add(body);
  const paint = new THREE.MeshPhysicalMaterial({
    color: c.paint, metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15171B, metalness: 0.4, roughness: 0.5 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0B0C0E, metalness: 0.9, roughness: 0.08, clearcoat: 1 });

  const extrude = (pts: number[][], depth: number, mat: THREE.Material, bevel: number) => {
    const s = new THREE.Shape();
    s.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) s.lineTo(x, y);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, steps: 1 });
    g.translate(0, 0, -depth / 2);
    g.rotateY(-Math.PI / 2);
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    return m;
  };
  const box = (size: [number, number, number], mat: THREE.Material, pos: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
    m.position.set(...pos);
    body.add(m);
    return m;
  };

  body.add(extrude([[-2.3, 0.22], [-2.36, 0.72], [-1.7, 0.84], [0.9, 0.8], [1.9, 0.6], [2.38, 0.38], [2.3, 0.22]], 1.86, paint, 0.08));
  body.add(extrude([[-1.35, 0.8], [-0.85, 1.24], [0.25, 1.27], [0.95, 0.82]], 1.42, glass, 0.06));
  box([0.36, 0.02, 4.4], dark, [0, 0.86, 0.05]);
  box([0.36, 0.02, 1.0], dark, [0, 1.335, 0.32]).rotation.x = -0.02;
  box([2.0, 0.06, 0.4], dark, [0, 0.2, 2.3]);
  box([1.9, 0.2, 0.25], dark, [0, 0.26, -2.38]);
  const wing = box([2.05, 0.06, 0.48], dark, [0, 1.2, -2.05]);
  wing.rotation.x = 0.12;
  wing.castShadow = true;
  for (const sx of [-0.62, 0.62]) box([0.06, 0.42, 0.18], dark, [sx, 0.98, -1.98]);
  for (const sx of [-1.04, 1.04]) box([0.04, 0.26, 0.56], paint, [sx, 1.2, -2.05]);

  const num = new THREE.MeshBasicMaterial({ map: numberTex(), transparent: true });
  for (const sx of [-1, 1]) {
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), num);
    d.position.set(sx * 1.005, 0.56, -0.1);
    d.rotation.y = sx * Math.PI / 2;
    body.add(d);
  }
  const hood = new THREE.Mesh(new THREE.CircleGeometry(0.26, 32), num);
  hood.position.set(0, 0.9, 1.25);
  hood.rotation.x = -Math.PI / 2 + 0.1;
  body.add(hood);

  const headM = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const tailM = new THREE.MeshBasicMaterial({ color: 0xFF3B1F });
  const sprite = (color: number, opacity: number, size: number, pos: [number, number, number]) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.scale.set(size, size, 1);
    s.position.set(...pos);
    body.add(s);
  };
  for (const sx of [-0.62, 0.62]) {
    box([0.42, 0.08, 0.06], headM, [sx, 0.48, 2.38]);
    sprite(0xFFF4E0, 0.85, 1.3, [sx, 0.48, 2.5]);
    box([0.5, 0.07, 0.06], tailM, [sx, 0.66, -2.39]);
    sprite(0xFF3B1F, 0.9, 1.1, [sx, 0.66, -2.5]);
  }

  const tire = new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.85 });
  const rim = new THREE.MeshStandardMaterial({ color: 0x9A9EA6, metalness: 0.85, roughness: 0.3 });
  const tg = new THREE.CylinderGeometry(0.37, 0.37, 0.32, 28).rotateZ(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(0.24, 0.24, 0.34, 6).rotateZ(Math.PI / 2);
  const wheels = [[-0.95, 1.45], [0.95, 1.45], [-0.95, -1.5], [0.95, -1.5]].map(([sx, sz]) => {
    const w = new THREE.Group();
    w.rotation.order = 'YXZ';
    w.position.set(sx, 0.37, sz);
    const t = new THREE.Mesh(tg, tire);
    t.castShadow = true;
    w.add(t, new THREE.Mesh(rg, rim));
    car.add(w);
    return w;
  });

  return { car, body, wheels, paint, num };
}
