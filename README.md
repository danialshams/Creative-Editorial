# MAISON NOOR — Italian Noir

Luxury, photographic, Persian RTL interior editorial commerce concept built using Next.js 16, TypeScript and GSAP ScrollTrigger.

## Design direction
* **Italian Noir:** dark charcoal, walnut, restrained champagne gold and cream.
* Large licensed photoreal concept art; each editorial image is different.
* Three photographic reveals: architectural vertical mask, asymmetrical arch and radial crescent cut.
* Premium brand intro: Canvas-rendered silk velvet curtain with per-row damped Verlet spring mass, gravitational sag, pleat shading, realistic bottom-edge inertia, GSAP time driver, reduced-motion bypass and 6.5s fail-safe unlock.
* GSAP hero typography, progressive scroll reveals, subtle image parallax and reverse-safe cleanup.
* Real interactive filters, search, product detail modal, favorites, and client-persisted demo cart.
* Accessible overlays, keyboard Escape, semantic landmarks, portrait layouts, 320px+ responsive styling.

## Commands
- npm install
- npm run dev
- npm run check
- npm run build

## Images and provenance
All 13 editorial images are generated specifically for this MAISON NOOR demonstration, curated for a coherent Italian Noir palette and exported as local .webp under public/images. There is no online image CDN dependency. They depict imagined scenes, not photographed inventory. No exact product attribution or real manufacturer endorsement is implied. Full-bleed image frames use object-fit: cover and two curated image masks only.

## Scope
**Demo-only** commerce UX: no database, checkout/payment, order submission, or newsletter backend. Cart is stored locally on the client and must not be construed as a transaction.

## Release
GitHub Actions verifies structural quality checks, TypeScript, and builds on main. Vercel deploys the connected repository on main. Functional browser testing and image loading should be checked separately, since a successful build cannot establish visual quality alone.
