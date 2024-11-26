import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ImageUploader from './image-analysis/ImageUploader';
import { analyzeImageWithGemini, saveAnalysisToDatabase, type AnalysisResult } from './image-analysis/AnalysisService';

const ImagePrediction = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const dispatchAnalysisEvent = (prediction: AnalysisResult) => {
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
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      toast({
        title: "No files to analyze",
        description: "Please select images to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Analyze all images and calculate average metrics
      const predictions = await Promise.all(selectedFiles.map(file => analyzeImageWithGemini(file)));
      
      const averagePrediction: AnalysisResult = {
        coverage: predictions.reduce((sum, p) => sum + p.coverage, 0) / predictions.length,
        growth_rate: predictions.reduce((sum, p) => sum + p.growth_rate, 0) / predictions.length,
        water_quality: predictions.reduce((sum, p) => sum + p.water_quality, 0) / predictions.length,
        raw_analysis: `Combined analysis of ${predictions.length} images: ${predictions.map(p => p.raw_analysis).join(' ')}`,
      };

      await saveAnalysisToDatabase(averagePrediction);
      dispatchAnalysisEvent(averagePrediction);

      toast({
        title: "Analysis Complete",
        description: `Analyzed ${selectedFiles.length} images. Average Coverage: ${averagePrediction.coverage.toFixed(1)}%, Growth Rate: ${averagePrediction.growth_rate.toFixed(1)}%`,
      });

      setSelectedFiles([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: "Error analyzing images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImageUploader 
        selectedFiles={selectedFiles}
        onFileChange={handleFileChange}
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFiles.length || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing {selectedFiles.length} images...
          </>
        ) : (
          "Analyze Images"
        )}
      </Button>
    </div>
  );
};

export default ImagePrediction;