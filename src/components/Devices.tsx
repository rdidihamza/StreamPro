'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/* SVG device icons — inline for zero extra dependencies */
const devices = [
  {
    name: 'Smart TV',
    color: '#A855F7',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="8" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M16 34v4M32 34v4M12 38h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="8" y="12" width="32" height="18" rx="2" fill="currentColor" opacity=".15"/>
        <circle cx="24" cy="21" r="4" fill="currentColor" opacity=".5"/>
        <path d="M20 21h8M24 17v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Android',
    color: '#22C55E',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M14 20C14 14.477 18.477 10 24 10C29.523 10 34 14.477 34 20V34C34 35.105 33.105 36 32 36H16C14.895 36 14 35.105 14 34V20Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <circle cx="19" cy="20" r="1.5" fill="currentColor"/>
        <circle cx="29" cy="20" r="1.5" fill="currentColor"/>
        <path d="M9 22v6M39 22v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M16 36v5M32 36v5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 10L15 6M30 10l3-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'iOS / iPhone',
    color: '#6366F1',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="12" y="4" width="24" height="40" rx="5" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <rect x="16" y="8" width="16" height="26" rx="2" fill="currentColor" opacity=".1"/>
        <circle cx="24" cy="39" r="2" fill="currentColor" opacity=".6"/>
        <path d="M21 7h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Firestick',
    color: '#F97316',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="16" width="28" height="16" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M34 24h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="10" y="20" width="20" height="8" rx="2" fill="currentColor" opacity=".15"/>
        <circle cx="24" cy="24" r="2" fill="currentColor" opacity=".5"/>
        <path d="M42 21v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: 'Windows / Mac',
    color: '#06B6D4',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <path d="M6 28h36" stroke="currentColor" strokeWidth="2" opacity=".5"/>
        <path d="M16 32l-4 6M32 32l4 6M12 38h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="10" y="12" width="28" height="12" rx="1.5" fill="currentColor" opacity=".1"/>
        <circle cx="24" cy="18" r="3" fill="currentColor" opacity=".4"/>
      </svg>
    ),
  },
  {
    name: 'MAG Box',
    color: '#EC4899',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="14" width="36" height="22" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
        <rect x="10" y="18" width="20" height="14" rx="2" fill="currentColor" opacity=".1"/>
        <circle cx="34" cy="25" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M32 25l2 1.5V23.5L32 25z" fill="currentColor"/>
        <path d="M14 36v4M34 36v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M10 36h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".3"/>
      </svg>
    ),
  },
];

export default function Devices() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="devices" className="relative py-24 md:py-32 overflow-hidden">
      <div className="orb w-[600px] h-[300px] bg-indigo-600 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.1 }} />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 mb-4">
            Compatibility
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Works on <span className="gradient-text">Every Device</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            One subscription. Unlimited screens. Stream on any device, anywhere in the world.
          </p>
        </motion.div>

        {/* Device grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {devices.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col items-center gap-3 glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
              style={{ '--device-color': d.color } as React.CSSProperties}
            >
              {/* Animated icon container */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl p-3 transition-all duration-300"
                style={{
                  color: d.color,
                  backgroundColor: `${d.color}18`,
                  boxShadow: `0 0 0 0 ${d.color}40`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${d.color}50`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 0 ${d.color}40`;
                }}
              >
                {d.svg}
              </motion.div>
              <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors text-center">
                {d.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          Compatible with all major platforms •{' '}
          <span className="text-purple-400 font-medium">No extra hardware needed</span>
        </motion.p>
      </div>
    </section>
  );
}
