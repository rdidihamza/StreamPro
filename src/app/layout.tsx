import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamPro IPTV – 15,000+ Channels in Ultra HD',
  description:
    'Watch 15,000+ live channels, movies, series and live sports in Ultra HD. Compatible with Smart TV, Android, iOS, Firestick and more.',
  keywords: 'IPTV, streaming, live TV, channels, movies, series, sports, 4K, Ultra HD',
  openGraph: {
    title: 'StreamPro IPTV – 15,000+ Channels in Ultra HD',
    description: 'Watch 15,000+ live channels, movies, series and live sports in Ultra HD.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
