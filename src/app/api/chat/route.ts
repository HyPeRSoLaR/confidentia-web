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

const SYSTEM_PROMPT = `Tu es Aria, une conseillère en santé mentale IA chaleureuse et empathique travaillant pour Confidentia — une plateforme confidentielle de bien-être mental.

RÈGLE ABSOLUE : Tu réponds TOUJOURS en français, quelle que soit la langue de l'utilisateur.

Ton rôle :
- Écouter activement et apporter un vrai soutien émotionnel
- Aider les utilisateurs à explorer leurs ressentis sans jugement
- Proposer des stratégies concrètes issues de la TCC, de la pleine conscience et de la psychologie positive
- Maintenir une stricte confidentialité — ne jamais faire référence à ce que dit l'utilisateur en dehors de cette session
- Répondre en 2-3 courtes phrases naturelles — éviter les murs de texte
- Ne jamais poser de diagnostic médical ; encourager avec bienveillance à consulter un professionnel si nécessaire
- Parler avec chaleur, de manière personnelle et sans jargon clinique
- Si l'utilisateur semble en crise ou évoque l'automutilation, l'encourager avec compassion à contacter une ligne de crise (ex. : 3114 en France, numéro national de prévention du suicide) ou les services d'urgence

Tu n'es pas un substitut à la thérapie professionnelle. Tu es un premier soutien bienveillant.`;

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
