//Server.js Code
//Extras for Experts - Server Set-up using Express and Node.js

//Import neccessary libraries
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors'; //Prevents CORS Error

//Import neccessary functions
import {pullLink, searchLinks} from './searchForLinks.js';
import {HTML2PDF} from './convertToPDF.js';
import {extractTextFromPDF, deletePDF} from './extractText.js';
import {toGoogle} from './login.js';
import {understandPDF, summary, query} from './AI.js';


//Set-up express server
let app = express();
let port = 3000;
app.use(cors()); //Prevents CORS Error
app.use(express.json());

console.log("on"); //Log a message to confirm


// Start the server
const server = app.listen(port, () => {console.log(`Server running at http://localhost:${port}`);});

//Set the timeout to infinite so it doesn't crash on it's own
server.timeout = 0;

//Set global variables
let summarizedText = [];
let geminiAnalysis = [];
let context;
let originalSearch;
let newQuery;


//Puppeteer analysis trigger
app.post('/run-analysis', async (req, res) => {

  console.log(req.body); //For debugging purposes

  let {searchQuery, range} = req.body; // Get the search query from the request body
  console.log(searchQuery, range); //For debugging purposes
  
  let layers = Number(range); //Convert to Integer Value

  console.log(layers); //For debugging purposes

  //Set as originalSearch
  originalSearch = searchQuery;

  console.log(originalSearch); //For debugging purposes

  //Handle missing query trigger
  if (!searchQuery) {
    return res.status(400).json({ error: 'Missing search query' });
  }

  //Try, Catch set-up
  try {

    // Launch Puppeteer browser
    let browser = await puppeteer.launch({headless: false});
    let page = await browser.newPage();
    await page.goto("https://www.google.com/");

    //Log-in to google using a fake account with some preferences that make puppeteer deployment easier
    //If it asks for phone verification, ignore.
    //Depending on the Chromium version, you might have to click continue as "Alternate" for it to work
    let signInLink = await pullLink(browser, "Google Log In");
    await toGoogle(browser, String(signInLink));

    // Perform search and processing
    for (let layer = layers; layer > 0; layer--) {

      if (layer === layers) {

        //Get results
        context = await search(browser, originalSearch, originalSearch);

      } else {

        //Ask additional queries
        newQuery = await query(
          `Provide another phrase to make a Google search on to learn 
          more about this person based on the context provided. 
          MAX 6 WORDS. 
          Context: ${context}`
        );

        //Generate more context
        context += await search(browser, newQuery, originalSearch);

      }

    }

    let searchResults = await informationProcess(context, originalSearch);

    console.log('working', searchResults); //Debugging Purposes Only

    //Send code to Frontend
    res.json(searchResults);

    console.log("Sent"); //Debugging Purposes Only
    

    // Close the browser once done
    await browser.close();

    
  } 

  //Output error message
  catch (error) {

    console.error('Error during Puppeteer processing:', error);
    res.status(500).json({ error: 'Failed to run Puppeteer analysis' });

  }

});


// Define the search function as provided in the original code
async function search(browser, searchQ, originalQ) {
  
  let mapOfTitlesAndURLs = await searchLinks(browser, searchQ);
  let url = [];

  for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
    url.push(mapOfTitlesAndURLs[i].link);
  }

  let result = [];
  let pdfLink, pdfText;

  for (let link of url) {
    pdfLink = await HTML2PDF(link, url.indexOf(link));
    pdfText = await extractTextFromPDF(pdfLink);
    result.push(pdfText);
    geminiAnalysis.push(await understandPDF(originalQ, pdfLink));
    deletePDF(pdfLink);
    console.log(result);
  }

  //Summarize all the extracted text.
  for (let unsummarizedText of result) {

    //Set-up Try, Catch system since there is an unexplained glitch on the last event that I cannot resolve
    //The glitch has no effect on the result, however.

    try {
      summarizedText.push(await summary(unsummarizedText));
    } 

    catch (error) {
      continue;
    }

  }

  //Format the context
  let context = summarizedText.join(" ");
  context += String(geminiAnalysis.join(" "));
  console.log(context);

  console.log('returning'); //For Debugging Purposes Only
  return context;
  
}

//Process all the information using Gemini Query feature by passing in context and looking for original search

async function informationProcess(context, originalQ) {

  let biography = await query(`Based on this context, create a short biography for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let personalLife = await query(`Based on this context, create a personal life section for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let factInfo = await query(`Based on this context, create some fun facts for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let interestsInfo = await query(`Based on this context, what do you the interests are for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`); 
  let workInfo = await query(`Based on this context, create a work/schooling information section for ${originalSearch}. Output only the plain information in sentences, nothing else. No formatting. Context: ${context}`);

  return {bio: biography, work: workInfo, personal: personalLife, facts: factInfo, interests: interestsInfo}
}



