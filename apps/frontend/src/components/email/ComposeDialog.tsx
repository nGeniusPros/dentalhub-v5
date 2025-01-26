import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

interface ComposeDialogProps {
  open: boolean;
  onClose: () => void;
  type: "all" | "outbound" | "newsletter";
}

export const ComposeDialog = ({ open, onClose, type }: ComposeDialogProps) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {type === "newsletter" ? "Create Newsletter" : "Compose Email"}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <Icons.X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Write your message..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Icons.Image className="w-4 h-4 mr-2" />
                Add Image
              </Button>
              <Button variant="outline" size="sm">
                <Icons.Link className="w-4 h-4 mr-2" />
                Add Link
              </Button>
              <Button variant="outline" size="sm">
                <Icons.Variable className="w-4 h-4 mr-2" />
                Add Variable
              </Button>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline">
                <Icons.Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline">
                <Icons.Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
            <Button>
              <Icons.Send className="w-4 h-4 mr-2" />
              Send Now
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
