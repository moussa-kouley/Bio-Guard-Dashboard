import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { loadModel, makePrediction } from "@/utils/modelLoader";

type ImagePrediction = {
  image: HTMLImageElement;
  prediction: number[] | null;
  error?: string;
  confidence?: number;
};

export const ImagePredictor = () => {
  const [predictions, setPredictions] = useState<ImagePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsLoading(true);
    let model;
    
    try {
      model = await loadModel();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Model Loading Error",
        description: "Failed to load the prediction model. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const processImage = async (file: File): Promise<ImagePrediction> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
          try {
            const prediction = await makePrediction(model, img);
            // Calculate confidence score (assuming binary classification)
            const confidence = prediction[0] * 100;
            resolve({
              image: img,
              prediction: Array.from(prediction),
              confidence
            });
          } catch (error) {
            resolve({
              image: img,
              prediction: null,
              error: "Failed to process image"
            });
          }
        };

        img.onerror = () => {
          resolve({
            image: img,
            prediction: null,
            error: "Failed to load image"
          });
        };
      });
    };

    try {
      const newPredictions = await Promise.all(Array.from(files).map(processImage));
      setPredictions(prev => [...prev, ...newPredictions]);
      
      const successCount = newPredictions.filter(p => !p.error).length;
      const errorCount = newPredictions.filter(p => p.error).length;
      
      toast({
        title: "Processing Complete",
        description: `Analyzed ${successCount} image${successCount !== 1 ? 's' : ''}${
          errorCount > 0 ? `. Failed to process ${errorCount} image${errorCount !== 1 ? 's' : ''}.` : '.'
        }`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while processing images.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setPredictions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Water Hyacinth Detection</h3>
        
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {predictions.map((pred, index) => (
            <div key={index} className="relative space-y-2 border rounded-lg p-2">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <img
                src={pred.image.src}
                alt={`Uploaded ${index + 1}`}
                className="w-full rounded-lg"
              />
              {pred.error ? (
                <div className="text-sm text-red-500">
                  Error: {pred.error}
                </div>
              ) : (
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {pred.confidence && pred.confidence > 50 
                      ? "Water Hyacinth Detected" 
                      : "No Water Hyacinth Detected"}
                  </p>
                  <p className="text-gray-600">
                    Confidence: {pred.confidence?.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};