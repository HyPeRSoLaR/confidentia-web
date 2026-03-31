'use client';
import { useState } from 'react';
import { Check, Zap, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_PLANS } from '@/lib/mock-data';
import type { Plan } from '@/types';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>(MOCK_PLANS);

  function deletePlan(id: string) { setPlans(p => p.filter(x => x.id !== id)); }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Plan Management"
        subtitle="Configure subscription tiers"
        actions={<Button size="sm">+ New plan</Button>}
      />

      <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map(plan => (
          <StaggerItem key={plan.id}>
            <Card className={`flex flex-col h-full ${plan.isPopular ? 'border-violet/40 shadow-brand' : ''}`}>
              {plan.isPopular && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Badge variant="brand" size="sm"><Zap size={9} className="fill-white text-white"/>Popular</Badge>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-text text-lg capitalize">{plan.name}</h3>
                <p className="text-2xl font-bold text-brand mt-1">
                  {plan.priceMonthly === 0 ? 'Free' : `$${plan.priceMonthly}/mo`}
                </p>
                {plan.priceAnnual > 0 && (
                  <p className="text-xs text-muted">${plan.priceAnnual}/yr billed annually</p>
                )}
              </div>
              <ul className="flex-1 space-y-2 mb-5">
                {plan.features.map(f => (
                  <li key={f} className="flex gap-2 text-xs text-muted items-start">
                    <Check size={12} className="text-cyan mt-0.5 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 pt-3 border-t border-border">
                <Button variant="secondary" size="sm" className="flex-1"><Pencil size={12}/> Edit</Button>
                <Button variant="danger" size="sm" onClick={() => deletePlan(plan.id)}><Trash2 size={12}/></Button>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
