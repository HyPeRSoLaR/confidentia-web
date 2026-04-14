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
 * LITE mode (future — requires FORCE_FULL_MODE=false + ELEVEN_LABS_* vars):
 *   ElevenLabs handles VAD → STT → LLM → TTS, HeyGen handles lip-sync only.
 *
 * Avatar:  Ann Therapist          (513fd1b7-7ef9-466d-9af2-344e51eeb833)
 * Voice:   Alice - ElevenLabs    (fc73c076-1b17-475d-859d-018ef4af8d76)  ← 3rd-party, imported
 * Context: Welcome to LiveAvatar (98eff136-665c-48ab-a322-0ad3c8c769e0)
 */

const LIVEAVATAR_API = 'https://api.liveavatar.com/v1';
const AVATAR_ID      = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Ann Therapist
const VOICE_ID       = 'fc73c076-1b17-475d-859d-018ef4af8d76'; // Alice - ElevenLabs (3rd-party imported)

// Pre-built context IDs (GET /contexts confirmed working, POST 422 on this plan)
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0'; // "Welcome to LiveAvatar"

// French greeting — sent as `greeting` field so the avatar opens the session
const ARIA_GREETING = 'Bonjour, je suis Ann. Je suis ici pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd\'hui ?';

export async function POST() {
  const apiKey         = process.env.LIVEAVATAR_API_KEY;
  const elevenSecretId = process.env.ELEVEN_LABS_SECRET_ID;
  const elevenAgentId  = process.env.ELEVEN_LABS_AGENT_ID;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY' },
      { status: 500 },
    );
  }

  // FORCE_FULL_MODE=true keeps FULL mode for stable demo (bypasses LITE).
  const forceFullMode = process.env.FORCE_FULL_MODE === 'true';
  const useLiteMode   = !forceFullMode && !!(elevenSecretId && elevenAgentId);
  console.log(`[LiveAvatar] Mode: ${useLiteMode ? 'LITE' : 'FULL'}${forceFullMode ? ' (forced)' : ''}`);

  try {
    let body: Record<string, unknown>;

    if (useLiteMode) {
      body = {
        mode:      'LITE',
        avatar_id: AVATAR_ID,
        eleven_labs_config: {
          secret_id: elevenSecretId,
          agent_id:  elevenAgentId,
        },
      };
    } else {
      // FULL mode — use a pre-built context_id (custom context POST returns 422)
      body = {
        mode:      'FULL',
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id:   VOICE_ID,
          language:   'fr',
          context_id: CONTEXT_ID_WELCOME,
          greeting:   ARIA_GREETING,
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
      body: JSON.stringify(body),
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
