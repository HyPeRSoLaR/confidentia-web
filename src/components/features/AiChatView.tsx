'use client';
/**
 * components/features/AiChatView.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared AI chat UI used by both /consumer/chat and /employee/chat.
 * All conversation content stays in memory — never persisted without explicit
 * user consent. No employer or admin can access the content of these sessions.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Video, MessageCircle, Loader2, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveAvatar, type InteractiveAvatarRef } from '@/components/ui/InteractiveAvatar';
import { synthesize } from '@/lib/elevenlabs';
import { MOCK_MESSAGES, MOCK_AI_RESPONSES } from '@/lib/mock-data';
import type { Message, ConversationMode } from '@/types';

const MODES: { id: ConversationMode; label: string; icon: React.ElementType }[] = [
  { id: 'text',  label: 'Text',         icon: MessageCircle },
  { id: 'audio', label: 'Audio',        icon: Mic },
  { id: 'video', label: 'Video Avatar', icon: Video },
];

interface AiChatViewProps {
  /** Page title shown in the header */
  title?: string;
  /** Subtitle shown below the title */
  subtitle?: string;
  /**
   * Privacy notice displayed in the banner.
   * Employee users see a note that their employer cannot see chat content.
   */
  privacyNote?: string;
}

export function AiChatView({
  title    = 'AI Conversation',
  subtitle = 'Private, confidential — your conversations are never shared',
  privacyNote = 'Your conversations are end-to-end encrypted and never reviewed by humans.',
}: AiChatViewProps) {
  const [mode,         setMode]         = useState<ConversationMode>('text');
  const [messages,     setMessages]     = useState<Message[]>(MOCK_MESSAGES);
  const [input,        setInput]        = useState('');
  const [loading,      setLoading]      = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const avatarRef  = useRef<InteractiveAvatarRef>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const text = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];

    let audioUrl: string | undefined;
    if (mode === 'audio') {
      const res = await synthesize(text);
      audioUrl = res.audioUrl;
    } else if (mode === 'video' && avatarRef.current) {
      avatarRef.current.speak(text).catch(console.error);
    }

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: text,
      audioUrl,
      timestamp: new Date().toISOString(),
    };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            {!sessionEnded && (
              <Button
                onClick={() => setSessionEnded(true)}
                className="bg-coral/10 text-coral hover:bg-coral hover:text-white border-0 shadow-none transition-all duration-300 rounded-xl px-4 text-sm font-medium"
                aria-label="End this session"
              >
                End Session
              </Button>
            )}
            <div className="hidden sm:flex bg-surface rounded-xl p-1 border border-border gap-1">
              {MODES.map(m => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    aria-pressed={mode === m.id}
                    aria-label={`Switch to ${m.label} mode`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      mode === m.id ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text'
                    }`}
                  >
                    <Icon size={13} />{m.label}
                  </button>
                );
              })}
            </div>
          </div>
        }
      />

      {sessionEnded ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center mb-2 shadow-brand">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif text-text font-bold tracking-tight">Session Complete</h2>
          <p className="text-muted text-base max-w-sm leading-relaxed">
            Your conversation was kept fully confidential and encrypted. Take a moment to breathe and reflect on your progress today.
          </p>
          <div className="pt-8">
            <Button onClick={() => { setSessionEnded(false); setMessages(MOCK_MESSAGES); }} className="rounded-full px-8 py-6 text-sm">
              Begin New Session
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Privacy banner */}
          <div className="flex items-center gap-2 bg-violet/10 border border-violet/20 rounded-xl px-4 py-2.5 mb-4 text-xs text-violet">
            <Lock size={11} className="flex-shrink-0" />
            <span>{privacyNote}</span>
          </div>

          {/* Live video avatar */}
          {mode === 'video' && (
            <div className="mb-4">
              <InteractiveAvatar ref={avatarRef} />
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 mb-4">
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
                    {msg.role === 'assistant' && mode === 'audio' && msg.audioUrl && (
                      <div className="mb-2">
                        <audio src={msg.audioUrl} controls autoPlay className="h-8 w-full max-w-[220px]" />
                      </div>
                    )}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-violet" />
                    <span className="text-xs text-muted">Thinking…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="glass flex items-center gap-3 p-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Share what's on your mind…"
              className="flex-1 bg-transparent text-text text-sm placeholder:text-muted/60 outline-none"
              aria-label="Chat message input"
            />
            <Button
              onClick={sendMessage}
              loading={loading}
              size="sm"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <Send size={14} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
