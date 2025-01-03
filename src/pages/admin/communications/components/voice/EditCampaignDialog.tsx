import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { Campaign } from './VoiceCampaignList';

interface EditCampaignDialogProps {
  open: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

export const EditCampaignDialog: React.FC<EditCampaignDialogProps> = ({
  open,
  campaign,
  onClose,
  onSave
}) => {
  const [editedCampaign, setEditedCampaign] = useState<Campaign | null>(campaign);

  if (!open || !campaign || !editedCampaign) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedCampaign);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Edit Campaign</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={editedCampaign.name}
              onChange={(e) => setEditedCampaign(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Type
            </label>
            <select
              value={editedCampaign.type}
              onChange={(e) => setEditedCampaign(prev => prev ? { 
                ...prev, 
                type: e.target.value as Campaign['type']
              } : null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="recall">Recall</option>
              <option value="reactivation">Reactivation</option>
              <option value="treatment">Treatment</option>
              <option value="appointment">Appointment</option>
              <option value="event">Event</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Count
            </label>
            <input
              type="number"
              value={editedCampaign.targetCount}
              onChange={(e) => setEditedCampaign(prev => prev ? { 
                ...prev, 
                targetCount: parseInt(e.target.value) 
              } : null)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              min={1}
              required
            />
          </div>

          {editedCampaign.schedule && (
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editedCampaign.schedule.startDate}
                    onChange={(e) => setEditedCampaign(prev => prev ? {
                      ...prev,
                      schedule: { ...prev.schedule!, startDate: e.target.value }
                    } : null)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={editedCampaign.schedule.startTime}
                    onChange={(e) => setEditedCampaign(prev => prev ? {
                      ...prev,
                      schedule: { ...prev.schedule!, startTime: e.target.value }
                    } : null)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};