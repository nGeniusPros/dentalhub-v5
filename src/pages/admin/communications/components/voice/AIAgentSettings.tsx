import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { Toggle } from '../../../../../components/ui/toggle';

interface AIAgentSettingsProps {
  open: boolean;
  onClose: () => void;
}

export const AIAgentSettings: React.FC<AIAgentSettingsProps> = ({
  open,
  onClose
}) => {
  const [settings, setSettings] = useState({
    enabled: true,
    afterHours: true,
    lunchHours: true,
    holidays: true,
    customSchedule: false,
    schedule: {
      monday: { start: '17:00', end: '09:00' },
      tuesday: { start: '17:00', end: '09:00' },
      wednesday: { start: '17:00', end: '09:00' },
      thursday: { start: '17:00', end: '09:00' },
      friday: { start: '17:00', end: '09:00' },
      saturday: { start: '00:00', end: '23:59' },
      sunday: { start: '00:00', end: '23:59' }
    },
    customMessage: ''
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">AI Voice Agent Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable AI Voice Agent</h3>
              <p className="text-sm text-gray-500">Allow AI to handle incoming calls</p>
            </div>
            <Toggle
              checked={settings.enabled}
              onChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Automatic Handling */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Automatic Call Handling</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">After Hours</span>
                <Toggle
                  checked={settings.afterHours}
                  onChange={(checked) => setSettings(prev => ({ ...prev, afterHours: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Lunch Hours</span>
                <Toggle
                  checked={settings.lunchHours}
                  onChange={(checked) => setSettings(prev => ({ ...prev, lunchHours: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Holidays</span>
                <Toggle
                  checked={settings.holidays}
                  onChange={(checked) => setSettings(prev => ({ ...prev, holidays: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Custom Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Custom Schedule</h3>
              <Toggle
                checked={settings.customSchedule}
                onChange={(checked) => setSettings(prev => ({ ...prev, customSchedule: checked }))}
              />
            </div>
            {settings.customSchedule && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.schedule).map(([day, hours]) => (
                  <div key={day} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{day}</span>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Start</label>
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              [day]: { ...hours, start: e.target.value }
                            }
                          }))}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">End</label>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            schedule: {
                              ...prev.schedule,
                              [day]: { ...hours, end: e.target.value }
                            }
                          }))}
                          className="px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Custom Message Request</h3>
            <div className="space-y-2">
              <textarea
                value={settings.customMessage}
                onChange={(e) => setSettings(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Describe your custom message requirements for the AI agent..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg h-32 resize-none"
              />
              <p className="text-sm text-gray-500">
                Your request will be sent to Ngenius support for review and implementation.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </motion.div>
    </div>
  );
};