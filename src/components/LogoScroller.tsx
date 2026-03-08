'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── Pre-computed star positions for the Champions League badge ───────────
// 8 points on a circle of radius 15, centre (20,20), starting from top
const UCL_RING: [number, number][] = [
  [20,  5], // 0°  – top
  [30,  9], // 45°
  [35, 20], // 90° – right
  [30, 31], // 135°
  [20, 35], // 180° – bottom
  [10, 31], // 225°
  [ 5, 20], // 270° – left
  [10,  9], // 315°
];

// 4-point diamond polygon centred at (cx, cy) with half-size s
const diamond = (cx: number, cy: number, s = 3) =>
  `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;

// ─── Logo definitions ─────────────────────────────────────────────────────
type Logo = { name: string; color: string; svg: React.ReactNode };

const LOGOS: Logo[] = [
  /* ── Netflix ─────────────────────────────── */
  {
    name: 'Netflix',
    color: '#E50914',
    svg: (
      <svg viewBox="0 0 50 72" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="Netflix">
        {/* Left bar */}
        <rect x="0"  y="0" width="11" height="72" />
        {/* Diagonal – parallelogram from top-right of left bar to bottom-left of right bar */}
        <polygon points="11,0 22,0 50,72 39,72" />
        {/* Right bar */}
        <rect x="39" y="0" width="11" height="72" />
      </svg>
    ),
  },

  /* ── HBO ─────────────────────────────────── */
  {
    name: 'HBO',
    color: '#9B59B6',
    svg: (
      <svg viewBox="0 0 86 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="HBO">
        <text
          x="0" y="30"
          fontFamily="Georgia,'Times New Roman',serif"
          fontSize="34" fontWeight="700" letterSpacing="3"
        >HBO</text>
      </svg>
    ),
  },

  /* ── Disney+ ─────────────────────────────── */
  {
    name: 'Disney+',
    color: '#1D6EE2',
    svg: (
      <svg viewBox="0 0 125 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Disney+">
        <text
          x="0" y="30"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="30" fontWeight="800" fontStyle="italic"
        >Disney+</text>
      </svg>
    ),
  },

  /* ── Prime Video ─────────────────────────── */
  {
    name: 'Prime Video',
    color: '#00A8E0',
    svg: (
      <svg viewBox="0 0 148 46" fill="currentColor" className="h-8 sm:h-11 w-auto" aria-label="Prime Video">
        {/* Word mark */}
        <text
          x="0" y="20"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="18" fontWeight="700" letterSpacing="0.5"
        >prime video</text>
        {/* Amazon-style smile arc */}
        <path
          d="M 2 30 Q 74 46 146 30"
          stroke="currentColor" strokeWidth="3.5"
          fill="none" strokeLinecap="round"
        />
        {/* Arrowhead at the right end of the smile */}
        <polygon points="140,25 148,30 140,35" />
      </svg>
    ),
  },

  /* ── NBA ─────────────────────────────────── */
  {
    name: 'NBA',
    color: '#C8102E',
    svg: (
      <svg viewBox="0 0 94 38" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="NBA">
        {/* Basketball outline */}
        <circle cx="19" cy="19" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Vertical seam */}
        <path
          d="M 19 3 Q 10 11 10 19 Q 10 27 19 35"
          fill="none" stroke="currentColor" strokeWidth="1.5"
        />
        {/* Horizontal seam */}
        <line x1="3" y1="19" x2="35" y2="19" stroke="currentColor" strokeWidth="1.5" />
        {/* Curved seam – upper */}
        <path
          d="M 4 11 Q 14 17 28 11"
          fill="none" stroke="currentColor" strokeWidth="1.5"
        />
        {/* Curved seam – lower */}
        <path
          d="M 4 27 Q 14 21 28 27"
          fill="none" stroke="currentColor" strokeWidth="1.5"
        />
        {/* "NBA" word */}
        <text
          x="42" y="28"
          fontFamily="'Arial Black',Impact,sans-serif"
          fontSize="26" fontWeight="900"
        >NBA</text>
      </svg>
    ),
  },

  /* ── UEFA Champions League ───────────────── */
  {
    name: 'Champions League',
    color: '#1A56DB',
    svg: (
      <svg viewBox="0 0 158 42" fill="currentColor" className="h-8 sm:h-10 w-auto" aria-label="UEFA Champions League">
        {/* 8-star ring */}
        {UCL_RING.map(([cx, cy], i) => (
          <polygon key={i} points={diamond(cx, cy, 3.5)} />
        ))}
        {/* Inner circle outline */}
        <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Centre ball pattern – two arc seams */}
        <path d="M 11 20 Q 20 14 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 11 20 Q 20 26 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Text */}
        <text x="48" y="11"  fontFamily="Arial,sans-serif" fontSize="9"  fontWeight="700" letterSpacing="1.5">UEFA</text>
        <text x="48" y="24"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">Champions</text>
        <text x="48" y="38"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">League</text>
      </svg>
    ),
  },

  /* ── ESPN ────────────────────────────────── */
  {
    name: 'ESPN',
    color: '#D00020',
    svg: (
      <svg viewBox="0 0 98 34" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="ESPN">
        <text
          x="0" y="30"
          fontFamily="'Arial Black',Impact,sans-serif"
          fontSize="34" fontWeight="900" letterSpacing="-1"
        >ESPN</text>
      </svg>
    ),
  },

  /* ── Hulu ────────────────────────────────── */
  {
    name: 'Hulu',
    color: '#1CE783',
    svg: (
      <svg viewBox="0 0 82 30" fill="currentColor" className="h-6 sm:h-8 w-auto" aria-label="Hulu">
        <text
          x="0" y="26"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="28" fontWeight="700" letterSpacing="1"
        >hulu</text>
      </svg>
    ),
  },

  /* ── Apple TV+ ───────────────────────────── */
  {
    name: 'Apple TV+',
    color: '#A2AAAD',
    svg: (
      <svg viewBox="0 0 118 36" fill="currentColor" className="h-7 sm:h-9 w-auto" aria-label="Apple TV+">
        {/*
          Simplified Apple silhouette built from two arcs:
          – main body: rounded rectangle-like shape
          – bite cut out via fill-rule evenodd
          – stem at top
        */}
        <path
          fillRule="evenodd"
          d="
            M 16 1
            C 17 1 17.5 2 17.5 3
            C 16.5 2 14.5 2 16 1 Z

            M 7 7
            C 4 7 2 10 2 14
            C 2 20 6 27 10 30
            C 12 31.5 13.5 32 15 32
            C 16.5 32 18 31 19.5 31
            C 21 31 22.5 32 24 32
            C 25.5 32 27 31.5 29 30
            C 32 27 34 22 34 16
            C 34 10 31 7 28 7
            C 26 7 24 8.5 22.5 10
            C 21 8 19 7 17 7
            C 15 7 13 7 11 7 Z

            M 21 4
            C 22 4 23.5 5 24 7
            C 22 6.5 20.5 5.5 21 4 Z
          "
        />
        {/* TV+ wordmark */}
        <text
          x="42" y="28"
          fontFamily="-apple-system,'Helvetica Neue',Arial,sans-serif"
          fontSize="24" fontWeight="600" letterSpacing="-0.5"
        >TV+</text>
      </svg>
    ),
  },
];

// ─── Duplicate for seamless infinite loop ────────────────────────────────
// The track is 2× wide; the animation moves it exactly -50% (= -1 copy width)
// so at loop point the view looks identical to the start.
const TRACK_LOGOS = [...LOGOS, ...LOGOS];

// ─── Component ──────────────────────────────────────────────────────────
export default function LogoScroller() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-14 overflow-hidden"
      aria-label="Streaming platforms available"
    >
      {/* Subtle ambient glow */}
      <div className="orb w-[600px] h-[200px] bg-purple-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.08 }} />

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-8"
        >
          All your favourite platforms — one subscription
        </motion.p>
      </div>

      {/*
        Scroller container:
        – overflow-hidden clips the track
        – logo-scroller-mask applies the left/right fade (defined in globals.css)
        – logo-scroller-wrap exposes :hover so the CSS rule pauses the animation
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative overflow-hidden logo-scroller-mask logo-scroller-wrap"
      >
        {/*
          Track:
          – flex with no-wrap keeps all logos in a single row
          – w-max lets the div grow to fit all logos
          – logo-track applies the keyframe animation (+ pauses on parent hover)
        */}
        <div className="flex items-center w-max logo-track" style={{ gap: '3rem' }}>
          {TRACK_LOGOS.map((logo, idx) => (
            <LogoCard key={`${logo.name}-${idx}`} logo={logo} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Individual logo card ─────────────────────────────────────────────────
function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div
      className="
        group
        flex-shrink-0
        flex items-center justify-center
        px-4 py-3
        rounded-2xl
        transition-all duration-500 ease-out
        cursor-default
        select-none
        /* Default: desaturated, dimmed – blends cleanly on dark bg */
        grayscale opacity-40
        /* Hover: full colour, full opacity, subtle glass lift */
        hover:grayscale-0 hover:opacity-100
        hover:bg-white/5
        hover:shadow-[0_0_20px_rgba(255,255,255,0.06)]
      "
      /*
        Inject the brand colour as a CSS variable so the SVG text / paths
        pick it up via `color` when the hover filter is removed.
        (The SVG uses fill="currentColor", so this drives the colour.)
      */
      style={{ color: logo.color }}
      title={logo.name}
      aria-label={logo.name}
    >
      {logo.svg}
    </div>
  );
}
