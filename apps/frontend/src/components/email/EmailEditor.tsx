import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { CanvaIntegration } from "./CanvaIntegration";

interface EmailEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  content,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<"design" | "code">("design");
  const [showPreview, setShowPreview] = useState(false);

  const handleAddElement = (type: string) => {
    // Add element to content
    // This would integrate with a drag-and-drop editor
  };

  const handleAddImage = () => {
    // Open image upload dialog
  };

  const handleAddVariable = () => {
    // Open variable selector
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <CanvaIntegration
              onDesignImport={(designHtml) => onChange(designHtml)}
            />
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setActiveTab("design")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "design"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === "code"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Code
              </button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Icons.Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icons.Undo2 className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="outline">
              <Icons.Redo2 className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Elements Panel */}
        {activeTab === "design" && (
          <div className="w-64 border-r border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Elements</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAddElement("text")}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Type className="w-4 h-4" />
                <span>Text</span>
              </button>
              <button
                onClick={() => handleAddElement("button")}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Square className="w-4 h-4" />
                <span>Button</span>
              </button>
              <button
                onClick={() => handleAddElement("spacer")}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.ArrowUpDown className="w-4 h-4" />
                <span>Spacer</span>
              </button>
              <button
                onClick={() => handleAddElement("divider")}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Minus className="w-4 h-4" />
                <span>Divider</span>
              </button>
              <button
                onClick={handleAddImage}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Image className="w-4 h-4" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleAddElement("social")}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Share2 className="w-4 h-4" />
                <span>Social Links</span>
              </button>
              <button
                onClick={handleAddVariable}
                className="w-full p-3 flex items-center gap-2 rounded-lg hover:bg-gray-100"
              >
                <Icons.Variable className="w-4 h-4" />
                <span>Variable</span>
              </button>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 p-4">
          {activeTab === "design" ? (
            <div className="bg-gray-100 rounded-lg p-4 min-h-[500px]">
              {/* Drag and drop editor area */}
              <div className="bg-white rounded-lg shadow-sm p-8 min-h-[400px]">
                {content}
              </div>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm border border-gray-200 rounded-lg"
            />
          )}
        </div>

        {/* Properties Panel */}
        {activeTab === "design" && (
          <div className="w-64 border-l border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-4">Properties</h3>
            {/* Properties for selected element */}
          </div>
        )}
      </div>
    </div>
  );
};
