import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';

interface RequestRecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: any) => void;
}

export const RequestRecruiterModal: React.FC<RequestRecruiterModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    positionType: '',
    urgency: 'normal',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    contactMethod: 'video'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              <h2 className="text-xl font-semibold">Schedule Recruiter Consultation</h2>
              <p className="text-sm text-gray-500">Connect with a professional NGenius recruiter</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Type
            </label>
            <select
              value={formData.positionType}
              onChange={(e) => setFormData({ ...formData, positionType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            >
              <option value="">Select position type...</option>
              <option value="dentist">Dentist</option>
              <option value="hygienist">Hygienist</option>
              <option value="assistant">Dental Assistant</option>
              <option value="frontDesk">Front Desk Staff</option>
              <option value="manager">Office Manager</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Urgency Level
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="immediate">Immediate</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Time
              </label>
              <input
                type="time"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Method
            </label>
            <select
              value={formData.contactMethod}
              onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            >
              <option value="video">Video Call</option>
              <option value="phone">Phone Call</option>
              <option value="inPerson">In-Person Meeting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={4}
              placeholder="Any specific requirements or questions..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Consultation
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};