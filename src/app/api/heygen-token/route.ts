import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * Mode FULL — LiveAvatar handles the full pipeline (STT → LLM → TTS).
 *
 * The client sends:
 *   - avatarId / avatarName / voiceId → avatar identity
 *   - persona → tone style (warm/calm/energetic/gentle)
 *   - sessionContext → dynamic context built from user memory
 *     (onboarding pathology, check-in emotions, session count)
 *
 * The sessionContext is injected as the `greeting` which primes the LLM
 * with all the user context for a personalized therapeutic session.
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833';
const DEFAULT_NAME       = 'Anna';
const INGRID_VOICE_ID    = '85420b7d-7d8a-4f3e-80af-d7771026f1d6';

function defaultGreeting(name: string) {
  return `Tu es ${name}, thérapeute IA de Confidentia. Tu parles uniquement en français. Tu adoptes un ton chaleureux et empathique. Commence par accueillir l'utilisateur et demande-lui comment il se sent.`;
}

export async function POST(req: Request) {
  const apiKey = process.env.LIVEAVATAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY' },
      { status: 500 },
    );
  }

  let avatarId       = DEFAULT_AVATAR_ID;
  let avatarName     = DEFAULT_NAME;
  let voiceId        = INGRID_VOICE_ID;
  let sessionContext = '';

  try {
    const body = await req.json();
    if (body?.avatarId)       avatarId       = body.avatarId;
    if (body?.avatarName)     avatarName     = body.avatarName;
    if (body?.voiceId)        voiceId        = body.voiceId;
    if (body?.sessionContext) sessionContext = body.sessionContext;
  } catch {}

  // Use client-built session context or fallback
  const greeting = sessionContext || defaultGreeting(avatarName);

  // Therapeutic context created on LiveAvatar dashboard
  const contextId = '7083f9f1-2a41-456f-97a9-a917a7d0cc7e';

  console.log(`[LiveAvatar] FULL | ${avatarName} | Voice: ${voiceId.slice(0,8)}… | Context: ${contextId ? 'custom' : 'default'} | Greeting: ${greeting.slice(0, 80)}…`);

  try {
    const persona: Record<string, any> = {
      voice_id: voiceId,
      language: 'fr',
      greeting,
    };

    // If a custom context exists on the dashboard, use it
    if (contextId) {
      persona.context_id = contextId;
    }

    const requestBody = {
      mode:           'FULL',
      avatar_id:      avatarId,
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
