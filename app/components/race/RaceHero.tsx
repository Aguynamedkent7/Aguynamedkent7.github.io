'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '../../content';
import { useScrollVelocity } from '../motion/useScrollVelocity';
import RaceCaption from './RaceCaption';
import { PosterCircuit, PosterList } from './RacePoster';
import type { Mode } from './scene/createRaceScene';
import { pickTier, type Tier } from './scene/quality';

gsap.registerPlugin(ScrollTrigger);

const RaceScene = dynamic(() => import('./RaceScene'), { ssr: false });

// The tier is decided once per page load; null while server rendering.
let tierCache: Tier | null = null;
const noop = () => () => {};
const getTier = () => (tierCache ??= pickTier());

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Scroll-driven hero: a pinned stage where scrolling drives one lap of the circuit.
 * Per-frame DOM changes go through refs; React state changes only with the sector or mode.
 */
export default function RaceHero() {
  const host = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const velocity = useScrollVelocity();
  const detected = useSyncExternalStore(noop, getTier, () => null);
  const [lost, setLost] = useState(false);
  const tier: Tier | null = lost ? 'poster' : detected;
  const [ready, setReady] = useState(false);
  const live = useRef(false);
  const [{ front, mode }, setCap] = useState<{ front: number; mode: Mode }>({ front: 0, mode: 'race' });

  const onState = useCallback((f: number, m: Mode) => {
    setCap((s) => (s.front === f && s.mode === m ? s : { front: f, mode: m }));
  }, []);
  const onReady = useCallback(() => { live.current = true; setReady(true); }, []);
  const onLost = useCallback(() => { live.current = false; setLost(true); }, []);

  useEffect(() => {
    if (!tier || tier === 'poster' || !host.current) return;
    const apply = (p: number) => {
      progress.current = p;
      const i = clamp01(p / 0.06);
      if (intro.current) {
        intro.current.style.opacity = (1 - i).toFixed(3);
        intro.current.style.transform = `translateY(${(-i * 80).toFixed(1)}px)`;
      }
      const c = clamp01((p - 0.03) / 0.05).toFixed(3);
      if (cap.current) cap.current.style.opacity = c;
      if (map.current?.parentElement) map.current.parentElement.style.opacity = c;
      // Until the scene is running, approximate the sector from scroll position.
      if (!live.current) onState(Math.min(6, Math.floor((p / 0.8) * 7)), p > 0.88 ? 'map' : 'race');
    };
    const st = ScrollTrigger.create({
      trigger: host.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => apply(self.progress),
    });
    apply(st.progress);
    return () => st.kill();
  }, [tier, onState]);

  const poster = tier === 'poster';
  const ready3d = ready && !poster;

  return (
    <section ref={host} className={poster ? 'race race--poster' : 'race'} aria-label="Intro">
      <a className="skip" href="#work">Skip the lap</a>
      <div className="race-pin">
        {tier && !poster && (
          <RaceScene tier={tier} host={host} map={map} progress={progress} velocity={velocity}
            onState={onState} onReady={onReady} onLost={onLost} />
        )}
        <div className={ready3d ? 'race-poster gone' : 'race-poster'}>
          <PosterCircuit active={!poster && mode === 'race' ? front : -1} />
        </div>

        <div ref={intro} className="race-intro">
          <span className="eyebrow fadein">{site.role} / {site.location}</span>
          <h1 className="h1 race-h1">
            <span className="h1line"><span>Kent</span></span>
            <span className="h1line"><span>Vincent</span></span>
            <span className="h1line"><span className="hot">Butaya</span></span>
          </h1>
          <div className="race-intro-copy fadein">
            <p className="subline">{site.tagline}</p>
            <p className="race-intro-text">
              {poster
                ? 'CS student and full-stack developer. Every marker on the circuit is a project.'
                : 'CS student and full-stack developer. Scroll to drive one lap: every screen on the circuit is a project.'}
            </p>
          </div>
        </div>

        {poster ? <PosterList /> : (
          <>
            <RaceCaption front={front} mode={mode} panel={cap} />
            <div className="race-map panel">
              <span className="caption">TRACK MAP</span>
              <canvas ref={map} aria-hidden="true" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
