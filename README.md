# خانه چوب | Khaneh Choob

A premium Persian RTL furniture and home-decor storefront built with Next.js 16, React 19, TypeScript, GSAP ScrollTrigger and local generated WebP photographs.

## Homepage
- Single integrated editorial hero photograph (furniture, curved ivory background and overlapping flowers in ONE exported WebP), with selectable mobile crop rendered as one mobile WebP.
- Full-width house-light tracer intro: an animated SVG path and a moving luminous point draw the outline from the right; the brand appears in the middle and then the overlay fades.
- Trust strip, four furniture categories, four interactive featured products, autumn collection, three room-based collections, story section, journal, sample reviews, and footer.
- GSAP scroll reveal/stagger/parallax; reduced-motion support.
- Responsive RTL off-canvas mobile navigation, product search, favorites, demo cart and product detail dialog.
- Every image has a unique local path and is encoded in WebP. No external image CDN.

## Demo limitations
Product prices and testimonials are illustrative. The cart is client-only and checkout is intentionally disabled. The newsletter clearly states that it is a demo. There is no production API or payment provider connected.

## Commands
```
npm install
npm run dev
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

The built-in intro runs once per browser tab. Clear sessionStorage (`khaneh-choob-intro-v1`) to replay it.
