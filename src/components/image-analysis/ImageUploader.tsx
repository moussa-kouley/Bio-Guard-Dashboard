import React, { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Button } from '../ui/button';
import { analyzeNpyWithModel } from './AnalysisService';
import { toast } from '../ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export interface AnalysisResult {
  tensorflowAnalysis?: {
    coverage: number;
    growth_rate: number;
    water_quality: number;
    raw_analysis: string;
    heatmap?: number[][];
  };
}

export const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file",
        variant: "destructive"
      });
    }
  };

  const preprocessImage = async (imageFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const img = new Image();
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = 224;
            canvas.height = 224;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              throw new Error('Could not create canvas context');
            }
            
            ctx.drawImage(img, 0, 0, 224, 224);
            
            const tensor = tf.browser.fromPixels(canvas)
              .toFloat()
              .div(tf.scalar(255))
              .reshape([1, 224, 224, 3]);
            
            const npyFile = await convertTensorToNpy(tensor);
            resolve(npyFile);
          };
          
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = event.target?.result as string;
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(imageFile);
    });
  };

  const convertTensorToNpy = async (tensor: tf.Tensor): Promise<File> => {
    const data = await tensor.data();
    const blob = new Blob([new Float32Array(data)], { type: 'application/octet-stream' });
    return new File([blob], 'input_data.npy', { type: 'application/octet-stream' });
  };

  const handleUploadAndPredict = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select an image to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setAnalysisResult(null);

    try {
      // Preprocess for TensorFlow model
      const npyFile = await preprocessImage(selectedFile);
      const tensorflowAnalysis = await analyzeNpyWithModel(npyFile);

      const result: AnalysisResult = {
        tensorflowAnalysis,
      };

      setAnalysisResult(result);

      toast({
        title: "Analysis Complete",
        description: `TensorFlow Coverage: ${tensorflowAnalysis.coverage.toFixed(2)}%`,
        variant: "default"
      });

      console.log('Full Analysis Result:', result);
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block mb-2">Upload Water Hyacinth Image</label>
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-2"
        />
      </div>

      <Button 
        onClick={handleUploadAndPredict}
        disabled={!selectedFile || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Analyze Image'}
      </Button>

      {analysisResult && analysisResult.tensorflowAnalysis && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>TensorFlow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm overflow-auto max-h-64">
                {JSON.stringify(analysisResult.tensorflowAnalysis, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
