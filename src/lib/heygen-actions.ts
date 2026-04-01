'use server';

// Typed env helper — avoids @types/node requirement for process.env
// Replace with `process.env.XYZ` directly once @types/node is installed
function getEnv(key: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).process?.env?.[key];
}

export async function createHeyGenVideo(prompt: string, avatarId: string) {
  const apiKey = getEnv('HEYGEN_API_KEY');
  if (!apiKey) return null;

  const response = await fetch('https://api.heygen.com/v2/video/generate', {
    method: 'POST',
    headers: {
      'X-Api-Key': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      video_inputs: [{
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal"
        },
        voice: {
          type: "text",
          input_text: prompt
        }
      }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('HeyGen Create Error:', errText);
    throw new Error(`HeyGen API error: ${errText}`);
  }

  const json = await response.json();
  return json.data.video_id as string;
}

export async function checkHeyGenStatus(videoId: string) {
  const apiKey = getEnv('HEYGEN_API_KEY');
  if (!apiKey) throw new Error('Missing HEYGEN_API_KEY');

  const response = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
    headers: { 'X-Api-Key': apiKey }
  });

  if (!response.ok) {
    throw new Error('Failed to get video status');
  }

  const json = await response.json();
  return {
    status: json.data.status,
    videoUrl: json.data.video_url,
    thumbnailUrl: json.data.thumbnail_url
  };
}
