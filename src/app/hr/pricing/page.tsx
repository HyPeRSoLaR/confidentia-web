'use client';
import { motion } from 'framer-motion';
import {
  Check, Building2, Users, Briefcase, Crown, Star, Zap, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  MOCK_B2B_PLATFORM_PLANS,
  MOCK_B2B_EMPLOYEE_PLANS,
} from '@/lib/mock-data';

// ─── Helpers ────────────────────────────────────────────────────────────────
const TIER_ICON: Record<string, typeof Zap> = { standard: Zap, premium: Star, pro: Crown };
const TIER_ACCENT: Record<string, string>   = { standard: '#45D8D4', premium: '#9B6FE8', pro: '#F59E0B' };

function PlatformCard({ plan }: { plan: (typeof MOCK_B2B_PLATFORM_PLANS)[0] }) {
  const Icon   = TIER_ICON[plan.tier] ?? Star;
  const accent = TIER_ACCENT[plan.tier] ?? '#9B6FE8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col rounded-2xl border overflow-hidden h-full
        ${plan.isPopular
          ? 'border-violet-500/60 shadow-[0_0_28px_-6px_rgba(155,111,232,0.35)]'
          : 'border-border'}`}
      style={{ background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)' }}
    >
      {plan.isPopular && (
        <div className="absolute top-0 right-0">
          <div className="text-[10px] font-bold text-white bg-violet-600 px-3 py-1 rounded-bl-xl tracking-wide uppercase">
            Recommended
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl" style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
          <h4 className="font-bold text-text text-sm">{plan.name}</h4>
        </div>
        {plan.employeeRange && (
          <p className="text-xs text-muted mb-4 ml-0.5">{plan.employeeRange}</p>
        )}

        {/* Price */}
        <div className="mb-5">
          <span className="text-3xl font-black text-text">€{plan.priceMonthly}</span>
          <span className="text-muted text-xs ml-1">/month</span>
          <p className="text-xs text-muted mt-0.5">
            €{(plan.priceAnnual / 12).toFixed(0)}/mo billed annually
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-text/75">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.isPopular ? 'primary' : 'secondary'}
          fullWidth
          aria-label={`Contact us for the ${plan.name} plan`}
        >
          Contact Sales
          <ChevronRight size={14} className="ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function EmployeeCard({ plan }: { plan: (typeof MOCK_B2B_EMPLOYEE_PLANS)[0] }) {
  const Icon   = TIER_ICON[plan.tier] ?? Star;
  const accent = TIER_ACCENT[plan.tier] ?? '#9B6FE8';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex flex-col rounded-2xl border overflow-hidden h-full
        ${plan.isPopular
          ? 'border-violet-500/60 shadow-[0_0_28px_-6px_rgba(155,111,232,0.3)]'
          : 'border-border'}`}
      style={{ background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)' }}
    >
      {plan.isPopular && (
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-violet-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
          ⭐ Best value
        </span>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl" style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
            <Icon size={14} style={{ color: accent }} />
          </div>
          <h5 className="font-bold text-text text-sm">{plan.name}</h5>
        </div>

        <div className="mb-2">
          <span className="text-2xl font-black text-text">€{plan.priceMonthly}</span>
          <span className="text-muted text-xs ml-1">{plan.perUnit}</span>
        </div>

        <ul className="space-y-2 mt-3 mb-5 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
              <span className="text-text/75">{f}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={plan.isPopular ? 'primary' : 'secondary'}
          fullWidth
          className={plan.isPopular ? 'shadow-brand' : ''}
          aria-label={`Select the ${plan.name} employee plan`}
        >
          Select {plan.name}
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HRPricingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <PageHeader
        title="B2B Pricing"
        subtitle="Flexible plans for your organisation — platform access and per-seat employee licences."
      />

      {/* ── HR Platform ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">HR Platform (SaaS)</h2>
          <Badge size="sm" variant="default" className="ml-1">Billed per organisation</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_B2B_PLATFORM_PLANS.map(plan => (
            <PlatformCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* ── Executive Access ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Briefcase size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Executive Access</h2>
          <Badge size="sm" variant="default" className="ml-1">Per seat</Badge>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div>
            <p className="font-bold text-text">Executive Licence</p>
            <p className="text-xs text-muted mt-1 max-w-sm">
              Advanced dashboard, detailed analytics &amp; reporting — for each member of management.
            </p>
          </div>
          <div className="flex items-end gap-1 flex-shrink-0">
            <span className="text-3xl font-black text-text">€29</span>
            <span className="text-xs text-muted mb-1">/user/month</span>
          </div>
          <Button variant="secondary" aria-label="Contact us for Executive Access">
            Contact Sales
          </Button>
        </div>
      </section>

      {/* ── Employee Seats ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Users size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Employee Plans</h2>
          <Badge size="sm" variant="default" className="ml-1">Per seat</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_B2B_EMPLOYEE_PLANS.map(plan => (
            <EmployeeCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted pb-6">
        Average real B2B cost: €2–4 / employee / month. All plans include GDPR compliance,
        k-anonymity &amp; SSO. Volume discounts available — contact sales.
      </p>
    </div>
  );
}
