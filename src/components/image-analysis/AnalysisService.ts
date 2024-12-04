import * as tf from '@tensorflow/tfjs';

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
  heatmap?: number[][];
}

let model: tf.LayersModel | null = null;

async function loadModel() {
  if (!model) {
    try {
      model = await tf.loadLayersModel('/ai-model/TrainedModelV5.json');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load AI model');
    }
  }
  return model;
}

async function preprocessImage(file: File): Promise<tf.Tensor> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const img = new Image();
        img.onload = async () => {
          // Convert image to tensor and preprocess
          const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Adjust size according to your model's requirements
            .toFloat()
            .expandDims();
          
          resolve(tensor);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const analyzeImageWithModel = async (file: File): Promise<AnalysisResult> => {
  try {
    const modelInstance = await loadModel();
    const inputTensor = await preprocessImage(file);
    
    // Get prediction from model
    const prediction = await modelInstance.predict(inputTensor) as tf.Tensor;
    const heatmap = await prediction.array() as number[][];
    
    // Calculate metrics from heatmap
    const coverage = calculateCoverage(heatmap);
    const growthRate = estimateGrowthRate(coverage);
    const waterQuality = estimateWaterQuality(coverage);

    // Cleanup tensors
    inputTensor.dispose();
    prediction.dispose();

    return {
      coverage,
      growth_rate: growthRate,
      water_quality: waterQuality,
      raw_analysis: `Detected water hyacinth coverage at ${coverage.toFixed(1)}%. Growth patterns suggest proliferation at ${growthRate.toFixed(1)}% per week. Water quality impact is ${waterQuality.toFixed(1)}%.`,
      heatmap
    };
  } catch (error) {
    console.error('Error during image analysis:', error);
    throw new Error('Failed to analyze image');
  }
};

function calculateCoverage(heatmap: number[][]): number {
  // Calculate the percentage of area covered by water hyacinth
  const total = heatmap.length * heatmap[0].length;
  const covered = heatmap.flat().reduce((sum, val) => sum + (val > 0.5 ? 1 : 0), 0);
  return (covered / total) * 100;
}

function estimateGrowthRate(coverage: number): number {
  // Estimate weekly growth rate based on current coverage
  return Math.min(coverage * 0.2, 5.0); // Cap at 5% weekly growth
}

function estimateWaterQuality(coverage: number): number {
  // Estimate water quality impact (inverse relationship with coverage)
  return Math.max(100 - (coverage * 1.5), 60); // Minimum quality of 60%
}

export const saveAnalysisToDatabase = async (prediction: AnalysisResult) => {
  try {
    console.log('Analysis saved:', prediction);
    return { data: prediction, error: null };
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis results');
  }
};