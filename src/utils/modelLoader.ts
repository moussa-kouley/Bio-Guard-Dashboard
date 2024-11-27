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
    
    // Ensure input layer has correct shape configuration
    if (modelJson.modelTopology?.model_config?.config?.layers) {
      const inputLayer = modelJson.modelTopology.model_config.config.layers.find(
        (layer: any) => layer.class_name === "InputLayer"
      );
      
      if (inputLayer) {
        inputLayer.config = {
          ...inputLayer.config,
          batch_input_shape: [null, 10, 224, 224, 3],
          dtype: "float32",
          sparse: false,
          name: "input_layer_1"
        };
      }
    }

    const model = await tf.loadLayersModel(
      tf.io.fromMemory(modelJson)
    );
    
    // Verify input shape
    const inputShape = model.inputs[0].shape;
    console.log('Model loaded successfully with input shape:', inputShape);
    
    return model;
  } catch (error) {
    console.error('Detailed error loading model:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to load model: ${error.message}`
        : 'Failed to load model: Unknown error'
    );
  }
}

export async function preprocessImage(imageData: HTMLImageElement) {
  return tf.tidy(() => {
    // Convert image to tensor and preprocess
    let tensor = tf.browser.fromPixels(imageData)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(tf.scalar(255));
    
    // Add batch and time dimensions [1, 10, 224, 224, 3]
    tensor = tensor.expandDims(0).expandDims(0);
    tensor = tf.tile(tensor, [1, 10, 1, 1, 1]);
    
    console.log('Preprocessed tensor shape:', tensor.shape);
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