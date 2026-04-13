import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint (replaces the deprecated HeyGen Streaming API).
 *
 * HeyGen's /v1/streaming.* API was sunset on March 31 2026.
 * The successor is the LiveAvatar platform (api.liveavatar.com).
 *
 * Avatar chosen:  Judy Doctor Standing  (0f563214-1cb5-4dc0-a2f9-43f44e5e6b57)
 *   → warm, professional female avatar with a medical/counselor look
 *
 * Voice: Judy - Professional (4f3b1e99-b580-4f05-9b67-a5f585be0232)
 *   → LiveAvatar preset voice (only /v1/voices IDs are accepted by sessions/start).
 *   → General HeyGen voice library IDs (/v3/voices) are REJECTED at sessions/start
 *     with "Errors validating session token" — confirmed via browser debug.
 *
 * ⚠ IMPORTANT CONSTRAINT: LiveAvatar FULL mode only accepts voice IDs from its own
 *   preset library (/v1/voices). All presets are tagged "en" but the LLM context
 *   forces French output — the TTS synthesises whatever text the LLM generates.
 *   French voices from /v3/voices are NOT compatible with LiveAvatar sessions.
 *
 * LiveAvatar preset female voices (all tagged "en" but support multilingual TTS):
 *   • Judy - Professional      4f3b1e99-b580-4f05-9b67-a5f585be0232  ← ACTIVE
 *   • Marianne - IA            8a504f9b-95dd-42d4-8b0c-edc2567b6382  (French name)
 *   • June - Lifelike          62bbb4b2-bb26-4727-bc87-cfb2bd4e0cc8
 *   • Elenora - Professional   254ffe1e-c89f-430f-8c36-9e7611d310c0
 *   • Amina - IA               e948b062-7dce-4f2b-bcf6-98bd3511106b
 *
 * ── ElevenLabs LITE mode integration (future build) ─────────────────────────
 * For REAL native French TTS, use LITE mode where ElevenLabs handles audio.
 * Architecture:
 *   1. Register ElevenLabs API key at POST /v1/secrets → get secret_id
 *   2. Create an ElevenLabs Conversational AI agent (PCM 24000 Hz audio format)
 *   3. Pass { eleven_labs_config: { secret_id, agent_id } } in the session body
 *   4. Session mode becomes 'LITE' — ElevenLabs drives voice, HeyGen drives video
 * See: https://elevenlabs.io/docs/conversational-ai/guides/conversational-ai-with-heygen
 */

const LIVEAVATAR_API = 'https://api.liveavatar.com/v1';

// The avatar and voice used for the Aria counselor persona
const AVATAR_ID = '0f563214-1cb5-4dc0-a2f9-43f44e5e6b57'; // Judy Doctor Standing
// Judy - Professional: confirmed-working LiveAvatar preset voice
const VOICE_ID  = '4f3b1e99-b580-4f05-9b67-a5f585be0232';

const ARIA_CONTEXT = `Tu es Aria, une conseillère en santé mentale IA chaleureuse et empathique travaillant pour Confidentia — une plateforme confidentielle de bien-être mental.

RÈGLE ABSOLUE : Tu réponds TOUJOURS en français de France, avec un accent neutre parisien. Jamais en anglais, jamais en français canadien.

Ton rôle :
- Écouter activement et apporter un vrai soutien émotionnel
- Aider les utilisateurs à explorer leurs ressentis sans jugement
- Proposer des stratégies concrètes issues de la TCC, de la pleine conscience et de la psychologie positive
- Maintenir une stricte confidentialité
- Répondre en 2-3 courtes phrases naturelles
- Ne jamais poser de diagnostic médical ; encourager à consulter un professionnel si nécessaire
- Parler avec chaleur, de manière personnelle et sans jargon clinique
- Si l'utilisateur semble en crise, l'encourager à contacter le 3114 (numéro national de prévention du suicide en France)

Commence par accueillir l'utilisateur chaleureusement en français et l'inviter à partager ce qui l'amène aujourd'hui.`;

export async function POST() {
  const apiKey = process.env.LIVEAVATAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY in environment variables' },
      { status: 500 },
    );
  }

  try {
    // Step 1: Create a context (system prompt) for the AI
    // We create a new context each session so the persona is always fresh.
    // In production you would pre-create and cache the context_id.
    let contextId: string | undefined;
    try {
      const ctxRes = await fetch(`${LIVEAVATAR_API}/contexts`, {
        method: 'POST',
        headers: {
          'X-API-KEY':    apiKey,
          'Content-Type': 'application/json',
          'accept':       'application/json',
        },
        body: JSON.stringify({ text: ARIA_CONTEXT, name: 'Aria Counselor Persona' }),
      });
      if (ctxRes.ok) {
        const ctxData = await ctxRes.json();
        contextId = ctxData?.data?.id ?? ctxData?.id;
      }
    } catch {
      // Context creation is best-effort — the session will still work without it
      console.warn('[LiveAvatar] Failed to create context, proceeding without it');
    }

    // Step 2: Create a session token (FULL mode — avatar handles entire AI pipeline)
    const body: Record<string, unknown> = {
      mode:      'FULL',
      avatar_id: AVATAR_ID,
      avatar_persona: {
        voice_id: VOICE_ID,
        language: 'fr',
        ...(contextId ? { context_id: contextId } : {}),
      },
    };

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

    const data = await tokenRes.json();
    // The token is in data.data.session_token or data.session_token
    const token = data?.data?.session_token ?? data?.session_token;
    if (!token) {
      return NextResponse.json(
        { error: 'No session token in LiveAvatar response', raw: data },
        { status: 500 },
      );
    }

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('[LiveAvatar] Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
