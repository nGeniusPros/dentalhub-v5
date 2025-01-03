import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { saveAs } from 'file-saver';

interface ExportReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
  data?: any;
  type?: 'staff' | 'performance' | 'training' | 'financial';
}

export const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  data,
  type = 'staff'
}) => {
  const [format, setFormat] = useState('pdf');
  const [options, setOptions] = useState({
    includeCharts: true,
    includeTables: true,
    dateRange: 'all',
    sections: {
      overview: true,
      details: true,
      metrics: true,
      trends: true
    },
    customDateRange: {
      start: '',
      end: ''
    }
  });

  if (!isOpen) return null;

  const handleExport = () => {
    // Generate filename based on type and date
    const date = new Date().toISOString().split('T')[0];
    const filename = `${type}-report-${date}`;

    // Process data based on selected options
    const exportData = {
      ...data,
      generatedAt: new Date().toISOString(),
      options
    };

    // Export based on format
    switch (format) {
      case 'pdf':
        // In production, this would generate a PDF
        console.log('Exporting PDF:', exportData);
        break;

      case 'excel':
        // In production, this would generate an Excel file
        console.log('Exporting Excel:', exportData);
        break;

      case 'csv':
        // Generate CSV content
        const csvContent = 'data:text/csv;charset=utf-8,' + 
          Object.keys(data[0]).join(',') + '\n' +
          data.map((row: any) => 
            Object.values(row).join(',')
          ).join('\n');

        const encodedUri = encodeURI(csvContent);
        saveAs(encodedUri, `${filename}.csv`);
        break;
    }

    onExport(format, options);
    onClose();
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
            <h2 className="text-xl font-semibold">Export Report</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={options.dateRange}
              onChange={(e) => setOptions(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {options.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={options.customDateRange.start}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      customDateRange: { ...prev.customDateRange, start: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={options.customDateRange.end}
                    onChange={(e) => setOptions(prev => ({
                      ...prev,
                      customDateRange: { ...prev.customDateRange, end: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include in Report
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeCharts}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeCharts: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Charts and Graphs</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={options.includeTables}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeTables: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Data Tables</span>
              </label>
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Sections
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
                  <span className="text-sm capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
};