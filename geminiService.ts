
import { GoogleGenAI } from "@google/genai";

// Fix: Moved initialization inside the function to ensure process.env.API_KEY is current at time of request.
export async function generateFacilityDescription(name: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional, inviting one-paragraph description for a health facility named "${name}". Focus on quality, community, and results. Max 150 words.`,
      config: {
        temperature: 0.7,
      }
    });
    // Fix: Access the text property directly (it's a getter, not a method).
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini description generation failed:", error);
    return "Error generating description. Please enter manually.";
  }
}
