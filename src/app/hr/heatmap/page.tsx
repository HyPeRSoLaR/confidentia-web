'use client';
/**
 * app/hr/heatmap/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Simplified heatmap with toggle: Day view (Mon–Sun) | Week view (4 weeks).
 * Dropped hourly granularity — too complex, not actionable.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Calendar, CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { MOCK_DAY_HEATMAP, MOCK_WELLBEING_TRENDS } from '@/lib/mock-data';
import { EMOTION_COLORS } from '@/lib/utils';

const DAYS     = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEK_LABELS  = ['This week', 'Last week', '2 weeks ago', '3 weeks ago'];
const K_ANON   = 5;

type HeatView = 'day' | 'week';

export default function HeatmapPage() {
  const [view,    setView]    = useState<HeatView>('day');
  const [tooltip, setTooltip] = useState<string | null>(null);

  // Day view data (week=0 = this week)
  const thisWeek = MOCK_DAY_HEATMAP.filter(c => c.week === 0);

  // Week view data (aggregated from wellbeing trends)
  const weekTrends = MOCK_WELLBEING_TRENDS.slice().reverse(); // newest first

  function getCell(day: number) {
    return thisWeek.find(c => c.day === day);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Emotion Heatmap"
        subtitle="Aggregated wellbeing patterns — anonymised"
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="success">🔒 k-anon ≥ {K_ANON}</Badge>
            {/* View toggle */}
            <div className="flex bg-surface rounded-xl p-1 border border-border gap-0.5">
              {([['day', 'Day View', CalendarDays], ['week', 'Week View', Calendar]] as const).map(([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    view === id ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text'
                  }`}
                >
                  <Icon size={12} aria-hidden />{label}
                </button>
              ))}
            </div>
          </div>
        }
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

      <AnimatePresence mode="wait">

        {/* ── DAY VIEW ── */}
        {view === 'day' && (
          <motion.div
            key="day"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="glass p-6 rounded-2xl">
              <p className="text-sm font-semibold text-text mb-5">This week — daily snapshot</p>
              <div className="grid grid-cols-7 gap-3">
                {DAYS.map((day, dayIdx) => {
                  const cell = getCell(dayIdx);
                  const isPrivate = !cell || cell.participantCount < K_ANON;
                  const tipKey = `day-${dayIdx}`;
                  const tipOpen = tooltip === tipKey;
                  const color = isPrivate ? undefined : (EMOTION_COLORS as Record<string, string>)[cell!.dominantEmotion];

                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <span className="text-xs text-muted font-medium">{day}</span>

                      {/* Tall bar */}
                      <div className="relative w-full" style={{ height: 120 }}>
                        <motion.div
                          whileHover={{ scale: 1.04 }}
                          onMouseEnter={() => setTooltip(tipKey)}
                          onMouseLeave={() => setTooltip(null)}
                          className="w-full h-full rounded-2xl flex items-center justify-center cursor-default transition-all"
                          style={{ background: isPrivate ? 'var(--border)' : color + 'CC' }}
                        >
                          {isPrivate && <EyeOff size={14} className="text-muted" />}
                        </motion.div>

                        {/* Score overlay */}
                        {!isPrivate && cell && (
                          <div className="absolute bottom-2 left-0 right-0 text-center">
                            <span className="text-xs font-bold text-white/90 drop-shadow">{cell.averageScore.toFixed(1)}</span>
                          </div>
                        )}

                        {/* Tooltip */}
                        {tipOpen && !isPrivate && cell && (
                          <div className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-panel border border-border rounded-xl px-3 py-2 text-[10px] text-text whitespace-nowrap pointer-events-none shadow-brand">
                            <p className="capitalize font-semibold">{cell.dominantEmotion}</p>
                            <p className="text-muted">{cell.participantCount} people · avg {cell.averageScore.toFixed(1)}/10</p>
                          </div>
                        )}
                      </div>

                      {/* Emotion dot */}
                      {!isPrivate && cell && (
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Score scale */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-[10px] text-muted">Wellbeing score scale</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 rounded-full" style={{ background: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981)' }} />
                  <div className="flex justify-between w-24 text-[9px] text-muted">
                    <span>1</span><span>5</span><span>10</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── WEEK VIEW ── */}
        {view === 'week' && (
          <motion.div
            key="week"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div className="glass p-6 rounded-2xl space-y-3">
              <p className="text-sm font-semibold text-text mb-5">Last 4 weeks — weekly trend</p>

              {([...MOCK_WELLBEING_TRENDS].reverse()).map((trend, idx) => {
                const pct = (trend.averageScore / 10) * 100;
                const color = (EMOTION_COLORS as Record<string, string>)[trend.dominantEmotion] ?? '#6366f1';
                const weekLabel = idx === 0 ? 'This week' : idx === 1 ? 'Last week' : `${idx} weeks ago`;

                return (
                  <div key={trend.week} className="flex items-center gap-4">
                    <span className="text-xs text-muted w-24 flex-shrink-0">{weekLabel}</span>

                    {/* Progress bar */}
                    <div className="flex-1 h-8 bg-panel rounded-2xl overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: idx * 0.08, type: 'spring', stiffness: 160 }}
                        className="h-full rounded-2xl flex items-center"
                        style={{ background: color + 'BB' }}
                      >
                        <span className="ml-3 text-xs font-semibold text-white/90 drop-shadow whitespace-nowrap">
                          {trend.dominantEmotion}
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-bold text-text">{trend.averageScore.toFixed(1)}</span>
                      <span className="text-xs text-muted">/ 10</span>
                    </div>
                    <span className="text-xs text-muted flex-shrink-0">{trend.participantCount} people</span>
                  </div>
                );
              })}
            </div>

            {/* Week-over-week delta */}
            <div className="glass p-4 rounded-2xl mt-3">
              {(() => {
                const curr = MOCK_WELLBEING_TRENDS[MOCK_WELLBEING_TRENDS.length - 1];
                const prev = MOCK_WELLBEING_TRENDS[MOCK_WELLBEING_TRENDS.length - 2];
                const delta = curr && prev ? (curr.averageScore - prev.averageScore).toFixed(1) : null;
                const isUp = delta && parseFloat(delta) > 0;
                return delta ? (
                  <p className="text-xs text-muted text-center">
                    Week-on-week: <strong className={isUp ? 'text-emerald-400' : 'text-red-400'}>{isUp ? '+' : ''}{delta}</strong> pts average wellbeing
                  </p>
                ) : null;
              })()}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <p className="text-xs text-muted mt-4 text-center">
        Cells with fewer than {K_ANON} participants are hidden to protect individual privacy.
      </p>
    </div>
  );
}
