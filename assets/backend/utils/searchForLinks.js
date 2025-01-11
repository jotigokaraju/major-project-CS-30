//2024-12-13

import puppeteer from "puppeteer";

export async function searchLinks(searchQuery) {

  let browser;

  try {
    
    browser = await puppeteer.launch({headless: false});
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

    await page.type("textarea", searchQuery, {delay: 150});
    await page.$eval('[aria-label="Google Search"]', el => el.click());
    const sel = ".Gx5Zad";
    await page.waitForSelector(sel);

    let searchResults = await page.$$eval(sel, els =>
      els
        .map(e => ({
          title: e.querySelector("h3")?.textContent,
          link: e.querySelector("a").href,
        }))
        .filter(e => e.title)
    );

    console.log(searchResults);

    for (let i = 0; i < 100; i++) {
      await page.mouse.wheel({
        deltaY: i*1,
      });
    }

    setTimeout(()=>{browser.close();},4000);
    return(searchResults); 

  }

  finally {
    console.log("foo")
  }

    
  
}


