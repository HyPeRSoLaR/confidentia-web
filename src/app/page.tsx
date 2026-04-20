import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck, HeartPulse, BrainCircuit, Users, Check, Zap, Star,
  Building2, Video, Briefcase, Phone, MessageCircle, AlertTriangle,
  Linkedin, Instagram, Youtube,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confidentia — Bien-être émotionnel propulsé par l\'IA',
  description: 'Rencontrez Anna, votre assistant émotionnel IA. Soutien confidentiel 24h/24, sessions vidéo photoréalistes et confidentialité de niveau entreprise. Essayez gratuitement.',
  openGraph: {
    title: 'Confidentia — Assistant émotionnel IA',
    description: 'Confidentiel. Humain. Disponible 24h/24.',
    type: 'website',
  },
};

const FEATURES = [
  { icon: HeartPulse,   color: 'bg-pink/10 text-pink',     title: 'Assistant Émotionnel IA',        desc: 'Anna — votre confidente IA photoréaliste. Une présence vidéo apaisante en temps réel qui vous comprend vraiment.' },
  { icon: ShieldCheck,  color: 'bg-cyan/10 text-cyan',      title: 'Conçu pour la Confidentialité',   desc: 'Chiffré de bout en bout. Votre employeur ne voit aucune donnée individuelle. Conforme RGPD & CCPA.' },
  { icon: BrainCircuit, color: 'bg-violet/10 text-violet',  title: 'Mémoire Conversationnelle',       desc: 'Anna se souvient de votre parcours et construit un contexte au fil du temps — vous gardez le contrôle total.' },
  { icon: Users,        color: 'bg-coral/10 text-coral',    title: 'Accès à un Thérapeute Humain',    desc: 'Connectez-vous à un thérapeute diplômé vérifié — de manière transparente, au sein de la même plateforme.' },
];

const SOCIAL_PROOF = [
  { quote: "J'ai enfin quelqu'un à qui parler à 3h du matin, sans jugement.", name: "Alex R.", role: "Chef de Produit" },
  { quote: "Anna m'a vraiment aidé à traverser mon burn-out. C'est presque surréaliste.", name: "Dr. M. Chen", role: "Ingénieure Senior" },
  { quote: "L'anonymat m'a permis de me livrer sur mon stress au travail.", name: "Jordan K.", role: "Directrice Commerciale" },
];

// ── B2C consumer plans ─────────────────────────────────────────────────────────
const B2C_PLANS = [
  {
    name: 'Freemium',
    price: '0€',
    period: '/mois',
    features: ['Texte illimité', 'Audio limité', '3 min vidéo / mois'],
    cta: 'Commencer gratuitement',
    href: '/onboarding',
    popular: false,
  },
  {
    name: 'Standard',
    price: '14,90€',
    period: '/mois',
    features: ['Texte illimité', 'Audio illimité', '20 min vidéo / mois'],
    cta: 'Essayer Standard',
    href: '/select-role',
    popular: false,
  },
  {
    name: 'Premium',
    price: '24,90€',
    period: '/mois',
    features: ['Texte illimité', 'Audio illimité', '50 min vidéo / mois'],
    cta: 'Passer Premium',
    href: '/select-role',
    popular: true,
  },
  {
    name: 'Pro',
    price: '39,90€',
    period: '/mois',
    features: ['Texte illimité', 'Audio illimité', '120 min vidéo / mois', 'Accès prioritaire'],
    cta: 'Passer Pro',
    href: '/select-role',
    popular: false,
  },
];

// ── B2C video credit packs ─────────────────────────────────────────────────────
const VIDEO_PACKS = [
  { label: 'XS', minutes: 10,  price: '4,90€', color: '#10B981' },
  { label: 'S',  minutes: 25,  price: '9,90€', color: '#0EA5E9' },
  { label: 'M',  minutes: 60,  price: '19,90€', color: '#9B6FE8' },
  { label: 'L',  minutes: 120, price: '34,90€', color: '#F59E0B' },
];

// ── B2B platform plans ─────────────────────────────────────────────────────────
// Toutes les features sont disponibles à tous les prix.
// Seul le nombre d'employés change selon le plan.
const B2B_SHARED_FEATURES = [
  'Tableau de bord RH complet',
  'Analytiques bien-être en temps réel',
  'Suivi anonymisé des employés',
  'Alertes critiques automatiques',
  'Rapports périodiques (fréquence configurable)',
  'Segmentation par département / pôle',
  'Export de données RGPD',
  'k-Anonymat configurable',
  'SSO inclus',
];

const B2B_PLATFORM_PLANS = [
  {
    name: 'PME',
    range: '0–50 employés',
    price: '349€',
    features: B2B_SHARED_FEATURES,
    popular: false,
    enterprise: false,
  },
  {
    name: 'Intermédiaire',
    range: '50–200 employés',
    price: '490€',
    features: B2B_SHARED_FEATURES,
    popular: true,
    enterprise: false,
  },
  {
    name: 'Entreprise',
    range: '200+ employés',
    price: '790€',
    features: [...B2B_SHARED_FEATURES, '✦ Account manager dédié', '✦ Intégration SIRH personnalisée', '✦ SLA Premium 99,9 %'],
    popular: false,
    enterprise: true,
  },
];

