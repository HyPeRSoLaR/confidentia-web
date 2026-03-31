'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Video, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_MESSAGES, MOCK_AI_RESPONSES } from '@/lib/mock-data';
import { synthesize } from '@/lib/elevenlabs';
import { generateAvatarVideo } from '@/lib/heygen';
import type { Message, ConversationMode } from '@/types';

const MODES: { id: ConversationMode; label: string; icon: React.ElementType }[] = [
  { id: 'text',  label: 'Text',         icon: MessageCircle },
  { id: 'audio', label: 'Audio',        icon: Mic },
  { id: 'video', label: 'Video Avatar', icon: Video },
];

export default function ChatPage() {
  const [mode, setMode] = useState<ConversationMode>('text');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    const text = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];

    let audioUrl: string | undefined;
    let videoUrl: string | undefined;
    if (mode === 'audio') {
      const res = await synthesize(text);
      audioUrl = res.audioUrl;
    } else if (mode === 'video') {
      const res = await generateAvatarVideo(text);
      videoUrl = res.videoUrl;
    }

    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: text, audioUrl, videoUrl, timestamp: new Date().toISOString() };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      <PageHeader
        title="AI Conversation"
        subtitle="Private, confidential — your conversations are never shared"
        actions={
          <div className="flex bg-surface rounded-xl p-1 border border-border gap-1">
            {MODES.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    mode === m.id ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text'
                  }`}
                >
                  <Icon size={13} />{m.label}
                </button>
              );
            })}
          </div>
        }
      />

      {/* Privacy banner */}
      <div className="flex items-center gap-2 bg-violet/10 border border-violet/20 rounded-xl px-4 py-2.5 mb-4 text-xs text-violet">
        <span>🔒</span>
        <span>Your conversations are end-to-end encrypted and never reviewed by humans.</span>
      </div>

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
                {msg.role === 'assistant' && mode === 'video' && msg.videoUrl && (
                  <div className="mb-3 rounded-xl overflow-hidden bg-black/40 aspect-video flex items-center justify-center text-muted text-xs">
                    [Video avatar: {msg.videoUrl}]
                  </div>
                )}
                {msg.role === 'assistant' && mode === 'audio' && msg.audioUrl && (
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted">
                    <Mic size={12}/> Audio playing: {msg.audioUrl}
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

      {/* Input */}
      <div className="glass flex items-center gap-3 p-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Share what's on your mind…"
          className="flex-1 bg-transparent text-text text-sm placeholder:text-muted/60 outline-none"
        />
        <Button onClick={sendMessage} loading={loading} size="sm" disabled={!input.trim()}>
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}
