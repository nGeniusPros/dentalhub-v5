```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { AddCourseModal } from './modals/AddCourseModal';
import { AddBadgeModal } from './modals/AddBadgeModal';
import { AddPathModal } from './modals/AddPathModal';
import { AddCertificationModal } from './modals/AddCertificationModal';
import { AddPrizeModal } from './modals/AddPrizeModal';
import { AddGoalModal } from './modals/AddGoalModal';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { useLearning } from '../../../../contexts/LearningContext';

export const LearningManagement = () => {
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddBadge, setShowAddBadge] = useState(false);
  const [showAddPath, setShowAddPath] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [showAddPrize, setShowAddPrize] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const { dispatch: notifyDispatch } = useNotifications();
  const { dispatch: learningDispatch } = useLearning();

  const managementOptions = [
    { 
      title: 'Courses', 
      icon: 'BookOpen',
      description: 'Create and manage learning courses',
      onClick: () => setShowAddCourse(true)
    },
    { 
      title: 'Badges', 
      icon: 'Award',
      description: 'Design achievement badges',
      onClick: () => setShowAddBadge(true)
    },
    { 
      title: 'Learning Paths', 
      icon: 'Map',
      description: 'Define structured learning journeys',
      onClick: () => setShowAddPath(true)
    },
    { 
      title: 'Certifications', 
      icon: 'FileCheck',
      description: 'Create professional certifications',
      onClick: () => setShowAddCertification(true)
    },
    { 
      title: 'Prizes', 
      icon: 'Gift',
      description: 'Set up rewards and incentives',
      onClick: () => setShowAddPrize(true)
    },
    { 
      title: 'Goals', 
      icon: 'Target',
      description: 'Define learning objectives',
      onClick: () => setShowAddGoal(true)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managementOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={option.onClick}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                {React.createElement(Icons[option.icon as keyof typeof Icons], {
                  className: "w-6 h-6 text-primary"
                })}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>

            <Button className="w-full">
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add {option.title}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={showAddCourse}
        onClose={() => setShowAddCourse(false)}
        onAdd={(course) => {
          learningDispatch({ type: 'SET_COURSES', payload: [course] });
          notifyDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              id: Date.now().toString(),
              type: 'message',
              title: 'Course Created',
              message: `${course.title} has been created successfully`,
              timestamp: new Date().toISOString(),
              read: false,
              priority: 'medium'
            }
          });
        }}
      />

      {/* Add Badge Modal */}
      <AddBadgeModal
        isOpen={showAddBadge}
        onClose={() => setShowAddBadge(false)}
        onAdd={(badge) => {
          // Handle badge creation
        }}
      />

      {/* Add Path Modal */}
      <AddPathModal
        isOpen={showAddPath}
        onClose={() => setShowAddPath(false)}
        onAdd={(path) => {
          // Handle path creation
        }}
      />

      {/* Add Certification Modal */}
      <AddCertificationModal
        isOpen={showAddCertification}
        onClose={() => setShowAddCertification(false)}
        onAdd={(certification) => {
          // Handle certification creation
        }}
      />

      {/* Add Prize Modal */}
      <AddPrizeModal
        isOpen={showAddPrize}
        onClose={() => setShowAddPrize(false)}
        onAdd={(prize) => {
          // Handle prize creation
        }}
      />

      {/* Add Goal Modal */}
      <AddGoalModal
        isOpen={showAddGoal}
        onClose={() => setShowAddGoal(false)}
        onAdd={(goal) => {
          // Handle goal creation
        }}
      />
    </div>
  );
};
```