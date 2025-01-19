import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.API_KEY);
import { GoogleGenerativeAI } from "@google/generative-ai";



export async function textGenTextOnlyPrompt(prompt) {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

}



