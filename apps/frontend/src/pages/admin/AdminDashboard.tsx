import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from './components/DashboardHeader';
import { KPIOverview } from './components/KPIOverview';
import { RevenueAnalytics } from './analytics/components/RevenueAnalytics';
import { PatientMetrics } from './analytics/components/PatientMetrics';
import { StaffPerformance } from './analytics/components/StaffPerformance';
import { MarketingMetrics } from './analytics/components/MarketingMetrics';
import { TreatmentAnalytics } from './analytics/components/TreatmentAnalytics';
import { AppointmentOverview } from './analytics/components/AppointmentOverview';
import { HygieneAnalytics } from './analytics/components/HygieneAnalytics';

export const AdminDashboard = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <DashboardHeader />
      <KPIOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <PatientMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaffPerformance />
        <MarketingMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreatmentAnalytics />
        <AppointmentOverview />
      </div>

      <HygieneAnalytics />

      {/* AI Chat Button */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowChat(true)}
        className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-[#1B2B85] to-[#40E0D0] rounded-full shadow-lg text-white"
      >
        <Icons.MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* AI Chat Window */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">AI Assistant</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowChat(false)}
                >
                  <Icons.X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Chat messages will go here */}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;