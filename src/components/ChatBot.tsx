'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id:   number;
  role: 'bot' | 'user';
  text: string;
  time: string;
};

// ─── Quick-question chips ─────────────────────────────────────────────────────
//  Shown as one-tap shortcuts below the message list.
const QUICK_QUESTIONS = [
  'What are your IPTV prices?',
  'How many channels do you offer?',
  'Do you have sports channels?',
  'What devices are supported?',
  'How fast is activation?',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const INITIAL_MESSAGE: Message = {
  id:   1,
  role: 'bot',
  text: "Hi 👋 I'm StreamPro AI! Need help choosing the best IPTV plan or have questions about our service? I'm here to help!",
  time: formatTime(),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [typing,  setTyping]  = useState(false);
  const [unread,  setUnread]  = useState(1);

  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Scroll to latest message whenever messages change or chat opens
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }, [open, messages]);

  // Focus the input when the window opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  // ── Core send function ─────────────────────────────────────────────────────
  //
  //  1. Optimistically add the user bubble to the UI.
  //  2. Snapshot the current message list BEFORE the state update (React's
  //     setState is async, so `messages` at this point still lacks the new msg).
  //  3. POST { message, history } to /api/chat.
  //  4. Append the AI reply — or a friendly error bubble if the call fails.
  //
  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    // Capture history BEFORE we add the current user message to state.
    // The API needs previous turns as context — not the turn being sent.
    const historySnapshot: { role: 'user' | 'bot'; text: string }[] =
      messages.map(({ role, text }) => ({ role, text }));

    const userMsg: Message = {
      id:   Date.now(),
      role: 'user',
      text: trimmed,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed, history: historySnapshot }),
      });

      if (!res.ok) {
        // Surface the API-level error message if present
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? `HTTP ${res.status}`);
      }

      const { reply } = (await res.json()) as { reply: string };

      const botMsg: Message = {
        id:   Date.now() + 1,
        role: 'bot',
        text: reply,
        time: formatTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!open) setUnread((n) => n + 1);

    } catch (err) {
      console.error('[ChatBot] API error:', err);

      const errMsg: Message = {
        id:   Date.now() + 1,
        role: 'bot',
        text: "Sorry, I'm having trouble connecting right now 😕 Please try the WhatsApp button on the left for instant support!",
        time: formatTime(),
      };

      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setTyping(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Chat window ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.85, y: 20  }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] max-h-[600px] flex flex-col rounded-3xl glass-dark border border-purple-500/30 shadow-glow-purple overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-700/80 to-cyan-700/80 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">StreamPro AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-300">
                      {typing ? 'Thinking…' : 'Online • powered by Gemini'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl glass border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/30 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[380px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot avatar */}
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-purple-600 to-cyan-600 text-white rounded-br-sm'
                          : 'glass border border-white/10 text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 px-1">{msg.time}</span>
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing / thinking indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="glass border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Invisible anchor — always scrolled into view */}
              <div ref={bottomRef} />
            </div>

            {/* Quick-question chips */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5 flex-shrink-0 scrollbar-hide">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={typing}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs glass border border-purple-500/30 text-purple-300 hover:border-purple-400 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Text input + send button */}
            <div className="p-4 border-t border-white/5 flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about IPTV…"
                  disabled={typing}
                  className="flex-1 px-4 py-2.5 rounded-xl glass border border-white/10 bg-transparent text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500/50 transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-glow-purple"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Gemini attribution */}
              <p className="text-center text-[10px] text-gray-700 mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" />
                AI responses may vary. Contact support for guaranteed help.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(!open)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', bounce: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-glow-purple hover:shadow-glow-cyan transition-all duration-300"
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              exit={{    rotate:  90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate:  90, opacity: 0 }}
              animate={{ rotate:   0, opacity: 1 }}
              exit={{    rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {unread > 0 && !open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
