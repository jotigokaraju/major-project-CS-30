import fs from 'fs';
import https from 'https';
import puppeteer from 'puppeteer';
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
  try {
    const response = await page.goto(link, {waitUntil: 'domcontentloaded'});
    const contentType = await response.headers()['content-type'];
    return contentType && contentType.includes('application/pdf');
  } catch(error) {
    return false;
  }
}


export async function HTML2PDF(link, number) {

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  
  

  try {
    const outputPath = `../temp/output_${number}.pdf`;



    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
    );
    
    

    if (await isPDFResponse(page, link)) {
      console.log('PDF detected after loading. Downloading directly...');
      await page.close();
      await downloadPDF(link, outputPath);
    } else {

      //Wait for the page to load or until 4s max
      await new Promise(resolve => setTimeout(resolve, 4000));
      await page.pdf({path: outputPath, format: 'A4'});
      
    }

    console.log(`PDF saved to: ${outputPath}`);
    await page.close();
    return outputPath;
  } catch(error) {
    console.log('error:', error)
  }
}
