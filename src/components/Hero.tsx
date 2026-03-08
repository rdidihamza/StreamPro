'use client';

import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1920&q=80';

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

const statItems = [
  { value: '15,000+', label: 'Live Channels'   },
  { value: '60,000+', label: 'Movies & Series' },
  { value: '4K/UHD',  label: 'Stream Quality'  },
  { value: '99.9%',   label: 'Uptime'          },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Layer 0: Background image ─────────────────────────────────
          Sits at the very bottom of the stacking context.
          brightness(0.3) keeps the image visible but dark enough.      */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Streaming background"
          fill
          priority
          className="object-cover object-center scale-105"
          style={{ filter: 'brightness(0.30) saturate(1.3)' }}
        />
      </div>

      {/* ── Layer 1: Solid dark scrim ─────────────────────────────────
          bg-black/60 ensures text is always readable regardless of the
          underlying image. Comes AFTER the image in DOM → renders on top
          without needing a custom z-index class.                        */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ── Layer 2: Gradient overlays (cinematic toning) ────────────
          These sit above the scrim to add colour depth.               */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0c29]/70 via-transparent to-[#0f0c29]" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/25 via-transparent to-cyan-900/25" />

      {/* ── Layer 3: Glowing orbs ─────────────────────────────────────
          pointer-events-none so they never block clicks.              */}
      <div className="orb w-[600px] h-[600px] bg-purple-600 top-[-100px] left-[-200px] pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-cyan-500 bottom-[-100px] right-[-150px] pointer-events-none" />
      <div className="orb w-[300px] h-[300px] bg-pink-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.08 }} />

      {/* ── Layer 4: Hero content (z-10 guarantees it's above all layers) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">

        {/* Live badge */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/40 text-sm font-medium text-purple-300 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Now Streaming • 15,000+ Channels Available
        </motion.div>

        {/* Main heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6 drop-shadow-2xl"
        >
          Unlimited
          <br />
          <span className="gradient-text">IPTV Streaming</span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-lg"
        >
          Watch{' '}
          <span className="text-white font-semibold">15,000+ Channels</span>
          , Movies, Series and Live Sports in{' '}
          <span className="text-cyan-400 font-semibold">Ultra HD &amp; 4K</span>
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="#pricing"
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white hover:opacity-95 transition-all duration-300 shadow-glow-purple hover:shadow-glow-cyan hover:scale-105 w-full sm:w-auto justify-center"
          >
            <Play className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
            Start Watching Now
          </a>
          <a
            href="#pricing"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg glass border border-white/30 text-white hover:border-purple-400/70 hover:bg-white/10 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            View Plans
          </a>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {statItems.map((s) => (
            <div
              key={s.value}
              className="glass rounded-2xl p-4 border border-white/15 hover:border-purple-500/40 transition-colors duration-300"
            >
              <p className="text-2xl font-black gradient-text">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.a>
    </section>
  );
}