// ── B2B per-seat employee plans ────────────────────────────────────────────────
const B2B_EMPLOYEE_PLANS = [
  { name: 'Essentiel', price: '6€', videoMin: 5,   popular: false },
  { name: 'Standard',  price: '9€', videoMin: 15,  popular: true  },
  { name: 'Premium',   price: '14€', videoMin: 30, popular: false },
];

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-[#E1306C]' },
  { icon: Youtube,   href: 'https://youtube.com',   label: 'YouTube',  color: 'hover:text-[#FF0000]' },
  // TikTok icon not in lucide-react — using SVG inline below
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-glow text-text overflow-x-hidden">
      {/* ── Topnav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/50">
        <span className="font-serif font-bold text-xl bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
          Confidentia
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-text transition-colors">Connexion</Link>
          <Link href="/select-role" className="text-sm bg-brand text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-brand">
            Essayer gratuitement
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet/10 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-pink/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs bg-violet/10 text-violet border border-violet/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={12} />
            Conforme RGPD & CCPA · Chiffrement de bout en bout
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-6 tracking-tight">
            Votre bien-être émotionnel,{' '}
            <span className="bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
              soutenu 24h/24.
            </span>
          </h1>

          <p className="text-xl text-muted max-w-xl mx-auto mb-4 leading-relaxed">
            Anna — votre <strong className="text-text">assistant émotionnel IA</strong> — vous écoute comme un humain, avec une vidéo photoréaliste, une mémoire et une présence bienveillante en qui vous pouvez avoir confiance.
          </p>

          {/* SOS / Quick-access bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-violet/30 bg-violet/5 text-violet hover:bg-violet/10 transition-all">
              <Phone size={11} /> Parler à un thérapeute
            </Link>
            <Link href="/onboarding" className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-pink/30 bg-pink/5 text-pink hover:bg-pink/10 transition-all">
              <MessageCircle size={11} /> Démarrer avec Anna
            </Link>
            <a href="tel:3114" className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-red-400/40 bg-red-400/5 text-red-400 hover:bg-red-400/10 transition-all font-semibold">
              <AlertTriangle size={11} /> Urgence — 3114
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand text-white font-semibold text-base shadow-brand hover:opacity-90 transition-all"
            >
              <Zap size={16} /> Commencer gratuitement — Sans carte bancaire
            </Link>
            <Link
              href="/consumer/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border text-text font-medium text-base hover:bg-surface transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-center text-3xl font-serif font-bold mb-12">
          Tout ce dont vous avez besoin pour aller mieux.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass p-6 rounded-2xl border border-border group hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200">
                <div className={`inline-flex p-2.5 rounded-xl mb-4 ${f.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="bg-surface border-y border-border py-16 px-6">
        <h2 className="text-center text-3xl font-serif font-bold mb-10">Ils nous font confiance.</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {SOCIAL_PROOF.map(t => (
            <div key={t.name} className="glass p-6 rounded-2xl border border-border">
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-text/90 leading-relaxed italic mb-4">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-text">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Audience badges ── */}
      <section className="max-w-4xl mx-auto px-6 pb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Une plateforme pour tous</p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="flex items-center gap-2 bg-violet/10 border border-violet/25 text-violet text-sm font-semibold rounded-full px-5 py-2">
            <HeartPulse size={14} /> Particuliers (B2C)
          </div>
          <div className="flex items-center gap-2 bg-cyan/10 border border-cyan/25 text-cyan text-sm font-semibold rounded-full px-5 py-2">
            <Building2 size={14} /> Entreprises (B2B)
          </div>
          <div className="flex items-center gap-2 bg-pink/10 border border-pink/25 text-pink text-sm font-semibold rounded-full px-5 py-2">
            <Briefcase size={14} /> Thérapeutes
          </div>
        </div>
      </section>

      {/* ── B2C Pricing ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs bg-violet/10 text-violet border border-violet/20 rounded-full px-4 py-1.5 mb-4">
            <HeartPulse size={12} /> Pour les particuliers
          </div>
          <h2 className="text-3xl font-serif font-bold mb-3">Tarifs individuels</h2>
          <p className="text-muted">Commencez gratuitement. Ajoutez des minutes vidéo dès que vous en avez besoin.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {B2C_PLANS.map(p => (
            <div key={p.name} className={`glass p-6 rounded-2xl border flex flex-col gap-3 ${
              p.popular ? 'border-violet ring-2 ring-violet/50 shadow-[0_0_24px_-6px_rgba(155,111,232,0.35)]' : 'border-border'
            }`}>
              {p.popular && <span className="text-xs text-violet font-semibold uppercase tracking-wide">Le plus populaire</span>}
              <div>
                <p className="font-bold text-text text-base">{p.name}</p>
                <p className="text-3xl font-bold text-text mt-1">{p.price}<span className="text-sm font-normal text-muted">{p.period}</span></p>
              </div>
              <ul className="space-y-1.5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="text-xs text-muted flex items-center gap-1.5">
                    <Check size={10} className="text-brand flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={`mt-auto py-2.5 rounded-xl text-sm font-semibold transition-all text-center ${
                  p.popular
                    ? 'bg-brand text-white shadow-brand hover:opacity-90'
                    : 'border border-border text-text hover:bg-surface'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Video packs */}
        <div className="mt-10">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Video size={15} className="text-muted" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Packs minutes vidéo supplémentaires</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VIDEO_PACKS.map(pack => (
              <div key={pack.label} className="glass rounded-2xl border border-border p-4 text-center hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-xs font-black text-white" style={{ background: pack.color }}>
                  {pack.label}
                </div>
                <p className="text-xl font-black text-text">{pack.price}</p>
                <p className="text-xs text-muted mt-0.5">{pack.minutes} min vidéo</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B Enterprise Pricing ── */}
      <section className="bg-surface border-y border-border py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-xs bg-cyan/10 text-cyan border border-cyan/20 rounded-full px-4 py-1.5 mb-4">
              <Building2 size={12} /> Pour les entreprises
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3">Tarifs entreprise</h2>
            <p className="text-muted max-w-xl mx-auto">
              Toutes les fonctionnalités sont disponibles à tous les prix — seul le nombre d'employés éligibles change.
            </p>
            {/* Offre 3 mois */}
            <div className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm font-semibold">
              🎁 3 premiers mois offerts · 1 mois de frais de dossier
            </div>
          </div>

          {/* Platform plans */}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
            <Building2 size={12} /> Accès plateforme RH <span className="text-[10px] normal-case">— facturé par organisation / mois</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {B2B_PLATFORM_PLANS.map(p => (
              <div key={p.name} className={`glass p-6 rounded-2xl border flex flex-col gap-4 ${
                p.popular ? 'border-violet/60 ring-2 ring-violet/20' : p.enterprise ? 'border-amber-400/40' : 'border-border'
              }`}>
                {p.popular && <span className="text-xs text-violet font-semibold uppercase tracking-wide">Recommandé</span>}
                {p.enterprise && (
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide flex items-center gap-1">
                    ✦ Entreprise Premium
                  </span>
                )}
                <div>
                  <p className="font-bold text-text">{p.name}</p>
                  <p className="text-xs text-muted mt-0.5">{p.range}</p>
                  <p className="text-3xl font-black text-text mt-2">{p.price}<span className="text-sm font-normal text-muted">/mois</span></p>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {p.features.map(f => (
                    <li key={f} className={`text-xs flex items-start gap-1.5 ${f.startsWith('✦') ? 'text-amber-400 font-medium' : 'text-muted'}`}>
                      <Check size={10} className={`flex-shrink-0 mt-0.5 ${f.startsWith('✦') ? 'text-amber-400' : 'text-emerald-400'}`} />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/hr" className={`py-2.5 rounded-xl text-sm font-semibold transition-all text-center ${
                  p.popular ? 'bg-brand text-white shadow-brand hover:opacity-90' : p.enterprise ? 'bg-amber-400/10 border border-amber-400/40 text-amber-400 hover:bg-amber-400/20' : 'border border-border text-text hover:bg-bg'
                }`}>Contacter les ventes</Link>
              </div>
            ))}
          </div>

          {/* Employee per-seat plans */}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
            <Users size={12} /> Licences employés <span className="text-[10px] normal-case">— par siège / mois</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {B2B_EMPLOYEE_PLANS.map(p => (
              <div key={p.name} className={`glass p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                p.popular ? 'border-violet/60' : 'border-border'
              }`}>
                <div>
                  <p className="font-semibold text-text text-sm">{p.name}</p>
                  <p className="text-xs text-muted mt-0.5 flex items-center gap-1">
                    <Video size={10} className="inline" /> {p.videoMin} min vidéo / mois incluses
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-text">{p.price}</p>
                  <p className="text-[10px] text-muted">/emp./mois</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted mt-6">Coût moyen réel : 2–4€ / employé / mois · Devis sur mesure disponible</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Top row: logo + social */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <span className="font-serif font-bold text-lg bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">Confidentia</span>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(s => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`text-muted transition-colors duration-200 ${s.color}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
              {/* TikTok — SVG inline (not in lucide-react) */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-muted hover:text-text transition-colors duration-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.12a8.16 8.16 0 0 0 4.78 1.53V7.2a4.85 4.85 0 0 1-1.02-.51z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom row: links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border/50 text-xs text-muted">
            <span>© {new Date().getFullYear()} Confidentia — Azura Consulting. Tous droits réservés.</span>
            <div className="flex gap-6">
              <Link href="/confidentialite" className="hover:text-text transition-colors">Politique de confidentialité</Link>
              <Link href="/rgpd" className="hover:text-text transition-colors">RGPD</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
