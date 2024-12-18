import { GoogleGenerativeAI } from '@google/generative-ai';

// In Vite, we use import.meta.env instead of process.env
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export async function analyzeWaterHyacinthImage(imageUrl: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Fetch the image and convert it to base64
    const fetchResponse = await fetch(imageUrl);
    const imageBlob = await fetchResponse.blob();
    
    // Convert Blob to base64
    const base64data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imageBlob);
    });

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
          mimeType: "image/png",
          data: base64data as string
        }
      }
    ]);

    const geminiResponse = await result.response;
    return geminiResponse.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return "Unable to analyze image at this time. Please try again later.";
  }
}