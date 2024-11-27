import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    await tf.ready();
    console.log('Loading model...');
    
    const model = await tf.loadLayersModel('/model/model.json');
    if (!model) {
      throw new Error('Model failed to load');
    }

    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to load model: ${error.message}`
        : 'Failed to load model'
    );
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  return tf.tidy(() => {
    // Convert the image to a tensor
    const tensor = tf.browser.fromPixels(imageData)
      // Resize to the model's expected size
      .resizeBilinear([256, 256])
      // Normalize pixel values
      .toFloat()
      .div(tf.scalar(255))
      // Add batch dimension
      .expandDims(0);
    
    return tensor;
  });
}

export async function makePrediction(model: tf.LayersModel, imageData: HTMLImageElement) {
  let imageTensor = null;
  try {
    imageTensor = await preprocessImage(imageData);
    const prediction = await model.predict(imageTensor) as tf.Tensor;
    const predictionData = await prediction.data();
    prediction.dispose();
    return predictionData;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw new Error('Failed to process image');
  } finally {
    if (imageTensor) {
      imageTensor.dispose();
    }
  }
}