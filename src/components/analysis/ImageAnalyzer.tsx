import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { ImageAnalysisResult } from '@/utils/imageProcessing';

interface ImageAnalyzerProps {
  result: ImageAnalysisResult;
  imageSrc: string;
}

export const ImageAnalyzer = ({ result, imageSrc }: ImageAnalyzerProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="relative">
        <img 
          src={imageSrc} 
          alt="Analyzed area" 
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {format(new Date(result.timestamp), 'MMM dd, yyyy')}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Coverage</span>
          <span>{result.coverage.toFixed(1)}%</span>
        </div>
        <Progress value={result.coverage} className="h-2" />
        
        <div className="flex justify-between text-sm">
          <span>Confidence</span>
          <span>{result.confidence.toFixed(1)}%</span>
        </div>
        <Progress value={result.confidence} className="h-2" />
      </div>
    </Card>
  );
};