import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';

export const EmailFilter = () => {
  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex-1 relative">
        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search emails..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Icons.Calendar className="w-4 h-4" />
          Date Range
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Icons.Filter className="w-4 h-4" />
          Filters
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Icons.SortAsc className="w-4 h-4" />
          Sort
        </Button>
      </div>
    </div>
  );
};