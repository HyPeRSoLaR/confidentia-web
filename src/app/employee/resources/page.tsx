'use client';
import { useState } from 'react';
import { Search, BookOpen, Play, Dumbbell, FileText, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_RESOURCES } from '@/lib/mock-data';
import type { ResourceCategory } from '@/types';

const CATEGORY_ICON: Record<ResourceCategory, typeof BookOpen> = {
  article:  BookOpen,
  video:    Play,
  exercise: Dumbbell,
  guide:    FileText,
};
const CATEGORY_COLOR: Record<ResourceCategory, string> = {
  article:  'text-violet bg-violet/10',
  video:    'text-cyan bg-cyan/10',
  exercise: 'text-emerald-400 bg-emerald-500/10',
  guide:    'text-amber-400 bg-amber-400/10',
};
const CATEGORIES: (ResourceCategory | 'all')[] = ['all', 'article', 'guide', 'exercise', 'video'];

export default function ResourcesPage() {
  const [search, setSearch]   = useState('');
  const [cat,    setCat]      = useState<ResourceCategory | 'all'>('all');

  const filtered = MOCK_RESOURCES.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !search || r.title.toLowerCase().includes(q) || r.tags.some(t => t.includes(q));
    const matchCat    = cat === 'all' || r.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Well-being Library" subtitle="Curated resources — articles, guides, exercises, and videos" />

      <div className="space-y-3 mb-6">
        <Input placeholder="Search resources…" value={search} onChange={e => setSearch(e.target.value)} icon={<Search size={14} />} />
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1 rounded-full text-xs border capitalize transition-all ${cat === c ? 'bg-violet text-white border-transparent shadow-brand' : 'border-border text-muted hover:text-text hover:border-violet/40'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No resources found. Try adjusting your search.</p>
        </div>
      ) : (
        <StaggerList className="space-y-3">
          {filtered.map(resource => {
            const Icon  = CATEGORY_ICON[resource.category];
            const color = CATEGORY_COLOR[resource.category];
            return (
              <StaggerItem key={resource.id}>
                <Card hover>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold text-text text-sm leading-snug">{resource.title}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-muted whitespace-nowrap flex-shrink-0">
                          <Clock size={10} />{resource.readingTimeMin} min
                        </div>
                      </div>
                      <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">{resource.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags.map(t => <Badge key={t} size="sm">#{t}</Badge>)}
                      </div>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      )}
    </div>
  );
}
