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
      <PageHeader title="HR Settings" subtitle="Configure organisation-wide well-being monitoring" />

      <StaggerList className="space-y-5">
        {/* Notifications */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Bell size={14} className="text-violet" /> Notification Preferences
            </h3>

            {[
              { key: 'weeklyReportEnabled' as const, label: 'Weekly Summary Report', desc: 'Receive a weekly digest of anonymized org well-being trends every Monday' },
              { key: 'alertsEnabled' as const,        label: 'Critical Alerts',        desc: 'Get notified immediately when anomalies exceed configurable thresholds' },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={settings[item.key]}
                  aria-label={`Toggle ${item.label}`}
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
              <Mail size={14} className="text-cyan" /> Notification Email
            </h3>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={e => setSettings(s => ({ ...s, notificationEmail: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50 transition-all"
              aria-label="Notification email address"
              placeholder="hr@yourcompany.com"
            />
            <p className="text-[10px] text-muted mt-2">Reports and alerts are sent exclusively to this address — never to individual employees.</p>
          </Card>
        </StaggerItem>

        {/* k-anonymity threshold */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-sm text-text mb-1">Privacy Threshold (k-Anonymity)</h3>
            <p className="text-xs text-muted mb-3 leading-relaxed">
              Aggregated statistics are only shown when at least <strong>{settings.kAnonymityThreshold}</strong> employees contributed. This prevents reverse-engineering individual responses.
            </p>
            <input
              type="range" min={3} max={20} step={1}
              value={settings.kAnonymityThreshold}
              onChange={e => setSettings(s => ({ ...s, kAnonymityThreshold: Number(e.target.value) }))}
              aria-label="k-anonymity threshold"
              className="w-full accent-violet"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>3 (minimum)</span>
              <span className="font-semibold text-violet">{settings.kAnonymityThreshold} respondents</span>
              <span>20</span>
            </div>
          </Card>
        </StaggerItem>

        {/* Save */}
        <StaggerItem>
          <Button onClick={handleSave} loading={saving} fullWidth className="shadow-brand">
            {saved ? <><CheckCircle size={14} />Saved!</> : <><Save size={14} />Save Settings</>}
          </Button>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
