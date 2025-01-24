import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

interface AddShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shift: any) => void;
}

export const AddShiftModal: React.FC<AddShiftModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [shift, setShift] = useState({
    employeeName: '',
    role: '',
    startTime: '',
    endTime: '',
    date: '',
    status: 'scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(shift);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Shift</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name
            </label>
            <input
              type="text"
              value={shift.employeeName}
              onChange={(e) => setShift({ ...shift, employeeName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={shift.role}
              onChange={(e) => setShift({ ...shift, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={shift.startTime}
                onChange={(e) => setShift({ ...shift, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={shift.endTime}
                onChange={(e) => setShift({ ...shift, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={shift.date}
              onChange={(e) => setShift({ ...shift, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Shift
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};