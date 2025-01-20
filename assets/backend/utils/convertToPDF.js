import fs from 'fs';
import https from 'https';
import puppeteer, { launch } from 'puppeteer';


async function downloadPDF(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadPDF(response.headers.location, outputPath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(`Failed to download PDF: HTTP Status ${response.statusCode}`);
      }

      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', err => {
        fs.unlink(outputPath, () => reject(err));
      });
    }).on('error', err => {
      fs.unlink(outputPath, () => reject(err));
    });
  });
}

async function isPDFResponse(page, link) {
  const response = await page.goto(link, {waitUntil: 'domcontentloaded'});
  const contentType = response.headers()['content-type'];
  return contentType && contentType.includes('application/pdf');
}


export async function HTML2PDF(browser, link, number) {

  const outputPath = `../temp/output_${number}.pdf`;

  const page = await browser.newPage();


  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
  );

  await page.setDefaultNavigationTimeout(0);
  
  //Wait for the page to load
  await new Promise(resolve => setTimeout(resolve, 4000));

  if (await isPDFResponse(page, link)) {
    console.log('PDF detected after loading. Downloading directly...');
    await page.close();
    await downloadPDF(link, outputPath);
  } else {
    await page.pdf({ path: outputPath, format: 'A4' });
    await page.close();
  }

  console.log(`PDF saved to: ${outputPath}`);
  return outputPath;
}
