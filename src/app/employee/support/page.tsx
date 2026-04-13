'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartHandshake, CheckCircle, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';

const EMOTIONS = ['😣 Submergé(e)', '😰 Anxieux·se', '😞 Moral bas', '😴 Épuisé(e)', '😐 Ça va', '🙂 Bien'];
const STEPS    = ['Comment vous sentez-vous ?', 'Précisions (optionnel)', 'Terminé'];

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
      <PageHeader title="Bilan anonyme de soutien" subtitle="Votre réponse est totalement anonyme — aucune donnée permettant de vous identifier n'est collectée" />

      {/* Indicateur d'étapes */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-brand' : 'bg-border'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Étape 0 : Choix de l'émotion */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Card>
              <h2 className="font-semibold text-text mb-4">Comment vous sentez-vous aujourd&apos;hui ?</h2>
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
                Continuer <ChevronRight size={14} />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Étape 1 : Précisions optionnelles */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <Card>
              <h2 className="font-semibold text-text mb-2">Quelque chose à partager ?</h2>
              <p className="text-xs text-muted mb-4">C&apos;est optionnel et totalement anonyme. Votre employeur ne peut pas voir les réponses individuelles.</p>
              <textarea
                value={detail}
                onChange={e => setDetail(e.target.value)}
                rows={4}
                placeholder="Qu'est-ce qui vous pèse ? (optionnel)"
                className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text placeholder:text-muted/60 resize-none outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                aria-label="Précisions optionnelles"
              />
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => setStep(0)} className="px-4" aria-label="Retour">Retour</Button>
                <Button onClick={handleSubmit} loading={submitting} fullWidth className="shadow-brand">Envoyer anonymement</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Étape 2 : Succès */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <Card>
              <CheckCircle size={52} className="mx-auto text-emerald-400 mb-4" />
              <h2 className="font-bold text-xl text-text mb-2">Merci</h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Votre bilan a été soumis anonymement. Votre bien-être compte — si vous avez besoin d&apos;un soutien immédiat, votre employeur met à disposition des ressources d&apos;accompagnement psychologique confidentielles.
              </p>
              <Button onClick={() => { setStep(0); setEmotion(''); setDetail(''); }} variant="secondary" fullWidth>
                Envoyer un autre bilan
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
