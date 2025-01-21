
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function toGoogle(browser, link) {
    const page = await browser.newPage();
    
    try {
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
        });

        await page.goto(link);
        await page.waitForSelector('input[type="email"]')
        await page.type('input[type="email"]', 'alternatealternate31@gmail.com', {delay: 50});
        
        await Promise.all([
            page.waitForNavigation(),
            await page.keyboard.press('Enter')
        ]);

        await page.waitForSelector('input[type="password"]', {visible: true});
        await page.type('input[type="password"]', '1234567890!a', {delay: 50});

        await Promise.all([
            page.waitForNavigation(),
            await page.keyboard.press('Enter')
        ]);
        
    } catch(error) {
        console.log(error);
    }
}