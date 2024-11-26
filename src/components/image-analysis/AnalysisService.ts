import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;
  const base64Data = base64EncodedData.split(',')[1];
  
  return {
    inlineData: { data: base64Data, mimeType: file.type },
  };
}

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Analyze this image of water hyacinth. Provide detailed information about: 1) The approximate coverage percentage of water hyacinth in the image 2) Estimated growth rate based on density and plant health 3) Potential impact on water quality. Format your response as: Coverage: X%, Growth Rate: Y%, Water Quality Impact: Z%. Then provide a detailed analysis.";
    
    const imagePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response text to extract metrics
    const coverageMatch = text.match(/Coverage:\s*(\d+(?:\.\d+)?)%/);
    const growthMatch = text.match(/Growth Rate:\s*(\d+(?:\.\d+)?)%/);
    const qualityMatch = text.match(/Water Quality Impact:\s*(\d+(?:\.\d+)?)%/);
    
    return {
      coverage: parseFloat(coverageMatch?.[1] || "0"),
      growth_rate: parseFloat(growthMatch?.[1] || "0"),
      water_quality: parseFloat(qualityMatch?.[1] || "0"),
      raw_analysis: text
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  // In a real application, you would save this to your database
  // For now, we'll just return the prediction
  return { data: prediction, error: null };
};