/**
 * lib/avatar-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * The 8 predefined Confidentia AI companion avatars.
 * Diverse across gender and ethnicity — 4 women, 4 men.
 *
 * `stillUrl`    → Used in text mode (photo beside AI messages)
 * `heygenId`    → HeyGen avatar ID for video mode (configure per your plan)
 * `persona`     → Default personality style (user can override in onboarding)
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
  /** Unsplash still image for text/audio mode */
  stillUrl: string;
  /** HeyGen avatar ID — replace with your plan's IDs */
  heygenId: string;
  /** Short teaser shown on the avatar selection card */
  tagline: string;
}

export const AVATARS: AvatarConfig[] = [
  // ── Women ────────────────────────────────────────────────────────────────
  {
    id: 'av-aisha',
    name: 'Aisha',
    gender: 'female',
    ethnicity: 'black',
    persona: 'warm',
    stillUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Abigal_expressive_2024112501',
    tagline: 'Chaleureuse, présente et sans jugement.',
  },
  {
    id: 'av-mei',
    name: 'Mei',
    gender: 'female',
    ethnicity: 'asian',
    persona: 'calm',
    stillUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Erika_public_3',
    tagline: 'Claire, réfléchie et apaisante.',
  },
  {
    id: 'av-sofia',
    name: 'Sofia',
    gender: 'female',
    ethnicity: 'hispanic',
    persona: 'energetic',
    stillUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Daisy-inskirt-20220818',
    tagline: 'Une énergie vibrante pour vous porter vers l’avant.',
  },
  {
    id: 'av-emma',
    name: 'Emma',
    gender: 'female',
    ethnicity: 'white',
    persona: 'gentle',
    stillUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Angela-inblackskirt-20220820',
    tagline: 'Douce, stable et rassurante.',
  },

  // ── Men ───────────────────────────────────────────────────────────────────
  {
    id: 'av-kai',
    name: 'Kai',
    gender: 'male',
    ethnicity: 'asian',
    persona: 'calm',
    stillUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Eric_public_pro1',
    tagline: 'Mesuré, attentif et précis.',
  },
  {
    id: 'av-marcus',
    name: 'Marcus',
    gender: 'male',
    ethnicity: 'black',
    persona: 'warm',
    stillUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Mike_public_pro1',
    tagline: 'Franc et sincèrement bienveillant.',
  },
  {
    id: 'av-diego',
    name: 'Diego',
    gender: 'male',
    ethnicity: 'hispanic',
    persona: 'energetic',
    stillUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Tyler-incasualsuit-20220721',
    tagline: 'Une impulsion positive quand vous en avez besoin.',
  },
  {
    id: 'av-james',
    name: 'James',
    gender: 'male',
    ethnicity: 'white',
    persona: 'gentle',
    stillUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    heygenId: 'Josh_public_pro1',
    tagline: 'Patient, sans précipitation, profondément attentionné.',
  },
];

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

export function getSavedAvatar(): AvatarConfig {
  try {
    const id = localStorage.getItem(AVATAR_KEY);
    return AVATARS.find(a => a.id === id) ?? AVATARS[0];
  } catch { return AVATARS[0]; }
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
