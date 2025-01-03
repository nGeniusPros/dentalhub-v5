```typescript
import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import type { LearningPath } from '../../types/learning';

interface LearningPathCardProps {
  path: LearningPath;
  onStart: (pathId: string) => void;
  onViewDetails: (pathId: string) => void;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onStart,
  onViewDetails
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icons.Map className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{path.name}</h3>
            <p className="text-sm text-gray-500">{path.category}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{path.description}</p>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{path.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            {path.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  milestone.completed ? "bg-green-50" : "bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  milestone.completed ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                )}>
                  {milestone.completed ? (
                    <Icons.Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span className="text-sm">{milestone.title}</span>
              </div>
            ))}
          </div>

          {/* Rewards */}
          {path.rewards.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards</h4>
              <div className="flex flex-wrap gap-2">
                {path.rewards.map((reward, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      reward.unlockedAt ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {reward.type === 'badge' && <Icons.Award className="w-3 h-3" />}
                    {reward.type === 'certificate' && <Icons.FileCheck className="w-3 h-3" />}
                    {reward.type === 'points' && <Icons.Star className="w-3 h-3" />}
                    {reward.type === 'points' ? `${reward.value} Points` : reward.value}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onViewDetails(path.id)}
            >
              <Icons.Info className="w-4 h-4 mr-2" />
              Details
            </Button>
            <Button
              className="flex-1"
              onClick={() => onStart(path.id)}
            >
              {path.progress === 0 ? (
                <>
                  <Icons.Play className="w-4 h-4 mr-2" />
                  Start Path
                </>
              ) : (
                <>
                  <Icons.ArrowRight className="w-4 h-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
```