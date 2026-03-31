import { NextResponse } from 'next/server';

export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing HEYGEN_API_KEY in environment variables' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: { 
        'X-Api-Key': apiKey, 
        'Content-Type': 'application/json' 
      },
    });
    
    if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({ error: 'HeyGen token generation failed', details: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ token: data.data.token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
