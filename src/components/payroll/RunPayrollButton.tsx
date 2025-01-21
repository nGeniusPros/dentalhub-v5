import React, { useState } from 'react';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { PayrollModal } from './PayrollModal';
import { useNotifications } from '../../contexts/NotificationContext';

interface RunPayrollButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const RunPayrollButton: React.FC<RunPayrollButtonProps> = ({
  variant = 'default',
  size = 'default',
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleRunPayroll = (payrollData: any) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Payroll Processing',
        message: 'Payroll has been submitted for processing',
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'high'
      }
    });
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowModal(true)}
      >
        <Icons.DollarSign className="w-4 h-4 mr-2" />
        Run Payroll
      </Button>

      <PayrollModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleRunPayroll}
      />
    </>
  );
};