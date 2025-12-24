
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBlogOutline = async (topic: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a professional creative writer. Generate a detailed blog post outline for the topic: "${topic}". Include a catchy title, introduction points, three main sections, and a conclusion.`,
  });
  return response.text;
};

export const summarizeContent = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the following text in exactly two sentences for a quick-read blog preview: ${text}`,
  });
  return response.text;
};

export const generateMoodEmoji = async (moment: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the mood of this short diary entry and return only one single emoji that represents it best: "${moment}"`,
  });
  return response.text?.trim() || '✨';
};

export const generateCoverImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A clean, minimalist, high-quality cinematic cover photo for a blog post about: ${prompt}. Artistic and aesthetic style.` }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed", error);
  }
  return null;
};
