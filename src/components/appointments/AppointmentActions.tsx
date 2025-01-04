import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { MessageDialog } from '../MessageDialog';
import { ReminderDialog } from '../ReminderDialog';
import { CommentDialog } from '../CommentDialog';
import { EditDialog } from '../EditDialog';
import supabase from '../../lib/supabase/client';
import { syncManager } from '../../lib/utils/sync';

interface AppointmentActionsProps {
  patient: string;
  time: string;
  type: string;
  status: string;
  id: string;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  patient,
  time,
  type,
  status,
  id
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    // Subscribe to relevant tables
    syncManager.subscribeToTable('messages_notifications', (payload) => {
      console.log('Messages/Notifications sync update:', payload);
    });
    
    syncManager.subscribeToTable('comments', (payload) => {
      console.log('Comments sync update:', payload);
    });
    
    syncManager.subscribeToTable('appointments', (payload) => {
      console.log('Appointments sync update:', payload);
    });

    // Fetch appointment details
    const fetchAppointment = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients!inner(id, first_name, last_name, email, phone),
            provider:users!provider_id(id, email, raw_user_meta_data),
            resources:appointment_resources(
              id,
              resource:resources(id, name, type)
            ),
            comments:appointment_comments(
              id,
              content,
              created_at,
              user:users(id, email, raw_user_meta_data)
            )
          `)
          .eq('id', id)
          .single();
        if (error) {
          console.error('Error fetching appointment:', error);
        } else {
          setAppointment(data);
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };

    fetchAppointment();

    // Cleanup subscriptions on unmount
    return () => {
      syncManager.unsubscribeFromTable('messages_notifications');
      syncManager.unsubscribeFromTable('comments');
      syncManager.unsubscribeFromTable('appointments');
    };
  }, [id, supabase, syncManager]);

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
        recipient={{
          name: patient,
          email: `${patient.toLowerCase().replace(' ', '.')}@example.com`
        }}
      />

      {/* Reminder Dialog */}
      <ReminderDialog
        isOpen={showReminder}
        onClose={() => setShowReminder(false)}
        onSend={async (reminder) => {
          try {
            await syncManager.addOperation({
              table: 'messages_notifications',
              type: 'INSERT',
              data: {
                message: reminder,
                recipient: patient,
                type: 'reminder',
                status: 'scheduled',
                created_at: new Date().toISOString(),
                scheduled_for: reminder.date,
              },
              timestamp: Date.now(),
            });
            console.log('Reminder queued for scheduling');
          } catch (error) {
            console.error('Error queueing reminder:', error);
          }
          setShowReminder(false);
        }}
        recipient={{
          name: patient,
          appointment: {
            date: time.split(' ')[0],
            time: time.split(' ')[1],
            type: type
          }
        }}
      />

      {/* Comment Dialog */}
      <CommentDialog
        isOpen={showComment}
        onClose={() => setShowComment(false)}
        onSubmit={async (comment) => {
          try {
            await syncManager.addOperation({
              table: 'comments',
              type: 'INSERT',
              data: {
                comment,
                patient: patient,
                appointment_type: type,
                created_at: new Date().toISOString(),
              },
              timestamp: Date.now(),
            });
            console.log('Comment queued for adding');
          } catch (error) {
            console.error('Error queueing comment:', error);
          }
          setShowComment(false);
        }}
        title={`Add Comment - ${patient}`}
      />

      {/* Edit Dialog */}
      {appointment && (
        <EditDialog
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSave={async (data) => {
            try {
              await syncManager.addOperation({
                table: 'appointments',
                type: 'UPDATE',
                data: {
                  id: id,
                  patient: data.patient,
                  time: data.time,
                  type: data.type,
                  status: data.status,
                  updated_at: new Date().toISOString(),
                },
                timestamp: Date.now(),
              });
              console.log('Appointment update queued');
            } catch (error) {
              console.error('Error queueing appointment update:', error);
            }
            setShowEdit(false);
          }}
          data={appointment}
          type="patient"
        />
      )}
    </>
  );
};