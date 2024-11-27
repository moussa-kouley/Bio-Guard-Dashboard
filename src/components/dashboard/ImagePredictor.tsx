import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X } from "lucide-react";
import { loadModel, makePrediction } from "@/utils/modelLoader";

type ImagePrediction = {
  image: HTMLImageElement;
  prediction: number[] | null;
};

export const ImagePredictor = () => {
  const [predictions, setPredictions] = useState<ImagePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsLoading(true);
    try {
      const model = await loadModel();
      
      // Process each file
      const fileArray = Array.from(files);
      const processImage = async (file: File): Promise<ImagePrediction> => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          
          img.onload = async () => {
            const prediction = await makePrediction(model, img);
            resolve({
              image: img,
              prediction: Array.from(prediction)
            });
          };
        });
      };

      const newPredictions = await Promise.all(fileArray.map(processImage));
      setPredictions(prev => [...prev, ...newPredictions]);
      
      toast({
        title: "Prediction Complete",
        description: `Successfully analyzed ${fileArray.length} images.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process one or more images.",
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
              {pred.prediction && (
                <div className="text-sm">
                  <p>Prediction Results:</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs">
                    {JSON.stringify(pred.prediction, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};