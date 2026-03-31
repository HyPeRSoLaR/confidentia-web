'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_PLANS } from '@/lib/mock-data';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Plans" subtitle="Choose the support level that fits your journey" />

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className={`text-sm font-medium ${!annual ? 'text-text' : 'text-muted'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(a => !a)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${annual ? 'bg-brand' : 'bg-border'}`}
        >
          <motion.span
            animate={{ x: annual ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full"
          />
        </button>
        <span className={`text-sm font-medium ${annual ? 'text-text' : 'text-muted'}`}>
          Annual <Badge variant="success" size="sm">Save ~20%</Badge>
        </span>
      </div>

      {/* Plan cards */}
      <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MOCK_PLANS.map(plan => (
          <StaggerItem key={plan.id}>
            <div className={`relative h-full flex flex-col glass p-6 rounded-2xl transition-all duration-300 ${
              plan.isPopular ? 'border-violet/50 shadow-brand' : 'hover:border-violet/30'
            }`}>
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap size={10} fill="white" /> Most popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-text text-lg">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-bold text-brand">
                    ${annual ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly}
                  </span>
                  {plan.priceMonthly > 0 && <span className="text-muted text-sm mb-1">/mo</span>}
                </div>
                {annual && plan.priceAnnual > 0 && (
                  <p className="text-xs text-muted mt-1">${plan.priceAnnual}/year billed annually</p>
                )}
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted">
                    <Check size={14} className="text-cyan mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.isPopular ? 'primary' : 'secondary'} fullWidth>
                {plan.priceMonthly === 0 ? 'Get started free' : 'Start ' + plan.name}
              </Button>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
