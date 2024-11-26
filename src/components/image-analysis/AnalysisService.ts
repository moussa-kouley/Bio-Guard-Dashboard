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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  try {
    // Use gemini-pro-vision instead of gemini-1.5-flash for better stability
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = "Analyze this image of water hyacinth. Provide detailed information about: 1) The approximate coverage percentage of water hyacinth in the image 2) Estimated growth rate based on density and plant health 3) Potential impact on water quality. Format your response as: Coverage: X%, Growth Rate: Y%, Water Quality Impact: Z%. Then provide a detailed analysis.";
    
    const imagePart = await fileToGenerativePart(file);
    
    // Add retry logic with exponential backoff
    let attempts = 0;
    const maxAttempts = 5; // Increased max attempts
    const initialDelay = 1000; // 1 second initial delay
    
    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        const coverageMatch = text.match(/Coverage:\s*(\d+(?:\.\d+)?)%/);
        const growthMatch = text.match(/Growth Rate:\s*(\d+(?:\.\d+)?)%/);
        const qualityMatch = text.match(/Water Quality Impact:\s*(\d+(?:\.\d+)?)%/);
        
        return {
          coverage: parseFloat(coverageMatch?.[1] || "0"),
          growth_rate: parseFloat(growthMatch?.[1] || "0"),
          water_quality: parseFloat(qualityMatch?.[1] || "0"),
          raw_analysis: text
        };
      } catch (error: any) {
        attempts++;
        
        // If we've reached max attempts, throw the error
        if (attempts === maxAttempts) {
          throw error;
        }
        
        // Calculate delay with exponential backoff and jitter
        const backoffDelay = Math.min(initialDelay * Math.pow(2, attempts), 10000);
        const jitter = Math.random() * 1000;
        await delay(backoffDelay + jitter);
        
        continue;
      }
    }
    
    throw new Error('Max retry attempts reached');
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  return { data: prediction, error: null };
};