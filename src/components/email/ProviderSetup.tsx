import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import type { EmailProvider } from '../../types/email';

interface ProviderSetupProps {
  providers: EmailProvider[];
  onConnect: (provider: EmailProvider, apiKey: string) => void;
}

export const ProviderSetup: React.FC<ProviderSetupProps> = ({
  providers,
  onConnect
}) => {
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleConnect = () => {
    if (selectedProvider && apiKey) {
      onConnect(selectedProvider, apiKey);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect Email Provider</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {providers.map((provider) => (
          <motion.button
            key={provider.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedProvider(provider)}
            className={`p-6 rounded-xl border ${
              selectedProvider?.id === provider.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            } text-left transition-colors`}
          >
            <div className="flex items-center gap-3">
              {React.createElement(Icons[provider.icon as keyof typeof Icons], {
                className: `w-6 h-6 ${
                  selectedProvider?.id === provider.id ? 'text-primary' : 'text-gray-400'
                }`
              })}
              <span className="font-medium text-gray-900">{provider.name}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {selectedProvider && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="font-medium text-gray-900 mb-4">
            Connect to {selectedProvider.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Enter your API key"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedProvider(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!apiKey}
              >
                Connect Provider
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};