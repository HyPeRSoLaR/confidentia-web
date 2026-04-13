'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Video, Zap, Star, Shield, Crown, Film, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_PLANS, MOCK_VIDEO_CREDIT_PACKS } from '@/lib/mock-data';

// ─── Constants ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'plans',  label: 'Plans',         icon: Zap },
  { id: 'packs',  label: 'Video Credits', icon: Film },
] as const;
type Tab = (typeof TABS)[number]['id'];

const TIER_ICON: Record<string, typeof Zap> = {
  free: Shield, standard: Zap, premium: Star, pro: Crown,
};
const TIER_GRAD: Record<string, string> = {
  free:     'from-slate-500/20 to-slate-500/5',
  standard: 'from-cyan-500/20 to-cyan-500/5',
  premium:  'from-violet-500/25 to-violet-500/5',
  pro:      'from-amber-500/20 to-amber-500/5',
};
const TIER_ACCENT: Record<string, string> = {
  free:     '#64748B',
  standard: '#45D8D4',
  premium:  '#9B6FE8',
  pro:      '#F59E0B',
};

// ─── Sub-components ─────────────────────────────────────────────────────────
function VideoMinuteBadge({ minutes }: { minutes: number | 'unlimited' }) {
  if (minutes === 'unlimited') return <span className="text-xs text-emerald-400 font-semibold">∞ video</span>;
  if (minutes === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400">
      <Video size={10} className="flex-shrink-0" />
      {minutes} min / month
    </span>
  );
}

function PlanCard({ plan, annual }: { plan: (typeof MOCK_PLANS)[0]; annual: boolean }) {
  const Icon   = TIER_ICON[plan.tier] ?? Star;
  const accent = TIER_ACCENT[plan.tier] ?? '#9B6FE8';
  const grad   = TIER_GRAD[plan.tier] ?? '';
  const price  = annual ? plan.priceAnnual / 12 : plan.priceMonthly;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative flex flex-col rounded-2xl border overflow-hidden h-full
        ${plan.isPopular
          ? 'border-violet-500/60 shadow-[0_0_32px_-6px_rgba(155,111,232,0.4)]'
          : 'border-border'}`}
      style={{ background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)' }}
    >
      {/* Top gradient splash */}
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${grad} pointer-events-none`} />

      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="text-[10px] font-bold text-white bg-violet-600 px-3 py-1 rounded-bl-xl tracking-wide uppercase">
            Most Popular
          </div>
        </div>
      )}

      <div className="relative flex flex-col flex-1 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="p-2.5 rounded-xl flex-shrink-0"
            style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
          >
            <Icon size={16} style={{ color: accent }} />
          </div>
          <div>
            <h3 className="font-bold text-text text-sm">{plan.name}</h3>
            <VideoMinuteBadge minutes={plan.videoMinutes} />
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-end gap-1.5">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${plan.id}-${annual}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="text-3xl font-black text-text leading-none"
              >
                {price === 0 ? 'Free' : `€${price.toFixed(2)}`}
              </motion.span>
            </AnimatePresence>
            {price > 0 && <span className="text-muted text-xs mb-0.5">/mo</span>}
          </div>
          {annual && plan.priceAnnual > 0 && (
            <p className="text-xs text-muted mt-1">Billed as €{plan.priceAnnual} / year</p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-text/75">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.isPopular ? 'primary' : 'secondary'}
          fullWidth
          className={plan.isPopular ? 'shadow-brand' : ''}
          aria-label={`Get started with the ${plan.name} plan`}
        >
          {price === 0 ? 'Get Started Free' : `Get ${plan.name}`}
          <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function CreditPackCard({ pack }: { pack: (typeof MOCK_VIDEO_CREDIT_PACKS)[0] }) {
  const pricePerMin = (pack.price / pack.minutes).toFixed(2);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col rounded-2xl border overflow-hidden p-5 gap-4 group transition-all duration-200"
      style={{
        background: `linear-gradient(140deg, color-mix(in srgb, ${pack.color} 12%, var(--surface)) 0%, var(--bg) 100%)`,
        borderColor: `${pack.color}40`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-black tracking-tighter" style={{ color: pack.color }}>
          {pack.label}
        </span>
        <Film size={16} style={{ color: pack.color, opacity: 0.7 }} />
      </div>

      <div>
        <p className="text-3xl font-black text-text leading-none">
          {pack.minutes} <span className="text-lg font-semibold text-muted">min</span>
        </p>
        <p className="text-xs text-muted mt-1">€{pricePerMin}/min video</p>
      </div>

      <div className="mt-auto">
        <p className="text-xl font-bold text-text">€{pack.price.toFixed(2)}</p>
        <Button
          variant="secondary"
          fullWidth
          className="mt-3 text-sm"
          aria-label={`Buy the ${pack.label} pack — ${pack.minutes} video minutes`}
        >
          Buy this pack
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [tab, setTab]       = useState<Tab>('plans');
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Plans & Pricing"
        subtitle="Simple, transparent pricing. Upgrade or downgrade anytime."
        actions={
          tab === 'plans' && (
            <div className="flex items-center gap-2 text-sm">
              <span className={!annual ? 'text-text font-semibold' : 'text-muted'}>Monthly</span>
              <button
                role="switch"
                id="annual-toggle"
                aria-checked={annual}
                onClick={() => setAnnual(a => !a)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${annual ? 'bg-brand' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${annual ? 'translate-x-5' : ''}`} />
              </button>
              <span className={annual ? 'text-text font-semibold' : 'text-muted'}>
                Annual <Badge size="sm" variant="success" className="ml-1">Save 20%</Badge>
              </span>
            </div>
          )
        }
      />

      {/* ── Segment tabs ── */}
      <div className="flex gap-2 mb-8 p-1 rounded-2xl bg-surface border border-border w-fit mx-auto">
        {TABS.map(t => {
          const Icon   = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              id={`pricing-tab-${t.id}`}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${active ? 'text-text' : 'text-muted hover:text-text/70'}`}
              aria-selected={active}
            >
              {active && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-xl bg-panel border border-border"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={14} className="relative z-10 flex-shrink-0" />
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Plans tab ── */}
        {tab === 'plans' && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_PLANS.map(plan => (
                <PlanCard key={plan.id} plan={plan} annual={annual} />
              ))}
            </div>
            <p className="text-center text-xs text-muted mt-8">
              All plans include end-to-end encryption and GDPR/CCPA compliance. Cancel anytime.
            </p>
          </motion.div>
        )}

        {/* ── Video Credits tab ── */}
        {tab === 'packs' && (
          <motion.div
            key="packs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-6 p-4 rounded-2xl border border-border bg-surface flex gap-3 items-start max-w-2xl mx-auto">
              <Video size={18} className="text-violet flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-text">On-demand video credits</p>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Need more video minutes? Top up anytime. Credits stack on top of your monthly
                  quota and never expire.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOCK_VIDEO_CREDIT_PACKS.map(pack => (
                <CreditPackCard key={pack.id} pack={pack} />
              ))}
            </div>

            <p className="text-center text-xs text-muted mt-8">
              Average cost: ~$0.20/min video (HeyGen). Your credits accumulate and never expire.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
