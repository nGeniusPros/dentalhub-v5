import React from "react";
import { motion } from "framer-motion";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-light hover:shadow-xl transition-all duration-300 hover:bg-white/100"
    >
      <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
        {title}
      </h2>
      <div className="h-80 relative">
        <div className="absolute inset-0 bg-gradient-radial from-white/50 to-transparent opacity-50" />
        {children}
      </div>
    </motion.div>
  );
};
