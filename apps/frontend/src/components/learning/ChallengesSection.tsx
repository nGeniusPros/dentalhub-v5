import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../common/Button';
import { Challenge } from '../../types/learning';
import { cn } from '../../lib/utils';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => {
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress = challenge.tasks 
    ? (challenge.tasks.filter(task => task.completed).length / challenge.tasks.length) * 100
    : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-sm p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
          <Icons.Trophy className="w-5 h-5" />
        </div>
        <div className="flex items-center text-sm text-orange-600 font-medium">
          <Icons.Clock className="w-4 h-4 mr-1" />
          {daysLeft} days left
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

      <div className="space-y-4">
        {challenge.tasks && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Icons.Users className="w-4 h-4" />
            {challenge.participants} participants
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Icons.Star className="w-4 h-4" />
            {challenge.points} points
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => onJoin(challenge.id)}
        >
          Join Challenge
        </Button>
      </div>
    </motion.div>
  );
};

export const ChallengesSection: React.FC = () => {
  // This would typically come from an API or context
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Patient Care Excellence',
      description: 'Complete all patient care training modules and achieve perfect scores in assessments.',
      points: 500,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 12,
      tasks: [
        { id: '1', title: 'Complete Patient Care Basics', points: 100, completed: true },
        { id: '2', title: 'Pass HIPAA Assessment', points: 150, completed: true },
        { id: '3', title: 'Complete Advanced Care Module', points: 250, completed: false }
      ]
    },
    {
      id: '2',
      title: 'Team Collaboration Sprint',
      description: 'Work together to improve team communication and efficiency metrics.',
      points: 300,
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      participants: 8,
      tasks: [
        { id: '1', title: 'Complete Team Building Workshop', points: 100, completed: false },
        { id: '2', title: 'Implement Daily Huddles', points: 100, completed: false },
        { id: '3', title: 'Achieve Communication Goals', points: 100, completed: false }
      ]
    }
  ];

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId);
    // Implement join challenge logic
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Challenges</h2>
        <Button variant="ghost">
          <Icons.Plus className="w-4 h-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onJoin={handleJoinChallenge}
          />
        ))}
      </div>
    </div>
  );
};
