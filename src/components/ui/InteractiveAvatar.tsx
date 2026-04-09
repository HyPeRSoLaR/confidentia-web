'use client';

import React, {
  useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback,
} from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents, TaskType } from '@heygen/streaming-avatar';
import { Loader2, Mic, MicOff } from 'lucide-react';

export interface InteractiveAvatarRef {
  speak: (text: string) => Promise<void>;
}

interface Props {
  avatarId?:       string;
  onDisconnected?: () => void;
  /** Called once when the avatar stream is ready and playing. */
  onReady?:        () => void;
  /** Called if the WebRTC connection fails to establish. */
  onError?:        () => void;
}

// ─── Chroma key ───────────────────────────────────────────────────────────────
// HeyGen's green-screen colour is pure chroma-key green (~HSL 120°, 100%, 50%).
// Thresholds are intentionally conservative to preserve skin-tone mid-greens.
const GREEN_G_MIN   = 80;   // green channel must be high
const GREEN_RB_MAX  = 120;  // red and blue must be comparatively low
const GREEN_G_RATIO = 1.4;  // green must dominate by at least 40 %

/** Zero the alpha of any pixel that falls within the green-screen range. */
function applyChromaKey(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (
      g > GREEN_G_MIN &&
      r < GREEN_RB_MAX &&
      b < GREEN_RB_MAX &&
      g > r * GREEN_G_RATIO &&
      g > b * GREEN_G_RATIO
    ) {
      data[i + 3] = 0; // fully transparent
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ avatarId = 'Anna_public_3_20240108', onDisconnected, onReady, onError }, ref) => {
    const videoRef      = useRef<HTMLVideoElement>(null);
    const canvasRef     = useRef<HTMLCanvasElement>(null);
    const avatarRef     = useRef<StreamingAvatar | null>(null);
    const rafRef        = useRef<number>(0);

    const [stream,        setStream]        = useState<MediaStream | null>(null);
    const [loading,       setLoading]       = useState(true);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [hasError,      setHasError]      = useState(false);
    const lastFrameRef    = useRef<number>(0);

    // ── Chroma key loop ────────────────────────────────────────────────────────
    const startChromaLoop = useCallback(() => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Throttle to ~30 fps to reduce main-thread pressure during WebRTC audio
      const TARGET_FPS = 30;
      const FRAME_MS   = 1000 / TARGET_FPS;

      function tick(now: number) {
        if (!video || !canvas || !ctx) return;
        if (now - lastFrameRef.current >= FRAME_MS) {
          lastFrameRef.current = now;
          if (video.readyState >= 2 && video.videoWidth > 0) {
            if (canvas.width !== video.videoWidth) {
              canvas.width  = video.videoWidth;
              canvas.height = video.videoHeight;
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applyChromaKey(frame.data);
            ctx.putImageData(frame, 0, 0);
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
    }, []);

    const stopChromaLoop = useCallback(() => {
      cancelAnimationFrame(rafRef.current);
    }, []);

    // ── WebRTC avatar init ─────────────────────────────────────────────────────
    useEffect(() => {
      let mounted = true;

      async function init() {
        try {
          const res = await fetch('/api/heygen-token', { method: 'POST' });
          if (!res.ok) throw new Error(`Token request failed: ${res.status}`);
          const { token } = await res.json();
          if (!mounted) return;

          const avatar = new StreamingAvatar({ token });
          avatarRef.current = avatar;

          avatar.on(StreamingEvents.STREAM_READY, (e: any) => {
            if (mounted) {
              setStream(e.detail);
              setLoading(false);
              onReady?.();
            }
          });

          avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
            if (mounted) {
              setStream(null);
              stopChromaLoop();
              onDisconnected?.();
            }
          });

          await avatar.createStartAvatar({
            quality:          AvatarQuality.Low,
            avatarName:       avatarId,
            useSilencePrompt: false,
          });

          // Fallback: if STREAM_READY never fires, unlock UI after 12 s
          setTimeout(() => {
            if (mounted && loading) setLoading(false);
          }, 12_000);
        } catch (err) {
          console.error('[HeyGen WebRTC] Init Error:', err);
          if (mounted) {
            setLoading(false);
            setHasError(true);
            onError?.();
          }
        }
      }

      init();

      return () => {
        mounted = false;
        stopChromaLoop();
        avatarRef.current?.stopAvatar().catch(console.error);
        avatarRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [avatarId]);

    // ── Sync avatar stream → hidden video → chroma canvas ─────────────────────
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !stream) return;
      video.srcObject = stream;

      // Start chroma loop once the video has enough data to play
      const onCanPlay = () => {
        video.play().catch(console.error);
        startChromaLoop();
      };
      video.addEventListener('canplay', onCanPlay, { once: true });
      return () => video.removeEventListener('canplay', onCanPlay);
    }, [stream, startChromaLoop]);

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    useEffect(() => {
      return () => { stopChromaLoop(); };
    }, [stopChromaLoop]);

    // ── Voice toggle ──────────────────────────────────────────────────────────
    // NOTE: We do NOT call getUserMedia ourselves — HeyGen's startVoiceChat()
    // handles mic access internally. Claiming the mic before calling startVoiceChat
    // creates two competing audio capture contexts on the same device, which
    // freezes the WebRTC pipeline and silences the avatar.
    const toggleVoiceChat = async () => {
      if (!avatarRef.current) return;
      try {
        if (isVoiceActive) {
          await avatarRef.current.closeVoiceChat();
          setIsVoiceActive(false);
        } else {
          await avatarRef.current.startVoiceChat({ useSilencePrompt: false });
          setIsVoiceActive(true);
        }
      } catch (err) {
        console.error('[InteractiveAvatar] Voice chat toggle failed:', err);
      }
    };

    // ── Expose speak() to parent ──────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: async (text: string) => {
        if (avatarRef.current) {
          await avatarRef.current.speak({ text, taskType: TaskType.TALK });
        } else {
          console.warn('[InteractiveAvatar] Avatar not yet connected.');
        }
      },
    }));

    // ── Error state ───────────────────────────────────────────────────────────
    if (hasError) {
      return (
        <div className="w-full aspect-video bg-surface rounded-2xl border border-border/40 flex flex-col items-center justify-center gap-3 text-muted">
          <span className="text-2xl">📡</span>
          <p className="text-xs font-medium">Could not connect to the Avatar service.</p>
          <p className="text-[10px] text-muted/60">Text and audio modes are fully available.</p>
        </div>
      );
    }

    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-border/40 group">

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 gap-3 backdrop-blur-sm">
            <Loader2 className="animate-spin text-violet" size={28} />
            <p className="text-white/80 text-xs font-semibold tracking-wide">Securing WebRTC Connection…</p>
            <p className="text-white/40 text-[10px]">This may take a few seconds</p>
          </div>
        )}

        {/* Hidden raw video — feeds the chroma-key canvas */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          aria-hidden
          className="absolute opacity-0 pointer-events-none w-px h-px"
        />

        {/* Chroma-keyed canvas — the visible avatar output */}
        <canvas
          ref={canvasRef}
          aria-label="AI avatar video stream"
          className={`w-full h-full object-contain transition-opacity duration-700 ${
            stream && !loading ? 'opacity-100' : 'opacity-0'
          }`}
        />


        {/* Voice chat controls — visible on hover */}
        <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
          <button
            onClick={toggleVoiceChat}
            disabled={loading}
            aria-label={isVoiceActive ? 'Mute microphone' : 'Enable microphone and voice conversation'}
            className={`p-2.5 rounded-full transition-colors disabled:opacity-40 ${
              isVoiceActive ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:opacity-90'
            }`}
          >
            {isVoiceActive ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
          </button>
          <div className="text-xs font-medium text-white/90 pr-2">
            {loading          ? 'Connecting…'
              : isVoiceActive ? 'Voice active — AI is listening…'
              : 'Hover & click mic to speak'}
          </div>
        </div>
      </div>
    );
  },
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
