'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Menu, X } from 'lucide-react';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Devices',  href: '#devices'  },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'Reviews',  href: '#reviews'  },
  { label: 'FAQ',      href: '#faq'      },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/60 backdrop-blur-xl shadow-lg shadow-black/30 border-b border-white/5'
          : 'bg-black/20 backdrop-blur-md'
      }`}
    >
      {/* ─── Desktop bar ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">

          {/* LEFT — Logo (flex-shrink-0 keeps it from ever compressing) */}
          <a href="#" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-glow-purple group-hover:shadow-glow-cyan transition-all duration-300">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight whitespace-nowrap">
              Stream<span className="gradient-text">Pro</span>
            </span>
          </a>

          {/* CENTER — Nav links (flex-1 + justify-center keeps them centred
              regardless of logo or CTA button widths) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative whitespace-nowrap text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-400 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </div>

          {/* RIGHT — CTA buttons (flex-shrink-0 keeps them from wrapping) */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-3">
            <a
              href="#pricing"
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold border border-purple-500/50 text-purple-300 hover:border-purple-400 hover:text-white transition-all duration-300"
            >
              View Plans
            </a>
            <a
              href="#pricing"
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 transition-all duration-300 shadow-glow-purple hover:shadow-glow-cyan"
            >
              Start Watching
            </a>
          </div>

          {/* Mobile hamburger — only visible below md */}
          <button
            className="md:hidden flex-shrink-0 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile drawer ───────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0,  height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-black/70 backdrop-blur-xl border-t border-white/5"
          >
            <div className="px-5 py-6 flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-base font-medium text-gray-300 hover:text-white border-b border-white/5 last:border-0 transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-500" />
                  {l.label}
                </a>
              ))}

              {/* Mobile CTAs */}
              <div className="flex flex-col gap-3 pt-4">
                <a
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-full text-sm font-semibold text-center border border-purple-500/50 text-purple-300 hover:border-purple-400 hover:text-white transition-all"
                >
                  View Plans
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-full text-sm font-semibold text-center bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90 transition-all shadow-glow-purple"
                >
                  Start Watching Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
