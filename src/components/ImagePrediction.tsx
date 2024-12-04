import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { analyzeNpyWithModel, saveAnalysisToDatabase, type AnalysisResult } from './image-analysis/AnalysisService';

const ImagePrediction = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [metaFile, setMetaFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [predictionResult, setPredictionResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleInputFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setInputFile(file);
    }
  };

  const handleMetaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setMetaFile(file);
    }
  };

  const simulateAnalysisStages = async () => {
    const stages = [
      { message: "Loading input .npy file...", duration: 1000 },
      { message: "Loading meta .npy file...", duration: 1000 },
      { message: "Processing data arrays...", duration: 1500 },
      { message: "Analyzing patterns...", duration: 1500 },
      { message: "Generating predictions...", duration: 1000 }
    ];

    for (const stage of stages) {
      setAnalysisStage(stage.message);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }
  };

  const handleAnalyze = async () => {
    if (!inputFile || !metaFile) {
      toast({
        title: "Missing files",
        description: "Please upload both input and meta .npy files",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPredictionResult(null);
    setAnalysisStage("Initializing analysis...");

    try {
      await simulateAnalysisStages();
      const prediction = await analyzeNpyWithModel(inputFile);
      
      if (!prediction) {
        throw new Error("Analysis failed");
      }

      await saveAnalysisToDatabase(prediction);
      setPredictionResult(prediction);

      toast({
        title: "Analysis Complete",
        description: "Successfully analyzed the data",
      });
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
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Image Analysis</h2>
        
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed rounded-lg">
            <label className="block text-sm font-medium mb-2">Input File (.npy)</label>
            <input
              type="file"
              accept=".npy"
              onChange={handleInputFileChange}
              className="w-full"
            />
            {inputFile && (
              <p className="text-sm text-green-600 mt-2">Selected: {inputFile.name}</p>
            )}
          </div>

          <div className="p-4 border-2 border-dashed rounded-lg">
            <label className="block text-sm font-medium mb-2">Meta File (.npy)</label>
            <input
              type="file"
              accept=".npy"
              onChange={handleMetaFileChange}
              className="w-full"
            />
            {metaFile && (
              <p className="text-sm text-green-600 mt-2">Selected: {metaFile.name}</p>
            )}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!inputFile || !metaFile || isLoading}
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
      </Card>

      {predictionResult && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Coverage</p>
                <p className="text-2xl font-semibold">{predictionResult.coverage.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Growth Rate</p>
                <p className="text-2xl font-semibold">{predictionResult.growth_rate.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Water Quality</p>
                <p className="text-2xl font-semibold">{predictionResult.water_quality.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Analysis Summary</h4>
              <p className="text-gray-600">{predictionResult.raw_analysis}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImagePrediction;