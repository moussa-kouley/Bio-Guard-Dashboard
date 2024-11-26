export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

// Mock analysis function that returns sample data
export const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock analysis data
  return {
    coverage: Math.floor(Math.random() * 60) + 20, // Random between 20-80%
    growth_rate: Math.floor(Math.random() * 40) + 10, // Random between 10-50%
    water_quality: Math.floor(Math.random() * 30) + 60, // Random between 60-90%
    raw_analysis: "Mock analysis: Water hyacinth coverage detected in the image. The growth pattern suggests moderate expansion. Water quality indicators show typical signs of impact from invasive species presence."
  };
};

// Mock database save function
export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { data: prediction, error: null };
};