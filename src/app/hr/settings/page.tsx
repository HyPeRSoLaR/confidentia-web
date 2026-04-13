'use client';
import { useState } from 'react';
import { Save, CheckCircle, Bell, Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_HR_SETTINGS } from '@/lib/mock-data';

export default function HRSettingsPage() {
  const [settings,  setSettings]  = useState({ ...MOCK_HR_SETTINGS });
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);

  function toggle(key: 'weeklyReportEnabled' | 'alertsEnabled') {
    setSettings(s => ({ ...s, [key]: !s[key] }));
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
        {/* Notifications */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Bell size={14} className="text-violet" /> Préférences de notification
            </h3>

            {[
              {
                key: 'weeklyReportEnabled' as const,
                label: 'Rapport hebdomadaire',
                desc: 'Recevez un résumé hebdomadaire des tendances de bien-être anonymisées chaque lundi',
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

        {/* Notification email */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-3 flex items-center gap-2">
              <Mail size={14} className="text-cyan" /> E-mail de notification
            </h3>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={e => setSettings(s => ({ ...s, notificationEmail: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              aria-label="Adresse e-mail de notification"
              placeholder="rh@votreentreprise.com"
            />
            <p className="text-[10px] text-muted mt-2">Les rapports et alertes sont envoyés exclusivement à cette adresse — jamais aux employés individuels.</p>
          </Card>
        </StaggerItem>

        {/* k-anonymity threshold */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-sm text-text mb-1">Seuil de confidentialité (k-Anonymat)</h3>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              Les statistiques agrégées ne sont affichées que lorsqu'au moins <strong>{settings.kAnonymityThreshold}</strong> employés ont contribué. Cela empêche de rétro-ingénierer les réponses individuelles.
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
            {saved ? <><CheckCircle size={14} />Enregistré !</> : <><Save size={14} />Enregistrer</>}
          </Button>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
