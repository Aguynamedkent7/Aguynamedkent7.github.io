'use client';

import { useEffect, useRef, useState } from 'react';
import { replaySegments, type SectionId } from '../data';

const VIDEO_SRC = '/forport.mp4';

interface ReplayBackgroundProps {
  activeSection: SectionId;
  onScrubChange?: (scrubbing: boolean) => void;
  onPOVChange?: (pov: string) => void;
}

type VideoState = 'loading' | 'ready' | 'scrubbing' | 'missing';

const SCRUB_DURATION_MS = 300;

export default function ReplayBackground({
  activeSection,
  onScrubChange,
  onPOVChange,
}: ReplayBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>('loading');
  const [loadProgress, setLoadProgress] = useState(0);
  const [devTimestamp, setDevTimestamp] = useState<string | null>(null);
  const scrubRafRef = useRef<number>(0);

  const segment = replaySegments[activeSection];

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoadedMetadata = () => {
      setVideoState('ready');
      v.currentTime = segment.start;
      v.playbackRate = 1;
      v.play().catch(() => {});
    };

    const onError = () => setVideoState('missing');
    const onCanPlay = () => {
      setVideoState((prev) => (prev === 'loading' || prev === 'missing' ? 'ready' : prev));
    };
    const onProgress = () => {
      const b = v.buffered;
      if (b.length === 0) return;
      const loaded = b.end(b.length - 1);
      if (!Number.isFinite(v.duration) || v.duration === 0) return;
      setLoadProgress(Math.min(loaded / v.duration, 1));
    };
    const onPlaying = () => setVideoState('ready');

    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('error', onError);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('progress', onProgress);
    v.addEventListener('playing', onPlaying);

    return () => {
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('error', onError);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('playing', onPlaying);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoState !== 'ready' && videoState !== 'scrubbing') return;

    const v = videoRef.current;
    if (!v || !segment) return;

    onPOVChange?.(segment.pov);

    if (v.currentTime < segment.start - 0.5 || v.currentTime > segment.end) {
      const from = v.currentTime;
      const to = segment.start;

      setVideoState('scrubbing');
      onScrubChange?.(true);
      v.pause();

      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / SCRUB_DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        v.currentTime = from + (to - from) * eased;

        if (progress < 1) {
          scrubRafRef.current = requestAnimationFrame(tick);
        } else {
          v.currentTime = to;
          v.playbackRate = 1;
          v.play().catch(() => {});
          setVideoState('ready');
          onScrubChange?.(false);
        }
      };

      scrubRafRef.current = requestAnimationFrame(tick);
    } else {
      v.playbackRate = 1;
      v.play().catch(() => {});
    }
  }, [activeSection]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (videoState !== 'ready') return;

    const v = videoRef.current;
    if (!v || !segment) return;

    const onTimeUpdate = () => {
      if (v.currentTime >= segment.end) {
        v.currentTime = segment.start;
      }
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    return () => v.removeEventListener('timeupdate', onTimeUpdate);
  }, [videoState, segment]);

  useEffect(() => {
    return () => cancelAnimationFrame(scrubRafRef.current);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'k' && e.key !== 'K') return;
      const v = videoRef.current;
      if (!v) return;
      const t = v.currentTime;
      const mins = Math.floor(t / 60);
      const secs = (t % 60).toFixed(1);
      const stamp = `T+ ${String(mins).padStart(2, '0')}:${secs.padStart(3, '4')}`;
      console.log(stamp, t);
      setDevTimestamp(stamp);
      setTimeout(() => setDevTimestamp(null), 2000);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      {/* Ambient fallback — shown while loading or when the replay is missing */}
      <div
        className="absolute inset-0 z-0 bg-slate"
        style={{
          background:
            'radial-gradient(ellipse at 70% 20%, rgba(0,212,255,0.07), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.03), transparent 50%), #0A0A0F',
        }}
      />

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        src={VIDEO_SRC}
        className={`absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoState === 'ready' || videoState === 'scrubbing' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {videoState === 'loading' && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-center pb-20">
          <div className="w-72 px-4 py-3 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-accent mb-2">
              <span>Acquiring Replay</span>
              <span>{Math.round(loadProgress * 100)}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {devTimestamp && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-lg bg-accent/20 border border-accent/40 backdrop-blur-md font-mono text-xs text-accent tracking-wider">
          {devTimestamp}
        </div>
      )}
    </>
  );
}