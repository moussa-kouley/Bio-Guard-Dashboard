import { GoogleGenerativeAI } from '@google/generative-ai';

// Validate and retrieve Gemini API key
function getGeminiApiKey(): string {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.');
    throw new Error('Missing Gemini API Key');
  }

  return apiKey;
}

export async function analyzeWaterHyacinthImage(base64Image: string, mimeType: string): Promise<string> {
  try {
    // Validate API key first
    const apiKey = getGeminiApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `Analyze this water hyacinth distribution map image. Focus on:
1. Coverage patterns and density
2. Potential environmental impact
3. Growth predictions
4. Scientific recommendations for management
Please provide a detailed but concise analysis.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      }
    ]);

    const geminiResponse = await result.response;
    const analysisText = geminiResponse.text();

    if (!analysisText) {
      throw new Error('Gemini returned an empty analysis');
    }

    return analysisText;
  } catch (error) {
    console.error('Detailed Gemini Analysis Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return "API configuration error. Please check your Gemini API key.";
      }
      if (error.message.includes('fetch')) {
        return "Unable to download image. Please check the image URL.";
      }
    }
    
    return "Unable to analyze image at this time. Please try again later.";
  }
}
