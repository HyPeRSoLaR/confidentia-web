'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';
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

  function handleAction(id: string, _action: 'accept' | 'decline') {
    setRequests(r => r.filter(req => req.id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Session Requests" subtitle={`${requests.length} pending`} />

      <AnimatePresence>
        {requests.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Check size={40} className="mx-auto text-emerald-400 mb-3" />
            <p className="text-muted text-sm">All caught up!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Card>
                  <div className="flex items-start gap-4">
                    <Avatar name={req.clientName} size="md" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-text text-sm">{req.clientName}</span>
                        <Badge variant={URGENCY_VARIANT[req.urgency]} size="sm">{req.urgency} urgency</Badge>
                        <span className="text-xs text-muted ml-auto">{timeAgo(req.requestedAt)}</span>
                      </div>
                      <p className="text-xs text-muted mb-2">Topic: <span className="text-text">{req.topic}</span></p>
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock size={11} />
                        Preferred: {formatDateTime(req.preferredDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                    <Button size="sm" onClick={() => handleAction(req.id, 'accept')} className="flex-1">
                      <Check size={13} /> Accept
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleAction(req.id, 'decline')} className="flex-1">
                      <X size={13} /> Decline
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
