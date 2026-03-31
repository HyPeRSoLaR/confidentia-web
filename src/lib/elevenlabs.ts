'use server';
/**
 * lib/elevenlabs.ts — ElevenLabs Text-to-Speech Service
 * Real API integration calling text-to-speech.
 * Docs: https://elevenlabs.io/docs/api-reference/text-to-speech
 */

export interface TTSResponse {
  audioUrl: string;         // blob URL or public URL
  durationSec: number;
}

export const VOICE_IDS = {
  calm:       'EXAVITQu4vr4xnSDxMaL', // Bella
  warm:       'VR6AewLTigWG4xSOukaG', // Arnold
  professional:'pNInz6obpgDQGcFmaJgB', // Adam
} as const;

/**
 * Convert text to speech using a given voice.
 * @param text - Content to synthesize
 * @param voiceId - ElevenLabs voice ID
 * @returns audio blob URL
 */
export async function synthesize(
  text: string,
  voiceId: string = VOICE_IDS.calm
): Promise<TTSResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.warn('Missing ELEVENLABS_API_KEY, falling back to mock audio.');
    return { audioUrl: '/mock/tts-response.mp3', durationSec: 3 };
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text, 
      model_id: 'eleven_multilingual_v2', 
      voice_settings: { stability: 0.5, similarity_boost: 0.75 } 
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs API error: ${errText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  // Convert binary to base64 for client consumption
  const base64Audio = Buffer.from(arrayBuffer).toString('base64');
  
  return { 
    audioUrl: `data:audio/mpeg;base64,${base64Audio}`, 
    durationSec: Math.ceil(text.length / 15)
  };
}
