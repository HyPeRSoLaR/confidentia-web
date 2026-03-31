'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Globe, ShieldCheck, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_THERAPISTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function TherapistMarketplace() {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const specialties = Array.from(new Set(MOCK_THERAPISTS.flatMap(t => t.specialties)));

  const filteredTherapists = MOCK_THERAPISTS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.bio.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || t.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      <PageHeader 
        title="Find Your Practitioner" 
        subtitle="Connect with certified human therapists for deeper clinical support."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-surface border border-border p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input 
            type="text"
            placeholder="Search by name, specialty, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Badge 
            variant={!selectedSpecialty ? 'brand' : 'default'} 
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedSpecialty(null)}
          >
            All
          </Badge>
          {specialties.map(s => (
            <Badge 
              key={s}
              variant={selectedSpecialty === s ? 'brand' : 'default'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedSpecialty(s)}
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>

      {/* Therapist Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
        {filteredTherapists.map(therapist => (
          <motion.div 
            key={therapist.userId}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-border rounded-3xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow group"
          >
            <div className="relative shrink-0">
              <img 
                src={therapist.avatarUrl} 
                alt={therapist.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {therapist.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-brand text-white p-1.5 rounded-full shadow-lg border-4 border-surface" title="Verified Practitioner">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-serif font-bold text-text">{therapist.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {therapist.rating}</span>
                    <span>•</span>
                    <span>{therapist.sessionCount}+ sessions</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-text">€{therapist.ratePerSession}</p>
                  <p className="text-xs text-muted">per 50m session</p>
                </div>
              </div>

              <p className="text-sm text-muted leading-relaxed line-clamp-2 md:line-clamp-3">
                {therapist.bio}
              </p>

              <div className="flex flex-wrap gap-2">
                {therapist.languages.map(lang => (
                  <span key={lang} className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-muted bg-bg px-2 py-0.5 rounded-md border border-border">
                    <Globe className="w-2.5 h-2.5" /> {lang}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex gap-3">
                <Button variant="secondary" className="flex-1 rounded-xl h-10 text-xs font-bold gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Book Session
                </Button>
                <Button className="flex-1 rounded-xl h-10 text-xs font-bold gap-2 bg-black/5 dark:bg-white/5 text-text border-0 hover:bg-brand hover:text-white transition-all shadow-none">
                  View Profile <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
