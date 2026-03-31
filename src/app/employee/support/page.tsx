'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_MESSAGES, MOCK_AI_RESPONSES } from '@/lib/mock-data';
import type { Message } from '@/types';

export default function EmployeeSupportPage() {
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
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 700));
    const text = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
    setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: 'assistant', content: text, timestamp: new Date().toISOString() }]);
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <PageHeader title="Well-being Support" subtitle="Confidential AI support provided by your employer" />

      {/* Privacy guarantee banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3.5 mb-5"
      >
        <ShieldCheck size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">Your privacy is guaranteed</p>
          <p className="text-xs text-muted mt-0.5">
            Your employer <strong className="text-text">cannot</strong> see these conversations. HR only receives anonymized, aggregated trends — never individual data.
          </p>
        </div>
      </motion.div>

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
                msg.role === 'user' ? 'bg-brand text-white rounded-br-sm' : 'glass text-text rounded-bl-sm'
              }`}>
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
          type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="What would you like to talk about?"
          className="flex-1 bg-transparent text-text text-sm placeholder:text-muted/60 outline-none"
        />
        <Button onClick={sendMessage} loading={loading} size="sm" disabled={!input.trim()}>
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
}
