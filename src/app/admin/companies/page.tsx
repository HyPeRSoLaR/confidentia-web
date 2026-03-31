'use client';
import { Building2, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_COMPANIES, MOCK_PLANS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

const STATUS_ICON = { active: CheckCircle, trial: Clock, suspended: XCircle };
const STATUS_COLOR = { active: 'text-emerald-400', trial: 'text-amber-400', suspended: 'text-red-400' };
const STATUS_VARIANT = { active: 'success', trial: 'warning', suspended: 'danger' } as const;

export default function AdminCompaniesPage() {
  const planName = (id: string) => MOCK_PLANS.find(p => p.id === id)?.name ?? 'Unknown';

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Company Management" subtitle={`${MOCK_COMPANIES.length} registered companies`} />

      <StaggerList className="space-y-4">
        {MOCK_COMPANIES.map(co => {
          const StatusIcon = STATUS_ICON[co.status];
          return (
            <StaggerItem key={co.id}>
              <Card hover>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-violet/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={20} className="text-violet" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-text">{co.name}</h3>
                      <Badge variant={STATUS_VARIANT[co.status]} size="sm" className="capitalize">{co.status}</Badge>
                      <Badge variant="default" size="sm">{planName(co.planId)}</Badge>
                    </div>
                    <p className="text-xs text-muted mb-3">{co.domain} · since {formatDate(co.createdAt)}</p>
                    <div className="flex items-center gap-5">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-muted" />
                        <span className="text-xs text-text">{co.activeEmployees}</span>
                        <span className="text-xs text-muted">/ {co.seatCount} seats</span>
                      </div>
                      {/* Seat usage bar */}
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className="h-full bg-brand rounded-full transition-all"
                          style={{ width: `${(co.activeEmployees / co.seatCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <StatusIcon size={16} className={STATUS_COLOR[co.status] + ' flex-shrink-0 mt-1'} />
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>
    </div>
  );
}
