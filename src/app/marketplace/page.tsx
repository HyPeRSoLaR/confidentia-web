'use client';
/**
 * app/marketplace/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Annuaire des thérapeutes — parcourir, filtrer et réserver des séances.
 * Accessible depuis le CTA « Je veux parler avec quelqu'un » dans le chat.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Globe, Check, X, Clock,
  Calendar, ChevronRight, SlidersHorizontal,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_THERAPISTS } from '@/lib/mock-data';
import type { TherapistProfile } from '@/types';

// ─── Données enrichies ────────────────────────────────────────────────────────

const ENRICHED_THERAPISTS = [
  ...MOCK_THERAPISTS,
  {
    userId: 't4',
    name: 'Dr. Yuki Tanaka',
    avatarUrl: 'https://images.unsplash.com/photo-1614132967153-77aac0af3e54?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Spécialisée dans la récupération après burn-out, le coaching de haute performance et les soins tenant compte des traumatismes. Ancienne avocate d'affaires reconvertie en thérapeute.",
    specialties: ['Burn-out', 'Trauma', 'Haute performance', 'TCC'],
    languages: ['Anglais', 'Japonais'],
    ratePerSession: 110,
    rating: 4.7,
    sessionCount: 620,
    isVerified: true,
    availability: [{ day: 1, hour: 14, available: true }, { day: 3, hour: 9, available: true }],
  },
  {
    userId: 't5',
    name: 'Amadou Diallo',
    avatarUrl: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?auto=format&fit=crop&w=200&h=200&q=80',
    bio: "Thérapeute centré sur la personne avec 15 ans d'expérience pour aider les individus à traverser les transitions de carrière, les questions d'identité et les émotions complexes.",
    specialties: ['Transitions de carrière', 'Identité', 'Dépression', 'ACT'],
    languages: ['Anglais', 'Français', 'Wolof'],
    ratePerSession: 80,
    rating: 4.9,
    sessionCount: 1120,
    isVerified: true,
    availability: [{ day: 2, hour: 10, available: true }, { day: 4, hour: 15, available: true }],
  },
];

const ALL_SPECIALTIES = Array.from(new Set(ENRICHED_THERAPISTS.flatMap(t => t.specialties))).sort();
const ALL_LANGUAGES   = Array.from(new Set(ENRICHED_THERAPISTS.flatMap(t => t.languages))).sort();

// ─── Labels des jours ─────────────────────────────────────────────────────────

const DAYS_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const HOURS = [9, 10, 11, 14, 15, 16, 17];

// ─── Modal de réservation ─────────────────────────────────────────────────────

function SchedulingModal({ therapist, onClose }: { therapist: TherapistProfile; onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableSlots = therapist.availability?.filter(s => s.available) ?? [];

  async function book() {
    if (!selectedSlot) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setBooked(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-brand z-10"
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <img src={therapist.avatarUrl} alt={therapist.name} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h2 className="font-bold text-text text-sm">{therapist.name}</h2>
              <p className="text-xs text-muted">€{therapist.ratePerSession} · séance de 50 min</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text">
            <X size={14} />
          </button>
        </div>

        <div className="p-6">
          {booked ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-bold text-text mb-1">Séance réservée ! 🎉</h3>
              <p className="text-sm text-muted">
                {selectedSlot ? `${DAYS_LABELS[selectedSlot.day]} à ${selectedSlot.hour}h00` : ''} avec {therapist.name}.
                Vous recevrez une confirmation par e-mail.
              </p>
              <Button onClick={onClose} className="mt-5 rounded-2xl px-8">Fermer</Button>
            </motion.div>
          ) : (
            <>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Choisir un créneau</p>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-muted text-center py-6">Aucune disponibilité cette semaine. Revenez bientôt.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {availableSlots.map(slot => {
                    const isSelected = selectedSlot?.day === slot.day && selectedSlot?.hour === slot.hour;
                    return (
                      <button
                        key={`${slot.day}-${slot.hour}`}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-center transition-all duration-150 ${
                          isSelected ? 'border-transparent ring-2 ring-violet bg-violet/10' : 'border-border bg-panel hover:border-violet/40'
                        }`}
                      >
                        <p className="text-xs font-semibold text-text">{DAYS_LABELS[slot.day]}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Clock size={9} className="text-muted" />
                          <p className="text-[10px] text-muted">{slot.hour}h00</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedSlot && (
                <div className="flex items-center gap-2 p-3 bg-violet/5 border border-violet/20 rounded-xl mb-4 text-xs text-muted">
                  <Calendar size={12} className="text-violet flex-shrink-0" />
                  <span>
                    {DAYS_LABELS[selectedSlot.day]} à {selectedSlot.hour}h00 — 50 min · €{therapist.ratePerSession}
                  </span>
                </div>
              )}

              <Button onClick={book} disabled={!selectedSlot} loading={loading} className="w-full rounded-2xl py-3 shadow-brand">
                Réserver la séance
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Carte thérapeute ─────────────────────────────────────────────────────────

function TherapistCard({ therapist, onBook }: { therapist: TherapistProfile; onBook: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex gap-4">
          <img
            src={therapist.avatarUrl}
            alt={therapist.name}
            className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="font-bold text-text text-sm">{therapist.name}</h3>
              {therapist.isVerified && (
                <div className="w-4 h-4 rounded-full bg-emerald-400/15 flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-emerald-400" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted flex-wrap mb-2">
              <span className="flex items-center gap-0.5"><Star size={10} className="text-amber-400" /> {therapist.rating}</span>
              <span>·</span>
              <span>{therapist.sessionCount.toLocaleString('fr-FR')} séances</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Globe size={9} /> {therapist.languages.join(' · ')}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {therapist.specialties.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] px-1.5 py-0.5 bg-violet/10 text-violet rounded-full">{s}</span>
              ))}
              {therapist.specialties.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-border text-muted rounded-full">+{therapist.specialties.length - 3}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-sm font-bold text-text">€{therapist.ratePerSession}</span>
            <span className="text-[10px] text-muted">/séance</span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-muted leading-relaxed mt-3 pt-3 border-t border-border">{therapist.bio}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-text border border-border rounded-xl py-2 hover:border-violet/30 transition-all"
          >
            {expanded ? 'Réduire' : 'En savoir plus'}
            <ChevronRight size={11} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
          <Button size="sm" onClick={onBook} className="flex-1 rounded-xl">
            <Calendar size={12} /> Réserver
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [search,       setSearch]       = useState('');
  const [filterSpec,   setFilterSpec]   = useState<string | null>(null);
  const [filterLang,   setFilterLang]   = useState<string | null>(null);
  const [maxRate,      setMaxRate]       = useState(200);
  const [showFilters,  setShowFilters]   = useState(false);
  const [bookingFor,   setBookingFor]    = useState<TherapistProfile | null>(null);

  const filtered = ENRICHED_THERAPISTS.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchSpec   = !filterSpec || t.specialties.includes(filterSpec);
    const matchLang   = !filterLang || t.languages.includes(filterLang);
    const matchRate   = t.ratePerSession <= maxRate;
    return matchSearch && matchSpec && matchLang && matchRate;
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Modal de réservation */}
      <AnimatePresence>
        {bookingFor && <SchedulingModal therapist={bookingFor} onClose={() => setBookingFor(null)} />}
      </AnimatePresence>

      <PageHeader
        title="Trouver un thérapeute"
        subtitle={`${filtered.length} professionnel${filtered.length > 1 ? 's' : ''} certifié${filtered.length > 1 ? 's' : ''} disponible${filtered.length > 1 ? 's' : ''}`}
      />

      {/* Barre de recherche + filtres */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou spécialité…"
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none focus:border-violet/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${showFilters ? 'bg-violet/10 border-violet text-violet' : 'border-border text-muted hover:border-violet/40 hover:text-violet'}`}
        >
          <SlidersHorizontal size={13} /> Filtres
          {(filterSpec || filterLang || maxRate < 200) && <div className="w-1.5 h-1.5 rounded-full bg-violet" />}
        </button>
      </div>

      {/* Panneau de filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="glass p-4 rounded-2xl space-y-4">
              {/* Spécialité */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Spécialité</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SPECIALTIES.map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterSpec(filterSpec === s ? null : s)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${filterSpec === s ? 'bg-violet text-white border-violet' : 'border-border text-muted hover:border-violet/40'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Langue */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Langue</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_LANGUAGES.map(l => (
                    <button
                      key={l}
                      onClick={() => setFilterLang(filterLang === l ? null : l)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${filterLang === l ? 'bg-violet text-white border-violet' : 'border-border text-muted hover:border-violet/40'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tarif max */}
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">Tarif max</p>
                  <span className="text-xs font-semibold text-violet">€{maxRate}/séance</span>
                </div>
                <input
                  type="range" min={50} max={200} step={5} value={maxRate}
                  onChange={e => setMaxRate(Number(e.target.value))}
                  className="w-full accent-violet"
                />
              </div>

              {(filterSpec || filterLang || maxRate < 200) && (
                <button
                  onClick={() => { setFilterSpec(null); setFilterLang(null); setMaxRate(200); }}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  <X size={11} /> Réinitialiser les filtres
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Résultats */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Filter size={32} className="mx-auto text-muted mb-3" />
            <p className="text-sm text-muted">Aucun thérapeute ne correspond à vos critères. Essayez d&apos;ajuster les filtres.</p>
          </div>
        ) : (
          filtered.map(t => (
            <TherapistCard key={t.userId} therapist={t} onBook={() => setBookingFor(t)} />
          ))
        )}
      </div>
    </div>
  );
}
