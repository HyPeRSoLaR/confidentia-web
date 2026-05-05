'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, HeartPulse, BrainCircuit, Coffee,
  Moon, CloudRain, ChevronRight, Lock, Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PERSONA_META, AVATARS, ANN_THERAPIST, saveAvatarPrefs } from '@/lib/avatar-config';
import { saveUsageContext, incrementSessionCount } from '@/lib/user-memory';
import type { AvatarPersona, AvatarConfig } from '@/lib/avatar-config';
import type { UsageContext } from '@/lib/user-memory';

const USAGE_CONTEXTS = [
  { id: 'stress',      label: 'Surcharge de travail',  icon: Coffee,       desc: 'Se sentir submergé par les tâches quotidiennes et la pression professionnelle.' },
  { id: 'anxiety',    label: 'Anxiété',                icon: HeartPulse,   desc: 'Pensées accélérées, oppression thoracique ou inquiétude généralisée.' },
  { id: 'loneliness', label: 'Solitude',               icon: CloudRain,    desc: 'Se sentir isolé, déconnecté ou sans système de soutien.' },
  { id: 'sleep',      label: 'Anxiété nocturne',       icon: Moon,         desc: 'Difficultés à s\'endormir à cause de pensées envahissantes.' },
  { id: 'burnout',    label: 'Burn-out précoce',       icon: BrainCircuit, desc: 'Épuisement émotionnel et cynisme vis-à-vis du travail ou de la vie.' },
];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step,            setStep]            = useState(1);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedAvatar,  setSelectedAvatar]  = useState<AvatarConfig>(ANN_THERAPIST);
  const [selectedPersona, setSelectedPersona] = useState<AvatarPersona>('warm');
  const [loading,         setLoading]         = useState(false);

  const handleNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const completeOnboarding = async () => {
    setLoading(true);
    saveAvatarPrefs(selectedAvatar.id, selectedAvatar.name, selectedPersona);
    if (selectedContext) saveUsageContext(selectedContext as UsageContext);
    incrementSessionCount();
    await new Promise(r => setTimeout(r, 1200));
    router.push('/consumer/chat');
  };


  return (
    <div className="min-h-screen bg-surface-glow flex flex-col items-center justify-center p-6">
      {/* Ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                step >= i + 1 ? 'bg-brand shadow-brand' : 'bg-surface border border-border'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── ÉTAPE 1 : Bienvenue ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="w-20 h-20 bg-brand rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 shadow-brand">
                <ShieldCheck className="w-10 h-10 text-white -rotate-12" />
              </div>
              <h1 className="text-4xl font-serif font-bold text-text mb-4 tracking-tight">
                Un espace sûr,<br />rien que pour vous.
              </h1>
              <p className="text-muted text-lg mb-10 leading-relaxed">
                Confidentia vous offre une connexion humaine instantanée et photoréaliste.
                100% confidentiel, disponible 24h/24 et totalement sans jugement.
              </p>
              <Button onClick={handleNext} className="w-full rounded-2xl py-6 text-base shadow-brand group">
                Commencer votre parcours
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── ÉTAPE 2 : Contexte ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">Qu&apos;est-ce qui vous amène ?</h2>
                <p className="text-muted text-sm leading-relaxed">
                  Sélectionnez le domaine sur lequel vous souhaitez vous concentrer. Nous adapterons l&apos;approche de votre assistant à vos besoins.
                </p>
              </div>
              <div className="grid gap-3 mb-8">
                {USAGE_CONTEXTS.map(ctx => {
                  const Icon = ctx.icon;
                  const active = selectedContext === ctx.id;
                  return (
                    <button
                      key={ctx.id}
                      onClick={() => setSelectedContext(ctx.id)}
                      className={`flex items-start text-left gap-4 p-4 rounded-2xl transition-all duration-200 border ${
                        active ? 'border-transparent bg-white/5 ring-2 ring-violet shadow-brand' : 'border-border bg-surface hover:bg-white/5 hover:border-violet/50'
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-1 flex-shrink-0 ${active ? 'bg-brand text-white' : 'bg-surface border border-border text-muted'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-text mb-1">{ctx.label}</h3>
                        <p className="text-sm text-muted">{ctx.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Retour</Button>
                <Button onClick={handleNext} disabled={!selectedContext} className="flex-1 rounded-2xl py-3 text-base shadow-brand">Continuer</Button>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAPE 3 : Choix d'avatar ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Choisissez votre assistant
                </h2>
                <p className="text-muted text-sm">Sélectionnez la personne avec qui vous souhaitez échanger.</p>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-8">
                {AVATARS.map(avatar => {
                  const active = selectedAvatar.id === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                        active
                          ? 'border-transparent ring-2 ring-violet bg-white/5 shadow-brand'
                          : 'border-border bg-surface hover:border-violet/40 hover:bg-white/5'
                      }`}
                    >
                      {/* Avatar preview */}
                      <div className="relative">
                        <img
                          src={avatar.stillUrl}
                          alt={avatar.name}
                          className={`w-16 h-16 rounded-xl object-cover transition-all duration-200 ${
                            active ? 'ring-2 ring-violet shadow-brand' : 'ring-1 ring-border'
                          }`}
                        />
                        {active && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet flex items-center justify-center shadow-brand">
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Name */}
                      <p className={`text-xs font-semibold ${active ? 'text-text' : 'text-muted'}`}>
                        {avatar.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Selected avatar tagline */}
              <div className="glass p-4 rounded-2xl flex items-center gap-3 mb-6">
                <img src={selectedAvatar.stillUrl} alt={selectedAvatar.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 ring-2 ring-border" />
                <div>
                  <p className="text-sm font-semibold text-text">{selectedAvatar.name}</p>
                  <p className="text-xs text-muted">{selectedAvatar.tagline}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Retour</Button>
                <Button onClick={handleNext} className="flex-1 rounded-2xl py-3 shadow-brand">Continuer</Button>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAPE 4 : Personnalité ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-6">
                <img src={selectedAvatar.stillUrl} alt={selectedAvatar.name} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 ring-2 ring-border shadow-brand" />
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  Comment {selectedAvatar.name} doit-{selectedAvatar.gender === 'male' ? 'il' : 'elle'} vous aborder ?
                </h2>
                <p className="text-muted text-sm">Choisissez le style de personnalité qui vous correspond le mieux.</p>
              </div>

              <div className="grid gap-3 mb-8">
                {(Object.entries(PERSONA_META) as [AvatarPersona, typeof PERSONA_META[AvatarPersona]][]).map(([key, meta]) => {
                  const active = selectedPersona === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPersona(key)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 ${
                        active ? 'border-transparent ring-2 ring-violet bg-white/5 shadow-brand' : 'border-border bg-surface hover:border-violet/40'
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{meta.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-text text-sm mb-0.5">{meta.label}</p>
                        <p className="text-xs text-muted">{meta.description}</p>
                      </div>
                      {active && <Check size={14} className="text-violet flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Retour</Button>
                <Button onClick={handleNext} className="flex-1 rounded-2xl py-3 shadow-brand">Continuer</Button>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAPE 5 : Consentement confidentialité ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="w-16 h-16 bg-surface border border-border rounded-2xl mx-auto flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-violet" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-text mb-4">Vos Données sont Sacrées</h2>

              <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">Chiffrement de bout en bout :</strong>{' '}
                    Vos conversations sont sécurisées avec un chiffrement militaire AES-256.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">Contrôle de la mémoire :</strong>{' '}
                    Vous possédez vos données. Effacez la mémoire de l&apos;IA à tout moment en un clic.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">Transfert thérapeute :</strong>{' '}
                    Nous détectons les signaux de crise et pouvons vous connecter à un professionnel humain si nécessaire.
                  </p>
                </div>
              </div>

              {/* Récapitulatif des choix */}
              <div className="glass p-4 rounded-2xl flex items-center gap-3 mb-6 text-left">
                <img src={selectedAvatar.stillUrl} alt={selectedAvatar.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text">{selectedAvatar.name} · {PERSONA_META[selectedPersona].emoji} {PERSONA_META[selectedPersona].label}</p>
                  <p className="text-xs text-muted">Votre assistant émotionnel IA est prêt{selectedAvatar.gender === 'female' ? 'e' : ''}</p>
                </div>
              </div>

              <Button onClick={completeOnboarding} loading={loading} className="w-full rounded-2xl py-4 text-base shadow-brand group">
                J&apos;accepte &amp; Commencer ma session gratuite
              </Button>
              <button onClick={handleBack} className="mt-4 text-sm text-muted hover:text-text transition-colors">
                Retour
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
