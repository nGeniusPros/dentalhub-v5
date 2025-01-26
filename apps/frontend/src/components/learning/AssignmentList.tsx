import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Assignment } from '../../types/learning';
import { cn } from '../../lib/utils';

interface AssignmentItemProps {
  assignment: Assignment;
  onView: (assignmentId: string) => void;
}

const AssignmentItem: React.FC<AssignmentItemProps> = ({ assignment, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Icons.Clock className="w-4 h-4" />;
      case 'completed': return <Icons.CheckCircle className="w-4 h-4" />;
      case 'overdue': return <Icons.AlertCircle className="w-4 h-4" />;
      default: return <Icons.HelpCircle className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "bg-white rounded-lg p-4 border-l-4",
        {
          'border-yellow-500': assignment.status === 'pending',
          'border-green-500': assignment.status === 'completed',
          'border-red-500': assignment.status === 'overdue'
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold">{assignment.title}</h3>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
              getStatusColor(assignment.status)
            )}>
              {getStatusIcon(assignment.status)}
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Icons.Calendar className="w-4 h-4" />
              Due: {new Date(assignment.dueDate).toLocaleDateString()}
            </div>
            {assignment.points && (
              <div className="flex items-center gap-1">
                <Icons.Star className="w-4 h-4" />
                {assignment.points} points
              </div>
            )}
            {assignment.estimatedTime && (
              <div className="flex items-center gap-1">
                <Icons.Clock className="w-4 h-4" />
                {assignment.estimatedTime}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="small"
          onClick={() => onView(assignment.id)}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export const AssignmentList: React.FC = () => {
  // This would typically come from an API or context
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Complete HIPAA Training Module',
      description: 'Review and complete the updated HIPAA compliance training materials',
      status: 'pending',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      points: 100,
      estimatedTime: '2 hours',
      courseId: '1'
    },
    {
      id: '2',
      title: 'Patient Care Assessment',
      description: 'Complete the final assessment for the Patient Care Excellence course',
      status: 'overdue',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      points: 150,
      estimatedTime: '1 hour',
      courseId: '2'
    },
    {
      id: '3',
      title: 'Team Communication Workshop',
      description: 'Participate in the online workshop about effective team communication',
      status: 'completed',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      points: 75,
      estimatedTime: '45 minutes',
      courseId: '3'
    }
  ];

  const handleViewAssignment = (assignmentId: string) => {
    console.log('Viewing assignment:', assignmentId);
    // Implement view assignment logic
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Assignments</h2>
          <p className="text-sm text-gray-600">
            {assignments.filter(a => a.status === 'pending').length} pending assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="ghost" size="small">
            <Icons.SortAsc className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {assignments.map(assignment => (
          <AssignmentItem
            key={assignment.id}
            assignment={assignment}
            onView={handleViewAssignment}
          />
        ))}
      </div>
    </div>
  );
};
