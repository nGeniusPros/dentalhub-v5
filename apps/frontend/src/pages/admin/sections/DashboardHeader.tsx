import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold bg-gradient-primary text-transparent bg-clip-text">
          Practice Overview
        </h1>
        <p className="text-gray-500 mt-1">Welcome back, Dr. Sarah Wilson</p>
      </div>
      <div className="flex gap-3">
        <Button 
          variant="outline"
          onClick={() => navigate('/admin-dashboard/reports')}
          className="text-gray-700 hover:text-gray-900"
        >
          <Icons.FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate('/admin-dashboard/ai-consultant')}
          className="text-gray-700 hover:text-gray-900"
        >
          <Icons.Brain className="w-4 h-4 mr-2" />
          AI Insights
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => navigate('/admin-dashboard/staff')}
        >
          <Icons.UserPlus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>
    </motion.div>
  );
};