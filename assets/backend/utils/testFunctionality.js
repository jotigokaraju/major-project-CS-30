//2024-12-10



//Call f(x) from the utilities module
import {searchLinks} from '../utils/searchForLinks.js';
import {HTML2PDF} from '../utils/convertToPDF.js'
import {extractTextFromPDF, deletePDF} from '../utils/extractText.js';


let mapOfTitlesAndURLs = await searchLinks("Nialan Young Saskatoon High School");

let url = [];

for (let i = 0; i < mapOfTitlesAndURLs.length; i++) {
    url.push(mapOfTitlesAndURLs[i].link); 
}
console.log(url);

let result = [];
let pdfLink, pdfText;
let deletingList = [];

for (let link of url) {
    pdfLink = await HTML2PDF(link, url.indexOf(link))
    pdfText = await extractTextFromPDF(pdfLink);
    deletingList.push(pdfLink);
    result.push(pdfText);
}

for (let del of deletingList) {
  deletePDF(del);
}

console.log(result); 






