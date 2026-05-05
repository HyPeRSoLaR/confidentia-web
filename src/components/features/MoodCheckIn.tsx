'use client';
/**
 * components/features/MoodCheckIn.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Quick mood check-in component — used in onboarding and at login.
 * Saves to user-memory so the AI avatar knows how the user feels today.
 *
 * Two modes:
 *   • `inline`  — embedded in a page flow (onboarding step)
 *   • `overlay` — full-screen gate shown before redirecting (login)
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveCheckIn } from '@/lib/user-memory';
import type { EmotionLabel } from '@/types';

interface MoodCheckInProps {
  /** Called with the selected emotion after submission */
  onComplete: (emotion: EmotionLabel, intensity: number) => void;
  /** Display mode */
  mode?: 'inline' | 'overlay';
  /** Optional greeting text */
  greeting?: string;
}

const MOODS: { emotion: EmotionLabel; emoji: string; label: string; color: string }[] = [
  { emotion: 'happy',     emoji: '😊', label: 'Bien',       color: 'ring-emerald-400 bg-emerald-400/10' },
  { emotion: 'calm',      emoji: '😌', label: 'Calme',      color: 'ring-cyan bg-cyan/10' },
  { emotion: 'energized', emoji: '⚡', label: 'Dynamisé·e', color: 'ring-amber-400 bg-amber-400/10' },
  { emotion: 'neutral',   emoji: '😐', label: 'Neutre',     color: 'ring-gray-400 bg-gray-400/10' },
  { emotion: 'anxious',   emoji: '😰', label: 'Anxieux·se', color: 'ring-orange-400 bg-orange-400/10' },
  { emotion: 'stressed',  emoji: '😓', label: 'Stressé·e',  color: 'ring-red-400 bg-red-400/10' },
  { emotion: 'sad',       emoji: '😢', label: 'Triste',     color: 'ring-blue-400 bg-blue-400/10' },
  { emotion: 'angry',     emoji: '😤', label: 'En colère',  color: 'ring-red-500 bg-red-500/10' },
];

export function MoodCheckIn({
  onComplete,
  mode = 'inline',
  greeting = 'Comment vous sentez-vous en ce moment ?',
}: MoodCheckInProps) {
  const [selected, setSelected]   = useState<EmotionLabel | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [step, setStep]           = useState<'pick' | 'intensity'>('pick');

  function handleSelect(emotion: EmotionLabel) {
    setSelected(emotion);
    setStep('intensity');
  }

  function handleSubmit() {
    if (!selected) return;
    saveCheckIn({
      emotion:    selected,
      intensity,
      recordedAt: new Date().toISOString(),
    });
    onComplete(selected, intensity);
  }

  const selectedMood = MOODS.find(m => m.emotion === selected);

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={mode === 'overlay'
        ? 'w-full max-w-md mx-auto'
        : ''
      }
    >
      {step === 'pick' && (
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-text mb-2">
              {greeting}
            </h2>
            <p className="text-sm text-muted">
              Votre réponse aide votre assistant IA à mieux vous accompagner.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {MOODS.map(mood => (
              <motion.button
                key={mood.emotion}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(mood.emotion)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 border-border bg-surface hover:border-violet/40 hover:bg-white/5`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="text-[11px] font-medium text-muted">{mood.label}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {step === 'intensity' && selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center">
            <div className="text-5xl mb-3">{selectedMood.emoji}</div>
            <h3 className="text-xl font-serif font-bold text-text mb-1">
              {selectedMood.label}
            </h3>
            <p className="text-sm text-muted">
              À quelle intensité ressentez-vous cela ?
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted">Légèrement</span>
              <span className="text-lg font-bold text-text">{intensity}<span className="text-xs text-muted font-normal">/10</span></span>
              <span className="text-xs text-muted">Très fort</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={intensity}
              onChange={e => setIntensity(+e.target.value)}
              className="w-full accent-violet"
              aria-label="Intensité"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('pick')}
              className="px-5 py-3 rounded-2xl border border-border text-muted hover:text-text text-sm font-medium transition-colors"
            >
              Retour
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-5 py-3 rounded-2xl bg-brand text-white font-semibold text-sm shadow-brand hover:opacity-90 transition-opacity"
            >
              Continuer
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  if (mode === 'overlay') {
    return (
      <div className="min-h-screen bg-surface-glow flex items-center justify-center p-6">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan/10 blur-3xl" />
        </div>
        <div className="relative z-10">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
