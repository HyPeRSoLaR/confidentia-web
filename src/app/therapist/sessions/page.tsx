'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_THERAPY_SESSIONS } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';
import type { SessionStatus } from '@/types';

const STATUS_ICONS: Record<SessionStatus, React.ElementType> = {
  pending: AlertCircle, confirmed: Clock, completed: CheckCircle, cancelled: XCircle,
};
const STATUS_COLORS: Record<SessionStatus, string> = {
  pending: 'text-amber-400', confirmed: 'text-cyan', completed: 'text-emerald-400', cancelled: 'text-muted',
};
const STATUS_VARIANT = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'default' } as const;

export default function SessionsPage() {
  const [tab, setTab] = useState<'upcoming'|'past'>('upcoming');
  const upcoming = MOCK_THERAPY_SESSIONS.filter(s => ['pending','confirmed'].includes(s.status));
  const past      = MOCK_THERAPY_SESSIONS.filter(s => ['completed','cancelled'].includes(s.status));
  const sessions  = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Sessions" subtitle="Your client schedule" />

      {/* Tab picker */}
      <div className="flex bg-surface border border-border rounded-xl p-1 mb-6 w-fit gap-1">
        {(['upcoming','past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
              tab === t ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text'
            }`}
          >
            {t} {t === 'upcoming' ? `(${upcoming.length})` : `(${past.length})`}
          </button>
        ))}
      </div>

      <StaggerList className="space-y-3">
        {sessions.map(session => {
          const StatusIcon = STATUS_ICONS[session.status];
          const net = session.grossAmount * (1 - session.platformFeeRate);
          return (
            <StaggerItem key={session.id}>
              <Card>
                <div className="flex items-start gap-4">
                  <Avatar name={session.clientName} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-text text-sm">{session.clientName}</span>
                      <Badge variant={STATUS_VARIANT[session.status]} size="sm" className="capitalize">{session.status}</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <StatusIcon size={11} className={STATUS_COLORS[session.status]} />
                      {formatDateTime(session.date)} · {session.durationMin} min
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-muted">Gross: <span className="text-text">${session.grossAmount}</span></span>
                      <span className="text-muted">Net: <span className="text-emerald-400">${net}</span></span>
                    </div>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>
    </div>
  );
}
