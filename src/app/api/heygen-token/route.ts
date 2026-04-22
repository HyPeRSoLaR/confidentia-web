import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint
 * ─────────────────────────────────────────────────────────────────────────────
 * LITE mode (default — native Parisian French voices):
 *   ElevenLabs Conversational AI handles VAD → STT → LLM → TTS.
 *   Each avatar has its own ElevenLabs agent with a unique French voice.
 *   LiveAvatar handles lip-sync only.
 *
 * FULL mode (fallback — English voices with language:'fr'):
 *   Used when FORCE_FULL_MODE=true or ElevenLabs secrets are missing.
 *   LiveAvatar handles everything server-side.
 */

const LIVEAVATAR_API     = 'https://api.liveavatar.com/v1';
const DEFAULT_AVATAR_ID  = '513fd1b7-7ef9-466d-9af2-344e51eeb833'; // Anna
const DEFAULT_NAME       = 'Anna';
const DEFAULT_VOICE_ID   = 'de5574fc-009e-4a01-a881-9919ef8f5a0c'; // Ann - IA (FULL fallback)
const DEFAULT_AGENT_ID   = 'agent_6001kp3x42wse7e96gxgb06w8w9x'; // Anna - Aria FR (LITE)
const CONTEXT_ID_WELCOME = '98eff136-665c-48ab-a322-0ad3c8c769e0';

function makeGreeting(name: string) {
  return `Bonjour, je suis ${name}. Je suis ici pour vous écouter en toute confidentialité. Comment vous sentez-vous aujourd'hui ?`;
}

export async function POST(req: Request) {
  const apiKey         = process.env.LIVEAVATAR_API_KEY;
  const elevenSecretId = process.env.ELEVEN_LABS_SECRET_ID;

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
  let agentId    = DEFAULT_AGENT_ID;
  try {
    const body = await req.json();
    if (body?.avatarId)           avatarId   = body.avatarId;
    if (body?.avatarName)         avatarName = body.avatarName;
    if (body?.voiceId)            voiceId    = body.voiceId;
    if (body?.elevenLabsAgentId)  agentId    = body.elevenLabsAgentId;
  } catch {} // empty body is fine — use defaults

  // Prefer LITE mode for native French voices (unless FORCE_FULL_MODE=true)
  const forceFullMode = process.env.FORCE_FULL_MODE === 'true';
  const useLiteMode   = !forceFullMode && !!elevenSecretId;
  console.log(`[LiveAvatar] Mode: ${useLiteMode ? 'LITE' : 'FULL'}${forceFullMode ? ' (forced)' : ''} | Avatar: ${avatarName} (${avatarId}) | Agent: ${agentId}`);

  try {
    let requestBody: Record<string, unknown>;

    if (useLiteMode) {
      // LITE mode — ElevenLabs handles conversation with native French voice
      requestBody = {
        mode:      'LITE',
        avatar_id: avatarId,
        eleven_labs_config: {
          secret_id: elevenSecretId,
          agent_id:  agentId,
        },
      };
    } else {
      // FULL mode fallback — native LiveAvatar voice + language:'fr'
      requestBody = {
        mode:      'FULL',
        avatar_id: avatarId,
        avatar_persona: {
          voice_id:   voiceId,
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
