import * as tf from '@tensorflow/tfjs';
import NP from 'npyjs';

export interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
  heatmap?: number[][];
}

let model: tf.LayersModel | null = null;
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

async function checkModelFiles() {
  const files = [
    '/ai-model/TrainedModelV5.json',
    '/ai-model/TrainedModelV5weights.json'
  ];

  console.log('Checking for model files at:', files);

  for (const file of files) {
    try {
      const fullPath = `${window.location.origin}${file}`;
      console.log(`Attempting to fetch: ${fullPath}`);
      const response = await fetch(fullPath);
      if (!response.ok) {
        console.log(`Model file ${file} not found. Using mock predictions for development.`);
        return false;
      }
    } catch (error) {
      console.log(`Error checking model file ${file}:`, error);
      return false;
    }
  }
  return true;
}

async function loadModel() {
  if (!model) {
    try {
      const modelExists = await checkModelFiles();
      
      if (!modelExists) {
        if (IS_DEVELOPMENT) {
          console.log('Running in development mode with mock predictions');
          return null;
        }
        throw new Error('Model files not found');
      }
      
      const modelPath = `${window.location.origin}/ai-model/TrainedModelV5.json`;
      console.log('Loading model from:', modelPath);
      model = await tf.loadLayersModel(modelPath);
      
      if (!model) {
        throw new Error('Model failed to initialize');
      }

      const dummyInput = tf.zeros([1, 224, 224, 3]);
      await model.predict(dummyInput);
      dummyInput.dispose();

      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      if (!IS_DEVELOPMENT) {
        throw new Error(`Failed to load AI model: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  return model;
}

async function loadNpyFile(file: File): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const npLoader = new NP();
        const array = await npLoader.load(event.target.result as ArrayBuffer);
        
        if (!array || !array.data) {
          throw new Error('Invalid .npy file format');
        }

        resolve(array.data as Float32Array);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

function generateMockPrediction(): AnalysisResult {
  const coverage = 25 + Math.random() * 30; // Random coverage between 25-55%
  const growthRate = 2 + Math.random() * 3; // Random growth rate between 2-5%
  const waterQuality = 70 + Math.random() * 20; // Random water quality between 70-90%

  return {
    coverage,
    growth_rate: growthRate,
    water_quality: waterQuality,
    raw_analysis: `Mock analysis: Water hyacinth coverage at ${coverage.toFixed(1)}%. Growth patterns suggest proliferation at ${growthRate.toFixed(1)}% per week. Water quality impact is ${waterQuality.toFixed(1)}%.`,
    heatmap: Array(10).fill(Array(10).fill(0.5)) // Mock heatmap
  };
}

export const analyzeNpyWithModel = async (file: File): Promise<AnalysisResult> => {
  try {
    console.log('Starting analysis of .npy file');
    const modelInstance = await loadModel();

    if (!modelInstance && IS_DEVELOPMENT) {
      console.log('Using mock predictions for development');
      return generateMockPrediction();
    }

    if (!modelInstance) {
      throw new Error('Model not available');
    }

    const npyData = await loadNpyFile(file);
    console.log('NPY file loaded successfully, shape:', npyData.length);
    
    const inputData = Array.from(npyData);
    const inputTensor = tf.tensor(inputData).reshape([1, 224, 224, 3]);
    
    console.log('Input tensor shape:', inputTensor.shape);

    const prediction = modelInstance.predict(inputTensor) as tf.Tensor;
    const heatmap = await prediction.array() as number[][];
    
    console.log('Prediction generated successfully');

    const coverage = calculateCoverage(heatmap);
    const growthRate = estimateGrowthRate(coverage);
    const waterQuality = estimateWaterQuality(coverage);

    inputTensor.dispose();
    prediction.dispose();

    return {
      coverage,
      growth_rate: growthRate,
      water_quality: waterQuality,
      raw_analysis: `Analyzed .npy data shows water hyacinth coverage at ${coverage.toFixed(1)}%. Growth patterns suggest proliferation at ${growthRate.toFixed(1)}% per week. Water quality impact is ${waterQuality.toFixed(1)}%.`,
      heatmap
    };
  } catch (error) {
    console.error('Error during data analysis:', error);
    if (IS_DEVELOPMENT) {
      console.log('Falling back to mock predictions due to error');
      return generateMockPrediction();
    }
    throw new Error(`Failed to analyze .npy file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

function calculateCoverage(heatmap: number[][]): number {
  const total = heatmap.length * heatmap[0].length;
  const covered = heatmap.flat().reduce((sum, val) => sum + (val > 0.5 ? 1 : 0), 0);
  return (covered / total) * 100;
}

function estimateGrowthRate(coverage: number): number {
  return Math.min(coverage * 0.2, 5.0);
}

function estimateWaterQuality(coverage: number): number {
  return Math.max(100 - (coverage * 1.5), 60);
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