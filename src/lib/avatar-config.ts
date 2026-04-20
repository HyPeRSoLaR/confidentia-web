/**
 * lib/avatar-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Single fixed Confidentia AI companion: Ann Therapist.
 *
 * `stillUrl`  → Real LiveAvatar preview image (same face as the video avatar)
 * `heygenId`  → LiveAvatar avatar ID used by /api/heygen-token
 * `persona`   → Personality style (can be overridden in onboarding)
 */

export type AvatarPersona =
  | 'warm'       // Warm & Empathetic
  | 'calm'       // Calm & Analytical
  | 'energetic'  // Energetic & Motivating
  | 'gentle';    // Gentle & Reassuring

export interface AvatarConfig {
  id: string;
  name: string;
  gender: 'female' | 'male';
  ethnicity: 'asian' | 'black' | 'hispanic' | 'white';
  persona: AvatarPersona;
  /** Real preview image from LiveAvatar — same face as the video avatar */
  stillUrl: string;
  /** LiveAvatar avatar ID used in /api/heygen-token */
  heygenId: string;
  /** Short teaser shown on the companion card */
  tagline: string;
}

/** The one fixed AI companion — Anna */
export const ANN_THERAPIST: AvatarConfig = {
  id: 'av-anna',
  name: 'Anna',
  gender: 'female',
  ethnicity: 'white',
  persona: 'warm',
  // Real LiveAvatar preview — exact same face as the video avatar
  stillUrl: 'https://files2.heygen.ai/avatar/v3/75e0a87b7fd94f0981ff398b593dd47f_45570/preview_talk_4.webp',
  heygenId: '513fd1b7-7ef9-466d-9af2-344e51eeb833',
  tagline: 'Votre assistant émotionnel IA — chaleureuse, présente, sans jugement.',
};

/** Keep AVATARS as a single-element array for any legacy references */
export const AVATARS: AvatarConfig[] = [ANN_THERAPIST];

export const PERSONA_META: Record<AvatarPersona, {
  label: string;
  emoji: string;
  description: string;
  systemPromptSuffix: string;
}> = {
  warm: {
    label: 'Chaleureux & Empathique',
    emoji: '🌿',
    description: 'Conduit avec le cœur. Crée un espace sûr et valorisant pour être entendu.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec chaleur et une profonde empathie. Tu valides les ressentis avant d’offrir une perspective.',
  },
  calm: {
    label: 'Calme & Analytique',
    emoji: '🧠',
    description: 'Vous aide à comprendre les schémas et à réfléchir clairement sous pression.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec calme et précision. Tu aides à identifier les schémas de pensée et à raisonner clairement.',
  },
  energetic: {
    label: 'Énergique & Motivant',
    emoji: '⚡',
    description: 'Apporte un élan positif et vous aide à passer à l’action.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec enthousiasme et une orientation vers l’action. Tu inspires et célèbres les petites victoires.',
  },
  gentle: {
    label: 'Doux & Rassurant',
    emoji: '🌙',
    description: 'Accompagnement doux pour les moments de grande vulnérabilité.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec douceur et bienveillance. Tu prends le temps, ne précipites jamais l’utilisateur.',
  },
};

// ── Persistence helpers ───────────────────────────────────────────────────────

const AVATAR_KEY  = 'confidentia_avatar_id';
const NAME_KEY    = 'confidentia_avatar_name';
const PERSONA_KEY = 'confidentia_avatar_persona';

/** Always returns Ann Therapist — the single fixed companion. */
export function getSavedAvatar(): AvatarConfig {
  return ANN_THERAPIST;
}

export function getSavedAvatarName(avatar: AvatarConfig): string {
  try {
    return localStorage.getItem(NAME_KEY) || avatar.name;
  } catch { return avatar.name; }
}

export function getSavedPersona(): AvatarPersona {
  try {
    const p = localStorage.getItem(PERSONA_KEY) as AvatarPersona | null;
    return p && PERSONA_META[p] ? p : 'warm';
  } catch { return 'warm'; }
}

export function saveAvatarPrefs(id: string, customName: string, persona: AvatarPersona) {
  try {
    localStorage.setItem(AVATAR_KEY, id);
    localStorage.setItem(NAME_KEY, customName);
    localStorage.setItem(PERSONA_KEY, persona);
  } catch {}
}
