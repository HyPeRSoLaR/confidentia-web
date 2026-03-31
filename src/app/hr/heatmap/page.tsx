'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { MOCK_HEATMAP } from '@/lib/mock-data';
import { EMOTION_COLORS } from '@/lib/utils';

const DAYS    = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS   = Array.from({ length: 24 }, (_, i) => i);
const K_ANON  = 5; // minimum participants threshold

export default function HeatmapPage() {
  const [tooltip, setTooltip] = useState<{ day: number; hour: number } | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Emotion Heatmap"
        subtitle="7-day × 24-hour emotion distribution"
        actions={<Badge variant="success">🔒 k-anon ≥ {K_ANON}</Badge>}
      />

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        {Object.entries(EMOTION_COLORS).map(([em, color]) => (
          <div key={em} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span className="text-xs text-muted capitalize">{em}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <div className="w-3 h-3 rounded-sm bg-border" />
          <span className="text-xs text-muted">Private (&lt;{K_ANON})</span>
        </div>
      </div>

      {/* Grid */}
      <div className="glass p-4 overflow-x-auto scrollbar-thin">
        {/* Hour labels */}
        <div className="flex pl-10 mb-1">
          {HOURS.filter(h => h % 3 === 0).map(h => (
            <div key={h} className="text-[9px] text-muted" style={{ width: `${100 / 8}%` }}>
              {h.toString().padStart(2, '0')}h
            </div>
          ))}
        </div>

        {/* Day rows */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <span className="text-xs text-muted w-8 flex-shrink-0">{day}</span>
            <div className="flex gap-0.5 flex-1">
              {HOURS.map(hour => {
                const cell = MOCK_HEATMAP.find(c => c.day === dayIdx && c.hour === hour);
                const isPrivate = !cell || cell.participantCount < K_ANON;
                const isHovered = tooltip?.day === dayIdx && tooltip?.hour === hour;
                return (
                  <motion.div
                    key={hour}
                    onMouseEnter={() => setTooltip({ day: dayIdx, hour })}
                    onMouseLeave={() => setTooltip(null)}
                    whileHover={{ scale: 1.3 }}
                    className="relative flex-1 h-5 rounded-sm cursor-default"
                    style={{
                      background: isPrivate
                        ? '#1E2240'
                        : EMOTION_COLORS[cell!.dominantEmotion] + 'CC',
                    }}
                  >
                    {isPrivate && (
                      <EyeOff size={8} className="absolute inset-0 m-auto text-border" />
                    )}
                    {/* Tooltip */}
                    {isHovered && !isPrivate && cell && (
                      <div className="absolute z-20 bottom-full mb-1 left-1/2 -translate-x-1/2 bg-panel border border-border rounded-lg px-2 py-1.5 text-[10px] text-text whitespace-nowrap pointer-events-none shadow-brand">
                        <p className="capitalize font-semibold">{cell.dominantEmotion}</p>
                        <p className="text-muted">{day} {hour}:00 · {cell.participantCount} people</p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mt-3 text-center">
        Cells with fewer than {K_ANON} participants are hidden to protect individual privacy.
      </p>
    </div>
  );
}
