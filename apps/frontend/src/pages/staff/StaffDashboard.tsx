import React from 'react';
import { StaffWelcome } from '../../components/staff/StaffWelcome';
import { StatsSection } from './sections/StatsSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { TasksSection } from './sections/TasksSection';
import { QuickActionsSection } from './sections/QuickActionsSection';
import { RecentActivitySection } from './sections/RecentActivitySection';
import { MessageDialog } from '../../components/MessageDialog';
import { ReminderDialog } from '../../components/ReminderDialog';
import { CommentDialog } from '../../components/CommentDialog';

const StaffDashboard = () => {
  const [showMessage, setShowMessage] = React.useState(false);
  const [showReminder, setShowReminder] = React.useState(false);
  const [showComment, setShowComment] = React.useState(false);
  const [selectedPatient, setSelectedPatient] = React.useState<any>(null);

  return (
    <div className="space-y-6">
      <StaffWelcome />
      <StatsSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScheduleSection />
        </div>
        <TasksSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActionsSection />
        <RecentActivitySection />
      </div>

      {/* Message Dialog */}
      {showMessage && selectedPatient && (
        <MessageDialog
          isOpen={showMessage}
          onClose={() => {
            setShowMessage(false);
            setSelectedPatient(null);
          }}
          onSend={(message) => {
            console.log('Sending message:', message);
            setShowMessage(false);
            setSelectedPatient(null);
          }}
          recipient={selectedPatient}
        />
      )}

      {/* Reminder Dialog */}
      {showReminder && selectedPatient && (
        <ReminderDialog
          isOpen={showReminder}
          onClose={() => {
            setShowReminder(false);
            setSelectedPatient(null);
          }}
          onSend={(reminder) => {
            console.log('Sending reminder:', reminder);
            setShowReminder(false);
            setSelectedPatient(null);
          }}
          recipient={selectedPatient}
        />
      )}

      {/* Comment Dialog */}
      {showComment && (
        <CommentDialog
          isOpen={showComment}
          onClose={() => setShowComment(false)}
          onSubmit={(comment) => {
            console.log('Adding comment:', comment);
            setShowComment(false);
          }}
        />
      )}
    </div>
  );
};

export default StaffDashboard;