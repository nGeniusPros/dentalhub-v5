import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export const QuickActionsSection = () => {
  const actions = [
    { icon: 'Calendar', label: 'Schedule Appointment', color: 'bg-blue-500' },
    { icon: 'MessageSquare', label: 'Send Message', color: 'bg-green-500' },
    { icon: 'FileText', label: 'Create Treatment Plan', color: 'bg-purple-500' },
    { icon: 'Phone', label: 'Call Patient', color: 'bg-orange-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              {React.createElement(Icons[action.icon as keyof typeof Icons], {
                className: 'w-5 h-5 text-white'
              })}
            </div>
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};