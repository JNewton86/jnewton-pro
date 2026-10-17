// Runs Lighthouse (mobile, simulated throttling) against the production build and fails if
// any category drops below its budget. Lighthouse's accessibility audits are powered by axe-core.
// Usage: npm run build && npm run lighthouse   (HTML reports land in lighthouse-reports/)
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

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

async function startPreview() {
  const server = spawn(
    process.execPath,
    ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT)],
    {
      stdio: 'ignore',
    },
  );
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      if ((await fetch(ORIGIN)).ok) return server;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  server.kill();
  throw new Error('astro preview did not start');
}

const server = remoteOrigin ? null : await startPreview();
const origin = remoteOrigin ?? ORIGIN;
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const failures = [];

try {
  await mkdir(REPORT_DIR, { recursive: true });
  for (const path of PAGES) {
    const result = await lighthouse(
      `${origin}${path}`,
      { port: chrome.port, output: 'html', logLevel: 'error' },
      {
        extends: 'lighthouse:default',
        settings: {
          onlyCategories: Object.keys(BUDGETS),
          skipAudits: remoteOrigin ? [] : SKIP_LOCAL,
        },
      },
    );
    if (!result) throw new Error(`Lighthouse returned no result for ${path}`);
    const { categories, audits } = result.lhr;

    const name = path === '/' ? 'home' : path.replaceAll('/', '-').replace(/^-|-$/g, '');
    await writeFile(`${REPORT_DIR}/${name}.html`, result.report);

    const scores = Object.entries(BUDGETS).map(([id, min]) => {
      const score = categories[id]?.score ?? 0;
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
    console.log(`${path.padEnd(28)} ${scores.join('  ')}`);
  }
} finally {
  chrome.kill();
  server?.kill();
}

if (failures.length) {
  console.error(`\nLighthouse budget failures:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nAll pages meet the budgets. Reports: ${REPORT_DIR}/`);
