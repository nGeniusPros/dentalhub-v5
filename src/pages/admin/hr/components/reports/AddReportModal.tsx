import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import { useNotifications } from '../../../../../contexts/NotificationContext';

interface AddReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (report: any) => void;
}

export const AddReportModal: React.FC<AddReportModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const { dispatch: notifyDispatch } = useNotifications();
  const [report, setReport] = useState({
    name: '',
    description: '',
    type: 'performance',
    frequency: 'monthly',
    metrics: [] as string[],
    filters: [] as string[],
    recipients: [] as string[],
    format: 'pdf',
    schedule: {
      startDate: '',
      time: '',
      repeat: true
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport = {
      ...report,
      id: Date.now().toString(),
      lastGenerated: null,
      nextGeneration: report.schedule.startDate,
      status: 'scheduled'
    };

    onAdd(newReport);

    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Report Created',
        message: `${report.name} has been scheduled successfully`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create New Report</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Name
              </label>
              <input
                type="text"
                value={report.name}
                onChange={(e) => setReport({ ...report, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={report.description}
                onChange={(e) => setReport({ ...report, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={report.type}
                onChange={(e) => setReport({ ...report, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="performance">Performance Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="training">Training Report</option>
                <option value="payroll">Payroll Report</option>
                <option value="compliance">Compliance Report</option>
                <option value="custom">Custom Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency
              </label>
              <select
                value={report.frequency}
                onChange={(e) => setReport({ ...report, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="one-time">One Time</option>
              </select>
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metrics to Include
            </label>
            <div className="space-y-2">
              {[
                'Performance Scores',
                'Attendance Rate',
                'Training Completion',
                'Patient Satisfaction',
                'Revenue Generation',
                'Quality Metrics'
              ].map((metric) => (
                <label key={metric} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={report.metrics.includes(metric)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReport({
                          ...report,
                          metrics: [...report.metrics, metric]
                        });
                      } else {
                        setReport({
                          ...report,
                          metrics: report.metrics.filter(m => m !== metric)
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{metric}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filters
            </label>
            <div className="space-y-2">
              {[
                'Department',
                'Role',
                'Employment Status',
                'Date Range',
                'Performance Level'
              ].map((filter) => (
                <label key={filter} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={report.filters.includes(filter)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReport({
                          ...report,
                          filters: [...report.filters, filter]
                        });
                      } else {
                        setReport({
                          ...report,
                          filters: report.filters.filter(f => f !== filter)
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{filter}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipients
            </label>
            <div className="space-y-2">
              {[
                'HR Manager',
                'Department Heads',
                'Practice Manager',
                'Clinical Director',
                'All Staff'
              ].map((recipient) => (
                <label key={recipient} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={report.recipients.includes(recipient)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setReport({
                          ...report,
                          recipients: [...report.recipients, recipient]
                        });
                      } else {
                        setReport({
                          ...report,
                          recipients: report.recipients.filter(r => r !== recipient)
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{recipient}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={report.schedule.startDate}
                  onChange={(e) => setReport({
                    ...report,
                    schedule: { ...report.schedule, startDate: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={report.schedule.time}
                  onChange={(e) => setReport({
                    ...report,
                    schedule: { ...report.schedule, time: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={report.format}
              onChange={(e) => setReport({ ...report, format: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!report.name || !report.description || report.metrics.length === 0}
            >
              Create Report
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};