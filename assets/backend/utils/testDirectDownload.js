import fs from 'fs';
import https from 'https';


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

downloadPDF("https://conferences.usask.ca/srsf/2022-award-recipient-list.pdf", '../temp/output1.pdf')