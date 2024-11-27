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
      console.log('Loading model...');
      // Ensure the path matches where the converted model is saved
      model = await tf.loadLayersModel('/model/model.json');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load model - please ensure model files exist in public/model directory');
    }
  }
  return model;
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  let tensor: tf.Tensor4D | null = null;
  
  try {
    // Ensure model is loaded
    const loadedModel = await loadModelOnce();
    
    // Preprocess image
    tensor = await preprocessImage(imageElement);
    console.log('Image preprocessed successfully');
    
    // Make prediction
    const prediction = await makePrediction(loadedModel, tensor);
    console.log('Prediction made successfully:', prediction);
    
    // Calculate coverage based on prediction confidence
    const coverage = prediction * 100;
    
    return {
      coverage,
      confidence: prediction * 100,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw error;
  } finally {
    // Clean up tensor
    if (tensor) {
      tensor.dispose();
    }
  }
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor4D> {
  return tf.tidy(() => {
    console.log('Starting image preprocessing');
    // Convert the image to a tensor
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224]) // Resize to model input size
      .toFloat()
      .expandDims(0);
    
    // Normalize the tensor
    const normalizedTensor = tensor.div(255.0);
    console.log('Image preprocessing completed');
    return normalizedTensor as tf.Tensor4D;
  });
}

async function makePrediction(model: tf.LayersModel, tensor: tf.Tensor4D): Promise<number> {
  let prediction: tf.Tensor | null = null;
  
  try {
    console.log('Making prediction...');
    // Make prediction
    prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    console.log('Raw prediction data:', data);
    return data[0];
  } catch (error) {
    console.error('Error in makePrediction:', error);
    throw error;
  } finally {
    // Clean up prediction tensor
    if (prediction) {
      prediction.dispose();
    }
  }
}