import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, HeartPulse, BrainCircuit, Users, Check, Zap, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confidentia — Bien-être émotionnel propulsé par l\'IA',
  description: 'Rencontrez votre compagnon IA pour la santé mentale. Soutien confidentiel 24h/24, sessions vidéo photoréalistes et confidentialité de niveau entreprise. Essayez gratuitement.',
  openGraph: {
    title: 'Confidentia — Bien-être émotionnel propulsé par l\'IA',
    description: 'Confidentiel. Humain. Disponible 24h/24.',
    type: 'website',
  },
};

const FEATURES = [
  { icon: HeartPulse,   color: 'bg-pink/10 text-pink',     title: 'Compagnon IA Photoréaliste',      desc: 'Une présence vidéo apaisante et en temps réel qui semble humaine — pas un simple chatbot.' },
  { icon: ShieldCheck,  color: 'bg-cyan/10 text-cyan',      title: 'Conçu pour la Confidentialité',   desc: 'Chiffré de bout en bout. Votre employeur ne voit aucune donnée individuelle. Conforme RGPD & CCPA.' },
  { icon: BrainCircuit, color: 'bg-violet/10 text-violet',  title: 'Moteur de Mémoire Adaptatif',     desc: 'Votre compagnon IA apprend votre parcours et construit un contexte au fil du temps — vous gardez le contrôle.' },
  { icon: Users,        color: 'bg-coral/10 text-coral',    title: 'Escalade vers un Thérapeute',     desc: 'Connectez-vous à un thérapeute humain vérifié en cas de besoin — de manière transparente, au sein de la même plateforme.' },
];

const SOCIAL_PROOF = [
  { quote: "J'ai enfin quelqu'un à qui parler à 3h du matin, sans jugement.", name: "Alex R.", role: "Chef de Produit" },
  { quote: "L'avatar vidéo est presque surréaliste. Il m'a vraiment aidé à traverser mon burn-out.", name: "Dr. M. Chen", role: "Ingénieure Senior" },
  { quote: "L'anonymat m'a permis de me livrer sur mon stress au travail.", name: "Jordan K.", role: "Directrice Commerciale" },
];

const PLAN_HIGHLIGHTS = [
  { name: 'Gratuit',  price: '0€',  feature: '5 sessions/mois',              cta: 'Commencer gratuitement', variant: 'secondary' as const },
  { name: 'Pro',      price: '19€', feature: 'IA illimitée + Avatar vidéo',  cta: 'Essayer Pro',            variant: 'primary'   as const, popular: true },
  { name: 'Premium',  price: '49€', feature: 'Tout + Sessions humaines',     cta: 'Passer Premium',         variant: 'secondary' as const },
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
            Conforme RGPD &amp; CCPA · Chiffrement de bout en bout
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-6 tracking-tight">
            Votre santé mentale,{' '}
            <span className="bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
              soutenue 24h/24.
            </span>
          </h1>

          <p className="text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Un compagnon IA qui écoute comme un humain — avec une vidéo photoréaliste, une mémoire et une présence bienveillante en qui vous pouvez avoir confiance.
          </p>

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

      {/* ── Pricing highlight ── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">Des tarifs simples, sans surprise.</h2>
        <p className="text-muted mb-10">Commencez gratuitement. Évoluez quand vous êtes prêt.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_HIGHLIGHTS.map(p => (
            <div key={p.name} className={`glass p-6 rounded-2xl border flex flex-col gap-3 ${p.popular ? 'border-violet ring-2 ring-violet' : 'border-border'}`}>
              {p.popular && <span className="text-xs text-violet font-semibold uppercase tracking-wide">Le plus populaire</span>}
              <div>
                <p className="font-bold text-text text-lg">{p.name}</p>
                <p className="text-3xl font-bold text-text mt-1">{p.price}<span className="text-sm font-normal text-muted">/mois</span></p>
              </div>
              <p className="text-xs text-muted flex items-center gap-1.5"><Check size={11} className="text-brand" />{p.feature}</p>
              <Link
                href="/select-role"
                className={`mt-auto py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span className="font-serif font-bold text-lg bg-gradient-to-r from-violet to-cyan bg-clip-text text-transparent">Confidentia</span>
          <div className="flex gap-6">
            <span>© {new Date().getFullYear()} Confidentia. Tous droits réservés.</span>
            <Link href="/confidentialite" className="hover:text-text transition-colors">Politique de confidentialité</Link>
            <Link href="/rgpd" className="hover:text-text transition-colors">RGPD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
