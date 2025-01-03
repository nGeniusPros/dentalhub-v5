import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const SidebarHeader = ({ collapsed, onToggle }: SidebarHeaderProps) => {
  return (
    <div className={cn(
      "p-4 border-b flex justify-between items-center sticky top-0 z-10",
      "bg-gradient-primary-soft backdrop-blur-xl",
      "border-gray-200/20"
    )}>
      {!collapsed && (
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-8 h-8"
          >
            <Icons.Atom className="w-full h-full text-primary" />
          </motion.div>
          <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
            NGenius Dental
          </span>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="text-primary hover:text-primary/80"
      >
        {collapsed ? (
          <Icons.ChevronRight className="h-4 w-4" />
        ) : (
          <Icons.ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};