'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_HR_SETTINGS } from '@/lib/mock-data';
import type { HRSettings } from '@/types';

export default function HRSettingsPage() {
  const [settings, setSettings] = useState<HRSettings>(MOCK_HR_SETTINGS);
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  function toggle(key: keyof HRSettings) {
    setSettings(s => ({ ...s, [key]: !s[key as keyof typeof s] }));
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="HR Settings" subtitle="Configure privacy thresholds and notifications" />

      <div className="space-y-5">
        <Card>
          <h3 className="font-semibold text-text mb-4">Privacy Threshold</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text font-medium">k-Anonymity Threshold</p>
                <p className="text-xs text-muted mt-0.5">Minimum participants before data is shown</p>
              </div>
              <span className="text-2xl font-bold text-brand">{settings.kAnonymityThreshold}</span>
            </div>
            <input
              type="range" min={3} max={20} value={settings.kAnonymityThreshold}
              onChange={e => setSettings(s => ({ ...s, kAnonymityThreshold: +e.target.value }))}
              className="w-full accent-violet"
            />
            <div className="flex justify-between text-xs text-muted"><span>Min: 3</span><span>Max: 20</span></div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-text mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { key: 'weeklyReportEnabled', label: 'Weekly Well-being Report', desc: 'Receive a summary email every Monday' },
              { key: 'alertsEnabled',       label: 'Real-time Alerts',         desc: 'Get notified when critical thresholds are crossed' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-text font-medium">{label}</p>
                  <p className="text-xs text-muted mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => toggle(key as keyof HRSettings)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${(settings as any)[key] ? 'bg-brand' : 'bg-border'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${(settings as any)[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-text mb-4">Notification Email</h3>
          <Input
            label="Send reports to"
            type="email"
            value={settings.notificationEmail}
            onChange={e => setSettings(s => ({ ...s, notificationEmail: e.target.value }))}
          />
        </Card>

        <Button fullWidth onClick={save}>
          {saved ? '✓ Saved!' : 'Save settings'}
        </Button>
      </div>
    </div>
  );
}
