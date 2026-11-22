import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "آتریوم | طراحی‌های ماندگار برای خانه",
  description: "آتریوم، پیش‌نمایش تعاملی فروشگاه آنلاین دکوراسیون و لوازم منزل؛ انتخاب‌های خاص برای خانه‌ای آرام و زیبا.",
  applicationName: "ATRIUM — Objects & Living",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f6f2eb" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
