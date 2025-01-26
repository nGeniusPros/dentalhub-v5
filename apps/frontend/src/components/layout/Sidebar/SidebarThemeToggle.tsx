import React from "react";
import * as Icons from "lucide-react";
import { Button } from "../../ui/button";
import { useTheme } from "../../../hooks/use-theme";
import { cn } from "../../../lib/utils";

export const SidebarThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 p-3 border-t",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl",
        "border-gray-200/50 dark:border-gray-700/30",
        "flex justify-center",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-lg transition-colors",
          "text-gray-500 dark:text-gray-400",
          "hover:bg-gray-100 dark:hover:bg-gray-700/50",
          "hover:text-gray-700 dark:hover:text-gray-200",
        )}
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <Icons.Moon className="h-5 w-5" />
        ) : (
          <Icons.Sun className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};
