```typescript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';

interface ConflictResolutionModuleProps {
  onComplete: (score: number) => void;
}

export const ConflictResolutionModule: React.FC<ConflictResolutionModuleProps> = ({
  onComplete
}) => {
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const { dispatch: notifyDispatch } = useNotifications();

  const cases = [
    {
      id: '1',
      title: 'Disagreement on Treatment Plan',
      description: 'Two team members have different opinions on a patient\'s treatment plan. How do you resolve this?',
      options: [
        {
          text: 'Schedule a team meeting to discuss both perspectives',
          feedback: 'Excellent! Promotes open dialogue and collaboration',
          points: 10,
          impact: 'positive'
        },
        {
          text: 'Let the senior team member make the decision',
          feedback: 'Consider the value of collaborative decision-making',
          points: 5,
          impact: 'neutral'
        },
        {
          text: 'Avoid the conflict and let them figure it out',
          feedback: 'Avoiding conflict can lead to bigger issues',
          points: 0,
          impact: 'negative'
        }
      ]
    },
    {
      id: '2',
      title: 'Communication Breakdown',
      description: 'A staff member feels their ideas are being ignored during team meetings. What's your approach?',
      options: [
        {
          text: 'Have a private discussion to understand their concerns',
          feedback: 'Great approach! Shows empathy and willingness to listen',
          points: 10,
          impact: 'positive'
        },
        {
          text: 'Suggest they speak up more during meetings',
          feedback: 'This puts the burden on them without addressing the root cause',
          points: 3,
          impact: 'neutral'
        },
        {
          text: 'Tell them to submit their ideas in writing instead',
          feedback: 'This might further isolate them from team discussions',
          points: 1,
          impact: 'negative'
        }
      ]
    },
    {
      id: '3',
      title: 'Schedule Conflict',
      description: 'Multiple team members request the same time off during a busy period. How do you handle this?',
      options: [
        {
          text: 'First come, first served basis',
          feedback: 'While fair, this might not be the best solution for team morale',
          points: 5,
          impact: 'neutral'
        },
        {
          text: 'Meet with all involved to find a compromise',
          feedback: 'Excellent! Promotes teamwork and fair resolution',
          points: 10,
          impact: 'positive'
        },
        {
          text: 'Deny all requests to avoid showing favoritism',
          feedback: 'This could negatively impact team morale and work-life balance',
          points: 0,
          impact: 'negative'
        }
      ]
    }
  ];

  const handleResponse = (points: number, feedback: string, impact: string) => {
    setScore(score + points);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Case Resolution',
        message: feedback,
        timestamp: new Date().toISOString(),
        read: false,
        priority: impact === 'negative' ? 'high' : 'medium'
      }
    });

    if (currentCase < cases.length - 1) {
      setCurrentCase(currentCase + 1);
    } else {
      onComplete(score);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Case */}
      <motion.div
        key={currentCase}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icons.Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{cases[currentCase].title}</h3>
            <p className="text-sm text-gray-500">Case {currentCase + 1} of {cases.length}</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{cases[currentCase].description}</p>

        <div className="space-y-3">
          {cases[currentCase].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleResponse(option.points, option.feedback, option.impact)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-gray-900">{option.text}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Case Progress</span>
          <span className="font-medium">{Math.round((currentCase / cases.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentCase / cases.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Award className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Current Score</span>
          </div>
          <span className="text-lg font-bold text-primary">{score}</span>
        </div>
      </div>
    </div>
  );
};
```