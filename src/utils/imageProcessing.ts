import * as tf from '@tensorflow/tfjs';

export interface ImageAnalysisResult {
  coverage: number;
  confidence: number;
  timestamp: string;
  location?: { lat: number; lng: number };
}

let model: tf.LayersModel | null = null;

async function loadModelOnce() {
  if (!model) {
    try {
      const modelPath = window.location.origin + '/model/model.json';
      console.log('Attempting to load model from:', modelPath);
      
      await tf.ready();
      console.log('TensorFlow.js initialized successfully');
      
      // Load model with explicit input shape configuration
      const modelConfig = {
        batchInputShape: [null, 10, 224, 224, 3]
      };
      
      model = await tf.loadLayersModel(modelPath, {
        strict: true,
        extraModelConfig: modelConfig
      });
      
      console.log('Model loaded successfully');
      
      // Warm up the model
      const dummyInput = tf.zeros([1, 10, 224, 224, 3]);
      const warmupResult = model.predict(dummyInput);
      tf.dispose(warmupResult);
      tf.dispose(dummyInput);
      console.log('Model warmup completed');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }
  return model;
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor> {
  return tf.tidy(() => {
    // Convert the image to a tensor and preprocess
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims(0);
    
    // Create a sequence of 10 frames by repeating the image
    const repeatedTensor = tf.tile(tensor, [1, 10, 1, 1, 1]);
    console.log('Preprocessed tensor shape:', repeatedTensor.shape);
    return repeatedTensor;
  });
}

async function makePrediction(model: tf.LayersModel, tensor: tf.Tensor): Promise<number> {
  try {
    const prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    tf.dispose(prediction);
    return data[0];
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  let tensor: tf.Tensor | null = null;
  
  try {
    const loadedModel = await loadModelOnce();
    tensor = await preprocessImage(imageElement);
    const prediction = await makePrediction(loadedModel, tensor);
    
    return {
      coverage: prediction * 100,
      confidence: prediction * 100,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  } finally {
    if (tensor) {
      tensor.dispose();
    }
  }
}