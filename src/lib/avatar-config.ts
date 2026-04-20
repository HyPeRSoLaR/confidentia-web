/**
 * lib/avatar-config.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Confidentia AI avatar catalog — 8 corporate-styled LiveAvatar companions.
 *
 * `stillUrl`  → Real LiveAvatar preview image (same face as the video avatar)
 * `heygenId`  → LiveAvatar avatar ID used by /api/heygen-token
 * `persona`   → Default personality style (can be overridden in onboarding)
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

// ── 8 Corporate Avatars (4F / 4H) ────────────────────────────────────────────

/** 👩 Anna — The default companion (Therapist pose) */
export const ANN_THERAPIST: AvatarConfig = {
  id: 'av-anna',
  name: 'Anna',
  gender: 'female',
  ethnicity: 'white',
  persona: 'warm',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/75e0a87b7fd94f0981ff398b593dd47f_45570/preview_talk_4.webp',
  heygenId: '513fd1b7-7ef9-466d-9af2-344e51eeb833',
  tagline: 'Votre assistant émotionnel IA — chaleureuse, présente, sans jugement.',
};

/** 👩 Judy — Lawyer pose (corporate) */
const JUDY_LAWYER: AvatarConfig = {
  id: 'av-judy',
  name: 'Judy',
  gender: 'female',
  ethnicity: 'white',
  persona: 'calm',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/a7c86cb77b3144948bf8020f6e734bbf_45640/preview_talk_1.webp',
  heygenId: '6e32f90a-f566-45be-9ec7-a5f6999ee606',
  tagline: 'Analyse posée et structurée — elle vous aide à voir clair.',
};

/** 👩 June — HR pose (corporate, modern) */
const JUNE_HR: AvatarConfig = {
  id: 'av-june',
  name: 'June',
  gender: 'female',
  ethnicity: 'asian',
  persona: 'energetic',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/74447a27859a456c955e01f21ef18216_45620/preview_talk_1.webp',
  heygenId: '65f9e3c9-d48b-4118-b73a-4ae2e3cbb8f0',
  tagline: 'Dynamique et accessible — un échange positif garanti.',
};

/** 👩 Elenora — Tech Expert (corporate) */
const ELENORA_EXPERT: AvatarConfig = {
  id: 'av-elenora',
  name: 'Elenora',
  gender: 'female',
  ethnicity: 'black',
  persona: 'gentle',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/cbd4a69890a040e6a0d54088e606a559_45610/preview_talk_3.webp',
  heygenId: '8175dfc2-7858-49d6-b5fa-0c135d1c4bad',
  tagline: 'Douce et bienveillante — elle prend le temps qu\'il faut.',
};

/** 👨 Shawn — Therapist pose (professional) */
const SHAWN_THERAPIST: AvatarConfig = {
  id: 'av-shawn',
  name: 'Shawn',
  gender: 'male',
  ethnicity: 'black',
  persona: 'warm',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/db2fb7fd0d044b908395a011166ab22d_45680/preview_target.webp',
  heygenId: '7b888024-f8c9-4205-95e1-78ce01497bda',
  tagline: 'Chaleureux et rassurant — il écoute sans juger.',
};

/** 👨 Dexter — Lawyer pose (corporate, distinguished) */
const DEXTER_LAWYER: AvatarConfig = {
  id: 'av-dexter',
  name: 'Dexter',
  gender: 'male',
  ethnicity: 'white',
  persona: 'calm',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/e20ac0c902184ff793e75ae4e139b7dc_45600/preview_target.webp',
  heygenId: '0930fd59-c8ad-434d-ad53-b391a1768720',
  tagline: 'Calme et analytique — il vous aide à structurer vos pensées.',
};

/** 👨 Silas — HR pose (corporate, warm) */
const SILAS_HR: AvatarConfig = {
  id: 'av-silas',
  name: 'Silas',
  gender: 'male',
  ethnicity: 'hispanic',
  persona: 'gentle',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/582ee8fe072a48fda3bc68241aeff660_45660/preview_target.webp',
  heygenId: '9650a758-1085-4d49-8bf3-f347565ec229',
  tagline: 'Doux et patient — il accompagne à votre rythme.',
};

/** 👨 Bryan — Tech Expert (corporate, energetic) */
const BRYAN_EXPERT: AvatarConfig = {
  id: 'av-bryan',
  name: 'Bryan',
  gender: 'male',
  ethnicity: 'white',
  persona: 'energetic',
  stillUrl: 'https://files2.heygen.ai/avatar/v3/33c9ac4aead44dfc8bc0082a35062a70_45580/preview_talk_3.webp',
  heygenId: '64b526e4-741c-43b6-a918-4e40f3261c7a',
  tagline: 'Dynamique et motivant — il vous pousse à avancer.',
};

// ── Full catalog ──────────────────────────────────────────────────────────────

/** All 8 avatars — used in the avatar selector */
export const AVATARS: AvatarConfig[] = [
  ANN_THERAPIST,  // 👩 default
  JUDY_LAWYER,    // 👩
  JUNE_HR,        // 👩
  ELENORA_EXPERT, // 👩
  SHAWN_THERAPIST,// 👨
  DEXTER_LAWYER,  // 👨
  SILAS_HR,       // 👨
  BRYAN_EXPERT,   // 👨
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
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec chaleur et une profonde empathie. Tu valides les ressentis avant d\u2019offrir une perspective.',
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
    description: 'Apporte un élan positif et vous aide à passer à l\u2019action.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec enthousiasme et une orientation vers l\u2019action. Tu inspires et célèbres les petites victoires.',
  },
  gentle: {
    label: 'Doux & Rassurant',
    emoji: '🌙',
    description: 'Accompagnement doux pour les moments de grande vulnérabilité.',
    systemPromptSuffix: 'Tu réponds TOUJOURS en français, avec douceur et bienveillance. Tu prends le temps, ne précipites jamais l\u2019utilisateur.',
  },
};

// ── Persistence helpers ───────────────────────────────────────────────────────

const AVATAR_KEY  = 'confidentia_avatar_id';
const NAME_KEY    = 'confidentia_avatar_name';
const PERSONA_KEY = 'confidentia_avatar_persona';

/** Returns the user's saved avatar, or Anna by default */
export function getSavedAvatar(): AvatarConfig {
  try {
    const savedId = localStorage.getItem(AVATAR_KEY);
    if (savedId) {
      const found = AVATARS.find(a => a.id === savedId);
      if (found) return found;
    }
  } catch {}
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
