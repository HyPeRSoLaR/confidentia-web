'use client';
import { motion } from 'framer-motion';
import {
  Check, Building2, Users, Briefcase, Crown, Star, Zap, ChevronRight, Video,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  MOCK_B2B_PLATFORM_PLANS,
  MOCK_B2B_EMPLOYEE_PLANS,
  MOCK_VIDEO_CREDIT_PACKS,
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
            Recommandé
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
          <span className="text-muted text-xs ml-1">/mois</span>
          <p className="text-xs text-muted mt-0.5">
            €{(plan.priceAnnual / 12).toFixed(0)}/mois facturé annuellement
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
          aria-label={`Nous contacter pour le forfait ${plan.name}`}
        >
          Contacter les ventes
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
          ⭐ Meilleur rapport
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
          aria-label={`Choisir le forfait employé ${plan.name}`}
        >
          Choisir {plan.name}
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
        title="Tarifs B2B"
        subtitle="Des forfaits flexibles pour votre organisation. Toutes les fonctionnalités sont incluses à tous les plans — seul le nombre d’employés éligibles change."
      />

      {/* ── Offre 3 mois ── */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-400/8 border border-emerald-400/30">
        <div className="w-10 h-10 rounded-xl bg-emerald-400/15 flex items-center justify-center flex-shrink-0 text-xl">🎁</div>
        <div>
          <p className="text-sm font-bold text-emerald-400">3 premiers mois offerts</p>
          <p className="text-xs text-muted mt-0.5">Plus 1 mois de frais de dossier offert. Engagement sans surprise — résiliable à tout moment.</p>
        </div>
      </div>

      {/* ── HR Platform ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Plateforme RH (SaaS)</h2>
          <Badge size="sm" variant="default" className="ml-1">Facturé par organisation</Badge>
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
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Accès Dirigeant</h2>
          <Badge size="sm" variant="default" className="ml-1">Par siège</Badge>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
          <div>
            <p className="font-bold text-text">Licence Dirigeant</p>
            <p className="text-xs text-muted mt-1 max-w-sm">
              Tableau de bord avancé, analytiques détaillées &amp; reporting — pour chaque membre de la direction.
            </p>
          </div>
          <div className="flex items-end gap-1 flex-shrink-0">
            <span className="text-3xl font-black text-text">€29</span>
            <span className="text-xs text-muted mb-1">/utilisateur/mois</span>
          </div>
          <Button variant="secondary" aria-label="Nous contacter pour l'accès Dirigeant">
            Contacter les ventes
          </Button>
        </div>
      </section>

      {/* ── Employee Seats ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Users size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Forfaits Employés</h2>
          <Badge size="sm" variant="default" className="ml-1">Par siège</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_B2B_EMPLOYEE_PLANS.map(plan => (
            <EmployeeCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* ── Video Credit Packs ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Video size={16} className="text-muted" />
          <h2 className="text-sm font-semibold text-text uppercase tracking-widest">Packs Minutes Vidéo</h2>
          <Badge size="sm" variant="default" className="ml-1">Recharges à la demande</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_VIDEO_CREDIT_PACKS.map(pack => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border p-5 text-center hover:border-brand/30 hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: 'linear-gradient(160deg, var(--surface) 0%, var(--bg) 100%)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow"
                style={{ background: pack.color }}
              >
                {pack.label}
              </div>
              <div>
                <p className="text-2xl font-black text-text">€{pack.price}</p>
                <p className="text-xs text-muted mt-0.5">{pack.minutes} minutes vidéo</p>
              </div>
              <Button variant="secondary" fullWidth aria-label={`Acheter le pack vidéo ${pack.label}`}>
                Acheter
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-muted pb-6">
        Coût B2B moyen réel : 2–4€ / employé / mois. Tous les forfaits incluent la conformité RGPD,
        le k-anonymat &amp; le SSO. Remises sur volume disponibles — contactez notre équipe commerciale.
      </p>
    </div>
  );
}
