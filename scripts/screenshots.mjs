import { chromium } from "playwright";
import { mkdirSync } from "fs";

mkdirSync("public/projects", { recursive: true });

const sites = [
  { id: "clement-seguin", url: "https://clement-seguin.fr" },
  { id: "freelanceos",    url: "https://freelanceoshq.com" },
  { id: "wet-dry",        url: "https://wetdrycleaningbansko.com" },
  { id: "kinetic",        url: "https://kinetic-infra.vercel.app" },
  { id: "paw-fact",       url: "https://paw-fact-studio.vercel.app" },
];

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

for (const site of sites) {
  console.log(`Screenshot: ${site.url}`);
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `public/projects/${site.id}.jpg`, type: "jpeg", quality: 90, clip: { x: 0, y: 0, width: 1280, height: 720 } });
    console.log(`  ✓ saved public/projects/${site.id}.jpg`);
  } catch (e) {
    console.log(`  ✗ failed: ${e.message}`);
  }
}

await browser.close();
console.log("Done.");
