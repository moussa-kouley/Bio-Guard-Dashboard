import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Button } from '../ui/button';

export const ImageUploader: React.FC = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const metadataFileRef = useRef<HTMLInputElement>(null);

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputFile(file);
    }
  };

  const handleMetadataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMetadataFile(file);
    }
  };

  const handleUploadAndPredict = async () => {
    if (!inputFile || !metadataFile) {
      alert('Please select both input and metadata files');
      return;
    }

    try {
      // Read input file as ArrayBuffer
      const inputArrayBuffer = await inputFile.arrayBuffer();
      const metadataArrayBuffer = await metadataFile.arrayBuffer();

      // Save files to public directory
      await saveFileToPublic(inputFile, 'input_data.npy');
      await saveFileToPublic(metadataFile, 'metadata.npy');

      // Load the Keras model
      const model = await tf.loadLayersModel('/ai-model/saved_model/model.json');

      // Prepare input data (you may need to adjust based on your specific model)
      const inputTensor = tf.tensor(new Float32Array(inputArrayBuffer));
      
      // Make prediction
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionArray = await prediction.array();

      // Process and display prediction
      setPredictionResult(JSON.stringify(predictionArray));
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to process files or make prediction');
    }
  };

  // Helper function to save uploaded file to public directory
  const saveFileToPublic = async (file: File, filename: string) => {
    const formData = new FormData();
    formData.append('file', file, filename);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('File save error:', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block mb-2">Upload Input Data (.npy)</label>
        <input 
          type="file" 
          ref={inputFileRef}
          accept=".npy" 
          onChange={handleInputFileChange} 
          className="mb-2"
        />
      </div>

      <div>
        <label className="block mb-2">Upload Metadata (.npy)</label>
        <input 
          type="file" 
          ref={metadataFileRef}
          accept=".npy" 
          onChange={handleMetadataFileChange} 
          className="mb-2"
        />
      </div>

      <Button 
        onClick={handleUploadAndPredict}
        disabled={!inputFile || !metadataFile}
      >
        Upload and Predict
      </Button>

      {predictionResult && (
        <div className="mt-4">
          <h3 className="font-bold">Prediction Result:</h3>
          <pre className="bg-gray-100 p-2 rounded">{predictionResult}</pre>
        </div>
      )}
    </div>
  );
};
