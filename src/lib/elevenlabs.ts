'use server';
/**
 * lib/elevenlabs.ts — ElevenLabs Text-to-Speech Service
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 *
 * 'use server' keeps the API key server-side — never sent to the client.
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

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  // btoa works in both Node 16+ and browsers — no Buffer dependency needed
  const uint8   = new Uint8Array(arrayBuffer);
  const binary  = uint8.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  const base64Audio = btoa(binary);

  return {
    audioUrl:    `data:audio/mpeg;base64,${base64Audio}`,
    durationSec: Math.ceil(text.length / 15),
  };
}
