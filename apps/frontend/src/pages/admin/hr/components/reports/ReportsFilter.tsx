import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface ReportsFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters?: any;
}

export const ReportsFilter: React.FC<ReportsFilterProps> = ({
  isOpen,
  onClose,
  onApply,
  currentFilters = {}
}) => {
  const [filters, setFilters] = useState({
    type: [] as string[],
    frequency: [] as string[],
    status: [] as string[],
    dateRange: 'all',
    department: [] as string[],
    customDateRange: {
      start: '',
      end: ''
    }
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
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
            <h2 className="text-xl font-semibold">Filter Reports</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Report Type</h3>
            <div className="space-y-2">
              {[
                'Performance',
                'Attendance',
                'Training',
                'Payroll',
                'Compliance',
                'Custom'
              ].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          type: [...prev.type, type]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          type: prev.type.filter(t => t !== type)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Frequency</h3>
            <div className="space-y-2">
              {[
                'Daily',
                'Weekly',
                'Monthly',
                'Quarterly',
                'Annual',
                'One-time'
              ].map((freq) => (
                <label key={freq} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.frequency.includes(freq)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          frequency: [...prev.frequency, freq]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          frequency: prev.frequency.filter(f => f !== freq)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{freq}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
            <div className="space-y-2">
              {[
                'Scheduled',
                'Generated',
                'Failed',
                'Pending'
              ].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          status: [...prev.status, status]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          status: prev.status.filter(s => s !== status)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
            <div className="space-y-2">
              {[
                'Clinical',
                'Administrative',
                'Management',
                'All Staff'
              ].map((dept) => (
                <label key={dept} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.department.includes(dept)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({
                          ...prev,
                          department: [...prev.department, dept]
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          department: prev.department.filter(d => d !== dept)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.customDateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      customDateRange: {
                        ...prev.customDateRange,
                        start: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.customDateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      customDateRange: {
                        ...prev.customDateRange,
                        end: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setFilters({
                type: [],
                frequency: [],
                status: [],
                dateRange: 'all',
                department: [],
                customDateRange: {
                  start: '',
                  end: ''
                }
              });
            }}
          >
            Reset
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </motion.div>
    </div>
  );
};