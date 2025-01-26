import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { VendorForm } from "./VendorForm";
import type { Vendor } from "../types/vendor";

interface VendorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendor: Partial<Vendor>) => void;
  vendor?: Vendor;
}

export const VendorFormDialog: React.FC<VendorFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vendor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200"
        >
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-6 border-b border-gray-200 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
                {vendor ? "Edit" : "Add"} Vendor
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100 rounded-full"
              >
                <Icons.X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-8">
            <VendorForm
              vendor={vendor}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
