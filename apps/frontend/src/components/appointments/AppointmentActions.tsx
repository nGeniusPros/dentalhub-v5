import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { MessageDialog } from '../MessageDialog';
import { ReminderDialog } from '../ReminderDialog';
import { CommentDialog } from '../CommentDialog';
import { EditDialog } from '../EditDialog';

interface AppointmentActionsProps {
  appointment: {
    patient: string;
    time: string;
    type: string;
    status: string;
  };
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowMessage(true)}
          className="text-primary hover:text-primary-dark"
        >
          <Icons.MessageSquare className="w-4 h-4 mr-1" />
          Message
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowReminder(true)}
          className="text-primary hover:text-primary-dark"
        >
          <Icons.Bell className="w-4 h-4 mr-1" />
          Remind
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowComment(true)}
          className="text-primary hover:text-primary-dark"
        >
          <Icons.MessageCircle className="w-4 h-4 mr-1" />
          Comment
        </Button>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowEdit(true)}
          className="text-primary hover:text-primary-dark"
        >
          <Icons.Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={showMessage}
        onClose={() => setShowMessage(false)}
        onSend={(message) => {
          console.log('Sending message:', message);
          setShowMessage(false);
        }}
        recipient={{
          name: appointment.patient,
          email: `${appointment.patient.toLowerCase().replace(' ', '.')}@example.com`
        }}
      />

      {/* Reminder Dialog */}
      <ReminderDialog
        isOpen={showReminder}
        onClose={() => setShowReminder(false)}
        onSend={(reminder) => {
          console.log('Sending reminder:', reminder);
          setShowReminder(false);
        }}
        recipient={{
          name: appointment.patient,
          appointment: {
            date: appointment.time.split(' ')[0],
            time: appointment.time.split(' ')[1],
            type: appointment.type
          }
        }}
      />

      {/* Comment Dialog */}
      <CommentDialog
        isOpen={showComment}
        onClose={() => setShowComment(false)}
        onSubmit={(comment) => {
          console.log('Adding comment:', comment);
          setShowComment(false);
        }}
        title={`Add Comment - ${appointment.patient}`}
      />

      {/* Edit Dialog */}
      <EditDialog
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={(data) => {
          console.log('Saving changes:', data);
          setShowEdit(false);
        }}
        data={appointment}
        type="patient"
      />
    </>
  );
};