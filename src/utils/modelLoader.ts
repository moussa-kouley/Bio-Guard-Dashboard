import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    await tf.ready();
    console.log('Loading model...');
    
    const modelJsonResponse = await fetch('/model/model.json');
    if (!modelJsonResponse.ok) {
      throw new Error(`model.json not found at /model/model.json`);
    }

    const modelJson = await modelJsonResponse.json();
    
    const weightsManifest = modelJson.weightsManifest;
    if (!weightsManifest || weightsManifest.length === 0) {
      throw new Error('No weights manifest found in model.json');
    }

    const weightFiles = weightsManifest.flatMap(group => group.paths);
    console.log('Required weight files:', weightFiles);

    const model = await tf.loadLayersModel('/model/model.json');
    
    if (!model) {
      throw new Error('Model failed to load - model is null');
    }
    
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to load model: ${error.message}`
        : 'Failed to load model: Unknown error'
    );
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(tf.scalar(255));
    
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
    return Array.from(data)[0];
  } catch (error) {
    console.error('Error making prediction:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to process image: ${error.message}`
        : 'Failed to process image: Unknown error'
    );
  } finally {
    if (tensor) {
      tensor.dispose();
    }
  }
}