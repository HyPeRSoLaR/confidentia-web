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
import { Loader2, Mic, MicOff, Camera, CameraOff, Zap } from 'lucide-react';

// ─── Public API ────────────────────────────────────────────────────────────────

export interface InteractiveAvatarRef {
  speak: (text: string) => void;
}

interface Props {
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

// ─── Component ────────────────────────────────────────────────────────────────

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ onReady, onError, onDisconnected, onVoiceTranscript, onAvatarResponse }, ref) => {

    const mediaRef   = useRef<HTMLVideoElement>(null);
    const sessionRef = useRef<LiveAvatarSession | null>(null);

    const onReadyRef        = useCallbackRef(onReady);
    const onErrorRef        = useCallbackRef(onError);
    const onDisconnectedRef = useCallbackRef(onDisconnected);
    const onVoiceRef        = useCallbackRef(onVoiceTranscript);
    const onAvatarRef       = useCallbackRef(onAvatarResponse);

    const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
    const [hasError,  setHasError]  = useState(false);
    const sessionModeRef = useRef<'LITE' | 'FULL'>('FULL');
    const [sessionMode,  setSessionMode] = useState<'LITE' | 'FULL'>('FULL');

    // ── PTT (Push-to-Talk) state ──────────────────────────────────────────────
    // In FULL mode, VAD is NOT started automatically.
    // The user taps the mic button to start/stop listening.
    // This avoids echo and gives a deliberate, human-feeling UX.
    const [isListening,  setIsListening]  = useState(false);
    const [isSpeaking,   setIsSpeaking]   = useState(false); // avatar is speaking
    const isListeningRef = useRef(false);
    const isSpeakingRef  = useRef(false);
    const COOLDOWN_MS    = 800;

    // ── Webcam PiP ────────────────────────────────────────────────────────────
    const [webcamOn,    setWebcamOn]    = useState(false);
    const webcamRef    = useRef<HTMLVideoElement>(null);
    const webcamStream = useRef<MediaStream | null>(null);

    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });
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

    // ── Session init ──────────────────────────────────────────────────────────
    useEffect(() => {
      let mounted = true;

      async function init() {
        try {
          const res = await fetch('/api/heygen-token', { method: 'POST' });
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
            // PTT: do NOT auto-start listening on connect.
            // User must tap the mic button deliberately.
            // (In LITE mode, ElevenLabs manages VAD anyway.)
          });

          session.on(SessionEvent.SESSION_DISCONNECTED, () => {
            if (!mounted) return;
            setIsListening(false);
            setIsSpeaking(false);
            onDisconnectedRef.current?.();
          });

          // ── User transcript (only forwarded in FULL mode when listening) ───
          session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
            if (!mounted || !event.text?.trim()) return;
            if (!isListeningRef.current) return; // PTT gate
            onVoiceRef.current?.(event.text.trim());
          });

          session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) onAvatarRef.current?.(event.text.trim());
          });

          // ── Avatar starts speaking → stop listening (echo prevention) ──────
          session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
            if (!mounted) return;
            isSpeakingRef.current = true;
            setIsSpeaking(true);
            if (!isLite && isListeningRef.current) {
              try { session.stopListening(); } catch {}
              isListeningRef.current = false;
              setIsListening(false);
            }
          });

          // ── Avatar finishes speaking → ready for next PTT tap ────────────
          session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
            if (!mounted) return;
            setTimeout(() => {
              isSpeakingRef.current = false;
              setIsSpeaking(false);
            }, COOLDOWN_MS);
          });

          await session.start();

        } catch (err: any) {
          console.error('[LiveAvatar] Init error:', err);
          if (mounted) { setHasError(true); onErrorRef.current?.(); }
        }
      }

      init();
      return () => {
        mounted = false;
        sessionRef.current?.stop().catch(console.error);
        sessionRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── PTT toggle ────────────────────────────────────────────────────────────
    const toggleListening = useCallback(async () => {
      const session = sessionRef.current;
      if (!session || !isConnected || isSpeakingRef.current) return;

      if (sessionModeRef.current === 'LITE') {
        // LITE: ElevenLabs controls VAD — mute/unmute instead
        try {
          if (isListeningRef.current) {
            await session.voiceChat.mute();
            isListeningRef.current = false;
            setIsListening(false);
          } else {
            await session.voiceChat.unmute();
            isListeningRef.current = true;
            setIsListening(true);
          }
        } catch (e) { console.warn('[LiveAvatar] LITE mute toggle error:', e); }
        return;
      }

      // FULL mode: startListening / stopListening
      if (isListeningRef.current) {
        try { session.stopListening(); } catch {}
        isListeningRef.current = false;
        setIsListening(false);
      } else {
        try { session.startListening(); } catch {}
        isListeningRef.current = true;
        setIsListening(true);
      }
    }, [isConnected]);

    // ── speak() for typed text in FULL mode ───────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: (text: string) => {
        const session = sessionRef.current;
        if (!session || !isConnected) return;
        if (sessionModeRef.current === 'LITE') return; // ElevenLabs controls TTS
        // Stop listening before speaking to prevent echo
        if (isListeningRef.current) {
          try { session.stopListening(); } catch {}
          isListeningRef.current = false;
          setIsListening(false);
        }
        try { session.message(text); } catch (e) {
          console.warn('[LiveAvatar] speak error', e);
        }
      },
    }), [isConnected]);

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

    const loading = !isConnected && !hasError;

    // ── Mic button label ──────────────────────────────────────────────────────
    function micLabel() {
      if (isSpeaking)    return 'Aria parle…';
      if (isListening)   return 'En écoute — touchez pour arrêter';
      return 'Touchez pour parler';
    }

    return (
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center shadow-xl border border-border/40 group"
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

        {/* Avatar video */}
        <video
          ref={mediaRef}
          autoPlay
          playsInline
          className={`w-full h-full object-contain transition-opacity duration-700 ${
            isConnected ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="AI avatar video stream"
        />

        {/* LITE mode badge */}
        {isConnected && sessionMode === 'LITE' && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 bg-violet/20 backdrop-blur-sm border border-violet/30 rounded-full">
            <Zap size={9} className="text-violet" />
            <span className="text-[9px] font-semibold text-violet">ElevenLabs</span>
          </div>
        )}

        {/* ── PTT Mic button ── */}
        {isConnected && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
            <button
              onClick={toggleListening}
              disabled={isSpeaking}
              aria-label={micLabel()}
              className={`
                flex items-center gap-2.5 px-5 py-2.5 rounded-full border transition-all duration-200 backdrop-blur-md shadow-lg
                ${isSpeaking
                  ? 'bg-black/40 border-white/10 text-white/40 cursor-not-allowed'
                  : isListening
                    ? 'bg-red-500/90 border-red-400/60 text-white scale-105 shadow-red-500/30 animate-pulse-slow'
                    : 'bg-brand/90 border-brand/60 text-white hover:scale-105 hover:shadow-brand/40'
                }
              `}
            >
              {isSpeaking
                ? <Loader2 size={16} className="animate-spin" />
                : isListening
                  ? <MicOff size={16} />
                  : <Mic size={16} />
              }
              <span className="text-xs font-semibold">{micLabel()}</span>
            </button>
          </div>
        )}

        {/* Webcam PiP */}
        {webcamOn && (
          <div className="absolute bottom-16 right-4 z-20 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
            <video ref={webcamRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <button onClick={stopWebcam} className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors">
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
