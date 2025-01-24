import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import { useNotifications } from '../../../../../contexts/NotificationContext';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    // Validate file types
    const validFiles = newFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png'
      ];
      
      if (!validTypes.includes(file.type)) {
        notifyDispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now().toString(),
            type: 'alert',
            title: 'Invalid File Type',
            message: `${file.name} is not a supported file type.`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
          }
        });
        return false;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        notifyDispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now().toString(),
            type: 'alert',
            title: 'File Too Large',
            message: `${file.name} exceeds the 10MB size limit.`,
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium'
          }
        });
        return false;
      }
      
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      // Simulate file upload with progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [i]: progress
          }));
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      onUpload(files);
      onClose();

      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'message',
          title: 'Upload Complete',
          message: `Successfully uploaded ${files.length} file${files.length === 1 ? '' : 's'}.`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      });
    } catch (error) {
      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now().toString(),
          type: 'alert',
          title: 'Upload Failed',
          message: 'An error occurred while uploading files.',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'high'
        }
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upload Documents</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragging ? "border-primary bg-primary/5" : "border-gray-200",
              "hover:border-primary hover:bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            <div className="flex flex-col items-center">
              <Icons.Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, Word, Excel, Images (up to 10MB)
              </p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      file.type.includes('pdf') && "bg-red-100 text-red-600",
                      file.type.includes('word') && "bg-blue-100 text-blue-600",
                      file.type.includes('excel') && "bg-green-100 text-green-600",
                      file.type.includes('image') && "bg-purple-100 text-purple-600"
                    )}>
                      {file.type.includes('pdf') && <Icons.FileText className="w-4 h-4" />}
                      {file.type.includes('word') && <Icons.FileText className="w-4 h-4" />}
                      {file.type.includes('excel') && <Icons.FileSpreadsheet className="w-4 h-4" />}
                      {file.type.includes('image') && <Icons.Image className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {uploadProgress[index] !== undefined && (
                      <div className="w-24">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[index]}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Icons.Upload className="w-4 h-4 mr-2" />
                Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};