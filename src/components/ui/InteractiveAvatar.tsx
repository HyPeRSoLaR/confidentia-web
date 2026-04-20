'use client';

import React, {
  useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback,
} from 'react';
import {
  LiveAvatarSession,
  SessionEvent,
  SessionState,
  AgentEventsEnum,
} from '@heygen/liveavatar-web-sdk';
import { Loader2, Mic, MicOff, Camera, CameraOff, Zap, Volume2, RefreshCw } from 'lucide-react';

export interface InteractiveAvatarRef {
  speak: (text: string) => void;
}

interface Props {
  avatarId?:          string;
  avatarName?:        string;
  onReady?:           () => void;
  onError?:           () => void;
  onDisconnected?:    () => void;
  onVoiceTranscript?: (text: string) => void;
  onAvatarResponse?:  (text: string) => void;
}

function useCallbackRef<T extends ((...args: any[]) => any) | undefined>(fn: T) {
  const ref = useRef<T>(fn);
  useEffect(() => { ref.current = fn; }, [fn]);
  return ref;
}

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ avatarId, avatarName, onReady, onError, onDisconnected, onVoiceTranscript, onAvatarResponse }, ref) => {

    const mediaRef   = useRef<HTMLVideoElement>(null);
    const sessionRef = useRef<LiveAvatarSession | null>(null);

    const onReadyRef        = useCallbackRef(onReady);
    const onErrorRef        = useCallbackRef(onError);
    const onDisconnectedRef = useCallbackRef(onDisconnected);
    const onVoiceRef        = useCallbackRef(onVoiceTranscript);
    const onAvatarRef       = useCallbackRef(onAvatarResponse);

    const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
    const [hasError,     setHasError]     = useState(false);
    const [retryKey,     setRetryKey]     = useState(0);   // increment → re-runs init effect
    const [autoRetried,  setAutoRetried]  = useState(false); // only auto-retry once
    const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

    const sessionModeRef = useRef<'LITE' | 'FULL'>('FULL');
    const [sessionMode,  setSessionMode]  = useState<'LITE' | 'FULL'>('FULL');

    // ── Zoom-like mic state ───────────────────────────────────────────────────
    // micActive:  user has clicked "activate" at least once (mic is ON)
    // isMuted:    user explicitly muted (mic stays muted until clicked again)
    // isSpeaking: avatar is currently speaking (VAD auto-paused)
    const [micActive,  setMicActive]  = useState(false);
    const [isMuted,    setIsMuted]    = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Refs for access inside async callbacks (avoid stale closures)
    const micActiveRef  = useRef(false);
    const isMutedRef    = useRef(false);
    const isSpeakingRef = useRef(false);

    const COOLDOWN_MS = 800;

    // ── Webcam PiP ────────────────────────────────────────────────────────────
    const [webcamOn, setWebcamOn] = useState(false);
    const webcamRef    = useRef<HTMLVideoElement>(null);
    const webcamStream = useRef<MediaStream | null>(null);

    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
        webcamStream.current = stream;
        if (webcamRef.current) webcamRef.current.srcObject = stream;
        setWebcamOn(true);
      } catch {}
    }
    function stopWebcam() {
      webcamStream.current?.getTracks().forEach(t => t.stop());
      webcamStream.current = null;
      setWebcamOn(false);
    }

    const isConnected  = sessionState === SessionState.CONNECTED;
    const isConnecting = sessionState === SessionState.CONNECTING;

    // ── iOS audio unlock ──────────────────────────────────────────────────────
    // iOS blocks audio autoplay. We must call video.play() from a user gesture.
    function unlockIOSAudio() {
      const vid = mediaRef.current;
      if (!vid) return;
      vid.muted = false;
      vid.play().catch(() => {
        // Still blocked — try with muted first, then unmute
        vid.muted = true;
        vid.play().then(() => { vid.muted = false; }).catch(() => {});
      });
    }

    // ── Helper: start VAD in FULL mode ────────────────────────────────────────
    function startVAD() {
      const session = sessionRef.current;
      if (!session) return;
      if (sessionModeRef.current === 'FULL') {
        try { session.startListening(); } catch (e) {
          console.warn('[LiveAvatar] startListening failed:', e);
        }
      }
    }

    function stopVAD() {
      const session = sessionRef.current;
      if (!session) return;
      if (sessionModeRef.current === 'FULL') {
        try { session.stopListening(); } catch {}
      }
    }

    // ── Session init ──────────────────────────────────────────────────────────
    useEffect(() => {
      let mounted = true;
      // Reset error state on each (re)try
      setHasError(false);
      setRetryCountdown(null);

      async function init() {
        try {
          const res = await fetch('/api/heygen-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              avatarId:   avatarId   || undefined,
              avatarName: avatarName || undefined,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error ?? `Token failed: ${res.status}`);
          }
          const { token, mode } = await res.json();
          if (!token) throw new Error('No session token');
          if (!mounted) return;

          const isLite = mode === 'LITE';
          sessionModeRef.current = isLite ? 'LITE' : 'FULL';
          setSessionMode(isLite ? 'LITE' : 'FULL');

          const session = new LiveAvatarSession(token, { voiceChat: true });
          sessionRef.current = session;

          session.on(SessionEvent.SESSION_STREAM_READY, () => {
            if (!mounted) return;
            if (mediaRef.current) session.attach(mediaRef.current);
            onReadyRef.current?.();
          });

          session.on(SessionEvent.SESSION_STATE_CHANGED, (state) => {
            if (!mounted) return;
            setSessionState(state);
            // Do NOT auto-start VAD. User must click "Activer le micro" first.
          });

          session.on(SessionEvent.SESSION_DISCONNECTED, () => {
            if (!mounted) return;
            micActiveRef.current  = false;
            isMutedRef.current    = false;
            isSpeakingRef.current = false;
            setMicActive(false);
            setIsMuted(false);
            setIsSpeaking(false);
            onDisconnectedRef.current?.();
          });

          session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
            if (!mounted || !event.text?.trim()) return;
            if (!micActiveRef.current || isMutedRef.current) return; // gate
            onVoiceRef.current?.(event.text.trim());
          });

          session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) onAvatarRef.current?.(event.text.trim());
          });

          // Avatar starts speaking → pause VAD (echo prevention), keep mic "active" conceptually
          session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
            if (!mounted) return;
            isSpeakingRef.current = true;
            setIsSpeaking(true);
            if (!isLite && micActiveRef.current && !isMutedRef.current) {
              stopVAD();
            }
          });

          // Avatar finishes → auto-resume VAD if mic is still active and not muted
          // This is the "Zoom call" behavior — mic comes back automatically
          session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
            if (!mounted) return;
            setTimeout(() => {
              if (!mounted) return;
              isSpeakingRef.current = false;
              setIsSpeaking(false);
              // Auto-resume listening if mic is active and not muted
              if (!isLite && micActiveRef.current && !isMutedRef.current) {
                startVAD();
              }
            }, COOLDOWN_MS);
          });

          await session.start();

        } catch (err: any) {
          console.error('[LiveAvatar] Init error:', err);
          if (!mounted) return;
          setHasError(true);
          onErrorRef.current?.();

          // Auto-retry once after 5 s — covers transient network/WebRTC glitches
          if (!autoRetried) {
            setAutoRetried(true);
            let secs = 5;
            setRetryCountdown(secs);
            const tick = setInterval(() => {
              secs -= 1;
              if (!mounted) { clearInterval(tick); return; }
              setRetryCountdown(secs);
              if (secs <= 0) {
                clearInterval(tick);
                setRetryKey(k => k + 1);
              }
            }, 1000);
          }
        }
      }

      init();
      return () => {
        mounted = false;
        sessionRef.current?.stop().catch(console.error);
        sessionRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [retryKey]);

    // ── Mic button handler (Zoom-like) ────────────────────────────────────────
    const handleMicClick = useCallback(async () => {
      const session = sessionRef.current;
      if (!session || !isConnected) return;

      // iOS audio unlock on every user gesture — safe to call multiple times
      unlockIOSAudio();

      if (!micActiveRef.current) {
        // First click: ACTIVATE the mic (like joining a Zoom call with mic on)
        micActiveRef.current = true;
        isMutedRef.current   = false;
        setMicActive(true);
        setIsMuted(false);

        if (sessionModeRef.current === 'LITE') {
          try { await session.voiceChat.unmute(); } catch {}
        } else {
          if (!isSpeakingRef.current) startVAD();
        }
      } else if (isMutedRef.current) {
        // Was muted → UNMUTE
        isMutedRef.current = false;
        setIsMuted(false);

        if (sessionModeRef.current === 'LITE') {
          try { await session.voiceChat.unmute(); } catch {}
        } else {
          if (!isSpeakingRef.current) startVAD();
        }
      } else {
        // Active and not muted → MUTE
        isMutedRef.current = true;
        setIsMuted(true);

        if (sessionModeRef.current === 'LITE') {
          try { await session.voiceChat.mute(); } catch {}
        } else {
          stopVAD();
        }
      }
    }, [isConnected]);

    // ── speak() ───────────────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: (text: string) => {
        const session = sessionRef.current;
        if (!session || !isConnected) return;
        if (sessionModeRef.current === 'LITE') return;
        if (!isSpeakingRef.current) stopVAD();
        try { session.message(text); } catch (e) {
          console.warn('[LiveAvatar] speak error', e);
        }
      },
    }), [isConnected]);

    if (hasError) {
      return (
        <div className="w-full aspect-video bg-surface rounded-2xl border border-border/40 flex flex-col items-center justify-center gap-4 text-muted px-6 text-center">
          <span className="text-3xl">📡</span>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-text/80">Connexion à l'avatar impossible</p>
            <p className="text-[11px] text-muted/70 leading-relaxed max-w-xs">
              Problème réseau ou WebRTC transitoire.<br />
              Les modes Texte et Audio restent disponibles.
            </p>
          </div>
          {retryCountdown !== null && retryCountdown > 0 ? (
            <p className="text-[10px] text-muted/50 flex items-center gap-1">
              <Loader2 size={10} className="animate-spin" />
              Nouvelle tentative dans {retryCountdown} s…
            </p>
          ) : (
            <button
              onClick={() => { setAutoRetried(false); setRetryKey(k => k + 1); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand/90 text-white text-xs font-semibold hover:bg-brand transition-colors shadow-brand"
            >
              <RefreshCw size={12} />
              Réessayer
            </button>
          )}
        </div>
      );
    }

    const loading = !isConnected && !hasError;

    // ── Mic button content ────────────────────────────────────────────────────
    function micIcon() {
      if (isSpeaking)            return <Loader2 size={16} className="animate-spin" />;
      if (!micActive)            return <Volume2 size={16} />;
      if (isMuted)               return <MicOff size={16} />;
      return <Mic size={16} />;
    }

    function micText() {
      if (isSpeaking)            return `${avatarName || 'Anna'} parle…`;
      if (!micActive)            return 'Activer le micro';
      if (isMuted)               return 'Micro coupé — toucher pour réactiver';
      return 'Micro actif — toucher pour couper';
    }

    function micStyle() {
      if (isSpeaking)  return 'bg-black/40 border-white/10 text-white/50 cursor-not-allowed';
      if (!micActive)  return 'bg-brand/90 border-brand/60 text-white hover:scale-105 hover:shadow-brand/30 shadow-lg';
      if (isMuted)     return 'bg-red-600/90 border-red-500/60 text-white hover:scale-105';
      return 'bg-emerald-600/90 border-emerald-500/60 text-white hover:opacity-90';
    }

    return (
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center shadow-xl border border-border/40"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, #1e1040 0%, #0d0820 60%, #07050f 100%)' }}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 gap-3 backdrop-blur-sm">
            <Loader2 className="animate-spin text-violet" size={28} />
            <p className="text-white/80 text-xs font-semibold tracking-wide">
              {isConnecting ? 'Connexion à LiveAvatar…' : 'Sécurisation WebRTC…'}
            </p>
            <p className="text-white/40 text-[10px]">Quelques secondes…</p>
          </div>
        )}

        {/* Avatar video – playsInline is critical for iOS */}
        <video
          ref={mediaRef}
          autoPlay
          playsInline
          className={`w-full h-full object-contain transition-opacity duration-700 ${
            isConnected ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="AI avatar video stream"
        />

        {/* ElevenLabs badge (LITE mode) */}
        {isConnected && sessionMode === 'LITE' && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 bg-violet/20 backdrop-blur-sm border border-violet/30 rounded-full">
            <Zap size={9} className="text-violet" />
            <span className="text-[9px] font-semibold text-violet">ElevenLabs</span>
          </div>
        )}

        {/* ── Zoom-style mic control ── */}
        {isConnected && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
            <button
              onClick={handleMicClick}
              disabled={isSpeaking}
              aria-label={micText()}
              className={`
                flex items-center gap-2.5 px-5 py-2.5 rounded-full border
                transition-all duration-200 backdrop-blur-md
                ${micStyle()}
              `}
            >
              {micIcon()}
              <span className="text-xs font-semibold">{micText()}</span>
            </button>
          </div>
        )}

        {/* Webcam PiP */}
        {webcamOn && (
          <div className="absolute bottom-16 right-4 z-20 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
            <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <button onClick={stopWebcam} className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80">
              <CameraOff size={8} />
            </button>
          </div>
        )}

        {/* Camera toggle */}
        {isConnected && (
          <div className="absolute bottom-4 right-4 z-20" style={webcamOn ? { display: 'none' } : {}}>
            <button
              onClick={webcamOn ? stopWebcam : startWebcam}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] hover:bg-black/70 transition-colors"
            >
              {webcamOn ? <CameraOff size={10} /> : <Camera size={10} />}
              {webcamOn ? 'Camera off' : 'Ma caméra'}
            </button>
          </div>
        )}
      </div>
    );
  },
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
