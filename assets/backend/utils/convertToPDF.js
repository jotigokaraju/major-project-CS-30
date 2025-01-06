const puppeteer = require('puppeteer');

export async function HTML2PDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com', { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'output.pdf', format: 'A4' });
    await browser.close();
};



