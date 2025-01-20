//2024-12-13

import puppeteer from "puppeteer";

export async function searchLinks(browser, searchQuery) {

  const page = await browser.newPage();

  try {
    
    await page.setRequestInterception(true);
    //await page.setJavaScriptEnabled(false);
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
    const sel = ".tF2Cxc";
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

  catch(error) {
    console.log(error);
  }

  finally {
    page.close();
  }

    
  
}


export async function pullLink(browser, searchQuery) {

    const page = await browser.newPage();
    const userType = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";

    try {
        
      await page.setUserAgent(userType);
      await page.setJavaScriptEnabled(true);
      await page.goto("https://www.google.com/", {
      waitUntil: "domcontentloaded",
      });

      await page.type(".lst", searchQuery, {delay: 50});
      await page.keyboard.press("Enter");
      const a = await page.waitForSelector(".zBAuLc");

      await Promise.all([
      page.waitForNavigation({waitUntil: "domcontentloaded"}),
      a.evaluate(el => el.click()),
      ]);

      console.log(page.url());
      return page.url();
    
    } catch(error) {
      console.log(error);
    }

    finally {
      page.close();
    }

}

