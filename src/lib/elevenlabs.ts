/**
 * lib/elevenlabs.ts — ElevenLabs Voice Constants (Server-Side Only)
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  DO NOT import this file in client components (`'use client'`).
 *
 * The ELEVENLABS_API_KEY env var is a server-only secret (no NEXT_PUBLIC_
 * prefix).  Next.js never inlines it into the client bundle.
 *
 * For TTS in the chat UI, use the server-side API route:
 *   POST /api/synthesize  →  src/app/api/synthesize/route.ts
 *
 * This file only exports voice IDs / constants that may be shared between the
 * route handler and any future server actions.
 */

export const VOICE_IDS = {
  calm:         'EXAVITQu4vr4xnSDxMaL', // Bella
  warm:         'VR6AewLTigWG4xSOukaG', // Arnold
  professional: 'pNInz6obpgDQGcFmaJgB', // Adam
} as const;
