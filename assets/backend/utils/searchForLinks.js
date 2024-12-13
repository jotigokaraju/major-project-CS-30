

import puppeteer from "puppeteer"; // ^22.10.0

let browser;
(async () => {
  const searchQuery = "Logitech Camera";

  browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.setRequestInterception(true);
  await page.setJavaScriptEnabled(false);
  page.on("request", request => {
    request.resourceType() === "document"
      ? request.continue()
      : request.abort();
  });
  await page.goto("https://www.google.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.type("textarea", searchQuery);
  await page.$eval('[aria-label="Google Search"]', el => el.click());
  const sel = ".Gx5Zad";
  await page.waitForSelector(sel);
  const searchResults = await page.$$eval(sel, els =>
    els
      .map(e => ({
        title: e.querySelector("h3")?.textContent,
        link: e.querySelector("a").href,
      }))
      .filter(e => e.title)
  );
  console.log(searchResults);
})()
  .catch(err => console.error(err))
  .finally(() => browser?.close());

