import * as THREE from 'three';
import type { Project } from '../../../content';
import type { Palette } from './palette';

// next/font hashes family names, so read the real stack from the CSS variables.
const font = (v: '--font-display' | '--font-mono') =>
  getComputedStyle(document.documentElement).getPropertyValue(v).trim() || 'sans-serif';

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
};

const srgb = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export function glowTex() {
  const [c, x] = canvas(128, 128);
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function asphaltTex() {
  const [c, x] = canvas(512, 512);
  x.fillStyle = '#26292F';
  x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const v = (30 + Math.random() * 30) | 0;
    x.fillStyle = `rgba(${v},${v + 3},${v + 8},0.6)`;
    x.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  x.fillStyle = 'rgba(14,15,17,0.35)';
  x.fillRect(150, 0, 70, 512);
  x.fillRect(300, 0, 60, 512);
  x.fillStyle = '#E4E4E1';
  x.fillRect(14, 0, 10, 512);
  x.fillRect(488, 0, 10, 512);
  const t = srgb(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

export function checkerTex() {
  const [c, x] = canvas(256, 64);
  for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) {
    x.fillStyle = (i + j) % 2 ? '#0E0F11' : '#ECECEA';
    x.fillRect(i * 16, j * 16, 16, 16);
  }
  const t = srgb(c);
  t.magFilter = THREE.NearestFilter;
  return t;
}

export function numberTex() {
  const [c, x] = canvas(256, 256);
  x.fillStyle = '#ECECEA';
  x.beginPath();
  x.arc(128, 128, 118, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = '#0E0F11';
  x.font = `800 150px ${font('--font-display')}`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('07', 128, 136);
  return srgb(c);
}

/** Title card for projects without a screenshot. */
export function boardTex(p: Project, c: Palette) {
  const [cv, x] = canvas(1280, 800);
  const display = font('--font-display'), mono = font('--font-mono');
  x.fillStyle = c.s1;
  x.fillRect(0, 0, 1280, 800);
  x.strokeStyle = c.line;
  x.lineWidth = 2;
  for (let i = 80; i < 1280; i += 80) {
    x.beginPath();
    x.moveTo(i, 0);
    x.lineTo(i, 800);
    x.stroke();
  }
  x.fillStyle = c.hot;
  x.fillRect(0, 0, 18, 800);
  x.fillStyle = c.acc;
  x.font = `500 34px ${mono}`;
  x.fillText(p.category.toUpperCase(), 90, 120);
  x.strokeStyle = c.line3;
  x.lineWidth = 3;
  x.font = `800 300px ${display}`;
  x.strokeText(p.pos, 820, 360);
  x.fillStyle = c.t1;
  x.font = `800 170px ${display}`;
  x.fillText(p.name.toUpperCase(), 84, 560, 1120);
  x.fillStyle = c.t3;
  x.font = `500 34px ${mono}`;
  x.fillText(p.tags.join('  /  '), 90, 690, 1120);
  const t = srgb(cv);
  t.anisotropy = 8;
  return t;
}
