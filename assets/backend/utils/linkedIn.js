import puppeteer from "puppeteer"

const browser = await puppeteer.launch({headless: false})
const page = await browser.newPage();

await page.goto('https://www.linkedin.com/signup/cold-join?session_redirect=https%3A%2F%2Fwww%2Elinkedin%2Ecom%2Ffeed%2Fupdate%2Furn%3Ali%3Aactivity%3A7186298335454994432')

await page.waitForNavigation({waitUntil: 'networkidle0'})
await page.$eval('.qJTHM', el => el.click())