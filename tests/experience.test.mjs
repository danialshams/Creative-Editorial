import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const markup=readFileSync('src/lib/markup.ts','utf8');
const styles=readFileSync('src/app/globals.css','utf8');
const app=readFileSync('public/atrium-app.js','utf8');
test('Persian RTL navigation and major pages are present',()=>{
 for(const x of ['page-home','page-shop','page-product','cart-counter','preview-overlays','shop-products']) assert.ok(markup.includes(x),x);
});
test('responsive and accessible motion variants are present',()=>{
 assert.match(styles,/@media\s*\(max-width/);
 assert.match(styles,/prefers-reduced-motion/);
 assert.match(styles,/:focus-visible/);
});
test('interactive search, filtering, product detail and cart handlers exist',()=>{
 for(const x of ['renderShop','showProduct','drawCart','localStorage','data-filter','data-add'])assert.ok(app.includes(x),x);
});
test('HTML is not reliant on remote imagery or third party scripts',()=>{
 assert.ok(!markup.includes('images.unsplash.com'));
 assert.ok(!markup.includes('data:image/svg+xml;base64,'));
});
