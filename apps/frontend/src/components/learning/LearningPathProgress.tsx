import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { LearningPath } from '../../types/learning';
import { cn } from '../../lib/utils';

interface PathStageProps {
  stage: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    current: boolean;
    courses: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>;
  };
}

const PathStage: React.FC<PathStageProps> = ({ stage }) => {
  return (
    <div className={cn(
      "relative p-4 border-l-2",
      stage.completed ? "border-green-500" : 
      stage.current ? "border-blue-500" : "border-gray-200"
    )}>
      <div className={cn(
        "absolute w-4 h-4 rounded-full -left-[9px] top-6",
        stage.completed ? "bg-green-500" : 
        stage.current ? "bg-blue-500" : "bg-gray-200"
      )}>
        {stage.completed && (
          <Icons.Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
        )}
      </div>
      
      <div className="ml-2">
        <h3 className={cn(
          "text-lg font-semibold",
          stage.completed ? "text-green-700" :
          stage.current ? "text-blue-700" : "text-gray-700"
        )}>
          {stage.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
        
        <div className="space-y-2">
          {stage.courses.map(course => (
            <div
              key={course.id}
              className={cn(
                "flex items-center gap-2 text-sm p-2 rounded-lg",
                course.completed ? "bg-green-50" : "bg-gray-50"
              )}
            >
              {course.completed ? (
                <Icons.CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Icons.Circle className="w-4 h-4 text-gray-400" />
              )}
              <span className={course.completed ? "text-green-700" : "text-gray-700"}>
                {course.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LearningPathProgress: React.FC = () => {
  // This would typically come from an API or context
  const learningPath: LearningPath = {
    id: '1',
    title: 'Dental Professional Development Path',
    description: 'Complete your journey to becoming an expert dental professional',
    progress: 45,
    stages: [
      {
        id: '1',
        title: 'Foundation Skills',
        description: 'Master the essential skills and knowledge',
        completed: true,
        current: false,
        courses: [
          { id: '1', title: 'HIPAA Compliance Basics', completed: true },
          { id: '2', title: 'Patient Care Fundamentals', completed: true },
          { id: '3', title: 'Dental Office Safety', completed: true }
        ]
      },
      {
        id: '2',
        title: 'Advanced Practice',
        description: 'Develop advanced clinical and patient care skills',
        completed: false,
        current: true,
        courses: [
          { id: '4', title: 'Advanced Patient Care', completed: true },
          { id: '5', title: 'Clinical Excellence', completed: false },
          { id: '6', title: 'Emergency Procedures', completed: false }
        ]
      },
      {
        id: '3',
        title: 'Leadership & Specialization',
        description: 'Become a leader in your field',
        completed: false,
        current: false,
        courses: [
          { id: '7', title: 'Team Leadership', completed: false },
          { id: '8', title: 'Specialized Procedures', completed: false },
          { id: '9', title: 'Practice Management', completed: false }
        ]
      }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{learningPath.title}</h2>
          <p className="text-sm text-gray-600">{learningPath.description}</p>
        </div>
        <Button variant="outline" size="small">
          <Icons.Settings className="w-4 h-4 mr-2" />
          Customize Path
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Overall Progress</span>
          <span className="font-medium">{learningPath.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${learningPath.progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {learningPath.stages.map(stage => (
          <PathStage key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
};
