'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Globe, Clock, ShieldCheck, Send, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_THERAPISTS } from '@/lib/mock-data';
import type { TherapistProfile } from '@/types';

const SPECIALTY_FILTERS = ['All', 'Anxiety', 'Workplace Stress', 'CBT', 'Grief', 'Mindfulness', 'Trauma'];
const LANGUAGE_FILTERS  = ['All', 'English', 'Mandarin', 'Spanish', 'Portuguese'];

export default function TherapistMarketplacePage() {
  const [search,    setSearch]    = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [language,  setLanguage]  = useState('All');
  const [selected,  setSelected]  = useState<TherapistProfile | null>(null);
  const [booked,    setBooked]    = useState<string[]>([]);
  const [booking,   setBooking]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_THERAPISTS.filter(t => {
      const matchSearch    = !search || t.name.toLowerCase().includes(q) || t.bio.toLowerCase().includes(q) || t.specialties.some(s => s.toLowerCase().includes(q));
      const matchSpecialty = specialty === 'All' || t.specialties.includes(specialty);
      const matchLanguage  = language === 'All'  || t.languages.includes(language);
      return matchSearch && matchSpecialty && matchLanguage;
    });
  }, [search, specialty, language]);

  async function handleBook() {
    if (!selected) return;
    setBooking(true);
    await new Promise(r => setTimeout(r, 1200));
    setBooked(b => [...b, selected.userId]);
    setBooking(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelected(null); }, 2200);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Find a Therapist"
        subtitle="Confidentia-verified professionals — all sessions stay on platform"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted bg-surface border border-border rounded-full px-3 py-1.5">
            <ShieldCheck size={12} className="text-cyan" /><span>Verified partners only</span>
          </div>
        }
      />

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <Input placeholder="Search by name, specialty, or keyword…" value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={14} />} />
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {SPECIALTY_FILTERS.map(s => (
              <button key={s} onClick={() => setSpecialty(s)} className={`px-3 py-1 rounded-full text-xs border transition-all ${specialty === s ? 'bg-violet text-white border-transparent shadow-brand' : 'border-border text-muted hover:border-violet/40 hover:text-text'}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {LANGUAGE_FILTERS.map(l => (
              <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded-full text-xs border transition-all ${language === l ? 'bg-cyan/20 text-cyan border-cyan/50' : 'border-border text-muted hover:border-cyan/40'}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No therapists match your filters.</p>
        </div>
      ) : (
        <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(therapist => {
            const isBooked = booked.includes(therapist.userId);
            return (
              <StaggerItem key={therapist.userId}>
                <Card hover className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-3">
                    {therapist.avatarUrl ? (
                      <img src={therapist.avatarUrl} alt={therapist.name} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {therapist.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="font-semibold text-text text-sm truncate">{therapist.name}</h3>
                        {therapist.isVerified && <ShieldCheck size={12} className="text-cyan flex-shrink-0" title="Verified Confidentia Partner" />}
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={10} className={star <= Math.round(therapist.rating) ? 'text-amber-400 fill-amber-400' : 'text-border'} />
                        ))}
                        <span className="text-[10px] text-muted ml-1">{therapist.rating} · {therapist.sessionCount} sessions</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {therapist.specialties.slice(0, 2).map(s => <Badge key={s} size="sm">{s}</Badge>)}
                        {therapist.specialties.length > 2 && <Badge size="sm">+{therapist.specialties.length - 2}</Badge>}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted line-clamp-2 mb-4 flex-1 leading-relaxed">{therapist.bio}</p>

                  <div className="flex items-center gap-3 text-xs text-muted mb-4">
                    <span className="flex items-center gap-1"><Globe size={10} />{therapist.languages.slice(0, 2).join(', ')}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />50 min</span>
                    <span className="font-semibold text-violet ml-auto text-sm">${therapist.ratePerSession}<span className="text-muted font-normal">/session</span></span>
                  </div>

                  <Button onClick={() => !isBooked && setSelected(therapist)} variant={isBooked ? 'secondary' : 'primary'} size="sm" fullWidth disabled={isBooked} aria-label={`Book a session with ${therapist.name}`}>
                    {isBooked ? <><CheckCircle size={13} />Session Requested</> : <><Send size={13} />Book Session</>}
                  </Button>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      )}

      {/* Booking modal */}
      <Modal open={!!selected && !success} onClose={() => setSelected(null)} title="Request a Session" size="sm">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border">
              {selected.avatarUrl && <img src={selected.avatarUrl} alt={selected.name} className="w-12 h-12 rounded-xl object-cover" />}
              <div>
                <p className="font-semibold text-text text-sm">{selected.name}</p>
                <p className="text-xs text-muted">{selected.specialties.slice(0, 3).join(' · ')}</p>
              </div>
            </div>
            <div className="text-xs text-muted leading-relaxed p-3 bg-violet/5 border border-violet/20 rounded-xl">
              <ShieldCheck size={12} className="inline mr-1.5 text-violet" />
              Your request is sent privately. {selected.name} will confirm a time slot shortly.
              All sessions take place within Confidentia — your data never leaves the platform.
            </div>
            <Button onClick={handleBook} loading={booking} fullWidth className="shadow-brand">Confirm Request</Button>
            <button onClick={() => setSelected(null)} className="w-full text-xs text-muted hover:text-text transition-colors py-2" aria-label="Cancel">Cancel</button>
          </div>
        )}
      </Modal>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 20 }} className="relative glass p-8 text-center max-w-xs mx-4">
              <CheckCircle size={52} className="mx-auto text-emerald-400 mb-4" />
              <h3 className="font-bold text-xl text-text mb-2">Request Sent!</h3>
              <p className="text-sm text-muted">{selected?.name} will confirm your session shortly.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
