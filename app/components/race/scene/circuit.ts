import * as THREE from 'three';
import circuit from './circuit.json';
import type { Palette } from './palette';
import type { Tier } from './quality';
import { asphaltTex, checkerTex } from './textures';

export type Frame = { p: THREE.Vector3; t: THREE.Vector3; s: THREE.Vector3 };

export const N = circuit.samples;
export const W = circuit.trackWidth;
const UP = new THREE.Vector3(0, 1, 0);

/** Interpolated point (and tangent) at lap fraction u, wrapping. */
export function sample(F: Frame[], u: number, outP: THREE.Vector3, outT?: THREE.Vector3) {
  const x = (((u % 1) + 1) % 1) * N;
  const i = Math.floor(x), f = x - i;
  const A = F[i % N], B = F[(i + 1) % N];
  outP.copy(A.p).lerp(B.p, f);
  if (outT) outT.copy(A.t).lerp(B.t, f).normalize();
}

/** +1 or -1: which side of the track is away from the circuit's centroid. */
export const outside = (f: Frame, centroid: THREE.Vector3) =>
  Math.sign(new THREE.Vector3().subVectors(f.p, centroid).dot(f.s)) || 1;

/** Track, apron, ground, grid, kerbs, floodlights and start gantry. */
export function buildCircuit(scene: THREE.Scene, c: Palette, tier: Tier, glow: THREE.Texture) {
  const pts = circuit.points.map(([x, z], i) =>
    new THREE.Vector3(x * circuit.scale, Math.sin(i * 0.8) * 1.4, z * circuit.scale));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  const len = curve.getLength();

  const F: Frame[] = [];
  const centroid = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const p = curve.getPointAt(i / N), t = curve.getTangentAt(i / N);
    F.push({ p, t, s: new THREE.Vector3().crossVectors(t, UP).normalize() });
    centroid.add(p);
  }
  centroid.divideScalar(N);

  const ribbon = (width: number, yOff: number) => {
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    for (let i = 0; i <= N; i++) {
      const { p, s } = F[i % N];
      pos.push(p.x + s.x * width / 2, p.y + yOff, p.z + s.z * width / 2,
        p.x - s.x * width / 2, p.y + yOff, p.z - s.z * width / 2);
      const v = (i / N) * len / circuit.uvRepeatUnits;
      uv.push(0, v, 1, v);
      if (i < N) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  };
  const track = new THREE.Mesh(ribbon(W, 0), new THREE.MeshStandardMaterial({
    map: asphaltTex(), roughness: 0.82, metalness: 0.05, side: THREE.DoubleSide }));
  track.receiveShadow = true;
  const apron = new THREE.Mesh(ribbon(W + circuit.apronExtraWidth, -0.06),
    new THREE.MeshStandardMaterial({ color: c.apron, roughness: 1, side: THREE.DoubleSide }));
  apron.receiveShadow = true;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200),
    new THREE.MeshStandardMaterial({ color: c.ground, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.8;
  ground.receiveShadow = true;
  const grid = new THREE.GridHelper(1200, 240, c.g1, c.g2);
  grid.position.y = -1.75;
  scene.add(track, apron, ground, grid);

  // Kerbs where the track turns, alternating colours, both sides.
  const k = circuit.kerbs;
  const dummy = new THREE.Object3D();
  const kerbAt: number[] = [];
  for (let i = 0; i < N; i += k.everyNSamples)
    if (F[i].t.angleTo(F[(i + k.lookAhead) % N].t) > k.minAngleRad) kerbAt.push(i);
  const kerbs = new THREE.InstancedMesh(new THREE.BoxGeometry(...(k.size as [number, number, number])),
    new THREE.MeshStandardMaterial({ roughness: 0.55 }), kerbAt.length * 2);
  const ka = new THREE.Color(c.kerbA), kb = new THREE.Color(c.kerbB);
  let n = 0;
  kerbAt.forEach((i, j) => {
    const f = F[i];
    for (const sg of [1, -1]) {
      const o = (W / 2 + k.offsetFromEdge) * sg;
      dummy.position.set(f.p.x + f.s.x * o, f.p.y + 0.03, f.p.z + f.s.z * o);
      dummy.lookAt(dummy.position.x + f.t.x, dummy.position.y + f.t.y, dummy.position.z + f.t.z);
      dummy.updateMatrix();
      kerbs.setMatrixAt(n, dummy.matrix);
      kerbs.setColorAt(n++, j % 2 ? ka : kb);
    }
  });
  kerbs.receiveShadow = true;
  scene.add(kerbs);

  // Floodlights on the outside of the track (every other one on the low tier).
  const fl = circuit.floodlights;
  const step = fl.everyNSamples * (tier === 'low' ? 2 : 1);
  const poleAt: number[] = [];
  for (let i = 0; i < N; i += step) poleAt.push(i);
  const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.16, 11, 8),
    new THREE.MeshStandardMaterial({ color: 0x2A2D33, roughness: 0.7 }), poleAt.length);
  const lampGeo = new THREE.SphereGeometry(0.28, 12, 8);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xFFF1E0 });
  const lamps: THREE.Sprite[] = [];
  poleAt.forEach((i, j) => {
    const f = F[i], o = (W / 2 + fl.offsetFromEdge) * outside(f, centroid);
    const x = f.p.x + f.s.x * o, z = f.p.z + f.s.z * o;
    dummy.position.set(x, f.p.y + 3.7, z);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    poles.setMatrixAt(j, dummy.matrix);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: c.lamp,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7 }));
    sp.position.set(x, f.p.y + fl.height, z);
    sp.scale.set(4, 4, 1);
    const bulb = new THREE.Mesh(lampGeo, lampMat);
    bulb.position.copy(sp.position);
    scene.add(sp, bulb);
    lamps.push(sp);
  });
  scene.add(poles);

  // Start/finish strip and gantry.
  const f0 = F[0];
  const checker = checkerTex();
  const sf = new THREE.Mesh(new THREE.PlaneGeometry(W, 1.6),
    new THREE.MeshStandardMaterial({ map: checker, roughness: 0.7 }));
  sf.position.set(f0.p.x, f0.p.y + 0.015, f0.p.z);
  sf.rotation.x = -Math.PI / 2;
  sf.rotation.z = Math.atan2(f0.t.x, f0.t.z);
  sf.receiveShadow = true;
  const steel = new THREE.MeshStandardMaterial({ color: 0x23262C, roughness: 0.6 });
  const gantry = new THREE.Group();
  for (const sg of [1, -1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.4, 7.5, 0.4), steel);
    post.position.set(sg * (W / 2 + 1.2), 3.75, 0);
    post.castShadow = true;
    gantry.add(post);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(W + 3, 1.1, 0.5), steel);
  beam.position.y = 7.4;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W + 2.4, 0.5), new THREE.MeshBasicMaterial({ map: checker }));
  face.position.set(0, 7.4, 0.26);
  const back = face.clone();
  back.rotation.y = Math.PI;
  back.position.z = -0.26;
  gantry.add(beam, face, back);
  gantry.position.copy(f0.p);
  gantry.lookAt(f0.p.x + f0.t.x, f0.p.y, f0.p.z + f0.t.z);
  scene.add(sf, gantry);

  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const { p } of F) {
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
  }

  return {
    F, len, centroid, steel, lamps, kerbs, ground, apron, grid,
    bounds: { minX, maxX, minZ, maxZ },
  };
}

export type Circuit = ReturnType<typeof buildCircuit>;
