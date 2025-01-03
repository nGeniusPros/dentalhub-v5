import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { UserProfile } from './UserProfile';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const Header = () => {
  const { user } = useAuthContext();
  const { state: notificationState } = useNotifications();
  const unreadCount = notificationState.notifications.filter(n => !n.read).length;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-40 h-24"
    >
      <div className="h-full flex items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            NGenius Dental Hub
          </h1>
          <p className="text-sm text-gray-500">Powered by: Ngenius Pros</p>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <NotificationBell count={unreadCount} />
          <UserProfile />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;