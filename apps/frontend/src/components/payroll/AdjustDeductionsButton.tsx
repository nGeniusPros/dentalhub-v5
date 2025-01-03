import React, { useState } from 'react';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { AdjustDeductionsModal } from './AdjustDeductionsModal';
import { useNotifications } from '../../contexts/NotificationContext';

interface AdjustDeductionsButtonProps {
  employeeId: string;
  employeeName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const AdjustDeductionsButton: React.FC<AdjustDeductionsButtonProps> = ({
  employeeId,
  employeeName,
  variant = 'outline',
  size = 'default',
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleSave = (deductions: any) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Deductions Updated',
        message: `Deductions for ${employeeName} have been updated`,
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
        <Icons.Settings className="w-4 h-4 mr-2" />
        Adjust Deductions
      </Button>

      <AdjustDeductionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employeeId={employeeId}
        employeeName={employeeName}
        onSave={handleSave}
      />
    </>
  );
};