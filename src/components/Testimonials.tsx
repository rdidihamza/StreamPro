'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

const reviews = [
  {
    name:   'James Mitchell',
    role:   'Sports Fan',
    avatar: 'https://ui-avatars.com/api/?name=James+Mitchell&background=7C3AED&color=fff&size=80',
    stars:  5,
    text:   "Best IPTV service I've ever used. All Premier League, Champions League, and NBA games in crystal clear 4K. Zero buffering, ever.",
  },
  {
    name:   'Sarah Williams',
    role:   'Binge Watcher',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=06B6D4&color=fff&size=80',
    stars:  5,
    text:   "Switched from Netflix and never looked back. The VOD library is insane — every movie and series you can think of. Works perfectly on my Smart TV.",
  },
  {
    name:   'Carlos Rivera',
    role:   'Family of 4',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Rivera&background=EC4899&color=fff&size=80',
    stars:  5,
    text:   "The whole family uses it on different devices simultaneously. Kids have their cartoons, wife watches series, I watch sports. All HD quality. Amazing value.",
  },
  {
    name:   'Ahmed Hassan',
    role:   'Tech Reviewer',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Hassan&background=22C55E&color=fff&size=80',
    stars:  5,
    text:   "I've tested dozens of IPTV providers. StreamPro has the best channel lineup, fastest load times, and most reliable uptime. Highly recommended.",
  },
  {
    name:   'Emma Thompson',
    role:   'Movie Lover',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=F97316&color=fff&size=80',
    stars:  5,
    text:   "The picture quality is unreal. Full 4K HDR on every movie. Catch-up feature is brilliant too — I never miss my favourite shows. 10/10 service.",
  },
  {
    name:   'David Chen',
    role:   'Cord Cutter',
    avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=8B5CF6&color=fff&size=80',
    stars:  5,
    text:   "Cancelled all my streaming subscriptions and switched to StreamPro. One subscription, everything I need. Customer support is also super responsive.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="reviews" className="relative py-24 md:py-32 overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-purple-800 top-1/2 left-[-150px] -translate-y-1/2" style={{ opacity: 0.1 }} />
      <div className="orb w-[500px] h-[500px] bg-cyan-800 top-1/2 right-[-150px] -translate-y-1/2" style={{ opacity: 0.1 }} />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Loved by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Join over 50,000 happy customers streaming with StreamPro.
          </p>
          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Stars count={5} />
            <span className="text-white font-bold">4.9/5</span>
            <span className="text-gray-400 text-sm">from 12,000+ reviews</span>
          </div>
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="glass rounded-3xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-purple-500/40 mb-4 group-hover:text-purple-500/70 transition-colors" />

              {/* Stars */}
              <Stars count={r.stars} />

              {/* Text */}
              <p className="text-gray-300 text-sm leading-relaxed mt-3 mb-5">
                &ldquo;{r.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <Image
                  src={r.avatar}
                  alt={r.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
