'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Database, 
  Trash2, 
  Pin, 
  Settings, 
  Bell, 
  Globe, 
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/session';
import { MOCK_ALL_USERS } from '@/lib/mock-data';

export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_ALL_USERS[0]); // Default to Alex Rivera
  const [memoryEnabled, setMemoryEnabled] = useState(user.memoryEnabled);
  const [retentionDays, setRetentionDays] = useState(user.memoryRetentionDays || 30);
  const [saving, setSaving] = useState(false);

  // Mock pinned memories for UI demonstration
  const pinnedMemories = [
    { id: 'p1', content: "User mentioned a fear of public speaking linked to a childhood event.", date: '2 days ago' },
    { id: 'p2', content: "User prefers grounding techniques involving deep breathing over cognitive reframing.", date: '1 week ago' },
  ];

  async function saveSettings() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      <PageHeader 
        title="Account & Privacy" 
        subtitle="Manage your identity and the sacred boundaries of your data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Settings Categories */}
        <div className="space-y-2">
          {['Personal Info', 'Security', 'Memory Engine', 'Notifications', 'Subscription'].map((item, i) => (
            <button 
              key={item}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                i === 2 ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text hover:bg-surface'
              }`}
            >
              <span>{item}</span>
              <ChevronRight size={14} className={i === 2 ? 'text-white/70' : 'text-muted'} />
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Memory Engine Card (Pillar 3) */}
          <section className="bg-surface border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet/10 text-violet">
                <Database size={20} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-text">Memory Engine</h2>
                <p className="text-sm text-muted">Control how much the AI remembers about you.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-bg rounded-2xl border border-border">
                <div>
                  <h4 className="font-medium text-text">Enable AI Contextual Memory</h4>
                  <p className="text-xs text-muted max-w-[240px]">The AI will use past conversations to provide personalized support.</p>
                </div>
                <button 
                  onClick={() => setMemoryEnabled(!memoryEnabled)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${memoryEnabled ? 'bg-brand' : 'bg-muted/30'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${memoryEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 bg-bg rounded-2xl border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-text">Memory Retention</h4>
                  <span className="text-xs font-bold text-brand uppercase">{retentionDays} Days</span>
                </div>
                <input 
                  type="range" min="7" max="365" step="7" 
                  value={retentionDays} 
                  onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface border border-border rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                  <Info size={12} /> After this period, AI-stored context is automatically purged.
                </p>
              </div>

              {/* Pinned Memories */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-muted uppercase tracking-wider px-1">Pinned Memories</h4>
                <div className="space-y-2">
                  {pinnedMemories.map(mem => (
                    <div key={mem.id} className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group">
                      <Pin size={14} className="text-brand shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-text leading-relaxed">{mem.content}</p>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{mem.date}</span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-danger transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted italic px-1">Pinned memories are never purged by retention rules.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <Button onClick={saveSettings} loading={saving} className="flex-1 rounded-xl h-12 shadow-brand">
                  Save Changes
                </Button>
                <Button className="rounded-xl h-12 px-6 bg-red-500/10 text-red-500 border-0 hover:bg-red-500 hover:text-white transition-all shadow-none">
                  <Trash2 size={16} className="mr-2" /> Wipe All Memory
                </Button>
              </div>
            </div>
          </section>

          {/* Security & Access */}
          <section className="bg-surface border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand/10 text-brand">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-text">Security</h2>
                <p className="text-sm text-muted">Manage your credentials and login sessions.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button className="p-4 bg-bg rounded-2xl border border-border text-left hover:border-brand transition-all">
                <p className="text-xs text-muted mb-1">Email Address</p>
                <p className="text-sm font-medium text-text">{user.email}</p>
              </button>
              <button className="p-4 bg-bg rounded-2xl border border-border text-left hover:border-brand transition-all">
                <p className="text-xs text-muted mb-1">Password</p>
                <p className="text-sm font-medium text-text">••••••••••••</p>
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
