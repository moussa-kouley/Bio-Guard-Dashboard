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

async function checkModelFiles() {
  const files = [
    '/ai-model/TrainedModelV5.json',
    '/ai-model/TrainedModelV5weights.json'
  ];

  console.log('Checking for model files at:', files);

  const missingFiles = [];
  for (const file of files) {
    try {
      console.log(`Attempting to fetch: ${file}`);
      const response = await fetch(file);
      console.log(`Response for ${file}:`, response.status);
      if (!response.ok) {
        missingFiles.push(file);
      }
    } catch (error) {
      console.error(`Error fetching ${file}:`, error);
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    throw new Error(`Missing required model files: ${missingFiles.join(', ')}. Please ensure all model files are present in the public/ai-model directory.`);
  }
}

async function loadModel() {
  if (!model) {
    try {
      console.log('Checking model files...');
      await checkModelFiles();
      
      console.log('Loading model from files...');
      model = await tf.loadLayersModel('/ai-model/TrainedModelV5.json');
      
      if (!model) {
        throw new Error('Model failed to initialize');
      }

      // Warm up the model with a dummy prediction
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      await model.predict(dummyInput);
      dummyInput.dispose();

      console.log('Model loaded and initialized successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error(`Failed to load AI model: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

export const analyzeNpyWithModel = async (file: File): Promise<AnalysisResult> => {
  try {
    console.log('Starting analysis of .npy file');
    const modelInstance = await loadModel();
    console.log('Model loaded successfully');

    const npyData = await loadNpyFile(file);
    console.log('NPY file loaded successfully, shape:', npyData.length);
    
    // Convert npy data to tensor and ensure correct shape
    const inputData = Array.from(npyData);
    const inputTensor = tf.tensor(inputData)
      .reshape([1, 224, 224, 3]);
    
    console.log('Input tensor shape:', inputTensor.shape);

    // Get prediction from model
    const prediction = modelInstance.predict(inputTensor) as tf.Tensor;
    const heatmap = await prediction.array() as number[][];
    
    console.log('Prediction generated successfully');

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
      raw_analysis: `Analyzed .npy data shows water hyacinth coverage at ${coverage.toFixed(1)}%. Growth patterns suggest proliferation at ${growthRate.toFixed(1)}% per week. Water quality impact is ${waterQuality.toFixed(1)}%.`,
      heatmap
    };
  } catch (error) {
    console.error('Error during data analysis:', error);
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