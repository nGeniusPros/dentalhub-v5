import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { HRStats } from './components/HRStats';
import { StaffDirectory } from './components/StaffDirectory';
import { TimeOffRequests } from './components/TimeOffRequests';
import { PayrollSummary } from './components/PayrollSummary';
import { ProviderCredentials } from './components/ProviderCredentials';
import { RecruitmentTracker } from './components/RecruitmentTracker';
import { PerformanceReviews } from './components/PerformanceReviews';
import { StaffSchedule } from './components/StaffSchedule';
import { ExportDialog } from './components/ExportDialog';
import { AddStaffDialog } from './components/AddStaffDialog';
import { ApplicantsList } from './components/ApplicantsList';
import { TaskManager } from './components/TaskManager';
import { useNotifications } from '../../../contexts/NotificationContext';

const HRDashboard = () => {
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [showAddStaff, setShowAddStaff] = React.useState(false);
  const [showApplicants, setShowApplicants] = React.useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleExport = (format: string, options: any) => {
    // In production, this would trigger a backend export process
    console.log('Exporting with format:', format, 'and options:', options);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Export Started',
        message: 'Your export is being processed and will be ready shortly.',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
    
    setShowExportDialog(false);
  };

  const handleAddStaff = (staffMember: any) => {
    console.log('Adding staff member:', staffMember);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Staff Member Added',
        message: `${staffMember.firstName} ${staffMember.lastName} has been added to the staff directory.`,
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
            Human Resources
          </h1>
          <p className="text-gray-600">Comprehensive HR management and analytics</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowExportDialog(true)}
          >
            <Icons.Download className="w-4 h-4 mr-2" />
            Export Reports
          </Button>
          <Button 
            className="bg-gradient-to-r from-navy to-purple text-white"
            onClick={() => setShowAddStaff(true)}
          >
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <HRStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeOffRequests />
        <PayrollSummary />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StaffDirectory />
          {showApplicants && <ApplicantsList />}
        </div>
        <ProviderCredentials />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecruitmentTracker />
        <PerformanceReviews />
      </div>

      <TaskManager />

      <StaffSchedule />

      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
      />

      <AddStaffDialog
        isOpen={showAddStaff}
        onClose={() => setShowAddStaff(false)}
        onAdd={handleAddStaff}
      />
    </div>
  );
};

export default HRDashboard;