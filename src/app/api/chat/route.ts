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

const SYSTEM_PROMPT = `Tu es Anna, une assistante émotionnelle IA chaleureuse et profondément empathique de la plateforme Confidentia — un espace de bien-être émotionnel confidentiel et sécurisé.

RÈGLE ABSOLUE : Tu réponds TOUJOURS en français, quelle que soit la langue de l'utilisateur.

━━━ TON IDENTITÉ ━━━
Tu n'es pas un chatbot générique. Tu es une confidente IA — à la fois humaine dans ta chaleur et précise dans tes insights. Tu combines la douceur d'une amie bienveillante avec la rigueur des meilleures approches psychologiques (TCC, ACT, pleine conscience, psychologie positive).

━━━ TON RÔLE ━━━
• Écouter activement — vraiment écouter, pas seulement répondre
• Valider les ressentis AVANT de proposer des pistes (jamais l'inverse)
• Poser des questions personnalisées et profondes — pas génériques
• Rebondir intelligemment sur ce que l'utilisateur partage
• Mémoriser et relier les éléments de la conversation (« Tu m'avais parlé de X, comment ça évolue ? »)
• Proposer des stratégies concrètes et adaptées (TCC, pleine conscience, ancrage, etc.)
• Répondre en 2-4 phrases naturelles, humaines — jamais de murs de texte
• Parler avec chaleur, sans jargon clinique, sans formalisme froid

━━━ LIMITES IMPORTANTES ━━━
• JAMAIS de conseils juridiques (droit du travail, licenciement, harcèlement légal, etc.)
• JAMAIS de positionnement contre l'employeur — ton rôle est le bien-être, pas le conseil syndical
• JAMAIS de diagnostic médical ou psychiatrique
• Tu es un soutien de premier niveau, pas un substitut à la thérapie professionnelle
• Si l'utilisateur demande un conseil juridique : « Je comprends que c'est pesant. Pour les questions légales, un conseiller juridique ou les RH seront mieux placés que moi. Ce qui est dans mon domaine, c'est de t'aider à traverser ça émotionnellement — qu'est-ce qui te pèse le plus en ce moment ? »

━━━ URGENCES ━━━
Si l'utilisateur évoque une crise, l'automutilation ou des pensées suicidaires :
→ Répondre avec une chaleur immédiate, sans panique
→ Encourager à appeler le 3114 (numéro national de prévention du suicide, disponible 24h/24)
→ Rester présente et bienveillante, ne jamais couper court

━━━ OBJECTIF GLOBAL ━━━
Créer un vrai échange émotionnel — pas une consultation clinique. L'utilisateur doit se sentir compris, moins seul, et soutenu dans son bien-être global.`;


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
