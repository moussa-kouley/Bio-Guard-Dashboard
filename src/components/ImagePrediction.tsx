import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { analyzeNpyWithModel, saveAnalysisToDatabase, type AnalysisResult } from './image-analysis/AnalysisService';

const ImagePrediction = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.name.endsWith('.npy')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a .npy file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const simulateAnalysisStages = async () => {
    const stages = [
      { message: "Loading .npy file...", duration: 1500 },
      { message: "Processing data array...", duration: 2000 },
      { message: "Analyzing water hyacinth patterns...", duration: 1800 },
      { message: "Generating predictions...", duration: 1700 }
    ];

    for (const stage of stages) {
      setAnalysisStage(stage.message);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
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

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a .npy file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisStage("Initializing analysis...");

    try {
      await simulateAnalysisStages();
      const prediction = await analyzeNpyWithModel(selectedFile);
      
      if (!prediction) {
        throw new Error("Analysis failed");
      }

      await saveAnalysisToDatabase(prediction);
      dispatchAnalysisEvent(prediction);

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed the data. Coverage: ${prediction.coverage.toFixed(1)}%, Growth Rate: ${prediction.growth_rate.toFixed(1)}%`,
      });

      setSelectedFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Error analyzing data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAnalysisStage('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 border-2 border-dashed rounded-lg">
        <input
          type="file"
          accept=".npy"
          onChange={handleFileChange}
          className="w-full"
        />
        <p className="text-sm text-gray-500 mt-2">Upload .npy file for analysis</p>
      </div>
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {analysisStage}
          </>
        ) : (
          "Analyze Data"
        )}
      </Button>
    </div>
  );
};

export default ImagePrediction;