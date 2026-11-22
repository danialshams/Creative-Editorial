import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HORÉL | هورل — زمان، ساختهٔ دست",
  description: "هورل؛ تجربهٔ مفهومی یک آتلیه ساعت‌سازی لوکس. روایتی سینمایی از ظرافت، زمان و مکانیزم در طراحی فارسی.",
  applicationName: "HORÉL Atelier",
  robots: { index: false, follow: false },
  openGraph: {
    title: "HORÉL — An Art of Time",
    description: "یک تجربهٔ سینمایی فارسی از دنیای ساعت‌های مکانیکی.",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport: Viewport = { themeColor: "#0b1110", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
