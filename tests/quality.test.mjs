import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync,statSync} from "node:fs";
import {join} from "node:path";
import {createHash} from "node:crypto";
const page=readFileSync("components/HouseWoodHome.tsx","utf8");
const intro=readFileSync("components/HouseLightIntro.tsx","utf8");
const css=readFileSync("app/globals.css","utf8");
const layout=readFileSync("app/layout.tsx","utf8");
const assets=["hero-scene","hero-mobile","categories/living","categories/dining","categories/bedroom","categories/storage","products/arca-lamp","products/roma-sideboard","products/liora-chair","products/nova-table","spaces/living","spaces/bedroom","spaces/dining","journal/wood-care","journal/choose-bed","journal/warm-living","about-brand","autumn-collection","featured-room"];
test("RTL Persian storefront has all approved homepage sections",()=>{assert.match(layout,/lang="fa" dir="rtl"/);for(const s of ["خانه چوب","دسته‌بندی محصولات","محبوب‌ترین محصولات","خرید بر اساس فضا","درباره خانه چوب","مجله و ایده‌ها","نظر مشتریان"])assert.ok(page.includes(s),"missing section "+s)});
test("Every unique photograph is local sharp WebP with a single reference",()=>{assert.equal(new Set(assets).size,assets.length);for(const n of assets){let p=join("public/images",n+".webp");assert.ok(existsSync(p),"missing "+p);assert.ok(statSync(p).size<850000,"oversized "+p);assert.equal(page.split(`/${n}.webp`).length-1,1,"image repeated "+n)}});
test("The hero is a single unified image with responsive source",()=>{assert.match(page,/hero-scene\.webp/);assert.match(page,/hero-mobile\.webp/);assert.match(page,/<picture className="hero-picture"/);assert.doesNotMatch(page,/hero-left-image|hero-right-image/)});
test("House intro uses traced vector outline and glowing travelling light",()=>{assert.match(css,/stroke-dasharray/);assert.match(intro,/animateMotion/);assert.match(intro,/house-intro__brand/);assert.match(css,/@keyframes house-draw/)});
test("Interactive demo features and accessibility are present",()=>{for(const s of ["gsap.context","gsap.registerPlugin","data-stagger","data-parallax","aria-label","aria-modal","setCart","setSearch","setFavs","Escape","prefers-reduced-motion","checkout-btn"])assert.ok((page+css).includes(s),"missing "+s)});
test("Full responsive coverage",()=>{for(const size of ["980px","700px","400px"])assert.ok(css.includes(`max-width:${size}`))});


test("All non-hero furniture images use unique high-detail WebP assets",()=>{
 const upgraded=assets.filter(n=>!["hero-scene","hero-mobile","about-brand"].includes(n));
 const fs={createHash};
 const hashes=new Set();
 for(const n of upgraded){
  const path=join("public/images",n+".webp");
  const source=readFileSync(path);
  assert.ok(source.length>90000,"undersized photo: "+path);
  const hash=fs.createHash("sha256").update(source).digest("hex");
  assert.ok(!hashes.has(hash),"duplicate image: "+path);
  hashes.add(hash);
 }
 assert.match(css,/object-fit:cover!important/);
 assert.match(css,/\.space-img img\[data-parallax\]/);
});
test("Vazir variable font is self-hosted and used across the storefront",()=>{
 assert.ok(existsSync(join("public","fonts","Vazirmatn-variable.woff2")));
 assert.match(css,/@font-face\{font-family:"Vazir"/);
 assert.match(css,/html,body,button,input,textarea,select\{font-family:"Vazir"/);
});
