import React from 'react';
import { motion } from 'framer-motion';
import { AssignmentCard } from './AssignmentCard';
import { Button } from '../../../../components/ui/button';
import * as Icons from 'lucide-react';

export const AssignmentList = () => {
  const assignments = [
    {
      id: '1',
      title: 'HIPAA Compliance Quiz',
      description: 'Test your knowledge of HIPAA regulations',
      dueDate: '2024-04-15',
      status: 'pending',
      type: 'quiz',
      points: 100,
      timeEstimate: '30 minutes'
    },
    {
      id: '2',
      title: 'Patient Care Assessment',
      description: 'Demonstrate your patient care skills',
      dueDate: '2024-04-01',
      status: 'in_progress',
      type: 'assessment',
      points: 150,
      timeEstimate: '1 hour'
    },
    {
      id: '3',
      title: 'Team Communication Project',
      description: 'Group project on improving team communication',
      dueDate: '2024-04-30',
      status: 'submitted',
      type: 'project',
      points: 200,
      timeEstimate: '2 hours'
    }
  ];

  const handleStartAssignment = (id: string) => {
    console.log('Starting assignment:', id);
  };

  const handleViewAssignment = (id: string) => {
    console.log('Viewing assignment:', id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Assignments</h2>
        <Button variant="outline">
          <Icons.Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onStart={handleStartAssignment}
            onView={handleViewAssignment}
          />
        ))}
      </div>
    </motion.div>
  );
};