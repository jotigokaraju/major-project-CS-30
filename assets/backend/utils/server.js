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
let summarizedText = ["a", "b"];
let geminiAnalysis = [];
// Define an endpoint to trigger the Puppeteer analysis
app.post('/run-analysis', async (req, res) => {
  const { searchQ } = req.body; // Get the search query from the request body
  if (!searchQ) {
    return res.status(400).json({ error: 'Missing search query' });
  }


  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: false });
    
    //let signInLink = await pullLink(browser, "Google Log In");
    //await toGoogle(browser, String(signInLink));

    // Perform search and processing
    //await search(browser, searchQ, searchQ);

    res.json({key: summarizedText});

    // Close the browser once done
    await browser.close();
  } catch (error) {
    console.error('Error during Puppeteer processing:', error);
    res.status(500).json({ error: 'Failed to run Puppeteer analysis' });
  }
});

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
    geminiAnalysis.push(understandPDF(originalSearch, pdfLink));
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
}

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
