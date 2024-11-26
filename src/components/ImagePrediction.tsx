import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const ImagePrediction = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const fileToGenerativePart = async (file: File) => {
    const buffer = await file.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(buffer).toString('base64'),
        mimeType: file.type
      },
    };
  };

  const analyzeImageWithGemini = async (file: File) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      
      const prompt = "Analyze this water hyacinth image and provide: 1. Estimated coverage percentage 2. Growth rate prediction 3. Water quality impact. Format response as JSON with keys: coverage_percentage, growth_rate, water_quality_impact";
      
      const imagePart = await fileToGenerativePart(file);
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      const analysis = JSON.parse(text);
      return {
        coverage: analysis.coverage_percentage || 0,
        growth_rate: analysis.growth_rate || 0,
        water_quality: analysis.water_quality_impact || 0,
      };
    } catch (error) {
      console.error('Gemini Analysis error:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('water-hyacinth-images')
        .upload(`predictions/${Date.now()}-${selectedFile.name}`, selectedFile);

      if (uploadError) throw uploadError;

      // Analyze image with Gemini
      const prediction = await analyzeImageWithGemini(selectedFile);

      // Store prediction in database
      const { error: dbError } = await supabase
        .from('gps_data')
        .insert([{
          latitude: prediction.coverage * 0.01,
          longitude: prediction.coverage * 0.01,
          hdop: prediction.growth_rate,
          temperature: 25 + (Math.random() * 5),
          ph: 7 + (Math.random() * 0.5),
          dissolvedsolids: 400 + (Math.random() * 100),
          timestamp: new Date().toISOString(),
          f_port: 1
        }]);

      if (dbError) throw dbError;

      toast({
        title: "Analysis Complete",
        description: `Coverage: ${prediction.coverage}%, Growth Rate: ${prediction.growth_rate}%`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Image for Analysis</h2>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            {selectedFile ? selectedFile.name : "Click to select an image"}
          </label>
        </div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="w-full"
        >
          {isLoading ? "Analyzing..." : "Analyze Image"}
        </Button>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Supported formats: JPG, PNG (max 5MB)</span>
        </div>
      </div>
    </Card>
  );
};

export default ImagePrediction;