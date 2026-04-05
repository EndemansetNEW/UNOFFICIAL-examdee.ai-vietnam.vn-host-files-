// chunk-downloader.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const BASE = "https://examdee.ai-vietnam.vn";

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) {
    console.log("❌ Failed:", url, res.status);
    return;
  }
  const buf = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buf));
  console.log("✔ Downloaded:", outPath);
}

async function main() {
  console.log("Fetching homepage…");
  const html = await fetch(BASE).then(r => r.text());
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const assets = new Set();

  // JS modules
  doc.querySelectorAll("script[src]").forEach(s => {
    const src = s.getAttribute("src");
    if (src.includes("/assets/")) assets.add(src);
  });

  // CSS + modulepreload
  doc.querySelectorAll("link[href]").forEach(l => {
    const href = l.getAttribute("href");
    if (href.includes("/assets/")) assets.add(href);
  });

  console.log("Found", assets.size, "assets.");

  const outDir = "./assets";
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  for (const asset of assets) {
    const full = asset.startsWith("http") ? asset : BASE + asset;
    const filename = path.basename(asset);
    await download(full, path.join(outDir, filename));
  }
}

main();
