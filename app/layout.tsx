import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ShellLayout } from '@/components/layout/ShellLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://wrenchwise.vercel.app'),
  title: 'Wrench Wise Command Center',
  description: 'Business Intelligence & Operations Portal powered by Live Zoho Data.',
  icons: {
    icon: '/wrenchwise-logo.jpg',
    apple: '/wrenchwise-logo.jpg',
  },
  openGraph: {
    title: 'Wrench Wise Command Center',
    description: 'Business Intelligence & Operations Portal powered by Live Zoho Data.',
    type: 'website',
    images: ['/wrenchwise-logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-slate-50 text-slate-900 antialiased`}>
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
