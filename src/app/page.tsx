import Navbar        from '@/components/Navbar';
import Hero          from '@/components/Hero';
import LogoTicker    from '@/components/LogoTicker';
import Features      from '@/components/Features';
import Devices      from '@/components/Devices';
import Pricing      from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import FAQ          from '@/components/FAQ';
import CTA          from '@/components/CTA';
import Footer       from '@/components/Footer';
import ChatBot      from '@/components/ChatBot';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0f0c29] overflow-x-hidden">
      {/* Animated top progress bar */}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" />
      </div>

      {/* Persistent dark background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0f0c29] via-[#1a1040] to-[#0f0c29] -z-10" />

      <Navbar />
      <Hero />
      <LogoTicker />
      <Features />
      <Devices />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />

      {/* Floating overlays */}
      <ChatBot />
      <WhatsAppButton />
    </main>
  );
}
