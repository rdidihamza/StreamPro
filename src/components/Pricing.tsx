'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Star, Zap } from 'lucide-react';

const plans = [
  {
    name:     'Basic',
    price:    '9.99',
    period:   '/mo',
    tagline:  'Perfect for getting started',
    popular:  false,
    gradient: 'from-slate-800 to-slate-700',
    border:   'border-white/10',
    glow:     '',
    features: [
      '5,000+ Live Channels',
      'Full HD Quality (1080p)',
      '1 Device Connection',
      '30,000 VOD Library',
      'Basic EPG Guide',
      '24/7 Support',
    ],
    cta:      'Get Basic',
    ctaStyle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  },
  {
    name:     'Premium',
    price:    '14.99',
    period:   '/mo',
    tagline:  'Most popular choice',
    popular:  true,
    gradient: 'from-purple-900/80 to-cyan-900/80',
    border:   'border-purple-500/50',
    glow:     'shadow-glow-purple',
    features: [
      '15,000+ Live Channels',
      'Ultra HD / 4K Quality',
      '3 Device Connections',
      '60,000+ VOD Library',
      'Advanced EPG + Catch-up',
      'Priority 24/7 Support',
      'Anti-freeze Technology',
    ],
    cta:      'Get Premium',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:opacity-90',
  },
  {
    name:     'Ultimate',
    price:    '24.99',
    period:   '/mo',
    tagline:  'For power streamers',
    popular:  false,
    gradient: 'from-slate-800 to-slate-700',
    border:   'border-white/10',
    glow:     '',
    features: [
      '15,000+ Live Channels',
      'Ultra HD / 4K + 8K Ready',
      '5 Device Connections',
      '60,000+ VOD Library',
      'Full EPG + Catch-up 7 Days',
      'Dedicated VIP Support',
      'Anti-freeze Technology',
      'Reseller Panel Included',
    ],
    cta:      'Get Ultimate',
    ctaStyle: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      <div className="orb w-[700px] h-[400px] bg-purple-700 top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.12 }} />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-pink-600/20 text-pink-400 border border-pink-500/30 mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing Plans</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Instant activation on all plans.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: plan.popular ? 1.05 : 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative rounded-3xl p-8 border ${plan.border} bg-gradient-to-br ${plan.gradient} ${plan.glow} transition-all duration-300 group`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-glow-purple">
                  <Star className="w-3 h-3 fill-white" />
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {plan.popular && <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                </div>
                <p className="text-sm text-gray-400">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-1 mb-8">
                <span className="text-gray-400 text-lg self-start mt-2">$</span>
                <span className="text-5xl font-black text-white leading-none">{plan.price}</span>
                <span className="text-gray-400 mb-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className={`block w-full py-3.5 rounded-2xl text-center font-bold text-sm transition-all duration-300 ${plan.ctaStyle} ${plan.popular ? 'shadow-glow-purple hover:shadow-glow-cyan' : ''}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Money back */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-gray-500 text-sm mt-10"
        >
          🔒 Secure payment • 7-day money-back guarantee • Instant activation
        </motion.p>
      </div>
    </section>
  );
}
