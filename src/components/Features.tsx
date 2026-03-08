'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Tv2, Film, Zap, Smartphone } from 'lucide-react';

const features = [
  {
    icon:  Tv2,
    title: '15,000+ Live Channels',
    desc:  'Access thousands of live TV channels from every country — sports, news, entertainment, kids and more, all in one place.',
    gradient: 'from-purple-600 to-purple-400',
    glow:     'group-hover:shadow-glow-purple',
    border:   'group-hover:border-purple-500/50',
    bg:       'group-hover:bg-purple-600/10',
  },
  {
    icon:  Film,
    title: 'Movies & Series VOD',
    desc:  'Unlimited Video on Demand library with 60,000+ movies and series. New releases added daily.',
    gradient: 'from-cyan-500 to-blue-500',
    glow:     'group-hover:shadow-glow-cyan',
    border:   'group-hover:border-cyan-500/50',
    bg:       'group-hover:bg-cyan-600/10',
  },
  {
    icon:  Zap,
    title: 'Ultra HD / 4K Streaming',
    desc:  'Crystal clear 4K Ultra HD picture quality with Dolby Audio support. Zero buffering on any connection.',
    gradient: 'from-yellow-500 to-orange-500',
    glow:     'group-hover:shadow-[0_0_30px_rgba(234,179,8,0.6)]',
    border:   'group-hover:border-yellow-500/50',
    bg:       'group-hover:bg-yellow-600/10',
  },
  {
    icon:  Smartphone,
    title: 'Works on All Devices',
    desc:  'Stream on Smart TV, Android, iOS, Firestick, MAG Box, PC and more. Watch anywhere, any time.',
    gradient: 'from-pink-600 to-rose-500',
    glow:     'group-hover:shadow-glow-pink',
    border:   'group-hover:border-pink-500/50',
    bg:       'group-hover:bg-pink-600/10',
  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[500px] h-[500px] bg-purple-700 top-0 left-[-200px]" />
      <div className="orb w-[400px] h-[400px] bg-cyan-600 bottom-0 right-[-150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-4">
            Why StreamPro
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need to
            <br />
            <span className="gradient-text">Stream Perfectly</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Premium IPTV experience with the best content, quality, and compatibility.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`group relative glass rounded-3xl p-6 border border-white/10 cursor-default transition-all duration-500 ${f.glow} ${f.border} ${f.bg}`}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>

                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
