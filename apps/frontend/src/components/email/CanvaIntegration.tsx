import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../ui/button";

interface CanvaIntegrationProps {
  onDesignImport: (designHtml: string) => void;
}

export const CanvaIntegration: React.FC<CanvaIntegrationProps> = ({
  onDesignImport,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would authenticate with Canva's API
    setIsConnected(true);
    setShowLoginModal(false);
  };

  const handleImportDesign = async () => {
    // In production, this would open Canva's design picker
    window.open("https://www.canva.com/your-designs", "_blank");
  };

  const handleExportToCanva = async () => {
    // In production, this would export the current design to Canva
    window.open("https://www.canva.com/create/email-headers", "_blank");
  };

  return (
    <>
      {!isConnected ? (
        <Button
          variant="outline"
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-2"
        >
          <Icons.Palette className="w-4 h-4" />
          Connect to Canva
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleImportDesign}
            className="flex items-center gap-2"
          >
            <Icons.Download className="w-4 h-4" />
            Import from Canva
          </Button>
          <Button
            variant="outline"
            onClick={handleExportToCanva}
            className="flex items-center gap-2"
          >
            <Icons.Upload className="w-4 h-4" />
            Export to Canva
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Icons.Palette className="w-6 h-6 text-[#00C4CC]" />
                  <h2 className="text-xl font-semibold">Connect to Canva</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLoginModal(false)}
                >
                  <Icons.X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={credentials.email}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Connect</Button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <a
                  href="https://www.canva.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Don't have a Canva account? Sign up
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
