'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageCircle, Briefcase, BarChart2, Stethoscope, ShieldCheck
} from 'lucide-react';
import { startDemoSession, ROLE_HOME } from '@/lib/session';
import type { UserRole } from '@/types';

const ROLES: { role: UserRole; label: string; subtitle: string; icon: React.ElementType; gradient: string }[] = [
  {
    role: 'consumer', label: 'Personal', subtitle: 'AI conversations, journaling & insights',
    icon: MessageCircle, gradient: 'from-cyan/20 to-violet/20',
  },
  {
    role: 'employee', label: 'Employee', subtitle: 'Confidential well-being support',
    icon: Briefcase, gradient: 'from-violet/20 to-pink/20',
  },
  {
    role: 'hr', label: 'HR Dashboard', subtitle: 'Anonymized org-wide analytics',
    icon: BarChart2, gradient: 'from-pink/20 to-coral/20',
  },
  {
    role: 'therapist', label: 'Therapist', subtitle: 'Manage your practice & sessions',
    icon: Stethoscope, gradient: 'from-coral/20 to-violet/20',
  },
  {
    role: 'admin', label: 'Admin', subtitle: 'Platform-wide management',
    icon: ShieldCheck, gradient: 'from-cyan/20 to-coral/20',
  },
];

export default function SelectRolePage() {
  const router = useRouter();

  function handleSelect(role: UserRole) {
    startDemoSession(role);
    router.push(ROLE_HOME[role]);
  }

  return (
    <div className="min-h-screen bg-surface-glow flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-coral/10 blur-3xl" />
      </div>

      <div className="w-full max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand shadow-brand flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                <path d="M12 2L4 5.5V11c0 4.5 3.4 8.7 8 9.9 4.6-1.2 8-5.4 8-9.9V5.5L12 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9.5 11.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5c0 2-2.5 4-2.5 4s-2.5-2-2.5-4z" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-text">Confidentia</span>
          </div>
          <h1 className="text-3xl font-bold text-text">Who are you today?</h1>
          <p className="text-muted mt-2">Choose your role to enter your personalized dashboard</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {ROLES.map(({ role, label, subtitle, icon: Icon, gradient }) => (
            <motion.button
              key={role}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(role)}
              className={`glass text-left p-6 cursor-pointer group hover:border-violet/40 hover:shadow-brand transition-all duration-300 bg-gradient-to-br ${gradient}`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                <Icon size={24} className="text-brand" style={{ color: 'var(--violet)' }} />
              </div>
              <h3 className="font-semibold text-text mb-1">{label}</h3>
              <p className="text-xs text-muted leading-relaxed">{subtitle}</p>
              <div className="mt-4 text-xs text-violet font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
