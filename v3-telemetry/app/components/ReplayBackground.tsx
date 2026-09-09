'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { replaySegments, type SectionId } from '../data';

const VIDEO_SRC = '/replay.mp4';

const Showroom = dynamic(() => import('../Showroom'), { ssr: false });

interface ReplayBackgroundProps {
  activeSection: SectionId;
  onScrubChange?: (scrubbing: boolean) => void;
  onPOVChange?: (pov: string) => void;
}

type VideoState = 'loading' | 'ready' | 'scrubbing' | 'error' | 'missing';

export default function ReplayBackground({
  activeSection,
  onScrubChange,
  onPOVChange,
}: ReplayBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>('loading');
  // showroomFallback computed inline below
  const [devTimestamp, setDevTimestamp] = useState<string | null>(null);
  const scrubTargetRef = useRef<number | null>(null);

  const segment = replaySegments[activeSection];

  const seekToSegment = useCallback(
    (rate: number) => {
      const v = videoRef.current;
      if (!v || !segment) return;
      if (rate === 1) {
        v.currentTime = segment.start;
      }
      v.playbackRate = rate;
      v.play().catch(() => {});
    },
    [segment],
  );

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
      if (videoState === 'loading' || videoState === 'missing') {
        setVideoState('ready');
      }
    };

    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('error', onError);
    v.addEventListener('canplay', onCanPlay);

    return () => {
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('error', onError);
      v.removeEventListener('canplay', onCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoState !== 'ready' && videoState !== 'scrubbing') return;

    const v = videoRef.current;
    if (!v || !segment) return;

    onPOVChange?.(segment.pov);

    if (v.currentTime < segment.start - 0.5 || v.currentTime > segment.end) {
      setVideoState('scrubbing');
      onScrubChange?.(true);
      scrubTargetRef.current = segment.start;
      seekToSegment(6);
    } else {
      seekToSegment(1);
    }
  }, [activeSection, videoState, segment, onPOVChange, onScrubChange, seekToSegment]);

  useEffect(() => {
    if (videoState !== 'scrubbing') return;

    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      const target = scrubTargetRef.current;
      if (target === null) return;
      if (v.currentTime >= target - 0.5) {
        v.currentTime = target;
        v.playbackRate = 1;
        v.play().catch(() => {});
        setVideoState('ready');
        onScrubChange?.(false);
        scrubTargetRef.current = null;
        v.removeEventListener('timeupdate', onTimeUpdate);
      }
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    return () => v.removeEventListener('timeupdate', onTimeUpdate);
  }, [videoState, onScrubChange]);

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
    if (videoState !== 'loading') return;
    const t = setTimeout(() => setVideoState('missing'), 2000);
    return () => clearTimeout(t);
  }, [videoState]);

  const showroomFallback = videoState === 'loading' || videoState === 'missing' || videoState === 'error';

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

      {showroomFallback && (
        <div className="absolute inset-0 z-0">
          <Showroom
            activeSection={
              activeSection === 'career'
                ? 'about'
                : activeSection === 'telemetry'
                  ? 'projects'
                  : activeSection
            }
          />
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
