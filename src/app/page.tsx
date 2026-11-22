import Script from "next/script";
import { atriumMarkup } from "@/lib/markup";

/** SSR-friendly static editorial markup. Interactive demo behaviors are booted once after hydration. */
export default function Home() {
  return <>
    <div id="atrium-root" dangerouslySetInnerHTML={{ __html: atriumMarkup }} />
    <Script id="atrium-interactions" src="/atrium-app.js" strategy="afterInteractive" />
  </>;
}
