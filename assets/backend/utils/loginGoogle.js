import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { env } from 'process';
puppeteer.use(StealthPlugin());
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9,hy;q=0.8'
});
await page.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2Fgsi%2Fselect%3Fclient_id%3D990339570472-k6nqn1tpmitg8pui82bfaun3jrpmiuhs.apps.googleusercontent.com%26auto_select%3Dtrue%26ux_mode%3Dpopup%26ui_mode%3Dcard%26context%3Dsignin%26as%3Dk6Lq5%252BI8xRkRWJBgRxnMzA%26channel_id%3D678a7eed549b36eca2923192eddec71b69d6e91b2fd68b4fb94347133bf71a26%26origin%3Dhttps%3A%2F%2Fwww.linkedin.com&faa=1&ifkv=AVdkyDlKJrRNfnjxmpPubI-ty71nyJo1L9Li8e6yXDIc6Eue2XVLwR6R-FcIZf2JvHgk9wPE0vmxGQ&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S-551844104%3A1736532247468125&ddm=1');
await page.waitForSelector('input[type="email"]')
await page.type('input[type="email"]', 'alternatealternate31@gmail.com', {delay: 150});
await Promise.all([
    page.waitForNavigation(),
    await page.keyboard.press('Enter')
]);
await page.waitForSelector('input[type="password"]', { visible: true });
await page.type('input[type="password"]', '1234567890!a', {delay: 150});
const res = await Promise.all([
    page.waitForFunction(() => location.href === 'https://linkedin.com/'),
    await page.keyboard.press('Enter')
]);
// print user id
await page.waitForFunction(() => window?.branch?.g);
const myId = await page.evaluate(() => window.branch.g);
console.log("myId:", myId);
await browser.close();