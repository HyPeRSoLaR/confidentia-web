'use client';

import React, {
  useEffect, useRef, useState, useImperativeHandle, forwardRef,
} from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';
import { Loader2, Mic, MicOff } from 'lucide-react';

export interface InteractiveAvatarRef {
  speak: (text: string) => Promise<void>;
}

interface Props {
  avatarId?: string;
  onDisconnected?: () => void;
}

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ avatarId = 'Anna_public_3_20240108', onDisconnected }, ref) => {
    const videoRef      = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const avatarRef     = useRef<StreamingAvatar | null>(null);

    const [stream,       setStream]       = useState<MediaStream | null>(null);
    const [localStream,  setLocalStream]  = useState<MediaStream | null>(null);
    const [loading,      setLoading]      = useState(true);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    // Camera/mic are NOT requested until the user explicitly clicks the mic button
    const [cameraRequested, setCameraRequested] = useState(false);

    // ── WebRTC avatar init ─────────────────────────────────────────────────
    useEffect(() => {
      let mounted = true;

      async function init() {
        try {
          const res = await fetch('/api/heygen-token', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to negotiate HeyGen WebRTC token');
          const { token } = await res.json();
          if (!mounted) return;

          const avatar = new StreamingAvatar({ token });
          avatarRef.current = avatar;

          avatar.on(StreamingEvents.STREAM_READY, (e: any) => {
            if (mounted) setStream(e.detail);
          });

          avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
            if (mounted) {
              setStream(null);
              onDisconnected?.();
            }
          });

          await avatar.createStartAvatar({
            quality: AvatarQuality.Medium,
            avatarName: avatarId,
          });

          if (mounted) setLoading(false);
        } catch (err) {
          console.error('[HeyGen WebRTC] Init Error:', err);
          if (mounted) setLoading(false);
        }
      }

      init();

      return () => {
        mounted = false;
        avatarRef.current?.stopAvatar().catch(console.error);
        avatarRef.current = null;
      };
    }, [avatarId, onDisconnected]);

    // ── Sync avatar stream to video ────────────────────────────────────────
    useEffect(() => {
      if (videoRef.current && stream) videoRef.current.srcObject = stream;
    }, [stream]);

    // ── Sync local camera to PiP ───────────────────────────────────────────
    useEffect(() => {
      if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
    }, [localStream]);

    // ── Cleanup local camera stream on unmount ─────────────────────────────
    useEffect(() => {
      return () => {
        localStream?.getTracks().forEach(t => t.stop());
      };
    }, [localStream]);

    // ── Voice toggle — camera/mic only requested on first user click ───────
    const toggleVoiceChat = async () => {
      if (!avatarRef.current) return;

      try {
        if (isVoiceActive) {
          await avatarRef.current.closeVoiceChat();
          setIsVoiceActive(false);
          localStream?.getTracks().forEach(t => t.stop());
          setLocalStream(null);
        } else {
          // ✅ Camera + mic requested only here, after explicit user gesture
          if (!cameraRequested) {
            setCameraRequested(true);
            try {
              const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
              setLocalStream(media);
            } catch {
              console.warn('[InteractiveAvatar] Camera/mic permission denied — continuing without PiP');
            }
          }
          await avatarRef.current.startVoiceChat();
          setIsVoiceActive(true);
        }
      } catch (err) {
        console.error('Failed to toggle voice chat', err);
      }
    };

    // ── Expose speak() to parent ───────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      speak: async (text: string) => {
        if (avatarRef.current) {
          await avatarRef.current.speak({ text });
        } else {
          console.warn('WebRTC Avatar is not yet connected.');
        }
      },
    }));

    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-border/40 group">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 gap-3 backdrop-blur-sm">
            <Loader2 className="animate-spin text-violet" size={28} />
            <p className="text-white text-xs font-semibold tracking-wide">Securing WebRTC Connection…</p>
          </div>
        )}

        {/* Avatar video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          aria-label="AI avatar video stream"
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            stream && !loading ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Picture-in-Picture local camera */}
        {localStream && (
          <div className="absolute bottom-4 right-4 w-28 aspect-[3/4] bg-black rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 transition-transform duration-300 hover:scale-105">
            <video
              ref={localVideoRef}
              autoPlay playsInline muted
              aria-label="Your camera preview"
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        )}

        {/* Voice chat controls — visible on hover */}
        <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
          <button
            onClick={toggleVoiceChat}
            aria-label={isVoiceActive ? 'Mute microphone' : 'Enable microphone and voice conversation'}
            className={`p-3 rounded-full transition-colors ${
              isVoiceActive ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:opacity-90'
            }`}
          >
            {isVoiceActive ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
          </button>
          <div className="text-xs font-medium text-white/90 pr-2">
            {isVoiceActive ? 'Voice active — AI is listening…' : 'Click to enable voice'}
          </div>
        </div>
      </div>
    );
  },
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
