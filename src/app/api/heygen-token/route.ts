import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Mode FULL — LiveAvatar handles the full pipeline (STT → LLM → TTS).
 *
 * Strategy: 8 separate LiveAvatar projects on the HeyGen dashboard, each
 * with a unique French voice configured as default. One API key per project.
 *
 * The code resolves the API key based on avatar name:
 *   avatarName "Shawn" → process.env.LIVEAVATAR_API_KEY_SHAWN
 *
 * If no per-avatar key is found, falls back to LIVEAVATAR_API_KEY (Ingrid).
 * When using a per-avatar key, we do NOT pass voice_id — the project's
 * default voice (configured on dashboard) is used automatically.
 * When falling back, we pass Ingrid's voice_id explicitly.
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';
const INGRID_VOICE_ID    = '85420b7d-7d8a-4f3e-80af-d7771026f1d6';
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0';

function makeGreeting(name: string) {
  return `Bonjour, je suis ${name}. Je suis ici pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd'hui ?`;
}

export async function POST(req: Request) {
  // Accept optional params from request body
  let avatarId   = DEFAULT_AVATAR_ID;
  let avatarName = DEFAULT_NAME;
  try {
    const body = await req.json();
    if (body?.avatarId)   avatarId   = body.avatarId;
    if (body?.avatarName) avatarName = body.avatarName;
  } catch {} // empty body is fine — use defaults

  // Resolve API key: per-avatar key first, then global fallback
  const perAvatarEnv = `LIVEAVATAR_API_KEY_${avatarName.toUpperCase()}`;
  const perAvatarKey = process.env[perAvatarEnv];
  const globalKey    = process.env.LIVEAVATAR_API_KEY;
  const apiKey       = perAvatarKey || globalKey;
  const usingDedicatedKey = !!perAvatarKey;

  if (!apiKey) {
    return NextResponse.json(
      { error: `No API key found (tried ${perAvatarEnv} and LIVEAVATAR_API_KEY)` },
      { status: 500 },
    );
  }

  console.log(`[LiveAvatar] FULL | ${avatarName} (${avatarId}) | Key: ${usingDedicatedKey ? perAvatarEnv : 'GLOBAL'}`);

  try {
    // Build persona — only pass voice_id when using global key (Ingrid fallback)
    const persona: Record<string, string> = {
      language:   'fr',
      context_id: CONTEXT_ID_WELCOME,
      greeting:   makeGreeting(avatarName),
    };

    if (!usingDedicatedKey) {
      // Fallback: force Ingrid voice when no per-avatar project exists
      persona.voice_id = INGRID_VOICE_ID;
    }
    // When using dedicated key, the project's default voice is used automatically

    const requestBody = {
      mode:      'FULL',
      avatar_id: avatarId,
      avatar_persona: persona,
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
