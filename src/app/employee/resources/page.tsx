'use client';
import { useState } from 'react';
import {
  Search, BookOpen, Play, Dumbbell, FileText,
  Clock, Zap, ChevronDown, ChevronUp, ExternalLink, Star,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_RESOURCES } from '@/lib/mock-data';
import type { ResourceCategory, ResourceDifficulty } from '@/types';

// ─── Config ───────────────────────────────────────────────────────────────────

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

const DIFFICULTY_COLOR: Record<ResourceDifficulty, string> = {
  beginner:     'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  intermediate: 'text-amber-400  bg-amber-400/10  border-amber-400/20',
  advanced:     'text-red-400    bg-red-400/10    border-red-400/20',
};

const CATEGORIES: (ResourceCategory | 'all')[] = ['all', 'article', 'guide', 'exercise', 'video'];

const QUICK_WIN_TAGS = ['quick-win'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState<ResourceCategory | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const featured   = MOCK_RESOURCES.filter(r => r.isFeatured);
  const quickWins  = MOCK_RESOURCES.filter(r => r.tags.some(t => QUICK_WIN_TAGS.includes(t)));

  const filtered = MOCK_RESOURCES.filter(r => {
    if (r.isFeatured) return false; // featured shown separately
    const q = search.toLowerCase();
    const matchSearch = !search
      || r.title.toLowerCase().includes(q)
      || r.description.toLowerCase().includes(q)
      || r.tags.some(t => t.includes(q));
    const matchCat = cat === 'all' || r.category === cat;
    return matchSearch && matchCat;
  });

  const toggle = (id: string) => setExpanded(p => p === id ? null : id);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Well-being Library"
        subtitle={`${MOCK_RESOURCES.length} curated resources — articles, guides, exercises, and videos`}
      />

      {/* ── Featured row ── */}
      {!search && cat === 'all' && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} className="text-amber-400" />
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">Featured this week</h2>
          </div>
          <div className="grid gap-3">
            {featured.map(r => (
              <FeaturedCard key={r.id} resource={r} expanded={expanded === r.id} onToggle={() => toggle(r.id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Quick Wins ── */}
      {!search && cat === 'all' && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={13} className="text-violet" />
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">Quick wins — under 5 min</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
            {quickWins.map(r => (
              <QuickWinCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      {/* ── Search & Filter ── */}
      <div className="space-y-3 mb-6">
        <Input
          placeholder="Search by topic, keyword, or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          icon={<Search size={14} />}
        />
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1 rounded-full text-xs border capitalize transition-all ${
                cat === c
                  ? 'bg-violet text-white border-transparent shadow-brand'
                  : 'border-border text-muted hover:text-text hover:border-violet/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Library list ── */}
      <section>
        {(search || cat !== 'all') && (
          <p className="text-xs text-muted mb-3">
            {filtered.length === 0 ? 'No results' : `${filtered.length} resource${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No resources matched. Try a different keyword or category.</p>
          </div>
        ) : (
          <StaggerList className="space-y-3">
            {filtered.map(resource => (
              <StaggerItem key={resource.id}>
                <ResourceCard
                  resource={resource}
                  expanded={expanded === resource.id}
                  onToggle={() => toggle(resource.id)}
                />
              </StaggerItem>
            ))}
          </StaggerList>
        )}
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturedCard({
  resource, expanded, onToggle,
}: { resource: (typeof MOCK_RESOURCES)[0]; expanded: boolean; onToggle: () => void }) {
  const Icon  = CATEGORY_ICON[resource.category];
  const color = CATEGORY_COLOR[resource.category];

  return (
    <Card hover className="border-violet/20 bg-gradient-to-r from-violet/5 to-transparent">
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-text text-sm leading-snug">{resource.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {resource.difficulty && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${DIFFICULTY_COLOR[resource.difficulty]}`}>
                  {resource.difficulty}
                </span>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted whitespace-nowrap">
                <Clock size={10} />{resource.readingTimeMin} min
              </div>
            </div>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed">{resource.description}</p>

          {/* Takeaways */}
          {resource.keyTakeaways && (
            <>
              {expanded && (
                <ul className="mt-3 space-y-1.5">
                  {resource.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text/80">
                      <span className="text-violet mt-0.5 flex-shrink-0">✦</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={onToggle}
                className="flex items-center gap-1 text-[10px] text-violet mt-2 hover:underline"
              >
                {expanded ? <><ChevronUp size={11} /> Hide takeaways</> : <><ChevronDown size={11} /> Key takeaways</>}
              </button>
            </>
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1">
              {resource.tags.map(t => <Badge key={t} size="sm">#{t}</Badge>)}
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-violet hover:underline"
            >
              Read <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

function QuickWinCard({ resource }: { resource: (typeof MOCK_RESOURCES)[0] }) {
  const Icon  = CATEGORY_ICON[resource.category];
  const color = CATEGORY_COLOR[resource.category];
  return (
    <div className="glass rounded-2xl p-4 flex-shrink-0 w-52 border border-border/40 hover:border-violet/30 transition-colors cursor-pointer group">
      <div className={`p-2 rounded-xl inline-flex mb-2 ${color}`}>
        <Icon size={14} />
      </div>
      <h4 className="text-xs font-semibold text-text leading-snug line-clamp-2 group-hover:text-violet transition-colors">{resource.title}</h4>
      <div className="flex items-center gap-1 text-[10px] text-muted mt-2">
        <Clock size={9} />{resource.readingTimeMin} min
      </div>
    </div>
  );
}

function ResourceCard({
  resource, expanded, onToggle,
}: { resource: (typeof MOCK_RESOURCES)[0]; expanded: boolean; onToggle: () => void }) {
  const Icon  = CATEGORY_ICON[resource.category];
  const color = CATEGORY_COLOR[resource.category];

  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${color}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-text text-sm leading-snug">{resource.title}</h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {resource.difficulty && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${DIFFICULTY_COLOR[resource.difficulty]}`}>
                  {resource.difficulty}
                </span>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted whitespace-nowrap">
                <Clock size={10} />{resource.readingTimeMin} min
              </div>
            </div>
          </div>
          <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">{resource.description}</p>

          {resource.keyTakeaways && (
            <>
              {expanded && (
                <ul className="mt-3 space-y-1.5">
                  {resource.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text/80">
                      <span className="text-violet mt-0.5 flex-shrink-0">✦</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={onToggle}
                className="flex items-center gap-1 text-[10px] text-violet mt-2 hover:underline"
              >
                {expanded ? <><ChevronUp size={11} /> Hide takeaways</> : <><ChevronDown size={11} /> Key takeaways</>}
              </button>
            </>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {resource.tags.map(t => <Badge key={t} size="sm">#{t}</Badge>)}
          </div>
        </div>
      </div>
    </Card>
  );
}
