import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import type { LearningPath } from '../../../../../types/learning';

interface AddPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (path: LearningPath) => void;
}

export const AddPathModal: React.FC<AddPathModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [path, setPath] = useState<Partial<LearningPath>>({
    name: '',
    description: '',
    category: '',
    progress: 0,
    milestones: [],
    rewards: []
  });

  const [currentMilestone, setCurrentMilestone] = useState({
    title: '',
    completed: false
  });

  const [currentReward, setCurrentReward] = useState({
    type: 'points' as const,
    value: ''
  });

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (currentMilestone.title) {
      setPath(prev => ({
        ...prev,
        milestones: [
          ...(prev.milestones || []),
          { ...currentMilestone, id: Date.now().toString() }
        ]
      }));
      setCurrentMilestone({ title: '', completed: false });
    }
  };

  const handleAddReward = () => {
    if (currentReward.value) {
      setPath(prev => ({
        ...prev,
        rewards: [
          ...(prev.rewards || []),
          { ...currentReward }
        ]
      }));
      setCurrentReward({ type: 'points', value: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (path.name && path.description) {
      onAdd({
        ...path,
        id: Date.now().toString(),
        progress: 0,
        milestones: path.milestones || [],
        rewards: path.rewards || []
      } as LearningPath);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create Learning Path</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Path Name
              </label>
              <input
                type="text"
                value={path.name}
                onChange={(e) => setPath({ ...path, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={path.description}
                onChange={(e) => setPath({ ...path, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={path.category}
                onChange={(e) => setPath({ ...path, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="">Select category...</option>
                <option value="clinical">Clinical Skills</option>
                <option value="professional">Professional Development</option>
                <option value="compliance">Compliance</option>
                <option value="leadership">Leadership</option>
                <option value="technical">Technical Skills</option>
              </select>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Milestones
              </label>
              <Button
                type="button"
                onClick={handleAddMilestone}
                disabled={!currentMilestone.title}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={currentMilestone.title}
                onChange={(e) => setCurrentMilestone({
                  ...currentMilestone,
                  title: e.target.value
                })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                placeholder="Enter milestone title..."
              />
              <div className="space-y-2">
                {path.milestones?.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span>{milestone.title}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPath({
                        ...path,
                        milestones: path.milestones?.filter((_, i) => i !== index)
                      })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rewards */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Rewards
              </label>
              <Button
                type="button"
                onClick={handleAddReward}
                disabled={!currentReward.value}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Reward
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={currentReward.type}
                  onChange={(e) => setCurrentReward({
                    ...currentReward,
                    type: e.target.value as 'points' | 'badge' | 'certificate'
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="points">Points</option>
                  <option value="badge">Badge</option>
                  <option value="certificate">Certificate</option>
                </select>
                <input
                  type={currentReward.type === 'points' ? 'number' : 'text'}
                  value={currentReward.value}
                  onChange={(e) => setCurrentReward({
                    ...currentReward,
                    value: e.target.value
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder={currentReward.type === 'points' ? 'Points value' : 'Reward name'}
                />
              </div>
              <div className="space-y-2">
                {path.rewards?.map((reward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      {reward.type === 'points' && <Icons.Award className="w-4 h-4 text-yellow-500" />}
                      {reward.type === 'badge' && <Icons.Shield className="w-4 h-4 text-blue-500" />}
                      {reward.type === 'certificate' && <Icons.FileCheck className="w-4 h-4 text-green-500" />}
                      <span>
                        {reward.type === 'points' 
                          ? `${reward.value} points` 
                          : reward.value}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPath({
                        ...path,
                        rewards: path.rewards?.filter((_, i) => i !== index)
                      })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Icons.Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!path.name || !path.description}
            >
              Create Learning Path
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};