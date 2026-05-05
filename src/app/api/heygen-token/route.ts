import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Mode FULL — LiveAvatar handles the full pipeline (STT → LLM → TTS).
 *
 * CONFIRMED: Only certain voices work in LiveAvatar WebRTC streaming.
 * HeyGen /v2/voices French catalog voices (Yvette, Claude, etc.) generate
 * valid tokens but CRASH the WebRTC stream — the streaming engine cannot
 * load them at runtime.
 *
 * Ingrid (85420b7d) is the only French voice proven to work in streaming.
 * She is NOT in the native /v1/voices list (20 English voices only), but
 * she's accepted by the streaming engine — likely a HeyGen v1 voice.
 *
 * For J-Day launch: All 8 avatars use Ingrid (stable French voice).
 * Post-launch: Investigate per-project API keys on HeyGen dashboard
 *              to enable unique French voices per avatar.
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';

// Ingrid — the ONLY French voice confirmed working in LiveAvatar WebRTC streaming
const INGRID_VOICE_ID    = '85420b7d-7d8a-4f3e-80af-d7771026f1d6';
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
  try {
    const body = await req.json();
    if (body?.avatarId)   avatarId   = body.avatarId;
    if (body?.avatarName) avatarName = body.avatarName;
  } catch {} // empty body is fine — use defaults

  console.log(`[LiveAvatar] FULL | Avatar: ${avatarName} (${avatarId}) | Voice: Ingrid`);

  try {
    const requestBody = {
      mode:      'FULL',
      avatar_id: avatarId,
      avatar_persona: {
        voice_id:   INGRID_VOICE_ID,
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
