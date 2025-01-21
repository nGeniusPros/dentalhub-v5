import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { saveAs } from 'file-saver';

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const GenerateReportDialog: React.FC<GenerateReportDialogProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [reportConfig, setReportConfig] = useState({
    format: 'pdf',
    sections: {
      overview: true,
      financial: true,
      patients: true,
      treatments: true,
      staff: true,
      appointments: true,
      marketing: true
    },
    dateRange: 'month',
    customDateRange: {
      start: '',
      end: ''
    },
    includeCharts: true,
    includeComparisons: true
  });

  if (!isOpen) return null;

  const handleExport = () => {
    // In production, this would generate the actual report
    // For demo, we'll create a CSV of the data
    const csvContent = [
      // Headers
      Object.keys(data.revenueData[0]).join(','),
      // Data rows
      ...data.revenueData.map((row: any) => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `practice-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generate Analytics Report</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Format
            </label>
            <select
              value={reportConfig.format}
              onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="pdf">PDF Report</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV File</option>
            </select>
          </div>

          {/* Report Sections */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Include Sections
            </label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(reportConfig.sections).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setReportConfig(prev => ({
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

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={reportConfig.dateRange}
              onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {reportConfig.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={reportConfig.customDateRange.start}
                    onChange={(e) => setReportConfig(prev => ({
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
                    value={reportConfig.customDateRange.end}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      customDateRange: { ...prev.customDateRange, end: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            )}
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
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    includeCharts: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include Charts and Graphs</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={reportConfig.includeComparisons}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    includeComparisons: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include Year-over-Year Comparisons</span>
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Icons.Download className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
};