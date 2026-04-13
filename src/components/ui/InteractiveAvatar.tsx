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
  /** Send a text message for the avatar to speak.
   *  No-op in LITE mode (ElevenLabs drives all TTS). */
  speak: (text: string) => void;
}

interface Props {
  onReady?:           () => void;
  onError?:           () => void;
  onDisconnected?:    () => void;
  /** Called with USER transcript (voice input from mic). */
  onVoiceTranscript?: (text: string) => void;
  /** Called with AVATAR transcript (what the avatar said). */
  onAvatarResponse?:  (text: string) => void;
}

// ─── Stable callback ref helper ───────────────────────────────────────────────
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
    const [isMuted,  setIsMuted]  = useState(false);
    const [hasError, setHasError] = useState(false);

    // ── Mode tracking ─────────────────────────────────────────────────────────
    // 'LITE' = ElevenLabs drives voice, HeyGen drives lip-sync only
    // 'FULL' = HeyGen drives the entire AI pipeline
    const sessionModeRef = useRef<'LITE' | 'FULL'>('FULL');
    const [sessionMode,  setSessionMode] = useState<'LITE' | 'FULL'>('FULL');

    // ── Echo prevention (FULL mode only) ─────────────────────────────────────
    // In LITE mode ElevenLabs handles its own VAD — we must NOT call
    // startListening/stopListening or we break the ElevenLabs audio pipe.
    const isSpeakingRef   = useRef(false);
    const speakEndedAtRef = useRef(0);
    const COOLDOWN_MS     = 1500;

    // ── Webcam PiP ────────────────────────────────────────────────────────────
    const [webcamOn,    setWebcamOn]    = useState(false);
    const [webcamError, setWebcamError] = useState(false);
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
        setWebcamError(false);
      } catch { setWebcamError(true); }
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
          // 1. Fetch token + mode from our server route
          const res = await fetch('/api/heygen-token', { method: 'POST' });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error ?? `Token request failed: ${res.status}`);
          }
          const { token, mode } = await res.json();
          if (!token) throw new Error('No session token returned');
          if (!mounted) return;

          // Track the mode so FULL/LITE paths can diverge
          const isLite = mode === 'LITE';
          sessionModeRef.current = isLite ? 'LITE' : 'FULL';
          setSessionMode(isLite ? 'LITE' : 'FULL');
          console.log(`[LiveAvatar] Session mode: ${isLite ? 'LITE (ElevenLabs)' : 'FULL'}`);

          // 2. Create session — voiceChat:true opens the mic WebRTC track
          const session = new LiveAvatarSession(token, { voiceChat: true });
          sessionRef.current = session;

          // ── Stream ready ──────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_STREAM_READY, () => {
            if (!mounted) return;
            if (mediaRef.current) session.attach(mediaRef.current);
            onReadyRef.current?.();
          });

          // ── State changes ─────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_STATE_CHANGED, (state) => {
            if (!mounted) return;
            setSessionState(state);

            if (state === SessionState.CONNECTED) {
              if (!isLite) {
                // FULL mode: manually start VAD (HeyGen server-side STT)
                try { session.startListening(); } catch (e) {
                  console.warn('[LiveAvatar] startListening failed:', e);
                }
              }
              // LITE mode: ElevenLabs manages its own VAD — do NOT call startListening()
            }
          });

          // ── Disconnected ──────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_DISCONNECTED, () => {
            if (!mounted) return;
            setIsMuted(false);
            onDisconnectedRef.current?.();
          });

          // ── User transcription ────────────────────────────────────────────
          session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
            if (!mounted || !event.text?.trim()) return;
            // FULL mode echo guard: drop transcripts while avatar is speaking
            if (!isLite) {
              if (isSpeakingRef.current) {
                console.debug('[LiveAvatar] FULL: transcript suppressed — avatar speaking');
                return;
              }
              const msSinceEnd = Date.now() - speakEndedAtRef.current;
              if (msSinceEnd < COOLDOWN_MS) {
                console.debug(`[LiveAvatar] FULL: transcript suppressed — cooldown ${msSinceEnd}ms`);
                return;
              }
            }
            onVoiceRef.current?.(event.text.trim());
          });

          // ── Avatar transcription ──────────────────────────────────────────
          session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) {
              onAvatarRef.current?.(event.text.trim());
            }
          });

          // ── Avatar starts speaking ────────────────────────────────────────
          session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
            if (!mounted) return;
            if (!isLite) {
              // FULL mode only: stop VAD to prevent echo
              isSpeakingRef.current = true;
              try { session.stopListening(); } catch (e) {
                console.warn('[LiveAvatar] FULL: stopListening on SPEAK_STARTED failed:', e);
              }
            }
            // LITE mode: ElevenLabs handles its own echo cancellation — do NOT stop listening
          });

          // ── Avatar finishes speaking ──────────────────────────────────────
          session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
            if (!mounted) return;
            if (!isLite) {
              // FULL mode only: re-enable VAD after cooldown
              isSpeakingRef.current = false;
              speakEndedAtRef.current = Date.now();
              setTimeout(() => {
                if (!mounted) return;
                try { session.startListening(); } catch (e) {
                  console.warn('[LiveAvatar] FULL: re-startListening failed:', e);
                }
              }, COOLDOWN_MS);
            }
          });

          // 3. Start WebRTC session
          await session.start();

        } catch (err: any) {
          console.error('[LiveAvatar] Init error:', err);
          if (mounted) {
            setHasError(true);
            onErrorRef.current?.();
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
    }, []);

    // ── Mute toggle ───────────────────────────────────────────────────────────
    const toggleMute = useCallback(async () => {
      const session = sessionRef.current;
      if (!session || !isConnected) return;
      try {
        if (isMuted) {
          await session.voiceChat.unmute();
          setIsMuted(false);
        } else {
          await session.voiceChat.mute();
          setIsMuted(true);
        }
      } catch (err) {
        console.error('[LiveAvatar] Mute toggle error:', err);
      }
    }, [isConnected, isMuted]);

    // ── Expose speak() ────────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: (text: string) => {
        const session = sessionRef.current;
        if (!session || !isConnected) return;

        if (sessionModeRef.current === 'LITE') {
          // LITE mode: ElevenLabs controls ALL TTS — sending text here would
          // bypass the ElevenLabs agent and break the conversation flow.
          // The user's typed text is handled by AiChatView in text/audio mode;
          // in video LITE mode the voice conversation is fully autonomous.
          console.debug('[LiveAvatar] LITE: speak() no-op — ElevenLabs manages TTS');
          return;
        }

        // FULL mode: stop VAD → send message → avatar speaks → VAD resumes via SPEAK_ENDED
        isSpeakingRef.current = true;
        try { session.stopListening(); } catch (e) {
          console.warn('[LiveAvatar] FULL: stopListening before speak failed:', e);
        }
        try { session.message(text); } catch (e) {
          isSpeakingRef.current = false;
          console.warn('[LiveAvatar] FULL: speak error', e);
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

        {/* Avatar video stream */}
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

        {/* Mic control */}
        {isConnected && (
          <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-3">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              className={`p-2.5 rounded-full transition-colors ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:opacity-90'
              }`}
            >
              {isMuted
                ? <MicOff className="w-4 h-4 text-white" />
                : <Mic    className="w-4 h-4 text-white" />}
            </button>
            <div className="text-xs font-medium text-white/90 pr-2">
              {isMuted
                ? 'Micro coupé — cliquez pour parler'
                : sessionMode === 'LITE'
                  ? 'Parlez — Aria vous écoute'
                  : 'En écoute — cliquez pour couper'}
            </div>
          </div>
        )}

        {/* Webcam PiP */}
        {webcamOn && (
          <div className="absolute bottom-4 right-4 z-20 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
            <video
              ref={webcamRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
              aria-label="Your webcam (visible only to you)"
            />
            <button
              onClick={stopWebcam}
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
              title="Turn off camera"
            >
              <CameraOff size={8} />
            </button>
          </div>
        )}

        {/* Webcam toggle */}
        {isConnected && (
          <div className="absolute bottom-4 right-4 z-20" style={webcamOn ? { display: 'none' } : {}}>
            <button
              onClick={webcamOn ? stopWebcam : startWebcam}
              title={webcamOn ? 'Turn off camera' : 'Turn on your camera (optional)'}
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
