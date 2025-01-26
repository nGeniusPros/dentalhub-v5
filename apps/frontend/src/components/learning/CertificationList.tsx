import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Certification } from '../../types/learning';
import { cn } from '../../lib/utils';

interface CertificationCardProps {
  certification: Certification;
  onView: (certificationId: string) => void;
  onStart?: (certificationId: string) => void;
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  certification,
  onView,
  onStart
}) => {
  const isInProgress = certification.status === 'in_progress';
  const isCompleted = certification.status === 'completed';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-xl shadow-sm p-4",
        isCompleted && "border-2 border-green-500"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "p-2 rounded-lg",
          isCompleted ? "bg-green-100 text-green-600" :
          isInProgress ? "bg-blue-100 text-blue-600" :
          "bg-gray-100 text-gray-600"
        )}>
          <Icons.Award className="w-5 h-5" />
        </div>
        {certification.validUntil && (
          <div className="flex items-center text-sm text-orange-600">
            <Icons.Clock className="w-4 h-4 mr-1" />
            Expires: {new Date(certification.validUntil).toLocaleDateString()}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-1">{certification.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{certification.description}</p>

      <div className="space-y-4">
        {certification.requirements && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Requirements:</p>
            <ul className="space-y-1">
              {certification.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  {req.completed ? (
                    <Icons.CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Icons.Circle className="w-4 h-4 mr-2 text-gray-400" />
                  )}
                  {req.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isInProgress && certification.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{certification.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${certification.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Icons.Clock className="w-4 h-4" />
            {certification.estimatedTime}
          </div>
          {certification.level && (
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              {
                'bg-green-100 text-green-600': certification.level === 'Beginner',
                'bg-blue-100 text-blue-600': certification.level === 'Intermediate',
                'bg-purple-100 text-purple-600': certification.level === 'Advanced'
              }
            )}>
              {certification.level}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onView(certification.id)}
          >
            View Details
          </Button>
          {!isCompleted && onStart && (
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => onStart(certification.id)}
            >
              {isInProgress ? 'Continue' : 'Start'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const CertificationList: React.FC = () => {
  // This would typically come from an API or context
  const certifications: Certification[] = [
    {
      id: '1',
      title: 'HIPAA Compliance Certification',
      description: 'Comprehensive certification in HIPAA compliance and patient privacy',
      status: 'completed',
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: '8 hours',
      level: 'Intermediate',
      requirements: [
        { description: 'Complete HIPAA Fundamentals Course', completed: true },
        { description: 'Pass Privacy Assessment', completed: true },
        { description: 'Complete Case Studies', completed: true }
      ]
    },
    {
      id: '2',
      title: 'Advanced Patient Care Certification',
      description: 'Professional certification in advanced patient care techniques',
      status: 'in_progress',
      estimatedTime: '12 hours',
      level: 'Advanced',
      progress: 65,
      requirements: [
        { description: 'Complete Patient Care Modules', completed: true },
        { description: 'Pass Practical Assessment', completed: false },
        { description: 'Submit Case Documentation', completed: false }
      ]
    },
    {
      id: '3',
      title: 'Dental Practice Management',
      description: 'Certification in modern dental practice management',
      status: 'not_started',
      estimatedTime: '10 hours',
      level: 'Beginner',
      requirements: [
        { description: 'Complete Management Basics', completed: false },
        { description: 'Team Leadership Training', completed: false },
        { description: 'Financial Management Module', completed: false }
      ]
    }
  ];

  const handleViewCertification = (certificationId: string) => {
    console.log('Viewing certification:', certificationId);
    // Implement view certification logic
  };

  const handleStartCertification = (certificationId: string) => {
    console.log('Starting certification:', certificationId);
    // Implement start certification logic
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Certifications</h2>
          <p className="text-sm text-gray-600">
            {certifications.filter(c => c.status === 'completed').length} of {certifications.length} completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="small">
            Download All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map(certification => (
          <CertificationCard
            key={certification.id}
            certification={certification}
            onView={handleViewCertification}
            onStart={handleStartCertification}
          />
        ))}
      </div>
    </div>
  );
};
