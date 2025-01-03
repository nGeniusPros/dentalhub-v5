import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [format, setFormat] = useState('csv');
  const [options, setOptions] = useState({
    sections: {
      staff: true,
      payroll: false,
      timeOff: true,
      performance: false,
      recruitment: false
    },
    dateRange: 'all',
    includePersonalInfo: false,
    includeSensitiveData: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(format, options);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Export HR Data</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          {/* Sections to Export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sections to Export
            </label>
            <div className="space-y-2">
              {Object.entries(options.sections).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        [key]: e.target.checked
                      }
                    }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={options.dateRange}
              onChange={(e) => setOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="year">Past Year</option>
              <option value="quarter">Past Quarter</option>
              <option value="month">Past Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Additional Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includePersonalInfo}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includePersonalInfo: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include Personal Information</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeSensitiveData}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeSensitiveData: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include Sensitive Data</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-navy to-purple text-white"
            >
              <Icons.Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};