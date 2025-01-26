import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import type { Integration } from "../types";

interface IntegrationModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  integration,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                  {integration.icon ? (
                    <img
                      src={integration.icon}
                      alt={integration.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <Icons.Box className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {integration.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Icons.Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(integration.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({integration.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icons.X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">
                About {integration.name}
              </h3>
              <p className="text-gray-600 mb-6">{integration.description}</p>

              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icons.Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-2">Pricing</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-900 font-medium">
                  {integration.pricing}
                </p>
                <p className="text-sm text-gray-500">
                  Contact sales for enterprise pricing
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Integration Process
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Install the Integration
                    </p>
                    <p className="text-gray-600">
                      Click the Install button to begin setup
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Configure Settings
                    </p>
                    <p className="text-gray-600">
                      Set up your preferences and connect your accounts
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Go Live</p>
                    <p className="text-gray-600">
                      Start using the integrated features in your practice
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button className="flex-1">Start Free Trial</Button>
              <Button variant="outline" className="flex-1">
                <Icons.Phone className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
