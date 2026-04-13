'use client';
/**
 * components/ui/WaveformPlayer.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Animated waveform audio player — replaces the default <audio> control.
 * Shows animated bars that pulse in sync with playback.
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface WaveformPlayerProps {
  src: string;
  autoPlay?: boolean;
  /** 'ai' shows brand colour bars; 'user' shows white bars */
  variant?: 'ai' | 'user';
  /** Duration label in seconds (optional) */
  durationSec?: number;
}

const BAR_COUNT = 28;

export function WaveformPlayer({ src, autoPlay = false, variant = 'ai', durationSec }: WaveformPlayerProps) {
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);  // 0–1
  const [elapsed,  setElapsed]  = useState(0);  // seconds

  // Heights pre-generated for visual variety (deterministic)
  const barHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
    const base = Math.sin(i * 1.3) * 0.5 + 0.5;
    return 0.2 + base * 0.8;
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => {
      const dur = audio.duration || 1;
      setProgress(audio.currentTime / dur);
      setElapsed(Math.floor(audio.currentTime));
    };
    const onEnded = () => { setPlaying(false); setProgress(0); setElapsed(0); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    if (autoPlay) { audio.play().then(() => setPlaying(true)).catch(() => {}); }
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src, autoPlay]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  function restart() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setProgress(0);
    setElapsed(0);
    audio.play().then(() => setPlaying(true)).catch(() => {});
  }

  const barColor  = variant === 'user' ? '#ffffff' : 'var(--color-brand, #7C3AED)';
  const barColorDim = variant === 'user' ? 'rgba(255,255,255,0.35)' : 'rgba(124,58,237,0.3)';
  const iconColor = variant === 'user' ? 'text-white' : 'text-brand';

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 py-1">
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      {/* Play / Pause */}
      <button
        onClick={progress >= 0.99 ? restart : toggle}
        aria-label={progress >= 0.99 ? 'Replay' : playing ? 'Pause' : 'Play'}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 hover:scale-105 active:scale-95 ${
          variant === 'user'
            ? 'bg-white/20 hover:bg-white/30'
            : 'bg-brand/15 hover:bg-brand/25'
        } ${iconColor}`}
      >
        {progress >= 0.99
          ? <RotateCcw size={13} />
          : playing
          ? <Pause size={13} />
          : <Play  size={13} className="ml-0.5" />
        }
      </button>

      {/* Waveform bars */}
      <div className="flex items-end gap-[2px] h-7 flex-1 min-w-0">
        {barHeights.map((h, i) => {
          const barProgress = i / BAR_COUNT;
          const active = barProgress <= progress;
          const isAnimating = playing && Math.abs(barProgress - progress) < 0.12;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-75 ${isAnimating ? 'animate-waveform' : ''}`}
              style={{
                height:     `${(isAnimating ? Math.max(h, 0.4) : h) * 100}%`,
                background: active ? barColor : barColorDim,
                animationDelay: `${(i % 5) * 60}ms`,
              }}
            />
          );
        })}
      </div>

      {/* Duration / elapsed */}
      <span className={`text-[10px] font-mono flex-shrink-0 ${variant === 'user' ? 'text-white/70' : 'text-muted'}`}>
        {playing || elapsed > 0
          ? fmt(elapsed)
          : durationSec ? fmt(durationSec) : '--:--'
        }
      </span>
    </div>
  );
}
