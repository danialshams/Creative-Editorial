import {test,expect} from "@playwright/test";
test("Persian home, images, cart, mobile menu, no horizontal overflow",async({page},testInfo)=>{
 await page.addInitScript(()=>{try{sessionStorage.setItem("khaneh-choob-intro-v1","done")}catch{}});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await expect(page.locator('html')).toHaveAttribute("dir","rtl");
 await expect(page.getByRole("heading",{name:/دکوراسیون مدرن منزل/})).toBeVisible();
 await expect(page.locator(".category-card")).toHaveCount(4);
 await expect(page.locator(".product-card")).toHaveCount(4);
 await page.locator(".product-card .add-small").first().click();
 await expect(page.getByRole("dialog",{name:"سبد خرید"})).toBeVisible();
 await page.getByRole("button",{name:"بستن سبد"}).click();
 const mobile=testInfo.project.name.includes("mobile");
 if(mobile){const menuBtn=page.getByRole("button",{name:"باز کردن منوی موبایل"}); const btn=await menuBtn.boundingBox();const brand=await page.locator(".header-inner>.brand").boundingBox();expect(btn).not.toBeNull();expect(brand).not.toBeNull();expect(btn!.x).toBeGreaterThan(brand!.x); const heroCopy=await page.locator(".hero-copy").boundingBox();const img=await page.locator(".hero-picture").boundingBox();expect(heroCopy!.y).toBeLessThan(img!.y+img!.height*.48);await menuBtn.click();await expect(page.getByRole("navigation",{name:"لینک‌های موبایل"})).toBeVisible();await page.getByRole("button",{name:"بستن منو"}).click();}
 const wrong=await page.locator("img").evaluateAll(els=>els.filter(img=>img instanceof HTMLImageElement && img.complete&&img.naturalWidth===0).map(img=>img.getAttribute('src')));
 expect(wrong).toEqual([]);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await page.screenshot({path:`test-results/khaneh-choob-${testInfo.project.name}.png`,fullPage:true});
});
