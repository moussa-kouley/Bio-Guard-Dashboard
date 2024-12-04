import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import ImageUploader from './image-analysis/ImageUploader';
import { analyzeImageWithModel, saveAnalysisToDatabase, type AnalysisResult } from './image-analysis/AnalysisService';

const ImagePrediction = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
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
        },
        heatmap: prediction.heatmap
      }
    });
    window.dispatchEvent(event);
  };

  const simulateAnalysisStages = async () => {
    const stages = [
      { message: "Processing images...", duration: 1500 },
      { message: "Analyzing water hyacinth patterns...", duration: 2000 },
      { message: "Calculating coverage metrics...", duration: 1800 },
      { message: "Generating environmental impact assessment...", duration: 1700 }
    ];

    for (const stage of stages) {
      setAnalysisStage(stage.message);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }
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
    setAnalysisStage("Initializing analysis...");

    try {
      await simulateAnalysisStages();

      const predictions = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            return await analyzeImageWithModel(file);
          } catch (error) {
            toast({
              title: `Error analyzing ${file.name}`,
              description: error instanceof Error ? error.message : 'Unknown error occurred',
              variant: "destructive",
            });
            return null;
          }
        })
      );

      const validPredictions = predictions.filter((p): p is AnalysisResult => p !== null);

      if (validPredictions.length === 0) {
        toast({
          title: "Analysis Failed",
          description: "No images could be analyzed successfully",
          variant: "destructive",
        });
        return;
      }

      const averagePrediction: AnalysisResult = {
        coverage: validPredictions.reduce((sum, p) => sum + p.coverage, 0) / validPredictions.length,
        growth_rate: validPredictions.reduce((sum, p) => sum + p.growth_rate, 0) / validPredictions.length,
        water_quality: validPredictions.reduce((sum, p) => sum + p.water_quality, 0) / validPredictions.length,
        raw_analysis: `Combined analysis of ${validPredictions.length} images: ${validPredictions.map(p => p.raw_analysis).join(' ')}`,
        heatmap: validPredictions[0].heatmap // Use the first image's heatmap for visualization
      };

      await saveAnalysisToDatabase(averagePrediction);
      dispatchAnalysisEvent(averagePrediction);

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${validPredictions.length} out of ${selectedFiles.length} images. Average Coverage: ${averagePrediction.coverage.toFixed(1)}%, Growth Rate: ${averagePrediction.growth_rate.toFixed(1)}%`,
      });

      setSelectedFiles([]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Error analyzing images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAnalysisStage('');
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
            {analysisStage}
          </>
        ) : (
          "Analyze Images"
        )}
      </Button>
    </div>
  );
};

export default ImagePrediction;