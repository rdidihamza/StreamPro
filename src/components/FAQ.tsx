'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'Does StreamPro IPTV work worldwide?',
    a: 'Yes! StreamPro works in every country around the world. Our servers are globally distributed for the best possible streaming experience no matter where you are. All you need is an internet connection.',
  },
  {
    q: 'What devices are supported?',
    a: 'StreamPro is compatible with Smart TVs (Samsung, LG, Sony), Android devices, iPhone/iPad, Amazon Firestick, MAG boxes, Windows PC, Mac, and any device that supports M3U or Xtream Codes. We support all major IPTV apps.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Yes, we offer a 24-hour free trial so you can test the service before committing. Additionally, all paid plans come with a 7-day money-back guarantee — no questions asked.',
  },
  {
    q: 'How fast is the activation after purchase?',
    a: 'Activation is instant! As soon as your payment is confirmed you will receive your login credentials via email. You can start streaming within 2 minutes of purchase, 24/7.',
  },
  {
    q: 'How many devices can I use simultaneously?',
    a: 'It depends on your plan. Basic allows 1 connection, Premium allows 3 simultaneous connections, and Ultimate allows 5. Each connection can be on a different device.',
  },
  {
    q: 'What internet speed do I need for streaming?',
    a: 'For SD quality: 5 Mbps. For Full HD (1080p): 15 Mbps. For 4K Ultra HD: 25 Mbps. We recommend a stable wired or strong WiFi connection for the best experience.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Absolutely. All payments are processed through industry-standard SSL encryption. We accept PayPal, credit cards, and cryptocurrency. We never store your payment details.',
  },
  {
    q: 'Can I watch live sports events?',
    a: 'Yes! We broadcast all major sports events including Premier League, Champions League, NFL, NBA, UFC, F1, and much more — all in Full HD or 4K depending on the broadcast.',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true });

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
        open ? 'border-purple-500/40' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className={`font-semibold text-sm sm:text-base transition-colors ${open ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
          {q}
        </span>
        <span className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-purple-600 text-white shadow-glow-purple'
            : 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white'
        }`}>
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-5">
              <div className="w-full h-px bg-white/5 mb-4" />
              <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-indigo-700 bottom-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.1 }} />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about StreamPro IPTV.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          Still have questions?{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
            Contact our support team →
          </a>
        </motion.p>
      </div>
    </section>
  );
}
