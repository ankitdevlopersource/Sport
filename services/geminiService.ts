import { GoogleGenAI, Type } from "@google/genai";
import { TrainingPlan } from '../types';

// Ensure the API key is handled by the environment.
// Do not add any UI or logic to ask the user for it.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this example, we'll log an error.
  console.error("Gemini API key not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAIFeedback = async (sport: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert AI sports coach for a platform called Spark Khoj.
      An athlete has submitted a video for analysis in the sport of ${sport}.
      Their performance metrics are:
      - Sprinting technique: 80/100
      - Acceleration: 88/100
      
      Provide concise, actionable feedback in 2-3 short bullet points to help them improve.
      Start with a positive reinforcement statement.
      Focus on specific drills they can perform. For acceleration, suggest plyometric drills.
      Keep the tone encouraging and professional.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const text = response.text;
    if (!text) {
        return "Could not generate feedback at this time. Please try again later.";
    }
    
    return text;
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "An error occurred while generating feedback. Check your API key and network connection.";
  }
};

// FIX: Add getAITrainingPlan function to generate a training plan using Gemini.
export const getAITrainingPlan = async (sport: string): Promise<TrainingPlan> => {
  try {
    const prompt = `
      You are an expert AI sports coach for a platform called Spark Khoj.
      Generate a personalized training plan for an athlete in the sport of ${sport}.
      The plan should include a brief summary and 2-3 specific drills with names and short descriptions.
      Keep the tone encouraging and professional.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: {
                type: Type.STRING,
                description: "A short summary of the training plan, 1-2 sentences."
            },
            drills: {
                type: Type.ARRAY,
                description: "A list of 2 to 3 drills.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: "The name of the drill."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A short description of the drill."
                        }
                    },
                    required: ["name", "description"]
                }
            }
        },
        required: ["summary", "drills"]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const text = response.text;
    if (!text) {
        throw new Error("Could not generate training plan at this time.");
    }
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error fetching AI training plan:", error);
    throw new Error("An error occurred while generating the training plan. Check your API key and network connection.");
  }
};
