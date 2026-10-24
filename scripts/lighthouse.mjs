// Runs Lighthouse (mobile, simulated throttling) against the production build and fails if
// any category drops below its budget. Lighthouse's accessibility audits are powered by axe-core.
// Usage: npm run build && npm run lighthouse   (HTML reports land in lighthouse-reports/)
import { mkdir, writeFile } from 'node:fs/promises';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { serveStatic } from './serve-static.mjs';

const PORT = 4331;
const ORIGIN = `http://localhost:${PORT}`;
const PAGES = ['/', '/projects/', '/projects/ai-ba-toolkit/'];
const BUDGETS = { performance: 0.95, accessibility: 1, 'best-practices': 1, seo: 1 };
// Canonical URLs point at https://jnewton.pro, which Lighthouse flags as "a different domain"
// when testing localhost. The production check (`npm run lighthouse -- --url https://jnewton.pro`)
// covers it for real.
const SKIP_LOCAL = ['canonical'];
const REPORT_DIR = 'lighthouse-reports';

const remoteArg = process.argv.indexOf('--url');
const remoteOrigin = remoteArg > -1 ? process.argv[remoteArg + 1].replace(/\/$/, '') : null;

// The pages audited are static; scripts/serve-static.mjs serves the build the way Vercel does.
const server = remoteOrigin ? null : await serveStatic(PORT);
const origin = remoteOrigin ?? ORIGIN;
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const failures = [];

// Performance varies run to run (especially on shared CI machines), so each page is
// measured RUNS times and judged on the median, as Lighthouse CI does by default.
const RUNS = 3;
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

async function audit(url) {
  const result = await lighthouse(
    url,
    { port: chrome.port, output: 'html', logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: Object.keys(BUDGETS),
        skipAudits: remoteOrigin ? [] : SKIP_LOCAL,
      },
    },
  );
  if (!result) throw new Error(`Lighthouse returned no result for ${url}`);
  return result;
}

try {
  await mkdir(REPORT_DIR, { recursive: true });
  for (const path of PAGES) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) runs.push(await audit(`${origin}${path}`));
    const medianScore = (id) => median(runs.map((r) => r.lhr.categories[id]?.score ?? 0));

    // Keep the report from the run closest to the median performance score.
    const target = medianScore('performance');
    const representative = runs.reduce((best, r) =>
      Math.abs(r.lhr.categories.performance.score - target) <
      Math.abs(best.lhr.categories.performance.score - target)
        ? r
        : best,
    );
    const { categories, audits } = representative.lhr;

    const name = path === '/' ? 'home' : path.replaceAll('/', '-').replace(/^-|-$/g, '');
    await writeFile(`${REPORT_DIR}/${name}.html`, representative.report);

    const scores = Object.entries(BUDGETS).map(([id, min]) => {
      const score = medianScore(id);
      if (score < min) {
        const failing = categories[id].auditRefs
          .map((ref) => audits[ref.id])
          .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative')
          .map((a) => `${a.id} (${a.title})`);
        failures.push(
          `${path} ${id}: ${Math.round(score * 100)} < ${min * 100}. Failing: ${failing.join('; ') || 'n/a'}`,
        );
      }
      return `${id} ${Math.round(score * 100)}`;
    });
    console.log(`${path.padEnd(28)} ${scores.join('  ')}  (median of ${RUNS})`);
  }
} finally {
  chrome.kill();
  server?.close();
}

if (failures.length) {
  console.error(`\nLighthouse budget failures:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nAll pages meet the budgets. Reports: ${REPORT_DIR}/`);
