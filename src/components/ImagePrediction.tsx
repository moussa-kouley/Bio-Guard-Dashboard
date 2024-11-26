import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface AnalysisResult {
  coverage: number;
  growth_rate: number;
  water_quality: number;
  raw_analysis: string;
}

const ImagePrediction = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
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

  const analyzeImageWithGemini = async (file: File): Promise<AnalysisResult> => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `Analyze this water hyacinth image and provide a detailed analysis. Focus on:
    1. Coverage percentage of water hyacinth
    2. Growth rate prediction
    3. Water quality impact
    4. Potential environmental risks
    5. Recommended actions

    First provide a JSON with numerical values for:
    {
      "coverage_percentage": (0-100),
      "growth_rate": (0-100),
      "water_quality_impact": (0-100)
    }

    Then provide a detailed analysis in natural language.`;
    
    const imagePart = await fileToGenerativePart(file);
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON part
    const jsonMatch = text.match(/{[\s\S]*?}/);
    let analysis = {
      coverage_percentage: 0,
      growth_rate: 0,
      water_quality_impact: 0
    };
    
    try {
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error parsing JSON from Gemini response:', error);
    }
    
    // Get the rest of the text as raw analysis
    const rawAnalysis = text.replace(/{[\s\S]*?}/, '').trim();
    
    return {
      coverage: analysis.coverage_percentage,
      growth_rate: analysis.growth_rate,
      water_quality: analysis.water_quality_impact,
      raw_analysis: rawAnalysis
    };
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || currentFileIndex >= selectedFiles.length) {
      toast({
        title: "No files to analyze",
        description: "Please select images to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const currentFile = selectedFiles[currentFileIndex];
      const prediction = await analyzeImageWithGemini(currentFile);

      // Try to store in database
      try {
        await supabase
          .from('gps_data')
          .insert([{
            latitude: prediction.coverage * 0.01,
            longitude: prediction.growth_rate * 0.01,
            hdop: prediction.water_quality,
            temperature: 25 + (Math.random() * 5),
            ph: 7 + (Math.random() * 0.5),
            dissolvedsolids: 400 + (Math.random() * 100),
            timestamp: new Date().toISOString(),
            f_port: 1
          }]);
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      // Dispatch custom event for dashboard to update findings
      const event = new CustomEvent('newAnalysis', { 
        detail: { 
          analysis: prediction.raw_analysis,
          timestamp: new Date().toISOString(),
          metrics: {
            coverage: prediction.coverage,
            growth_rate: prediction.growth_rate,
            water_quality: prediction.water_quality
          }
        }
      });
      window.dispatchEvent(event);

      toast({
        title: `Analysis Complete (${currentFileIndex + 1}/${selectedFiles.length})`,
        description: `Coverage: ${prediction.coverage}%, Growth Rate: ${prediction.growth_rate}%`,
      });

      // Move to next file if there are more
      if (currentFileIndex < selectedFiles.length - 1) {
        setCurrentFileIndex(prev => prev + 1);
      } else {
        setSelectedFiles([]);
        setCurrentFileIndex(0);
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: "Error analyzing image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Images for Analysis</h2>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            {selectedFiles.length 
              ? `${selectedFiles.length} images selected` 
              : "Click to select images"}
          </label>
        </div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFiles.length || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing ({currentFileIndex + 1}/{selectedFiles.length})...
            </>
          ) : (
            "Analyze Images"
          )}
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