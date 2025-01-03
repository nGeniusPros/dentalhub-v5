import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface ViewShiftModalProps {
  shift: any;
  onClose: () => void;
  onUpdate: (shift: any) => void;
  onDelete: (shiftId: string) => void;
}

export const ViewShiftModal: React.FC<ViewShiftModalProps> = ({
  shift,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedShift, setEditedShift] = useState(shift);

  if (!shift) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedShift);
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedShift = { ...shift, status: newStatus };
    onUpdate(updatedShift);
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
            <h2 className="text-xl font-semibold">View Shift</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Name
              </label>
              <input
                type="text"
                value={editedShift.employeeName}
                onChange={(e) => setEditedShift({ ...editedShift, employeeName: e.target.value })}
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
                value={editedShift.role}
                onChange={(e) => setEditedShift({ ...editedShift, role: e.target.value })}
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
                  value={editedShift.startTime}
                  onChange={(e) => setEditedShift({ ...editedShift, startTime: e.target.value })}
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
                  value={editedShift.endTime}
                  onChange={(e) => setEditedShift({ ...editedShift, endTime: e.target.value })}
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
                value={editedShift.date}
                onChange={(e) => setEditedShift({ ...editedShift, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="font-medium">{shift.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{shift.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{shift.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-medium">{shift.startTime} - {shift.endTime}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={shift.status === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('scheduled')}
                >
                  Scheduled
                </Button>
                <Button
                  size="sm"
                  variant={shift.status === 'checked-in' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('checked-in')}
                >
                  Check In
                </Button>
                <Button
                  size="sm"
                  variant={shift.status === 'checked-out' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('checked-out')}
                >
                  Check Out
                </Button>
                <Button
                  size="sm"
                  variant={shift.status === 'absent' ? 'default' : 'outline'}
                  onClick={() => handleStatusChange('absent')}
                >
                  Absent
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Icons.Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(shift.id)}
              >
                <Icons.Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};