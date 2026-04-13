'use client';
import { useState } from 'react';
import { Search, ShieldBan, ArrowUpCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_ALL_USERS } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { UserRole, User } from '@/types';

const ALL_ROLES: (UserRole | 'all')[] = ['all','consumer','employee','hr','therapist','admin'];
const ROLE_VARIANT: Record<UserRole, string> = {
  consumer: 'info', employee: 'default', hr: 'warning', therapist: 'success', admin: 'danger',
};
const ROLE_FR: Record<UserRole | 'all', string> = {
  all:       'Tous',
  consumer:  'Particulier',
  employee:  'Employé',
  hr:        'RH',
  therapist: 'Thérapeute',
  admin:     'Admin',
};

export default function AdminUsersPage() {
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState<UserRole | 'all'>('all');
  const [users,       setUsers]       = useState<User[]>(MOCK_ALL_USERS);
  const [bannedIds,   setBannedIds]   = useState<string[]>([]);
  const [promotedIds, setPromotedIds] = useState<string[]>([]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (roleFilter === 'all' || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Gestion des utilisateurs" subtitle={`${users.length} utilisateur${users.length > 1 ? 's' : ''} au total`} />

      <div className="space-y-3 mb-5">
        <Input placeholder="Rechercher par nom ou e-mail…" value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={15}/>} />
        <div className="flex gap-2 flex-wrap">
          {ALL_ROLES.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                roleFilter === r ? 'bg-brand text-white border-transparent' : 'border-border text-muted hover:border-violet/40 hover:text-text'
              }`}
            >{ROLE_FR[r]}</button>
          ))}
        </div>
      </div>

      <StaggerList className="space-y-2">
        {filtered.map(user => (
          <StaggerItem key={user.id}>
            <Card className="py-3">
              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>
                <Badge variant={ROLE_VARIANT[user.role] as never} size="sm" className="flex-shrink-0">{ROLE_FR[user.role]}</Badge>
                <span className="text-xs text-muted hidden sm:block flex-shrink-0">{formatDate(user.createdAt)}</span>
                <div className="flex gap-1">
                  <Button
                    variant={promotedIds.includes(user.id) ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setPromotedIds(ids => ids.includes(user.id) ? ids.filter(i => i !== user.id) : [...ids, user.id])}
                    aria-label={`Promouvoir ${user.name} en admin`}
                    title={promotedIds.includes(user.id) ? 'Annuler la promotion' : 'Promouvoir en Admin'}
                  >
                    <ArrowUpCircle size={14} className={promotedIds.includes(user.id) ? 'text-violet' : ''}/>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setBannedIds(ids => ids.includes(user.id) ? ids.filter(i => i !== user.id) : [...ids, user.id])}
                    aria-label={`${bannedIds.includes(user.id) ? 'Débannir' : 'Bannir'} ${user.name}`}
                    title={bannedIds.includes(user.id) ? 'Débannir' : 'Bannir l\'utilisateur'}
                    className={bannedIds.includes(user.id) ? 'opacity-60' : ''}
                  >
                    <ShieldBan size={14}/>
                  </Button>
                </div>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted text-sm">Aucun utilisateur trouvé.</div>
      )}
    </div>
  );
}
