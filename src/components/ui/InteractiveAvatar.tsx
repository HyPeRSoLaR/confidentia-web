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
import { Loader2, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

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
    const [isMuted,   setIsMuted]   = useState(false);
    const [hasError,  setHasError]  = useState(false);

    // ── Echo-loop prevention ────────────────────────────────────────────────────
    // isSpeakingRef = true while the avatar is mid-speech.
    // USER_TRANSCRIPTION events fired during this window are discarded — they are
    // the avatar's own audio leaking back through the mic / WebRTC loopback.
    const isSpeakingRef       = useRef(false);
    // Timestamp of the last time avatar speech ENDED. We enforce a 1.5 s cooldown
    // before re-enabling VAD so reverb / speaker tail audio doesn't trigger STT.
    const speakEndedAtRef     = useRef(0);
    const COOLDOWN_MS         = 1500;
    // ── Webcam PiP ─────────────────────────────────────────────────────────────
    const [webcamOn,    setWebcamOn]   = useState(false);
    const [webcamError, setWebcamError] = useState(false);
    const webcamRef    = useRef<HTMLVideoElement>(null);
    const webcamStream = useRef<MediaStream | null>(null);

    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
        webcamStream.current = stream;
        if (webcamRef.current) { webcamRef.current.srcObject = stream; }
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
              // Activate VAD so the server listens for user voice input.
              // We do NOT send an automated greeting message — the text greeting
              // in INITIAL_MESSAGES is sufficient and avoids the echo loop where
              // the avatar's own speech is picked up by the mic as a user utterance.
              try { session.startListening(); } catch (e) {
                console.warn('[LiveAvatar] startListening failed:', e);
              }
            }
          });

          // ── Disconnected ──────────────────────────────────────────────────
          session.on(SessionEvent.SESSION_DISCONNECTED, () => {
            if (!mounted) return;
            setIsMuted(false);
            onDisconnectedRef.current?.();
          });

          // ── User transcription (final — fires once per utterance) ─────────
          // GATE: discard any transcript that arrives while the avatar is speaking
          // or within COOLDOWN_MS after it finished — those are echo artifacts.
          session.on(AgentEventsEnum.USER_TRANSCRIPTION, (event) => {
            if (!mounted || !event.text?.trim()) return;
            if (isSpeakingRef.current) {
              console.debug('[LiveAvatar] USER_TRANSCRIPTION suppressed — avatar is speaking (echo guard)');
              return;
            }
            const msSinceEnd = Date.now() - speakEndedAtRef.current;
            if (msSinceEnd < COOLDOWN_MS) {
              console.debug(`[LiveAvatar] USER_TRANSCRIPTION suppressed — cooldown (${msSinceEnd}ms < ${COOLDOWN_MS}ms)`);
              return;
            }
            onVoiceRef.current?.(event.text.trim());
          });

          // ── Avatar transcription ─────────────────────────────────────────
          session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, (event) => {
            if (mounted && event.text?.trim()) {
              onAvatarRef.current?.(event.text.trim());
            }
          });

          // ── Avatar starts speaking → kill VAD immediately ────────────────
          // Prevents the avatar's own audio from being picked up by the mic.
          // AVATAR_SPEAK_STARTED is the earliest possible signal.
          session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => {
            if (!mounted) return;
            isSpeakingRef.current = true;
            try { session.stopListening(); } catch (e) {
              console.warn('[LiveAvatar] stopListening on AVATAR_SPEAK_STARTED failed:', e);
            }
          });

          // ── Avatar finishes speaking → re-enable VAD after cooldown ─────
          session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => {
            if (!mounted) return;
            isSpeakingRef.current = false;
            speakEndedAtRef.current = Date.now();
            // Wait COOLDOWN_MS before re-enabling VAD to let speaker audio decay.
            setTimeout(() => {
              if (!mounted) return;
              try { session.startListening(); } catch (e) {
                console.warn('[LiveAvatar] re-startListening after AVATAR_SPEAK_ENDED failed:', e);
              }
            }, COOLDOWN_MS);
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
          // 1. Mark avatar as speaking and Stop VAD BEFORE sending the message.
          //    This closes the echo loop at the source — the mic is dead before
          //    the avatar's first audio frame arrives.
          isSpeakingRef.current = true;
          try { session.stopListening(); } catch (e) {
            console.warn('[LiveAvatar] stopListening before speak failed:', e);
          }
          // 2. Send text — avatar TTS starts asynchronously.
          //    AVATAR_SPEAK_STARTED will fire and confirm the speaking state.
          //    AVATAR_SPEAK_ENDED will re-enable VAD after the cooldown.
          try { session.message(text); } catch (e) {
            // If message() throws, reset the speaking flag so VAD comes back.
            isSpeakingRef.current = false;
            console.warn('[LiveAvatar] speak error', e);
          }
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
        {/* Webcam PiP — local only, never sent to server */}
        {webcamOn && (
          <div className="absolute bottom-4 right-4 z-20 w-28 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
            <video
              ref={webcamRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]" // mirror effect
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

        {/* Webcam toggle — shown when connected */}
        {isConnected && (
          <div className="absolute bottom-4 right-4 z-20" style={webcamOn ? { display: 'none' } : {}}>
            <button
              onClick={webcamOn ? stopWebcam : startWebcam}
              title={webcamOn ? 'Turn off camera' : 'Turn on your camera (optional)'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/80 text-[10px] hover:bg-black/70 transition-colors"
            >
              {webcamOn ? <CameraOff size={10} /> : <Camera size={10} />}
              {webcamOn ? 'Camera off' : 'My camera'}
            </button>
          </div>
        )}
      </div>
    );
  },
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
