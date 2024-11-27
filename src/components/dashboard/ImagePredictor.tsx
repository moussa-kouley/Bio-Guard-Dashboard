import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { analyzeImage, ImageAnalysisResult } from "@/utils/imageProcessing";
import { ImageAnalyzer } from "../analysis/ImageAnalyzer";

interface ProcessedImage {
  src: string;
  analysis: ImageAnalysisResult;
}

export const ImagePredictor = () => {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsLoading(true);

    const processImage = async (file: File): Promise<ProcessedImage | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
          try {
            const analysis = await analyzeImage(img);
            resolve({
              src: img.src,
              analysis
            });
          } catch (error) {
            console.error('Error processing image:', error);
            resolve(null);
          }
        };

        img.onerror = () => resolve(null);
      });
    };

    try {
      const results = await Promise.all(Array.from(files).map(processImage));
      const validResults = results.filter((result): result is ProcessedImage => result !== null);
      
      setProcessedImages(prev => [...prev, ...validResults]);
      
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${validResults.length} images`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setProcessedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Water Hyacinth Analysis</h3>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="relative"
            disabled={isLoading}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </Button>
          
          {isLoading && <span>Processing...</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedImages.map((img, index) => (
            <div key={index} className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-6 w-6 bg-black/50 hover:bg-black/70"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
              <ImageAnalyzer result={img.analysis} imageSrc={img.src} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};