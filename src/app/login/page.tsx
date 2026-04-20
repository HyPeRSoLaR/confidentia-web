'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
// TODO: import Supabase auth client here when backend is wired

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // TODO: verify credentials via Supabase auth, set session server-side.
    router.push('/select-role');
  }

  function handleDemo() {
    router.push('/select-role');
  }

  return (
    <div className="min-h-screen bg-surface-glow flex items-center justify-center p-4">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-pink/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-brand shadow-brand flex items-center justify-center mb-4"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9">
              <path d="M12 2L4 5.5V11c0 4.5 3.4 8.7 8 9.9 4.6-1.2 8-5.4 8-9.9V5.5L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9.5 11.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 2-2.5 4-2.5 4s-2.5-2-2.5-4z" fill="white"/>
            </svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-text">Confidentia</h1>
          <p className="text-sm text-muted mt-1">Votre assistant émotionnel IA</p>
        </div>

        {/* Card */}
        <div className="glass p-8">
          <h2 className="text-lg font-semibold text-text mb-6">Se connecter</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="E-mail" type="email" placeholder="vous@exemple.com"
              value={email} onChange={e => setEmail(e.target.value)}
              icon={<Mail size={16}/>}
            />
            <Input
              label="Mot de passe" type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              icon={<Lock size={16}/>}
              rightIcon={
                <button type="button" onClick={() => setShowPw(s => !s)} className="hover:text-text transition-colors">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              }
            />
            <Button type="submit" fullWidth loading={loading} className="mt-2">
              Se connecter
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-muted"><span className="bg-surface px-3">ou</span></div>
          </div>

          <Button variant="secondary" fullWidth onClick={handleDemo}>
            ✨ Continuer en démo
          </Button>
          <p className="text-xs text-muted text-center mt-4">
            Aucun compte requis — explorez les 5 tableaux de bord instantanément.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
