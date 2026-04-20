'use client';
/**
 * app/employee/progress/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Employee Progress — historique émotionnel, insights IA, bien-être dans le temps.
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, ChevronRight, Smile, Heart, Zap, Meh, Frown,
  ArrowUp, ArrowDown, Minus, CalendarDays, BookOpen, MessageCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_EMOTION_ENTRIES, MOCK_INSIGHTS, MOCK_JOURNAL_ENTRIES } from '@/lib/mock-data';

const MOOD_META: Record<string, { icon: typeof Smile; color: string; label: string }> = {
  happy:    { icon: Smile,  color: 'text-emerald-400 bg-emerald-400/10', label: 'Heureux(se)' },
  calm:     { icon: Heart,  color: 'text-cyan bg-cyan/10',               label: 'Calme' },
  energized:{ icon: Zap,    color: 'text-amber-400 bg-amber-400/10',     label: 'Énergisé(e)' },
  neutral:  { icon: Meh,    color: 'text-muted bg-border',               label: 'Neutre' },
  anxious:  { icon: Frown,  color: 'text-orange-400 bg-orange-400/10',   label: 'Anxieux(se)' },
  stressed: { icon: Frown,  color: 'text-red-400 bg-red-400/10',         label: 'Stressé(e)' },
  sad:      { icon: Frown,  color: 'text-blue-400 bg-blue-400/10',       label: 'Triste' },
};

const WEEK_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Build chart data from last 4 weeks of insights
const chartData = MOCK_INSIGHTS.moodTrend;
const avgScore = Math.round(chartData.reduce((a, b) => a + b.score, 0) / chartData.length * 10) / 10;
const latestScore = chartData[chartData.length - 1].score;
const prevScore   = chartData[chartData.length - 2].score;
const trend = latestScore > prevScore ? 'up' : latestScore < prevScore ? 'down' : 'stable';

export default function EmployeeProgressPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <PageHeader
        title="Ma Progression"
        subtitle="Votre bien-être émotionnel dans le temps — confidentiel & uniquement visible par vous."
      />

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Score moyen */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Score moyen</p>
            <p className="text-4xl font-black text-text">{avgScore}</p>
            <p className="text-xs text-muted mt-1">/10 cette semaine</p>
          </Card>
        </motion.div>

        {/* Tendance */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
          <Card className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Tendance</p>
            <div className={`text-3xl flex items-center justify-center gap-1 font-black ${
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-muted'
            }`}>
              {trend === 'up' ? <ArrowUp size={28} /> : trend === 'down' ? <ArrowDown size={28} /> : <Minus size={28} />}
              <span className="text-2xl">{Math.abs(latestScore - prevScore)}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              {trend === 'up' ? 'En amélioration' : trend === 'down' ? 'À surveiller' : 'Stable'}
            </p>
          </Card>
        </motion.div>

        {/* Sessions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="col-span-2 sm:col-span-1">
          <Card className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Bilans réalisés</p>
            <p className="text-4xl font-black text-text">{MOCK_EMOTION_ENTRIES.length}</p>
            <p className="text-xs text-muted mt-1">cette semaine</p>
          </Card>
        </motion.div>
      </div>

      {/* ── Mood chart ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-text flex items-center gap-2">
                <TrendingUp size={15} className="text-violet" /> Courbe émotionnelle — 7 derniers jours
              </h2>
              <p className="text-xs text-muted mt-0.5">Score moyen par jour (1 = très bas · 10 = excellent)</p>
            </div>
          </div>

          <div className="flex items-end gap-3 h-36">
            {chartData.map((d, i) => {
              const pct = (d.score / 10) * 100;
              const isToday = i === chartData.length - 1;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 180 }}
                      className={`w-full rounded-lg min-h-[4px] ${isToday ? 'bg-brand' : 'bg-violet/40'}`}
                      title={`${d.day} · ${d.score}/10`}
                    />
                  </div>
                  <span className="text-[10px] text-muted font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted text-center mt-4">
            Faites votre bilan quotidien pour affiner cette courbe.{' '}
            <Link href="/employee/chat" className="text-violet hover:underline">Démarrer maintenant →</Link>
          </p>
        </Card>
      </motion.div>

      {/* ── Thèmes IA ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <Card>
          <h2 className="font-semibold text-text mb-4">Thèmes identifiés par Anna</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {MOCK_INSIGHTS.themes.map(theme => (
              <span key={theme} className="text-xs px-3 py-1.5 rounded-full bg-violet/10 border border-violet/20 text-violet font-medium">
                {theme}
              </span>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-bg border border-border">
            <p className="text-xs text-muted leading-relaxed italic">{MOCK_INSIGHTS.weeklySummary}</p>
          </div>
          <p className="text-[10px] text-muted mt-3 flex items-center gap-1">
            ✦ Ces insights sont générés par votre assistant émotionnel IA — Anna — et restent strictement confidentiels.
          </p>
        </Card>
      </motion.div>

      {/* ── Émotions récentes ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <CalendarDays size={15} className="text-violet" /> Bilans récents
          </h2>
        </div>
        <div className="space-y-2">
          {MOCK_EMOTION_ENTRIES.slice(0, 5).map((entry, i) => {
            const meta = MOOD_META[entry.emotion] ?? MOOD_META.neutral;
            const Icon = meta.icon;
            const date = new Date(entry.recordedAt);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28 + i * 0.04 }}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface hover:border-violet/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.color}`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text capitalize">{meta.label}</p>
                    <p className="text-[10px] text-muted">
                      {date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-text">{entry.intensity}</p>
                  <p className="text-[10px] text-muted">/10</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Journal récent ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <BookOpen size={15} className="text-cyan" /> Entrées de journal récentes
          </h2>
        </div>
        <div className="space-y-2">
          {MOCK_JOURNAL_ENTRIES.slice(0, 3).map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34 + i * 0.04 }}
              className="p-4 rounded-xl border border-border bg-surface hover:border-violet/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-text">{entry.title}</h3>
                <span className="text-[10px] text-muted flex-shrink-0">
                  {new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <p className="text-xs text-muted line-clamp-2 leading-relaxed">{entry.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }} className="flex gap-3">
        <Link href="/employee/chat" className="flex-1">
          <Button fullWidth variant="primary" className="shadow-brand">
            <MessageCircle size={15} /> Faire mon bilan avec Anna
          </Button>
        </Link>
        <Link href="/employee/resources" className="flex-1">
          <Button fullWidth variant="secondary">
            <BookOpen size={15} /> Ressources <ChevronRight size={14} />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
