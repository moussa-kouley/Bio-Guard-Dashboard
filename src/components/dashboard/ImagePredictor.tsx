import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { loadModel, makePrediction } from "@/utils/modelLoader";

export const ImagePredictor = () => {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<number[] | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Create an image element
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = async () => {
        setSelectedImage(img);
        
        // Load model and make prediction
        const model = await loadModel();
        const prediction = await makePrediction(model, img);
        setPredictionResult(Array.from(prediction));
        
        toast({
          title: "Prediction Complete",
          description: "Image has been analyzed successfully.",
        });
      };
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
          
          {isLoading && <span>Processing...</span>}
        </div>

        {selectedImage && (
          <div className="space-y-2">
            <img
              src={selectedImage.src}
              alt="Uploaded"
              className="max-w-xs rounded-lg"
            />
            {predictionResult && (
              <div className="text-sm">
                <p>Prediction Results:</p>
                <pre className="bg-gray-100 p-2 rounded">
                  {JSON.stringify(predictionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};