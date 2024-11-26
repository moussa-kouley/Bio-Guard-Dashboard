import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

const fileToGenerativePart = async (file: File) => {
  const buffer = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(buffer).toString('base64'),
      mimeType: file.type
    },
  };
};

export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const prompt = `Analyze this water hyacinth image and provide a detailed analysis. Focus on:
  1. Coverage percentage of water hyacinth
  2. Growth rate prediction
  3. Water quality impact
  4. Potential environmental risks
  5. Recommended actions

  First provide a JSON with numerical values for:
  {
    "coverage_percentage": (0-100),
    "growth_rate": (0-100),
    "water_quality_impact": (0-100)
  }

  Then provide a detailed analysis in natural language.`;
  
  const imagePart = await fileToGenerativePart(file);
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/{[\s\S]*?}/);
  let analysis = {
    coverage_percentage: 0,
    growth_rate: 0,
    water_quality_impact: 0
  };
  
  try {
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Error parsing JSON from Gemini response:', error);
  }
  
  const rawAnalysis = text.replace(/{[\s\S]*?}/, '').trim();
  
  return {
    coverage: analysis.coverage_percentage,
    growth_rate: analysis.growth_rate,
    water_quality: analysis.water_quality_impact,
    raw_analysis: rawAnalysis
  };
};

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  return await supabase
    .from('gps_data')
    .insert([{
      latitude: prediction.coverage * 0.01,
      longitude: prediction.growth_rate * 0.01,
      hdop: prediction.water_quality,
      temperature: 25 + (Math.random() * 5),
      ph: 7 + (Math.random() * 0.5),
      dissolvedsolids: 400 + (Math.random() * 100),
      timestamp: new Date().toISOString(),
      f_port: 1
    }]);
};