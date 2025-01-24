import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from './Header';

interface NavItem {
  label: string;
  icon: keyof typeof Icons;
  path: string;
  roles?: string[];
}

export const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'Home',
      path: '/dashboard',
      roles: ['admin', 'staff', 'patient'],
    },
    {
      label: 'Appointments',
      icon: 'Calendar',
      path: '/appointments',
      roles: ['admin', 'staff', 'patient'],
    },
    {
      label: 'Patients',
      icon: 'Users',
      path: '/patients',
      roles: ['admin', 'staff'],
    },
    {
      label: 'Staff',
      icon: 'UserPlus',
      path: '/staff',
      roles: ['admin'],
    },
    {
      label: 'Analytics',
      icon: 'BarChart2',
      path: '/analytics',
      roles: ['admin'],
    },
    {
      label: 'Settings',
      icon: 'Settings',
      path: '/settings',
      roles: ['admin', 'staff', 'patient'],
    },
  ];

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user?.user_metadata?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4"
        >
          <nav className="space-y-2">
            {filteredNavItems.map((item) => {
              const Icon = Icons[item.icon];
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[#1B2B85] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};