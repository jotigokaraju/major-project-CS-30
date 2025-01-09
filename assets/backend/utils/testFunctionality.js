//2024-12-10



//Call f(x) from the utilities module
import {searchLinks} from '../utils/searchForLinks.js';
import {HTML2PDF} from '../utils/convertToPDF.js'
import {extractTextFromPDF} from '../utils/extractText.js';


let mapOfTitlesAndURLs = await searchLinks("Hello");

let url = [];

for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
    url.push(mapOfTitlesAndURLs[i].link); 
}

let finalResult = ""; 

for (let link of url) {

    let pdf = await HTML2PDF(link)
    let pdfText = await extractTextFromPDF(pdf);
    console.log(pdfText);
    

}


