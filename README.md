# MAISON NOOR — Italian Noir

Luxury, photographic, Persian RTL interior editorial commerce concept built using Next.js 16, TypeScript and GSAP ScrollTrigger.

## Design direction
* **Italian Noir:** dark charcoal, walnut, restrained champagne gold and cream.
* Large licensed real photography; each editorial image is different.
* Three photographic reveals: architectural vertical mask, asymmetrical arch and radial crescent cut.
* Premium brand intro: timed curtain opening with reduced-motion and reliable unlock.
* GSAP hero typography, progressive scroll reveals, subtle image parallax and reverse-safe cleanup.
* Real interactive filters, search, product detail modal, favorites, and client-persisted demo cart.
* Accessible overlays, keyboard Escape, semantic landmarks, portrait layouts, 320px+ responsive styling.

## Commands
- npm install
- npm run dev
- npm run check
- npm run build

## Photos and provenance
The site uses **genuine Unsplash photographs**, not AI-generated product art. Links directly reference different photograph IDs licensed under https://unsplash.com/license. The photos are displayed as editorial inspiration and **are not the actual photographed SKUs on sale**. Source files are remote Unsplash CDN assets, sized using photo query parameters. For commercial launch replace all conceptual sample photos, descriptions, prices, and product mapping with licensed brand-owned photography and real catalog data.

## Scope
**Demo-only** commerce UX: no database, checkout/payment, order submission, or newsletter backend. Cart is stored locally on the client and must not be construed as a transaction.

## Release
GitHub Actions verifies structural quality checks, TypeScript, and builds on main. Vercel deploys the connected repository on main. Functional browser testing and image loading should be checked separately, since a successful build cannot establish visual quality alone.
