import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { Employee, PerformanceReview } from '../../../../../types/employee';

interface PerformanceReviewFormProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: PerformanceReview) => void;
  existingReview?: PerformanceReview;
}

export const PerformanceReviewForm: React.FC<PerformanceReviewFormProps> = ({
  employee,
  isOpen,
  onClose,
  onSubmit,
  existingReview
}) => {
  const [review, setReview] = useState<Partial<PerformanceReview>>(
    existingReview || {
      employeeId: employee.id,
      reviewDate: new Date().toISOString().split('T')[0],
      rating: 3,
      strengths: [''],
      improvements: [''],
      goals: [''],
      comments: ''
    }
  );

  const handleArrayInput = (
    field: 'strengths' | 'improvements' | 'goals',
    index: number,
    value: string
  ) => {
    const newArray = [...(review[field] as string[])];
    newArray[index] = value;
    setReview({ ...review, [field]: newArray });
  };

  const addArrayItem = (field: 'strengths' | 'improvements' | 'goals') => {
    setReview({
      ...review,
      [field]: [...(review[field] as string[]), '']
    });
  };

  const removeArrayItem = (field: 'strengths' | 'improvements' | 'goals', index: number) => {
    const newArray = (review[field] as string[]).filter((_, i) => i !== index);
    setReview({ ...review, [field]: newArray });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review.reviewDate || !review.rating) return;

    const newReview: PerformanceReview = {
      id: existingReview?.id || Date.now().toString(),
      employeeId: employee.id,
      reviewDate: review.reviewDate,
      reviewer: 'Current User', // In real app, get from auth context
      rating: review.rating,
      strengths: review.strengths?.filter(s => s.trim()) || [],
      improvements: review.improvements?.filter(i => i.trim()) || [],
      goals: review.goals?.filter(g => g.trim()) || [],
      comments: review.comments || '',
      nextReviewDate: review.nextReviewDate || ''
    };

    onSubmit(newReview);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Performance Review</h2>
              <p className="text-gray-500">{employee.personalInfo.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Date
              </label>
              <input
                type="date"
                value={review.reviewDate}
                onChange={(e) => setReview({ ...review, reviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Next Review Date
              </label>
              <input
                type="date"
                value={review.nextReviewDate}
                onChange={(e) => setReview({ ...review, nextReviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setReview({ ...review, rating })}
                  className={`p-2 rounded-full ${
                    review.rating === rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  <Icons.Star className="w-8 h-8 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Strengths Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Strengths
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('strengths')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Strength
              </Button>
            </div>
            <div className="space-y-2">
              {review.strengths?.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => handleArrayInput('strengths', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter strength..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('strengths', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Areas for Improvement
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('improvements')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Area
              </Button>
            </div>
            <div className="space-y-2">
              {review.improvements?.map((improvement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={improvement}
                    onChange={(e) => handleArrayInput('improvements', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter area for improvement..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('improvements', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Goals
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem('goals')}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
            <div className="space-y-2">
              {review.goals?.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleArrayInput('goals', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter goal..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem('goals', index)}
                  >
                    <Icons.X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Comments
            </label>
            <textarea
              value={review.comments}
              onChange={(e) => setReview({ ...review, comments: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {existingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};