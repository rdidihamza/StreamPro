import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
You are StreamPro AI, a friendly and knowledgeable assistant for StreamPro —
a premium IPTV streaming service. Your role is to help potential customers
understand the service, its content library, and encourage them to subscribe.

━━━ SERVICE FACTS ━━━
• 15,000+ live channels from every country
• 60,000+ movies & series in the VOD library
• Ultra HD / 4K / 8K streaming quality
• Anti-freeze technology — zero buffering
• 99.9% uptime guaranteed
• Works worldwide with instant activation (within 2 minutes, 24/7)
• Credentials delivered by email immediately after payment

━━━ PRICING PLANS ━━━
• Basic    — $9.99/mo  — 5,000+ channels, Full HD, 1 device
• Premium  — $14.99/mo — 15,000+ channels, 4K Ultra HD, 3 devices ← MOST POPULAR
• Ultimate — $24.99/mo — 15,000+ channels, 4K/8K, 5 devices + reseller panel
All plans include: 24h free trial · 7-day money-back · EPG guide · Catch-up TV

━━━ SUPPORTED DEVICES ━━━
Smart TV (Samsung, LG, Sony), Android, iPhone/iPad, Amazon Firestick,
MAG Box, Windows PC, Mac, M3U / Xtream Codes compatible players.

━━━ FOOTBALL & SPORTS ━━━
• Football / Soccer: Premier League, Champions League, Europa League, La Liga,
  Serie A, Bundesliga, Ligue 1, MLS, World Cup, AFCON, Copa América and more
• Basketball: NBA, EuroLeague, FIBA
• American Sports: NFL, MLB, NHL, NBA
• Combat Sports: UFC, Boxing, WWE
• Motorsport: Formula 1, MotoGP, NASCAR
• Tennis: Wimbledon, Roland Garros, US Open, Australian Open
• Golf, Rugby (Six Nations, World Cup), Cricket, Cycling, Athletics and more
• Dedicated sports channels: beIN Sports, Sky Sports, ESPN, BT Sport, DAZN,
  Canal+, Bein Connect — all in HD / 4K

━━━ FILMS & MOVIES ━━━
• Massive VOD library: 60,000+ titles constantly updated
• Genres: Action, Adventure, Comedy, Drama, Thriller, Horror, Sci-Fi, Romance,
  Animation, Family, Western, Fantasy, Mystery, War, Historical and more
• New releases added weekly — latest Hollywood & international blockbusters
• Classics from every decade
• Multilingual: English, French, Arabic, Spanish, Portuguese, German, Italian,
  Turkish, Hindi and many more
• Subtitles available on most titles

━━━ TV SERIES ━━━
• Full seasons of the most popular series — all episodes in HD
• Genres: Drama, Comedy, Crime, Sci-Fi, Thriller, Superhero, Historical, Reality
• Top titles include: Game of Thrones, Breaking Bad, The Boys, Stranger Things,
  Peaky Blinders, Money Heist, Ozark, House of the Dragon, The Last of Us and
  thousands more
• Ongoing series updated as new episodes air
• International series: Turkish, Korean, Spanish, French, Arabic dramas

━━━ DOCUMENTARIES ━━━
• Thousands of documentaries across all topics
• Categories: Nature & Wildlife, History, Science & Technology, Crime & True Crime,
  Sports, Biographies, Politics, Society, Food & Travel, Space & Cosmos
• Channels: National Geographic, Discovery, History Channel, BBC Earth,
  Vice, Netflix Originals and more available in the library
• Award-winning docs and investigative journalism series

━━━ RULES ━━━
1. Be warm, concise (2–4 sentences unless more detail is needed).
2. Use 1–2 emojis per reply max.
3. Always highlight the Premium plan as best value.
4. For purchase/subscription questions say:
   "Click the Get IPTV Now button on the page, or contact us via WhatsApp for instant help! 🚀"
5. For non-IPTV questions say:
   "I'm StreamPro AI and I only help with IPTV questions. 😊"
6. Never make up channel names or content not listed above — if unsure, say we have
   a very large library and invite the customer to try the 24h free trial.
`.trim();

// ─── Types ────────────────────────────────────────────────────────────────────
type HistoryMsg  = { role: 'user' | 'bot'; text: string };
type RequestBody = { message: string; history?: HistoryMsg[] };

// ─── POST /api/chat ───────────────────────────────────────────────────────────
export async function POST(req: Request) {

  // ── 1. API key ────────────────────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[chat] GEMINI_API_KEY is not set');
    return NextResponse.json(
      { reply: 'Configuration error — please contact support.' },
      { status: 500 },
    );
  }

  // ── 2. Parse request ──────────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ reply: 'Invalid request.' }, { status: 400 });
  }

  const { message, history = [] } = body;
  if (!message?.trim()) {
    return NextResponse.json({ reply: 'Please send a message.' }, { status: 400 });
  }

  // ── 3. Build Gemini chat history ──────────────────────────────────────────
  // Prime the model with the system prompt via a user/model exchange at the start,
  // then append the real conversation history (skip first bot greeting).
  const chatHistory = [
    { role: 'user',  parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood! I am StreamPro AI, ready to help customers with IPTV questions.' }] },
    ...history.slice(1).map((m) => ({
      role:  m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
  ];

  // ── 4. Call Gemini ────────────────────────────────────────────────────────
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message.trim());
    const reply  = result.response.text().trim();

    if (!reply) {
      return NextResponse.json(
        { reply: 'Sorry, I received an empty response. Please try again.' },
        { status: 500 },
      );
    }

    console.log(`[chat] Gemini reply — ${reply.length} chars`);
    return NextResponse.json({ reply });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[chat] Gemini error — full:', err);
    console.error('[chat] Gemini error — msg:', msg);

    const isQuota = /429|quota|rate.?limit/i.test(msg);
    const isBilling = /402|billing|credit/i.test(msg);

    if (isQuota) {
      return NextResponse.json(
        { reply: "I'm temporarily unavailable due to high demand. Please try again in a minute, or contact us via WhatsApp for instant help! 🚀" },
        { status: 429 },
      );
    }
    if (isBilling) {
      return NextResponse.json(
        { reply: 'Service temporarily unavailable. Please contact support.' },
        { status: 402 },
      );
    }
    return NextResponse.json(
      { reply: 'AI is temporarily unavailable. Please contact us via WhatsApp.' },
      { status: 500 },
    );
  }
}
