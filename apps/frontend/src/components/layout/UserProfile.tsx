import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

export const UserProfile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin-dashboard/settings');
        break;
      case 'staff':
        navigate('/staff-dashboard/settings');
        break;
      case 'patient':
        navigate('/patient-dashboard/settings');
        break;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={handleProfileClick}
      className="flex items-center gap-3 cursor-pointer"
    >
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.title} - {user?.department}
        </p>
      </div>
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] p-0.5 hover:shadow-lg transition-shadow">
        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
          <Icons.User className="w-5 h-5 text-[#1B2B85]" />
        </div>
      </div>
    </motion.div>
  );
};