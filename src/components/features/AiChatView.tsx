'use client';
/**
 * components/features/AiChatView.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared AI chat UI — /consumer/chat and /employee/chat.
 *
 * Privacy contract:
 *   • All conversation content stays in React state (in-memory only).
 *   • Nothing is persisted without explicit user action.
 *   • No employer, HR, or admin role can access message content.
 *   • Audio synthesis runs server-side via 'use server' action (ElevenLabs key never hits client).
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, Video, MessageCircle,
  Loader2, Check, Lock, X, Wifi, WifiOff, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveAvatar, type InteractiveAvatarRef } from '@/components/ui/InteractiveAvatar';
import { synthesize } from '@/lib/elevenlabs';
import { INITIAL_MESSAGES, MOCK_AI_RESPONSES } from '@/lib/mock-data';
import type { Message, ConversationMode } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INPUT    = 2000;
const BANNER_KEY   = 'confidentia_privacy_banner_ts';
const BANNER_TTL   = 7 * 24 * 60 * 60 * 1000; // 7 days

const MODES: { id: ConversationMode; label: string; icon: React.ElementType }[] = [
  { id: 'text',  label: 'Text',  icon: MessageCircle },
  { id: 'audio', label: 'Audio', icon: Mic           },
  { id: 'video', label: 'Video', icon: Video          },
];

type AvatarStatus = 'connecting' | 'ready' | 'error';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AiChatViewProps {
  /** Shown in the page header */
  title?:       string;
  /** Shown below the title */
  subtitle?:    string;
  /**
   * Privacy banner copy — customised per role.
   * Employee copy explicitly states employer cannot read this.
   */
  privacyNote?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiChatView({
  title       = 'AI Conversation',
  subtitle    = 'Private, confidential — your conversations are never shared',
  privacyNote = 'Your conversations are end-to-end encrypted and never reviewed by humans.',
}: AiChatViewProps) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [mode,           setMode]          = useState<ConversationMode>('text');
  // Spread to avoid sharing a reference with the module-level array
  const [messages,       setMessages]      = useState<Message[]>([...INITIAL_MESSAGES]);
  const [input,          setInput]         = useState('');
  const [loading,        setLoading]       = useState(false);
  const [sessionEnded,   setSessionEnded]  = useState(false);
  // Per-message audio loading indicator (async — text appears first)
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  // Banner: false initially to avoid SSR mismatch; set from localStorage in effect
  const [bannerVisible,  setBannerVisible]  = useState(false);
  const [avatarStatus,   setAvatarStatus]  = useState<AvatarStatus>('connecting');

  const scrollRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<InteractiveAvatarRef>(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  // Read banner state from localStorage (client-only)
  useEffect(() => {
    try {
      const ts   = localStorage.getItem(BANNER_KEY);
      const show = !ts || Date.now() - parseInt(ts, 10) > BANNER_TTL;
      setBannerVisible(show);
    } catch {
      setBannerVisible(true);
    }
  }, []);

  // Auto-scroll on new messages AND when switching to/from video mode
  // (mode switch changes layout height, so the last message may go out of view)
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, mode]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const dismissBanner = useCallback(() => {
    setBannerVisible(false);
    try { localStorage.setItem(BANNER_KEY, Date.now().toString()); } catch {}
  }, []);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id:        Date.now().toString(),
      role:      'user',
      content:   input.slice(0, MAX_INPUT), // guard against paste > limit
      timestamp: new Date().toISOString(),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    // In video mode skip the artificial delay — the WebRTC avatar renders in real-time
    // so adding fake latency here directly worsens the user-perceived response time.
    // Text/audio modes keep a realistic delay so the transition feels natural.
    if (mode !== 'video') {
      await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    }
    const text  = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
    const msgId = (Date.now() + 1).toString();

    // Video mode: dispatch to live WebRTC avatar immediately (no artificial delay above)
    if (mode === 'video' && avatarRef.current) {
      avatarRef.current.speak(text).catch(console.error);
    }

    // ✅ Show text message IMMEDIATELY — don't block on audio synthesis
    const aiMsg: Message = {
      id:        msgId,
      role:      'assistant',
      content:   text,
      timestamp: new Date().toISOString(),
    };
    setMessages(m => [...m, aiMsg]);
    setLoading(false); // hide "Thinking…" as soon as text is ready

    // ✅ Audio: synthesise AFTER text is visible (non-blocking)
    if (mode === 'audio') {
      setLoadingAudioId(msgId);
      try {
        const res = await synthesize(text);
        setMessages(m =>
          m.map(msg => msg.id === msgId ? { ...msg, audioUrl: res.audioUrl } : msg),
        );
      } catch (err) {
        console.error('[ElevenLabs] Synthesis failed:', err);
      } finally {
        setLoadingAudioId(null);
      }
    }
  }

  function resetSession() {
    setSessionEnded(false);
    // ✅ Spread to create a fresh array — not the module-level reference
    setMessages([...INITIAL_MESSAGES]);
    setInput('');
  }

  // ── Sub-renderers ──────────────────────────────────────────────────────────

  const charCount = input.length;
  const charWarn  = charCount > MAX_INPUT * 0.8;

  /** Mode tabs — rendered in two places (header on desktop, below banner on mobile) */
  function ModeSwitcher({ className = '' }: { className?: string }) {
    return (
      <div className={`flex bg-surface rounded-xl p-1 border border-border gap-0.5 ${className}`}>
        {MODES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              aria-label={`Switch to ${m.label} mode`}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                mode === m.id
                  ? 'bg-brand text-white shadow-brand'
                  : 'text-muted hover:text-text'
              }`}
            >
              <Icon size={13} aria-hidden />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /** Avatar connection status badge — shown in header when in video mode */
  function AvatarStatusBadge() {
    const map: Record<AvatarStatus, { label: string; color: string; icon: React.ReactNode }> = {
      connecting: { label: 'Connecting…',      color: 'text-amber-400   border-amber-400/30   bg-amber-400/10   animate-pulse', icon: <WifiOff size={10} /> },
      ready:      { label: 'Avatar Ready',     color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',               icon: <Wifi     size={10} /> },
      error:      { label: 'Connection Failed',color: 'text-red-400     border-red-400/30     bg-red-400/10',                  icon: <AlertTriangle size={10} /> },
    };
    const { label, color, icon } = map[avatarStatus];
    return (
      <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>
        {icon}{label}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">

      {/* ── Header ── */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-2">
            {/* Avatar status badge — only visible in video mode */}
            {mode === 'video' && <AvatarStatusBadge />}

            {/* End Session */}
            {!sessionEnded && (
              <Button
                onClick={() => setSessionEnded(true)}
                variant="danger"
                size="sm"
                aria-label="End this session"
              >
                End Session
              </Button>
            )}

            {/* Desktop-only mode switcher in header */}
            <div className="hidden sm:block">
              <ModeSwitcher />
            </div>
          </div>
        }
      />

      {/* ── Session ended screen ── */}
      {sessionEnded ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-brand">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif text-text font-bold tracking-tight">Session Complete</h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Your conversation was kept fully confidential and encrypted.
            Take a moment to breathe and reflect on your progress today.
          </p>
          <div className="pt-4">
            <Button onClick={resetSession} className="rounded-full px-8 py-5 text-sm">
              Begin New Session
            </Button>
          </div>
        </motion.div>

      ) : (
        <>
          {/* ── Mobile-only mode switcher — always visible below header ── */}
          <div className="sm:hidden mb-3">
            <ModeSwitcher className="w-full" />
          </div>

          {/* ── Dismissable privacy banner ── */}
          <AnimatePresence>
            {bannerVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{   opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-2 bg-violet/10 border border-violet/20 rounded-xl px-4 py-2.5 text-xs text-violet">
                  <Lock size={11} className="flex-shrink-0 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{privacyNote}</span>
                  <button
                    onClick={dismissBanner}
                    aria-label="Dismiss privacy notice"
                    className="flex-shrink-0 p-1 rounded-md hover:bg-violet/20 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Video avatar — ALWAYS mounted (CSS hides when inactive) ── */}
          {/* Mounted once: avoids re-negotiating WebRTC on every mode toggle */}
          <div className={mode === 'video' ? 'mb-4' : 'hidden'} aria-hidden={mode !== 'video'}>
            <InteractiveAvatar
              ref={avatarRef}
              onReady={() => setAvatarStatus('ready')}
              onError={() => setAvatarStatus('error')}
            />
          </div>

          {/* ── Messages list ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 mb-4"
            aria-live="polite"
            aria-label="Conversation messages"
          >
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand text-white rounded-br-sm'
                      : 'glass text-text rounded-bl-sm'
                  }`}>
                    {/* Audio player — shows when audio is ready */}
                    {msg.role === 'assistant' && mode === 'audio' && msg.audioUrl && (
                      <div className="mb-2">
                        <audio
                          src={msg.audioUrl}
                          controls
                          autoPlay
                          className="h-8 w-full max-w-[220px]"
                        />
                      </div>
                    )}
                    {/* Audio loading indicator — visible while synthesis runs */}
                    {msg.role === 'assistant' && mode === 'audio' && !msg.audioUrl && loadingAudioId === msg.id && (
                      <div className="flex items-center gap-1.5 mb-2 opacity-60">
                        <Loader2 size={11} className="animate-spin" />
                        <span className="text-[10px]">Generating audio…</span>
                      </div>
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* "Thinking…" indicator while AI response is being generated */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-violet" />
                    <span className="text-xs text-muted">Thinking…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Input bar ── */}
          <div className="glass flex flex-col gap-1 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value.slice(0, MAX_INPUT))}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Share what's on your mind…"
                maxLength={MAX_INPUT}
                className="flex-1 bg-transparent text-text text-sm placeholder:text-muted/60 outline-none min-w-0"
                aria-label="Type your message"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                loading={loading}
                size="sm"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <Send size={14} />
              </Button>
            </div>

            {/* Character counter — appears at 80% capacity */}
            {charWarn && (
              <p className={`text-right text-[10px] transition-colors select-none ${
                charCount >= MAX_INPUT ? 'text-red-400' : 'text-amber-400'
              }`}>
                {charCount} / {MAX_INPUT}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
