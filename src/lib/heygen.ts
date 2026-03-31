/**
 * lib/heygen.ts — HeyGen Video Avatar Service
 * Client module that polls Server Actions to avoid serverless timeouts.
 * Docs: https://docs.heygen.com/reference/streaming-api
 */
import { createHeyGenVideo, checkHeyGenStatus } from './heygen-actions';

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
  avatarId = 'Anna_public_3_20240108'
): Promise<AvatarVideoResponse> {
  try {
    const videoId = await createHeyGenVideo(prompt, avatarId);
    if (!videoId) {
      console.warn('Missing HEYGEN_API_KEY, falling back to mock video.');
      return { videoUrl: '/mock/avatar-response.mp4', thumbnailUrl: '/mock/avatar-thumb.jpg', durationSec: 8 };
    }

    console.log('[HeyGen] Started generation, polling status...', videoId);

    // Poll up to 60 times (x 3s = 3 minutes)
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await checkHeyGenStatus(videoId);
      console.log(`[HeyGen] Poll ${i}: status = ${res.status}`);
      
      if ((res.status === 'completed' || res.status === 'success') && res.videoUrl) {
        return { videoUrl: res.videoUrl, thumbnailUrl: res.thumbnailUrl || '', durationSec: 8 };
      } else if (res.status === 'failed') {
        throw new Error('HeyGen generated failed status');
      }
    }
    throw new Error('HeyGen generation polling timed out');
  } catch (err) {
    console.error('[HeyGen] generateAvatarVideo failed:', err);
    return { videoUrl: '/mock/avatar-response.mp4', thumbnailUrl: '/mock/avatar-thumb.jpg', durationSec: 8 };
  }
}
