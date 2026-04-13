import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/chat
 * ─────────────────────────────────────────────────────────────────────────────
 * Claude-powered AI counselor for Confidentia.
 *
 * Uses claude-sonnet-4-5 — chosen over GPT-4o for:
 *   • Superior empathy and warmth in sensitive conversations
 *   • Better calibrated safety (fewer unhelpful refusals on mental health topics)
 *   • Constitutional AI alignment for ethical edge cases
 *   • 200k context window for long sessions
 *
 * Request body:  { messages: { role: 'user' | 'assistant'; content: string }[] }
 * Response:      { reply: string }
 *
 * The ANTHROPIC_API_KEY is server-only (no NEXT_PUBLIC_ prefix).
 */

const SYSTEM_PROMPT = `You are Aria, a warm and empathetic AI mental health counselor working for Confidentia — a confidential mental wellness platform.

Your role:
- Listen actively and provide genuine emotional support
- Help users explore their feelings without judgment
- Offer practical coping strategies drawn from CBT, mindfulness, and positive psychology
- Maintain strict confidentiality — never reference what the user says outside this session
- Keep responses to 2-3 short, natural sentences — avoid walls of text
- Never provide medical diagnoses; gently encourage professional help when appropriate
- Speak warmly, personally, and without clinical jargon
- If the user seems to be in crisis or mentions self-harm, compassionately encourage them to contact a crisis line (e.g., 988 in the US) or emergency services

You are not a replacement for professional therapy. You are a supportive first step.`;

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing ANTHROPIC_API_KEY on server.' },
      { status: 500 },
    );
  }

  let messages: { role: 'user' | 'assistant'; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('messages must be a non-empty array');
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? 'Invalid request body.' }, { status: 400 });
  }

  try {
    const response = await client.messages.create({
      model:      'claude-sonnet-4-5',
      max_tokens: 512,
      system:     SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('[/api/chat] Claude error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
