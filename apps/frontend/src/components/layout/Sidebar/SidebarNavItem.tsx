import React from "react";
import * as Icons from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { cn } from "../../../lib/utils";
import { NavItem } from "./types";

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export const SidebarNavItem = ({
  item,
  isActive,
  collapsed,
  onClick,
}: SidebarNavItemProps) => {
  const Icon = Icons[item.icon as keyof typeof Icons];

  const button = (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary hover:bg-primary/15 dark:bg-primary/20 dark:hover:bg-primary/25"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50",
        "hover:translate-x-1",
      )}
      onClick={onClick}
    >
      <Icon
        className={cn(
          "h-4 w-4 transition-colors",
          isActive
            ? "text-primary dark:text-primary"
            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300",
        )}
      />
      {!collapsed && <span>{item.label}</span>}
    </Button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white dark:bg-gray-800 text-sm"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
};
