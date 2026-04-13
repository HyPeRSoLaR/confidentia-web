'use client';
/**
 * app/hr/poles/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * HR Department Poles — create and manage organisational groups.
 * Each pole gets its own analytics, heatmap, and alerts.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Check, Users, BarChart2, Trash2,
  ChevronRight, Search, UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_POLES, MOCK_POLE_MEMBERS } from '@/lib/mock-data';
import type { Pole } from '@/types';

// ─── Preset colours for new poles ────────────────────────────────────────────
const PRESET_COLORS = ['#7C3AED', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];
const PRESET_EMOJIS = ['💼', '⚙️', '📦', '🔬', '🌍', '🎯', '📊', '🏗️', '💡', '🛡️'];

// Sample employees to add (in a real app, fetched from HR directory)
const SAMPLE_EMPLOYEES = [
  { id: 'u2', name: 'Jordan Kim',    email: 'jordan@techcorp.com' },
  { id: 'u5', name: 'Casey M.',      email: 'casey@demo.com' },
  { id: 'u6', name: 'Robin T.',      email: 'robin@startup.io' },
  { id: 'u9', name: 'Priya Sharma',  email: 'priya@techcorp.com' },
  { id: 'u10',name: 'Lucas Berger',  email: 'lucas@techcorp.com' },
  { id: 'u11',name: 'Fatima Ahmed',  email: 'fatima@techcorp.com' },
];

export default function PolesPage() {
  const [poles,         setPoles]        = useState<Pole[]>(MOCK_POLES);
  const [showCreate,    setShowCreate]   = useState(false);
  const [selectedPole,  setSelectedPole] = useState<Pole | null>(null);
  const [memberSearch,  setMemberSearch] = useState('');
  const [selectedEmp,   setSelectedEmp]  = useState<string[]>([]);

  // Create form state
  const [newName,  setNewName]  = useState('');
  const [newEmoji, setNewEmoji] = useState(PRESET_EMOJIS[0]);
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);

  function createPole() {
    if (!newName.trim()) return;
    const pole: Pole = {
      id:          `pole-${Date.now()}`,
      companyId:   'company-1',
      name:        newName.trim(),
      color:       newColor,
      emoji:       newEmoji,
      memberCount: selectedEmp.length,
      createdAt:   new Date().toISOString(),
      createdBy:   'u3',
    };
    setPoles(prev => [...prev, pole]);
    setShowCreate(false);
    setNewName('');
    setNewEmoji(PRESET_EMOJIS[0]);
    setNewColor(PRESET_COLORS[0]);
    setSelectedEmp([]);
  }

  function deletePole(id: string) {
    setPoles(prev => prev.filter(p => p.id !== id));
    if (selectedPole?.id === id) setSelectedPole(null);
  }

  const filteredEmployees = SAMPLE_EMPLOYEES.filter(e =>
    e.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    e.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const poleMembers = selectedPole
    ? MOCK_POLE_MEMBERS.filter(m => m.poleId === selectedPole.id)
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Department Poles"
        subtitle={`${poles.length} poles · Manage org groups with dedicated analytics`}
        actions={
          <Button onClick={() => setShowCreate(true)} size="sm" className="rounded-xl">
            <Plus size={14} /> New Pole
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Poles list ── */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {poles.map(pole => {
              const active = selectedPole?.id === pole.id;
              return (
                <motion.div
                  key={pole.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => setSelectedPole(active ? null : pole)}
                    className={`w-full text-left glass p-4 rounded-2xl transition-all duration-200 group ${
                      active ? 'ring-2 ring-offset-0' : 'hover:border-violet/30'
                    }`}
                    style={active ? { '--tw-ring-color': pole.color } as React.CSSProperties : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: pole.color + '20' }}
                      >
                        {pole.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text text-sm truncate">{pole.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Users size={10} className="text-muted" />
                          <span className="text-[11px] text-muted">{pole.memberCount} members</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => { e.stopPropagation(); deletePole(pole.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all"
                          title="Delete pole"
                        >
                          <Trash2 size={12} />
                        </button>
                        <ChevronRight size={14} className={`text-muted transition-transform ${active ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Color accent bar */}
                    <div className="mt-3 h-0.5 rounded-full" style={{ background: pole.color + '60' }} />
                  </button>
                </motion.div>
              );
            })}

            {poles.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <p className="text-muted text-sm">No poles yet. Create your first one.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Pole detail ── */}
        <div className="lg:col-span-3">
          {selectedPole ? (
            <motion.div
              key={selectedPole.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Header */}
              <Card>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: selectedPole.color + '20' }}
                  >
                    {selectedPole.emoji}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-text text-lg">{selectedPole.name}</h2>
                    <p className="text-xs text-muted">{selectedPole.memberCount} members · Created {new Date(selectedPole.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: 'Avg. Wellbeing', value: '6.4 / 10', color: 'text-emerald-400' },
                    { label: 'Check-in Rate', value: '78%',        color: 'text-cyan' },
                    { label: 'Active Alerts',  value: '1',          color: 'text-amber-400' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-panel rounded-xl p-3 text-center">
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-muted mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Members */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text text-sm">Members</h3>
                  <Badge variant="default">{poleMembers.length > 0 ? poleMembers.length : selectedPole.memberCount}</Badge>
                </div>

                {poleMembers.length === 0 ? (
                  <p className="text-xs text-muted text-center py-4">No member data for this pole yet.</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {poleMembers.map(member => (
                      <div key={member.userId} className="flex items-center gap-3 p-2.5 bg-panel rounded-xl">
                        <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">{member.userName[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-text truncate">{member.userName}</p>
                          <p className="text-[10px] text-muted truncate">{member.userEmail}</p>
                        </div>
                        <button className="text-muted hover:text-red-400 transition-colors p-1">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add member button */}
                <button className="flex items-center gap-2 w-full p-2.5 rounded-xl border border-dashed border-border text-muted hover:border-violet/40 hover:text-violet transition-all text-xs">
                  <UserPlus size={13} /> Add member
                </button>
              </Card>

              {/* Analytics CTA */}
              <div className="flex gap-3">
                <button className="flex-1 glass p-3 rounded-xl text-xs text-center text-muted hover:border-violet/30 hover:text-violet transition-all flex items-center justify-center gap-2">
                  <BarChart2 size={13} /> View Pole Analytics
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center glass rounded-2xl p-12">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-3">
                  <Users size={20} className="text-muted" />
                </div>
                <p className="text-sm text-muted">Select a pole to view its members and analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Create Pole Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="relative w-full max-w-md bg-surface border border-border rounded-3xl p-6 shadow-brand z-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-text">Create a new pole</h2>
                <button onClick={() => setShowCreate(false)} className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Pole name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value.slice(0, 32))}
                    placeholder="e.g. Commercial, Tech & Engineering…"
                    className="w-full bg-panel border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none focus:border-violet/50 transition-colors"
                  />
                </div>

                {/* Emoji */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_EMOJIS.map(em => (
                      <button
                        key={em}
                        onClick={() => setNewEmoji(em)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${newEmoji === em ? 'ring-2 ring-violet bg-violet/10' : 'bg-panel hover:bg-border/50'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Colour</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewColor(c)}
                        className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                        style={{ background: c, outline: newColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Add members */}
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1.5">Add members</label>
                  <div className="relative mb-2">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={e => setMemberSearch(e.target.value)}
                      placeholder="Search employees…"
                      className="w-full bg-panel border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-text placeholder:text-muted/50 outline-none focus:border-violet/50"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                    {filteredEmployees.map(emp => {
                      const checked = selectedEmp.includes(emp.id);
                      return (
                        <button
                          key={emp.id}
                          onClick={() => setSelectedEmp(prev => checked ? prev.filter(id => id !== emp.id) : [...prev, emp.id])}
                          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-panel text-left transition-colors"
                        >
                          <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${checked ? 'bg-violet border-violet' : 'border-border'}`}>
                            {checked && <Check size={9} className="text-white" strokeWidth={3} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text truncate">{emp.name}</p>
                            <p className="text-[10px] text-muted truncate">{emp.email}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {selectedEmp.length > 0 && (
                    <p className="text-[10px] text-violet mt-1">{selectedEmp.length} members selected</p>
                  )}
                </div>

                {/* Preview */}
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: newColor + '15', border: `1px solid ${newColor}30` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: newColor + '25' }}>{newEmoji}</div>
                  <div>
                    <p className="font-semibold text-text text-sm">{newName || 'Pole name'}</p>
                    <p className="text-[10px] text-muted">{selectedEmp.length} members</p>
                  </div>
                </div>

                <Button onClick={createPole} disabled={!newName.trim()} className="w-full rounded-2xl py-3 shadow-brand">
                  Create Pole
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
