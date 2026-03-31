'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Play, Dumbbell, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_RESOURCES } from '@/lib/mock-data';
import type { ResourceCategory } from '@/types';

const CATEGORY_ICONS: Record<ResourceCategory, React.ElementType> = {
  article: BookOpen, video: Play, exercise: Dumbbell, guide: FileText,
};
const CATEGORY_COLORS: Record<ResourceCategory, string> = {
  article: 'info', video: 'brand', exercise: 'success', guide: 'warning',
} as Record<ResourceCategory, never>;

const ALL_CATEGORIES: ResourceCategory[] = ['article', 'video', 'exercise', 'guide'];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ResourceCategory | 'all'>('all');

  const filtered = MOCK_RESOURCES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Well-being Resources" subtitle="Curated content to support your mental health" />

      <div className="space-y-4 mb-6">
        <Input
          placeholder="Search resources…"
          value={search} onChange={e => setSearch(e.target.value)}
          icon={<Search size={16} />}
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', ...ALL_CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 capitalize ${
                activeCategory === cat
                  ? 'bg-brand text-white border-transparent shadow-brand'
                  : 'border-border text-muted hover:border-violet/40 hover:text-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(resource => {
          const Icon = CATEGORY_ICONS[resource.category];
          return (
            <StaggerItem key={resource.id}>
              <Card hover className="flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-violet" />
                  </div>
                  <Badge variant={CATEGORY_COLORS[resource.category] as never} size="sm" className="flex-shrink-0 capitalize">
                    {resource.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-text mb-1.5 text-sm leading-snug">{resource.title}</h3>
                <p className="text-xs text-muted leading-relaxed flex-1">{resource.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <div className="flex gap-1.5 flex-wrap">
                    {resource.tags.slice(0, 2).map(t => <Badge key={t} size="sm">{t}</Badge>)}
                  </div>
                  <span className="text-xs text-muted">{resource.readingTimeMin} min</span>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerList>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted">
          <Search size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No resources found for "{search}"</p>
        </motion.div>
      )}
    </div>
  );
}
