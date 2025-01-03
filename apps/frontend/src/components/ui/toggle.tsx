import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className
}) => {
  const [isChecked, setIsChecked] = React.useState(defaultChecked);
  
  // Use controlled or uncontrolled state based on whether checked prop is provided
  const toggleState = checked !== undefined ? checked : isChecked;

  const handleToggle = () => {
    if (disabled) return;
    
    if (checked === undefined) {
      setIsChecked(!isChecked);
    }
    onChange(!toggleState);
  };

  return (
    <motion.div
      initial={false}
      animate={{ 
        backgroundColor: toggleState ? 'rgb(27, 43, 91)' : 'rgb(229, 231, 235)'
      }}
      className={cn(
        "relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={handleToggle}
      whileTap={{ scale: 0.95 }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={toggleState}
        onChange={() => {}}
        disabled={disabled}
      />
      <motion.div
        initial={false}
        animate={{ 
          x: toggleState ? 24 : 4,
          backgroundColor: '#fff'
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full shadow-sm"
      />
    </motion.div>
  );
};