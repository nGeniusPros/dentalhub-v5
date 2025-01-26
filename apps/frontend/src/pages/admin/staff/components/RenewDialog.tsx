import React, { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";

interface RenewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: (details: any) => void;
  credential: {
    type: string;
    number: string;
    expirationDate: string;
  };
}

export const RenewDialog: React.FC<RenewDialogProps> = ({
  isOpen,
  onClose,
  onRenew,
  credential,
}) => {
  const [details, setDetails] = useState({
    newExpirationDate: "",
    documentFile: null as File | null,
    notes: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Renew Credential</h2>
              <p className="text-sm text-gray-500">
                {credential.type} #{credential.number}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Expiration Date
            </label>
            <p className="text-gray-900">{credential.expirationDate}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Expiration Date
            </label>
            <input
              type="date"
              value={details.newExpirationDate}
              onChange={(e) =>
                setDetails((prev) => ({
                  ...prev,
                  newExpirationDate: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Icons.Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDetails((prev) => ({
                            ...prev,
                            documentFile: file,
                          }));
                        }
                      }}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={details.notes}
              onChange={(e) =>
                setDetails((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Add any notes about the renewal..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onRenew(details)}>Renew Credential</Button>
        </div>
      </motion.div>
    </div>
  );
};
