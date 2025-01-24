import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: {
    id: string;
    name: string;
  } | null;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({ isOpen, onClose, patient }) => {
  const [comment, setComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !patient) return;
    // TODO: Implement comment submission logic
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {patient && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Icons.User className="h-4 w-4" />
              <span>Patient: {patient.name}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comment here..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!comment.trim() || !patient}>
              <Icons.MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
