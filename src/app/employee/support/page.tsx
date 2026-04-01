'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, CheckCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';

const EMOTIONS = ['😣 Overwhelmed', '😰 Anxious', '😞 Low mood', '😴 Exhausted', '😐 Okay', '🙂 Good'];
const STEPS = ['How are you feeling?', 'Tell us more (optional)', 'Done'];

export default function SupportPage() {
  const [step,        setStep]        = useState(0);
  const [emotion,     setEmotion]     = useState('');
  const [detail,      setDetail]      = useState('');
  const [submitting,  setSubmitting]  = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setStep(2);
  }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Anonymous Support Check-in" subtitle="Your response is completely anonymous — no identifying data is collected" />

      {/* Step indicator */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand' : 'bg-border'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Emotion picker */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Card>
              <h2 className="font-semibold text-text mb-4">How are you feeling today?</h2>
              <div className="grid grid-cols-2 gap-2">
                {EMOTIONS.map(e => (
                  <button
                    key={e}
                    onClick={() => setEmotion(e)}
                    className={`p-3 rounded-xl border text-sm text-left transition-all ${emotion === e ? 'border-violet bg-violet/10 text-violet font-medium' : 'border-border text-muted hover:border-violet/40 hover:text-text'}`}
                    aria-pressed={emotion === e}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(1)} disabled={!emotion} fullWidth className="mt-4 shadow-brand">
                Continue <ChevronRight size={14} />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Step 1: Optional detail */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Card>
              <h2 className="font-semibold text-text mb-2">Anything you'd like to share?</h2>
              <p className="text-xs text-muted mb-4">This is optional and completely anonymous. Your employer cannot see individual responses.</p>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                rows={4}
                placeholder="What's on your mind? (optional)"
                className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text placeholder:text-muted/60 resize-none outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                aria-label="Optional support detail"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => setStep(0)} className="px-4" aria-label="Go back">Back</Button>
                <Button onClick={handleSubmit} loading={submitting} fullWidth className="shadow-brand">Submit Anonymously</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Card>
              <CheckCircle size={52} className="mx-auto text-emerald-400 mb-4" />
              <h2 className="font-bold text-xl text-text mb-2">Thank you</h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Your check-in has been submitted anonymously. Your wellbeing matters — if you need immediate support, your employer has confidential EAP resources available.
              </p>
              <Button onClick={() => { setStep(0); setEmotion(''); setDetail(''); }} variant="secondary" fullWidth>
                Submit Another
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
