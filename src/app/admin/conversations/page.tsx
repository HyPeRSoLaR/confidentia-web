'use client';
import { EyeOff, MessageSquare, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_CONVERSATIONS } from '@/lib/mock-data';

export default function AdminConversationsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Conversation Metadata"
        subtitle="Admin view — content is never accessible. Metadata only."
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted border border-border bg-surface rounded-full px-3 py-1.5">
            <EyeOff size={12} className="text-violet" />
            Content encrypted &amp; inaccessible
          </div>
        }
      />

      {/* GDPR compliance banner */}
      <div className="mb-6 p-4 bg-violet/5 border border-violet/20 rounded-2xl flex items-start gap-3">
        <EyeOff size={16} className="text-violet flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-text mb-1">GDPR/CCPA Compliant — Metadata Only</p>
          <p className="text-xs text-muted leading-relaxed">
            Confidentia admins cannot access conversation content. This view shows only anonymized metadata for platform health monitoring.
            All conversation content is end-to-end encrypted and tied to the user's personal key.
          </p>
        </div>
      </div>

      {/* Aggregate stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Conversations', value: MOCK_CONVERSATIONS.length.toString(), icon: MessageSquare, color: 'text-violet' },
          { label: 'Active Users',        value: '5',                                  icon: Users,          color: 'text-cyan' },
          { label: 'This Week',           value: '8',                                  icon: Calendar,       color: 'text-emerald-400' },
          { label: 'Avg Sessions/User',   value: '3.2',                                icon: TrendingUp,     color: 'text-amber-400' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <Icon size={16} className={`${stat.color} mb-2`} />
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted mt-0.5 leading-tight">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Metadata table */}
      <Card>
        <h3 className="font-semibold text-text text-sm mb-4">Session Log (Metadata Only)</h3>
        <StaggerList className="space-y-3">
          {MOCK_CONVERSATIONS.map(conv => (
            <StaggerItem key={conv.id}>
              <div className="flex items-start gap-3 p-3 bg-bg rounded-xl border border-border">
                <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={13} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {/* PII masked — show only anonymized ID */}
                    <span className="text-xs font-mono text-muted">user_{conv.userId.slice(-4)}</span>
                    <Badge variant="info" size="sm">{conv.mode}</Badge>
                    <span className="text-[10px] text-muted ml-auto">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Themes only — no content */}
                  <div className="flex flex-wrap gap-1">
                    {conv.themes?.map(t => <Badge key={t} size="sm">#{t}</Badge>)}
                  </div>
                  <p className="text-[10px] text-muted/50 mt-1 italic">Message content: [encrypted, not accessible]</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </Card>
    </div>
  );
}
