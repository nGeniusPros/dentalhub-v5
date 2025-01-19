import React, { useState } from 'react';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { AssignStaffModal } from './AssignStaffModal';
import { useNotifications } from '../../contexts/NotificationContext';

interface StaffAssignment {
  id: string;
  name: string;
  role: string;
  hours: number;
  startDate: string;
  endDate?: string;
}

interface AssignStaffButtonProps {
  onAssign?: (assignments: StaffAssignment[]) => void;
  currentAssignments?: StaffAssignment[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const AssignStaffButton: React.FC<AssignStaffButtonProps> = ({
  onAssign,
  currentAssignments,
  variant = 'default',
  size = 'default',
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleAssign = (assignments: StaffAssignment[]) => {
    if (onAssign) {
      onAssign(assignments);
    }

    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Staff Assigned',
        message: `Successfully assigned ${assignments.length} staff member${assignments.length === 1 ? '' : 's'}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
      >
        <Icons.Users className="w-4 h-4 mr-2" />
        Assign Staff
      </Button>

      <AssignStaffModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAssign={handleAssign}
        currentAssignments={currentAssignments}
      />
    </>
  );
};