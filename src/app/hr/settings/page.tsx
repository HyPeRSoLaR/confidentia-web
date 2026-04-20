'use client';
import { useState } from 'react';
import { Save, CheckCircle, Bell, Mail, Plus, X, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_HR_SETTINGS } from '@/lib/mock-data';

type ReportFrequency = 'daily' | 'weekly' | 'monthly';

const FREQUENCY_OPTIONS: { value: ReportFrequency; label: string; desc: string }[] = [
  { value: 'daily',   label: 'Quotidien',  desc: 'Un rapport chaque matin' },
  { value: 'weekly',  label: 'Hebdomadaire', desc: 'Récapitulatif chaque lundi' },
  { value: 'monthly', label: 'Mensuel',    desc: 'Bilan en début de mois' },
];

export default function HRSettingsPage() {
  const [settings,  setSettings]  = useState({
    ...MOCK_HR_SETTINGS,
    notificationEmails: MOCK_HR_SETTINGS.notificationEmails ?? [MOCK_HR_SETTINGS.notificationEmail],
    reportFrequency: (MOCK_HR_SETTINGS.reportFrequency ?? 'weekly') as ReportFrequency,
  });
  const [newEmail,  setNewEmail]  = useState('');
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  function toggle(key: 'weeklyReportEnabled' | 'alertsEnabled') {
    setSettings(s => ({ ...s, [key]: !s[key] }));
  }

  function addEmail() {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    if (settings.notificationEmails.includes(email)) return;
    setSettings(s => ({ ...s, notificationEmails: [...s.notificationEmails, email] }));
    setNewEmail('');
  }

  function removeEmail(email: string) {
    setSettings(s => ({ ...s, notificationEmails: s.notificationEmails.filter(e => e !== email) }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Paramètres RH" subtitle="Configurer la surveillance du bien-être à l'échelle de l'organisation" />

      <StaggerList className="space-y-5">
        {/* Notifications toggles */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Bell size={14} className="text-violet" /> Préférences de notification
            </h3>

            {[
              {
                key: 'weeklyReportEnabled' as const,
                label: 'Rapport activé',
                desc: 'Recevez un résumé des tendances de bien-être anonymisées selon la fréquence choisie',
              },
              {
                key: 'alertsEnabled' as const,
                label: 'Alertes critiques',
                desc: 'Soyez notifié immédiatement lorsque des anomalies dépassent les seuils configurés',
              },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={settings[item.key]}
                  aria-label={`Activer/désactiver ${item.label}`}
                  onClick={() => toggle(item.key)}
                  className={`relative w-10 h-5 flex-shrink-0 mt-0.5 rounded-full transition-colors ${settings[item.key] ? 'bg-brand' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[item.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </Card>
        </StaggerItem>

        {/* Report frequency */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Clock size={14} className="text-violet" /> Fréquence des rapports
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSettings(s => ({ ...s, reportFrequency: opt.value }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all duration-200 ${
                    settings.reportFrequency === opt.value
                      ? 'border-violet bg-violet/10 text-violet'
                      : 'border-border text-muted hover:border-violet/40 hover:text-text'
                  }`}
                >
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-[10px] leading-snug">{opt.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        </StaggerItem>

        {/* Multi-email notification */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-3 flex items-center gap-2">
              <Mail size={14} className="text-cyan" /> Adresses e-mail de notification
            </h3>

            {/* Existing emails */}
            <div className="space-y-2 mb-3">
              {settings.notificationEmails.map(email => (
                <div key={email} className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-bg border border-border">
                  <span className="text-sm text-text truncate">{email}</span>
                  <button
                    onClick={() => removeEmail(email)}
                    aria-label={`Supprimer ${email}`}
                    className="text-muted hover:text-red-400 transition-colors flex-shrink-0"
                    disabled={settings.notificationEmails.length <= 1}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new email */}
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEmail()}
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50 transition-all"
                aria-label="Nouvelle adresse e-mail"
                placeholder="nouveau@entreprise.com"
              />
              <button
                onClick={addEmail}
                aria-label="Ajouter l'adresse e-mail"
                className="px-3 py-2 rounded-xl bg-brand/10 border border-brand/30 text-brand hover:bg-brand/20 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Plus size={14} />
              </button>
            </div>
            <p className="text-[10px] text-muted mt-2">Les rapports et alertes sont envoyés à toutes ces adresses — jamais aux employés individuels.</p>
          </Card>
        </StaggerItem>

        {/* k-anonymity threshold */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-sm text-text mb-1">Seuil de confidentialité (k-Anonymat)</h3>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              Les statistiques agrégées ne sont affichées que lorsqu&apos;au moins <strong>{settings.kAnonymityThreshold}</strong> employés ont contribué. Cela empêche de rétro-ingénierer les réponses individuelles.
            </p>
            <input
              type="range" min={3} max={20} step={1}
              value={settings.kAnonymityThreshold}
              onChange={e => setSettings(s => ({ ...s, kAnonymityThreshold: Number(e.target.value) }))}
              aria-label="Seuil k-anonymat"
              className="w-full accent-violet"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>3 (minimum)</span>
              <span className="font-semibold text-violet">{settings.kAnonymityThreshold} répondants</span>
              <span>20</span>
            </div>
          </Card>
        </StaggerItem>

        {/* Save */}
        <StaggerItem>
          <Button onClick={handleSave} loading={saving} fullWidth className="shadow-brand">
            {saved ? <><CheckCircle size={14} />Enregistré !</> : <><Save size={14} />Enregistrer les paramètres</>}
          </Button>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
