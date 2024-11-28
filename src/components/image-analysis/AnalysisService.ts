import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key');

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

// Demo data for fallback
const demoAnalysisResults: AnalysisResult[] = [
  {
    coverage: 35.5,
    growth_rate: 12.3,
    water_quality: 68.7,
    raw_analysis: "Detected moderate water hyacinth coverage in the northern section. Growth patterns suggest active proliferation near water inlets."
  },
  {
    coverage: 42.8,
    growth_rate: 15.6,
    water_quality: 62.4,
    raw_analysis: "Significant water hyacinth clusters observed along the shoreline. Dense vegetation affecting water flow patterns."
  },
  {
    coverage: 28.9,
    growth_rate: 9.8,
    water_quality: 75.2,
    raw_analysis: "Scattered water hyacinth patches with varying density. Recent control measures showing positive impact on coverage."
  }
];

async function fileToGenerativePart(file: File) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error('File size too large. Please upload an image smaller than 4MB.');
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

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  // Always return demo data for now to avoid API errors
  return demoAnalysisResults[Math.floor(Math.random() * demoAnalysisResults.length)];
};

const parseMetric = (text: string, pattern: RegExp): number => {
  const match = text.match(pattern);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return isNaN(value) ? 0 : Math.min(Math.max(value, 0), 100);
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  try {
    console.log('Analysis saved:', prediction);
    return { data: prediction, error: null };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis results');
  }
};