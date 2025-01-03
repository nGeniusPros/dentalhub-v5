import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import type { PayrollProvider } from './types';

interface PayrollProviderSelectorProps {
  selectedProvider: PayrollProvider | null;
  onSelect: (provider: PayrollProvider) => void;
}

export const PayrollProviderSelector: React.FC<PayrollProviderSelectorProps> = ({
  selectedProvider,
  onSelect
}) => {
  const providers: PayrollProvider[] = [
    {
      id: 'quickbooks',
      name: 'QuickBooks Payroll',
      icon: 'DollarSign',
      description: 'Full-service payroll with automatic tax filing',
      connected: true
    },
    {
      id: 'paychex',
      name: 'Paychex',
      icon: 'Briefcase',
      description: 'Comprehensive payroll and HR solutions',
      connected: true
    },
    {
      id: 'adp',
      name: 'ADP',
      icon: 'Building',
      description: 'Enterprise payroll and workforce management',
      connected: false
    },
    {
      id: 'gusto',
      name: 'Gusto',
      icon: 'Users',
      description: 'Modern payroll, benefits, and HR platform',
      connected: false
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select Payroll Provider</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <motion.button
            key={provider.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelect(provider)}
            className={cn(
              "p-6 rounded-xl border-2 text-left transition-colors",
              selectedProvider?.id === provider.id
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-lg",
                provider.connected ? "bg-primary/10" : "bg-gray-100"
              )}>
                {React.createElement(Icons[provider.icon as keyof typeof Icons], {
                  className: cn(
                    "w-6 h-6",
                    provider.connected ? "text-primary" : "text-gray-400"
                  )
                })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{provider.name}</h4>
                  {provider.connected ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Connected
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      Not Connected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};