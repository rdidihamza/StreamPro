'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id:   number;
  role: 'bot' | 'user';
  text: string;
  time: string;
};

// ─── Quick chips + predefined answers ────────────────────────────────────────
// Clicking a chip fires handleQuickQuestion() — no API call, instant reply.
const CHIPS: { label: string; answer: string }[] = [
  {
    label:  'Prices?',
    answer: '💰 Our plans start from just $9.99/month!\n\n• Basic — $9.99/mo (1 device, HD)\n• Premium — $14.99/mo (3 devices, 4K) ⭐ Most Popular\n• Ultimate — $24.99/mo (5 devices, 4K/8K + reseller panel)\n\nAll plans include a 24h free trial and 7-day money-back guarantee. Click **Get IPTV Now** to subscribe instantly!',
  },
  {
    label:  'Channels?',
    answer: '📺 We offer 15,000+ live channels including movies, news, sports, kids, and international TV from every country — all in HD and 4K quality!',
  },
  {
    label:  'Sports?',
    answer: '⚽ You can watch all major sports live:\n\n• Football: Premier League, Champions League, La Liga, Serie A\n• Basketball: NBA, EuroLeague\n• American sports: NFL, MLB, NHL\n• Combat: UFC & Boxing\n• Motorsport: Formula 1, MotoGP\n• Tennis, Golf, Rugby and more — all in HD / 4K!',
  },
  {
    label:  'Devices?',
    answer: '📱 StreamPro works on all your devices:\n\n• Smart TV (Samsung, LG, Sony)\n• Android phones & tablets\n• iPhone & iPad\n• Amazon Firestick / Fire TV\n• MAG Box\n• Windows PC & Mac\n• Any device with M3U or Xtream Codes support\n\nOne subscription, unlimited screens!',
  },
  {
    label:  'Free trial?',
    answer: '🎉 Yes! We offer a 24-hour free trial on all plans. Click the **Get IPTV Now** button or reach us via the WhatsApp button for instant activation — no credit card required! 🚀',
  },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const WELCOME: Message = {
  id:   1,
  role: 'bot',
  text: "Hi 👋 I'm StreamPro AI! Ask me anything about our IPTV service — pricing, channels, devices and more.",
  time: now(),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState('');
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clear unread + focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // ── Quick question — predefined answer, no API call ───────────────────────
  const handleQuickQuestion = (chip: typeof CHIPS[number]) => {
    if (loading) return;

    const userMsg:  Message = { id: Date.now(),     role: 'user', text: chip.label,  time: now() };
    const botMsg:   Message = { id: Date.now() + 1, role: 'bot',  text: chip.answer, time: now() };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!open) setUnread((n) => n + 1);
  };

  // ── Send (typed messages → API) ────────────────────────────────────────────
  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const historySnap = messages.map(({ role, text }) => ({ role, text }));

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', text: trimmed, time: now() },
    ]);
    setInput('');
    setLoading(true);

    let reply = 'AI is temporarily unavailable. Please contact us via WhatsApp. 😕';

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed, history: historySnap }),
      });

      let json: Record<string, string> = {};
      try { json = await res.json(); } catch { /* ignore parse errors */ }

      if (res.ok && json.reply) {
        reply = json.reply;
      } else {
        reply = json.reply ?? json.error ?? `Something went wrong (${res.status}). Please try again.`;
        console.warn('[ChatBot]', res.status, reply);
      }
    } catch (err) {
      console.error('[ChatBot] network error:', err);
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, role: 'bot', text: reply, time: now() },
    ]);
    setLoading(false);
    if (!open) setUnread((n) => n + 1);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Chat window ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[84px] right-5 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width:           340,
              height:          420,
              background:      '#0f0c29',
              border:          '1px solid rgba(139,92,246,0.35)',
              boxShadow:       '0 8px 40px rgba(124,58,237,0.35)',
            }}
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">StreamPro AI</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                    <span className="text-[10px] text-white/70">
                      {loading ? 'Typing…' : 'Online • Gemini AI'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ── Messages ────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{ background: '#0f0c29' }}>

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[78%] flex flex-col gap-0.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'text-gray-200 rounded-bl-sm border border-white/8'
                    }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }
                      : { background: '#1a1040' }
                    }>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-gray-600 px-0.5">{msg.time}</span>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing dots */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="px-3 py-2.5 rounded-xl rounded-bl-sm border border-white/8"
                      style={{ background: '#1a1040' }}>
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400 block"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* ── Quick chips ──────────────────────────────────────────────── */}
            <div className="flex gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0 scrollbar-hide"
              style={{ background: '#130f35', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleQuickQuestion(chip)}
                  disabled={loading}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium text-purple-300 border border-purple-500/30 hover:border-purple-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'rgba(124,58,237,0.08)' }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* ── Input bar ────────────────────────────────────────────────── */}
            <div className="px-3 py-2.5 flex-shrink-0"
              style={{ background: '#130f35', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about IPTV…"
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-lg text-xs text-white placeholder-gray-500 outline-none transition-all disabled:opacity-50"
                  style={{
                    background: '#0f0c29',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#0891b2)' }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <p className="text-center text-[9px] text-gray-700 mt-1.5">
                Powered by Gemini AI · Responses may vary
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ─────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-lg"
        style={{
          width:      52,
          height:     52,
          background: 'linear-gradient(135deg,#7c3aed,#0891b2)',
          boxShadow:  '0 4px 24px rgba(124,58,237,0.5)',
        }}
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="msg"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {unread > 0 && !open && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
