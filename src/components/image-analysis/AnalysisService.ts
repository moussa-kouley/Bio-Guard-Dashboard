import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please set VITE_GEMINI_API_KEY in your environment variables.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

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

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size too large. Please upload an image smaller than 5MB.');
  }

  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result || typeof reader.result !== 'string') {
        reject(new Error('Failed to read image file'));
        return;
      }
      const base64Data = reader.result.split(',')[1];
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
  if (!match) {
    console.warn(`Failed to parse metric with pattern ${pattern}`);
    return 0;
  }
  const value = parseFloat(match[1]);
  if (isNaN(value)) {
    console.warn(`Invalid numeric value parsed: ${match[1]}`);
    return 0;
  }
  return Math.min(Math.max(value, 0), 100);
};

async function retryWithExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 5,
  initialDelay: number = 2000
): Promise<T> {
  let attempt = 1;
  let lastError: Error | null = null;

  while (attempt <= maxAttempts) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on client errors except rate limits
      if (error?.status && error.status !== 429 && error.status < 500) {
        throw error;
      }

      if (attempt === maxAttempts) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const backoffDelay = initialDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000;
      const totalDelay = backoffDelay + jitter;

      console.log(`Attempt ${attempt} failed, retrying in ${Math.round(totalDelay/1000)}s...`);
      await delay(totalDelay);
      attempt++;
    }
  }

  throw new Error(`Operation failed after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
}

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = `Analyze this image of water hyacinth. Provide detailed information in the following format:
      Coverage: X%
      Growth Rate: Y%
      Water Quality Impact: Z%
      
      Then provide a detailed analysis.
      
      Note: Express all metrics as percentages between 0 and 100.`;

    const result = await retryWithExponentialBackoff(async () => {
      const response = await model.generateContent([prompt, imagePart]);
      const text = response.response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      const coverage = parseMetric(text, /Coverage:\s*(\d+(?:\.\d+)?)%/);
      const growthRate = parseMetric(text, /Growth Rate:\s*(\d+(?:\.\d+)?)%/);
      const waterQuality = parseMetric(text, /Water Quality Impact:\s*(\d+(?:\.\d+)?)%/);

      if (coverage === 0 && growthRate === 0 && waterQuality === 0) {
        throw new Error('Failed to extract metrics from the analysis');
      }

      return {
        coverage,
        growth_rate: growthRate,
        water_quality: waterQuality,
        raw_analysis: text
      };
    });

    return result;
  } catch (error) {
    console.error('Analysis error:', error);
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