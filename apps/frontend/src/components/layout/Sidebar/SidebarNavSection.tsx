import React from "react";
import { SidebarNavItem } from "./SidebarNavItem";
import { NavSection } from "./types";
import { cn } from "../../../lib/utils";

interface SidebarNavSectionProps {
  section: NavSection;
  collapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const SidebarNavSection = ({
  section,
  collapsed,
  currentPath,
  onNavigate,
}: SidebarNavSectionProps) => {
  return (
    <div className="py-2 px-2">
      {!collapsed && (
        <h4
          className={cn(
            "text-xs font-semibold px-3 py-2",
            "text-gray-500 dark:text-gray-400",
            "tracking-wider uppercase",
          )}
        >
          {section.category}
        </h4>
      )}
      <div className="space-y-1">
        {section.items.map((item) => (
          <SidebarNavItem
            key={item.path}
            item={item}
            isActive={currentPath === item.path}
            collapsed={collapsed}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};
