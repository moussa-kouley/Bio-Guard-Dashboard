import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

async function fileToGenerativePart(file: File) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    throw new Error('File size too large. Please upload an image smaller than 5MB.');
  }

  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type },
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseMetric = (text: string, pattern: RegExp): number => {
  const match = text.match(pattern);
  return match ? Math.min(Math.max(parseFloat(match[1]), 0), 100) : 0;
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
  
  try {
    const imagePart = await fileToGenerativePart(file);
    
    let attempts = 0;
    const maxAttempts = 3;
    const initialDelay = 1000;
    
    while (attempts < maxAttempts) {
      try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        if (!text) {
          throw new Error('Empty response from Gemini API');
        }
        
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
    
    throw new Error('Failed to analyze image after maximum attempts');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Image analysis failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during image analysis');
  }
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  try {
    // This is a mock implementation - replace with actual database saving logic if needed
    console.log('Analysis saved:', prediction);
    return { data: prediction, error: null };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis results');
  }
};