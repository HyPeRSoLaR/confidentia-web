'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { MOCK_SESSION_REQUESTS } from '@/lib/mock-data';
import { formatDateTime, timeAgo } from '@/lib/utils';
import type { SessionRequest } from '@/types';

const URGENCY_VARIANT = { low: 'default', medium: 'warning', high: 'danger' } as const;

export default function RequestsPage() {
  const [requests, setRequests] = useState<SessionRequest[]>(MOCK_SESSION_REQUESTS);
  const [feedback, setFeedback] = useState<{ id: string; action: 'accept' | 'decline' } | null>(null);

  function handleAction(id: string, action: 'accept' | 'decline') {
    // Show brief feedback before removing
    setFeedback({ id, action });
    setTimeout(() => {
      setRequests(r => r.filter(req => req.id !== id));
      setFeedback(null);
    }, 700);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Session Requests" subtitle={`${requests.length} pending`} />

      <AnimatePresence>
        {requests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <CheckCircle size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-muted text-sm">All caught up! No pending requests.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => {
              const isFeedback = feedback?.id === req.id;
              return (
                <motion.div
                  key={req.id}
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
                  <Card className={isFeedback ? (feedback.action === 'accept' ? 'border-emerald-500/40' : 'border-red-400/40') : ''}>
                    {/* Feedback overlay */}
                    {isFeedback && (
                      <div className={`absolute inset-0 rounded-2xl flex items-center justify-center z-10 ${
                        feedback.action === 'accept' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                      }`}>
                        {feedback.action === 'accept'
                          ? <CheckCircle size={32} className="text-emerald-400" />
                          : <XCircle size={32} className="text-red-400" />
                        }
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
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Clock size={11} />
                          Preferred: {formatDateTime(req.preferredDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        onClick={() => handleAction(req.id, 'accept')}
                        className="flex-1"
                        aria-label={`Accept session request from ${req.clientName}`}
                        disabled={!!isFeedback}
                      >
                        <Check size={13} /> Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleAction(req.id, 'decline')}
                        className="flex-1"
                        aria-label={`Decline session request from ${req.clientName}`}
                        disabled={!!isFeedback}
                      >
                        <X size={13} /> Decline
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
