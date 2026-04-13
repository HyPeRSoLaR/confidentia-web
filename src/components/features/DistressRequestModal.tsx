'use client';
/**
 * components/features/DistressRequestModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Employee emotional distress request — non-anonymous, voluntary.
 * Employee explicitly consents and writes exactly what HR will see.
 * GDPR-compliant: employee owns the disclosure, gives explicit consent.
 *
 * On submit, the request is persisted to localStorage so HR managers
 * can see it live in the /hr/distress page (no backend required for demo).
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/session';
import { submitDistressRequest } from '@/lib/distress-store';
import type { DistressCategory } from '@/types';

interface DistressRequestModalProps {
  open:    boolean;
  onClose: () => void;
  /** Injected by the B2B employee context — shown in the consent line */
  hrManagerName?: string;
}

const CATEGORIES: { id: DistressCategory; emoji: string; label: string; example: string }[] = [
  {
    id:      'wellbeing',
    emoji:   '😔',
    label:   "I'm not feeling well",
    example: 'I need mental health support',
  },
  {
    id:      'time_off',
    emoji:   '🏖',
    label:   'I need time off',
    example: 'A day or half-day for personal wellbeing',
  },
  {
    id:      'speak_hr',
    emoji:   '💬',
    label:   "I'd like to speak with HR",
    example: "About something personal I'd prefer not to write",
  },
  {
    id:      'overload',
    emoji:   '⚡',
    label:   "I'm experiencing overload",
    example: 'I need help prioritising my workload',
  },
  {
    id:      'urgent',
    emoji:   '🚨',
    label:   'I need urgent support',
    example: 'This situation requires immediate attention',
  },
  {
    id:      'other',
    emoji:   '✍️',
    label:   'Something else',
    example: "I'll describe it below",
  },
];

const MAX_NOTE = 300;

export function DistressRequestModal({ open, onClose, hrManagerName = 'your HR manager' }: DistressRequestModalProps) {
  const [step,     setStep]     = useState<'form' | 'confirm' | 'sent'>('form');
  const [category, setCategory] = useState<DistressCategory | null>(null);
  const [note,     setNote]     = useState('');
  const [consent,  setConsent]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  function handleClose() {
    setStep('form');
    setCategory(null);
    setNote('');
    setConsent(false);
    onClose();
  }

  async function submit() {
    if (!category) return;
    setLoading(true);

    // Get current session user for the request payload
    const session = getSession();
    const user    = session.user;

    await new Promise(r => setTimeout(r, 1200));

    // Persist to localStorage so HR can see it immediately
    submitDistressRequest({
      employeeId:    user?.id    ?? 'demo-employee',
      employeeName:  user?.name  ?? 'Demo Employee',
      employeeEmail: user?.email ?? 'demo@employee.com',
      category,
      note: note.trim() || undefined,
    });

    setLoading(false);
    setStep('sent');
  }

  const chosen = CATEGORIES.find(c => c.id === category);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-brand z-10"
          >

            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={16} className="text-red-400" />
                  <h2 className="font-bold text-text">Request support</h2>
                </div>
                <p className="text-xs text-muted">
                  This will be sent with your name to {hrManagerName}.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text transition-colors flex-shrink-0 ml-3"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin">

              {/* ── FORM step ── */}
              {step === 'form' && (
                <>
                  {/* Category selection */}
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">What do you need?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all duration-150 ${
                            category === cat.id
                              ? 'border-transparent ring-2 ring-red-400 bg-red-400/5'
                              : 'border-border bg-surface hover:border-red-400/30'
                          }`}
                        >
                          <span className="text-lg flex-shrink-0 mt-0.5">{cat.emoji}</span>
                          <div>
                            <p className="text-xs font-semibold text-text leading-tight">{cat.label}</p>
                            <p className="text-[10px] text-muted mt-0.5 leading-tight">{cat.example}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional note */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider">Add a note <span className="normal-case font-normal">(optional)</span></p>
                      <span className={`text-[10px] ${note.length > MAX_NOTE * 0.8 ? 'text-amber-400' : 'text-muted'}`}>
                        {note.length}/{MAX_NOTE}
                      </span>
                    </div>
                    <textarea
                      value={note}
                      onChange={e => setNote(e.target.value.slice(0, MAX_NOTE))}
                      placeholder="Describe what's happening in your own words. This is exactly what HR will see."
                      rows={3}
                      className="w-full bg-panel border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none focus:border-red-400/50 resize-none transition-colors"
                    />
                  </div>

                  {/* Consent checkbox */}
                  <label className="flex items-start gap-3 p-3 bg-red-400/5 border border-red-400/20 rounded-xl cursor-pointer">
                    <div
                      onClick={() => setConsent(c => !c)}
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${
                        consent ? 'bg-red-400 border-red-400' : 'border-border bg-surface'
                      }`}
                    >
                      {consent && <Check size={9} className="text-white" strokeWidth={3} />}
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      I understand this request will be sent with <strong className="text-text">my name</strong> to {hrManagerName}.
                      My note will be shown verbatim. I am sharing this voluntarily.
                    </p>
                  </label>

                  <Button
                    onClick={() => setStep('confirm')}
                    disabled={!category || !consent}
                    className="w-full rounded-2xl py-3 bg-red-500 hover:bg-red-600 text-white border-0 shadow-none"
                  >
                    Review &amp; Send
                  </Button>
                </>
              )}

              {/* ── CONFIRM step ── */}
              {step === 'confirm' && (
                <>
                  <div className="bg-panel border border-border rounded-2xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">What HR will see</p>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{chosen?.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-text">{chosen?.label}</p>
                        {note && <p className="text-xs text-muted mt-1 italic">"{note}"</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-400/5 border border-amber-400/20 rounded-xl">
                    <AlertCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted">
                      This cannot be undone. {hrManagerName} will be notified and may reach out to you directly.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setStep('form')} className="flex-1 rounded-2xl">
                      Edit
                    </Button>
                    <Button
                      loading={loading}
                      onClick={submit}
                      className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 text-white border-0 shadow-none"
                    >
                      Send to HR
                    </Button>
                  </div>
                </>
              )}

              {/* ── SENT ── */}
              {step === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-4 gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center">
                    <Check size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text mb-1">Request sent</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {hrManagerName} has been notified. They will typically respond within 24 hours.
                      You've done the right thing by reaching out.
                    </p>
                  </div>
                  <Button onClick={handleClose} className="rounded-2xl px-8">
                    Close
                  </Button>
                </motion.div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
