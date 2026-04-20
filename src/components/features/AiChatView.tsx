'use client';
/**
 * components/features/AiChatView.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared AI chat UI — /consumer/chat and /employee/chat.
 *
 * Features:
 *   • Text / Audio / Video modes
 *   • Voice notes in text mode (record → transcript → waveform player)
 *   • File attachments (PDF, DOCX, images)
 *   • Avatar photo beside AI messages in text mode (selected companion)
 *   • Waveform audio player in audio mode
 *   • "I want to speak with someone" CTA → therapist panel
 *
 * Privacy contract:
 *   • All conversation content stays in React state (in-memory only).
 *   • Nothing is persisted without explicit user action.
 *   • No employer, HR, or admin role can access message content.
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, Video, MessageCircle,
  Loader2, Check, Lock, X, Wifi, WifiOff, AlertTriangle,
  Paperclip, StopCircle, FileText, Image as ImageIcon, File,
  Users, MicOff, Star, Globe, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { InteractiveAvatar, type InteractiveAvatarRef } from '@/components/ui/InteractiveAvatar';
import { WaveformPlayer } from '@/components/ui/WaveformPlayer';
import { INITIAL_MESSAGES } from '@/lib/mock-data';
import { MOCK_THERAPISTS } from '@/lib/mock-data';
import { getSavedAvatar, getSavedAvatarName } from '@/lib/avatar-config';
import type { Message, ConversationMode, MessageAttachment } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INPUT  = 2000;
const BANNER_KEY = 'confidentia_privacy_banner_ts';
const BANNER_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const MODES: { id: ConversationMode; label: string; icon: React.ElementType }[] = [
  { id: 'text',  label: 'Texte', icon: MessageCircle },
  { id: 'audio', label: 'Audio', icon: Mic           },
  { id: 'video', label: 'Vidéo', icon: Video          },
];

const FILE_ACCEPT = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif';

function fileType(name: string): MessageAttachment['type'] {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return 'pdf';
  if (['doc','docx','txt'].includes(ext)) return 'doc';
  if (['png','jpg','jpeg','webp','gif'].includes(ext)) return 'image';
  return 'other';
}

function fileIcon(type: MessageAttachment['type']) {
  const cls = 'w-3.5 h-3.5 flex-shrink-0';
  if (type === 'pdf')   return <FileText className={cls} />;
  if (type === 'image') return <ImageIcon className={cls} />;
  return <File className={cls} />;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

type AvatarStatus = 'connecting' | 'ready' | 'error';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AiChatViewProps {
  title?:       string;
  subtitle?:    string;
  privacyNote?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AiChatView({
  title       = 'Conversation IA',
  subtitle    = 'Privé et confidentiel — vos conversations ne sont jamais partagées',
  privacyNote = 'Vos conversations sont chiffrées de bout en bout et ne sont jamais consultées par des humains.',
}: AiChatViewProps) {

  const router = useRouter();

  // ── Saved avatar ───────────────────────────────────────────────────────────
  const [avatarConfig, setAvatarConfig] = useState(() => getSavedAvatar());
  const [avatarDisplayName, setAvatarDisplayName] = useState('');
  useEffect(() => {
    const a = getSavedAvatar();
    setAvatarConfig(a);
    setAvatarDisplayName(getSavedAvatarName(a));
  }, []);

  // ── Core state ─────────────────────────────────────────────────────────────
  const messagesRef = useRef<Message[]>([...INITIAL_MESSAGES]);

  const [mode,           setMode]          = useState<ConversationMode>('text');
  const [messages,       setMessages]      = useState<Message[]>([...INITIAL_MESSAGES]);
  const [input,          setInput]         = useState('');
  const [loading,        setLoading]       = useState(false);
  const [sessionEnded,   setSessionEnded]  = useState(false);
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [bannerVisible,  setBannerVisible]  = useState(false);
  const [avatarStatus,   setAvatarStatus]  = useState<AvatarStatus>('connecting');
  const [pendingVoice,   setPendingVoice]  = useState<string | null>(null);
  // Audio mode — mic active toggle
  const [audioMicActive, setAudioMicActive] = useState(false);
  // Timestamp (ms) of when audio mode was *activated*.
  // Only messages synthesized AFTER this moment will autoPlay — prevents
  // pre-existing messages from firing audio on mode switch.
  const audioModeActivatedAt = useRef<number>(0);

  // Ref-based loading lock — unlike the `loading` state this is synchronous
  // and can be read inside callbacks without stale-closure risk.
  const loadingRef          = useRef(false);
  // Stores the last accepted transcript text + timestamp for dedup:
  // if the same (or very similar) text arrives within 3 s, it is dropped.
  const lastTranscriptRef   = useRef<{ text: string; ts: number }>({ text: '', ts: 0 });

  // ── Voice note / audio recording ──────────────────────────────────────────
  const [recording,      setRecording]     = useState(false);
  const [recSeconds,     setRecSeconds]    = useState(0);
  // Live transcript state shown to user while mic is open
  const [liveTranscript, setLiveTranscript] = useState('');
  // Transcribing spinner shown after mic closes while Whisper is computing
  const [transcribing,   setTranscribing]  = useState(false);
  const mediaRecRef      = useRef<MediaRecorder | null>(null);
  const recChunksRef     = useRef<Blob[]>([]);
  const recTimerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  // Stores the transcript built by the parallel SpeechRecognition session
  const liveTranscriptRef = useRef('');
  const speechRecRef      = useRef<any>(null);

  // ── File attachments ───────────────────────────────────────────────────────
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Expert panel ───────────────────────────────────────────────────────────
  const [showExpertPanel, setShowExpertPanel] = useState(false);

  const scrollRef  = useRef<HTMLDivElement>(null);
  const avatarRef  = useRef<InteractiveAvatarRef>(null);

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    try {
      const ts   = localStorage.getItem(BANNER_KEY);
      const show = !ts || Date.now() - parseInt(ts, 10) > BANNER_TTL;
      setBannerVisible(show);
    } catch { setBannerVisible(true); }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, mode]);

  // ── Voice recording handlers ───────────────────────────────────────────────
  //
  // Strategy: run MediaRecorder (for waveform blob) + SpeechRecognition (for
  // live text) in PARALLEL.  SpeechRecognition cannot transcribe a blob — it
  // needs the live mic stream — so we start it at the same time as the recorder.
  // If the Web Speech API is unavailable (Firefox, some mobile browsers), we
  // fall back to posting the finished blob to /api/transcribe (Whisper).

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ① MediaRecorder — captures raw audio bytes for the waveform player
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';
      const mr = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recChunksRef.current     = [];
      liveTranscriptRef.current = '';
      setLiveTranscript('');
      mr.ondataavailable = e => { if (e.data.size > 0) recChunksRef.current.push(e.data); };
      mr.start(200);
      mediaRecRef.current = mr;
      setRecording(true);
      setRecSeconds(0);
      recTimerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);

      // ② SpeechRecognition — runs continuously alongside the recorder
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const sr = new SR();
        sr.lang       = 'fr-FR';
        sr.continuous = true;          // keep listening until we stop it
        sr.interimResults = true;      // stream partial results for live display
        let finalText = '';
        sr.onresult = (e: any) => {
          let interim = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const t = e.results[i][0].transcript;
            if (e.results[i].isFinal) { finalText += t + ' '; }
            else                       { interim    = t; }
          }
          const displayed = (finalText + interim).trim();
          liveTranscriptRef.current = finalText.trim() || displayed;
          setLiveTranscript(displayed);
        };
        sr.onerror = (e: any) => {
          // Suppress no-speech errors — they fire if there's silence
          if (e.error !== 'no-speech') console.warn('[SR]', e.error);
        };
        try { sr.start(); } catch {}
        speechRecRef.current = sr;
      }
    } catch (err) {
      console.warn('[VoiceNote] Mic access denied', err);
    }
  }

  /**
   * Stop recording and build the message.
   * @param fromAudioMode  — true when called from the Audio mode mic toggle
   * @param cancel         — true when the user explicitly cancels (no message sent)
   */
  async function stopRecording(fromAudioMode = false, cancel = false) {
    if (recTimerRef.current) { clearInterval(recTimerRef.current); recTimerRef.current = null; }

    // Stop SpeechRecognition first so its final results fire
    if (speechRecRef.current) {
      try { speechRecRef.current.stop(); } catch {}
      speechRecRef.current = null;
    }

    const mr = mediaRecRef.current;
    if (!mr) return;
    mr.stop();
    mr.stream.getTracks().forEach(t => t.stop());
    mediaRecRef.current = null;
    setRecording(false);
    setLiveTranscript('');
    if (fromAudioMode) setAudioMicActive(false);

    if (cancel) { setRecSeconds(0); return; }

    // Give the MediaRecorder's ondataavailable a final tick
    await new Promise(r => setTimeout(r, 150));

    const blob     = new Blob(recChunksRef.current, { type: mr.mimeType || 'audio/webm' });
    const audioUrl = URL.createObjectURL(blob);

    // ── Resolve transcript ────────────────────────────────────────────────────
    // Priority: (1) Web Speech API live result, (2) Whisper server, (3) placeholder
    let transcript = liveTranscriptRef.current.trim();

    if (!transcript && blob.size > 0) {
      // Fallback: send blob to /api/transcribe (Whisper) if key is configured
      setTranscribing(true);
      try {
        const fd = new FormData();
        fd.append('audio', blob, 'audio.webm');
        fd.append('lang', 'fr');
        const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          transcript = (data.transcript ?? '').trim();
        }
      } catch (e) {
        console.warn('[Transcribe] Whisper fallback failed', e);
      } finally {
        setTranscribing(false);
      }
    }

    // Final fallback label if both methods yield nothing
    if (!transcript) transcript = '[Note vocale]';

    setRecSeconds(0);
    liveTranscriptRef.current = '';

    const userMsg: Message = {
      id:          `vnote-${Date.now()}`,
      role:        'user',
      content:     transcript,
      audioUrl,
      isVoiceNote: true,
      timestamp:   new Date().toISOString(),
    };
    const updated = [...messagesRef.current, userMsg];
    messagesRef.current = updated;
    setMessages(updated);
    // Only fire Claude if we have a real transcript
    if (transcript !== '[Note vocale]') setPendingVoice(transcript);
  }

  // ── Audio mode mic toggle ──────────────────────────────────────────────────
  async function toggleAudioMic() {
    if (audioMicActive) {
      await stopRecording(true, false);
    } else {
      setAudioMicActive(true);
      await startRecording();
    }
  }

  function cancelRecording() {
    stopRecording(false, true);
  }

  // ── File attachment handler ────────────────────────────────────────────────

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newAttachments: MessageAttachment[] = Array.from(files).map(f => ({
      id:        `att-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name:      f.name,
      type:      fileType(f.name),
      sizeBytes: f.size,
      url:       URL.createObjectURL(f),
    }));
    setPendingAttachments(prev => [...prev, ...newAttachments]);
  }

  function removeAttachment(id: string) {
    setPendingAttachments(prev => prev.filter(a => a.id !== id));
  }

  // ── Dismiss banner ─────────────────────────────────────────────────────────

  const dismissBanner = useCallback(() => {
    setBannerVisible(false);
    try { localStorage.setItem(BANNER_KEY, Date.now().toString()); } catch {}
  }, []);

  // ── Voice transcript from avatar (video mode) ──────────────────────────────
  // Guard 1 (InteractiveAvatar): transcript suppressed while avatar is speaking / cooldown.
  // Guard 2 (here): dropped if another request is already in-flight (loadingRef).
  // Guard 3 (here): dedup — identical text within 3 s is discarded.

  const handleVoiceTranscript = useCallback((text: string) => {
    // VIDEO mode: HeyGen handles VAD→STT→LLM→TTS server-side.
    // Calling Claude here creates double latency + double response. Skip entirely.
    if (mode === 'video') return;

    // Guard 2: already processing — drop
    if (loadingRef.current) {
      console.debug('[AiChat] transcript dropped — in-flight lock active');
      return;
    }
    // Guard 3: dedup
    const now = Date.now();
    if (
      text.trim() === lastTranscriptRef.current.text &&
      now - lastTranscriptRef.current.ts < 3000
    ) {
      console.debug('[AiChat] transcript dropped — duplicate within 3 s');
      return;
    }
    lastTranscriptRef.current = { text: text.trim(), ts: now };

    const userMsg: Message = {
      id: `voice-user-${Date.now()}`, role: 'user', content: text, timestamp: new Date().toISOString(),
    };
    const updated = [...messagesRef.current, userMsg];
    messagesRef.current = updated;
    setMessages(updated);
    setPendingVoice(text);
  }, [mode]);

  useEffect(() => {
    if (!pendingVoice) return;
    setPendingVoice(null);
    // Sync the ref lock so concurrent transcript events are gated out
    loadingRef.current = true;
    setLoading(true);
    const currentMessages = messagesRef.current;

    const history = currentMessages
      .filter(m => m.id !== 'init-1' && (m.role === 'user' || m.role === 'assistant'))
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
    const firstUser = history.findIndex(m => m.role === 'user');
    const trimmed   = firstUser >= 0 ? history.slice(firstUser) : history;

    fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: trimmed }),
    })
      .then(r => r.json())
      .then(data => {
        const reply = data.reply ?? "Je suis là pour vous — continuez, je vous écoute.";
        if (avatarRef.current) { try { avatarRef.current.speak(reply); } catch {} }
        const aiMsg: Message = { id: `voice-ai-${Date.now()}`, role: 'assistant', content: reply, timestamp: new Date().toISOString() };
        const withReply = [...messagesRef.current, aiMsg];
        messagesRef.current = withReply;
        setMessages(withReply);
      })
      .catch(() => {
        const errMsg: Message = { id: `voice-err-${Date.now()}`, role: 'assistant', content: '(Problème de connexion — veuillez réessayer.)', timestamp: new Date().toISOString() };
        const withErr = [...messagesRef.current, errMsg];
        messagesRef.current = withErr;
        setMessages(withErr);
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
  }, [pendingVoice]);

  const handleAvatarResponse = useCallback((_text: string) => {}, []);

  // ── Send message ───────────────────────────────────────────────────────────

  async function sendMessage() {
    if ((!input.trim() && pendingAttachments.length === 0) || loading) return;

    const userMsg: Message = {
      id:          Date.now().toString(),
      role:        'user',
      content:     input.trim() ? input.slice(0, MAX_INPUT) : pendingAttachments.map(a => `[Pièce jointe : ${a.name}]`).join(', '),
      timestamp:   new Date().toISOString(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setPendingAttachments([]);
    setLoading(true);

    let text = '';
    const msgId = (Date.now() + 1).toString();

    try {
      // All modes (text, audio, video) call Claude — so response always shows as a bubble.
      // In video FULL mode: avatarRef.current.speak(text) also makes the avatar say it.
      // In video LITE mode: speak() is a no-op — ElevenLabs drives voice autonomously.
      const allHistory = updatedMessages
        .filter(m => m.id !== 'init-1')
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      const firstUserIdx = allHistory.findIndex(m => m.role === 'user');
      const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : allHistory;

      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error ?? `Chat API error ${res.status}`); }
      const data = await res.json();
      text = data.reply ?? '';
    } catch (err) {
      console.error('[AiChat] Claude error:', err);
      text = "Je suis là pour vous. Pourriez-vous m'en dire un peu plus sur ce qui vous préoccupe ?";
    }

    if (mode === 'video' && avatarRef.current) {
      try { avatarRef.current.speak(text); } catch {}
    }

    const aiMsg: Message = { id: msgId, role: 'assistant', content: text, timestamp: new Date().toISOString() };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);

    if (mode === 'audio' && text) {
      setLoadingAudioId(msgId);
      try {
        const res = await fetch('/api/synthesize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error(`Synthesis failed: ${res.status}`);
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        setMessages(m => m.map(msg => msg.id === msgId ? { ...msg, audioUrl } : msg));
      } catch (err) {
        console.error('[ElevenLabs] Synthesis failed:', err);
      } finally {
        setLoadingAudioId(null);
      }
    }
  }

  function resetSession() {
    setSessionEnded(false);
    setMessages([...INITIAL_MESSAGES]);
    setInput('');
    setPendingAttachments([]);
  }

  // ── Sub-renderers ──────────────────────────────────────────────────────────

  const charCount = input.length;
  const charWarn  = charCount > MAX_INPUT * 0.8;
  const recFmt    = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function switchMode(next: ConversationMode) {
    if (next === 'audio') {
      // Record activation time — only messages synthesized AFTER this will autoPlay
      audioModeActivatedAt.current = Date.now();
    } else {
      audioModeActivatedAt.current = 0;
    }
    setMode(next);
  }

  function ModeSwitcher({ className = '' }: { className?: string }) {
    return (
      <div className={`flex bg-surface rounded-xl p-1 border border-border gap-0.5 ${className}`}>
        {MODES.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              aria-pressed={mode === m.id}
              aria-label={`Passer en mode ${m.label}`}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                mode === m.id ? 'bg-brand text-white shadow-brand' : 'text-muted hover:text-text'
              }`}
            >
              <Icon size={13} aria-hidden /><span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function AvatarStatusBadge() {
      const map: Record<AvatarStatus, { label: string; color: string; icon: React.ReactNode }> = {
      connecting: { label: 'Connexion en cours…',  color: 'text-amber-400   border-amber-400/30   bg-amber-400/10   animate-pulse', icon: <WifiOff size={10} /> },
      ready:      { label: 'Avatar prêt',          color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',               icon: <Wifi     size={10} /> },
      error:      { label: 'Connexion échouée',    color: 'text-red-400     border-red-400/30     bg-red-400/10',                  icon: <AlertTriangle size={10} /> },
    };
    const { label, color, icon } = map[avatarStatus];
    return (
      <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>
        {icon}{label}
      </div>
    );
  }

  // ── Expert Panel ───────────────────────────────────────────────────────────
  function ExpertPanel() {
    return (
      <AnimatePresence>
        {showExpertPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowExpertPanel(false)} />
            <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl p-6 shadow-brand z-10 max-h-[80vh] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-text text-lg">Parler avec un vrai thérapeute</h2>
                  <p className="text-xs text-muted mt-0.5">Correspondance à votre profil · Réponse sous 24h</p>
                </div>
                <button onClick={() => setShowExpertPanel(false)} className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-muted hover:text-text transition-colors">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                {MOCK_THERAPISTS.map(t => (
                  <div key={t.userId} className="glass p-4 rounded-2xl flex gap-3 hover:border-violet/40 transition-colors cursor-pointer group">
                    <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-sm text-text truncate">{t.name}</span>
                        {t.isVerified && <Check size={11} className="text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-muted mb-1.5">
                        <span className="flex items-center gap-0.5"><Star size={9} className="text-amber-400" /> {t.rating}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5"><Globe size={9} /> {t.languages.join(', ')}</span>
                        <span>·</span>
                        <span>€{t.ratePerSession}/session</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {t.specialties.slice(0, 3).map(s => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 bg-violet/10 text-violet rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted group-hover:text-violet transition-colors flex-shrink-0 self-center" />
                  </div>
                ))}
              </div>

              <Button
                className="w-full rounded-2xl py-3 shadow-brand"
                onClick={() => { setShowExpertPanel(false); router.push('/marketplace'); }}
              >
                Voir tous les thérapeutes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Message bubble renderer ────────────────────────────────────────────────

  function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === 'user';
    const displayName = avatarDisplayName || avatarConfig.name;
    // Only autoPlay if this message was synthesized AFTER audio mode was activated.
    const shouldAutoPlay = audioModeActivatedAt.current > 0
      && new Date(msg.timestamp).getTime() >= audioModeActivatedAt.current;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
      >
        {/* Avatar photo for AI messages in text mode */}
        {!isUser && mode === 'text' && (
          <img
            src={avatarConfig.stillUrl}
            alt={displayName}
            title={displayName}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-0.5 ring-1 ring-border"
          />
        )}

        <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'bg-brand text-white rounded-br-sm' : 'glass text-text rounded-bl-sm'
        }`}>

          {/* Voice note waveform */}
          {msg.isVoiceNote && msg.audioUrl && (
            <div className="mb-1.5">
              <WaveformPlayer src={msg.audioUrl} autoPlay={false} variant="user" />
              {msg.content !== '[Note vocale]' && (
                <p className="text-[10px] text-white/60 mt-1 italic">"{msg.content}"</p>
              )}
            </div>
          )}

          {/* Audio mode waveform (AI synthesis) */}
          {msg.role === 'assistant' && mode === 'audio' && msg.audioUrl && (
            <div className="mb-2">
              <WaveformPlayer src={msg.audioUrl} autoPlay={shouldAutoPlay} variant="ai" />
            </div>
          )}

          {/* Audio loading skeleton */}
          {msg.role === 'assistant' && mode === 'audio' && !msg.audioUrl && loadingAudioId === msg.id && (
            <div className="flex items-center gap-1.5 mb-2 opacity-60">
              <Loader2 size={11} className="animate-spin" />
              <span className="text-[10px]">Synthèse audio en cours…</span>
            </div>
          )}

          {/* Regular text (not voice note) */}
          {!msg.isVoiceNote && <span>{msg.content}</span>}

          {/* Attachments */}
          {msg.attachments && msg.attachments.length > 0 && (
            <div className={`flex flex-col gap-1 ${msg.content ? 'mt-2 pt-2 border-t border-white/20' : ''}`}>
              {msg.attachments.map(att => (
                <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-[11px] px-2 py-1.5 rounded-lg transition-colors ${
                    isUser ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-surface hover:bg-border/50 text-text'
                  }`}>
                  {fileIcon(att.type)}
                  <span className="flex-1 truncate font-medium">{att.name}</span>
                  <span className="opacity-60 flex-shrink-0">{formatBytes(att.sizeBytes)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">

      {/* Expert panel overlay */}
      <ExpertPanel />

      {/* ── Header ── */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-2">
            {mode === 'video' && <AvatarStatusBadge />}
            {!sessionEnded && (
              <Button onClick={() => setSessionEnded(true)} variant="danger" size="sm" aria-label="Terminer cette session">
                Terminer
              </Button>
            )}
            <div className="hidden sm:block"><ModeSwitcher /></div>
          </div>
        }
      />

      {/* ── Session ended ── */}
      {sessionEnded ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shadow-brand">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif text-text font-bold tracking-tight">Session terminée</h2>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Votre conversation a été entièrement confidentielle et chiffrée.
            Prenez un moment pour respirer et réfléchir à vos avancées d’aujourd’hui.
          </p>
          <div className="pt-4">
            <Button onClick={resetSession} className="rounded-full px-8 py-5 text-sm">Nouvelle session</Button>
          </div>
        </motion.div>

      ) : (
        <>
          {/* Mobile mode switcher */}
          <div className="sm:hidden mb-3"><ModeSwitcher className="w-full" /></div>

          {/* Privacy banner */}
          <AnimatePresence>
            {bannerVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{   opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }} className="overflow-hidden"
              >
                <div className="flex items-start gap-2 bg-violet/10 border border-violet/20 rounded-xl px-4 py-2.5 text-xs text-violet">
                  <Lock size={11} className="flex-shrink-0 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{privacyNote}</span>
                  <button onClick={dismissBanner} aria-label="Dismiss privacy notice" className="flex-shrink-0 p-1 rounded-md hover:bg-violet/20 transition-colors">
                    <X size={11} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video avatar — full height in video mode, hidden otherwise */}
          <div
            className={mode === 'video' ? 'flex-1 flex flex-col mb-4' : 'hidden'}
            aria-hidden={mode !== 'video'}
          >
            <InteractiveAvatar
              ref={avatarRef}
              onReady={() => setAvatarStatus('ready')}
              onError={() => setAvatarStatus('error')}
              onVoiceTranscript={handleVoiceTranscript}
            />
          </div>

          {/* Audio mode companion display */}
          {mode === 'audio' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 mb-4 py-4"
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={avatarConfig.stillUrl}
                  alt={avatarDisplayName || avatarConfig.name}
                  className={`w-24 h-24 rounded-2xl object-cover shadow-brand transition-all duration-300 ${
                    audioMicActive ? 'ring-4 ring-red-400/70' : 'ring-2 ring-border'
                  }`}
                />
                {/* Pulse ring when mic is active */}
                {audioMicActive && (
                  <span className="absolute inset-0 rounded-2xl animate-ping bg-red-400/20 pointer-events-none" />
                )}
              </div>

              <p className="text-sm font-semibold text-text">{avatarDisplayName || avatarConfig.name}</p>

              {/* ** Mic toggle button ** */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={toggleAudioMic}
                  aria-label={audioMicActive ? 'Couper le micro' : 'Activer le micro'}
                  aria-pressed={audioMicActive}
                  className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-200 ${
                    audioMicActive
                      ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-red-500/40'
                      : 'bg-brand hover:bg-violet-600 shadow-brand'
                  }`}
                >
                  {audioMicActive
                    ? <MicOff size={28} className="text-white" />
                    : <Mic    size={28} className="text-white" />}
                </button>

                {/* Live waveform bars + transcript during audio-mode recording */}
                <AnimatePresence>
                  {transcribing && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={13} className="animate-spin text-violet" />
                      <span className="text-xs text-muted">Transcription…</span>
                    </motion.div>
                  )}
                  {audioMicActive && recording && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex items-end gap-0.5 h-6">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 rounded-full bg-red-400 animate-waveform"
                            style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 40}ms` }}
                          />
                        ))}
                      </div>
                      {/* Live transcript preview in audio mode */}
                      {liveTranscript && (
                        <p className="text-[11px] text-muted/80 italic max-w-[240px] text-center leading-relaxed">
                          "{liveTranscript}"
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-muted">
                  {audioMicActive
                    ? <span className="text-red-400 font-medium">Micro actif — parlez maintenant · {recFmt(recSeconds)}</span>
                    : loading
                    ? <span className="text-violet font-medium flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Traitement…</span>
                    : 'Appuyez pour parler'}
                </p>
              </div>
            </motion.div>
          )}

          {/* Messages list — hidden in video mode (pure voice immersion, no bubbles) */}
          {mode !== 'video' && (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-thin space-y-4 pr-1 mb-4"
            aria-live="polite" aria-label="Conversation messages"
          >
            <AnimatePresence initial={false}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-end gap-2">
                  {mode === 'text' && (
                    <img src={avatarConfig.stillUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-0.5 ring-1 ring-border" />
                  )}
                  <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-violet" />
                    <span className="text-xs text-muted">En train de réfléchir…</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          )}

          {/* "Talk to someone" CTA */}
          <motion.button
            onClick={() => setShowExpertPanel(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 w-full mb-3 p-3 rounded-2xl border border-dashed border-violet/40 bg-violet/5 text-violet text-xs font-medium hover:bg-violet/10 hover:border-violet/60 transition-all duration-200"
          >
            <Users size={14} />
            <span className="flex-1 text-left">Je veux parler avec quelqu’un</span>
            <ChevronRight size={13} />
          </motion.button>

          {/* Input bar — hidden in video mode (pure voice, no typing needed) */}
          {mode !== 'video' && (
          <>
          {/* Pending attachment chips */}
          <AnimatePresence>
            {pendingAttachments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-1.5 mb-2"
              >
                {pendingAttachments.map(att => (
                  <div key={att.id} className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1 text-[11px] text-text">
                    {fileIcon(att.type)}
                    <span className="max-w-[120px] truncate">{att.name}</span>
                    <button onClick={() => removeAttachment(att.id)} className="text-muted hover:text-red-400 transition-colors ml-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Input bar ── */}
          <div className="glass flex flex-col gap-1 p-3 rounded-2xl">

            {/* Recording state */}
            {transcribing ? (
              <div className="flex items-center gap-2 py-1">
                <Loader2 size={14} className="animate-spin text-violet flex-shrink-0" />
                <span className="text-xs text-muted flex-1">Transcription en cours…</span>
              </div>
            ) : recording ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-rec flex-shrink-0" />
                    <span className="text-xs text-red-400 font-medium flex-shrink-0">Enregistrement… {recFmt(recSeconds)}</span>
                    {/* Live waveform bars during recording */}
                    <div className="flex items-end gap-0.5 h-5 flex-1">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-full bg-red-400/70 animate-waveform"
                          style={{ height: `${40 + Math.random() * 60}%`, animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                  <button onClick={cancelRecording} title="Annuler" className="text-muted hover:text-red-400 transition-colors p-1 flex-shrink-0">
                    <MicOff size={16} />
                  </button>
                  <button
                    onClick={() => stopRecording(false, false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition-colors flex-shrink-0"
                  >
                    <StopCircle size={13} /> Envoyer
                  </button>
                </div>
                {/* Live transcript preview while speaking */}
                {liveTranscript && (
                  <p className="text-[11px] text-muted/80 italic pl-5 leading-relaxed truncate">
                    "{liveTranscript}"
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={FILE_ACCEPT}
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />

                {/* Attachment button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                  className="text-muted hover:text-violet transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-violet/10"
                >
                  <Paperclip size={16} />
                </button>

                {/* Voice note button (text mode only) */}
                {mode === 'text' && (
                  <button
                    onClick={startRecording}
                   title="Enregistrer une note vocale"
                    className="text-muted hover:text-violet transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-violet/10"
                  >
                    <Mic size={16} />
                  </button>
                )}

                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value.slice(0, MAX_INPUT))}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={mode === 'audio' ? 'Tapez ou parlez…' : 'Partagez ce qui vous préoccupe…'}
                  maxLength={MAX_INPUT}
                  className="flex-1 bg-transparent text-text text-sm placeholder:text-muted/60 outline-none min-w-0"
                  aria-label="Tapez votre message"
                  disabled={loading}
                />
                <Button
                  onClick={sendMessage}
                  loading={loading}
                  size="sm"
                  disabled={(!input.trim() && pendingAttachments.length === 0) || loading}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </Button>
              </div>
            )}

            {/* Character counter */}
            {charWarn && (
              <p className={`text-right text-[10px] transition-colors select-none ${
                charCount >= MAX_INPUT ? 'text-red-400' : 'text-amber-400'
              }`}>
                {charCount} / {MAX_INPUT}
              </p>
            )}
          </div>
          </>
          )}
        </>
      )}
    </div>
  );
}
