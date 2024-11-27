import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    // First ensure TensorFlow.js is properly initialized
    await tf.ready();
    
    // Load the model with explicit error handling
    const model = await tf.loadLayersModel('/model/water_hyacinth_modelV2.json', {
      onProgress: (fraction) => {
        console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
      },
    });

    if (!model) {
      throw new Error('Model failed to load - model is null');
    }

    // Warm up the model with a dummy prediction
    const dummyInput = tf.zeros([1, 256, 256, 2]);
    await model.predict(dummyInput).dispose();
    dummyInput.dispose();

    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to load the prediction model: ${error.message}`
        : 'Failed to load the prediction model'
    );
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  try {
    // Create a tensor from the image and handle cleanup
    const tensor = tf.tidy(() => {
      return tf.browser.fromPixels(imageData)
        .resizeBilinear([256, 256])
        .slice([0, 0, 0], [-1, -1, 2])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();
    });
    
    return tensor;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw new Error('Failed to preprocess image');
  }
}

export async function makePrediction(model: tf.LayersModel, imageData: HTMLImageElement) {
  let tensor: tf.Tensor | null = null;
  let prediction: tf.Tensor | null = null;

  try {
    tensor = await preprocessImage(imageData);
    prediction = await model.predict(tensor) as tf.Tensor;
    const predictionData = await prediction.data();
    return predictionData;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw new Error('Failed to make prediction');
  } finally {
    // Clean up tensors
    if (tensor) tensor.dispose();
    if (prediction) prediction.dispose();
  }
}