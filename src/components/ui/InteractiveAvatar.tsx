'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents, VoiceChatManager } from '@heygen/streaming-avatar';
import { Loader2, Mic, MicOff, Video, VideoOff } from 'lucide-react';

export interface InteractiveAvatarRef {
  speak: (text: string) => Promise<void>;
}

interface Props {
  avatarId?: string;
  onDisconnected?: () => void;
}

export const InteractiveAvatar = forwardRef<InteractiveAvatarRef, Props>(
  ({ avatarId = 'Anna_public_3_20240108', onDisconnected }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const avatarRef = useRef<StreamingAvatar | null>(null);

    // Request local camera and microphone permissions
    useEffect(() => {
      let active = true;
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          if (active) setLocalStream(mediaStream);
        })
        .catch(console.error);
      return () => {
        active = false;
      };
    }, []);

    useEffect(() => {
      let mounted = true;

      async function init() {
        try {
          // Request short-lived token from our secure Next.js API route
          const res = await fetch('/api/heygen-token', { method: 'POST' });
          if (!res.ok) throw new Error('Failed to negotiate HeyGen WebRTC token');
          const { token } = await res.json();

          if (!mounted) return;

          // Initialize WebRTC Streaming Client
          const avatar = new StreamingAvatar({ token });
          avatarRef.current = avatar;

          avatar.on(StreamingEvents.STREAM_READY, (e: any) => {
            console.log('[HeyGen WebRTC] Stream Ready');
            if (mounted) setStream(e.detail);
          });

          avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
            console.warn('[HeyGen WebRTC] Stream Disconnected');
            if (mounted) {
              setStream(null);
              onDisconnected?.();
            }
          });

          // Kick off connection
          await avatar.createStartAvatar({
            quality: AvatarQuality.Medium,
            avatarName: avatarId,
          });

          if (mounted) setLoading(false);
          
          // Initial greeting dynamically optional
          // await avatar.speak({ text: "Hello, I am connected and ready." });
        } catch (err) {
          console.error('[HeyGen WebRTC] Init Error:', err);
          if (mounted) setLoading(false); // Could show dedicated error UI here
        }
      }

      init();

      return () => {
        mounted = false;
        if (avatarRef.current) {
          // Teardown WebRTC cleanly
          avatarRef.current.stopAvatar().catch(console.error);
          avatarRef.current = null;
        }
      };
    }, [avatarId, onDisconnected]);

    useEffect(() => {
      // Sync stream dynamically to video element when it becomes available
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    useEffect(() => {
      // Sync local stream to PiP video
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }, [localStream]);

    const toggleVoiceChat = async () => {
      if (!avatarRef.current) return;
      try {
        if (isVoiceActive) {
          await avatarRef.current.closeVoiceChat();
          setIsVoiceActive(false);
        } else {
          await avatarRef.current.startVoiceChat();
          setIsVoiceActive(true);
        }
      } catch (err) {
        console.error('Failed to toggle voice chat', err);
      }
    };

    // Expose speak capability to parent chat input
    useImperativeHandle(ref, () => ({
      speak: async (text: string) => {
        if (avatarRef.current) {
          // Send text to driver for real-time lip sync synthesis
          await avatarRef.current.speak({ text });
        } else {
          console.warn('WebRTC Avatar is not yet connected.');
        }
      }
    }));

    return (
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-border/40 group">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 gap-3 backdrop-blur-sm">
            <Loader2 className="animate-spin text-brand" size={28} />
            <p className="text-white text-xs font-semibold tracking-wide shadow-sm">Securing WebRTC Connection...</p>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-700 ${stream && !loading ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Picture-in-Picture Local Camera */}
        {localStream && (
          <div className="absolute bottom-4 right-4 w-28 aspect-[3/4] bg-black rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl z-20 transition-transform duration-300 hover:scale-105">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }} // Mirror the local camera
            />
          </div>
        )}

        {/* Voice Chat Controls Overlay */}
        <div className="absolute bottom-4 left-4 z-20 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-3">
          <button 
            onClick={toggleVoiceChat}
            className={`p-3 rounded-full transition-colors ${isVoiceActive ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand/80'}`}
            title={isVoiceActive ? "Mute Microphone" : "Enable Microphone & Voice Conversation"}
          >
            {isVoiceActive ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
          </button>
          <div className="text-xs font-medium text-white/90 pr-2">
            {isVoiceActive ? 'Voice Active - AI is listening...' : 'Click to enable voice response'}
          </div>
        </div>
      </div>
    );
  }
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
