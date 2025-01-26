import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";

interface ResourceFiltersProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  selectedFilters,
  onFilterChange,
}) => {
  const filters = [
    { id: "required", label: "Required", icon: "AlertCircle" },
    { id: "new", label: "New", icon: "Star" },
    { id: "updated", label: "Recently Updated", icon: "RefreshCw" },
    { id: "expiring", label: "Expiring Soon", icon: "Clock" },
  ];

  const toggleFilter = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      onFilterChange(selectedFilters.filter((id) => id !== filterId));
    } else {
      onFilterChange([...selectedFilters, filterId]);
    }
  };

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
          onClick={() => toggleFilter(filter.id)}
          className={cn(
            "gap-2",
            selectedFilters.includes(filter.id) && "bg-primary text-white",
          )}
        >
          {React.createElement(Icons[filter.icon as keyof typeof Icons], {
            className: "w-4 h-4",
          })}
          {filter.label}
        </Button>
      ))}
    </div>
  );
};
