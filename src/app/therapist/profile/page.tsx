'use client';
import { useState } from 'react';
import { Star, Camera, Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { MOCK_THERAPIST_PROFILE } from '@/lib/mock-data';

export default function TherapistProfilePage() {
  const [profile, setProfile] = useState(MOCK_THERAPIST_PROFILE);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [saved, setSaved] = useState(false);

  function addSpecialty() {
    if (newSpecialty.trim() && !profile.specialties.includes(newSpecialty.trim())) {
      setProfile(p => ({ ...p, specialties: [...p.specialties, newSpecialty.trim()] }));
      setNewSpecialty('');
    }
  }
  function removeSpecialty(s: string) {
    setProfile(p => ({ ...p, specialties: p.specialties.filter(x => x !== s) }));
  }
  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="My Profile" subtitle="How clients see you on Confidentia" />

      <div className="space-y-5">
        {/* Avatar */}
        <Card className="flex items-center gap-5">
          <div className="relative">
            <Avatar name={profile.userId} size="xl" online />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand rounded-full flex items-center justify-center shadow-brand">
              <Camera size={12} className="text-white" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-text">{profile.rating}/5</span>
              <span className="text-xs text-muted">({profile.sessionCount} sessions)</span>
            </div>
            <p className="text-xs text-muted mt-1">Licensed therapist · Confidentia verified</p>
          </div>
        </Card>

        {/* Bio */}
        <Card>
          <Textarea
            label="Bio"
            rows={4}
            value={profile.bio}
            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
          />
        </Card>

        {/* Specialties */}
        <Card>
          <h3 className="font-semibold text-text mb-3">Specialties</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.specialties.map(s => (
              <span key={s} className="flex items-center gap-1 bg-violet/10 text-violet rounded-full px-2.5 py-1 text-xs">
                {s}<button onClick={() => removeSpecialty(s)}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Add specialty…" value={newSpecialty} onChange={e => setNewSpecialty(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSpecialty()} />
            <Button variant="secondary" size="sm" onClick={addSpecialty}><Plus size={14} /></Button>
          </div>
        </Card>

        {/* Rate */}
        <Card>
          <h3 className="font-semibold text-text mb-3">Session Rate</h3>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">$</span>
            <input
              type="number"
              value={profile.ratePerSession}
              onChange={e => setProfile(p => ({ ...p, ratePerSession: +e.target.value }))}
              className="w-24 bg-surface border border-border rounded-xl px-3 py-2 text-text text-sm focus:outline-none focus:border-violet"
            />
            <span className="text-muted text-sm">per 50-min session</span>
          </div>
          <p className="text-xs text-muted mt-2">Platform takes 20% · You receive ${Math.round(profile.ratePerSession * 0.8)}/session</p>
        </Card>

        <Button fullWidth onClick={save}>{saved ? '✓ Saved!' : 'Save profile'}</Button>
      </div>
    </div>
  );
}
