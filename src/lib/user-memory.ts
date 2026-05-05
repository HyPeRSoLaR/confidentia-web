/**
 * lib/user-memory.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side user memory store for LiveAvatar context injection.
 * Collects: onboarding pathology, check-in emotions, session notes.
 * Builds a dynamic context string to inject into the LiveAvatar greeting.
 *
 * Replace with Supabase / API when backend is wired.
 */

export type UsageContext = 'stress' | 'anxiety' | 'loneliness' | 'sleep' | 'burnout';

export type EmotionLabel =
  | 'calm' | 'happy' | 'anxious' | 'sad'
  | 'angry' | 'stressed' | 'energized' | 'neutral';

export interface CheckInEntry {
  emotion:    EmotionLabel;
  intensity:  number;       // 1–10
  note?:      string;
  recordedAt: string;       // ISO
}

// ── Keys ──────────────────────────────────────────────────────────────────────

const CONTEXT_KEY   = 'confidentia_usage_context';
const CHECKIN_KEY   = 'confidentia_checkins';
const SESSION_KEY   = 'confidentia_session_count';

// ── Onboarding pathology ──────────────────────────────────────────────────────

export function saveUsageContext(ctx: UsageContext) {
  try { localStorage.setItem(CONTEXT_KEY, ctx); } catch {}
}

export function getSavedUsageContext(): UsageContext | null {
  try {
    return (localStorage.getItem(CONTEXT_KEY) as UsageContext) || null;
  } catch { return null; }
}

// ── Check-ins (rolling last 5) ────────────────────────────────────────────────

export function saveCheckIn(entry: CheckInEntry) {
  try {
    const existing = getCheckIns();
    const updated  = [entry, ...existing].slice(0, 5); // keep last 5
    localStorage.setItem(CHECKIN_KEY, JSON.stringify(updated));
  } catch {}
}

export function getCheckIns(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem(CHECKIN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function getLastCheckIn(): CheckInEntry | null {
  const all = getCheckIns();
  return all.length > 0 ? all[0] : null;
}

// ── Session count ─────────────────────────────────────────────────────────────

export function incrementSessionCount(): number {
  try {
    const current = getSessionCount();
    const next    = current + 1;
    localStorage.setItem(SESSION_KEY, String(next));
    return next;
  } catch { return 1; }
}

export function getSessionCount(): number {
  try {
    return parseInt(localStorage.getItem(SESSION_KEY) || '0', 10);
  } catch { return 0; }
}

// ── Build dynamic context for LiveAvatar ──────────────────────────────────────

const USAGE_LABELS: Record<UsageContext, string> = {
  stress:     'la gestion du stress professionnel',
  anxiety:    "l'anxiété et les pensées envahissantes",
  loneliness: 'le sentiment de solitude et d\'isolement',
  sleep:      "l'anxiété nocturne et les troubles du sommeil",
  burnout:    "le burn-out et l'épuisement émotionnel",
};

const EMOTION_FR: Record<EmotionLabel, string> = {
  calm:      'calme',
  happy:     'joyeux',
  anxious:   'anxieux',
  sad:       'triste',
  angry:     'en colère',
  stressed:  'stressé',
  energized: 'dynamisé',
  neutral:   'neutre',
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  warm:      'Tu adoptes un ton chaleureux, empathique et réconfortant. Tu valides les émotions avant tout. Tu utilises des formulations douces et inclusives.',
  calm:      'Tu adoptes un ton calme, posé et analytique. Tu aides à décortiquer les pensées avec méthode. Tu poses des questions de clarification précises.',
  energetic: 'Tu adoptes un ton dynamique et encourageant. Tu célèbres les petites victoires. Tu proposes des actions concrètes et tu motives.',
  gentle:    'Tu adoptes un ton très doux, patient et contemplatif. Tu ne précipites jamais. Tu laisses des silences. Tu accompagnes avec bienveillance.',
};

/**
 * Builds the full greeting/instruction to inject into the LiveAvatar session.
 * This is sent as the `greeting` parameter in the token request.
 * It gives the AI all the context it needs for a personalized session.
 */
export function buildSessionContext(
  avatarName: string,
  persona:    string,
): string {
  const sessionNum    = getSessionCount();
  const usageContext  = getSavedUsageContext();
  const lastCheckIn   = getLastCheckIn();
  const recentCheckins = getCheckIns();

  const parts: string[] = [];

  // Identity
  parts.push(`Tu es ${avatarName}, thérapeute IA de Confidentia.`);

  // Tone
  const toneInstruction = TONE_INSTRUCTIONS[persona] || TONE_INSTRUCTIONS.warm;
  parts.push(toneInstruction);

  // Session history
  if (sessionNum <= 1) {
    parts.push("C'est la première session de cet utilisateur. Accueille-le chaleureusement et prends le temps de comprendre sa situation avant de proposer quoi que ce soit.");
  } else {
    parts.push(`C'est la session n°${sessionNum} de cet utilisateur. Tu le connais déjà un peu. Demande-lui comment les choses ont évolué depuis la dernière fois.`);
  }

  // Pathology focus
  if (usageContext) {
    parts.push(`L'utilisateur a indiqué vouloir travailler sur ${USAGE_LABELS[usageContext]}. Garde ce sujet en tête mais ne force pas — laisse-le guider la conversation.`);
  }

  // Last check-in
  if (lastCheckIn) {
    const timeDiff = Date.now() - new Date(lastCheckIn.recordedAt).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const timeLabel = hoursAgo < 1 ? "il y a quelques minutes" :
                      hoursAgo < 24 ? `il y a ${hoursAgo}h` :
                      `il y a ${Math.floor(hoursAgo / 24)} jour(s)`;

    parts.push(`Lors de son dernier bilan émotionnel (${timeLabel}), l'utilisateur se sentait ${EMOTION_FR[lastCheckIn.emotion]} avec une intensité de ${lastCheckIn.intensity}/10.`);

    if (lastCheckIn.note) {
      parts.push(`Il a noté : "${lastCheckIn.note}"`);
    }

    // Detect concerning patterns
    if (lastCheckIn.intensity >= 8 && ['anxious', 'stressed', 'sad', 'angry'].includes(lastCheckIn.emotion)) {
      parts.push("ATTENTION : Le niveau d'intensité émotionnelle est élevé. Sois particulièrement attentif et empathique. Explore ce qu'il ressent en profondeur avant toute suggestion.");
    }
  }

  // Emotional trend from recent check-ins
  if (recentCheckins.length >= 3) {
    const negativeCount = recentCheckins.filter(c =>
      ['anxious', 'stressed', 'sad', 'angry'].includes(c.emotion)
    ).length;

    if (negativeCount >= 3) {
      parts.push("OBSERVATION : Les derniers bilans montrent une tendance négative persistante. Explore avec délicatesse si quelque chose de plus profond se joue.");
    }
  }

  // Opening instruction
  parts.push("Commence par accueillir l'utilisateur et demande-lui comment il se sent MAINTENANT, en ce moment précis. Écoute sa réponse avant toute chose.");

  return parts.join(' ');
}
