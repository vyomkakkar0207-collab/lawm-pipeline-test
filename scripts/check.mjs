// Structural checks for the dummy site. Fails loudly so the pipeline's
// "tests failed -> do not deploy" path can be exercised.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

const failures = [];
if (!/<h1>[^<]+<\/h1>/.test(html)) failures.push('missing <h1>');
if (!html.includes('id="packages"')) failures.push('missing packages section');
if (html.includes('birthday-basic') && !/class="price"/.test(html)) failures.push('package without price');

// Every package price must be a rupee amount.
const prices = [...html.matchAll(/class="price">([^<]+)</g)].map((m) => m[1].trim());
for (const p of prices) {
  if (!/^₹[\d,]+$/.test(p)) failures.push(`price not in rupee format: ${p}`);
}

if (failures.length) {
  console.error(`check: ${failures.length} failure(s)`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log(`check: ok (${prices.length} package price(s) validated)`);
