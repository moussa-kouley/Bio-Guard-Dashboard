import * as tf from '@tensorflow/tfjs';

export interface ImageAnalysisResult {
  coverage: number;
  confidence: number;
  timestamp: string;
  location?: { lat: number; lng: number };
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  const tensor = await preprocessImage(imageElement);
  const prediction = await makePrediction(tensor);
  
  // Calculate coverage based on prediction confidence
  const coverage = prediction[0] * 100;
  
  return {
    coverage,
    confidence: prediction[0] * 100,
    timestamp: new Date().toISOString(),
  };
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor4D> {
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims(0);
    
    return tensor as tf.Tensor4D;
  });
}

async function makePrediction(tensor: tf.Tensor4D): Promise<Float32Array> {
  try {
    const model = await tf.loadLayersModel('/model/model.json');
    const prediction = await model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    prediction.dispose();
    tensor.dispose();
    return data;
  } catch (error) {
    console.error('Prediction error:', error);
    throw new Error('Failed to make prediction');
  }
}