import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ImageAnalysisResultProps {
  imageUrl: string;
  analysis: string | null;
  isLoading: boolean;
}

const ImageAnalysisResult: React.FC<ImageAnalysisResultProps> = ({
  imageUrl,
  analysis,
  isLoading
}) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <img 
          src={imageUrl} 
          alt="Predicted water hyacinth distribution"
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">AI Analysis</h3>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <p>Analyzing image...</p>
          </div>
        ) : analysis ? (
          <div className="text-sm text-gray-600 space-y-2">
            {analysis.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default ImageAnalysisResult;