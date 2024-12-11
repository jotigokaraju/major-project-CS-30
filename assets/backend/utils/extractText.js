//2024-12-10

const pdfjsLib = require('pdfjs-dist/es5/build/pdf');  //Import PDF.js to parse PDF files

// Function to extract text from a PDF URL
async function extractTextFromPDF(pdfUrl) {
  let loadingTask = pdfjsLib.getDocument(pdfUrl);  //Load the PDF from the URL
  let pdfDocument = await loadingTask.promise;     //Get the PDF document

  let fullText = '';  //Initialize an empty string to store the full text
  
  //Loop through each page in the PDF and extract the text
  for (let i = 0; i < pdfDocument.numPages; i++) {
    let page = await pdfDocument.getPage(i + 1);  //Get each page of the PDF
    let textContent = await page.getTextContent();  //Get the text content of the page
    fullText += textContent.items.map(item => item.str).join(' ');  //Strip
  }

  return fullText;  //Return the extracted text
}

module.exports = { extractTextFromPDF };
