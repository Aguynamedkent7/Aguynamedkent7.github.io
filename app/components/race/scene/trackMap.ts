import { N, type Circuit } from './circuit';
import type { Board } from './boards';
import type { Palette } from './palette';

export const MAP_W = 240, MAP_H = 150;

/** 2D mini-map: outline, lap so far, numbered screens, and the car. */
export function drawMap(m: HTMLCanvasElement, C: Circuit, boards: Board[], o: {
  cu: number; race: boolean; front: number; car: { x: number; z: number }; pal: Palette; dpr: number;
}) {
  const x = m.getContext('2d');
  if (!x) return;
  const pad = 14, b = C.bounds, c = o.pal;
  const sc = Math.min((MAP_W - pad * 2) / (b.maxX - b.minX), (MAP_H - pad * 2) / (b.maxZ - b.minZ));
  const ox = (MAP_W - (b.maxX - b.minX) * sc) / 2, oz = (MAP_H - (b.maxZ - b.minZ) * sc) / 2;
  const px = (p: { x: number; z: number }) => [ox + (p.x - b.minX) * sc, oz + (p.z - b.minZ) * sc];

  x.setTransform(o.dpr, 0, 0, o.dpr, 0, 0);
  x.clearRect(0, 0, MAP_W, MAP_H);
  x.lineJoin = x.lineCap = 'round';
  x.beginPath();
  for (let i = 0; i <= N; i += 8) {
    const [a, z] = px(C.F[i % N].p);
    if (i) x.lineTo(a, z); else x.moveTo(a, z);
  }
  x.closePath();
  x.strokeStyle = c.line3; x.lineWidth = 7; x.stroke();
  x.strokeStyle = c.t4; x.lineWidth = 1.5; x.stroke();

  if (o.race) {
    const end = Math.floor((((o.cu % 1) + 1) % 1) * N);
    x.beginPath();
    for (let i = 0; i <= end; i += 4) {
      const [a, z] = px(C.F[i].p);
      if (i) x.lineTo(a, z); else x.moveTo(a, z);
    }
    x.strokeStyle = c.hot; x.lineWidth = 2.5; x.stroke();
  }

  x.font = `600 10px ${getComputedStyle(m).getPropertyValue('--font-mono') || 'monospace'}`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  boards.forEach((bd, i) => {
    const [a, z] = px(bd.base);
    const on = (o.race && i === o.front) || bd.hov > 0.5;
    x.fillStyle = on ? c.hot : c.line;
    x.fillRect(a - 8, z - 8, 16, 16);
    x.fillStyle = on ? c.onHot : c.t2;
    x.fillText(String(i + 1), a, z + 0.5);
  });

  const [cx, cz] = px(o.car);
  x.beginPath(); x.arc(cx, cz, 8, 0, Math.PI * 2);
  x.globalAlpha = 0.28; x.fillStyle = c.hot; x.fill(); x.globalAlpha = 1;
  x.beginPath(); x.arc(cx, cz, 4, 0, Math.PI * 2);
  x.fillStyle = c.hot; x.fill();
  x.strokeStyle = c.t1; x.lineWidth = 1.5; x.stroke();
}
