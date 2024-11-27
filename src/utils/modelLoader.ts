import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    // Load the model
    const model = await tf.loadLayersModel('/model/water_hyacinth_modelV2.json');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the prediction model');
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  // Convert the image to a tensor
  const tensor = tf.browser.fromPixels(imageData)
    // Resize to 256x256
    .resizeBilinear([256, 256])
    // Convert to grayscale (2 channels)
    .slice([0, 0, 0], [-1, -1, 2])
    // Normalize pixel values
    .toFloat()
    .div(tf.scalar(255))
    .expandDims();
    
  return tensor;
}

export async function makePrediction(model: tf.LayersModel, imageData: HTMLImageElement) {
  const processedImage = await preprocessImage(imageData);
  const prediction = await model.predict(processedImage) as tf.Tensor;
  const predictionData = await prediction.data();
  
  // Clean up tensors
  processedImage.dispose();
  prediction.dispose();
  
  return predictionData;
}