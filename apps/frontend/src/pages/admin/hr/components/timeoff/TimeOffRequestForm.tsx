import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { TimeOffRequest } from '../../../../../types/timeOff';

interface TimeOffRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<TimeOffRequest>) => void;
}

export const TimeOffRequestForm: React.FC<TimeOffRequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [request, setRequest] = useState<Partial<TimeOffRequest>>({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(request);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">New Time Off Request</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type of Leave
            </label>
            <select
              value={request.type}
              onChange={(e) => setRequest(prev => ({ 
                ...prev, 
                type: e.target.value as TimeOffRequest['type']
              }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              required
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Time</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={request.startDate}
                onChange={(e) => setRequest(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={request.endDate}
                onChange={(e) => setRequest(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                min={request.startDate || new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <textarea
              value={request.reason}
              onChange={(e) => setRequest(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={4}
              placeholder="Please provide a reason for your request..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};