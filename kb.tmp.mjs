import { chromium } from '@playwright/test';
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4174/');
await p.waitForTimeout(1500);
const seen = [];
for (let i = 0; i < 9; i++) {
  await p.keyboard.press('Tab');
  seen.push(await p.evaluate(() => { const a = document.activeElement; return (a.className || a.tagName) + ':' + (a.textContent || '').trim().slice(0, 24); }));
  if (seen.at(-1).startsWith('skip')) await p.screenshot({ path: process.argv[2] + '/kb.png' });
}
console.log(seen.join('\n'));
await p.keyboard.press('Enter'); // nothing focused special; check skip link jump separately
await p.goto('http://localhost:4174/'); await p.waitForTimeout(800);
for (let i = 0; i < 7; i++) await p.keyboard.press('Tab');
console.log('focused', await p.evaluate(() => document.activeElement.className));
await p.keyboard.press('Enter'); await p.waitForTimeout(2500);
console.log('after skip', await p.evaluate(() => Math.round(document.getElementById('work').getBoundingClientRect().top)));
const m = await b.newPage({ viewport: { width: 360, height: 780 } });
await m.goto('http://localhost:4174/'); await m.waitForTimeout(1500);
console.log('360 scrollWidth', await m.evaluate(() => document.documentElement.scrollWidth));
await b.close();
