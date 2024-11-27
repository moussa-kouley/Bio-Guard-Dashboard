import * as tf from '@tensorflow/tfjs';

export interface ImageAnalysisResult {
  coverage: number;
  confidence: number;
  timestamp: string;
  location?: { lat: number; lng: number };
}

let model: tf.LayersModel | null = null;

async function loadModelOnce() {
  if (!model) {
    try {
      const modelPath = window.location.origin + '/model/model.json';
      console.log('Attempting to load model from:', modelPath);
      
      await tf.ready();
      console.log('TensorFlow.js initialized successfully');
      
      const modelResponse = await fetch(modelPath);
      const modelJson = await modelResponse.json();
      
      // Modify input layer configuration
      if (modelJson.modelTopology?.model_config?.config?.layers) {
        const inputLayer = modelJson.modelTopology.model_config.config.layers.find(
          (layer: any) => layer.class_name === "InputLayer"
        );
        if (inputLayer) {
          inputLayer.config.batch_input_shape = [null, 10, 224, 224, 3];
        }
      }
      
      model = await tf.loadLayersModel(
        tf.io.fromMemory(modelJson),
        { strict: true }
      );
      
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error(`Failed to load model: ${error.message}`);
    }
  }
  return model;
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor> {
  return tf.tidy(() => {
    let tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224])
      .toFloat()
      .div(255.0);
    
    tensor = tensor.expandDims(0).expandDims(0);
    tensor = tf.tile(tensor, [1, 10, 1, 1, 1]);
    
    console.log('Preprocessed tensor shape:', tensor.shape);
    return tensor;
  });
}

async function makePrediction(model: tf.LayersModel, tensor: tf.Tensor): Promise<number> {
  try {
    const prediction = model.predict(tensor) as tf.Tensor;
    const data = await prediction.data();
    tf.dispose(prediction);
    return data[0];
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  let tensor: tf.Tensor | null = null;
  
  try {
    const loadedModel = await loadModelOnce();
    tensor = await preprocessImage(imageElement);
    const prediction = await makePrediction(loadedModel, tensor);
    
    return {
      coverage: prediction * 100,
      confidence: Math.min(prediction * 150, 100),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  } finally {
    if (tensor) {
      tensor.dispose();
    }
  }
}