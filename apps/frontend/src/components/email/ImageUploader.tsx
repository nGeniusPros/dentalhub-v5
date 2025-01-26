import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

interface ImageUploaderProps {
  onUpload: (image: { url: string; alt: string }) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !preview) return;

    setUploading(true);
    try {
      // In a real app, upload to a server/CDN
      // For now, just use the preview URL
      onUpload({
        url: preview,
        alt: altText || selectedFile.name,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
        <p className="text-sm text-gray-500">
          Select an image to add to your email
        </p>
      </div>

      <div className="space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 ${
            preview ? "border-primary" : "border-gray-200"
          }`}
        >
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                }}
                className="w-full"
              >
                Choose Different Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Icons.Image className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-4 text-center">
                Drag and drop an image here, or click to browse
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                Browse Files
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {preview && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreview(null);
                  setAltText("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? (
                  <>
                    <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Insert Image"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
