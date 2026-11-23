import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
 testDir:"./tests/browser",testMatch:"house-wood.spec.ts",timeout:60000,expect:{timeout:10000},fullyParallel:false,retries:process.env.CI?1:0,reporter:"list",
 use:{baseURL:"http://127.0.0.1:3000",trace:"retain-on-failure",screenshot:"only-on-failure"},
 projects:[{name:"mobile-320",use:{...devices["Desktop Chrome"],viewport:{width:320,height:720},isMobile:true,hasTouch:true}},{name:"mobile-390",use:{...devices["Desktop Chrome"],viewport:{width:390,height:844},isMobile:true,hasTouch:true}},{name:"tablet-768",use:{...devices["Desktop Chrome"],viewport:{width:768,height:1024}}},{name:"desktop-1440",use:{...devices["Desktop Chrome"],viewport:{width:1440,height:900}}}],
 webServer:{command:"npm run start",url:"http://127.0.0.1:3000",reuseExistingServer:!process.env.CI,timeout:120000}
});
