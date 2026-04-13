import type { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, Trash2, FileText, Globe, Mail, Calendar, Database } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Confidentia',
  description: 'Notre politique de confidentialité détaille comment Confidentia collecte, utilise et protège vos données personnelles.',
};

const SECTIONS = [
  {
    icon: Database,
    color: 'text-violet bg-violet/10',
    title: 'Données que nous collectons',
    items: [
      'Données de connexion : adresse e-mail, mot de passe haché',
      'Données de profil : prénom, langue, avatar choisi',
      'Données de bien-être : conversations IA, entrées de journal, humeurs (stockées chiffrées)',
      'Données techniques : adresse IP, type de navigateur, logs de session',
      "Données de paiement : informées par Stripe — nous ne stockons pas les numéros de carte",
    ],
  },
  {
    icon: Globe,
    color: 'text-cyan bg-cyan/10',
    title: 'Comment nous utilisons vos données',
    items: [
      "Fournir et améliorer le service Confidentia",
      "Personnaliser votre expérience avec votre compagnon IA",
      "Pour les comptes entreprise (B2B) : générer des statistiques agrégées et anonymisées pour votre employeur — aucune donnée individuelle n'est partagée",
      "Respecter nos obligations légales",
      "Vous envoyer des notifications liées à votre compte (pas de marketing sans consentement explicite)",
    ],
  },
  {
    icon: Lock,
    color: 'text-pink bg-pink/10',
    title: 'Mesures de sécurité',
    items: [
      "Chiffrement AES-256 de toutes les conversations et données sensibles",
      "Transmission sécurisée via TLS 1.3 uniquement",
      "Authentification multi-facteurs disponible",
      "Tests de pénétration réguliers par des tiers indépendants",
      "Accès aux données limité aux employés strictement habilités",
      "Surveillance continue des accès et alertes automatiques en cas d'anomalie",
    ],
  },
  {
    icon: Eye,
    color: 'text-emerald-400 bg-emerald-400/10',
    title: 'Partage avec des tiers',
    items: [
      "Anthropic (Claude AI) — traitement du langage naturel pour les réponses de l'IA",
      "HeyGen — génération de l'avatar vidéo interactif",
      "ElevenLabs — synthèse vocale des réponses IA",
      "Stripe — traitement sécurisé des paiements",
      "Vercel — hébergement de l'application (région Paris EU)",
      "Nous ne vendons jamais vos données à des annonceurs, courtiers ou tiers à des fins commerciales",
    ],
  },
  {
    icon: FileText,
    color: 'text-amber-400 bg-amber-400/10',
    title: 'Cookies et technologies similaires',
    items: [
      "Cookies strictement nécessaires : authentification de session (ne peuvent pas être désactivés)",
      "Cookies de préférences : thème sombre/clair, langue (désactivables)",
      "Pas de cookies publicitaires ni de trackers tiers sans votre consentement explicite",
      "Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement",
    ],
  },
  {
    icon: Trash2,
    color: 'text-coral bg-coral/10',
    title: 'Suppression de votre compte',
    items: [
      "Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil",
      "Toutes vos données personnelles sont effacées dans les 30 jours suivant la demande",
      "Certaines données peuvent être conservées plus longtemps pour obligations légales ou comptables (5 ans maximum)",
      "Vos conversations IA sont supprimées immédiatement après fermeture de la session (non-persistées par défaut)",
    ],
  },
];

export default function ConfidentialitePage() {
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
          <div className="inline-flex items-center gap-2 text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={12} />
            Conforme RGPD · Hébergée en France (Paris EU)
          </div>
          <h1 className="text-4xl font-serif font-bold text-text mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-muted leading-relaxed">
            Chez Confidentia, votre vie privée n&apos;est pas une case à cocher — c&apos;est le fondement de notre produit. Voici exactement comment nous traitons vos données, sans jargon.
          </p>
          <p className="text-xs text-muted mt-4 flex items-center gap-1.5">
            <Calendar size={12} />
            Dernière mise à jour : Avril 2026
          </p>
        </div>

        {/* Engagement clé */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Lock, label: 'Chiffrement AES-256', sub: 'De bout en bout', color: 'text-violet' },
            { icon: Eye, label: 'Zéro revente', sub: 'Vos données ne sont jamais vendues', color: 'text-pink' },
            { icon: Globe, label: 'Hébergement EU', sub: 'Données en France (Paris CDG)', color: 'text-cyan' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass p-4 rounded-2xl border border-border text-center">
                <Icon size={20} className={`${item.color} mx-auto mb-2`} />
                <p className="font-semibold text-text text-sm">{item.label}</p>
                <p className="text-xs text-muted mt-0.5">{item.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass p-6 rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl ${s.color}`}>
                    <Icon size={16} />
                  </div>
                  <h2 className="font-bold text-text">{s.title}</h2>
                </div>
                <ul className="space-y-2">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-violet mt-1 flex-shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Mineurs */}
        <div className="mt-6 glass p-6 rounded-2xl border border-amber-400/30 bg-amber-400/5">
          <h3 className="font-bold text-text mb-2">👶 Personnes mineures</h3>
          <p className="text-sm text-muted">
            Confidentia est destiné aux personnes âgées de 16 ans et plus. Nous ne collectons pas sciemment des données sur des mineurs de moins de 16 ans. Si vous pensez qu&apos;un mineur a créé un compte, contactez-nous à <span className="text-violet font-medium">privacy@confidentia.app</span>.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-6 bg-violet/5 border border-violet/20 rounded-2xl p-6 text-center">
          <Mail size={24} className="text-violet mx-auto mb-3" />
          <h3 className="font-bold text-text mb-2">Une question sur vos données ?</h3>
          <p className="text-sm text-muted mb-4">
            Notre Délégué à la Protection des Données (DPO) est disponible pour répondre à toutes vos questions.
          </p>
          <p className="text-violet font-semibold">privacy@confidentia.app</p>
          <p className="text-xs text-muted mt-2">Réponse sous 48h ouvrées</p>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted">
              Vous pouvez également consulter notre{' '}
              <Link href="/rgpd" className="text-violet hover:underline">page RGPD complète</Link>
              {' '}pour les détails sur vos droits légaux.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
