import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { MenuGroup } from './Sidebar/MenuGroup';
import { cn } from '../utils/cn';
import type { MenuItem } from '../types';

const adminMenuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin-dashboard',
    group: 'Main'
  },
  {
    id: '2',
    label: 'Appointments',
    icon: 'Calendar',
    path: '/admin-dashboard/appointments',
    group: 'Main'
  },
  {
    id: '3',
    label: 'Patients',
    icon: 'Users',
    path: '/admin-dashboard/patients',
    group: 'Clinical'
  },
  {
    id: '4',
    label: 'Staff',
    icon: 'UserCog',
    path: '/admin-dashboard/staff',
    group: 'Management'
  },
  {
    id: '5',
    label: 'HR',
    icon: 'Building2',
    path: '/admin-dashboard/hr',
    group: 'Management'
  },
  {
    id: '6',
    label: 'SMS Campaigns',
    icon: 'MessageSquare',
    path: '/admin-dashboard/sms-campaigns',
    group: 'Marketing'
  },
  {
    id: '7',
    label: 'Email Campaigns',
    icon: 'Mail',
    path: '/admin-dashboard/email-campaigns',
    group: 'Marketing'
  },
  {
    id: '8',
    label: 'Voice Agent',
    icon: 'Phone',
    path: '/admin-dashboard/voice-agent',
    group: 'Marketing'
  },
  {
    id: '9',
    label: 'Reputation',
    icon: 'Star',
    path: '/admin-dashboard/reputation',
    group: 'Marketing'
  },
  {
    id: '10',
    label: 'Learning Center',
    icon: 'GraduationCap',
    path: '/admin-dashboard/learning',
    group: 'Resources'
  },
  {
    id: '11',
    label: 'Resources',
    icon: 'BookOpen',
    path: '/admin-dashboard/resources',
    group: 'Resources'
  },
  {
    id: '12',
    label: 'Marketplace',
    icon: 'Store',
    path: '/admin-dashboard/marketplace',
    group: 'Resources'
  },
  {
    id: '13',
    label: 'Settings',
    icon: 'Settings',
    path: '/admin-dashboard/settings',
    group: 'System'
  }
];

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className={cn(
        "fixed left-0 top-0 h-screen",
        "bg-gradient-to-br from-[#1B2B85] via-[#2B3A9F] to-[#3B4AB9]",
        "border-r border-white/10",
        "flex flex-col",
        "shadow-xl",
        "transition-all duration-300 ease-in-out z-50"
      )}
    >
      <div className="flex items-center justify-center h-24 border-b border-white/10">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="relative w-12 h-12"
        >
          <Icons.Atom className="w-full h-full text-white animate-spin-slow" />
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {Object.entries(adminMenuItems.reduce((acc, item) => {
          const group = item.group || 'Other';
          if (!acc[group]) acc[group] = [];
          acc[group].push(item);
          return acc;
        }, {} as Record<string, MenuItem[]>)).map(([group, items]) => (
          <MenuGroup
            key={group}
            title={group}
            items={items}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full flex items-center justify-center gap-2 p-2 rounded-lg",
            "text-white/80 hover:text-white",
            "hover:bg-white/10 backdrop-blur-sm transition-colors"
          )}
        >
          <Icons.PanelLeftClose className={cn(
            "w-5 h-5 transition-transform",
            isCollapsed && "rotate-180"
          )} />
          {!isCollapsed && (
            <span className="text-sm font-medium">Collapse</span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;