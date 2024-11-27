import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  try {
    await tf.ready();
    console.log('Loading model...');
    
    // First check if model.json exists by making a fetch request
    const modelJsonResponse = await fetch('/model/model.json');
    if (!modelJsonResponse.ok) {
      throw new Error(`model.json not found at /model/model.json`);
    }

    const modelJson = await modelJsonResponse.json();
    
    // Check if weights files exist
    const weightsManifest = modelJson.weightsManifest;
    if (!weightsManifest || weightsManifest.length === 0) {
      throw new Error('No weights manifest found in model.json');
    }

    // Log the expected weight files
    const weightFiles = weightsManifest.flatMap(group => group.paths);
    console.log('Required weight files:', weightFiles);

    // Configure the model with explicit input shape
    const model = await tf.loadLayersModel('/model/model.json', {
      strict: true,
      layers: {
        InputLayer: {
          className: 'InputLayer',
          config: {
            batchInputShape: [null, 224, 224, 3],
            dtype: 'float32',
            sparse: false,
            name: 'input_1'
          }
        }
      }
    });
    
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
    // Convert the image to a tensor
    let tensor = tf.browser.fromPixels(imageData)
      // Resize to match the model's expected size (224x224)
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