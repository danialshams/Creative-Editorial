import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const app=readFileSync('public/atrium-app.js','utf8');
const m=app.match(/const PRODUCTS=(\[[^;]+\]);/);
assert.ok(m,'The demo should contain product data');
const products=JSON.parse(m[1]);
test('catalog has 12 unique products',()=>{
 assert.equal(products.length,12);
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);
 assert.equal(new Set(products.map(p=>p.slug)).size,products.length);
});
test('all products have positive prices and valid categories',()=>{
 const cats=new Set(['decor','lighting','furniture','textile']);
 for(const p of products){assert.ok(p.price>0);assert.ok(cats.has(p.categorySlug));assert.ok(p.title.length>3);if(p.oldPrice) assert.ok(p.oldPrice>p.price);}
});
test('demo checkout clearly states that payment is not connected',()=>{
 assert.match(app,/درگاه پرداخت در این نسخه نمایشی فعال نیست/);
 assert.match(app,/بک‌اند و درگاه پرداخت متصل شود/);
});
test('all product artwork is first-party and present',()=>{
 const m=app.match(/const IMAGE=(\{[^;]+\});/);assert.ok(m);
 const images=JSON.parse(m[1]);let n=0;
 for(const p of products){assert.ok(images[p.slug]);assert.match(images[p.slug],/^\/images\/[-\w]+\.svg$/);n++;}
 assert.ok(readdirSync('public/images').length>=n);
});
