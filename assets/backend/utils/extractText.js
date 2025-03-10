//2024-12-10

import pkg from '../node_modules/pdfjs-dist/build/pdf.js';
import fs from 'fs';
import path from 'path';

const {getDocument} = pkg;

// Function to extract text from a PDF URL
export async function extractTextFromPDF(pdfUrl) {
  let loadingTask = getDocument(pdfUrl);  //Load the PDF from the URL
  let pdfDocument = await loadingTask.promise;     //Get the PDF document

  let fullText = '';  //Initialize an empty string to store the full text
  
  //Loop through each page in the PDF and extract the text
  for (let i = 0; i < pdfDocument.numPages; i++) {
    let page = await pdfDocument.getPage(i + 1);  //Get each page of the PDF
    let textContent = await page.getTextContent();  //Get the text content of the page
    fullText += textContent.items.map(item => item.str).join(' ');  //Strip
  }

  //console.log(fullText)
  return fullText;  //Return the extracted text
}

//Function to Delete Temporary PDF
export async function deletePDF(pdfUrl) {

    const resolvedPath = path.resolve(pdfUrl);


    fs.unlink(resolvedPath, (err) => {
        if (err) {
            console.error(`Error deleting file at ${resolvedPath}:`, err);
        } else {
            console.log(`Successfully deleted file at ${resolvedPath}`);
        }
    });
}

