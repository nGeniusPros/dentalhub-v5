import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import StatsCard from '../../../components/dashboard/StatsCard';
import { StaffDirectory } from './components/StaffDirectory'; 
import { PerformanceTab } from './components/staff/PerformanceTab';
import { ScheduleTab } from './components/staff/ScheduleTab';
import { PayrollTab } from './components/staff/PayrollTab';
import { TrainingTab } from './components/staff/TrainingTab';
import { DocumentsTab } from './components/staff/DocumentsTab';
import { ReportsTab } from './components/staff/ReportsTab';
import { useNotifications } from '../../../contexts/NotificationContext';

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { dispatch: notifyDispatch } = useNotifications();

  const handleAIMessage = (message: string) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'AI Assistant',
        message: 'Your AI HR assistant is ready to help!',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Staff Management
          </h1>
          <p className="text-gray-600">Comprehensive staff management and analytics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
          { id: 'directory', label: 'Directory', icon: 'Users' },
          { id: 'performance', label: 'Performance', icon: 'BarChart2' },
          { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
          { id: 'payroll', label: 'Payroll', icon: 'DollarSign' },
          { id: 'training', label: 'Training', icon: 'GraduationCap' },
          { id: 'documents', label: 'Documents', icon: 'FileText' },
          { id: 'reports', label: 'Reports', icon: 'FileBarChart' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.id)}
            className="relative py-2 -mb-px"
          >
            {React.createElement(Icons[tab.icon as keyof typeof Icons], {
              className: "w-4 h-4 mr-2"
            })}
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Staff"
              value="24"
              change={8}
              icon="Users"
              variant="primary"
            />
            <StatsCard
              title="Active Staff" 
              value="22"
              change={5}
              icon="UserCheck"
              variant="secondary"
            />
            <StatsCard
              title="Satisfaction"
              value="92%"
              change={3}
              icon="Heart"
              variant="accent1"
            />
            <StatsCard
              title="Retention Rate"
              value="95%"
              change={2}
              icon="UserPlus"
              variant="accent2"
            />
          </div>
        </div>
      )}

      {/* Directory Tab */}
      {activeTab === 'directory' && <StaffDirectory />}

      {/* Performance Tab */}
      {activeTab === 'performance' && <PerformanceTab />}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && <ScheduleTab />}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && <PayrollTab />}

      {/* Training Tab */}
      {activeTab === 'training' && <TrainingTab />}

      {/* Documents Tab */}
      {activeTab === 'documents' && <DocumentsTab />}

      {/* Reports Tab */}
      {activeTab === 'reports' && <ReportsTab />}

    </div>
  );
};

export default StaffManagement;