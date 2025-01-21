import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DashboardHeader } from './sections/DashboardHeader';
import { KPIOverview } from './sections/KPIOverview';
import { RevenueAnalytics } from './sections/RevenueAnalytics';
import { PatientMetrics } from './sections/PatientMetrics';
import { StaffPerformance } from './sections/StaffPerformance';
import { MarketingMetrics } from './sections/MarketingMetrics';
import { TreatmentAnalytics } from './sections/TreatmentAnalytics';
import { AppointmentOverview } from './sections/AppointmentOverview';
import { HygieneAnalytics } from './sections/HygieneAnalytics';

const AdminDashboard = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Quick Actions Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h2 className="text-lg text-gray-600">Welcome back, Dr. Sarah Wilson</h2>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Icons.FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Icons.Brain className="w-4 h-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIOverview />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <RevenueAnalytics />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <PatientMetrics />
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <StaffPerformance />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <MarketingMetrics />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <TreatmentAnalytics />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <AppointmentOverview />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <HygieneAnalytics />
      </div>

      {/* Chat Widget */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                >
                  <Icons.X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages will go here */}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Type a message..."
                />
                <Button>
                  <Icons.Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;