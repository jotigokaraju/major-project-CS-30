//2024-12-10

//Call dependencies
const express = require('express');
const router = express.Router();

//Call f(x) from the utilities module
let {extractTextFromPDF} = require('../utils/extractText');
let {analyzeTextWithOpenAI} = require('../utils/openAI');


router.post('/analyze', async (req, res) => {
  const {url} = req.body;

  try {

    //Extract text from the PDF located at the given URL
    let pdfText = await extractTextFromPDF(url);
    
    //Analyze the extracted text using OpenAI
    let analysis = await analyzeTextWithOpenAI(pdfText);
    
    //Send back
    res.json({ analysis });
  } 
  
  catch (error) {
    console.log(error);
  }

});

module.exports = router;
