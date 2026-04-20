'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Star, Shield, Building2, Edit, X, Save, PlusCircle, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_PLANS, MOCK_COMPANIES } from '@/lib/mock-data';
import type { Plan } from '@/types';

const TIER_ICON = { free: Shield, pro: Zap, premium: Star, enterprise: Building2 } as const;
const TIER_COLOR = { free: 'text-muted', pro: 'text-violet', premium: 'text-amber-400', enterprise: 'text-cyan' } as const;

export default function AdminPlansPage() {
  const [editing,       setEditing]       = useState<Plan | null>(null);
  const [plans,         setPlans]         = useState<Plan[]>(MOCK_PLANS);
  const [saving,        setSaving]        = useState(false);
  const [addingCredits, setAddingCredits] = useState(false);
  const [creditForm,    setCreditForm]    = useState({ companyId: MOCK_COMPANIES[0].id, minutes: 60, reason: '' });
  const [creditSaved,   setCreditSaved]   = useState(false);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setPlans(ps => ps.map(p => p.id === editing.id ? editing : p));
    setSaving(false);
    setEditing(null);
  }

  async function handleAddCredits() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setCreditSaved(true);
    setTimeout(() => { setCreditSaved(false); setAddingCredits(false); }, 1800);
  }

  // MRR calc
  const mrr = plans.reduce((acc, plan) => {
    const companiesOnPlan = MOCK_COMPANIES.filter(c => c.planId === plan.id);
    return acc + companiesOnPlan.reduce((s, c) => s + c.activeEmployees * plan.priceMonthly, 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Plan Management"
        subtitle="Pricing is config-driven — changes apply immediately to new signups"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success">MRR ${mrr.toLocaleString()}</Badge>
            <button
              onClick={() => setAddingCredits(true)}
              id="btn-add-credits"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet/10 border border-violet/30 text-violet text-xs font-semibold hover:bg-violet/20 transition-colors"
            >
              <PlusCircle size={13} /> Ajouter des crédits
            </button>
          </div>
        }
      />

      {/* Org plan overview */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Companies by Plan</h3>
        <div className="space-y-2">
          {MOCK_COMPANIES.map(company => {
            const plan = plans.find(p => p.id === company.planId);
            return (
              <div key={company.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl text-sm">
                <div className="w-8 h-8 bg-brand/20 rounded-lg flex items-center justify-center"><Building2 size={13} className="text-brand" /></div>
                <span className="font-medium text-text flex-1">{company.name}</span>
                <span className="text-xs text-muted">{company.activeEmployees} seats</span>
                <Badge size="sm" variant={company.status === 'active' ? 'success' : company.status === 'trial' ? 'warning' : 'danger'}>{company.status}</Badge>
                <Badge size="sm">{plan?.name ?? 'Unknown'}</Badge>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plan cards */}
      <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Plan Configuration</h3>
      <StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map(plan => {
          const Icon  = TIER_ICON[plan.tier as keyof typeof TIER_ICON] ?? Shield;
          const color = TIER_COLOR[plan.tier as keyof typeof TIER_COLOR] ?? 'text-muted';
          return (
            <StaggerItem key={plan.id}>
              <Card className={plan.isPopular ? 'ring-2 ring-violet' : ''}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={color} />
                    <h3 className="font-bold text-text text-sm">{plan.name}</h3>
                    {plan.isPopular && <Badge variant="brand" size="sm">Popular</Badge>}
                  </div>
                  <button onClick={() => setEditing({ ...plan })} aria-label={`Edit ${plan.name} plan`} className="p-1.5 rounded-lg hover:bg-surface border border-border text-muted hover:text-text transition-colors">
                    <Edit size={12} />
                  </button>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-text">${plan.priceMonthly}<span className="text-xs font-normal text-muted">/mo</span></p>
                  <p className="text-[10px] text-muted">${plan.priceAnnual}/mo billed annually</p>
                </div>
                <ul className="space-y-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-muted">
                      <Check size={10} className="text-brand flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit ${editing?.name ?? ''} Plan`} size="sm">
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Monthly Price ($)',       key: 'priceMonthly' as const },
                { label: 'Annual Price ($/mo)',     key: 'priceAnnual' as const },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs text-muted mb-1 block">{field.label}</label>
                  <input
                    type="number" min={0}
                    value={editing[field.key]}
                    onChange={e => setEditing(ed => ed ? { ...ed, [field.key]: Number(e.target.value) } : null)}
                    className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50"
                    aria-label={field.label}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-muted mb-1 block">Features (one per line)</label>
              <textarea
                rows={5}
                value={editing.features.join('\n')}
                onChange={e => setEditing(ed => ed ? { ...ed, features: e.target.value.split('\n').filter(Boolean) } : null)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50 resize-none font-mono"
                aria-label="Plan features"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(null)} className="px-4" aria-label="Cancel edit">
                <X size={13}/> Cancel
              </Button>
              <Button onClick={handleSave} loading={saving} fullWidth className="shadow-brand">
                <Save size={13}/> Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Add Credits Modal ── */}
      <Modal open={addingCredits} onClose={() => setAddingCredits(false)} title="Ajouter des crédits vidéo" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-violet/5 border border-violet/20">
            <CreditCard size={16} className="text-violet flex-shrink-0" />
            <p className="text-xs text-muted">Ajoutez des minutes vidéo directement sur le compte d&apos;une organisation.</p>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Organisation</label>
            <select
              value={creditForm.companyId}
              onChange={e => setCreditForm(f => ({ ...f, companyId: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50"
              aria-label="Organisation"
            >
              {MOCK_COMPANIES.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.activeEmployees} sièges</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Minutes vidéo à ajouter</label>
            <input
              type="number" min={1} max={10000} step={10}
              value={creditForm.minutes}
              onChange={e => setCreditForm(f => ({ ...f, minutes: Number(e.target.value) }))}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50"
              aria-label="Minutes à ajouter"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Raison (optionnel)</label>
            <input
              type="text"
              value={creditForm.reason}
              onChange={e => setCreditForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Ex: Geste commercial, compensation, promotion..."
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50"
              aria-label="Raison de l'ajout"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAddingCredits(false)} className="px-4" aria-label="Annuler">
              <X size={13} /> Annuler
            </Button>
            <Button onClick={handleAddCredits} loading={saving} fullWidth className="shadow-brand">
              {creditSaved ? <><Check size={13} /> Crédits ajoutés !</> : <><PlusCircle size={13} /> Ajouter {creditForm.minutes} min</>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
