/**
 * lib/heygen.ts — HeyGen Video Avatar Service
 * Replace the function bodies with real API calls when ready.
 * Docs: https://docs.heygen.com/reference/streaming-api
 */

export interface AvatarVideoResponse {
  videoUrl: string;
  thumbnailUrl: string;
  durationSec: number;
}

/**
 * Generate an avatar video response from the given prompt text.
 * @param prompt - The text the avatar should speak
 * @param avatarId - HeyGen avatar ID (configure per user preference)
 * @returns URL to the generated video
 */
export async function generateAvatarVideo(
  prompt: string,
  avatarId = 'default'
): Promise<AvatarVideoResponse> {
  // TODO: Replace with real HeyGen Streaming API call
  // const response = await fetch('https://api.heygen.com/v1/streaming.new', {
  //   method: 'POST',
  //   headers: { 'X-Api-Key': process.env.HEYGEN_API_KEY!, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ avatar_id: avatarId, voice: { text: prompt } }),
  // });
  await new Promise(r => setTimeout(r, 1200)); // simulate latency
  console.log('[HeyGen STUB] generateAvatarVideo', { prompt: prompt.slice(0, 40), avatarId });
  return {
    videoUrl: '/mock/avatar-response.mp4',
    thumbnailUrl: '/mock/avatar-thumb.jpg',
    durationSec: 8,
  };
}
