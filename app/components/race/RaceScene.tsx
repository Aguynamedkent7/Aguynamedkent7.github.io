'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { projects } from '../../content';
import { createRaceScene, type Mode } from './scene/createRaceScene';
import type { Tier } from './scene/quality';

/** Mounts the WebGL scene. Loaded with next/dynamic so Three.js is its own lazy chunk. */
export default function RaceScene({ tier, host, map, progress, velocity, onState, onReady, onLost }: {
  tier: Exclude<Tier, 'poster'>;
  host: RefObject<HTMLElement | null>;
  map: RefObject<HTMLCanvasElement | null>;
  progress: RefObject<number>;
  velocity: RefObject<number>;
  onState: (front: number, mode: Mode) => void;
  onReady: () => void;
  onLost: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Latest callbacks without re-creating the scene.
  const cb = useRef({ onState, onReady, onLost });
  useEffect(() => { cb.current = { onState, onReady, onLost }; });

  useEffect(() => {
    if (!canvas.current || !host.current) return;
    const scene = createRaceScene({
      canvas: canvas.current, map: map.current, host: host.current, projects, tier,
      getProgress: () => progress.current,
      getVelocity: () => velocity.current,
      onState: (f, m) => cb.current.onState(f, m),
      onReady: () => cb.current.onReady(),
      onLost: () => cb.current.onLost(),
    });
    return () => scene.dispose();
  }, [tier, host, map, progress, velocity]);

  return <canvas ref={canvas} className="race-canvas" aria-hidden="true" />;
}
