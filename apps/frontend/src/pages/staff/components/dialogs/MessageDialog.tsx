import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    id: string;
    name: string;
  } | null;
}

export const MessageDialog: React.FC<MessageDialogProps> = ({ isOpen, onClose, patient }) => {
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    if (!message.trim() || !patient) return;
    // TODO: Implement message sending logic
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          {patient && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Icons.User className="h-4 w-4" />
              <span>To: {patient.name}</span>
            </div>
          )}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!message.trim() || !patient}>
              <Icons.Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
