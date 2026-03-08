'use client';

/**
 * LogoTicker
 * ──────────
 * Infinite left-to-right marquee of streaming / sports platform logos.
 *
 * Animation trick
 * ───────────────
 * The inner track contains TWO identical copies of every logo, laid out
 * side-by-side in a single non-wrapping flex row.  Track width = 2W.
 *
 *   keyframe "marquee":
 *     0%  →  translateX(-50%)   ← starts shifted left by one full copy (= W)
 *    100%  →  translateX(0%)    ← slides back to natural position
 *
 * Moving from -W → 0 makes the content slide to the RIGHT.
 * At 0 % we see copy-1; at -50 % we see copy-2; they are identical, so the
 * loop is seamless — no jump, no flash, no JavaScript timers needed.
 *
 * Pause on hover is handled entirely in CSS (.ticker-wrap:hover .ticker-track)
 * so it works even when hovering a child element deep inside a card.
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// ─── UCL badge helpers ────────────────────────────────────────────────────
const UCL_RING: [number, number][] = [
  [20,  5], [30,  9], [35, 20], [30, 31],
  [20, 35], [10, 31], [ 5, 20], [10,  9],
];
const diamond = (cx: number, cy: number, s = 3.5) =>
  `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;

// ─── Logo type ────────────────────────────────────────────────────────────
type Logo = { name: string; color: string; svg: React.ReactNode };

// ─── Logo definitions ─────────────────────────────────────────────────────
//  All SVGs use fill="currentColor".  The parent card sets `color` to the
//  brand hex; default state applies Tailwind `grayscale` filter so every
//  logo appears as a uniform light-grey.  Hover removes the filter → brand
//  colour is revealed with no extra JS or inline-style swapping.
// ─────────────────────────────────────────────────────────────────────────
const LOGOS: Logo[] = [
  /* ── Netflix ─────────────────────────────────────────────────────────── */
  {
    name: 'Netflix',
    color: '#E50914',
    svg: (
      <svg
        viewBox="0 0 50 72"
        fill="currentColor"
        className="h-7 sm:h-9 w-auto"
        aria-label="Netflix"
      >
        {/* Left vertical bar */}
        <rect x="0"  y="0" width="11" height="72" />
        {/* Diagonal — parallelogram connecting top-right of left bar
            to bottom-left of right bar, giving the classic N slash    */}
        <polygon points="11,0 22,0 50,72 39,72" />
        {/* Right vertical bar */}
        <rect x="39" y="0" width="11" height="72" />
      </svg>
    ),
  },

  /* ── HBO ─────────────────────────────────────────────────────────────── */
  {
    name: 'HBO',
    color: '#9B59B6',
    svg: (
      <svg
        viewBox="0 0 90 34"
        fill="currentColor"
        className="h-7 sm:h-9 w-auto"
        aria-label="HBO"
      >
        <text
          x="0" y="30"
          fontFamily="Georgia,'Times New Roman',serif"
          fontSize="34" fontWeight="700" letterSpacing="4"
        >HBO</text>
      </svg>
    ),
  },

  /* ── Disney+ ─────────────────────────────────────────────────────────── */
  {
    name: 'Disney+',
    color: '#1D6EE2',
    svg: (
      <svg
        viewBox="0 0 128 34"
        fill="currentColor"
        className="h-7 sm:h-9 w-auto"
        aria-label="Disney+"
      >
        <text
          x="0" y="30"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="30" fontWeight="800" fontStyle="italic"
        >Disney+</text>
      </svg>
    ),
  },

  /* ── Prime Video ─────────────────────────────────────────────────────── */
  {
    name: 'Prime Video',
    color: '#00A8E0',
    svg: (
      <svg
        viewBox="0 0 150 46"
        fill="currentColor"
        className="h-8 sm:h-10 w-auto"
        aria-label="Prime Video"
      >
        {/* Word mark */}
        <text
          x="0" y="20"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="18" fontWeight="700" letterSpacing="0.5"
        >prime video</text>
        {/* Amazon-style smile arc */}
        <path
          d="M 2 30 Q 75 46 148 30"
          stroke="currentColor" strokeWidth="3.5"
          fill="none" strokeLinecap="round"
        />
        {/* Arrow tip at the right end of the smile */}
        <polygon points="141,25 150,30 141,35" />
      </svg>
    ),
  },

  /* ── NBA ─────────────────────────────────────────────────────────────── */
  {
    name: 'NBA',
    color: '#C8102E',
    svg: (
      <svg
        viewBox="0 0 96 38"
        fill="currentColor"
        className="h-8 sm:h-10 w-auto"
        aria-label="NBA"
      >
        {/* Ball outline */}
        <circle cx="19" cy="19" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Vertical seam */}
        <path
          d="M 19 3 Q 10 11 10 19 Q 10 27 19 35"
          fill="none" stroke="currentColor" strokeWidth="1.5"
        />
        {/* Horizontal seam */}
        <line x1="3" y1="19" x2="35" y2="19" stroke="currentColor" strokeWidth="1.5" />
        {/* Upper curved seam */}
        <path d="M 4 11 Q 14 17 28 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Lower curved seam */}
        <path d="M 4 27 Q 14 21 28 27" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Wordmark */}
        <text
          x="42" y="28"
          fontFamily="'Arial Black',Impact,sans-serif"
          fontSize="26" fontWeight="900"
        >NBA</text>
      </svg>
    ),
  },

  /* ── UEFA Champions League ───────────────────────────────────────────── */
  {
    name: 'Champions League',
    color: '#1A56DB',
    svg: (
      <svg
        viewBox="0 0 160 42"
        fill="currentColor"
        className="h-8 sm:h-10 w-auto"
        aria-label="UEFA Champions League"
      >
        {/* 8-diamond ring around the badge */}
        {UCL_RING.map(([cx, cy], i) => (
          <polygon key={i} points={diamond(cx, cy)} />
        ))}
        {/* Inner circle */}
        <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Central ball seam arcs */}
        <path d="M 11 20 Q 20 14 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M 11 20 Q 20 26 29 20" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Text block */}
        <text x="48" y="11"  fontFamily="Arial,sans-serif" fontSize="9"  fontWeight="700" letterSpacing="1.5">UEFA</text>
        <text x="48" y="25"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">Champions</text>
        <text x="48" y="39"  fontFamily="Arial,sans-serif" fontSize="11" fontWeight="500">League</text>
      </svg>
    ),
  },

  /* ── ESPN ────────────────────────────────────────────────────────────── */
  {
    name: 'ESPN',
    color: '#D00020',
    svg: (
      <svg
        viewBox="0 0 100 34"
        fill="currentColor"
        className="h-7 sm:h-9 w-auto"
        aria-label="ESPN"
      >
        <text
          x="0" y="30"
          fontFamily="'Arial Black',Impact,sans-serif"
          fontSize="34" fontWeight="900" letterSpacing="-1"
        >ESPN</text>
      </svg>
    ),
  },

  /* ── Hulu ────────────────────────────────────────────────────────────── */
  {
    name: 'Hulu',
    color: '#1CE783',
    svg: (
      <svg
        viewBox="0 0 82 30"
        fill="currentColor"
        className="h-6 sm:h-8 w-auto"
        aria-label="Hulu"
      >
        <text
          x="0" y="26"
          fontFamily="Arial,Helvetica,sans-serif"
          fontSize="28" fontWeight="700" letterSpacing="1"
        >hulu</text>
      </svg>
    ),
  },

  /* ── Apple TV+ ───────────────────────────────────────────────────────── */
  {
    name: 'Apple TV+',
    color: '#A2AAAD',
    svg: (
      <svg
        viewBox="0 0 118 36"
        fill="currentColor"
        className="h-7 sm:h-9 w-auto"
        aria-label="Apple TV+"
      >
        {/*
          Simplified Apple silhouette.
          fill-rule="evenodd" punches out the leaf highlight and
          creates the bite on the right side.
        */}
        <path
          fillRule="evenodd"
          d="
            M 16 1 C 17 1 17.5 2 17.5 3 C 16.5 2 14.5 2 16 1 Z
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
            M 21 4 C 22 4 23.5 5 24 7 C 22 6.5 20.5 5.5 21 4 Z
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

// ─── Duplicate list for the seamless loop ────────────────────────────────
//
//  Track layout:  [ copy-1 | copy-2 ]   (total width = 2W)
//
//  The CSS animation starts the track at translateX(-50%) = -W,
//  which means the viewport shows copy-2 at its left edge.
//  As the animation plays, the track slides RIGHT to translateX(0),
//  bringing copy-1 into view from the left — creating a left → right flow.
//  At 0 % the viewport shows copy-1, which looks identical to copy-2,
//  so when the animation loops back to -50 % there is no visible seam.
//
const TRACK = [...LOGOS, ...LOGOS];

// ─── Component ───────────────────────────────────────────────────────────
export default function LogoTicker() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-14 overflow-hidden"
      aria-label="Streaming and sports platforms"
    >
      {/* Ambient glow behind the strip */}
      <div
        className="orb w-[700px] h-[180px] bg-purple-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0.07 }}
      />

      {/* Hairline rules top / bottom */}
      <div className="absolute top-0    left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Label — fades in on scroll */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center text-xs font-semibold tracking-[0.22em] uppercase text-gray-500 mb-8 px-4"
      >
        Trusted by millions — all your favourite platforms, one subscription
      </motion.p>

      {/*
        ┌─ ticker-wrap ─────────────────────────────────────────────────────┐
        │  • overflow-hidden  → clips the scrolling track                   │
        │  • ticker-mask      → soft fade on left + right edges             │
        │  • ticker-wrap      → CSS hook: pauses .ticker-track on hover     │
        └───────────────────────────────────────────────────────────────────┘
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="overflow-hidden ticker-mask ticker-wrap"
      >
        {/*
          ┌─ ticker-track ──────────────────────────────────────────────────┐
          │  • flex + whitespace-nowrap  → single non-wrapping row          │
          │  • w-max                     → grows to fit all logo cards      │
          │  • ticker-track              → applies the marquee animation    │
          └─────────────────────────────────────────────────────────────────┘
        */}
        <div
          className="flex items-center whitespace-nowrap w-max ticker-track"
          style={{ gap: '1.25rem' }}
        >
          {TRACK.map((logo, idx) => (
            <TickerCard key={`${logo.name}-${idx}`} logo={logo} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ─── Individual logo card ─────────────────────────────────────────────────
//
//  Default  → grayscale + opacity-60  (uniform, muted, dark-bg friendly)
//  Hover    → grayscale-0 + opacity-100  (brand colour revealed)
//
function TickerCard({ logo }: { logo: Logo }) {
  return (
    <div
      className={[
        // Layout
        'flex-shrink-0 flex items-center justify-center',
        // Spacing & shape — matches the spec: px-8 py-4 rounded-xl
        'px-8 py-4 rounded-xl',
        // Glass card surface
        'bg-white/5 border border-white/10',
        // Default: muted, desaturated
        'opacity-60 grayscale',
        // Hover: full colour, slightly elevated card
        'hover:opacity-100 hover:grayscale-0',
        'hover:bg-white/10 hover:border-white/20',
        'hover:shadow-[0_0_24px_rgba(255,255,255,0.07)]',
        // Smooth transition on all affected properties
        'transition-all duration-300 ease-out',
        'cursor-default select-none',
      ].join(' ')}
      // currentColor drives fill="currentColor" inside every SVG.
      // Combined with the grayscale filter, this makes every logo appear
      // white / light-grey at rest — regardless of the brand colour.
      style={{ color: logo.color }}
      title={logo.name}
      aria-label={logo.name}
    >
      {logo.svg}
    </div>
  );
}
