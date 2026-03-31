'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, EyeOff, Database, Lock, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';

const GUARANTEES = [
  {
    icon: EyeOff,
    title: 'Your employer cannot read your conversations',
    body: 'Every conversation with the AI is end-to-end encrypted. Only you have access to the content of your sessions.',
    color: 'text-cyan',
    bg: 'bg-cyan/10',
  },
  {
    icon: Database,
    title: 'Your data is stored separately',
    body: 'Your personal data is stored in an isolated namespace, completely segregated from your company\'s data at the database level.',
    color: 'text-violet',
    bg: 'bg-violet/10',
  },
  {
    icon: Users,
    title: 'HR only sees anonymized aggregates',
    body: 'HR dashboards only show anonymized trends with a minimum of 5 participants, making individual identification impossible.',
    color: 'text-pink',
    bg: 'bg-pink/10',
  },
  {
    icon: Lock,
    title: 'You control your data',
    body: 'You can delete your account and all associated data at any time. We comply fully with GDPR and CCPA data rights.',
    color: 'text-coral',
    bg: 'bg-coral/10',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Your Privacy" subtitle="How Confidentia keeps your data safe" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border-brand p-8 rounded-2xl text-center mb-8"
      >
        <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-brand">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">Built for confidentiality</h2>
        <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
          Confidentia was designed from the ground up so that the people paying for it — your employer — can never access
          your personal journey. Period.
        </p>
      </motion.div>

      <StaggerList className="space-y-4">
        {GUARANTEES.map(g => {
          const Icon = g.icon;
          return (
            <StaggerItem key={g.title}>
              <Card>
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl ${g.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={g.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-sm mb-1">{g.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{g.body}</p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>
    </div>
  );
}
