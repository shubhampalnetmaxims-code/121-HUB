
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFacilityDescription(name: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional, inviting one-paragraph description for a health facility named "${name}". Focus on quality, community, and results. Max 150 words.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini description generation failed:", error);
    return "Error generating description. Please enter manually.";
  }
}
