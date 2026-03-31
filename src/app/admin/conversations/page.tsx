'use client';
import { useState } from 'react';
import { Flag, Trash2, MessageSquare, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_CONVERSATIONS } from '@/lib/mock-data';
import { formatDateTime, truncate } from '@/lib/utils';
import type { Conversation } from '@/types';

const MODE_VARIANT = { text: 'default', audio: 'info', video: 'brand' } as const;

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  function remove(id: string) { setConversations(c => c.filter(x => x.id !== id)); }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Conversation Monitor" subtitle="Platform-wide conversation moderation" />

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400 mb-5">
        ⚠️ Admin access only. All moderation actions are logged for audit purposes.
      </div>

      <StaggerList className="space-y-4">
        {conversations.map(conv => (
          <StaggerItem key={conv.id}>
            <Card>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-violet" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-muted font-mono">#{conv.id}</span>
                    <Badge variant={MODE_VARIANT[conv.mode]} size="sm" className="capitalize">{conv.mode}</Badge>
                    <span className="text-xs text-muted ml-auto">{formatDateTime(conv.createdAt)}</span>
                  </div>
                  {conv.summary && (
                    <p className="text-sm text-text/80 leading-relaxed mb-2">{truncate(conv.summary, 120)}</p>
                  )}
                  {conv.themes && conv.themes.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {conv.themes.map(t => <Badge key={t} size="sm">{t}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button variant="ghost" size="sm"><Eye size={13}/> View</Button>
                <Button variant="ghost" size="sm"><Flag size={13}/> Flag</Button>
                <Button variant="danger" size="sm" className="ml-auto" onClick={() => remove(conv.id)}><Trash2 size={13}/> Delete</Button>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
