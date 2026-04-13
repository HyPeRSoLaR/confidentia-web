'use client';
/**
 * app/hr/distress/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * HR Support Requests — real-time view of employee distress requests.
 * Combines seed mock data with live requests submitted from DistressRequestModal
 * (persisted in localStorage). HR can acknowledge, progress, or resolve each.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Clock, AlertTriangle, CheckCircle2, RefreshCw,
  Mail, ChevronDown, ChevronUp, Inbox,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_DISTRESS_REQUESTS } from '@/lib/mock-data';
import { getLocalDistressRequests, updateDistressRequest } from '@/lib/distress-store';
import { timeAgo } from '@/lib/utils';
import type { DistressRequest } from '@/types';

// ─── Category meta ─────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  wellbeing: { emoji: '😔', label: 'Mental health support', color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  time_off:  { emoji: '🏖',  label: 'Time off request',      color: 'text-violet',     bg: 'bg-violet/10'     },
  speak_hr:  { emoji: '💬', label: 'Speak with HR',          color: 'text-cyan',       bg: 'bg-cyan/10'       },
  overload:  { emoji: '⚡',  label: 'Work overload',          color: 'text-amber-400',  bg: 'bg-amber-400/10'  },
  urgent:    { emoji: '🚨', label: 'Urgent support',          color: 'text-red-400',    bg: 'bg-red-400/10'    },
  other:     { emoji: '✍️', label: 'Other',                   color: 'text-muted',      bg: 'bg-surface'       },
};

const STATUS_META = {
  pending:     { label: 'Pending',     color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-cyan',      bg: 'bg-cyan/10',      icon: RefreshCw },
  resolved:    { label: 'Resolved',    color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: CheckCircle2 },
};

// ─── Request card ─────────────────────────────────────────────────────────────

function RequestCard({ request, onUpdate }: { request: DistressRequest; onUpdate: () => void }) {
  const [expanded, setExpanded] = useState(!request.acknowledged);
  const cat    = CATEGORY_META[request.category] ?? CATEGORY_META.other;
  const status = STATUS_META[request.status];
  const StatusIcon = status.icon;

  function handleAcknowledge() {
    updateDistressRequest(request.id, { acknowledged: true, status: 'in_progress' });
    onUpdate();
  }

  function handleResolve() {
    updateDistressRequest(request.id, { status: 'resolved', acknowledged: true });
    onUpdate();
  }

  const isLive = request.id.startsWith('dr-'); // localStorage-sourced

  return (
    <motion.div layout>
      <Card className={`transition-all duration-200 ${request.status === 'resolved' ? 'opacity-50' : ''}`}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Category icon */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl ${cat.bg}`}>
            {cat.emoji}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-semibold text-text text-sm">{request.employeeName}</span>
              {isLive && (
                <span className="text-[9px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 border border-emerald-400/30">
                  LIVE
                </span>
              )}
              {!request.acknowledged && (
                <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              )}
            </div>
            <p className={`text-xs font-medium ${cat.color}`}>{cat.label}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-muted">{timeAgo(request.submittedAt)}</span>
              <span className="text-muted/30">·</span>
              <span className="text-[10px] text-muted">{request.employeeEmail}</span>
            </div>
          </div>

          {/* Status + expand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}>
              <StatusIcon size={10} />
              {status.label}
            </div>
            <button
              onClick={() => setExpanded(e => !e)}
              className="w-7 h-7 rounded-lg bg-surface border border-border flex items-center justify-center text-muted hover:text-text transition-colors"
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-border space-y-3">

                {/* Employee note */}
                {request.note ? (
                  <div className="bg-panel rounded-xl p-3">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-1.5">Employee's note</p>
                    <p className="text-sm text-text leading-relaxed italic">"{request.note}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted italic">No note provided — the employee preferred not to add details.</p>
                )}

                {/* Actions */}
                {request.status !== 'resolved' && (
                  <div className="flex gap-2 pt-1">
                    <a
                      href={`mailto:${request.employeeEmail}?subject=Re: Your support request&body=Hi ${request.employeeName},%0D%0A%0D%0AThank you for reaching out. I'd like to connect with you to discuss your situation.%0D%0A%0D%0ABest,%0D%0AHR Team`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet/10 text-violet hover:bg-violet/20 transition-colors"
                    >
                      <Mail size={12} />
                      Reply by email
                    </a>

                    {!request.acknowledged && (
                      <Button size="sm" variant="secondary" onClick={handleAcknowledge} className="rounded-xl text-xs">
                        <RefreshCw size={11} className="mr-1" />
                        Mark in progress
                      </Button>
                    )}

                    {request.status !== 'resolved' && (
                      <Button size="sm" onClick={handleResolve} className="rounded-xl text-xs bg-emerald-500/90 hover:bg-emerald-500 text-white border-0">
                        <CheckCircle2 size={11} className="mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HRDistressPage() {
  const [requests, setRequests] = useState<DistressRequest[]>([]);
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');

  const load = useCallback(() => {
    const live = getLocalDistressRequests();
    // Merge: live requests first, then seed mocks (avoid duplicates by id)
    const liveIds = new Set(live.map(r => r.id));
    const seed    = MOCK_DISTRESS_REQUESTS.filter(r => !liveIds.has(r.id));
    setRequests([...live, ...seed]);
  }, []);

  useEffect(() => {
    load();
    // Poll every 3s so HR tab stays fresh when employee submits in another tab
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered   = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCnt = requests.filter(r => r.status === 'pending' && !r.acknowledged).length;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Support Requests"
        subtitle="Employee distress requests — respond within 24h"
        actions={
          pendingCnt > 0 ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
              <Heart size={11} className="fill-red-400" />
              {pendingCnt} new request{pendingCnt > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="text-xs text-muted">All up to date ✓</span>
          )
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'pending', 'in_progress', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              filter === f
                ? 'bg-violet/15 text-violet border border-violet/30'
                : 'text-muted hover:text-text border border-transparent'
            }`}
          >
            {f === 'in_progress' ? 'In progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && requests.length > 0 && (
              <span className="ml-1.5 text-[10px] opacity-60">{requests.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <Inbox size={22} className="text-muted" />
          </div>
          <p className="font-semibold text-text mb-1">No requests</p>
          <p className="text-xs text-muted">
            {filter === 'all'
              ? 'No support requests have been submitted yet.'
              : `No ${filter.replace('_', ' ')} requests.`}
          </p>
        </motion.div>
      )}

      {/* List */}
      <StaggerList className="space-y-3">
        {filtered.map(req => (
          <StaggerItem key={req.id}>
            <RequestCard request={req} onUpdate={load} />
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Privacy notice */}
      {requests.length > 0 && (
        <p className="text-[10px] text-muted text-center mt-8 leading-relaxed">
          🔒 Requests are submitted voluntarily with explicit employee consent. Data is stored locally for this demo session.
        </p>
      )}
    </div>
  );
}
