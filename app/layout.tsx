import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit', display: 'swap' });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Galaxy S26 Ultra | Concept',
  description: 'Scroll-driven 3D concept site for Galaxy S26 Ultra, with an S25 Ultra comparison, AR and live Galaxy AI demos.',
  openGraph: { title: 'Galaxy S26 Ultra | Concept', description: 'Scroll-driven 3D concept site for Galaxy S26 Ultra, with an S25 Ultra comparison, AR and live Galaxy AI demos.', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Galaxy S26 Ultra | Concept', description: 'Scroll-driven 3D concept site for Galaxy S26 Ultra, with an S25 Ultra comparison, AR and live Galaxy AI demos.' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased selection:bg-cyan-500/30`} suppressHydrationWarning>
      <body className="bg-[#030303] text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}