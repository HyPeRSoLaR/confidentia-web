'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { MOCK_JOURNAL_ENTRIES } from '@/lib/mock-data';
import { formatDate, EMOTION_EMOJI, EMOTION_COLORS } from '@/lib/utils';
import type { JournalEntry, EmotionLabel } from '@/types';

const EMOTIONS: EmotionLabel[] = ['calm','happy','anxious','stressed','angry','sad','energized','neutral'];

const EMOTION_FR: Record<EmotionLabel, string> = {
  calm:      'Calme',
  happy:     'Joyeux·se',
  anxious:   'Anxieux·se',
  stressed:  'Stressé·e',
  angry:     'En colère',
  sad:       'Triste',
  energized: 'Dynamisé·e',
  neutral:   'Neutre',
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_JOURNAL_ENTRIES);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<EmotionLabel | undefined>();
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  function addTag() {
    if (tag.trim() && !tags.includes(tag.trim())) { setTags(t => [...t, tag.trim()]); setTag(''); }
  }
  function removeTag(t: string) { setTags(ts => ts.filter(x => x !== t)); }

  function saveEntry() {
    if (!title.trim() || !body.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(), userId: 'demo-consumer',
      title, body, tags, mood,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setEntries(e => [entry, ...e]);
    setOpen(false); setTitle(''); setBody(''); setMood(undefined); setTags([]);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Journal"
        subtitle={`${entries.length} entrée${entries.length > 1 ? 's' : ''}`}
        actions={<Button size="sm" onClick={() => setOpen(true)}><Plus size={14}/>Nouvelle entrée</Button>}
      />

      <StaggerList className="space-y-4">
        {entries.map(entry => (
          <StaggerItem key={entry.id}>
            <Card hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {entry.mood && (
                      <span className="text-lg" title={EMOTION_FR[entry.mood] ?? entry.mood}>{EMOTION_EMOJI[entry.mood]}</span>
                    )}
                    <h3 className="font-semibold text-text">{entry.title}</h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2">{entry.body}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {entry.tags.map(t => <Badge key={t}>{t}</Badge>)}
                    <span className="text-xs text-muted ml-auto">{formatDate(entry.createdAt)}</span>
                  </div>
                </div>
                <BookOpen size={16} className="text-muted flex-shrink-0 mt-1" />
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerList>

      <Modal open={open} onClose={() => setOpen(false)} title="Nouvelle entrée de journal" size="md">
        <div className="space-y-4">
          <Input label="Titre" placeholder="Qu'avez-vous en tête ?" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea label="Écrivez librement…" rows={6} placeholder="C'est un espace sûr. Personne d'autre que vous ne lira ceci." value={body} onChange={e => setBody(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-muted mb-2">Humeur</p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(em => (
                <button
                  key={em}
                  onClick={() => setMood(m => m === em ? undefined : em)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                    mood === em
                      ? 'border-transparent text-white'
                      : 'border-border text-muted hover:border-violet/40'
                  }`}
                  style={mood === em ? { background: EMOTION_COLORS[em] } : {}}
                >
                  {EMOTION_EMOJI[em]} {EMOTION_FR[em]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-2">Étiquettes</p>
            <div className="flex gap-2">
              <Input placeholder="Ajouter une étiquette…" value={tag} onChange={e => setTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} icon={<Tag size={14}/>} />
              <Button variant="secondary" size="sm" onClick={addTag}>Ajouter</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-violet/10 text-violet rounded-full px-2.5 py-1 text-xs">
                    {t}<button onClick={() => removeTag(t)}><X size={10}/></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <Button fullWidth onClick={saveEntry}>Enregistrer</Button>
        </div>
      </Modal>
    </div>
  );
}
