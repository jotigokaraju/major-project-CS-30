import fs from 'fs';
import https from 'https';
import { launch } from 'puppeteer';

/**
 * Downloads a PDF file directly if detected.
 */
async function downloadPDF(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        return reject(`Failed to download PDF: HTTP Status ${response.statusCode}`);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(outputPath));
      });
    }).on('error', err => {
      fs.unlink(outputPath, () => reject(err));
    });
  });
}

/**
 * Detects if the response is a PDF by checking headers.
 */
async function isPDFResponse(page, link) {
  const response = await page.goto(link, { waitUntil: 'domcontentloaded' });
  const contentType = response.headers()['content-type'];
  return contentType && contentType.includes('application/pdf');
}

/**
 * Converts HTML to PDF or directly downloads PDF from a link.
 */
export async function HTML2PDF(link, number) {
  const outputPath = `../temp/output_${number}.pdf`;
  var element = document.getElementById('element-to-print');html2pdf(element);

  const browser = await launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
  );

  await page.setDefaultNavigationTimeout(0);

  if (await isPDFResponse(page, link)) {
    console.log('PDF detected after loading. Downloading directly...');
    await browser.close();
    await downloadPDF(link, outputPath);
  } else {
    console.log('Rendering page to PDF using Puppeteer...');
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();
  }

  console.log(`PDF saved to: ${outputPath}`);
  return outputPath;
}
