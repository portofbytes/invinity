#!/usr/bin/env node
import puppeteer from "puppeteer-core";

const [, , routeArg, outArg, sizeArg, modeArg] = process.argv;
const route = routeArg ?? "/";
const out = outArg ?? "/tmp/shot.png";
const [w, h] = (sizeArg ?? "1400x900").split("x").map(Number);
const mode = modeArg ?? "full";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await page.evaluate(() => {
  localStorage.setItem("invinity.age.v1", "1");
  localStorage.setItem("invinity.cookies.v1", "1");
  localStorage.setItem("invinity.announcement.v1", "gcbdb-2018-spring-2024");
});
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 1500));

if (mode === "hero") {
  await page.screenshot({ path: out });              // viewport-only, top of page
} else if (mode === "wavezone") {
  await page.evaluate((h) => {
    const ocean = document.querySelector(".invinity-ocean");
    if (!ocean) return;
    const rect = ocean.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    window.scrollTo(0, absoluteTop - (h / 2 - rect.height / 2));
  }, h);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: out });
} else if (mode === "footer") {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: out });
} else {
  await page.screenshot({ path: out, fullPage: true });
}
console.log(`saved ${out}`);
await browser.close();
