import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import type { EmailProvider } from '../../types/email';

interface EmailProviderDropdownProps {
  providers: EmailProvider[];
  selectedProvider: EmailProvider | null;
  onConnect: (provider: EmailProvider, apiKey: string) => void;
}

export const EmailProviderDropdown: React.FC<EmailProviderDropdownProps> = ({
  providers,
  selectedProvider,
  onConnect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedForConnect, setSelectedForConnect] = useState<EmailProvider | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleProviderSelect = (provider: EmailProvider) => {
    setSelectedForConnect(provider);
    setShowConnectModal(true);
    setIsOpen(false);
  };

  const handleConnect = () => {
    if (selectedForConnect && apiKey) {
      onConnect(selectedForConnect, apiKey);
      setShowConnectModal(false);
      setApiKey('');
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Icons.Mail className="w-4 h-4" />
        {selectedProvider ? selectedProvider.name : 'Select Provider'}
        <Icons.ChevronDown className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleProviderSelect(provider)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
              >
                {React.createElement(Icons[provider.icon as keyof typeof Icons], {
                  className: "w-5 h-5 text-gray-500"
                })}
                <span>{provider.name}</span>
                {provider.connected && (
                  <Icons.Check className="w-4 h-4 text-green-500 ml-auto" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Connect to {selectedForConnect?.name}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConnectModal(false)}
                >
                  <Icons.X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter your API key"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConnectModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleConnect} disabled={!apiKey}>
                    Connect
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};