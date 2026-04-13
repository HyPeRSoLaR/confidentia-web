import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint — ElevenLabs LITE mode
 * ─────────────────────────────────────────────────────────────────────────────
 * LITE mode: ElevenLabs Conversational AI handles the full voice pipeline
 *   (VAD → STT → LLM → TTS) and sends audio to HeyGen for lip-sync only.
 *
 * This gives us a NATIVE FRENCH voice — the ElevenLabs agent "Aria - Confidentia FR"
 * is configured with a French voice and a French system prompt.
 *
 * Architecture:
 *   Browser mic → LiveKit (HeyGen) → ElevenLabs Agent → TTS audio → HeyGen lip-sync → Browser
 *
 * Setup completed:
 *   1. ✅ ElevenLabs API key "Confidentia LITE 2" (user_read + convai_read + voices_read + TTS)
 *   2. ✅ ElevenLabs agent "Aria - Confidentia FR" (agent_6001kp3x42wse7e96gxgb06w8w9x)
 *   3. ✅ Key registered with LiveAvatar secrets → secret_id in ELEVEN_LABS_SECRET_ID env var
 *
 * Avatar: Judy Doctor Standing (0f563214-1cb5-4dc0-a2f9-43f44e5e6b57)
 *
 * FULL mode fallback (used if LITE env vars are missing):
 *   Voice: Judy - Professional (4f3b1e99-b580-4f05-9b67-a5f585be0232)
 *   Language: fr (LLM context forces French output)
 */

const LIVEAVATAR_API    = 'https://api.liveavatar.com/v1';
const AVATAR_ID         = '0f563214-1cb5-4dc0-a2f9-43f44e5e6b57'; // Judy Doctor Standing
const FALLBACK_VOICE_ID = '4f3b1e99-b580-4f05-9b67-a5f585be0232'; // Judy - Professional

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
  const apiKey         = process.env.LIVEAVATAR_API_KEY;
  const elevenSecretId = process.env.ELEVEN_LABS_SECRET_ID; // b5a5e2e9-b29f-4c36-9eec-97df2977a0fe
  const elevenAgentId  = process.env.ELEVEN_LABS_AGENT_ID;  // agent_6001kp3x42wse7e96gxgb06w8w9x

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing LIVEAVATAR_API_KEY in environment variables' },
      { status: 500 },
    );
  }

  const useLiteMode = !!(elevenSecretId && elevenAgentId);
  console.log(`[LiveAvatar] Mode: ${useLiteMode ? 'LITE (ElevenLabs)' : 'FULL (fallback)'}`);

  try {
    let body: Record<string, unknown>;

    if (useLiteMode) {
      // ── LITE mode: ElevenLabs drives voice, HeyGen drives video lip-sync ──
      body = {
        mode:      'LITE',
        avatar_id: AVATAR_ID,
        eleven_labs_config: {
          secret_id: elevenSecretId,
          agent_id:  elevenAgentId,
        },
      };
    } else {
      // ── FULL mode fallback: HeyGen handles entire AI pipeline ─────────────
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
        console.warn('[LiveAvatar] Failed to create context, proceeding without it');
      }

      body = {
        mode:      'FULL',
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: FALLBACK_VOICE_ID,
          language: 'fr',
          ...(contextId ? { context_id: contextId } : {}),
        },
      };
    }

    // ── Create session token ─────────────────────────────────────────────────
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
        { error: 'No session token in LiveAvatar response', raw: data },
        { status: 500 },
      );
    }

    return NextResponse.json({ token, mode: useLiteMode ? 'LITE' : 'FULL' });
  } catch (error: any) {
    console.error('[LiveAvatar] Unexpected error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
