import * as tf from '@tensorflow/tfjs';

export interface ImageAnalysisResult {
  coverage: number;
  confidence: number;
  timestamp: string;
  location?: { lat: number; lng: number };
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  try {
    const tensor = await preprocessImage(imageElement);
    const prediction = await makePrediction(tensor);
    tensor.dispose();
    
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
  }
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor4D> {
  return tf.tidy(() => {
    // Convert the image to a tensor
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224]) // Resize to model input size
      .toFloat()
      .expandDims(0);
    
    // Normalize the tensor
    return tensor.div(255.0) as tf.Tensor4D;
  });
}

async function makePrediction(tensor: tf.Tensor4D): Promise<number> {
  try {
    // Load the model
    const model = await tf.loadLayersModel('/model/model.json');
    
    // Make prediction
    const prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    
    // Cleanup
    prediction.dispose();
    model.dispose();
    
    return data[0];
  } catch (error) {
    console.error('Error in makePrediction:', error);
    throw error;
  }
}