'use client';
/**
 * app/employee/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Employee Dashboard — home landing for B2B employees.
 * Shows: greeting, weekly mood chart, quick actions, featured resource, distress CTA.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MessageCircle, BookOpen, TrendingUp, AlertCircle,
  ChevronRight, Smile, Heart, Zap, Meh, Frown, Star,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DistressRequestModal } from '@/components/features/DistressRequestModal';
import { MOCK_EMOTION_ENTRIES, MOCK_RESOURCES } from '@/lib/mock-data';

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const MOOD_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  happy:    { icon: Smile,  color: 'text-emerald-400' },
  calm:     { icon: Heart,  color: 'text-cyan' },
  energized:{ icon: Zap,    color: 'text-amber-400' },
  neutral:  { icon: Meh,    color: 'text-muted' },
  anxious:  { icon: Frown,  color: 'text-orange-400' },
  stressed: { icon: Frown,  color: 'text-red-400' },
  sad:      { icon: Frown,  color: 'text-blue-400' },
};

// Build last-7-days mood scores from mock data
function buildWeekMood() {
  const today = new Date();
  return WEEK_DAYS.map((label, i) => {
    const target = new Date(today);
    target.setDate(today.getDate() - (6 - i));
    const dayStr = target.toISOString().slice(0, 10);
    const entry = MOCK_EMOTION_ENTRIES.find(e => e.recordedAt.startsWith(dayStr));
    return { label, score: entry?.intensity ?? null, emotion: entry?.emotion ?? null };
  });
}

const weekMood = buildWeekMood();
const maxScore = 10;

const QUICK_ACTIONS = [
  { label: 'Démarrer une session IA', href: '/employee/chat',      icon: MessageCircle, color: 'text-violet bg-violet/10',  desc: 'Parlez à votre compagnon IA' },
  { label: 'Ressources',             href: '/employee/resources', icon: BookOpen,       color: 'text-cyan   bg-cyan/10',    desc: 'Guides, articles & exercices' },
  { label: 'Ma progression',         href: '/employee/chat',      icon: TrendingUp,     color: 'text-emerald-400 bg-emerald-400/10', desc: 'Votre bien-être dans le temps' },
];

const featuredResource = MOCK_RESOURCES.find(r => r.isFeatured) ?? MOCK_RESOURCES[0];

export default function EmployeeDashboardPage() {
  const [distressOpen, setDistressOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">

      {/* Distress modal */}
      <DistressRequestModal open={distressOpen} onClose={() => setDistressOpen(false)} />

      {/* ── Greeting ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-text">Bonjour 👋</h1>
            <p className="text-sm text-muted mt-0.5">Comment vous sentez-vous aujourd’hui ? Votre espace est prêt.</p>
          </div>
          {/* Distress CTA — prominent but not alarming */}
          <button
            onClick={() => setDistressOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-red-400/40 bg-red-400/5 text-red-400 text-xs font-medium hover:bg-red-400/10 hover:border-red-400/60 transition-all duration-200"
          >
            <AlertCircle size={13} />
             J’ai besoin de soutien
          </button>
        </div>
      </motion.div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((a, idx) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.href + a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}>
              <Link href={a.href}>
                <div className="glass p-4 rounded-2xl hover:border-violet/30 transition-all duration-200 cursor-pointer group h-full">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${a.color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-text font-semibold text-sm mb-0.5 group-hover:text-violet transition-colors">{a.label}</p>
                  <p className="text-xs text-muted">{a.desc}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ── Weekly mood chart ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-text">Humeur de la semaine</h2>
              <p className="text-xs text-muted mt-0.5">Intensité de vos émotions cette semaine (1–10)</p>
            </div>
            <Link href="/employee/chat" className="text-xs text-violet hover:underline flex items-center gap-0.5">
             Faire mon bilan <ChevronRight size={12} />
            </Link>
          </div>

          <div className="flex items-end gap-2 h-28">
            {weekMood.map((day, i) => {
              const pct = day.score ? (day.score / maxScore) * 100 : 0;
              const IconEntry = day.emotion ? MOOD_ICONS[day.emotion] : null;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    {day.score ? (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                        className="w-full rounded-lg bg-brand opacity-80 min-h-[4px]"
                        title={`${day.emotion} · ${day.score}/10`}
                      />
                    ) : (
                      <div className="w-full h-1 rounded-full bg-border" />
                    )}
                  </div>
                  {IconEntry && day.emotion && (
                    <IconEntry.icon size={11} className={IconEntry.color} />
                  )}
                  <span className="text-[9px] text-muted font-medium">{day.label}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted mt-4 text-center">
            Faites votre bilan quotidien pour une image plus précise de vos tendances de bien-être.
          </p>
        </Card>
      </motion.div>

      {/* ── Featured Resource ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-text">Ressource du jour</h2>
          <Link href="/employee/resources" className="text-xs text-violet hover:underline flex items-center gap-0.5">
            Voir tout <ChevronRight size={12} />
          </Link>
        </div>
        <Card className="hover:border-violet/30 transition-colors cursor-pointer group">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-violet font-semibold">{featuredResource.category}</span>
                <Star size={10} className="text-amber-400" />
                <span className="text-[10px] text-muted">{featuredResource.readingTimeMin} min de lecture</span>
              </div>
              <h3 className="font-semibold text-text text-sm mb-2 group-hover:text-violet transition-colors">
                {featuredResource.title}
              </h3>
              <p className="text-xs text-muted line-clamp-2 leading-relaxed">{featuredResource.description}</p>
            </div>
          </div>

          {featuredResource.keyTakeaways && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-2">Points clés</p>
              <ul className="space-y-1.5">
                {featuredResource.keyTakeaways.slice(0, 2).map((k, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted">
                    <span className="text-violet flex-shrink-0 mt-0.5">·</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <Button size="sm" variant="secondary" className="rounded-xl text-xs">
              Lire maintenant <ChevronRight size={12} />
            </Button>
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
