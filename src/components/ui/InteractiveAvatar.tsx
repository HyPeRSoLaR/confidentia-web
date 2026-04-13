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
import { Loader2, Mic, MicOff } from 'lucide-react';

// ─── Public API ────────────────────────────────────────────────────────────────

export interface InteractiveAvatarRef {
  /** Send a text message for the avatar to speak (used in text/type-input mode). */
  speak: (text: string) => void;
}

interface Props {
  onReady?:            () => void;
  onError?:            () => void;
  onDisconnected?:     () => void;
  /**
   * Called with the final transcript of what the USER just said.
   * Lets the parent add a user message bubble in the conversation log.
   */
  onVoiceTranscript?:  (text: string) => void;
  /**
   * Called with the final transcript of what the AVATAR just said.
   * Lets the parent add an assistant message bubble in the conversation log.
   */
  onAvatarResponse?:   (text: string) => void;
}

// ─── Stable callback ref helper ───────────────────────────────────────────────
function useCallbackRef<T extends ((...args: any[]) => any) | undefined>(fn: T) {
  const ref = useRef<T>(fn);
  useEffect(() => { ref.current = fn; }, [fn]);
  return ref;
}

// Opening greeting prompt — instructs the LLM (already loaded with the Aria system prompt
// via the context_id) to deliver the first turn. Keeping it directive keeps latency low.
const GREETING_PROMPT =
  'Greet the user warmly as Aria and invite them to share what is on their mind today.';

// ─── Component ────────────────────────────────────────────────────────────────

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ onReady, onError, onDisconnected, onVoiceTranscript, onAvatarResponse }, ref) => {

    // The SDK attaches audio/video directly to an HTMLMediaElement via session.attach()
    const mediaRef     = useRef<HTMLVideoElement>(null);
    const sessionRef   = useRef<LiveAvatarSession | null>(null);

    // Stable refs for parent callbacks (avoids stale closures in the effect)
    const onReadyRef         = useCallbackRef(onReady);
    const onErrorRef         = useCallbackRef(onError);
    const onDisconnectedRef  = useCallbackRef(onDisconnected);
    const onVoiceRef         = useCallbackRef(onVoiceTranscript);
    const onAvatarRef        = useCallbackRef(onAvatarResponse);

    const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
    // isMuted tracks whether the user has manually silenced their mic.
    // Voice-activity-detection (VAD) continues running server-side regardless.
    const [isMuted,   setIsMuted]   = useState(false);
    const [hasError,  setHasError]  = useState(false);

    const isConnected  = sessionState === SessionState.CONNECTED;
    const isConnecting = sessionState === SessionState.CONNECTING;

    // ── Session init ───────────────────────────────────────────────────────────
    useEffect(() => {
      let mounted = true;

      async function init() {
        try {
          // 1. Get a session token from our server-side route
          const res = await fetch('/api/heygen-token', { method: 'POST' });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err?.error ?? `Token request failed: ${res.status}`);
          }
          const { token } = await res.json();
          if (!token) throw new Error('No session token returned');
          if (!mounted) return;

          // 2. Create the LiveAvatar session in FULL mode.
          //    voiceChat: true → SDK opens the mic and publishes the local audio track
          //    (echo-cancelled, noise-suppressed). VAD is managed server-side.
          const session = new LiveAvatarSession(token, { voiceChat: true });
          sessionRef.current = session;

          // ── Stream ready ──────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_STREAM_READY, () => {
            if (!mounted) return;
            // Attach A/V output to the video element
            if (mediaRef.current) session.attach(mediaRef.current);
            onReadyRef.current?.();
          });

          // ── State changes ─────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_STATE_CHANGED, (state) => {
            if (!mounted) return;
            setSessionState(state);

            if (state === SessionState.CONNECTED) {
              // ✅ FIX 1: Start listening immediately — sends avatar.start_listening
              // to the LiveAvatar backend so VAD/STT/LLM pipeline activates.
              // Without this the server ignores all incoming audio.
              try { session.startListening(); } catch (e) {
                console.warn('[LiveAvatar] startListening failed:', e);
              }

              // ✅ NEW: Avatar speaks first — sends a greeting prompt through the
              // AVATAR_SPEAK_RESPONSE pipeline (LLM → TTS → video via Aria persona).
              // Small delay lets the audio/video stream fully settle before speaking.
              setTimeout(() => {
                if (!mounted || !sessionRef.current) return;
                try { session.message(GREETING_PROMPT); } catch (e) {
                  console.warn('[LiveAvatar] greeting failed:', e);
                }
              }, 800);
            }
          });

          // ── Disconnected ──────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_DISCONNECTED, () => {
            if (!mounted) return;
            setIsMuted(false);
            onDisconnectedRef.current?.();
          });

          // ── User transcription (final — fires once per utterance) ─────────
          session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) {
              onVoiceRef.current?.(event.text.trim());
            }
          });

          // ── Avatar transcription (final — fires once per avatar reply) ────
          session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) {
              onAvatarRef.current?.(event.text.trim());
            }
          });

          // 3. Start the session (LiveKit WebRTC handshake)
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

    // ── Mute toggle ────────────────────────────────────────────────────────────
    // Toggles the LOCAL microphone track mute state.
    // VAD/STT continues running server-side — the user just silences their input.
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

    // ── Expose speak() for typed text input ────────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: (text: string) => {
        const session = sessionRef.current;
        if (session && isConnected) {
          // session.message() sends text into the LLM pipeline;
          // the avatar autonomously generates and speaks a response.
          try { session.message(text); } catch (e) { console.warn('[LiveAvatar] speak error', e); }
        }
      },
    }), [isConnected]);

    // ── Error state ────────────────────────────────────────────────────────────
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
              {isConnecting ? 'Connecting to LiveAvatar…' : 'Securing WebRTC Connection…'}
            </p>
            <p className="text-white/40 text-[10px]">This may take a few seconds</p>
          </div>
        )}

        {/*
          The LiveAvatar SDK streams both audio AND video to this single element.
          session.attach(mediaRef.current) is called after SESSION_STREAM_READY.
        */}
        <video
          ref={mediaRef}
          autoPlay
          playsInline
          className={`w-full h-full object-contain transition-opacity duration-700 ${
            isConnected ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="AI avatar video stream"
        />

        {/* ✅ FIX 2: Mic control — always visible (not hidden behind hover).
            Shows mute/unmute state. VAD is always active; this only silences the mic track. */}
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
                ? 'Muted — click to speak'
                : 'Listening — click to mute'}
            </div>
          </div>
        )}
      </div>
    );
  },
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
