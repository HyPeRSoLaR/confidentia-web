'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_INSIGHTS } from '@/lib/mock-data';

export default function InsightsPage() {
  const { weeklySummary, themes, moodTrend } = MOCK_INSIGHTS;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Insights" subtitle="AI-powered summary of your well-being journey" />

      <StaggerList className="space-y-5">
        {/* Weekly summary */}
        <StaggerItem>
          <Card variant="brand-border">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-brand text-xs font-semibold uppercase tracking-widest">Weekly Summary</span>
            </div>
            <p className="text-sm text-text/90 leading-relaxed">{weeklySummary}</p>
          </Card>
        </StaggerItem>

        {/* Mood chart */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text mb-4">Mood This Week</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2240" />
                <XAxis dataKey="day" tick={{ fill: '#8A8FAD', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 10]} tick={{ fill: '#8A8FAD', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0F1120', border: '1px solid #1E2240', borderRadius: '0.75rem', color: '#F0F2FF' }}
                  cursor={{ stroke: '#9B6FE8', strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="score" stroke="url(#brandGrad)" strokeWidth={2.5} dot={{ fill: '#9B6FE8', r: 4 }} activeDot={{ r: 6 }} />
                <defs>
                  <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#45D8D4"/>
                    <stop offset="50%"  stopColor="#9B6FE8"/>
                    <stop offset="100%" stopColor="#FF8C6B"/>
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </StaggerItem>

        {/* Themes */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text mb-3">Key Themes</h3>
            <div className="flex flex-wrap gap-2">
              {themes.map(t => (
                <Badge key={t} variant="info" size="md">{t}</Badge>
              ))}
            </div>
          </Card>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
