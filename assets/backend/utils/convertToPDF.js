import {launch} from 'puppeteer';

export async function HTML2PDF(link) {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: 'networkidle0' });
    await page.pdf({ path: '../temp/output.pdf', format: 'A4' });
    await browser.close();
    return '../temp/output.pdf'
};