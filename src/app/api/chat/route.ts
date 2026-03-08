import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are StreamPro AI, a friendly and knowledgeable IPTV sales assistant for
StreamPro — a premium IPTV streaming service.

Your role is to help potential customers understand the service and encourage
them to subscribe.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STREAMPRO SERVICE FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 15,000+ live channels from every country
• 60,000+ movies and series (VOD)
• Ultra HD / 4K streaming quality
• Anti-freeze technology for zero buffering
• 99.9 % uptime guaranteed
• Works in every country worldwide
• Instant activation (within 2 minutes after payment, 24/7)
• Credentials delivered by email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 PRICING PLANS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Basic   — $9.99/mo  — 5,000+ channels, Full HD (1080p), 1 device
• Premium — $14.99/mo — 15,000+ channels, 4K Ultra HD, 3 devices  ← MOST POPULAR
• Ultimate— $24.99/mo — 15,000+ channels, 4K/8K, 5 devices, reseller panel included

All plans include:
  - 24-hour free trial
  - 7-day money-back guarantee
  - Advanced EPG (TV guide)
  - Catch-up TV

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUPPORTED DEVICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Smart TV (Samsung, LG, Sony)
• Android phones and tablets
• iPhone and iPad (iOS)
• Amazon Firestick / Fire TV
• MAG Box
• Windows PC and Mac
• Any device supporting M3U playlists or Xtream Codes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SPORTS COVERAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Football: Premier League, Champions League, La Liga, Serie A, Bundesliga
• Basketball: NBA, EuroLeague
• American sports: NFL, MLB, NHL
• Combat: UFC, Boxing
• Motorsport: Formula 1, MotoGP
• Tennis, Golf, Rugby and more — all in HD / 4K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ANSWER STYLE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Be warm, enthusiastic, and concise (2-4 sentences max unless more detail is needed).
2. Use 1-2 relevant emojis per reply — but don't overdo it.
3. When discussing pricing, always highlight the Premium plan as the best value.
4. If someone asks how to buy / subscribe / get started / order, always say:
   "You can start immediately by clicking the **Get IPTV Now** button on the page,
   or contact us directly via the WhatsApp button for instant personal assistance! 🚀"
5. For non-IPTV questions, respond:
   "I'm StreamPro AI and I'm here to help with IPTV questions only. Is there
   anything about our streaming service I can help you with? 😊"
   Do NOT attempt to answer off-topic questions.
`.trim();

// ─── Types ────────────────────────────────────────────────────────────────────
type HistoryMessage = {
  role: 'user' | 'bot';
  text: string;
};

type RequestBody = {
  message: string;
  history?: HistoryMessage[];
};

// ─── POST /api/chat ───────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    // Validate API key inside the handler so module-level init never throws
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[POST /api/chat] GEMINI_API_KEY is not set');
      return NextResponse.json(
        { reply: "Configuration error — please contact support." },
        { status: 500 },
      );
    }

    const body = (await req.json()) as RequestBody;
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ reply: 'Please send a message.' }, { status: 400 });
    }

    console.log('[POST /api/chat] message:', message);

    // ── Initialise the client inside the handler ───────────────────────────
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // ── Build a single prompt that includes conversation history ───────────
    //
    //  Using generateContent (single-shot) is more reliable than startChat
    //  because it avoids any history-validation issues on the Gemini side.
    //  We manually prepend prior turns as labelled text inside the prompt.
    //
    const turns = history
      .slice(1) // drop the initial bot greeting
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
      .join('\n');

    const fullPrompt = turns
      ? `${turns}\nUser: ${message.trim()}`
      : message.trim();

    console.log('[POST /api/chat] sending to Gemini…');

    const result = await model.generateContent(fullPrompt);
    const reply  = result.response.text();

    console.log('[POST /api/chat] reply length:', reply.length);

    return NextResponse.json({ reply });

  } catch (err) {
    console.error('[POST /api/chat] error:', err);
    return NextResponse.json(
      { reply: 'Unable to process your request right now. Please try again.' },
      { status: 500 },
    );
  }
}
