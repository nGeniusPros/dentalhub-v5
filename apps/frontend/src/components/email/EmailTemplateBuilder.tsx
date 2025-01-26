import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface Block {
  id: string;
  type:
    | "text"
    | "image"
    | "button"
    | "spacer"
    | "divider"
    | "social"
    | "variable";
  content: any;
}

interface EmailTemplateBuilderProps {
  content: Block[];
  onChange: (content: Block[]) => void;
}

export const EmailTemplateBuilder: React.FC<EmailTemplateBuilderProps> = ({
  content,
  onChange,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);

  const handleDragStart = (block: Block) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedBlock) {
      const newContent = [...content];
      newContent.splice(index, 0, draggedBlock);
      onChange(newContent);
      setDraggedBlock(null);
    }
  };

  const handleBlockEdit = (id: string, updates: Partial<Block>) => {
    const newContent = content.map((block) =>
      block.id === id ? { ...block, ...updates } : block,
    );
    onChange(newContent);
  };

  const handleBlockDelete = (id: string) => {
    const newContent = content.filter((block) => block.id !== id);
    onChange(newContent);
  };

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "text":
        return (
          <div className="prose max-w-none">
            <div
              contentEditable
              dangerouslySetInnerHTML={{ __html: block.content }}
              onBlur={(e) =>
                handleBlockEdit(block.id, {
                  content: e.currentTarget.innerHTML,
                })
              }
              className="outline-none"
            />
          </div>
        );
      case "image":
        return (
          <div className="relative">
            <img
              src={block.content.url}
              alt={block.content.alt}
              className="max-w-full rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="sm" variant="ghost" className="bg-white/90">
                <Icons.Edit2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="bg-white/90">
                <Icons.Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      case "button":
        return (
          <div className="text-center">
            <button
              className={cn(
                "px-6 py-3 rounded-lg font-medium",
                block.content.style === "primary" && "bg-primary text-white",
                block.content.style === "secondary" &&
                  "bg-gray-100 text-gray-900",
                block.content.style === "outline" &&
                  "border-2 border-primary text-primary",
              )}
            >
              {block.content.text}
            </button>
          </div>
        );
      case "spacer":
        return (
          <div
            style={{ height: block.content.height }}
            className="bg-gray-50"
          />
        );
      case "divider":
        return (
          <hr
            className={cn(
              "my-4",
              block.content.style === "solid" && "border-gray-200",
              block.content.style === "dashed" &&
                "border-dashed border-gray-200",
              block.content.style === "dotted" &&
                "border-dotted border-gray-200",
            )}
          />
        );
      case "social":
        return (
          <div className="flex justify-center gap-4">
            {block.content.networks.map((network: string) => (
              <button
                key={network}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {React.createElement(Icons[network as keyof typeof Icons], {
                  className: "w-5 h-5",
                })}
              </button>
            ))}
          </div>
        );
      case "variable":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {block.content.name}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
          <div className="p-8 space-y-6">
            {content.map((block, index) => (
              <motion.div
                key={block.id}
                layoutId={block.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 border-transparent",
                  selectedBlock === block.id && "border-primary",
                )}
                onClick={() => setSelectedBlock(block.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                {renderBlock(block)}
                {selectedBlock === block.id && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Icons.ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Icons.ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBlockDelete(block.id)}
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
