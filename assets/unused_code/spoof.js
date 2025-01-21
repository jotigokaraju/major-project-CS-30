import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function launchBrowser() {
    const browser = await puppeteer.launch({
        headless: false,  // Change to true if running in production
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
        ]
    });

    const page = await browser.newPage();

    // Spoof user-agent to appear like a real browser
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    );

    // Reduce bot-detection risks by setting viewport size
    await page.setViewport({ width: 1366, height: 768 });

    // Open Facebook
    try {
        await page.goto('https://www.facebook.com/', {
            waitUntil: 'domcontentloaded',
            timeout: 10000 // 10 seconds
        });

        console.log('Page loaded successfully.');
    } catch (error) {
        console.error('Navigation error:', error.message);
    }

    return page;
}

launchBrowser();
