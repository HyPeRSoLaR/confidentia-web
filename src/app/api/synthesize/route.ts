import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/synthesize
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side Text-to-Speech proxy for ElevenLabs.
 *
 * The ELEVENLABS_API_KEY is a server-only env var (no NEXT_PUBLIC_ prefix).
 * This route keeps the key on the server and returns raw audio bytes to the
 * client so the browser can play them without ever seeing the key.
 *
 * Request body: { text: string; voiceId?: string }
 * Response:     audio/mpeg stream (same bytes as ElevenLabs /stream endpoint)
 */

const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella — calm, warm

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing ELEVENLABS_API_KEY on server.' },
      { status: 500 },
    );
  }

  let text: string;
  let voiceId: string;
  try {
    const body = await req.json();
    text    = (body.text    as string) ?? '';
    voiceId = (body.voiceId as string) ?? DEFAULT_VOICE_ID;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'text is required.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'xi-api-key':   apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          // eleven_turbo_v2_5: lowest-latency model (~75 ms first-byte)
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability:        0.4,
            similarity_boost: 0.7,
          },
        }),
      },
    );

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error('[/api/synthesize] ElevenLabs error:', upstream.status, errText);
      return NextResponse.json(
        { error: `ElevenLabs API error: ${errText}` },
        { status: upstream.status },
      );
    }

    // Pipe the audio stream straight through to the client.
    // The browser receives raw audio/mpeg bytes — no base64 overhead.
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type':  'audio/mpeg',
        // Disable caching — each synthesis is unique
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    console.error('[/api/synthesize] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
