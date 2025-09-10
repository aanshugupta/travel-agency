
import { GoogleGenAI, Type } from "@google/genai";
import type { AITripPlan } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll proceed, and the UI will show an error if API_KEY is missing.
  console.error("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateTripPlan = async (destination: string, duration: number, interests: string): Promise<AITripPlan> => {
  if (!API_KEY) {
    throw new Error("API Key for Gemini is not configured.");
  }

  const prompt = `Create a ${duration}-day travel itinerary for a trip to ${destination}. The traveler is interested in ${interests}. Provide a title and a few activities for each day.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            duration: { type: Type.INTEGER },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      },
    });

    const jsonText = response.text;
    const plan = JSON.parse(jsonText) as AITripPlan;
    return plan;
  } catch (error) {
    console.error("Error generating trip plan with Gemini:", error);
    throw new Error("Failed to generate trip plan. Please check your prompt and API key.");
  }
};
