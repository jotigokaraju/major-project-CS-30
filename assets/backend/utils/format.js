import {analyzeTextWithOpenAI} from '../openAI.js';

const PROMPTS = new Map(); 

PROMPTS.set(bio, "Use some information to write a brief biography");
PROMPTS.set(personal, "Use some information to write a personal life section", );
PROMPTS.set(career, "Use some information write a career section");
PROMPTS.set(interests, "Use some information deduce goals and aspirations and insecurities");

let results = new Map();

async function formatInformation(pdfText, weights) {


    for (let [title, prompt] of PROMPTS.entries()) {
        let analysis = await analyzeTextWithOpenAI(pdfText, prompt);
        results.set(title, analysis);
    }

    



}


