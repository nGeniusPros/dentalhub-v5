import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X as XIcon, Download as DownloadIcon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { saveAs } from 'file-saver';
import type { Staff } from '../types/models';
import { z } from 'zod';

// Validation schemas
const DateRangeSchema = z.enum(['all', 'today', 'week', 'month', 'quarter', 'year', 'custom']);

const CustomDateRangeSchema = z.object({
  start: z.string(),
  end: z.string()
});

const ExportOptionsSchema = z.object({
  includeCharts: z.boolean(),
  includeTables: z.boolean(),
  dateRange: DateRangeSchema,
  sections: z.object({
    overview: z.boolean(),
    details: z.boolean(),
    metrics: z.boolean(),
    trends: z.boolean()
  }),
  customDateRange: CustomDateRangeSchema
});

const ExportFormatSchema = z.enum(['pdf', 'excel', 'csv']);

/**
 * Properties for the ExportReportDialog component.
 * @template T - The type of data being exported ('staff', 'performance', 'training', or 'financial').
 */
export interface ExportReportDialogProps<T extends 'staff' | 'performance' | 'training' | 'financial'> {
  /**
   * Whether the dialog is open.
   */
  isOpen: boolean;
  /**
   * Callback function to close the dialog.
   */
  onClose: () => void;
  /**
   * Callback function to handle the export action.
   * @param {string} format - The format to export the report in.
   * @param {z.infer<typeof ExportOptionsSchema>} options - The export options.
   */
  onExport: (format: string, options: z.infer<typeof ExportOptionsSchema>) => void;
  /**
   * Optional data to be exported.
   */
  data?: T extends 'staff' ? Staff[] | undefined : any;
  /**
   * The type of report to export.
   */
  type?: T;
}

/**
 * A dialog component that allows users to export reports.
 * @template T - The type of data being exported ('staff', 'performance', 'training', or 'financial').
 * @param {ExportReportDialogProps<T>} props - The component props.
 * @returns {JSX.Element | null} The ExportReportDialog component.
 */
const ExportReportDialog = <T extends 'staff' | 'performance' | 'training' | 'financial'>({
  isOpen,
  onClose,
  onExport,
  data,
  type = 'staff' as T
}: ExportReportDialogProps<T>) => {
  const [format, setFormat] = useState<z.infer<typeof ExportFormatSchema>>('pdf');
  const [options, setOptions] = useState<z.infer<typeof ExportOptionsSchema>>({
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

  /**
   * Handles the export action.
   */
  const handleExport = () => {
    try {
      // Validate format
      const validatedFormat = ExportFormatSchema.parse(format);

      // Validate options
      const validatedOptions = ExportOptionsSchema.parse(options);

      // Generate filename based on type and date
      const date = new Date().toISOString().split('T')[0];
      const filename = `${type}-report-${date}`;

      // Process data based on selected options
      const exportData = {
        ...data,
        generatedAt: new Date().toISOString(),
        options: validatedOptions
      };

      // Export based on format
      switch (validatedFormat) {
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
          if (data && Array.isArray(data) && data.length > 0) {
            const csvContent = 'data:text/csv;charset=utf-8,' + 
              Object.keys(data[0]).join(',') + '\n' +
              data.map((row: any) => 
                Object.values(row).join(',')
              ).join('\n');

            const encodedUri = encodeURI(csvContent);
            saveAs(encodedUri, `${filename}.csv`);
          } else {
            throw new Error('No data available for CSV export');
          }
          break;
      }

      onExport(validatedFormat, validatedOptions);
      onClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        // In production, you would show these errors to the user
      } else {
        console.error('Export error:', error);
      }
    }
  };

  /**
   * Handles the date range change.
   * @param {string} value - The selected date range value.
   */
  const handleDateRangeChange = (value: string) => {
    try {
      const validatedDateRange = DateRangeSchema.parse(value);
      setOptions(prev => ({ ...prev, dateRange: validatedDateRange }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid date range:', error.errors);
      }
    }
  };

  /**
   * Handles the custom date change.
   * @param {'start' | 'end'} field - The field to update ('start' or 'end').
   * @param {string} value - The selected date value.
   */
  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    try {
      const validatedDate = z.string().datetime().optional().parse(value);
      setOptions(prev => ({
        ...prev,
        customDateRange: {
          ...prev.customDateRange,
          [field]: validatedDate || ''
        }
      }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`Invalid ${field} date:`, error.errors);
      }
    }
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
              <XIcon className="w-5 h-5" aria-hidden="true" />
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
              onChange={(e) => setFormat(e.target.value as z.infer<typeof ExportFormatSchema>)}
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
              onChange={(e) => handleDateRangeChange(e.target.value)}
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
                    onChange={(e) => handleCustomDateChange('start', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={options.customDateRange.end}
                    onChange={(e) => handleCustomDateChange('end', e.target.value)}
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
            <DownloadIcon className="w-4 h-4 mr-2" aria-hidden="true" />
            Export Report
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExportReportDialog;