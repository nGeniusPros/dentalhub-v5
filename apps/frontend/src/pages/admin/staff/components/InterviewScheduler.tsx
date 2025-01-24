import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface InterviewSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (details: any) => void;
  candidate?: {
    id: string;
    name: string;
    position: string;
    email: string;
  };
}

export const InterviewScheduler: React.FC<InterviewSchedulerProps> = ({
  isOpen,
  onClose,
  onSchedule,
  candidate
}) => {
  const [details, setDetails] = useState({
    date: '',
    time: '',
    duration: 60,
    type: 'in-person',
    interviewers: [] as string[],
    notes: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Schedule Interview</h2>
              {candidate?.name && <p className="text-sm text-gray-500">with {candidate.name}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={details.date}
                onChange={(e) => setDetails(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={details.time}
                onChange={(e) => setDetails(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              value={details.duration}
              onChange={(e) => setDetails(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interview Type
            </label>
            <select
              value={details.type}
              onChange={(e) => setDetails(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="in-person">In Person</option>
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interviewers
            </label>
            <div className="space-y-2">
              {['Dr. Sarah Wilson', 'Dr. Michael Chen', 'Emily Parker'].map((interviewer) => (
                <label key={interviewer} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={details.interviewers.includes(interviewer)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDetails(prev => ({
                          ...prev,
                          interviewers: [...prev.interviewers, interviewer]
                        }));
                      } else {
                        setDetails(prev => ({
                          ...prev,
                          interviewers: prev.interviewers.filter(i => i !== interviewer)
                        }));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{interviewer}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={details.notes}
              onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={3}
              placeholder="Add any special instructions or notes..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSchedule(details)}>
            Schedule Interview
          </Button>
        </div>
      </motion.div>
    </div>
  );
};