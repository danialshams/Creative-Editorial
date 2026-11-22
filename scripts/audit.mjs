import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const c = readFileSync('src/lib/markup.ts','utf8');
const css = readFileSync('src/app/globals.css','utf8');
const js = readFileSync('public/atrium-app.js','utf8');
assert.match(c,/آتریوم/u); // Persian branding
assert.match(c,/page-home/);
assert.match(c,/page-shop/);
assert.match(c,/page-product/);
assert.match(c,/aria-label/);
assert.match(css,/@media/);
assert.match(css,/prefers-reduced-motion/);
assert.match(js,/atrium-preview-cart/);
assert.match(js,/data-detail-add|dataset\.detailAdd/);
assert(!c.includes('data:image/svg+xml;base64,'));
assert(!js.includes('data:image/svg+xml;base64,'));
const assets=readdirSync('public/images').filter(x=>x.endsWith('.svg'));
assert(assets.length>=12);
console.log(`Static quality audit passed (${assets.length} local SVG artworks).`);
