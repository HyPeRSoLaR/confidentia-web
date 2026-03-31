'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_THERAPIST_PROFILE } from '@/lib/mock-data';
import type { AvailabilitySlot } from '@/types';

const DAYS  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(MOCK_THERAPIST_PROFILE.availability);
  const [saved, setSaved] = useState(false);

  function toggle(day: number, hour: number) {
    setSlots(prev => {
      const exists = prev.find(s => s.day === day && s.hour === hour);
      if (exists) return prev.map(s => s.day === day && s.hour === hour ? { ...s, available: !s.available } : s);
      return [...prev, { day, hour, available: true }];
    });
  }

  function isAvailable(day: number, hour: number) {
    return slots.find(s => s.day === day && s.hour === hour)?.available ?? false;
  }

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Availability"
        subtitle="Click slots to toggle open/closed"
        actions={<Button size="sm" onClick={save}>{saved ? '✓ Saved' : 'Save'}</Button>}
      />

      <Card className="overflow-x-auto scrollbar-thin">
        {/* Hour headers */}
        <div className="flex pl-12 mb-1 gap-0.5">
          {HOURS.filter(h => h % 3 === 0).map(h => (
            <div key={h} className="text-[9px] text-muted" style={{ width: `${100 / 8}%` }}>
              {h.toString().padStart(2, '0')}h
            </div>
          ))}
        </div>
        {/* Day rows */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="text-xs text-muted w-10 flex-shrink-0">{day}</span>
            <div className="flex gap-0.5 flex-1">
              {HOURS.map(hour => {
                const avail = isAvailable(dayIdx, hour);
                return (
                  <motion.button
                    key={hour}
                    onClick={() => toggle(dayIdx, hour)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex-1 h-5 rounded-sm transition-colors duration-150 ${
                      avail ? 'bg-cyan/70 hover:bg-cyan' : 'bg-border/50 hover:bg-border'
                    }`}
                    title={`${day} ${hour}:00 — ${avail ? 'Available' : 'Unavailable'}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan/70"/><span className="text-xs text-muted">Available</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-border/50"/><span className="text-xs text-muted">Unavailable</span></div>
        </div>
      </Card>
    </div>
  );
}
