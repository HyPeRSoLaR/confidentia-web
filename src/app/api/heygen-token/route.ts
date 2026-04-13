import { NextResponse } from 'next/server';

/**
 * LiveAvatar session token endpoint (replaces the deprecated HeyGen Streaming API).
 *
 * HeyGen's /v1/streaming.* API was sunset on March 31 2026.
 * The successor is the LiveAvatar platform (api.liveavatar.com).
 *
 * Avatar chosen:  Judy Doctor Standing  (0f563214-1cb5-4dc0-a2f9-43f44e5e6b57)
 *   → warm, professional female avatar with a medical/counselor look
 * Voice   chosen: Judy - Professional   (4f3b1e99-b580-4f05-9b67-a5f585be0232)
 *
 * FULL mode: LiveAvatar handles VAD ▸ STT ▸ LLM ▸ TTS entirely server-side.
 * No manual speak() pipeline needed — the avatar listens and responds autonomously.
 */

const LIVEAVATAR_API = 'https://api.liveavatar.com/v1';

// The avatar and voice used for the Aria counselor persona
const AVATAR_ID = '0f563214-1cb5-4dc0-a2f9-43f44e5e6b57'; // Judy Doctor Standing
const VOICE_ID  = '4f3b1e99-b580-4f05-9b67-a5f585be0232'; // Judy - Professional

const ARIA_CONTEXT = `You are Aria, a warm and empathetic AI mental health counselor working for Confidentia — a confidential mental wellness platform.

Your role:
- Listen actively and provide emotional support
- Help users explore their feelings without judgment
- Offer practical coping strategies drawn from CBT, mindfulness, and positive psychology
- Maintain strict confidentiality — never share or reference what the user says outside this session
- Keep responses to 2-3 short sentences for natural, conversational flow
- Never provide medical diagnoses; gently encourage professional help when appropriate
- Speak warmly, personally, and without clinical jargon

Start by welcoming the user and inviting them to share what is on their mind today.`;

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
        language: 'en',
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
