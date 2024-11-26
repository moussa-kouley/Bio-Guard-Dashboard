import React from 'react';
import { Upload, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageUploaderProps {
  selectedFiles: File[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploader = ({ selectedFiles, onFileChange }: ImageUploaderProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upload Images for Analysis</h2>
        <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            {selectedFiles.length 
              ? `${selectedFiles.length} images selected` 
              : "Click to select images"}
          </label>
        </div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Supported formats: JPG, PNG (max 5MB)</span>
        </div>
      </div>
    </Card>
  );
};

export default ImageUploader;