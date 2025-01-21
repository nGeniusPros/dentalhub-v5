import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map(category => {
        const Icon = Icons[category.icon as keyof typeof Icons] || Icons.Box;
        const isSelected = selected === category.id;

        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
              ${isSelected
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }
              border border-gray-200 transition-colors
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{category.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};