import express from 'express';
import puppeteer from 'puppeteer';
import { pullLink, searchLinks } from './searchForLinks.js';
import { HTML2PDF } from './convertToPDF.js';
import { extractTextFromPDF, deletePDF } from './extractText.js';
import { toGoogle } from './login.js';
import { understandPDF, summary, query } from './AI.js';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let summarizedText = [];
let geminiAnalysis = [];

// Define an endpoint to trigger the Puppeteer analysis
app.post('/run-analysis', async (req, res) => {
  const {searchQ} = req.body; // Get the search query from the request body
  if (!searchQ) {
    return res.status(400).json({ error: 'Missing search query' });
  }


  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({headless: true});
    
    //In the actual server, we cannot login to Google since headless must be set to false, otherwise we would need to pay for server-side GUI stuff.
    let signInLink = await pullLink(browser, "Google Log In");
    await toGoogle(browser, String(signInLink));

    // Perform search and processing

    let context;
    let originalSearch;


    // for (let layer = layers; layer > 0; layer--) {

    //   if (layer === layers) {

    //   } else {

    //   }

    // }


    let searchResults = await search(browser, searchQ, searchQ);
  
    console.log('working', searchResults);
    res.send(searchResults);
    console.log("Sent?");
    res.json(searchResults);
    console.log("Sent, Again?");
    // Close the browser once done
    await browser.close();
  } catch (error) {
    console.error('Error during Puppeteer processing:', error);
    res.status(500).json({ error: 'Failed to run Puppeteer analysis' });
  }
});

function getLinks(browser, searchQ) {
  
}
// Define the search function as provided in the original code
async function search(browser, searchQ, originalSearch) {
  
  let mapOfTitlesAndURLs = await searchLinks(browser, searchQ);
  let url = [];

  for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
    url.push(mapOfTitlesAndURLs[i].link);
  }

  let result = [];
  let pdfLink, pdfText;
  let deletingList = [];

  for (let link of url) {
    pdfLink = await HTML2PDF(link, url.indexOf(link));
    pdfText = await extractTextFromPDF(pdfLink);
    result.push(pdfText);
    geminiAnalysis.push(await understandPDF(originalSearch, pdfLink));
    deletePDF(pdfLink);
    console.log(result);
  }

  for (let unsummarizedText of result) {
    try {
      summarizedText.push(await summary(unsummarizedText));
    } catch (error) {
      continue;
    }
  }

  let context = summarizedText.join(" ");
  context += String(geminiAnalysis.join(" "));
  console.log(context);
  console.log('returning');
  return context;
  
}

async function informationProcess(context, originalSearch) {

  let biography = await query(`Based on this context, create a short biography for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let personalLife = await query(`Based on this context, create a personal life section for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let factInfo = await query(`Based on this context, create some fun facts for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let fearInfo = await query(`Based on this context, what do you this the fears are for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let workInfo = await query(`Based on this context, create a work/schooling information section for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`);

  return {bio: biography, work: workInfo, personal: personalLife, facts: factInfo, fears: fearInfo}
}

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
server.timeout = 0;

