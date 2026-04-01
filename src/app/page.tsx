import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, HeartPulse, BrainCircuit, Users, Check, Zap, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Confidentia — AI-Powered Emotional Well-being',
  description: 'Meet your personal AI companion for mental health. 24/7 confidential support, photorealistic video sessions, and enterprise-grade privacy. Try free today.',
  openGraph: {
    title: 'Confidentia — AI-Powered Emotional Well-being',
    description: 'Confidential. Human. Available 24/7.',
    type: 'website',
  },
};

const FEATURES = [
  { icon: HeartPulse,   color: 'bg-pink/10 text-pink',     title: 'Photorealistic AI Companion',   desc: 'A calming, real-time video presence that feels human — not a chatbot.' },
  { icon: ShieldCheck,  color: 'bg-cyan/10 text-cyan',      title: 'Privacy-First by Design',       desc: 'End-to-end encrypted. Your employer sees zero individual data. GDPR & CCPA compliant.' },
  { icon: BrainCircuit, color: 'bg-violet/10 text-violet',  title: 'Adaptive Memory Engine',        desc: 'Your AI companion learns your journey and builds context over time — you stay in control.' },
  { icon: Users,        color: 'bg-coral/10 text-coral',    title: 'Human Therapist Escalation',    desc: 'Connect to a verified human therapist when needed — seamlessly, within the same platform.' },
];

const SOCIAL_PROOF = [
  { quote: "I finally have someone to talk to at 3am without judgment.", name: "Alex R.", role: "Product Manager" },
  { quote: "The video avatar is almost surreal. It genuinely helped me through my burnout.", name: "Dr. M. Chen", role: "Senior Engineer" },
  { quote: "The anonymity made it safe to finally open up about work stress.", name: "Jordan K.", role: "Sales Director" },
];

const PLAN_HIGHLIGHTS = [
  { name: 'Free',    price: '$0',  feature: '5 sessions/month',           cta: 'Start Free',     variant: 'secondary' as const },
  { name: 'Pro',     price: '$19', feature: 'Unlimited AI + Video avatar', cta: 'Try Pro',        variant: 'primary'   as const, popular: true },
  { name: 'Premium', price: '$49', feature: 'Everything + Human sessions', cta: 'Go Premium',     variant: 'secondary' as const },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-glow text-text overflow-x-hidden">
      {/* Analytics pixel slots — insert GA4/Meta/PostHog scripts here behind cookie consent */}
      {/* <script> ... </script> */}

      {/* ── Topnav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-border/50">
        <span className="font-serif font-bold text-xl bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
          Confidentia
        </span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-text transition-colors">Login</Link>
          <Link href="/select-role" className="text-sm bg-brand text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity font-medium shadow-brand">
            Try Free
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
            GDPR &amp; CCPA Compliant · End-to-End Encrypted
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-6 tracking-tight">
            Your mental health,{' '}
            <span className="bg-gradient-to-r from-violet via-brand to-cyan bg-clip-text text-transparent">
              supported 24/7.
            </span>
          </h1>

          <p className="text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            An AI companion that listens like a human — with photorealistic video, memory, and a warm presence you can trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand text-white font-semibold text-base shadow-brand hover:opacity-90 transition-all"
            >
              <Zap size={16} /> Start Free — No Card Needed
            </Link>
            <Link
              href="/consumer/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-border text-text font-medium text-base hover:bg-surface transition-all"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-center text-3xl font-serif font-bold mb-12">
          Everything you need to feel better.
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
        <h2 className="text-center text-3xl font-serif font-bold mb-10">Trusted by people like you.</h2>
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
        <h2 className="text-3xl font-serif font-bold mb-4">Simple pricing, no surprises.</h2>
        <p className="text-muted mb-10">Start free. Upgrade when you're ready.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_HIGHLIGHTS.map(p => (
            <div key={p.name} className={`glass p-6 rounded-2xl border flex flex-col gap-3 ${p.popular ? 'border-violet ring-2 ring-violet' : 'border-border'}`}>
              {p.popular && <span className="text-xs text-violet font-semibold uppercase tracking-wide">Most Popular</span>}
              <div>
                <p className="font-bold text-text text-lg">{p.name}</p>
                <p className="text-3xl font-bold text-text mt-1">{p.price}<span className="text-sm font-normal text-muted">/mo</span></p>
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
            <span>© {new Date().getFullYear()} Confidentia. All rights reserved.</span>
            <a href="#" className="hover:text-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
