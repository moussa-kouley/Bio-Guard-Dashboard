import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

async function fileToGenerativePart(file: File) {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseMetric = (text: string, pattern: RegExp): number => {
  const match = text.match(pattern);
  return match ? parseFloat(match[1]) : 0;
};

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your environment variables.');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const prompt = `Analyze this image of water hyacinth. Provide detailed information in the following format:
    Coverage: X%
    Growth Rate: Y%
    Water Quality Impact: Z%
    
    Then provide a detailed analysis.
    
    Note: Express all metrics as percentages between 0 and 100.`;
  
  const imagePart = await fileToGenerativePart(file);
  
  let attempts = 0;
  const maxAttempts = 3;
  const initialDelay = 1000;
  
  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      return {
        coverage: parseMetric(text, /Coverage:\s*(\d+(?:\.\d+)?)%/),
        growth_rate: parseMetric(text, /Growth Rate:\s*(\d+(?:\.\d+)?)%/),
        water_quality: parseMetric(text, /Water Quality Impact:\s*(\d+(?:\.\d+)?)%/),
        raw_analysis: text
      };
    } catch (error) {
      attempts++;
      if (attempts === maxAttempts) {
        throw new Error(`Failed to analyze image after ${maxAttempts} attempts: ${error.message}`);
      }
      await delay(initialDelay * Math.pow(2, attempts));
    }
  }
  
  throw new Error('Failed to analyze image');
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  // This is a mock implementation - replace with actual database saving logic if needed
  console.log('Analysis saved:', prediction);
  return { data: prediction, error: null };
};