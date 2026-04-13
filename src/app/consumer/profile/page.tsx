'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Trash2, Download, Save, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { StaggerList, StaggerItem } from '@/components/layout/StaggerList';
import { getSession } from '@/lib/session';

const ROLE_FR: Record<string, string> = {
  consumer:  'Particulier',
  employee:  'Employé',
  hr:        'RH',
  therapist: 'Thérapeute',
  admin:     'Admin',
};

export default function ProfilePage() {
  const session = getSession();
  const user = session?.user;

  const [memoryEnabled, setMemoryEnabled] = useState(user?.memoryEnabled ?? true);
  const [retention,     setRetention]     = useState(user?.memoryRetentionDays ?? 30);
  const [saved,         setSaved]         = useState(false);
  const [saving,        setSaving]        = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Mon Profil" subtitle="Gérez votre compte et vos paramètres de confidentialité" />

      <StaggerList className="space-y-5">
        {/* Identité */}
        <StaggerItem>
          <Card>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <div>
                <p className="font-semibold text-text">{user?.name ?? 'Utilisateur Démo'}</p>
                <p className="text-sm text-muted">{user?.email ?? 'demo@confidentia.app'}</p>
                <Badge size="sm" className="mt-1">{ROLE_FR[user?.role ?? 'consumer'] ?? user?.role}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted bg-surface border border-border rounded-xl px-3 py-2">
              <Shield size={11} className="text-cyan" />
              Compte protégé par chiffrement de bout en bout
            </div>
          </Card>
        </StaggerItem>

        {/* Moteur de Mémoire */}
        <StaggerItem>
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-text text-sm">Moteur de Mémoire</h3>
                <p className="text-xs text-muted mt-0.5">Permet à votre IA de se souvenir des conversations passées</p>
              </div>
              <button
                role="switch"
                aria-checked={memoryEnabled}
                aria-label="Activer/désactiver le Moteur de Mémoire"
                onClick={() => setMemoryEnabled(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${memoryEnabled ? 'bg-brand' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${memoryEnabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {memoryEnabled && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden pt-3 border-t border-border">
                <label className="text-xs font-medium text-text mb-2 block">
                  Rétention mémoire : <span className="text-violet">{retention} jours</span>
                </label>
                <input
                  type="range" min={7} max={365} step={7}
                  value={retention}
                  onChange={e => setRetention(Number(e.target.value))}
                  aria-label="Durée de rétention de la mémoire"
                  className="w-full accent-violet"
                />
                <div className="flex justify-between text-[10px] text-muted mt-1">
                  <span>7 jours</span><span>1 an</span>
                </div>
              </motion.div>
            )}
          </Card>
        </StaggerItem>

        {/* Droits sur les données (RGPD / CCPA) */}
        <StaggerItem>
          <Card>
            <h3 className="font-semibold text-sm text-text mb-3">Vos droits sur vos données</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-surface border border-border transition-colors">
                <Download size={14} className="text-cyan flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text">Exporter mes données</p>
                  <p className="text-xs text-muted">Téléchargez l&apos;ensemble de vos conversations et journal au format JSON</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 text-left p-3 rounded-xl hover:bg-red-500/5 border border-border hover:border-red-400/30 transition-colors">
                <Trash2 size={14} className="text-coral flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text">Supprimer toutes mes données</p>
                  <p className="text-xs text-muted">Effacer définitivement toutes vos données des serveurs Confidentia</p>
                </div>
              </button>
            </div>
            <p className="text-[10px] text-muted mt-3 leading-relaxed">
              Vous avez le droit d&apos;accéder, modifier ou effacer vos données à tout moment. Les demandes sont traitées sous 30 jours conformément à l&apos;article 17 du RGPD et au CCPA §1798.105.
            </p>
          </Card>
        </StaggerItem>

        {/* Enregistrer */}
        <StaggerItem>
          <Button
            onClick={handleSave}
            loading={saving}
            fullWidth
            className="shadow-brand"
          >
            {saved ? <><CheckCircle size={14}/>Enregistré !</> : <><Save size={14}/>Enregistrer</>}
          </Button>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
