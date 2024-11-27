import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    // First ensure TensorFlow.js is properly initialized
    await tf.ready();
    
    console.log('Attempting to load model...');
    
    // Load the model using the correct path for tfjs format
    const model = await tf.loadLayersModel('/model/model.json', {
      onProgress: (fraction) => {
        console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
      },
    });

    if (!model) {
      throw new Error('Model failed to load - model is null');
    }

    console.log('Model loaded successfully');

    // Warm up the model with a dummy prediction
    const dummyInput = tf.zeros([1, 256, 256, 2]);
    const dummyPrediction = model.predict(dummyInput);
    
    if (Array.isArray(dummyPrediction)) {
      dummyPrediction.forEach(t => t.dispose());
    } else {
      dummyPrediction.dispose();
    }
    dummyInput.dispose();

    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
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
    const rawPrediction = await model.predict(tensor);
    
    if (Array.isArray(rawPrediction)) {
      // Handle case where model returns multiple tensors
      prediction = rawPrediction[0];
      // Dispose other tensors if any
      rawPrediction.slice(1).forEach(t => t.dispose());
    } else {
      prediction = rawPrediction;
    }
    
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
