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
 * Voice chosen: Yvette - Warm  (255f8e3f-207d-4cf5-8632-f0ee48ea75ef)
 *   → Native French (fr-FR / Parisian) warm female voice from HeyGen voice library.
 *   → Previously used "Judy - Professional" (4f3b1e99) which is an English-labeled voice;
 *     it was responding in English despite the fr-FR language config.
 *
 * French female voice alternatives (from GET /v3/voices?language=French&gender=female):
 *   • Yvette - Warm           255f8e3f-207d-4cf5-8632-f0ee48ea75ef  ← ACTIVE
 *   • Josephine - Calm        ba61b3b0-a56d-463d-bff1-0eeccd3a899a
 *   • Sylvie - Professional   64cc0b12-9ac3-4e04-a521-cb4627126923
 *   • Ariane - Natural        0e051caf-8e09-47a1-8870-ee24bbbfce36
 *   • Celeste - Professional  0f059f9e-5428-4391-b483-00f916cc6a01
 *   • Camille Martin          59bb21cd-39f4-4b83-98a6-4530b83e008f
 *   • Denise - Friendly       5531756441d34f408e7e60821f2e52a6
 *
 * FULL mode: LiveAvatar handles VAD ▸ STT ▸ LLM ▸ TTS entirely server-side.
 * Language set to fr-FR (Parisian French) — avatar speaks and understands French.
 *
 * ── ElevenLabs LITE mode integration (future build) ─────────────────────────
 * For premium voice quality, HeyGen LiveAvatar supports LITE mode where ElevenLabs
 * handles audio orchestration and HeyGen handles avatar lip-sync only.
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
// Yvette - Warm: native French (fr-FR) female voice — warm, natural Parisian accent
const VOICE_ID  = '255f8e3f-207d-4cf5-8632-f0ee48ea75ef';

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
        language: 'fr-FR',
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
