'use client';
import { useState } from 'react';
import { Save, CheckCircle, Star, Globe, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_THERAPIST_PROFILE } from '@/lib/mock-data';

export default function TherapistProfilePage() {
  const [profile, setProfile] = useState({ ...MOCK_THERAPIST_PROFILE });
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="My Profile" subtitle="Visible to clients browsing the therapist marketplace" />

      <StaggerList className="space-y-5">
        {/* Avatar + stats */}
        <StaggerItem>
          <Card>
            <div className="flex items-center gap-4 mb-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center text-white text-2xl font-bold">{profile.name.charAt(0)}</div>
              )}
              <div>
                <h3 className="font-semibold text-text">{profile.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= Math.round(profile.rating) ? 'text-amber-400 fill-amber-400' : 'text-border'} />)}
                  <span className="text-xs text-muted ml-1">{profile.rating} · {profile.sessionCount} sessions</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {profile.languages.map(l => (
                    <span key={l} className="flex items-center gap-1 text-[10px] text-muted border border-border rounded-md px-1.5 py-0.5">
                      <Globe size={9}/>{l}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-[10px] text-muted border border-border rounded-md px-1.5 py-0.5">
                    <Clock size={9}/>50 min · ${profile.ratePerSession}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </StaggerItem>

        {/* Bio */}
        <StaggerItem>
          <Card>
            <label className="text-xs font-medium text-text mb-2 block">Professional Bio</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50 resize-none"
              aria-label="Professional bio"
            />
          </Card>
        </StaggerItem>

        {/* Specialties */}
        <StaggerItem>
          <Card>
            <label className="text-xs font-medium text-text mb-2 block">Specialties</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {profile.specialties.map(s => (
                <Badge key={s} size="sm" className="cursor-pointer hover:opacity-80">{s}</Badge>
              ))}
            </div>
            <p className="text-[10px] text-muted">Specialty editing via the full profile edit flow (coming soon)</p>
          </Card>
        </StaggerItem>

        {/* Rate */}
        <StaggerItem>
          <Card>
            <label className="text-xs font-medium text-text mb-2 block">Session Rate (per 50 min)</label>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">$</span>
              <input
                type="number" min={0}
                value={profile.ratePerSession}
                onChange={e => setProfile(p => ({ ...p, ratePerSession: Number(e.target.value) }))}
                className="flex-1 bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-brand/50"
                aria-label="Session rate in USD"
              />
            </div>
            <p className="text-[10px] text-muted mt-1.5">Platform fee: 20%. Your net: ${Math.round(profile.ratePerSession * 0.8)}/session</p>
          </Card>
        </StaggerItem>

        {/* Save */}
        <StaggerItem>
          <Button onClick={handleSave} loading={saving} fullWidth className="shadow-brand">
            {saved ? <><CheckCircle size={14}/>Saved!</> : <><Save size={14}/>Save Profile</>}
          </Button>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
