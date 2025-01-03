import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export const StaffWelcome = () => {
  const { user } = useAuthContext();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1B2B85] to-[#3B4AB9] text-transparent bg-clip-text">
          Staff Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name} - {user?.title}
        </p>
        <p className="text-sm text-gray-400">{user?.department}</p>
      </div>
      <div className="flex gap-3">
        <button className="px-4 py-2 text-sm font-medium text-white bg-[#1B2B85] rounded-lg hover:bg-[#2B3A9F] transition-colors">
          <Icons.Calendar className="w-4 h-4 inline-block mr-2" />
          Schedule Patient
        </button>
      </div>
    </motion.div>
  );
};