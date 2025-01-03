import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { useNotifications } from '../../../../../contexts/NotificationContext';
import type { Review } from '../PerformanceReviews';

interface ScheduleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (review: Review) => void;
}

export const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule
}) => {
  const [formData, setFormData] = useState({
    employee: '',
    position: '',
    reviewDate: '',
    lastReview: ''
  });

  const { dispatch: notifyDispatch } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled',
      rating: 0
    };
    
    // Create notification for the employee
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'review',
        title: 'Performance Review Scheduled',
        message: `Your performance review has been scheduled for ${formData.reviewDate}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high',
        link: '/staff-dashboard/reviews',
        metadata: {
          reviewId: newReview.id,
          reviewDate: formData.reviewDate
        }
      }
    });

    onSchedule(newReview);
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
            <h2 className="text-xl font-semibold">Schedule Performance Review</h2>
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
              value={formData.employee}
              onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Date
            </label>
            <input
              type="date"
              value={formData.reviewDate}
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Review Date
            </label>
            <input
              type="date"
              value={formData.lastReview}
              onChange={(e) => setFormData({ ...formData, lastReview: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Review
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};