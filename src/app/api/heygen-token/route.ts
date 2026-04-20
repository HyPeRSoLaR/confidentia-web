import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * FULL mode (default, demo-safe):
 *   HeyGen handles VAD → STT → LLM → TTS server-side.
 *   context_id is ONE of the 5 pre-built LiveAvatar contexts (POST /contexts
 *   returns 422 on the current plan — custom contexts not supported).
 *   "Welcome to LiveAvatar" (98eff136) is the most neutral base context.
 *   language: 'fr' instructs HeyGen to use French STT + TTS.
 *
 * LITE mode (requires ELEVEN_LABS_* vars + no FORCE_FULL_MODE):
 *   ElevenLabs handles VAD → STT → LLM → TTS, HeyGen handles lip-sync only.
 *
 * Voice:   Ingrid - ElevenLabs   (85420b7d-7d8a-4f3e-80af-d7771026f1d6)
 * Context: Welcome to LiveAvatar (98eff136-665c-48ab-a322-0ad3c8c769e0)
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';
// Ingrid — warm, calm, authentic French voice (UUID format accepted by LiveAvatar)
const INGRID_VOICE_ID    = '85420b7d-7d8a-4f3e-80af-d7771026f1d6';
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0';

function makeGreeting(name: string) {
  return `Bonjour, je suis ${name}. Je suis ici pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd'hui ?`;
}

export async function POST(req: Request) {
  const apiKey         = process.env.LIVEAVATAR_API_KEY;
  const elevenSecretId = process.env.ELEVEN_LABS_SECRET_ID;
  const elevenAgentId  = process.env.ELEVEN_LABS_AGENT_ID;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY' },
      { status: 500 },
    );
  }

  // Accept optional avatarId + avatarName from request body
  let avatarId   = DEFAULT_AVATAR_ID;
  let avatarName = DEFAULT_NAME;
  try {
    const body = await req.json();
    if (body?.avatarId)   avatarId   = body.avatarId;
    if (body?.avatarName) avatarName = body.avatarName;
  } catch {} // empty body is fine — use defaults

  // FORCE_FULL_MODE=true keeps FULL mode for stable demo (bypasses LITE).
  const forceFullMode = process.env.FORCE_FULL_MODE === 'true';
  const useLiteMode   = !forceFullMode && !!(elevenSecretId && elevenAgentId);
  console.log(`[LiveAvatar] Mode: ${useLiteMode ? 'LITE' : 'FULL'}${forceFullMode ? ' (forced)' : ''} | Avatar: ${avatarName} (${avatarId})`);

  try {
    let requestBody: Record<string, unknown>;

    if (useLiteMode) {
      requestBody = {
        mode:      'LITE',
        avatar_id: avatarId,
        eleven_labs_config: {
          secret_id: elevenSecretId,
          agent_id:  elevenAgentId,
        },
      };
    } else {
      // FULL mode — Ingrid voice (French, warm) for ALL avatars
      // The same voice works across all avatar faces — LiveAvatar just lip-syncs
      requestBody = {
        mode:      'FULL',
        avatar_id: avatarId,
        avatar_persona: {
          voice_id:   INGRID_VOICE_ID,
          language:   'fr',
          context_id: CONTEXT_ID_WELCOME,
          greeting:   makeGreeting(avatarName),
        },
      };
    }

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

    return NextResponse.json({ token, mode: useLiteMode ? 'LITE' : 'FULL' });
  } catch (error: any) {
    console.error('[LiveAvatar] Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
