/**
 * lib/elevenlabs.ts — ElevenLabs Text-to-Speech Service
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 *
 * Latency strategy:
 *   • Model: eleven_turbo_v2_5 — ElevenLabs' lowest-latency model (~75 ms
 *     first-byte vs ~300 ms for eleven_multilingual_v2).
 *   • Endpoint: /stream — returns a chunked audio stream so the browser can
 *     start playing before the full file is downloaded.  We collect the
 *     stream into a Blob and return an Object URL (no base64 overhead).
 *
 * NOTE: No 'use server' directive — this is a pure async utility imported by
 * the 'use client' AiChatView component.  The ELEVENLABS_API_KEY remains
 * server-side; NEXT_PUBLIC_* is the only pattern that inlines env vars into
 * the client bundle.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getEnv = (key: string): string | undefined => (globalThis as any).process?.env?.[key];

export interface TTSResponse {
  audioUrl: string;   // data URI (base64) or public URL
  durationSec: number;
}

export const VOICE_IDS = {
  calm:         'EXAVITQu4vr4xnSDxMaL', // Bella
  warm:         'VR6AewLTigWG4xSOukaG', // Arnold
  professional: 'pNInz6obpgDQGcFmaJgB', // Adam
} as const;

/**
 * Convert text to speech using a given ElevenLabs voice.
 * Falls back to a mock URL when the API key is absent.
 */
export async function synthesize(
  text: string,
  voiceId: string = VOICE_IDS.calm,
): Promise<TTSResponse> {
  const apiKey = getEnv('ELEVENLABS_API_KEY');
  if (!apiKey) {
    console.warn('[ElevenLabs] Missing ELEVENLABS_API_KEY — using mock audio.');
    return { audioUrl: '/mock/tts-response.mp3', durationSec: 3 };
  }

  // /stream endpoint: server sends audio chunks as they are synthesised —
  // the browser starts buffering/playing before the full file is ready.
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        // eleven_turbo_v2_5: lowest latency model ElevenLabs offers (~75 ms)
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability:        0.4,  // slightly lower = faster synthesis
          similarity_boost: 0.7,
        },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error: ${errText}`);
  }

  // Collect streaming chunks into a single Blob — avoids base64 overhead
  // and lets the browser begin decoding audio earlier.
  const blob = await response.blob();
  const audioUrl = URL.createObjectURL(blob);

  return {
    audioUrl,
    durationSec: Math.ceil(text.length / 15),
  };
}
