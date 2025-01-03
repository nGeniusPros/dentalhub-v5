import React, { useState } from 'react';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { PayStubsModal } from './PayStubsModal';
import { useNotifications } from '../../contexts/NotificationContext';

interface PayStubsButtonProps {
  employeeId: string;
  employeeName: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const PayStubsButton: React.FC<PayStubsButtonProps> = ({
  employeeId,
  employeeName,
  variant = 'outline',
  size = 'default',
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleDownload = (payPeriod: string) => {
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Pay Stub Downloaded',
        message: `Pay stub for ${employeeName} - ${payPeriod} has been downloaded`,
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
        <Icons.FileText className="w-4 h-4 mr-2" />
        Pay Stubs
      </Button>

      <PayStubsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employeeId={employeeId}
        employeeName={employeeName}
        onDownload={handleDownload}
      />
    </>
  );
};