import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={
 title:"خانه چوب | مبلمان و دکوراسیون مدرن منزل",
 description:"خانه چوب؛ مجموعه‌ای از مبلمان مدرن، میز و صندلی، دکوراسیون نشیمن و اتاق خواب با طراحی گرم و ماندگار.",
 metadataBase:new URL("https://creative-editorial.vercel.app"),
 openGraph:{title:"خانه چوب — مبلمان و دکوراسیون منزل",description:"برای هر گوشه از خانه، زیبایی و آرامش",locale:"fa_IR",type:"website"},
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>}
