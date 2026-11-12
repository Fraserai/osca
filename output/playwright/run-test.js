const { chromium, devices } = require('playwright');
const fs = require('node:fs/promises');

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

async function rowTexts(page, limit = 10) {
  return page.locator('button.osca-fade-row').evaluateAll((nodes, max) => {
    return nodes.slice(0, max).map((node) => node.innerText.replace(/\s+/g, ' ').trim());
  }, limit);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (error) => {
    pageErrors.push(String(error));
  });

  console.log('Open home');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByRole('heading', { level: 1, name: /find your occupation/i }).waitFor({ state: 'visible' });
  await page.locator('button.osca-fade-row').first().waitFor({ state: 'visible' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'output/playwright/v2-home.png', fullPage: true });

  const home = {
    title: await page.title(),
    url: page.url(),
    heading: await page.locator('h1').innerText(),
    heroSnippet: clean((await page.locator('body').innerText()).slice(0, 1600)),
    topRows: await rowTexts(page, 5)
  };

  console.log('Expand industry exposure');
  await page.getByRole('button', { name: /show industry exposure/i }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'output/playwright/v2-industry-exposure.png', fullPage: true });
  const industryExpanded = {
    buttonText: await page.getByRole('button', { name: /hide industry exposure/i }).innerText(),
    bodyHasIndustryHeader: clean(await page.locator('body').innerText()).includes('Where exposure clusters by sector')
  };

  console.log('Search for biotechnologist');
  const search = page.getByPlaceholder('Search by role, code, group, or task...');
  await search.fill('biotechnologist');
  await page.waitForTimeout(800);
  const biotechnologistRows = await rowTexts(page, 5);
  await page.screenshot({ path: 'output/playwright/v2-search-biotechnologist.png', fullPage: true });

  console.log('Open role detail');
  await page.getByRole('button', { name: /Biotechnologist/i }).first().click();
  const detailPanel = page.locator('div').filter({ has: page.getByRole('heading', { level: 2, name: 'Biotechnologist' }) }).last();
  await page.getByRole('heading', { level: 2, name: 'Biotechnologist' }).waitFor({ state: 'visible', timeout: 10000 });
  await page.screenshot({ path: 'output/playwright/v2-biotechnologist-panel.png', fullPage: true });
  const detail = {
    title: await page.getByRole('heading', { level: 2, name: 'Biotechnologist' }).innerText(),
    url: page.url(),
    snippet: clean((await detailPanel.innerText()).slice(0, 1800)),
    taskRows: await page.locator('text=/Can do today|Partial support|Human required/').count()
  };
  await page.getByRole('button', { name: /^Close$/ }).click();
  await page.waitForTimeout(300);

  console.log('Sort by salary');
  await search.fill('');
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /^Salary/ }).click();
  await page.waitForTimeout(500);
  const salarySortedTopRows = await rowTexts(page, 5);

  console.log('Apply critical risk filter');
  await page.locator('select').nth(0).selectOption('Critical');
  await page.waitForTimeout(500);
  const criticalRows = await rowTexts(page, 8);
  const criticalCheck = criticalRows.every((text) => text.toUpperCase().includes('CRITICAL'));
  await page.screenshot({ path: 'output/playwright/v2-critical-filter.png', fullPage: true });

  console.log('Apply now timeline filter');
  await page.locator('select').nth(1).selectOption('Now');
  await page.waitForTimeout(500);
  const nowRows = await rowTexts(page, 8);
  const nowCheck = nowRows.every((text) => text.toUpperCase().includes('NOW'));
  await page.screenshot({ path: 'output/playwright/v2-now-filter.png', fullPage: true });

  console.log('Check mobile');
  const mobileContext = await browser.newContext({ ...devices['iPhone 13'] });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await mobilePage.waitForTimeout(900);
  await mobilePage.screenshot({ path: 'output/playwright/v2-home-mobile.png', fullPage: true });
  await mobilePage.locator('button.osca-fade-row').first().click();
  await mobilePage.getByRole('button', { name: /^Close$/ }).waitFor({ state: 'visible' });
  await mobilePage.screenshot({ path: 'output/playwright/v2-mobile-panel.png', fullPage: true });
  const mobile = {
    overflow: await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    rowCount: await mobilePage.locator('button.osca-fade-row').count(),
    firstRows: await rowTexts(mobilePage, 3),
    closeVisible: await mobilePage.getByRole('button', { name: /^Close$/ }).isVisible()
  };
  await mobileContext.close();

  console.log('Check methodology');
  const methodology = await browser.newPage({ viewport: { width: 1280, height: 1300 } });
  await methodology.goto('http://localhost:3000/methodology', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await methodology.screenshot({ path: 'output/playwright/v2-methodology.png', fullPage: true });
  const methodologySummary = {
    title: await methodology.title(),
    heading: await methodology.locator('h1').innerText(),
    snippet: clean((await methodology.locator('body').innerText()).slice(0, 1400))
  };
  await methodology.close();

  await browser.close();

  const summary = {
    home,
    industryExpanded,
    search: {
      query: 'biotechnologist',
      rows: biotechnologistRows
    },
    detail,
    sorting: {
      salarySortedTopRows
    },
    riskFilter: {
      applied: 'Critical',
      rows: criticalRows,
      allRowsCriticalInSample: criticalCheck
    },
    timelineFilter: {
      applied: 'Now',
      rows: nowRows,
      allRowsNowInSample: nowCheck
    },
    mobile,
    methodology: methodologySummary,
    runtime: {
      pageErrors,
      consoleMessages
    }
  };

  await fs.writeFile('output/playwright/v2-test-summary.json', `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  console.log('Wrote output/playwright/v2-test-summary.json');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
