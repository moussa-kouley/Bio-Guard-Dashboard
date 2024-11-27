import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    await tf.ready();
    console.log('Loading model...');
    
    // Load model from the correct path
    const model = await tf.loadLayersModel('/model/model.json');
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw error;
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  return tf.tidy(() => {
    // Convert the image to a tensor
    let tensor = tf.browser.fromPixels(imageData)
      // Resize to match the model's expected size (224x224 is common)
      .resizeBilinear([224, 224])
      // Normalize pixel values to [0,1]
      .toFloat()
      .div(tf.scalar(255));
    
    // Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
  });
}

export async function makePrediction(model: tf.LayersModel, imageData: HTMLImageElement) {
  let tensor = null;
  try {
    tensor = await preprocessImage(imageData);
    const prediction = await model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    prediction.dispose();
    return data;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  } finally {
    if (tensor) {
      tensor.dispose();
    }
  }
}