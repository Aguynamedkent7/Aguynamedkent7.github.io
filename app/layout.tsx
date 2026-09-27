import type { Metadata } from 'next';
import { Saira_Condensed, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Saira_Condensed({
  weight: ['500', '600', '700', '800'], subsets: ['latin'], variable: '--font-display',
});
const body = IBM_Plex_Sans({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-body' });
const mono = JetBrains_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono' });

const title = 'Kent Vincent Butaya | Full-Stack Developer';
const description =
  'Full-stack developer and CS student in Cagayan de Oro, PH. React, Next.js, Supabase, PostgreSQL.';

export const metadata: Metadata = {
  metadataBase: new URL('https://aguynamedkent7.github.io'),
  title,
  description,
  openGraph: {
    title, description, url: '/', type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
