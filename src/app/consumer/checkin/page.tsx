'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { EMOTION_EMOJI, EMOTION_COLORS } from '@/lib/utils';
import type { EmotionLabel } from '@/types';

const EMOTIONS: EmotionLabel[] = ['calm','happy','anxious','stressed','angry','sad','energized','neutral'];

const EMOTION_FR: Record<EmotionLabel, string> = {
  calm:      'Calme',
  happy:     'Joyeux·se',
  anxious:   'Anxieux·se',
  stressed:  'Stressé·e',
  angry:     'En colère',
  sad:       'Triste',
  energized: 'Dynamisé·e',
  neutral:   'Neutre',
};

export default function CheckInPage() {
  const [selected, setSelected] = useState<EmotionLabel | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  function submit() { setDone(true); }
  function reset() { setDone(false); setSelected(null); setIntensity(5); setNote(''); }

  return (
    <div className="max-w-md mx-auto">
      <PageHeader title="Bilan émotionnel" subtitle="Comment vous sentez-vous en ce moment ?" />

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-12 text-center"
          >
            <div className="text-6xl">{selected ? EMOTION_EMOJI[selected] : '✅'}</div>
            <h2 className="text-xl font-bold text-text">Bilan enregistré !</h2>
            <p className="text-sm text-muted">
              Votre émotion <strong>{selected ? EMOTION_FR[selected] : ''}</strong> (intensité {intensity}/10) a été enregistrée.
            </p>
            <Button variant="secondary" onClick={reset}>Faire un nouveau bilan</Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <Card>
              <h3 className="font-semibold text-text mb-4">Choisissez votre émotion</h3>
              <div className="grid grid-cols-4 gap-3">
                {EMOTIONS.map(em => (
                  <motion.button
                    key={em}
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected(em)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                      selected === em
                        ? 'border-transparent text-white'
                        : 'border-border text-muted hover:border-violet/40 hover:text-text'
                    }`}
                    style={selected === em ? { background: EMOTION_COLORS[em], boxShadow: `0 0 16px ${EMOTION_COLORS[em]}60` } : {}}
                  >
                    <span className="text-2xl">{EMOTION_EMOJI[em]}</span>
                    <span className="text-[10px] font-medium">{EMOTION_FR[em]}</span>
                  </motion.button>
                ))}
              </div>
            </Card>

            {selected && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <h3 className="font-semibold text-text mb-4">
                    Intensité : <span className="text-brand">{intensity}/10</span>
                  </h3>
                  <input
                    type="range" min={1} max={10} value={intensity}
                    onChange={e => setIntensity(+e.target.value)}
                    className="w-full accent-violet"
                    aria-label="Intensité de l'émotion"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1"><span>Faible</span><span>Intense</span></div>
                  <div className="mt-4">
                    <textarea
                      placeholder="Optionnel : ajoutez une courte note…"
                      value={note} onChange={e => setNote(e.target.value)}
                      rows={3}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted/60 resize-none focus:outline-none focus:border-violet"
                      aria-label="Note optionnelle"
                    />
                  </div>
                  <Button fullWidth onClick={submit} className="mt-4">Enregistrer le bilan</Button>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
