'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import StreamingAvatar, { AvatarQuality, StreamingEvents } from '@heygen/streaming-avatar';
import { Loader2 } from 'lucide-react';

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
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(true);
    const avatarRef = useRef<StreamingAvatar | null>(null);

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
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-border/40">
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
      </div>
    );
  }
);

InteractiveAvatar.displayName = 'InteractiveAvatar';
