# آتریوم · ATRIUM — Creative Editorial Storefront

A Persian RTL interactive home decor storefront built with **Next.js 16.4**, React 19 and strict TypeScript.

## Design
- Editorial visual language: warm ivory canvas, olive typography, large poetic headline, product still-life illustrations and subtle reveal motion.
- Full RTL layout across mobile/tablet/desktop, reduced-motion support, accessible focus outlines, semantic controls.
- Landing page, category discovery, product listings, search/sort, detailed product view, local cart persistence, visual hotspots.

## Run
```bash
npm install
npm run check
npm run build
npm run dev
```

## Important demo limitations
This is an **interactive product demo**. Products/prices and stock are sample data. Cart persists in the browser only (`localStorage`). **No user authentication, backend inventory, order persistence or payment gateway** is connected. The checkout intentionally tells the visitor it is a preview.

## Design provenance
Migrated from the earlier interactive `ATRIUM-live-preview.html` prototype. The original illustrated imagery is included as self-contained local SVG files in `public/images` (no external image dependency). The markup is rendered on the server by Next.js and interactive behavior is loaded after hydration from `public/atrium-app.js`. This keeps the approved prototype's visuals and interactions while providing a Next.js deployment foundation. For a later production release, migrate event handlers and domain state into typed React components and a real backend.

## Deployment
Push to `main`; GitHub Actions installs locked dependencies, runs tests, typecheck, audit and production build. Connect the repository to Vercel; main is production branch. Review the deployed site on mobile and desktop.
