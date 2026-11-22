import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAISON NOOR | معماری زندگی",
  description: "میزونور؛ تجربه‌ای از مبلمان و اشیای منتخب با زبان طراحی ایتالیایی، متریال اصیل و نگاه معاصر.",
  metadataBase: new URL("https://creative-editorial.vercel.app"),
  openGraph: {
    title: "MAISON NOOR — The Art of Living",
    description: "Curated interiors. Considered living. The Italian Noir collection.",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
