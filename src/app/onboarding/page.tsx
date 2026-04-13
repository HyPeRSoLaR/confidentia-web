'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, HeartPulse, BrainCircuit, Coffee,
  Moon, CloudRain, ChevronRight, Lock, Check, Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AVATARS, PERSONA_META, saveAvatarPrefs } from '@/lib/avatar-config';
import type { AvatarPersona } from '@/lib/avatar-config';

const USAGE_CONTEXTS = [
  { id: 'stress',     label: 'Work Overload',   icon: Coffee,      desc: 'Feeling overwhelmed by daily tasks and professional pressure.' },
  { id: 'anxiety',   label: 'Anxiety',          icon: HeartPulse,  desc: 'Racing thoughts, chest tightness, or generalized worry.' },
  { id: 'loneliness',label: 'Loneliness',        icon: CloudRain,   desc: 'Feeling isolated, disconnected, or lacking a support system.' },
  { id: 'sleep',     label: 'Nighttime Anxiety', icon: Moon,        desc: 'Difficulty falling asleep due to racing thoughts.' },
  { id: 'burnout',   label: 'Early Burnout',     icon: BrainCircuit,desc: 'Emotional exhaustion and cynicism towards work or life.' },
];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step,            setStep]            = useState(1);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [selectedAvatar,  setSelectedAvatar]  = useState(AVATARS[0].id);
  const [avatarName,      setAvatarName]      = useState('');
  const [editingName,     setEditingName]     = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<AvatarPersona>('warm');
  const [loading,         setLoading]         = useState(false);

  const handleNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const completeOnboarding = async () => {
    setLoading(true);
    // Persist avatar preferences
    saveAvatarPrefs(selectedAvatar, avatarName, selectedPersona);
    await new Promise(r => setTimeout(r, 1200));
    router.push('/consumer/chat');
  };

  const chosenAvatar = AVATARS.find(a => a.id === selectedAvatar) ?? AVATARS[0];

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

          {/* ── STEP 1: Welcome ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="w-20 h-20 bg-brand rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 shadow-brand">
                <ShieldCheck className="w-10 h-10 text-white -rotate-12" />
              </div>
              <h1 className="text-4xl font-serif font-bold text-text mb-4 tracking-tight">
                A Safe Space,<br />Just for You.
              </h1>
              <p className="text-muted text-lg mb-10 leading-relaxed">
                Confidentia provides an instant, photorealistic human connection.
                100% confidential, available 24/7, and entirely free of judgment.
              </p>
              <Button onClick={handleNext} className="w-full rounded-2xl py-6 text-base shadow-brand group">
                Begin Your Journey
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {/* ── STEP 2: Usage context ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">What brings you here?</h2>
                <p className="text-muted text-sm leading-relaxed">
                  Select the area you'd like to focus on. We'll tailor your AI companion's approach to your needs.
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
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Back</Button>
                <Button onClick={handleNext} disabled={!selectedContext} className="flex-1 rounded-2xl py-3 text-base shadow-brand">Continue</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Avatar choice ── */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-text mb-2">Choose your companion</h2>
                <p className="text-muted text-sm leading-relaxed">
                  This is who you'll speak with. You can change them anytime.
                </p>
              </div>

              {/* 2×4 avatar grid */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {AVATARS.map(av => {
                  const active = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => { setSelectedAvatar(av.id); setAvatarName(''); }}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all duration-200 ${
                        active ? 'border-transparent ring-2 ring-violet bg-violet/5 shadow-brand' : 'border-border bg-surface hover:border-violet/40'
                      }`}
                    >
                      <div className="relative">
                        <img src={av.stillUrl} alt={av.name} className="w-14 h-14 rounded-xl object-cover" />
                        {active && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                            <Check size={9} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] font-semibold ${active ? 'text-violet' : 'text-muted'}`}>{av.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected companion preview + optional name */}
              <div className="glass p-4 rounded-2xl flex items-center gap-4 mb-6">
                <img src={chosenAvatar.stillUrl} alt={chosenAvatar.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingName ? (
                    <input
                      autoFocus
                      type="text"
                      value={avatarName}
                      onChange={e => setAvatarName(e.target.value.slice(0, 24))}
                      onBlur={() => setEditingName(false)}
                      onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
                      placeholder={`Custom name (default: ${chosenAvatar.name})`}
                      className="w-full bg-transparent text-text text-sm outline-none border-b border-violet pb-0.5 placeholder:text-muted/50"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="flex items-center gap-1.5 group text-left"
                    >
                      <span className="text-sm font-semibold text-text">{avatarName || chosenAvatar.name}</span>
                      <Pencil size={11} className="text-muted group-hover:text-violet transition-colors" />
                    </button>
                  )}
                  <p className="text-xs text-muted mt-0.5">{chosenAvatar.tagline}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Back</Button>
                <Button onClick={handleNext} className="flex-1 rounded-2xl py-3 shadow-brand">Continue</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Personality / Behaviour ── */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-6">
                <img src={chosenAvatar.stillUrl} alt={chosenAvatar.name} className="w-16 h-16 rounded-2xl object-cover mx-auto mb-3 ring-2 ring-border shadow-brand" />
                <h2 className="text-3xl font-serif font-bold text-text mb-2">
                  How should {avatarName || chosenAvatar.name} approach you?
                </h2>
                <p className="text-muted text-sm">Choose the personality style that resonates most.</p>
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
                <Button variant="secondary" onClick={handleBack} className="rounded-2xl px-6">Back</Button>
                <Button onClick={handleNext} className="flex-1 rounded-2xl py-3 shadow-brand">Continue</Button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 5: Privacy consent ── */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <div className="w-16 h-16 bg-surface border border-border rounded-2xl mx-auto flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-violet" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-text mb-4">Your Data is Sacred</h2>

              <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">End-to-End Encryption:</strong>{' '}
                    Your conversations are secured using AES-256 military-grade encryption.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">Memory Control:</strong>{' '}
                    You own your data. Erase the AI's memory at any time with one click.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                  <p className="text-sm text-muted">
                    <strong className="text-text font-medium">Therapeutic Handoff:</strong>{' '}
                    We detect crisis signals securely and can connect you to a human professional if needed.
                  </p>
                </div>
              </div>

              {/* Summary of choices */}
              <div className="glass p-4 rounded-2xl flex items-center gap-3 mb-6 text-left">
                <img src={chosenAvatar.stillUrl} alt={chosenAvatar.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text">{avatarName || chosenAvatar.name} · {PERSONA_META[selectedPersona].emoji} {PERSONA_META[selectedPersona].label}</p>
                  <p className="text-xs text-muted">Your AI companion is ready</p>
                </div>
              </div>

              <Button onClick={completeOnboarding} loading={loading} className="w-full rounded-2xl py-4 text-base shadow-brand group">
                I Accept &amp; Start Free Session
              </Button>
              <button onClick={handleBack} className="mt-4 text-sm text-muted hover:text-text transition-colors">
                Go back
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
