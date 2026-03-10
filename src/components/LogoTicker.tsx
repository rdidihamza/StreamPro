'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── UCL badge helper ─────────────────────────────────────────────────────────
const UCL_RING: [number, number][] = [
  [20, 5], [30, 9], [35, 20], [30, 31],
  [20, 35], [10, 31], [5, 20], [10, 9],
];
const diamond = (cx: number, cy: number, s = 3.5) =>
  `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;

// ─── Logo type ────────────────────────────────────────────────────────────────
type Logo = { name: string; color: string; svg: React.ReactNode };

// ─── Logo definitions ─────────────────────────────────────────────────────────
const LOGOS: Logo[] = [
  /* ── Netflix ──────────────────────────────────────────────────────────────── */
  {
    name: 'Netflix', color: '#E50914',
    svg: (
      <svg viewBox="0 0 50 72" fill="currentColor" className="h-8 sm:h-9 w-auto" aria-label="Netflix">
        <rect x="0"  y="0" width="11" height="72" />
        <polygon points="11,0 22,0 50,72 39,72" />
        <rect x="39" y="0" width="11" height="72" />
      </svg>
    ),
  },

  /* ── HBO ──────────────────────────────────────────────────────────────────── */
  {
    name: 'HBO', color: '#9B59B6',
    svg: (
      <svg viewBox="0 0 90 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="HBO">
        <text x="0" y="30" fontFamily="Georgia,'Times New Roman',serif" fontSize="34" fontWeight="700" letterSpacing="4">HBO</text>
      </svg>
    ),
  },

  /* ── Disney+ ──────────────────────────────────────────────────────────────── */
  {
    name: 'Disney+', color: '#1D6EE2',
    svg: (
      <svg viewBox="0 0 128 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Disney+">
        <text x="0" y="30" fontFamily="Arial,Helvetica,sans-serif" fontSize="30" fontWeight="800" fontStyle="italic">Disney+</text>
      </svg>
    ),
  },

  /* ── Prime Video ──────────────────────────────────────────────────────────── */
  {
    name: 'Prime Video', color: '#00A8E0',
    svg: (
      <svg viewBox="0 0 150 46" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="Prime Video">
        <text x="0" y="20" fontFamily="Arial,Helvetica,sans-serif" fontSize="18" fontWeight="700" letterSpacing="0.5">prime video</text>
        <path d="M 2 30 Q 75 46 148 30" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <polygon points="141,25 150,30 141,35" />
      </svg>
    ),
  },

  /* ── YouTube ──────────────────────────────────────────────────────────────── */
  {
    name: 'YouTube', color: '#FF0000',
    svg: (
      <svg viewBox="0 0 148 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="YouTube">
        {/* Play button badge */}
        <rect x="0" y="4" width="38" height="26" rx="6" fill="currentColor" />
        <polygon points="14,10 14,24 28,17" fill="white" />
        {/* Wordmark */}
        <text x="44" y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="22" fontWeight="900" letterSpacing="-0.5">YouTube</text>
      </svg>
    ),
  },

  /* ── ESPN ─────────────────────────────────────────────────────────────────── */
  {
    name: 'ESPN', color: '#D00020',
    svg: (
      <svg viewBox="0 0 100 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="ESPN">
        <text x="0" y="30" fontFamily="'Arial Black',Impact,sans-serif" fontSize="34" fontWeight="900" letterSpacing="-1">ESPN</text>
      </svg>
    ),
  },

  /* ── Hulu ─────────────────────────────────────────────────────────────────── */
  {
    name: 'Hulu', color: '#1CE783',
    svg: (
      <svg viewBox="0 0 82 30" fill="currentColor" className="h-6 sm:h-8 w-auto" aria-label="Hulu">
        <text x="0" y="26" fontFamily="Arial,Helvetica,sans-serif" fontSize="28" fontWeight="700" letterSpacing="1">hulu</text>
      </svg>
    ),
  },

  /* ── Apple TV+ ────────────────────────────────────────────────────────────── */
  {
    name: 'Apple TV+', color: '#A2AAAD',
    svg: (
      <svg viewBox="0 0 118 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Apple TV+">
        <path fillRule="evenodd" d="M 16 1 C 17 1 17.5 2 17.5 3 C 16.5 2 14.5 2 16 1 Z M 7 7 C 4 7 2 10 2 14 C 2 20 6 27 10 30 C 12 31.5 13.5 32 15 32 C 16.5 32 18 31 19.5 31 C 21 31 22.5 32 24 32 C 25.5 32 27 31.5 29 30 C 32 27 34 22 34 16 C 34 10 31 7 28 7 C 26 7 24 8.5 22.5 10 C 21 8 19 7 17 7 C 15 7 13 7 11 7 Z M 21 4 C 22 4 23.5 5 24 7 C 22 6.5 20.5 5.5 21 4 Z" />
        <text x="42" y="28" fontFamily="-apple-system,'Helvetica Neue',Arial,sans-serif" fontSize="24" fontWeight="600" letterSpacing="-0.5">TV+</text>
      </svg>
    ),
  },

  /* ── Paramount+ ───────────────────────────────────────────────────────────── */
  {
    name: 'Paramount+', color: '#0064FF',
    svg: (
      <svg viewBox="0 0 148 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Paramount+">
        <polygon points="16,4 24,16 8,16" opacity="0.9" />
        <text x="28" y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="20" fontWeight="900" letterSpacing="-0.5">PARAMOUNT</text>
        <text x="128" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900">+</text>
      </svg>
    ),
  },

  /* ── Peacock ──────────────────────────────────────────────────────────────── */
  {
    name: 'Peacock', color: '#00A36C',
    svg: (
      <svg viewBox="0 0 124 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Peacock">
        {[-30, -15, 0, 15, 30].map((angle, i) => (
          <line key={i} x1="16" y1="28"
            x2={16 + 14 * Math.sin((angle * Math.PI) / 180)}
            y2={28 - 14 * Math.cos((angle * Math.PI) / 180)}
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            opacity={0.5 + i * 0.1} />
        ))}
        <circle cx="16" cy="28" r="2.5" fill="currentColor" />
        <text x="36" y="28" fontFamily="Arial,Helvetica,sans-serif" fontSize="22" fontWeight="700" letterSpacing="0.3">Peacock</text>
      </svg>
    ),
  },

  /* ── Discovery+ ───────────────────────────────────────────────────────────── */
  {
    name: 'Discovery+', color: '#1671CC',
    svg: (
      <svg viewBox="0 0 142 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Discovery+">
        <circle cx="16" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M 16 4 Q 26 11 26 18 Q 26 25 16 32" fill="currentColor" opacity="0.4" />
        <text x="35" y="27" fontFamily="Arial,sans-serif" fontSize="19" fontWeight="700" letterSpacing="0.3">discovery</text>
        <text x="128" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900">+</text>
      </svg>
    ),
  },

  /* ── NBA ──────────────────────────────────────────────────────────────────── */
  {
    name: 'NBA', color: '#C8102E',
    svg: (
      <svg viewBox="0 0 96 38" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="NBA">
        <circle cx="19" cy="19" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M 19 3 Q 10 11 10 19 Q 10 27 19 35" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="19" x2="35" y2="19" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 4 11 Q 14 17 28 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 4 27 Q 14 21 28 27" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text x="42" y="28" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900">NBA</text>
      </svg>
    ),
  },

  /* ── UEFA Champions League ────────────────────────────────────────────────── */
  {
    name: 'Champions League', color: '#1A56DB',
    svg: (
      <svg viewBox="0 0 160 42" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="UEFA Champions League">
        {UCL_RING.map(([cx, cy], i) => <polygon key={i} points={diamond(cx, cy)} />)}
        <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 11 20 Q 20 14 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 11 20 Q 20 26 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="48" y="11"  fontFamily="Arial,sans-serif" fontSize="9"  fontWeight="700" letterSpacing="1.5">UEFA</text>
        <text x="48" y="25"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">Champions</text>
        <text x="48" y="39"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">League</text>
      </svg>
    ),
  },

  /* ── DAZN ─────────────────────────────────────────────────────────────────── */
  {
    name: 'DAZN', color: '#F8FF00',
    svg: (
      <svg viewBox="0 0 100 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="DAZN">
        <text x="0" y="30" fontFamily="'Arial Black',Impact,sans-serif" fontSize="36" fontWeight="900" letterSpacing="-1">DAZN</text>
      </svg>
    ),
  },

  /* ── beIN Sports ──────────────────────────────────────────────────────────── */
  {
    name: 'beIN Sports', color: '#E5002B',
    svg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="beIN Sports">
        <rect x="0" y="2" width="52" height="32" rx="6" fill="currentColor" opacity="0.15" />
        <text x="4" y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900">be</text>
        <rect x="54" y="2" width="38" height="32" rx="6" fill="currentColor" />
        <text x="58" y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="white">IN</text>
        <text x="96" y="27" fontFamily="Arial,sans-serif" fontSize="14" fontWeight="700" letterSpacing="0.5">SPORTS</text>
      </svg>
    ),
  },

  /* ── Sky Sports ───────────────────────────────────────────────────────────── */
  {
    name: 'Sky Sports', color: '#0072CE',
    svg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Sky Sports">
        <rect x="0" y="2" width="130" height="32" rx="6" fill="currentColor" opacity="0.12" />
        <text x="6"  y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="24" fontWeight="900" letterSpacing="-0.5">SKY</text>
        <text x="58" y="27" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="0.5">SPORTS</text>
      </svg>
    ),
  },

  /* ── Fox Sports ───────────────────────────────────────────────────────────── */
  {
    name: 'Fox Sports', color: '#003087',
    svg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Fox Sports">
        <rect x="0" y="2" width="42" height="32" rx="4" fill="currentColor" opacity="0.9" />
        <text x="4"  y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="white">FOX</text>
        <text x="48" y="27" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="0.5">SPORTS</text>
      </svg>
    ),
  },

  /* ── CNN ──────────────────────────────────────────────────────────────────── */
  {
    name: 'CNN', color: '#CC0000',
    svg: (
      <svg viewBox="0 0 84 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="CNN">
        <text x="0" y="30" fontFamily="'Arial Black',Impact,sans-serif" fontSize="36" fontWeight="900" letterSpacing="-1">CNN</text>
      </svg>
    ),
  },

  /* ── BBC iPlayer ──────────────────────────────────────────────────────────── */
  {
    name: 'BBC iPlayer', color: '#E03A2F',
    svg: (
      <svg viewBox="0 0 168 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="BBC iPlayer">
        {/* Three BBC boxes */}
        {[0, 37, 74].map((x) => (
          <rect key={x} x={x} y="2" width="32" height="32" rx="3" fill="currentColor" />
        ))}
        <text x="4"  y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900" fill="white">B</text>
        <text x="41" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900" fill="white">B</text>
        <text x="78" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900" fill="white">C</text>
        {/* iPlayer text */}
        <text x="114" y="27" fontFamily="Arial,sans-serif" fontSize="18" fontWeight="600" letterSpacing="0.3">iPlayer</text>
      </svg>
    ),
  },

  /* ── Sony LIV ─────────────────────────────────────────────────────────────── */
  {
    name: 'Sony LIV', color: '#003087',
    svg: (
      <svg viewBox="0 0 130 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Sony LIV">
        {/* Sony wordmark */}
        <text x="0" y="27" fontFamily="Arial,Helvetica,sans-serif" fontSize="22" fontWeight="700" letterSpacing="1">SONY</text>
        {/* LIV badge */}
        <rect x="60" y="2" width="66" height="32" rx="6" fill="currentColor" />
        <text x="66" y="27" fontFamily="'Arial Black',Impact,sans-serif" fontSize="24" fontWeight="900" fill="white">LIV</text>
      </svg>
    ),
  },

  /* ── Formula 1 ────────────────────────────────────────────────────────────── */
  {
    name: 'Formula 1', color: '#E8002D',
    svg: (
      <svg viewBox="0 0 110 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Formula 1">
        <text x="0" y="28" fontFamily="'Arial Black',Impact,sans-serif" fontSize="30" fontWeight="900" letterSpacing="-1">F1</text>
        <polygon points="52,10 68,18 52,26 56,18" opacity="0.8" />
        <text x="72" y="27" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="700" letterSpacing="1">FORMULA</text>
      </svg>
    ),
  },

  /* ── UFC ──────────────────────────────────────────────────────────────────── */
  {
    name: 'UFC', color: '#D20A0A',
    svg: (
      <svg viewBox="0 0 76 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="UFC">
        <text x="0" y="30" fontFamily="'Arial Black',Impact,sans-serif" fontSize="36" fontWeight="900" letterSpacing="-1">UFC</text>
      </svg>
    ),
  },
];

// ─── Duplicate for seamless loop ──────────────────────────────────────────────
// Track = [copy-1 | copy-2] (total width = 2W)
// Animation: translateX(0%) → translateX(50%) slides the track right by W.
// When copy-1 exits right, copy-2 (identical) fills from the left — no jump.
const TRACK = [...LOGOS, ...LOGOS];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LogoTicker() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      ref={ref}
      className="relative py-12 sm:py-16 overflow-hidden"
      aria-label="Streaming and sports platforms"
    >
      {/* Ambient glow */}
      <div className="orb w-[700px] h-[200px] bg-purple-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.06 }} />

      {/* Hairline borders */}
      <div className="absolute top-0    left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center text-xs font-semibold tracking-[0.22em] uppercase text-gray-500 mb-8 px-4"
      >
        Trusted by millions — all your favourite platforms, one subscription
      </motion.p>

      {/* Track wrapper — overflow-hidden + edge fade mask */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="overflow-hidden ticker-mask ticker-wrap"
      >
        {/* Scrolling flex row — pauses on hover via CSS */}
        <div
          className="flex items-center whitespace-nowrap w-max ticker-track"
          style={{ gap: '1rem' }}
        >
          {TRACK.map((logo, idx) => (
            <LogoCard key={`${logo.name}-${idx}`} logo={logo} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Individual logo card ─────────────────────────────────────────────────────
function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div
      className={[
        'flex-shrink-0 flex items-center justify-center',
        'px-6 py-3 rounded-xl',
        'bg-white/5 border border-white/10',
        // Default: greyscale + dim
        'opacity-50 grayscale',
        // Hover: brand colour + scale
        'hover:opacity-100 hover:grayscale-0 hover:scale-105',
        'hover:bg-white/10 hover:border-white/20',
        'hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]',
        'transition-all duration-300 ease-out',
        'cursor-default select-none',
      ].join(' ')}
      style={{ color: logo.color }}
      title={logo.name}
      aria-label={logo.name}
    >
      {logo.svg}
    </div>
  );
}
