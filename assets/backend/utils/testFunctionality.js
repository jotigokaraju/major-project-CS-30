//2024-12-10



//Call f(x) from the utilities module
import {pullLink, searchLinks} from '../utils/searchForLinks.js';
import {HTML2PDF} from '../utils/convertToPDF.js'
import {extractTextFromPDF, deletePDF} from '../utils/extractText.js';
import puppeteer from 'puppeteer';
import {toGoogle} from '../utils/login.js';

//Set Browser for All Pages
const browser = await puppeteer.launch({headless: false});

//Sign-in Process

let signInLink = await pullLink(browser, "Google Sign In");
await toGoogle(browser, String(signInLink));
let mapOfTitlesAndURLs = await searchLinks(browser, "Joti Gokaraju");

let url = [];

for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
    url.push(mapOfTitlesAndURLs[i].link); 
}

console.log(url);

let result = [];
let pdfLink, pdfText;
let deletingList = [];

for (let link of url) {
    pdfLink = await HTML2PDF(browser, link, url.indexOf(link))
    pdfText = await extractTextFromPDF(pdfLink);
    deletingList.push(pdfLink);
    result.push(pdfText);
}

for (let del of deletingList) {
  deletePDF(del);
}

console.log(result); 






