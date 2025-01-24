```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';
import type { Badge } from '../../../../../types/learning';

interface AddBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (badge: Badge) => void;
}

export const AddBadgeModal: React.FC<AddBadgeModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [badge, setBadge] = useState<Partial<Badge>>({
    name: '',
    description: '',
    icon: 'Award',
    color: 'primary',
    points: 0,
    unlocked: false,
    requirements: []
  });

  const iconOptions = [
    { value: 'Award', label: 'Award' },
    { value: 'Star', label: 'Star' },
    { value: 'Trophy', label: 'Trophy' },
    { value: 'Medal', label: 'Medal' },
    { value: 'Crown', label: 'Crown' },
    { value: 'Shield', label: 'Shield' },
    { value: 'Target', label: 'Target' },
    { value: 'Flag', label: 'Flag' }
  ];

  const colorOptions = [
    { value: 'primary', label: 'Primary' },
    { value: 'purple', label: 'Purple' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'red', label: 'Red' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (badge.name && badge.description) {
      onAdd({
        ...badge,
        id: Date.now().toString(),
        unlocked: false,
        requirements: badge.requirements || []
      } as Badge);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create New Badge</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Badge Preview */}
          <div className="flex justify-center mb-6">
            <div className={cn(
              "w-24 h-24 rounded-xl flex items-center justify-center",
              `bg-${badge.color}/10`
            )}>
              {React.createElement(Icons[badge.icon as keyof typeof Icons], {
                className: cn(
                  "w-12 h-12",
                  `text-${badge.color}`
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Badge Name
              </label>
              <input
                type="text"
                value={badge.name}
                onChange={(e) => setBadge({ ...badge, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={badge.description}
                onChange={(e) => setBadge({ ...badge, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={badge.icon}
                onChange={(e) => setBadge({ ...badge, icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select
                value={badge.color}
                onChange={(e) => setBadge({ ...badge, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                required
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points Value
              </label>
              <input
                type="number"
                value={badge.points}
                onChange={(e) => setBadge({ ...badge, points: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                min={0}
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <div className="space-y-2">
              {badge.requirements?.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => {
                      const newRequirements = [...(badge.requirements || [])];
                      newRequirements[index] = e.target.value;
                      setBadge({ ...badge, requirements: newRequirements });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter requirement..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBadge({
                        ...badge,
                        requirements: badge.requirements?.filter((_, i) => i !== index)
                      });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icons.X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setBadge({
                    ...badge,
                    requirements: [...(badge.requirements || []), '']
                  });
                }}
              >
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!badge.name || !badge.description}
            >
              Create Badge
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
```