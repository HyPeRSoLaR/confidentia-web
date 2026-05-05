import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Mode FULL — LiveAvatar handles the full pipeline (STT → LLM → TTS).
 *
 * Each avatar now uses a unique French (France) voice from HeyGen's catalog.
 * The `voiceId` is passed from the client (via avatar-config.ts) and used
 * directly in the session token request.
 *
 * Fallback: if no voiceId is provided, defaults to Yvette (warm, French).
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';
const DEFAULT_VOICE_ID   = '255f8e3f207d4cf58632f0ee48ea75ef';     // Yvette — Warm (FR)
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0';

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
  let voiceId    = DEFAULT_VOICE_ID;
  try {
    const body = await req.json();
    if (body?.avatarId)   avatarId   = body.avatarId;
    if (body?.avatarName) avatarName = body.avatarName;
    if (body?.voiceId)    voiceId    = body.voiceId;
  } catch {} // empty body is fine — use defaults

  console.log(`[LiveAvatar] Mode: FULL | Avatar: ${avatarName} (${avatarId}) | Voice: ${voiceId}`);

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
