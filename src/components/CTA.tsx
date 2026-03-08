'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Shield, Globe, Zap } from 'lucide-react';

const badges = [
  { icon: Zap,    label: 'Instant Activation' },
  { icon: Shield, label: 'HD Quality'         },
  { icon: Globe,  label: 'Works Everywhere'   },
];

export default function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Glowing background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0f0c29] to-cyan-900/30" />
      <div className="orb w-[600px] h-[400px] bg-purple-600 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.15 }} />
      <div className="orb w-[400px] h-[400px] bg-cyan-500 bottom-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.1 }} />

      {/* Animated border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-cyan-500 shadow-glow-purple mb-8"
        >
          <Play className="w-9 h-9 text-white fill-white" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl font-black mb-4"
        >
          Start Streaming
          <br />
          <span className="gradient-text">Today</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-gray-400 mb-8 max-w-lg mx-auto"
        >
          Join 50,000+ happy streamers. One subscription unlocks everything.
        </motion.p>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10"
        >
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-300">
              <Icon className="w-4 h-4 text-purple-400" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.a
          href="#pricing"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring', bounce: 0.3 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white shadow-glow-purple hover:shadow-glow-cyan transition-all duration-300"
        >
          <Play className="w-6 h-6 fill-white" />
          Get IPTV Now
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-600 text-xs mt-6"
        >
          No contract • Cancel anytime • 7-day money-back guarantee
        </motion.p>
      </div>
    </section>
  );
}
