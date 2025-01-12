import {launch} from 'puppeteer';

async function LinkedIn() {
    const browser = await launch({
        headless: false,
    });

    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');

    await page.waitForSelector('.google-auth-button__tc, .google-one-tap-module__outline');

    await page.click('.google-auth-button__tc, .google-one-tap-module__outline');

    const pages = await browser.pages();
    const googleSignInPage = pages.find(p => p.url().includes('accounts.google.com'));

    await browser.close();
};

LinkedIn();