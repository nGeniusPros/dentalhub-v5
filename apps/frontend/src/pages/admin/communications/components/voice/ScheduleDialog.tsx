import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { Campaign } from './VoiceCampaignList';

interface ScheduleDialogProps {
  open: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSchedule: (schedule: Campaign['schedule']) => void;
}

export const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  campaign,
  onClose,
  onSchedule
}) => {
  const [schedule, setSchedule] = useState({
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    maxAttempts: 3,
    timeBetweenAttempts: 2
  });

  if (!open || !campaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(schedule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Schedule Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-4">{campaign.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={schedule.startDate}
                  onChange={(e) => setSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Start Time</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">Call Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Maximum Attempts</label>
                <select
                  value={schedule.maxAttempts}
                  onChange={(e) => setSchedule(prev => ({ ...prev, maxAttempts: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value={1}>1 attempt</option>
                  <option value={2}>2 attempts</option>
                  <option value={3}>3 attempts</option>
                  <option value={4}>4 attempts</option>
                  <option value={5}>5 attempts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Time Between Attempts</label>
                <select
                  value={schedule.timeBetweenAttempts}
                  onChange={(e) => setSchedule(prev => ({ ...prev, timeBetweenAttempts: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={8}>8 hours</option>
                  <option value={24}>24 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Campaign
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};