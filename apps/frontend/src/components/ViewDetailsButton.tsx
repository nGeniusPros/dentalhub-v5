import React, { useState } from 'react';
import { Button } from './ui/button';
import * as Icons from 'lucide-react';
import { ViewDetailsModal } from './ViewDetailsModal';

interface CourseData {
  title: string;
  description: string;
  duration: string;
  points: number;
  level: string;
  category: string;
  progress: number;
  modules?: Array<{
    title: string;
    duration: string;
    completed: boolean;
  }>;
}

interface ChallengeData {
  title: string;
  description: string;
  points: number;
  endDate: string;
  participants: number;
  requirements?: string[];
  tasks?: Array<{
    title: string;
    points: number;
  }>;
}

interface CertificationData {
  title: string;
  description: string;
  issuer: string;
  status: 'active' | 'expiring' | 'expired';
  earnedDate: string;
  expirationDate: string;
  skills?: string[];
  validationUrl?: string;
}

interface AssignmentData {
  title: string;
  description: string;
  dueDate: string;
  points: number;
  timeEstimate: string;
  status: 'completed' | 'in_progress' | 'pending' | 'graded';
  attachments?: Array<{
    name: string;
    size: string;
  }>;
  grade?: number;
  feedback?: string;
}

type ModalData = CourseData | ChallengeData | CertificationData | AssignmentData;

interface ViewDetailsButtonProps {
  data: ModalData;
  type: 'course' | 'challenge' | 'certification' | 'assignment';
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onAction?: (action: 'start-course' | 'join-challenge' | 'start-certification' | 'start-assignment') => void;
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