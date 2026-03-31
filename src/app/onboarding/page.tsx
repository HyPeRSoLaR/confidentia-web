'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HeartPulse, BrainCircuit, Coffee, Moon, CloudRain, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Mock contexts derived from the strategic vision
const USAGE_CONTEXTS = [
  { id: 'stress', label: 'Work Overload', icon: Coffee, desc: 'Feeling overwhelmed by daily tasks and professional pressure.' },
  { id: 'anxiety', label: 'Anxiety', icon: HeartPulse, desc: 'Racing thoughts, chest tightness, or generalized worry.' },
  { id: 'loneliness', label: 'Loneliness', icon: CloudRain, desc: 'Feeling isolated, disconnected, or lacking a support system.' },
  { id: 'sleep', label: 'Nighttime Anxiety', icon: Moon, desc: 'Difficulty falling asleep or staying asleep due to racing thoughts.' },
  { id: 'burnout', label: 'Early Burnout', icon: BrainCircuit, desc: 'Emotional exhaustion and cynicism towards work or life.' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const completeOnboarding = async () => {
    setLoading(true);
    // Simulate setting up the user profile & generating initial LLM prompt memory
    await new Promise(r => setTimeout(r, 1500));
    router.push('/consumer/chat'); // Redirect to the first free session
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Progress Indicator */}
      <div className="w-full max-w-sm flex gap-2 mb-12">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-brand shadow-brand' : 'bg-surface border border-border'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: WELCOME & PROMISE */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center w-full max-w-md"
          >
            <div className="w-20 h-20 bg-brand rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 shadow-glow">
              <ShieldCheck className="w-10 h-10 text-white -rotate-12" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-text mb-4 tracking-tight">A Safe Space, Just for You.</h1>
            <p className="text-muted text-lg mb-8 leading-relaxed">
              Confidentia provides an instant, photorealistic human connection. 100% confidential, available 24/7, and entirely free of judgment.
            </p>
            <Button onClick={handleNext} className="w-full rounded-2xl py-6 text-base shadow-brand group">
              Begin Your Journey
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}

        {/* STEP 2: USAGE CONTEXT */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-text mb-2">What brings you here today?</h2>
              <p className="text-muted">Select the area you'd like to focus on first. We will tailor your AI companion's expertise to your needs.</p>
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
                      active 
                        ? 'border-transparent bg-white/5 ring-2 ring-violet shadow-brand' 
                        : 'border-border bg-surface hover:bg-white/5 hover:border-violet/50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-1 ${active ? 'bg-brand text-white' : 'bg-surface border border-border text-muted'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-base mb-1 ${active ? 'text-text' : 'text-text'}`}>{ctx.label}</h3>
                      <p className="text-sm text-muted">{ctx.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" className="rounded-2xl py-6 px-6 border-border text-text hover:bg-surface">Back</Button>
              <Button onClick={handleNext} disabled={!selectedContext} className="flex-1 rounded-2xl py-6 text-base shadow-brand">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PRIVACY CONSENT & ACTIVATION */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md text-center"
          >
            <div className="w-16 h-16 bg-surface border border-border rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-brand" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-text mb-4">Your Data is Sacred</h2>
            <div className="bg-surface border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan shrink-0" />
                <p className="text-sm text-muted"><strong className="text-text font-medium">End-to-End Encryption:</strong> Your conversations are secured using AES-256 military-grade encryption.</p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-pink shrink-0" />
                <p className="text-sm text-muted"><strong className="text-text font-medium">Memory Control:</strong> You own your data. You can erase the AI's memory and history at any time with one click.</p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-coral shrink-0" />
                <p className="text-sm text-muted"><strong className="text-text font-medium">Therapeutic Handoff:</strong> We analyze text securely to detect crisis signals, allowing us to seamlessly connect you to a human professional if needed.</p>
              </div>
            </div>

            <Button onClick={completeOnboarding} loading={loading} className="w-full rounded-2xl py-6 text-base shadow-brand group">
              I Accept & Start Free Session
            </Button>
            <button onClick={handleBack} className="mt-4 text-sm text-muted hover:text-text transition-colors">
              Go back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
