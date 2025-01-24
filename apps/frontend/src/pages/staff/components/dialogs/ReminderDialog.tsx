import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    id: string;
    name: string;
  } | null;
}

interface ReminderForm {
  type: 'appointment' | 'medication' | 'followup';
  date: string;
  time: string;
  notes: string;
}

export const ReminderDialog: React.FC<ReminderDialogProps> = ({ isOpen, onClose, patient }) => {
  const [form, setForm] = React.useState<ReminderForm>({
    type: 'appointment',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    // TODO: Implement reminder submission logic
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {patient && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Icons.User className="h-4 w-4" />
              <span>For: {patient.name}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={form.type}
              onValueChange={(value: 'appointment' | 'medication' | 'followup') => 
                setForm(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="medication">Medication</SelectItem>
                <SelectItem value="followup">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!patient}>
              <Icons.Bell className="h-4 w-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
