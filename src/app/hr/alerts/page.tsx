'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SeverityBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_ORG_ALERTS } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';
import type { OrgAlert } from '@/types';

export default function HRAlertsPage() {
  const [alerts, setAlerts] = useState<OrgAlert[]>(MOCK_ORG_ALERTS);

  function acknowledge(id: string) {
    setAlerts(a => a.map(al => al.id === id ? { ...al, acknowledged: true } : al));
  }

  const unread = alerts.filter(a => !a.acknowledged);
  const read   = alerts.filter(a => a.acknowledged);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Alerts"
        subtitle="Anonymized organizational well-being alerts"
        actions={<span className="text-xs text-muted">{unread.length} unread</span>}
      />

      <StaggerList className="space-y-3">
        {[...unread, ...read].map(alert => (
          <StaggerItem key={alert.id}>
            <motion.div layout>
              <Card className={alert.acknowledged ? 'opacity-60' : ''}>
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    alert.severity === 'critical' ? 'bg-red-500/10' :
                    alert.severity === 'warning'  ? 'bg-amber-500/10' : 'bg-cyan/10'
                  }`}>
                    <Bell size={14} className={
                      alert.severity === 'critical' ? 'text-red-400' :
                      alert.severity === 'warning'  ? 'text-amber-400' : 'text-cyan'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-xs text-muted">{timeAgo(alert.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-text text-sm mb-1">{alert.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{alert.description}</p>
                  </div>
                  {!alert.acknowledged && (
                    <Button variant="ghost" size="sm" onClick={() => acknowledge(alert.id)}>
                      <CheckCheck size={14} />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
