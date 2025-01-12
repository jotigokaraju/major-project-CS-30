import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function toGoogle(link) {
    const browser = await puppeteer.launch({ headless: false });
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
        
    } finally {
        await browser.close();
    }
}


//I used ChatGPT to look through the Facebook Login Page Stylesheet and tell me the css for the fields.
//This may also be, not illegal, but 'extra-legal' since automated bot logins could violate the user agreement.
export async function toFacebook(link) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.setExtraHTTPHeaders({
            'accept-language': 'en-US,en;q=0.9',
        });

        await page.goto(link, { waitUntil: 'networkidle2' });

        await page.waitForSelector('input[name="email"]');
        await page.type('input[name="email"]', 'alternatealternate31', {delay: 50});

        await page.waitForSelector('input[name="pass"]');
        await page.type('input[name="pass"]', '1234567890!a', {delay: 50});

        await Promise.all([
            page.click('button[name="login"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

    } catch (error) {
        console.error("Error during login:", error);

    } finally {
        await browser.close();
    }
}

export async function toLinkedIn(link) {

    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    //await page.waitForSelector('.google-auth-button__tc, .google-one-tap-module__outline');

    //await page.$eval("input[class='qJTHM']", elem => elem.click());


    await page.click('.google-auth-button__tc, .google-one-tap-module__outline');

    const pages = await browser.pages();
    //const googleSignInPage = pages.find(p => p.url().includes('accounts.google.com'));

    //toGoogle(googleSignInPage.url());


}

toLinkedIn(1);