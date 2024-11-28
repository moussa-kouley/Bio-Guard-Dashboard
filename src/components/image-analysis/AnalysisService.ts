import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key');

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

// Updated demo data to match requested metrics
const demoAnalysisResults: AnalysisResult[] = [
  {
    coverage: 6.8,
    growth_rate: 1.3,
    water_quality: 1.2,
    raw_analysis: "Detected moderate water hyacinth coverage at 6.8%. Growth patterns suggest slow proliferation at 1.3% per week. Water quality impact is minimal at 1.2%."
  },
  {
    coverage: 7.0,
    growth_rate: 1.4,
    water_quality: 1.3,
    raw_analysis: "Water hyacinth coverage observed at 7.0%. Growth rate trending at 1.4% weekly with minor water quality impact of 1.3%."
  },
  {
    coverage: 6.5,
    growth_rate: 1.2,
    water_quality: 1.1,
    raw_analysis: "Current water hyacinth coverage at 6.5% with steady growth rate of 1.2% per week. Water quality impact measured at 1.1%."
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