import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from '@/components/ui/link';
import { QuickActionsSection } from './components/QuickActionsSection';
import { RecentActivitySection } from './components/RecentActivitySection';
import { StatsSection } from './components/StatsSection';
import { TasksSection } from './components/TasksSection';
import { ScheduleSection } from './components/schedule/ScheduleSection';
import { StaffWelcome } from './components/staff/StaffWelcome';
import { MessageDialog } from './components/dialogs/MessageDialog';
import { ReminderDialog } from './components/dialogs/ReminderDialog';
import { CommentDialog } from './components/dialogs/CommentDialog';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  name: string;
  appointmentTime?: string;
  status?: string;
  notes?: string;
}

export const StaffDashboard: React.FC = () => {
  const [showMessage, setShowMessage] = React.useState(false);
  const [showReminder, setShowReminder] = React.useState(false);
  const [showComment, setShowComment] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      <StaffWelcome />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsSection />
        <QuickActionsSection />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TasksSection />
        <RecentActivitySection />
      </div>
      <ScheduleSection />

      <MessageDialog
        isOpen={showMessage}
        onClose={() => setShowMessage(false)}
        patient={selectedPatient}
      />
      <ReminderDialog
        isOpen={showReminder}
        onClose={() => setShowReminder(false)}
        patient={selectedPatient}
      />
      <CommentDialog
        isOpen={showComment}
        onClose={() => setShowComment(false)}
        patient={selectedPatient}
      />
    </motion.div>
  );
};