import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');

export async function analyzeWaterHyacinthImage(imageUrl: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Fetch the image and convert it to base64
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    
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

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing image:', error);
    return "Unable to analyze image at this time. Please try again later.";
  }
}