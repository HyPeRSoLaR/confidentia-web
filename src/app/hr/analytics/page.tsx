'use client';
import { useTheme } from 'next-themes';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Smile } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_WELLBEING_TRENDS } from '@/lib/mock-data';

const latest = MOCK_WELLBEING_TRENDS[MOCK_WELLBEING_TRENDS.length - 1];
const prev    = MOCK_WELLBEING_TRENDS[MOCK_WELLBEING_TRENDS.length - 2];
const delta   = (latest.averageScore - prev.averageScore).toFixed(1);
const up      = Number(delta) >= 0;

const STAT_CARDS = [
  {
    label: 'Avg Well-being Score', value: latest.averageScore.toFixed(1) + '/10',
    sub: `${up ? '▲' : '▼'} ${Math.abs(Number(delta))} vs last week`,
    icon: up ? TrendingUp : TrendingDown,
    color: up ? 'text-emerald-400' : 'text-coral',
    bg: up ? 'bg-emerald-500/10' : 'bg-coral/10',
  },
  {
    label: 'Active Participants', value: latest.participantCount.toString(),
    sub: 'This week', icon: Users, color: 'text-violet', bg: 'bg-violet/10',
  },
  {
    label: 'Dominant Emotion', value: latest.dominantEmotion,
    sub: 'Organisation-wide', icon: Smile, color: 'text-cyan', bg: 'bg-cyan/10',
  },
];

export default function HRAnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const chartTheme = {
    grid:  isDark ? '#1E2240' : '#E2E8F0',
    tick:  isDark ? '#8A8FAD' : '#64748B',
    tooltip: {
      background: isDark ? '#0F1120' : '#FFFFFF',
      border:     isDark ? '1px solid #1E2240' : '1px solid #E2E8F0',
      color:      isDark ? '#F0F2FF' : '#0F172A',
      borderRadius: '0.75rem',
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Well-being Analytics"
        subtitle="Anonymized org-wide trends — individual data is never shown"
        actions={<Badge variant="success">🔒 k-anon ≥ 5</Badge>}
      />

      {/* Stats row */}
      <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {STAT_CARDS.map(s => {
          const Icon = s.icon;
          return (
            <StaggerItem key={s.label}>
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted mb-1">{s.label}</p>
                    <p className={`text-2xl font-bold capitalize ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted mt-1">{s.sub}</p>
                  </div>
                  <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={16} className={s.color} />
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {/* Charts */}
      <StaggerList className="space-y-5">
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text mb-4">Well-being Score Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_WELLBEING_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="week" tickFormatter={v => v.slice(5)} tick={{ fill: chartTheme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fill: chartTheme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <defs>
                  <linearGradient id="hrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#45D8D4" />
                    <stop offset="100%" stopColor="#9B6FE8" />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="averageScore" stroke="url(#hrGrad)" strokeWidth={2.5} dot={{ fill: '#9B6FE8', r: 4 }} name="Avg Score" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text mb-4">Weekly Participants</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={MOCK_WELLBEING_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="week" tickFormatter={v => v.slice(5)} tick={{ fill: chartTheme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chartTheme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="participantCount" fill="#E879BC" radius={[4, 4, 0, 0]} name="Participants" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
