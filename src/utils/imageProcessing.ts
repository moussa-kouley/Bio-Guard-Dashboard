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
      
      // Wait for tf.js to initialize
      console.log('Initializing TensorFlow.js...');
      await tf.ready();
      console.log('TensorFlow.js initialized successfully');
      
      // Check if file exists
      try {
        const response = await fetch(modelPath);
        if (!response.ok) {
          throw new Error(`Model file not found at ${modelPath}. Status: ${response.status}`);
        }
        console.log('Model file found at specified path');
      } catch (fetchError) {
        console.error('Error fetching model file:', fetchError);
        throw fetchError;
      }
      
      // Load model
      console.log('Loading model...');
      model = await tf.loadLayersModel(modelPath);
      console.log('Model loaded successfully. Model summary:', model);
      
      // Warm up the model
      console.log('Warming up model...');
      const dummyData = tf.zeros([1, 10, 224, 224, 3]);
      const warmupResult = model.predict(dummyData);
      tf.dispose(warmupResult);
      tf.dispose(dummyData);
      console.log('Model warmup completed');
      
    } catch (error) {
      console.error('Detailed error loading model:', error);
      throw new Error(`Failed to load model: ${error.message}`);
    }
  }
  return model;
}

async function preprocessImage(imageElement: HTMLImageElement): Promise<tf.Tensor4D> {
  return tf.tidy(() => {
    console.log('Starting image preprocessing');
    // Convert the image to a tensor
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeBilinear([224, 224]) // Resize to model input size
      .toFloat()
      .div(255.0) // Normalize
      .expandDims(0)
      .expandDims(0); // Add batch and time dimensions [1, 1, 224, 224, 3]
    
    // Repeat the frame 10 times to match the model's expected input shape
    const repeatedTensor = tensor.tile([1, 10, 1, 1, 1]);
    console.log('Image preprocessing completed. Tensor shape:', repeatedTensor.shape);
    return repeatedTensor;
  });
}

async function makePrediction(model: tf.LayersModel, tensor: tf.Tensor4D): Promise<number> {
  let prediction: tf.Tensor | null = null;
  
  try {
    console.log('Making prediction with tensor shape:', tensor.shape);
    // Make prediction
    prediction = model.predict(tensor) as tf.Tensor;
    console.log('Prediction tensor shape:', prediction.shape);
    const data = await prediction.data();
    console.log('Raw prediction data:', data);
    return data[0];
  } catch (error) {
    console.error('Error in makePrediction:', error);
    throw error;
  } finally {
    // Clean up prediction tensor
    if (prediction) {
      prediction.dispose();
    }
  }
}

export async function analyzeImage(imageElement: HTMLImageElement): Promise<ImageAnalysisResult> {
  let tensor: tf.Tensor4D | null = null;
  
  try {
    // Ensure model is loaded
    const loadedModel = await loadModelOnce();
    if (!loadedModel) {
      throw new Error('Model failed to load');
    }
    
    // Preprocess image
    tensor = await preprocessImage(imageElement);
    console.log('Image preprocessed successfully');
    
    // Make prediction
    const prediction = await makePrediction(loadedModel, tensor);
    console.log('Prediction made successfully:', prediction);
    
    // Calculate coverage based on prediction confidence
    const coverage = prediction * 100;
    
    return {
      coverage,
      confidence: prediction * 100,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    throw error;
  } finally {
    // Clean up tensor
    if (tensor) {
      tensor.dispose();
    }
  }
}