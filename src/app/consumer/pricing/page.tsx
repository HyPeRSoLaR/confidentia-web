'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_PLANS } from '@/lib/mock-data';

const TIER_ICON = { free: Shield, pro: Zap, premium: Star, enterprise: Star } as const;
const TIER_COLOR = { free: 'text-muted', pro: 'text-violet', premium: 'text-amber-400', enterprise: 'text-cyan' } as const;
const TIER_RING  = { free: '', pro: 'ring-2 ring-violet shadow-brand', premium: 'ring-2 ring-amber-400', enterprise: '' } as const;

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Plans &amp; Pricing"
        subtitle="Simple, transparent pricing. Upgrade or downgrade anytime."
        actions={
          <div className="flex items-center gap-2 text-sm">
            <span className={!annual ? 'text-text font-semibold' : 'text-muted'}>Monthly</span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual(a => !a)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${annual ? 'bg-brand' : 'bg-border'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${annual ? 'translate-x-5' : ''}`} />
            </button>
            <span className={annual ? 'text-text font-semibold' : 'text-muted'}>
              Annual <Badge size="sm" variant="success" className="ml-1">Save ~20%</Badge>
            </span>
          </div>
        }
      />

      <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_PLANS.map(plan => {
          const Icon = TIER_ICON[plan.tier as keyof typeof TIER_ICON] ?? Star;
          const color = TIER_COLOR[plan.tier as keyof typeof TIER_COLOR] ?? 'text-muted';
          const ring  = TIER_RING[plan.tier as keyof typeof TIER_RING] ?? '';
          const price = annual ? plan.priceAnnual : plan.priceMonthly;

          return (
            <StaggerItem key={plan.id}>
              <Card className={`flex flex-col h-full relative ${ring}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="brand" size="sm" className="shadow-brand">Most Popular</Badge>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-surface border border-border rounded-xl">
                    <Icon size={16} className={color} />
                  </div>
                  <h3 className="font-bold text-text">{plan.name}</h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <motion.span
                      key={`${plan.id}-${annual}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-text"
                    >
                      {price === 0 ? 'Free' : `$${price}`}
                    </motion.span>
                    {price > 0 && (
                      <span className="text-muted text-sm mb-1.5">
                        /mo{annual && ' billed annually'}
                      </span>
                    )}
                  </div>
                  {plan.maxUsers && plan.maxUsers > 1 && (
                    <p className="text-xs text-muted mt-1">Up to {plan.maxUsers} users</p>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check size={13} className="text-brand mt-0.5 flex-shrink-0" />
                      <span className="text-text/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.isPopular ? 'primary' : 'secondary'}
                  fullWidth
                  className={plan.isPopular ? 'shadow-brand' : ''}
                  aria-label={`Get started with the ${plan.name} plan`}
                >
                  {price === 0 ? 'Get Started Free' : `Start ${plan.name}`}
                </Button>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      <p className="text-center text-xs text-muted mt-8">
        All plans include end-to-end encryption and GDPR/CCPA compliance. Cancel anytime.
      </p>
    </div>
  );
}
