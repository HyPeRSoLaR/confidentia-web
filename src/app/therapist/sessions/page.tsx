'use client';
import { CheckCircle, Clock, XCircle, AlertCircle, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_THERAPY_SESSIONS } from '@/lib/mock-data';

const STATUS_CONFIG = {
  confirmed:  { icon: CheckCircle, color: 'text-emerald-400', variant: 'success'  as const, label: 'Confirmed' },
  pending:    { icon: Clock,        color: 'text-amber-400',   variant: 'warning'  as const, label: 'Pending'   },
  completed:  { icon: CheckCircle,  color: 'text-muted',       variant: 'default'  as const, label: 'Completed' },
  cancelled:  { icon: XCircle,      color: 'text-coral',       variant: 'danger'   as const, label: 'Cancelled' },
};

export default function TherapistSessionsPage() {
  const upcoming  = MOCK_THERAPY_SESSIONS.filter(s => s.status !== 'completed' && s.status !== 'cancelled');
  const completed = MOCK_THERAPY_SESSIONS.filter(s => s.status === 'completed');
  const totalEarned = completed.reduce((s, c) => s + c.grossAmount * (1 - c.platformFeeRate), 0);
  const totalSessions = MOCK_THERAPY_SESSIONS.length;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="My Sessions" subtitle="Upcoming and past client sessions" />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Sessions', value: totalSessions.toString(), icon: CheckCircle, color: 'text-violet' },
          { label: 'Completed',      value: completed.length.toString(), icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Net Earned',     value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'text-cyan' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <Icon size={14} className={`${s.color} mb-1`} />
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted leading-tight">{s.label}</p>
            </Card>
          );
        })}
      </div>

      <StaggerList className="space-y-6">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <StaggerItem>
            <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Upcoming</h3>
            <div className="space-y-3">
              {upcoming.map(session => {
                const cfg  = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.completed;
                const Icon = cfg.icon;
                const date = new Date(session.date);
                return (
                  <Card key={session.id} hover className="ring-1 ring-brand/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={14} className={cfg.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-text">{session.clientName}</span>
                          <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                        </div>
                        <p className="text-xs text-muted">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' · '}{session.durationMin} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-violet">${Math.round(session.grossAmount * (1 - session.platformFeeRate))}</p>
                        <p className="text-[10px] text-muted">net</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </StaggerItem>
        )}

        {/* Past sessions */}
        <StaggerItem>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Past Sessions</h3>
          <div className="space-y-2">
            {completed.map(session => {
              const date = new Date(session.date);
              return (
                <div key={session.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-text">{session.clientName}</span>
                    <span className="text-muted ml-2 text-xs">{date.toLocaleDateString()}</span>
                  </div>
                  <Badge variant="default" size="sm">Completed</Badge>
                  <span className="text-xs text-violet font-semibold">${Math.round(session.grossAmount * (1 - session.platformFeeRate))}</span>
                </div>
              );
            })}
          </div>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
