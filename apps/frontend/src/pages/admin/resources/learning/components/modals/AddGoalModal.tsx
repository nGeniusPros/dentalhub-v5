```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'personal' | 'team' | 'department';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  targetValue?: number;
  currentValue?: number;
  metrics?: Array<{
    name: string;
    target: number;
    unit: string;
  }>;
  milestones?: Array<{
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  }>;
  rewards?: Array<{
    type: 'points' | 'badge' | 'certificate';
    value: number | string;
  }>;
  assignees?: string[];
  status: 'not_started' | 'in_progress' | 'completed';
  tags?: string[];
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Goal) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [goal, setGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    category: '',
    type: 'personal',
    priority: 'medium',
    status: 'not_started',
    metrics: [],
    milestones: [],
    rewards: [],
    tags: []
  });

  const [currentMetric, setCurrentMetric] = useState({
    name: '',
    target: 0,
    unit: ''
  });

  const [currentMilestone, setCurrentMilestone] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [currentReward, setCurrentReward] = useState({
    type: 'points' as const,
    value: ''
  });

  if (!isOpen) return null;

  const handleAddMetric = () => {
    if (currentMetric.name && currentMetric.target) {
      setGoal(prev => ({
        ...prev,
        metrics: [...(prev.metrics || []), currentMetric]
      }));
      setCurrentMetric({ name: '', target: 0, unit: '' });
    }
  };

  const handleAddMilestone = () => {
    if (currentMilestone.title && currentMilestone.dueDate) {
      setGoal(prev => ({
        ...prev,
        milestones: [
          ...(prev.milestones || []),
          { ...currentMilestone, completed: false }
        ]
      }));
      setCurrentMilestone({ title: '', description: '', dueDate: '' });
    }
  };

  const handleAddReward = () => {
    if (currentReward.value) {
      setGoal(prev => ({
        ...prev,
        rewards: [...(prev.rewards || []), currentReward]
      }));
      setCurrentReward({ type: 'points', value: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.title && goal.description) {
      onAdd({
        ...goal,
        id: Date.now().toString(),
        status: 'not_started',
        metrics: goal.metrics || [],
        milestones: goal.milestones || [],
        rewards: goal.rewards || [],
        tags: goal.tags || []
      } as Goal);
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
            <h2 className="text-xl font-semibold">Create Learning Goal</h2>
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
                Goal Title
              </label>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => setGoal({ ...goal, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={goal.description}
                onChange={(e) => setGoal({ ...goal, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={goal.category}
                onChange={(e) => setGoal({ ...goal, category: e.target.value })}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Type
              </label>
              <select
                value={goal.type}
                onChange={(e) => setGoal({ ...goal, type: e.target.value as Goal['type'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="personal">Personal Goal</option>
                <option value="team">Team Goal</option>
                <option value="department">Department Goal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={goal.priority}
                onChange={(e) => setGoal({ ...goal, priority: e.target.value as Goal['priority'] })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={goal.deadline}
                onChange={(e) => setGoal({ ...goal, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Metrics */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Success Metrics
              </label>
              <Button
                type="button"
                onClick={handleAddMetric}
                disabled={!currentMetric.name || !currentMetric.target}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Metric
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  value={currentMetric.name}
                  onChange={(e) => setCurrentMetric({
                    ...currentMetric,
                    name: e.target.value
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Metric name"
                />
                <input
                  type="number"
                  value={currentMetric.target}
                  onChange={(e) => setCurrentMetric({
                    ...currentMetric,
                    target: parseInt(e.target.value)
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Target value"
                />
                <input
                  type="text"
                  value={currentMetric.unit}
                  onChange={(e) => setCurrentMetric({
                    ...currentMetric,
                    unit: e.target.value
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Unit (e.g., hours, points)"
                />
              </div>
              <div className="space-y-2">
                {goal.metrics?.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-sm text-gray-500">
                        Target: {metric.target} {metric.unit}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGoal({
                        ...goal,
                        metrics: goal.metrics?.filter((_, i) => i !== index)
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

          {/* Milestones */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Milestones
              </label>
              <Button
                type="button"
                onClick={handleAddMilestone}
                disabled={!currentMilestone.title || !currentMilestone.dueDate}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={currentMilestone.title}
                  onChange={(e) => setCurrentMilestone({
                    ...currentMilestone,
                    title: e.target.value
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Milestone title"
                />
                <input
                  type="date"
                  value={currentMilestone.dueDate}
                  onChange={(e) => setCurrentMilestone({
                    ...currentMilestone,
                    dueDate: e.target.value
                  })}
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                  min={new Date().toISOString().split('T')[0]}
                />
                <div className="col-span-2">
                  <textarea
                    value={currentMilestone.description}
                    onChange={(e) => setCurrentMilestone({
                      ...currentMilestone,
                      description: e.target.value
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Milestone description"
                    rows={2}
                  />
                </div>
              </div>
              <div className="space-y-2">
                {goal.milestones?.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-gray-500">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {milestone.description}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setGoal({
                        ...goal,
                        milestones: goal.milestones?.filter((_, i) => i !== index)
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
                {goal.rewards?.map((reward, index) => (
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
                      onClick={() => setGoal({
                        ...goal,
                        rewards: goal.rewards?.filter((_, i) => i !== index)
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

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {goal.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setGoal({
                      ...goal,
                      tags: goal.tags?.filter((_, i) => i !== index)
                    })}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Icons.X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag..."
                className="px-3 py-1 border border-gray-200 rounded-full text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value && !goal.tags?.includes(value)) {
                      setGoal({
                        ...goal,
                        tags: [...(goal.tags || []), value]
                      });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!goal.title || !goal.description}
            >
              Create Goal
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
```