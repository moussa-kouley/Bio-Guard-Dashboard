import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    const model = await tf.loadLayersModel('/model/water_hyacinth_modelV2.json');
    if (!model) {
      throw new Error('Model failed to load');
    }
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the prediction model');
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  try {
    const tensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([256, 256])
      .slice([0, 0, 0], [-1, -1, 2])
      .toFloat()
      .div(tf.scalar(255))
      .expandDims();
      
    return tensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to preprocess image');
  }
}

export async function makePrediction(model: tf.LayersModel, imageData: HTMLImageElement) {
  try {
    const processedImage = await preprocessImage(imageData);
    const prediction = await model.predict(processedImage) as tf.Tensor;
    const predictionData = await prediction.data();
    
    // Clean up tensors
    processedImage.dispose();
    prediction.dispose();
    
    return predictionData;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw new Error('Failed to make prediction');
  }
}