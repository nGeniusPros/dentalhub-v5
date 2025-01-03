import React from 'react';
import * as Icons from 'lucide-react';

interface ResourceSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search resources by name, type, or tag..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};