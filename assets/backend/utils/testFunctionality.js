//2024-12-10



//Call f(x) from the utilities module
import {searchLinks} from '../utils/searchForLinks.js';
import {extractTextFromPDF} from '../utils/extractText.js';
//import {analyzeTextWithOpenAI} from '../utils/openAI.js';


let mapOfTitlesAndURLs = await searchLinks("Hello");

let url = [];

for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
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


