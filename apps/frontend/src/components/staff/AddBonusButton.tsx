import React, { useState } from 'react';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { AddBonusModal } from './AddBonusModal';
import { useNotifications } from '../../contexts/NotificationContext';

interface AddBonusButtonProps {
  staffId: string;
  staffName: string;
  onAdd?: (bonus: any) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export const AddBonusButton: React.FC<AddBonusButtonProps> = ({
  staffId,
  staffName,
  onAdd,
  variant = 'default',
  size = 'default',
  className
}) => {
  const [showModal, setShowModal] = useState(false);
  const { dispatch: notifyDispatch } = useNotifications();

  const handleAddBonus = (bonus: any) => {
    if (onAdd) {
      onAdd(bonus);
    }

    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Bonus Added',
        message: `Successfully added ${bonus.type} bonus for ${staffName}`,
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
        <Icons.Gift className="w-4 h-4 mr-2" />
        Add Bonus
      </Button>

      <AddBonusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddBonus}
        staffId={staffId}
        staffName={staffName}
      />
    </>
  );
};