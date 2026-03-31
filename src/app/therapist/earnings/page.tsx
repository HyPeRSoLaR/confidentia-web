'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DollarSign, TrendingUp, Percent } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_EARNINGS_DATA } from '@/lib/mock-data';

const totalGross = MOCK_EARNINGS_DATA.reduce((s, d) => s + d.gross, 0);
const totalNet   = MOCK_EARNINGS_DATA.reduce((s, d) => s + d.net, 0);
const commission = totalGross - totalNet;
const commRate   = Math.round((commission / totalGross) * 100);

export default function EarningsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Earnings" subtitle="Last 6 months · 20% platform commission" />

      {/* KPI cards */}
      <StaggerList className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Gross', value: `$${totalGross.toLocaleString()}`, icon: DollarSign, color: 'text-violet', bg: 'bg-violet/10' },
          { label: 'Net Earnings', value: `$${totalNet.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Platform Fee', value: `${commRate}%`, icon: Percent, color: 'text-coral', bg: 'bg-coral/10' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <StaggerItem key={kpi.label}>
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <div className={`w-9 h-9 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={16} className={kpi.color} />
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {/* Bar chart */}
      <StaggerList>
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-text mb-4">Monthly Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MOCK_EARNINGS_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2240" />
                <XAxis dataKey="month" tick={{ fill: '#8A8FAD', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8A8FAD', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                  contentStyle={{ background: '#0F1120', border: '1px solid #1E2240', borderRadius: '0.75rem', color: '#F0F2FF' }}
                />
                <Legend wrapperStyle={{ color: '#8A8FAD', fontSize: 12 }} />
                <Bar dataKey="gross" name="Gross" fill="#9B6FE8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net"   name="Net"   fill="#45D8D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
