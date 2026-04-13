'use client';
/**
 * app/hr/heatmap/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Simplified heatmap — Day view (Lun–Dim) | Week view (4 weeks).
 * Filter by All employees OR a specific department pole.
 * Dropped hourly granularity — not actionable and privacy risk.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeOff, Calendar, CalendarDays, ChevronDown, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  MOCK_DAY_HEATMAP, MOCK_POLE_DAY_HEATMAP,
  MOCK_POLES, MOCK_WELLBEING_TRENDS,
} from '@/lib/mock-data';
import type { DayHeatCell } from '@/lib/mock-data';
import { EMOTION_COLORS } from '@/lib/utils';

const DAYS        = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const K_ANON      = 5;

type HeatView = 'day' | 'week';

// ── Pole selector dropdown ────────────────────────────────────────────────────

function PoleSelector({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = selected ? MOCK_POLES.find(p => p.id === selected) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-medium text-text hover:border-violet/40 transition-all"
      >
        {current ? (
          <>
            <span>{current.emoji}</span>
            <span style={{ color: current.color }}>{current.name}</span>
          </>
        ) : (
          <>
            <Users size={11} className="text-muted" />
            <span>Tous les employés</span>
          </>
        )}
        <ChevronDown size={11} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            className="absolute right-0 top-full mt-1.5 bg-surface border border-border rounded-2xl shadow-brand z-30 overflow-hidden min-w-[180px]"
          >
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left hover:bg-panel transition-colors ${!selected ? 'font-semibold text-violet' : 'text-text'}`}
            >
              <Users size={11} className="text-muted" /> Tous les employés
            </button>
            <div className="border-t border-border" />
            {MOCK_POLES.map(pole => (
              <button
                key={pole.id}
                onClick={() => { onChange(pole.id); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs text-left hover:bg-panel transition-colors ${selected === pole.id ? 'font-semibold' : 'text-text'}`}
                style={selected === pole.id ? { color: pole.color } : {}}
              >
                <span>{pole.emoji}</span>
                <span>{pole.name}</span>
                <span className="ml-auto text-muted">{pole.memberCount}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Day view ─────────────────────────────────────────────────────────────────

function DayView({ cells }: { cells: DayHeatCell[] }) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const thisWeek = cells.filter(c => c.week === 0);

  function getCell(day: number) {
    return thisWeek.find(c => c.day === day);
  }

  return (
    <div className="glass p-6 rounded-2xl">
      <p className="text-sm font-semibold text-text mb-5">Cette semaine — aperçu quotidien</p>
      <div className="grid grid-cols-7 gap-3">
        {DAYS.map((day, dayIdx) => {
          const cell      = getCell(dayIdx);
          const isPrivate = !cell || cell.participantCount < K_ANON;
          const tipKey    = `day-${dayIdx}`;
          const tipOpen   = tooltip === tipKey;
          const color     = isPrivate ? undefined : (EMOTION_COLORS as Record<string, string>)[cell!.dominantEmotion];

          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted font-medium">{day}</span>

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

                {!isPrivate && cell && (
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-xs font-bold text-white/90 drop-shadow">{cell.averageScore.toFixed(1)}</span>
                  </div>
                )}

                {tipOpen && !isPrivate && cell && (
                  <div className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 bg-panel border border-border rounded-xl px-3 py-2 text-[10px] text-text whitespace-nowrap pointer-events-none shadow-brand">
                    <p className="capitalize font-semibold">{cell.dominantEmotion}</p>
                    <p className="text-muted">{cell.participantCount} personnes · moy. {cell.averageScore.toFixed(1)}/10</p>
                  </div>
                )}
              </div>

              {!isPrivate && cell && (
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-[10px] text-muted">Échelle de score bien-être</span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full" style={{ background: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981)' }} />
          <div className="flex justify-between w-24 text-[9px] text-muted">
            <span>1</span><span>5</span><span>10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Week view ─────────────────────────────────────────────────────────────────

function WeekView({ cells, poleId }: { cells: DayHeatCell[]; poleId: string | null }) {
  // Aggregate each week: average score + dominant emotion across all days
  const weeks = useMemo(() => {
    return [0, 1, 2, 3].map(weekIdx => {
      const dayCells = cells.filter(c => c.week === weekIdx && c.participantCount >= K_ANON);
      if (dayCells.length === 0) return null;
      const totalScore = dayCells.reduce((s, c) => s + c.averageScore, 0);
      const avgScore   = totalScore / dayCells.length;
      // Most frequent emotion
      const emotionCount: Record<string, number> = {};
      dayCells.forEach(c => { emotionCount[c.dominantEmotion] = (emotionCount[c.dominantEmotion] ?? 0) + 1; });
      const dominant = Object.entries(emotionCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'neutral';
      const totalPeople = dayCells.reduce((s, c) => s + c.participantCount, 0);
      return { weekIdx, avgScore, dominant, totalPeople };
    });
  }, [cells]);

  // Fall back to company-wide wellbeing trends for the week view if no pole selected
  const fallbackTrends = !poleId ? [...MOCK_WELLBEING_TRENDS].reverse() : null;

  const weekLabels = ['Cette semaine', 'La semaine dernière', 'Il y a 2 semaines', 'Il y a 3 semaines'];

  return (
    <div className="space-y-3">
      <div className="glass p-6 rounded-2xl space-y-3">
        <p className="text-sm font-semibold text-text mb-5">4 dernières semaines — tendance hebdomadaire</p>

        {weeks.map((w, idx) => {
          const label   = weekLabels[idx] ?? `Il y a ${idx} semaines`;
          const score   = poleId ? (w?.avgScore ?? null) : (fallbackTrends?.[idx]?.averageScore ?? null);
          const emotion = poleId ? (w?.dominant ?? null) : (fallbackTrends?.[idx]?.dominantEmotion ?? null);
          const people  = poleId ? (w?.totalPeople ?? null) : (fallbackTrends?.[idx]?.participantCount ?? null);

          if (score === null) {
            return (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xs text-muted w-32 flex-shrink-0">{label}</span>
                <div className="flex-1 h-8 bg-panel rounded-2xl overflow-hidden flex items-center gap-2 px-3">
                  <EyeOff size={11} className="text-muted" />
                  <span className="text-[10px] text-muted">Données insuffisantes (k &lt; {K_ANON})</span>
                </div>
              </div>
            );
          }

          const pct   = (score / 10) * 100;
          const color = (EMOTION_COLORS as Record<string, string>)[emotion!] ?? '#6366f1';

          return (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-xs text-muted w-32 flex-shrink-0">{label}</span>
              <div className="flex-1 h-8 bg-panel rounded-2xl overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: idx * 0.08, type: 'spring', stiffness: 160 }}
                  className="h-full rounded-2xl flex items-center"
                  style={{ background: color + 'BB' }}
                >
                  <span className="ml-3 text-xs font-semibold text-white/90 drop-shadow whitespace-nowrap capitalize">
                    {emotion}
                  </span>
                </motion.div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-bold text-text">{score.toFixed(1)}</span>
                <span className="text-xs text-muted">/ 10</span>
              </div>
              {people !== null && (
                <span className="text-xs text-muted flex-shrink-0">{people} personnes</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Week-on-week delta */}
      {(() => {
        const thisW  = weeks[0];
        const lastW  = weeks[1];
        const delta  = thisW && lastW ? (thisW.avgScore - lastW.avgScore) : null;
        const isUp   = delta !== null && delta > 0;
        return delta !== null ? (
          <div className="glass p-4 rounded-2xl">
            <p className="text-xs text-muted text-center">
              Semaine sur semaine : <strong className={isUp ? 'text-emerald-400' : 'text-red-400'}>{isUp ? '+' : ''}{delta.toFixed(1)}</strong> pts de bien-être moyen
            </p>
          </div>
        ) : null;
      })()}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HeatmapPage() {
  const [view,    setView]    = useState<HeatView>('day');
  const [poleId,  setPoleId]  = useState<string | null>(null);

  const activePole = poleId ? MOCK_POLES.find(p => p.id === poleId) : null;

  // Pick the right dataset
  const cellData: DayHeatCell[] = poleId
    ? (MOCK_POLE_DAY_HEATMAP[poleId] ?? [])
    : MOCK_DAY_HEATMAP;

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Carte thermique des émotions"
        subtitle={
          activePole
            ? `${activePole.emoji} ${activePole.name} — bien-être anonymisé`
            : "À l'échelle de l'entreprise — patterns de bien-être anonymisés"
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="success">🔒 k-anon ≥ {K_ANON}</Badge>

            {/* Pole selector */}
            <PoleSelector selected={poleId} onChange={setPoleId} />

            {/* Jour / Semaine toggle */}
            <div className="flex bg-surface rounded-xl p-1 border border-border gap-0.5">
              {([['day', 'Jour', CalendarDays], ['week', 'Semaine', Calendar]] as const).map(([id, label, Icon]) => (
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

      {/* Pole strip */}
      {activePole && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-2xl border"
          style={{ background: activePole.color + '10', borderColor: activePole.color + '30' }}
        >
          <span className="text-lg">{activePole.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-text">{activePole.name}</p>
            <p className="text-xs text-muted">{activePole.memberCount} membres · carte du pôle</p>
          </div>
          <button
            onClick={() => setPoleId(null)}
            className="ml-auto text-xs text-muted hover:text-text underline"
          >
            Tout afficher
          </button>
        </motion.div>
      )}

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
          <span className="text-xs text-muted">Privé (&lt;{K_ANON})</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'day' ? (
          <motion.div key={`day-${poleId}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <DayView cells={cellData} />
          </motion.div>
        ) : (
          <motion.div key={`week-${poleId}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <WeekView cells={cellData} poleId={poleId} />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted mt-4 text-center">
        Les cellules avec moins de {K_ANON} participants sont masquées pour protéger la vie privée individuelle.
      </p>
    </div>
  );
}
