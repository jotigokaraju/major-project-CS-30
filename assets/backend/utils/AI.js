import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export async function query(prompt) {

  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
  return response.text();

}

export async function summary(data) {

  const HF_TOKEN = process.env.HF;
  let inp = {inputs: data};

  const response = await fetch(
    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(inp),
    }
  );

  let text = await response.json()
  text = text[0].summary_text;
  console.log(text);
  return text;

}

export async function understandPDF(person) {
 
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const fileManager = new GoogleAIFileManager(process.env.API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });


  const uploadResponse = await fileManager.uploadFile(
    `../temp/output_0.pdf`,
    {
      mimeType: "application/pdf",
      displayName: "Gemini 1.5 PDF",
    }
  );

  console.log(
    `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
  );

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: `Output everything related to ${person} from the file` }
  ]);

  console.log(result.response.text());
  return result.response.text();
}

