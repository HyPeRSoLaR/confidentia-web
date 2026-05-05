import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Mode FULL — LiveAvatar handles the full pipeline (STT → LLM → TTS).
 *
 * Voice strategy: Use native LiveAvatar voices (confirmed working in WebRTC
 * streaming). These 8 voices are from LiveAvatar's own /v1/voices catalog.
 * All support French when `language: 'fr'` is passed.
 *
 * Voice mapping (8 unique native voices):
 *   Anna    → Ann - IA       (de5574fc) — female, warm
 *   Judy    → Judy - Pro     (4f3b1e99) — female, calm
 *   June    → June - Lifelike(62bbb4b2) — female, energetic
 *   Elenora → Elenora - Pro  (254ffe1e) — female, gentle
 *   Shawn   → Marianne - IA  (8a504f9b) — female-match, warm (best avail.)
 *   Dexter  → Bryan - Pro    (9c8b542a) — male, calm
 *   Silas   → Wayne Liang    (c2527536) — male, gentle
 *   Bryan   → Katya - IA     (864a26b8) — female-match (best avail.)
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0';

/** Native LiveAvatar voice IDs — confirmed working in WebRTC streaming */
const AVATAR_VOICE_MAP: Record<string, string> = {
  anna:    'de5574fc-009e-4a01-a881-9919ef8f5a0c', // Ann - IA
  judy:    '4f3b1e99-b580-4f05-9b67-a5f585be0232', // Judy - Professional
  june:    '62bbb4b2-bb26-4727-bc87-cfb2bd4e0cc8', // June - Lifelike
  elenora: '254ffe1e-c89f-430f-8c36-9e7611d310c0', // Elenora - Professional
  shawn:   '8a504f9b-95dd-42d4-8b0c-edc2567b6382', // Marianne - IA
  dexter:  '9c8b542a-bf5c-4f4c-9011-75c79a274387', // Bryan - Professional
  silas:   'c2527536-6d1f-4412-a643-53a3497dada9', // Wayne Liang
  bryan:   '864a26b8-bfba-4435-9cc5-1dd593de5ca7', // Katya - IA
};

const DEFAULT_VOICE_ID = 'de5574fc-009e-4a01-a881-9919ef8f5a0c'; // Ann - IA

function makeGreeting(name: string) {
  return `Bonjour, je suis ${name}. Je suis ici pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd'hui ?`;
}

export async function POST(req: Request) {
  const apiKey = process.env.LIVEAVATAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY' },
      { status: 500 },
    );
  }

  // Accept optional params from request body
  let avatarId   = DEFAULT_AVATAR_ID;
  let avatarName = DEFAULT_NAME;
  try {
    const body = await req.json();
    if (body?.avatarId)   avatarId   = body.avatarId;
    if (body?.avatarName) avatarName = body.avatarName;
  } catch {} // empty body is fine — use defaults

  // Look up the native voice for this avatar
  const voiceId = AVATAR_VOICE_MAP[avatarName.toLowerCase()] ?? DEFAULT_VOICE_ID;

  console.log(`[LiveAvatar] FULL | Avatar: ${avatarName} (${avatarId}) | Voice: ${voiceId}`);

  try {
    const requestBody = {
      mode:      'FULL',
      avatar_id: avatarId,
      avatar_persona: {
        voice_id:   voiceId,
        language:   'fr',
        context_id: CONTEXT_ID_WELCOME,
        greeting:   makeGreeting(avatarName),
      },
    };

    const tokenRes = await fetch(`${LIVEAVATAR_API}/sessions/token`, {
      method:  'POST',
      headers: {
        'X-API-KEY':    apiKey,
        'Content-Type': 'application/json',
        'accept':       'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      console.error('[LiveAvatar] Token error:', text);
      return NextResponse.json(
        { error: 'LiveAvatar token generation failed', details: text },
        { status: tokenRes.status },
      );
    }

    const data  = await tokenRes.json();
    const token = data?.data?.session_token ?? data?.session_token;
    if (!token) {
      return NextResponse.json(
        { error: 'No session token in response', raw: data },
        { status: 500 },
      );
    }

    return NextResponse.json({ token, mode: 'FULL' });
  } catch (error: any) {
    console.error('[LiveAvatar] Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
