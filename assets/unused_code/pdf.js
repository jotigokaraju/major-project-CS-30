//2024-12-10

//Call dependencies
const express = require('express');
import express from 'express';
const router = express.Router();

//Call f(x) from the utilities module
import {searchLinks} from '../utils/searchForLinks.js';
import {extractTextFromPDF} from '../utils/extractText.js';
import {analyzeTextWithOpenAI} from '../utils/openAI.js';

//Call f(x) from the utilities module
import {pullLink, searchLinks} from '../utils/searchForLinks.js';
import {HTML2PDF} from '../utils/convertToPDF.js'
import {extractTextFromPDF, deletePDF} from '../utils/extractText.js';
import puppeteer from 'puppeteer';
import {toGoogle} from '../utils/login.js';

router.post('/analyze', async (req, res) => {
  const {searchQuery} = req.body;

try {

    let mapOfTitlesAndURLs = await searchLinks(searchQuery);
    //Set Browser for All Pages
    const browser = await puppeteer.launch({headless: false});

    //Sign-in Process

    let signInLink = await pullLink(browser, "Google Sign In");
    await toGoogle(browser, String(signInLink));
    let mapOfTitlesAndURLs = await searchLinks(browser, "Hello");

let url = [];

    for (let i = 0; i < searchResults.length; i++) {
      url.push(mapOfTitlesAndURLs[i].link); 
    for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
        url.push(mapOfTitlesAndURLs[i].link); 
}

    let finalResult = ""; 
    console.log(url);

    for (let link of url) {

      //Extract text from the PDF located at the given URL
      let pdfText = await extractTextFromPDF(link);
      console.log(pdfText);
      
      //Analyze the extracted text using OpenAI
      //let analysis = await analyzeTextWithOpenAI(pdfText);
    let result = [];
    let pdfLink, pdfText;
    let deletingList = [];

      //finalResult += ("Next Entry " + analysis + ". ");
    for (let link of url) {
        pdfLink = await HTML2PDF(browser, link, url.indexOf(link))
        pdfText = await extractTextFromPDF(pdfLink);
        deletingList.push(pdfLink);
        result.push(pdfText);
    }

    for (let del of deletingList) {
      deletePDF(del);
}
    

    res.json({finalResult});
    console.log(result); 
} 

catch (error) {
@@ -48,4 +57,4 @@ router.post('/analyze', async (req, res) => {

});

module.exports = router;
export default router;