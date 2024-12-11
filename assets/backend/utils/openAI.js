//2024-12-10

const {OpenAI} = require('openai');  


let openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  
});

//Function to analyze text using OpenAI GPT
async function analyzeTextWithOpenAI(text) {

  try {

    //Send the extracted text to OpenAI for analysis
    //I'll note that a large majority of this is online code that I pulled from Stack Overflow, Tutorials, even some Reddit
    let response = await openai.completions.create({
      model: 'text-davinci-003',  
      prompt: `Extract key features, reviews, and pricing from the following text:\n\n${text}`,
      max_tokens: 1000,
      temperature: 0.5,
    });

    return response.choices[0].text;
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to analyze the text with OpenAI');
  }
}

module.exports = {analyzeTextWithOpenAI};
