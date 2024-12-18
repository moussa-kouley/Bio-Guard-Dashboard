import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import Npyjs from 'npyjs';

export const ImagePrediction: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [predictedImage, setPredictedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const metadataInputRef = useRef<HTMLInputElement>(null);

  const loadNpyFile = async (file: File): Promise<Float32Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('Failed to read file');
          }
          
          const npLoader = new Npyjs();
          const array = await npLoader.load(event.target.result as ArrayBuffer);
          
          if (!array || !array.data) {
            throw new Error('Invalid .npy file format');
          }

          resolve(array.data as Float32Array);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const predictImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate file inputs
      const imageFiles = imageInputRef.current?.files;
      const metadataFiles = metadataInputRef.current?.files;

      if (!imageFiles || !metadataFiles || imageFiles.length === 0 || metadataFiles.length === 0) {
        throw new Error('Please upload both image and metadata files');
      }

      // Find appropriate files (assuming files with 'X_img_test' and 'X_meta_test' in their names)
      const imageFile = Array.from(imageFiles).find(file => file.name.includes('X_img_test'));
      const metadataFile = Array.from(metadataFiles).find(file => file.name.includes('X_meta_test'));

      if (!imageFile || !metadataFile) {
        throw new Error('Could not find appropriate image or metadata files');
      }

      // Load NPY files
      const X_img_test = await loadNpyFile(imageFile);
      const X_meta_test = await loadNpyFile(metadataFile);

      // Load the model
      const modelPath = '/ai-model/saved_model/TrainedModelV5.keras';
      const model = await tf.loadLayersModel(modelPath, {
        weightPathPrefix: modelPath.replace('.keras', '')
      });

      // Reshape input data
      const imgShape = [1, 224, 224, 3];
      const metaShape = [1, X_meta_test.length];

      const imgTensor = tf.tensor(X_img_test, imgShape);
      const metaTensor = tf.tensor(X_meta_test, metaShape);

      // Make predictions
      const predictedImagesTensor = model.predict([
        tf.expandDims(imgTensor, 0), 
        tf.expandDims(metaTensor, 0)
      ]) as tf.Tensor;

      // Convert predicted image to base64
      const predictedImageArray = await predictedImagesTensor.array();
      const predictedImageCanvas = document.createElement('canvas');
      predictedImageCanvas.width = 224;
      predictedImageCanvas.height = 224;
      const predictedCtx = predictedImageCanvas.getContext('2d');
      
      if (predictedCtx) {
        const predictedImageData = predictedCtx.createImageData(224, 224);
        const predictedData = predictedImageData.data;
        
        for (let y = 0; y < 224; y++) {
          for (let x = 0; x < 224; x++) {
            const idx = (y * 224 + x) * 4;
            predictedData[idx] = Math.round(predictedImageArray[0][y][x][0] * 255);
            predictedData[idx + 1] = Math.round(predictedImageArray[0][y][x][1] * 255);
            predictedData[idx + 2] = Math.round(predictedImageArray[0][y][x][2] * 255);
            predictedData[idx + 3] = 255;
          }
        }
        
        predictedCtx.putImageData(predictedImageData, 0, 0);
        const predictedBase64 = predictedImageCanvas.toDataURL();
        setPredictedImage(predictedBase64);
      }

      // Clean up tensors
      imgTensor.dispose();
      metaTensor.dispose();
      predictedImagesTensor.dispose();

    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-prediction-container space-y-4">
      <div className="file-upload-section flex space-x-4">
        <div>
          <label className="block mb-2">Upload Image NPY File</label>
          <input 
            type="file" 
            ref={imageInputRef}
            accept=".npy"
            className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white"
          />
        </div>
        <div>
          <label className="block mb-2">Upload Metadata NPY File</label>
          <input 
            type="file" 
            ref={metadataInputRef}
            accept=".npy"
            className="file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white"
          />
        </div>
        <button 
          onClick={predictImages} 
          disabled={loading}
          className="self-end bg-blue-500 text-white p-2 rounded"
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          Error: {error}
        </div>
      )}

      {predictedImage && (
        <div className="prediction-result mt-4">
          <h3 className="text-lg font-semibold mb-2">Predicted Image</h3>
          <img 
            src={predictedImage} 
            alt="Predicted" 
            className="w-full h-auto border"
          />
        </div>
      )}
    </div>
  );
};

export default ImagePrediction;
