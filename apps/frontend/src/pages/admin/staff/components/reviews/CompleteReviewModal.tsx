import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import type { Review } from '../PerformanceReviews';

interface CompleteReviewModalProps {
  isOpen: boolean;
  review: Review | undefined;
  onClose: () => void;
  onComplete: (completedReview: Partial<Review>) => void;
}

export const CompleteReviewModal: React.FC<CompleteReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onComplete
}) => {
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: '',
    goals: [''],
    strengths: [''],
    improvements: ['']
  });

  if (!isOpen || !review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      goals: formData.goals.filter(Boolean),
      strengths: formData.strengths.filter(Boolean),
      improvements: formData.improvements.filter(Boolean)
    });
  };

  const handleArrayInput = (
    field: 'goals' | 'strengths' | 'improvements',
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'goals' | 'strengths' | 'improvements') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'goals' | 'strengths' | 'improvements', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Complete Performance Review</h2>
              <p className="text-sm text-gray-500">{review.employee} - {review.position}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`p-2 rounded-full ${
                    formData.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Icons.Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback
            </label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              rows={4}
              required
            />
          </div>

          {/* Goals Section */}
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
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleArrayInput('goals', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
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
              {formData.strengths.map((strength, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={strength}
                    onChange={(e) => handleArrayInput('strengths', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
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

          {/* Areas for Improvement Section */}
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
              {formData.improvements.map((improvement, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={improvement}
                    onChange={(e) => handleArrayInput('improvements', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Complete Review
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};