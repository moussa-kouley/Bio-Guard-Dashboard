import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ImageUploader from './image-analysis/ImageUploader';
import { analyzeImageWithGemini, saveAnalysisToDatabase, type AnalysisResult } from './image-analysis/AnalysisService';

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
      await saveAnalysisToDatabase(prediction);
      dispatchAnalysisEvent(prediction);

      toast({
        title: `Analysis Complete (${currentFileIndex + 1}/${selectedFiles.length})`,
        description: `Coverage: ${prediction.coverage}%, Growth Rate: ${prediction.growth_rate}%`,
      });

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
            Analyzing ({currentFileIndex + 1}/{selectedFiles.length})...
          </>
        ) : (
          "Analyze Images"
        )}
      </Button>
    </div>
  );
};

export default ImagePrediction;