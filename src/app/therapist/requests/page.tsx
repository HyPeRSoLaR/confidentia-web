'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Timer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_SESSION_REQUESTS, MOCK_THERAPISTS } from '@/lib/mock-data';
import { formatDateTime, timeAgo } from '@/lib/utils';
import type { SessionRequest } from '@/types';

const URGENCY_VARIANT = { low: 'default', medium: 'warning', high: 'danger' } as const;
const REASSIGN_THERAPIST = MOCK_THERAPISTS[2]; // Elena Rodriguez

/** Returns { expired, msRemaining, label } */
function useCountdown(expiresAt: string) {
  const getMs = () => new Date(expiresAt).getTime() - Date.now();
  const [ms, setMs] = useState(getMs);

  useEffect(() => {
    const id = setInterval(() => setMs(getMs()), 1000);
    return () => clearInterval(id);
  });

  const expired = ms <= 0;
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const label = expired ? 'Expired' : `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  const pct   = expired ? 0 : Math.min(100, (ms / (24 * 3_600_000)) * 100);

  return { expired, ms, label, pct };
}

function RequestCard({
  req,
  onAccept,
  onDecline,
  feedback,
}: {
  req: SessionRequest;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  feedback: { id: string; action: 'accept' | 'decline' } | null;
}) {
  const { expired, label, pct } = useCountdown(req.expiresAt);
  const isFeedback = feedback?.id === req.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: isFeedback ? 0.5 : 1,
        y: 0,
        x: isFeedback ? (feedback?.action === 'accept' ? 40 : -40) : 0,
      }}
      exit={{ opacity: 0, x: feedback?.action === 'accept' ? 40 : -40, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className={`relative ${isFeedback ? (feedback.action === 'accept' ? 'border-emerald-500/40' : 'border-red-400/40') : expired ? 'border-amber-400/30 opacity-70' : ''}`}>
        {/* Feedback overlay */}
        {isFeedback && (
          <div className={`absolute inset-0 rounded-2xl flex items-center justify-center z-10 ${feedback.action === 'accept' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
            {feedback.action === 'accept' ? <CheckCircle size={32} className="text-emerald-400" /> : <XCircle size={32} className="text-red-400" />}
          </div>
        )}

        {/* Expired overlay */}
        {expired && !isFeedback && (
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10 bg-amber-400/5 border border-amber-400/20">
            <RefreshCw size={20} className="text-amber-400 mb-1.5" />
            <p className="text-xs font-semibold text-amber-400">Auto-reassigned to</p>
            <p className="text-xs text-text font-medium">{REASSIGN_THERAPIST.name}</p>
          </div>
        )}

        <div className="flex items-start gap-4 relative">
          <Avatar name={req.clientName} size="md" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-text text-sm">{req.clientName}</span>
              <Badge variant={URGENCY_VARIANT[req.urgency]} size="sm">{req.urgency} urgency</Badge>
              <span className="text-xs text-muted ml-auto">{timeAgo(req.requestedAt)}</span>
            </div>
            <p className="text-xs text-muted mb-2">
              Topic: <span className="text-text">{req.topic}</span>
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
              <Clock size={11} />
              Preferred: {formatDateTime(req.preferredDate)}
            </div>

            {/* 24h countdown bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-muted">
                  <Timer size={9} />
                  <span>Response window</span>
                </div>
                <span className={`font-semibold ${expired ? 'text-amber-400' : pct < 20 ? 'text-red-400' : pct < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {label}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${pct}%`,
                    background: expired ? '#F59E0B' : pct < 20 ? '#EF4444' : pct < 50 ? '#F59E0B' : '#10B981',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {!expired && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-border">
            <Button size="sm" onClick={() => onAccept(req.id)} className="flex-1" disabled={!!isFeedback} aria-label={`Accept request from ${req.clientName}`}>
              <Check size={13} /> Accept
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDecline(req.id)} className="flex-1" disabled={!!isFeedback} aria-label={`Decline request from ${req.clientName}`}>
              <X size={13} /> Decline
            </Button>
          </div>
        )}

        {expired && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted">
            <AlertTriangle size={11} className="text-amber-400" />
            Expired — patient forwarded to {REASSIGN_THERAPIST.name}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<SessionRequest[]>(MOCK_SESSION_REQUESTS);
  const [feedback, setFeedback] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null);

  function handleAction(id: string, action: 'accept' | 'decline') {
    setFeedback({ id, action });
    setTimeout(() => {
      setRequests(r => r.filter(req => req.id !== id));
      setFeedback(null);
    }, 700);
  }

  const active  = requests.filter(r => new Date(r.expiresAt) > new Date());
  const expired = requests.filter(r => new Date(r.expiresAt) <= new Date());

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Session Requests"
        subtitle={`${active.length} active · ${expired.length} expired`}
      />

      <AnimatePresence>
        {requests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <CheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-muted text-sm">All caught up! No pending requests.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {active.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Active ({active.length})</p>
                <div className="space-y-4">
                  {active.map(req => (
                    <RequestCard key={req.id} req={req} onAccept={id => handleAction(id, 'accept')} onDecline={id => handleAction(id, 'decline')} feedback={feedback} />
                  ))}
                </div>
              </div>
            )}
            {expired.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={11} /> Expired ({expired.length})
                </p>
                <div className="space-y-4">
                  {expired.map(req => (
                    <RequestCard key={req.id} req={req} onAccept={id => handleAction(id, 'accept')} onDecline={id => handleAction(id, 'decline')} feedback={feedback} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
