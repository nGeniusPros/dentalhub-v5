import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { JoinChallengeModal } from '../../../../components/learning/JoinChallengeModal';
import { useNotifications } from '../../../../contexts/NotificationContext';

export const ChallengesSection = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const { dispatch: notifyDispatch } = useNotifications();

  const challenges = [
    {
      id: '1',
      title: 'Perfect Attendance',
      description: 'Complete all scheduled training sessions this month',
      progress: 75,
      points: 500,
      endDate: '2024-03-31',
      participants: 24,
      requirements: [
        'Must be an active staff member',
        'Complete all assigned training modules',
        'Attend all scheduled sessions'
      ]
    },
    {
      id: '2',
      title: 'Knowledge Champion',
      description: 'Score 90%+ on all compliance quizzes',
      progress: 60,
      points: 750,
      endDate: '2024-04-15',
      participants: 18,
      requirements: [
        'Complete all compliance quizzes',
        'Maintain 90% or higher score',
        'Submit all assignments on time'
      ]
    },
    {
      id: '3',
      title: 'Team Excellence',
      description: 'Complete team training modules together',
      progress: 40,
      points: 1000,
      endDate: '2024-04-30',
      participants: 32,
      requirements: [
        'Form a team of 2-5 members',
        'Complete all team modules',
        'Submit team project'
      ]
    }
  ];

  const handleJoinChallenge = (challengeId: string, teamMembers?: string[]) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: 'message',
        title: 'Challenge Joined',
        message: `You've successfully joined the ${challenge.title} challenge!`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'medium'
      }
    });

    if (teamMembers && teamMembers.length > 0) {
      notifyDispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: (Date.now() + 1).toString(),
          type: 'task',
          title: 'Team Members Added',
          message: `${teamMembers.length} team members have been added to your challenge.`,
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium'
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Active Challenges</h2>
          <p className="text-sm text-gray-500">Complete challenges to earn points and rewards</p>
        </div>
        <Button onClick={() => setSelectedChallenge(challenges[0])}>
          <Icons.Plus className="w-4 h-4 mr-2" />
          Join Challenge
        </Button>
      </div>

      <div className="space-y-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{challenge.participants}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{challenge.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icons.Award className="w-4 h-4 text-yellow-500" />
                    <span>{challenge.points} points</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icons.Calendar className="w-4 h-4 text-gray-400" />
                    <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedChallenge && (
        <JoinChallengeModal
          isOpen={true}
          onClose={() => setSelectedChallenge(null)}
          challenge={selectedChallenge}
          onJoin={handleJoinChallenge}
        />
      )}
    </motion.div>
  );
};