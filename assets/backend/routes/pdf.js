//2024-12-10

//Call dependencies
const express = require('express');
const router = express.Router();

//Call f(x) from the utilities module
import {searchLinks} from '../utils/searchForLinks.js';
import {extractTextFromPDF} from '../utils/extractText.js';
import {analyzeTextWithOpenAI} from '../utils/openAI.js';


router.post('/analyze', async (req, res) => {
  const {searchQuery} = req.body;

  try {

    let mapOfTitlesAndURLs = await searchLinks(searchQuery);

    let url = [];

    for (let i = 0; i < searchResults.length; i++) {
      url.push(mapOfTitlesAndURLs[i].link); 
    }

    let finalResult = ""; 

    for (let link of url) {

      //Extract text from the PDF located at the given URL
      let pdfText = await extractTextFromPDF(link);
      console.log(pdfText);
      
      //Analyze the extracted text using OpenAI
      //let analysis = await analyzeTextWithOpenAI(pdfText);

      //finalResult += ("Next Entry " + analysis + ". ");

    }
    

    res.json({finalResult});
  } 
  
  catch (error) {
    console.log(error);
  }

});

module.exports = router;
