// Workaround Next 14.2.x bug: page_client-reference-manifest.js untuk
// route group (group)/page.tsx ke-emit ke root path, bukan ke (group)/ path.
// Vercel build trace nyari di (group)/ -> ENOENT. Script ini copy dari root.
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', '.next', 'server', 'app');
const MANIFEST = 'page_client-reference-manifest.js';

if (!fs.existsSync(appDir)) {
  console.log('[fix-manifest] .next/server/app tidak ada, skip');
  process.exit(0);
}

const rootManifest = path.join(appDir, MANIFEST);
let copied = 0;

// Cari semua folder route group: (xxx)
for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name.startsWith('(') && entry.name.endsWith(')')) {
    const groupManifest = path.join(appDir, entry.name, MANIFEST);
    // Kalau (group)/page.tsx ada (ditandai page.js) tapi manifest-nya nggak ada di situ
    const groupPageJs = path.join(appDir, entry.name, 'page.js');
    if (fs.existsSync(groupPageJs) && !fs.existsSync(groupManifest)) {
      if (fs.existsSync(rootManifest)) {
        fs.copyFileSync(rootManifest, groupManifest);
        console.log(`[fix-manifest] copied root manifest -> ${entry.name}/${MANIFEST}`);
        copied++;
      } else {
        // Fallback: bikin manifest kosong-valid kalau root juga nggak ada
        fs.writeFileSync(groupManifest, 'self.__RSC_MANIFEST=self.__RSC_MANIFEST||{};\n');
        console.log(`[fix-manifest] root manifest tidak ada, buat stub -> ${entry.name}/${MANIFEST}`);
        copied++;
      }
    }
  }
}

console.log(`[fix-manifest] selesai, ${copied} manifest diperbaiki`);
