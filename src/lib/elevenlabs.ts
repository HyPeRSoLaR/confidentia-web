/**
 * lib/elevenlabs.ts — ElevenLabs Text-to-Speech Service
 * Replace the function body with real API calls when ready.
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
  // TODO: Replace with real ElevenLabs API call
  // const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
  //   method: 'POST',
  //   headers: {
  //     'xi-api-key': process.env.ELEVENLABS_API_KEY!,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  // });
  // const blob = await response.blob();
  // return { audioUrl: URL.createObjectURL(blob), durationSec: text.length / 15 };
  await new Promise(r => setTimeout(r, 800));
  console.log('[ElevenLabs STUB] synthesize', { text: text.slice(0, 40), voiceId });
  return {
    audioUrl: '/mock/tts-response.mp3',
    durationSec: Math.ceil(text.length / 15),
  };
}
