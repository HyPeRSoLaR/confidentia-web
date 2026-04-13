'use client';
import { ShieldCheck, Lock, Eye, Trash2, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';

const PRINCIPLES = [
  {
    icon: Lock,
    color: 'text-violet bg-violet/10',
    title: 'Chiffrement de bout en bout',
    body: 'Chaque conversation avec Confidentia est chiffrée en AES-256 avant de quitter votre appareil. Même les employés de Confidentia ne peuvent pas lire vos sessions.',
  },
  {
    icon: Eye,
    color: 'text-cyan bg-cyan/10',
    title: 'Votre employeur ne voit rien',
    body: 'Votre entreprise ne reçoit que des tendances de bien-être anonymisées et agrégées. Les données individuelles ne sont jamais partagées. Nous appliquons un minimum de 5 répondants (k-anonymat) avant de divulguer toute métrique.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-400 bg-emerald-500/10',
    title: 'Conforme RGPD &amp; CCPA',
    body: 'Nous respectons entièrement le RGPD (UE/EEE) et le California Consumer Privacy Act (CCPA). Vous pouvez demander vos données ou leur suppression à tout moment.',
  },
  {
    icon: Trash2,
    color: 'text-coral bg-coral/10',
    title: 'Droit à l’effacement',
    body: 'Demandez la suppression définitive de toutes vos données à tout moment. Traité dans les 30 jours conformément à l’article 17 du RGPD.',
  },
  {
    icon: FileText,
    color: 'text-amber-400 bg-amber-400/10',
    title: 'Pas de revente de données',
    body: 'Nous ne vendons jamais vos données personnelles à des tiers. Un point c’est tout. Notre modèle commercial, c’est votre abonnement — pas vos informations.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        title="Votre Confidentialité"
        subtitle="Comment Confidentia protège vos données à chaque étape"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted border border-border bg-surface rounded-full px-3 py-1.5">
            <ShieldCheck size={12} className="text-cyan" />
            Certifié SOC 2 Type II
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
          Des questions sur vos données ? Écrivez à{' '}
          <span className="text-violet font-medium">privacy@confidentia.app</span>
          {' '}— nous répondons dans les 48h.
        </p>
      </div>
    </div>
  );
}
