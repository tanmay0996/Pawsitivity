import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apikey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apikey);

const siteContext = `
You are a chatbot for a website that eases the process about pet adoption. 
The site provides details about pets available for adoption and helps the adoption process. 
You should focus on answering questions related to pet knowledge (dog breeds, cat breeds etc.) , pet adoption, care tips, and site navigation. 
Do not provide answers on topics outside this scope.
Do not use markdown, it is not supported by the code. Just write simple text, maybe write lines in between to make it look cooler and cleaner.
No using '*' to make things bold, no using '_' to italicise them either. No markdown.
`;

export async function getChatResponse(userMessage) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: 'Hello, I have 2 dogs in my house.' }] },
          { role: 'user', parts: [{ text: siteContext }] },
            { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] },
        ],
        generationConfig: { maxOutputTokens: 100 },
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
}
