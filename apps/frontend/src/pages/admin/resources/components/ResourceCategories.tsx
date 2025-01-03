import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface ResourceCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const ResourceCategories: React.FC<ResourceCategoriesProps> = ({
  selectedCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: 'all', name: 'All Resources', icon: 'LayoutGrid' },
    { id: 'forms', name: 'Forms Library', icon: 'FileText' },
    { id: 'education', name: 'Educational Resources', icon: 'GraduationCap' },
    { id: 'manuals', name: 'Manuals & Guidelines', icon: 'BookOpen' },
    { id: 'training', name: 'Training Materials', icon: 'Lightbulb' },
    { id: 'templates', name: 'Document Templates', icon: 'Files' }, // Changed from FileTemplate to Files
    { id: 'policies', name: 'Policies & Procedures', icon: 'Shield' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
    >
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="space-y-1">
        {categories.map((category) => {
          const Icon = Icons[category.icon as keyof typeof Icons];
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 text-gray-700"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};