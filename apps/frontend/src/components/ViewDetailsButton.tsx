import React, { useState } from 'react';
import { Button } from './ui/button';
import * as Icons from 'lucide-react';
import { ViewDetailsModal } from './ViewDetailsModal';

interface ViewDetailsButtonProps {
  data: any;
  type: 'course' | 'challenge' | 'certification' | 'assignment';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onAction?: (action: string) => void;
}

export const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({
  data,
  type,
  variant = 'outline',
  size = 'default',
  className,
  onAction
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowDetails(true)}
      >
        <Icons.Eye className="w-4 h-4 mr-2" />
        View Details
      </Button>

      <ViewDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        data={data}
        type={type}
        onAction={onAction}
      />
    </>
  );
};