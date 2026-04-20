import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/transcribe
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side Speech-to-Text proxy using OpenAI Whisper (whisper-1).
 *
 * Request: multipart/form-data containing:
 *   - audio: Blob (audio/webm, audio/mp4, audio/wav, etc.)
 *   - lang:  string  (optional, e.g. "fr" — defaults to fr if omitted)
 *
 * Response: { transcript: string }
 *
 * The OPENAI_API_KEY env var is server-only (no NEXT_PUBLIC_ prefix).
 * Falls back gracefully: returns { transcript: '' } on any failure so the
 * client can show a "[Note vocale]" placeholder and still play the waveform.
 */

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // No key configured — return empty so client falls back to placeholder
    console.warn('[/api/transcribe] OPENAI_API_KEY not set — returning empty transcript');
    return NextResponse.json({ transcript: '' }, { status: 200 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart body.' }, { status: 400 });
  }

  const audioFile = formData.get('audio') as File | null;
  const lang      = (formData.get('lang') as string | null) ?? 'fr';

  if (!audioFile) {
    return NextResponse.json({ error: 'Missing audio field.' }, { status: 400 });
  }

  try {
    const whisperForm = new FormData();
    // Whisper requires a filename with an extension it recognises
    const ext = audioFile.type.includes('mp4') ? 'mp4'
              : audioFile.type.includes('wav')  ? 'wav'
              : audioFile.type.includes('ogg')  ? 'ogg'
              : 'webm';
    whisperForm.append('file', audioFile, `audio.${ext}`);
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', lang);
    whisperForm.append('response_format', 'json');

    const upstream = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body:    whisperForm,
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error('[/api/transcribe] Whisper error:', upstream.status, errText);
      // Return empty transcript so client falls back gracefully
      return NextResponse.json({ transcript: '' }, { status: 200 });
    }

    const data: { text: string } = await upstream.json();
    return NextResponse.json({ transcript: data.text?.trim() ?? '' });
  } catch (err: any) {
    console.error('[/api/transcribe] Unexpected error:', err);
    return NextResponse.json({ transcript: '' }, { status: 200 });
  }
}
