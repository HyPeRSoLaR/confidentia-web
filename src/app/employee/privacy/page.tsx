'use client';
import { ShieldCheck, Lock, Eye, Trash2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';

const PRINCIPLES = [
  {
    icon: Lock,
    color: 'text-violet bg-violet/10',
    title: 'End-to-End Encrypted',
    body: 'Every conversation with Confidentia is encrypted using AES-256 before leaving your device. Not even Confidentia employees can read your sessions.',
  },
  {
    icon: Eye,
    color: 'text-cyan bg-cyan/10',
    title: 'Your Employer Sees Nothing',
    body: 'Your company only receives anonymized, aggregated well-being trends. Individual data points are never shared. We enforce a minimum of 5 respondents (k-anonymity) before any metric is surfaced.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-500/10',
    title: 'GDPR &amp; CCPA Compliant',
    body: 'We comply fully with GDPR (EU/EEA) and the California Consumer Privacy Act (CCPA). You can request your data or deletion at any time.',
  },
  {
    icon: Trash2,
    color: 'text-coral bg-coral/10',
    title: 'Right to Erasure',
    body: 'Request permanent deletion of all your stored data at any time. Processed within 30 days as required by GDPR Article 17.',
  },
  {
    icon: FileText,
    color: 'text-amber-400 bg-amber-400/10',
    title: 'No Data Sales',
    body: 'We never sell your personal data to third parties. Period. Our business model is your subscription — not your information.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        title="Your Privacy"
        subtitle="How Confidentia protects your data at every step"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted border border-border bg-surface rounded-full px-3 py-1.5">
            <ShieldCheck size={12} className="text-cyan" />
            SOC 2 Type II certified
          </div>
        }
      />

      <StaggerList className="space-y-4">
        {PRINCIPLES.map(p => {
          const Icon = p.icon;
          return (
            <StaggerItem key={p.title}>
              <Card>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${p.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-sm mb-1" dangerouslySetInnerHTML={{ __html: p.title }} />
                    <p className="text-xs text-muted leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      <div className="mt-6 p-4 bg-surface border border-border rounded-2xl text-center">
        <p className="text-xs text-muted">
          Questions about your data? Email{' '}
          <span className="text-violet font-medium">privacy@confidentia.app</span>
          {' '}— we respond within 48h.
        </p>
      </div>
    </div>
  );
}
