import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'میزونور | MAISON NOOR — خانه‌ای برای آرامش',
  description: 'میزونور؛ مجموعه‌ای منتخب از مبلمان، روشنایی و اکسسوری مینیمال برای خانه‌هایی با شخصیت و آرامش.',
  keywords: ['دکوراسیون داخلی', 'مبلمان مدرن', 'میزونور', 'لوازم خانه', 'دکور مینیمال'],
  openGraph: { title: 'MAISON NOOR | The art of less', description: 'منتخبی از اشیای ماندگار برای خانه‌ای آرام.', locale: 'fa_IR', type: 'website' },
  robots: { index: true, follow: true }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#F7F4ED' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
