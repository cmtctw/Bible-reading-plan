import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight } from '../types';

export const fetchBookInsight = async (bookName: string): Promise<AIInsight | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a short, inspiring summary (max 40 words) and one representative key verse for the Bible book: ${bookName}. 
      IMPORTANT: The output MUST be in Traditional Chinese (繁體中文). The key verse should be the full text of the verse in Chinese Union Version (CUV) if possible.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A brief, 1-2 sentence summary of the book's theme in Traditional Chinese.",
            },
            keyVerse: {
              type: Type.STRING,
              description: "A famous or representative verse from the book in Traditional Chinese.",
            },
          },
          required: ["summary", "keyVerse"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AIInsight;
  } catch (error) {
    console.error("Error fetching insight:", error);
    return null;
  }
};