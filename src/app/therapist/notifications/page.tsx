'use client';
/**
 * app/therapist/notifications/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Therapist notification feed with push/email settings toggle.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellOff, Mail, Smartphone, Check,
  Inbox, Clock, AlertTriangle, Info, Settings,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_THERAPIST_NOTIFICATIONS } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import type { TherapistNotification, NotificationType } from '@/types';

const TYPE_META: Record<NotificationType, { icon: React.ElementType; color: string; label: string }> = {
  new_request:      { icon: Inbox,         color: 'text-violet  bg-violet/10',   label: 'New Request' },
  session_reminder: { icon: Clock,         color: 'text-cyan    bg-cyan/10',     label: 'Reminder' },
  request_expired:  { icon: AlertTriangle, color: 'text-amber-400 bg-amber-400/10', label: 'Expired' },
  system:           { icon: Info,          color: 'text-muted   bg-border',      label: 'System' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<TherapistNotification[]>(MOCK_THERAPIST_NOTIFICATIONS);
  const [pushEnabled,   setPushEnabled]   = useState(true);
  const [emailEnabled,  setEmailEnabled]  = useState(true);

  const unread = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : 'All caught up'}
        actions={
          unread > 0
            ? <button onClick={markAllRead} className="text-xs text-violet hover:underline flex items-center gap-1"><Check size={12} /> Mark all read</button>
            : null
        }
      />

      <div className="grid gap-6">

        {/* ── Notification settings card ── */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Settings size={14} className="text-muted" />
            <h2 className="text-sm font-semibold text-text">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {/* Push */}
            <div className="flex items-center justify-between p-3 bg-panel rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet/10 flex items-center justify-center">
                  <Smartphone size={14} className="text-violet" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Push notifications</p>
                  <p className="text-xs text-muted">Instant alerts on your device</p>
                </div>
              </div>
              <button
                onClick={() => setPushEnabled(e => !e)}
                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative flex-shrink-0 ${pushEnabled ? 'bg-brand' : 'bg-border'}`}
                style={{ height: 22, width: 40 }}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${pushEnabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-panel rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan/10 flex items-center justify-center">
                  <Mail size={14} className="text-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text">Email notifications</p>
                  <p className="text-xs text-muted">Sent to your registered address</p>
                </div>
              </div>
              <button
                onClick={() => setEmailEnabled(e => !e)}
                className={`relative flex-shrink-0 transition-all duration-200 rounded-full ${emailEnabled ? 'bg-brand' : 'bg-border'}`}
                style={{ height: 22, width: 40 }}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${emailEnabled ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            {!pushEnabled && !emailEnabled && (
              <div className="flex items-center gap-2 p-3 bg-amber-400/5 border border-amber-400/20 rounded-xl text-xs text-amber-400">
                <BellOff size={13} />
                All notifications are off. You may miss important session requests.
              </div>
            )}
          </div>
        </Card>

        {/* ── Feed ── */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Recent</p>
          <AnimatePresence>
            {notifications.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Bell size={32} className="mx-auto text-muted mb-3" />
                <p className="text-sm text-muted">No notifications yet.</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => {
                  const meta = TYPE_META[notif.type];
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => markRead(notif.id)}
                      className={`flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                        notif.read
                          ? 'border-border bg-surface opacity-60 hover:opacity-80'
                          : 'border-border bg-surface hover:border-violet/30 ring-1 ring-violet/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-text truncate">{notif.title}</span>
                          {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-violet flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{notif.body}</p>
                        <p className="text-[10px] text-muted/60 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                      <Badge variant="default" size="sm">{meta.label}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
