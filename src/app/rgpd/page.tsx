import type { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, Trash2, FileText, Globe, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RGPD — Confidentia',
  description: 'Informations sur le traitement de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).',
};

const RIGHTS = [
  {
    icon: Eye,
    color: 'text-violet bg-violet/10',
    title: 'Droit d\'accès (Art. 15)',
    body: 'Vous pouvez à tout moment demander une copie des données personnelles que nous détenons vous concernant. Nous vous répondrons dans un délai d\'un mois.',
  },
  {
    icon: FileText,
    color: 'text-cyan bg-cyan/10',
    title: 'Droit de portabilité (Art. 20)',
    body: 'Vous pouvez recevoir vos données dans un format structuré, couramment utilisé et lisible par machine, et les transmettre à un autre responsable de traitement.',
  },
  {
    icon: Trash2,
    color: 'text-coral bg-coral/10',
    title: 'Droit à l\'effacement (Art. 17)',
    body: 'Vous pouvez demander la suppression définitive de toutes vos données personnelles. Traité dans les 30 jours. Certaines données peuvent être conservées pour obligations légales.',
  },
  {
    icon: Lock,
    color: 'text-pink bg-pink/10',
    title: 'Droit à la limitation (Art. 18)',
    body: 'Vous pouvez demander la limitation du traitement de vos données dans certains cas, notamment en cas de contestation de l\'exactitude des données.',
  },
  {
    icon: Globe,
    color: 'text-emerald-400 bg-emerald-400/10',
    title: 'Droit d\'opposition (Art. 21)',
    body: 'Vous pouvez vous opposer à tout moment au traitement de vos données à des fins de prospection commerciale. Vous pouvez également vous opposer au traitement basé sur l\'intérêt légitime.',
  },
  {
    icon: ShieldCheck,
    color: 'text-amber-400 bg-amber-400/10',
    title: 'Droit de réclamation (Art. 77)',
    body: 'Vous avez le droit d\'introduire une réclamation auprès de la CNIL (Commission Nationale de l\'Informatique et des Libertés) : www.cnil.fr — 3, place de Fontenoy, 75007 Paris.',
  },
];

const DATA_CATEGORIES = [
  { category: 'Données d\'identification', examples: 'Nom, prénom, adresse e-mail', base: 'Contrat', retention: '3 ans après fin de contrat' },
  { category: 'Données de bien-être', examples: 'Conversations IA, humeurs, journaux', base: 'Consentement explicite', retention: 'Durée de l\'abonnement + 30 jours' },
  { category: 'Données techniques', examples: 'Adresse IP, logs de connexion', base: 'Intérêt légitime', retention: '12 mois' },
  { category: 'Données de paiement', examples: 'Informations carte (via Stripe)', base: 'Contrat', retention: '5 ans (obligation légale)' },
];

export default function RGPDPage() {
  return (
    <div className="min-h-screen bg-surface-glow">
      {/* Topnav simple */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/50">
        <Link href="/" className="font-serif font-bold text-xl bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
          Confidentia
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-text transition-colors">← Retour à l&apos;accueil</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* En-tête */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 text-xs bg-violet/10 text-violet border border-violet/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={12} />
            Conforme RGPD (UE) 2016/679
          </div>
          <h1 className="text-4xl font-serif font-bold text-text mb-4">
            Protection des données personnelles
          </h1>
          <p className="text-muted leading-relaxed">
            Confidentia traite vos données personnelles en conformité avec le Règlement Général sur la Protection des Données (RGPD) — Règlement (UE) 2016/679. Cette page vous informe sur vos droits et nos obligations.
          </p>
          <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
            <Calendar size={12} />
            Dernière mise à jour : Avril 2026
          </p>
        </div>

        {/* Responsable de traitement */}
        <div className="glass p-6 rounded-2xl border border-border mb-8">
          <h2 className="font-bold text-text text-lg mb-3">Responsable de traitement</h2>
          <div className="space-y-1 text-sm text-muted">
            <p><strong className="text-text">Société :</strong> Confidentia SAS</p>
            <p><strong className="text-text">Siège social :</strong> Paris, France</p>
            <p><strong className="text-text">DPO :</strong> <span className="text-violet">dpo@confidentia.app</span></p>
            <p><strong className="text-text">Contact RGPD :</strong> <span className="text-violet">privacy@confidentia.app</span></p>
          </div>
        </div>

        {/* Bases légales et données traitées */}
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-text mb-6">Données traitées &amp; bases légales</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-4 text-muted font-semibold text-xs uppercase tracking-wide">Catégorie</th>
                  <th className="text-left py-3 pr-4 text-muted font-semibold text-xs uppercase tracking-wide">Exemples</th>
                  <th className="text-left py-3 pr-4 text-muted font-semibold text-xs uppercase tracking-wide">Base légale</th>
                  <th className="text-left py-3 text-muted font-semibold text-xs uppercase tracking-wide">Conservation</th>
                </tr>
              </thead>
              <tbody>
                {DATA_CATEGORIES.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-text">{row.category}</td>
                    <td className="py-3 pr-4 text-muted">{row.examples}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        row.base === 'Consentement explicite' ? 'bg-violet/10 text-violet' :
                        row.base === 'Contrat' ? 'bg-cyan/10 text-cyan' : 'bg-amber-400/10 text-amber-400'
                      }`}>
                        {row.base}
                      </span>
                    </td>
                    <td className="py-3 text-muted text-xs">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Droits des personnes */}
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-text mb-6">Vos droits</h2>
          <div className="grid gap-4">
            {RIGHTS.map(r => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="glass p-5 rounded-2xl border border-border hover:border-violet/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${r.color}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text text-sm mb-1">{r.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transferts hors UE */}
        <div className="glass p-6 rounded-2xl border border-border mb-8">
          <h2 className="font-bold text-text text-lg mb-3">Transferts de données hors UE</h2>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Certains de nos sous-traitants opèrent hors de l&apos;Espace Économique Européen. Dans ce cas, nous nous assurons que des garanties appropriées sont en place :
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-2"><span className="text-violet mt-1">·</span> <span><strong className="text-text">Anthropic (Claude AI)</strong> — USA — Clauses contractuelles types (CCT) UE</span></li>
            <li className="flex items-start gap-2"><span className="text-violet mt-1">·</span> <span><strong className="text-text">HeyGen (Avatar IA)</strong> — USA — Clauses contractuelles types (CCT) UE</span></li>
            <li className="flex items-start gap-2"><span className="text-violet mt-1">·</span> <span><strong className="text-text">ElevenLabs (Synthèse vocale)</strong> — USA — Clauses contractuelles types (CCT) UE</span></li>
            <li className="flex items-start gap-2"><span className="text-violet mt-1">·</span> <span><strong className="text-text">Vercel (Hébergement)</strong> — Région EU (Paris cdg1) — Données au repos dans l&apos;UE</span></li>
          </ul>
        </div>

        {/* Exercer ses droits */}
        <div className="bg-violet/5 border border-violet/20 rounded-2xl p-6 text-center">
          <Mail size={24} className="text-violet mx-auto mb-3" />
          <h3 className="font-bold text-text mb-2">Exercer vos droits</h3>
          <p className="text-sm text-muted mb-4">
            Pour toute demande relative à vos données personnelles, contactez notre DPO :
          </p>
          <p className="text-violet font-semibold">privacy@confidentia.app</p>
          <p className="text-xs text-muted mt-2">Réponse garantie sous 30 jours conformément au RGPD</p>
        </div>

      </div>
    </div>
  );
}
