import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from './ui/button';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (reminder: any) => void;
  recipient: {
    name: string;
    appointment?: {
      date: string;
      time: string;
      type: string;
    };
  };
}

export const ReminderDialog: React.FC<ReminderDialogProps> = ({
  isOpen,
  onClose,
  onSend,
  recipient
}) => {
  const [reminder, setReminder] = useState({
    method: 'sms',
    message: '',
    sendNow: true,
    scheduledTime: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(reminder);
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
            <div>
              <h2 className="text-xl font-semibold">Send Reminder</h2>
              <p className="text-sm text-gray-500">To: {recipient.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reminder Method
            </label>
            <select
              value={reminder.method}
              onChange={(e) => setReminder(prev => ({ ...prev, method: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="both">Both SMS & Email</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={reminder.message}
              onChange={(e) => setReminder(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={4}
              placeholder={`Hi ${recipient.name}, this is a reminder about your upcoming appointment...`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={reminder.sendNow}
                onChange={() => setReminder(prev => ({ ...prev, sendNow: true }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Send Now</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={!reminder.sendNow}
                onChange={() => setReminder(prev => ({ ...prev, sendNow: false }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Schedule for Later</span>
            </label>
          </div>

          {!reminder.sendNow && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule Time
              </label>
              <input
                type="datetime-local"
                value={reminder.scheduledTime}
                onChange={(e) => setReminder(prev => ({ ...prev, scheduledTime: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Send Reminder
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};