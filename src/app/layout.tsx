import type { Metadata, Viewport } from 'next';
import { Prompt, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090d16',
};

export const metadata: Metadata = {
  title: 'ระบบติดตามสถานะทำความสะอาดห้องพัก - Hotel Room Cleaning Status',
  description: 'ระบบติดตามและจัดการสถานะการทำความสะอาดห้องพักโรงแรม Real-time 24 ชม.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'สถานะห้องพัก',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${prompt.variable} ${plusJakarta.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#070b12] text-slate-100 selection:bg-indigo-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
